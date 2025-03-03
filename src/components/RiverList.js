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
  TextField,
  Button,
  Alert,
  Paper,
  CircularProgress,
  Link
} from '@mui/material';
import { api } from '../services/api';
import { RIVER_DATA } from '../services/api';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import LaunchIcon from '@mui/icons-material/Launch';

function RiverList() {
  const [rivers, setRivers] = useState([]);
  const [radius, setRadius] = useState(400);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [error, setError] = useState(null);
  const [zipCode, setZipCode] = useState('');
  const [zipError, setZipError] = useState('');
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
      setError('Unable to get your location. Please enter a ZIP code.');
      setUserLocation({ lat: 45.5155, lon: -122.6789 }); // Portland, OR as default
    }
  };

  const handleZipSubmit = async (e) => {
    e.preventDefault();
    setZipError('');
    
    if (!zipCode.match(/^\d{5}$/)) {
      setZipError('Please enter a valid 5-digit ZIP code');
      return;
    }

    try {
      setLoading(true);
      const newLocation = await api.getCoordinatesFromZip(zipCode);
      setUserLocation(newLocation);
      setError(null);
    } catch (error) {
      setZipError(error.message);
    } finally {
      setLoading(false);
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

  const getFlowTrendDisplay = (trend) => {
    switch (trend) {
      case 'rising':
        return (
          <Box component="span" sx={{ 
            display: 'inline-flex', 
            alignItems: 'center',
            color: 'warning.main',
            fontWeight: 'bold'
          }}>
            Rising <TrendingUpIcon sx={{ ml: 0.5 }} />
          </Box>
        );
      case 'dropping':
        return (
          <Box component="span" sx={{ 
            display: 'inline-flex', 
            alignItems: 'center',
            color: 'success.main',
            fontWeight: 'bold'
          }}>
            Dropping <TrendingDownIcon sx={{ ml: 0.5 }} />
          </Box>
        );
      case 'stable':
        return (
          <Box component="span" sx={{ 
            display: 'inline-flex', 
            alignItems: 'center',
            color: 'info.main',
            fontWeight: 'bold'
          }}>
            Stable <TrendingFlatIcon sx={{ ml: 0.5 }} />
          </Box>
        );
      default:
        return 'Unknown';
    }
  };

  const getGaugeDisplay = (current, historical) => {
    if (current === 'N/A' || historical === 'N/A') {
      return 'N/A';
    }
    return (
      <Box component="span">
        {parseFloat(current).toFixed(2)} ft
        <Typography 
          component="span" 
          color="text.secondary" 
          sx={{ ml: 1, fontSize: '0.9em' }}
        >
          (24h ago: {parseFloat(historical).toFixed(2)} ft)
        </Typography>
      </Box>
    );
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
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box component="form" onSubmit={handleZipSubmit} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
          <TextField
            label="ZIP Code"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            error={!!zipError}
            helperText={zipError}
            size="small"
            sx={{ width: 120 }}
          />
          <Button 
            variant="contained" 
            type="submit"
            sx={{ mt: 0.5 }}
          >
            Update Location
          </Button>
        </Box>

        {error && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Paper>

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
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.04)',
              },
              mb: 1,
            }}
          >
            <ListItemText 
              primary={
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontSize: '1.3rem',
                    fontWeight: 600,
                    color: 'primary.main'
                  }}
                >
                  {river.name}
                </Typography>
              }
              secondary={
                <Box sx={{ mt: 0.5 }}>
                  <Typography variant="body2">
                    Score: {river.score} | Gauge: {getGaugeDisplay(river.gauge, river.historicalGauge)} {getFlowTrendDisplay(river.gaugeTrend)}
                    <Link 
                      href={api.getUSGSUrl(river.usgsId)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      sx={{ 
                        ml: 1,
                        display: 'inline-flex',
                        alignItems: 'center',
                        fontSize: 'inherit'
                      }}
                    >
                      USGS Data <LaunchIcon sx={{ ml: 0.5, fontSize: '0.9rem' }} />
                    </Link>
                    {' '}| {river.distance} miles
                  </Typography>
                </Box>
              }
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

export default RiverList; 