import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  List, 
  ListItem, 
  ListItemText, 
  Slider, 
  Typography,
  Box,
  CircularProgress
} from '@mui/material';
import { api } from '../services/api';
import { RIVER_DATA } from '../services/api';

function RiverList() {
  const [rivers, setRivers] = useState([]);
  const [radius, setRadius] = useState(400);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    initializeLocation();
  }, []);

  useEffect(() => {
    if (userLocation) {
      loadRivers();
    }
  }, [radius, userLocation]);

  const initializeLocation = async () => {
    try {
      const location = await api.getCurrentLocation();
      setUserLocation(location);
    } catch (error) {
      setError('Unable to get your location. Using default location.');
      setUserLocation({ lat: 45.5155, lon: -122.6789 }); // Portland, OR
    }
  };

  const loadRivers = async () => {
    try {
      setLoading(true);
      
      // Filter rivers by radius
      const nearbyRivers = RIVER_DATA.filter(river => {
        const distance = api.calculateDistance(
          userLocation.lat, 
          userLocation.lon, 
          river.lat, 
          river.lon
        );
        river.distance = Math.round(distance);
        return distance <= radius;
      });

      const riverConditions = await Promise.all(
        nearbyRivers.map(river => api.calculateRiverConditions(river))
      );

      setRivers(riverConditions.sort((a, b) => b.score - a.score));
    } catch (error) {
      setError('Error loading river data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Steelhead Fishing Conditions
      </Typography>
      
      {error && (
        <Typography color="error" gutterBottom>
          {error}
        </Typography>
      )}

      <Typography gutterBottom>
        Search Radius: {radius} miles
      </Typography>
      <Slider
        value={radius}
        onChange={(e, newValue) => setRadius(newValue)}
        min={50}
        max={1000}
        valueLabelDisplay="auto"
        sx={{ mb: 3 }}
      />

      <List>
        {rivers.map(river => (
          <ListItem 
            key={river.id} 
            button 
            onClick={() => navigate(`/river/${river.id}`)}
          >
            <ListItemText 
              primary={river.name}
              secondary={`Score: ${river.score} | Flow: ${river.flow} ${river.flowTrend} | ${river.distance} miles away`}
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

export default RiverList; 