import axios from 'axios';

const OPENWEATHER_API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;

export const api = {
  async getWeatherData(lat, lon) {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=imperial`
      );
      return response.data;
    } catch (error) {
      console.error('Weather API Error:', error.response || error);
      throw new Error('Failed to fetch weather data');
    }
  },

  async getRiverFlow(siteId) {
    try {
      const response = await axios.get(
        `https://waterservices.usgs.gov/nwis/iv/?format=json&sites=${siteId}&parameterCd=00065&period=P1D`
      );
      
      // Check if we have valid data
      if (!response.data?.value?.timeSeries?.[0]?.values?.[0]?.value) {
        throw new Error('No gauge height data available for this site');
      }

      const values = response.data.value.timeSeries[0].values[0].value;
      const current = values[0];
      // Find value closest to 24 hours ago
      const historical = values.find(v => {
        const timeDiff = Math.abs(
          new Date(current.dateTime) - new Date(v.dateTime)
        );
        return timeDiff >= 23 * 60 * 60 * 1000 && timeDiff <= 25 * 60 * 60 * 1000;
      }) || values[values.length - 1];
      
      return {
        value: {
          timeSeries: [{
            values: [{
              value: [current, historical]
            }]
          }]
        }
      };
    } catch (error) {
      console.error('USGS API Error:', error.response || error);
      // Return a default structure to prevent crashes
      return {
        value: {
          timeSeries: [{
            values: [{
              value: [
                { value: 'N/A', dateTime: new Date().toISOString() },
                { value: 'N/A', dateTime: new Date().toISOString() }
              ]
            }]
          }]
        }
      };
    }
  },

  async getCoordinatesFromZip(zipCode) {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/geo/1.0/zip?zip=${zipCode},US&appid=${OPENWEATHER_API_KEY}`
      );
      return {
        lat: response.data.lat,
        lon: response.data.lon
      };
    } catch (error) {
      console.error('Error getting coordinates from zip:', error);
      throw new Error('Invalid ZIP code');
    }
  },

  async calculateRiverConditions(river) {
    try {
      const [weather, flow] = await Promise.all([
        this.getWeatherData(river.lat, river.lon),
        this.getRiverFlow(river.usgsId)
      ]);

      const currentGauge = flow?.value?.timeSeries?.[0]?.values?.[0]?.value?.[0]?.value;
      const historicalGauge = flow?.value?.timeSeries?.[0]?.values?.[0]?.value?.[1]?.value;

      return {
        ...river,
        weather: weather.list[0],
        gauge: currentGauge,
        historicalGauge: historicalGauge,
        gaugeTrend: this.calculateFlowTrend(flow),
        score: this.calculateScore(river, weather, flow)
      };
    } catch (error) {
      console.error('Error calculating conditions for river:', river.name, error);
      return {
        ...river,
        weather: {
          main: { temp: 0 },
          weather: [{ description: 'No data available' }],
          wind: { speed: 0 },
          pop: 0
        },
        gauge: 'N/A',
        historicalGauge: 'N/A',
        gaugeTrend: 'unknown',
        score: 0
      };
    }
  },

  calculateFlowTrend(flowData) {
    try {
      // Check if we have valid flow data
      if (!flowData?.value?.timeSeries?.[0]?.values?.[0]?.value) {
        return 'unknown';
      }

      const current = parseFloat(flowData.value.timeSeries[0].values[0].value[0].value);
      const previous = parseFloat(flowData.value.timeSeries[0].values[0].value[1]?.value);
      
      // Check if we have valid numbers to compare
      if (isNaN(current) || isNaN(previous)) {
        return 'unknown';
      }

      if (current > previous) return 'rising';
      if (current < previous) return 'dropping';
      return 'stable';
    } catch (error) {
      console.error('Error calculating flow trend:', error);
      return 'unknown';
    }
  },

  calculateScore(river, weather, flow) {
    try {
      let score = 0;
      
      // Access check
      if (river.isOpen === false) return -1;

      // Return size
      score += river.anticipatedReturn / 1000;

      // Flow conditions
      if (flow?.value?.timeSeries?.[0]?.values?.[0]?.value?.[0]?.value) {
        if (this.calculateFlowTrend(flow) === 'dropping') score += 10;
        if (this.calculateFlowTrend(flow) === 'stable') score += 5;
      }

      // Weather conditions
      if (weather?.list?.[0]?.weather?.[0]?.main) {
        const conditions = weather.list[0].weather[0].main.toLowerCase();
        if (conditions.includes('cloud')) score += 8;
        if (conditions.includes('rain')) score += 5;
      }

      // Day of week
      const day = new Date().getDay();
      if ([2,3,4].includes(day)) score += 10;
      if ([1,5].includes(day)) score += 5;

      return Math.round(score);
    } catch (error) {
      console.error('Error calculating score:', error);
      return 0;
    }
  },

  async getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        position => {
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        error => {
          reject(error);
        }
      );
    });
  },

  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 3963; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  },

  getUSGSUrl(siteId) {
    return `https://waterdata.usgs.gov/monitoring-location/${siteId}/`;
  }
};

export const RIVER_DATA = [
  {
    id: 1,
    name: "Deschutes River",
    lat: 45.6387,
    lon: -121.1865,
    usgsId: "14103000",
    isOpen: true,
    anticipatedReturn: 8000
  },
  {
    id: 2,
    name: "Columbia River",
    lat: 45.6075,
    lon: -121.1786,
    usgsId: "14105700",
    isOpen: true,
    anticipatedReturn: 12000
  },
  {
    id: 3,
    name: "Willamette River",
    lat: 45.6528,
    lon: -122.7645,
    usgsId: "14211720",
    isOpen: true,
    anticipatedReturn: 6000
  },
  {
    id: 4,
    name: "Clackamas River",
    lat: 45.3735,
    lon: -122.6067,
    usgsId: "14211010",
    isOpen: true,
    anticipatedReturn: 4500
  },
  {
    id: 5,
    name: "Sandy River",
    lat: 45.5479,
    lon: -122.3786,
    usgsId: "14142500",
    isOpen: true,
    anticipatedReturn: 3500
  },
  {
    id: 6,
    name: "Cowlitz River",
    lat: 46.2673,
    lon: -122.9165,
    usgsId: "14243000",
    isOpen: true,
    anticipatedReturn: 7500
  },
  {
    id: 7,
    name: "Clearwater River",
    lat: 46.4275,
    lon: -116.8312,
    usgsId: "13341050",
    isOpen: true,
    anticipatedReturn: 15000
  },
  {
    id: 8,
    name: "Klickitat River",
    lat: 45.6973,
    lon: -121.2929,
    usgsId: "14113000",
    isOpen: true,
    anticipatedReturn: 3000
  },
  {
    id: 9,
    name: "Hoh River",
    lat: 47.8582,
    lon: -124.2510,
    usgsId: "12041200",
    isOpen: true,
    anticipatedReturn: 5000
  },
  {
    id: 10,
    name: "Quillayute River",
    lat: 47.9134,
    lon: -124.6327,
    usgsId: "12043300",
    isOpen: true,
    anticipatedReturn: 4500
  },
  {
    id: 11,
    name: "Sol Duc River",
    lat: 48.0154,
    lon: -124.0179,
    usgsId: "12041500",
    isOpen: true,
    anticipatedReturn: 3800
  },
  {
    id: 12,
    name: "Bogachiel River",
    lat: 47.9034,
    lon: -124.3855,
    usgsId: "12043000",
    isOpen: true,
    anticipatedReturn: 3200
  },
  {
    id: 13,
    name: "Calawah River",
    lat: 47.9700,
    lon: -124.3960,
    usgsId: "12043100",
    isOpen: true,
    anticipatedReturn: 2800
  },
  {
    id: 14,
    name: "Quinault River",
    lat: 47.4581,
    lon: -123.8893,
    usgsId: "12039500",
    isOpen: true,
    anticipatedReturn: 4200
  },
  {
    id: 15,
    name: "Elwha River",
    lat: 48.1178,
    lon: -123.5569,
    usgsId: "12045500",
    isOpen: true,
    anticipatedReturn: 3500
  },
  {
    id: 16,
    name: "Skagit River",
    lat: 48.4879,
    lon: -122.2429,
    usgsId: "12200500",
    isOpen: true,
    anticipatedReturn: 8500
  },
  {
    id: 17,
    name: "Sauk River",
    lat: 48.2826,
    lon: -121.5571,
    usgsId: "12189500",
    isOpen: true,
    anticipatedReturn: 4200
  },
  {
    id: 18,
    name: "North Umpqua River",
    lat: 43.3168,
    lon: -123.0678,
    usgsId: "14319500",
    isOpen: true,
    anticipatedReturn: 5500
  },
  {
    id: 19,
    name: "Skykomish River",
    lat: 47.8168,
    lon: -121.9677,
    usgsId: "12134500",
    isOpen: true,
    anticipatedReturn: 6000
  }
]; 