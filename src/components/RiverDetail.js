import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Box,
  IconButton,
  Alert,
  Link
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RefreshIcon from '@mui/icons-material/Refresh';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { api, RIVER_DATA } from '../services/api';

function RiverDetail() {
  const [riverData, setRiverData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    loadRiverDetail();
  }, [id]);

  const loadRiverDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const baseRiver = RIVER_DATA.find(r => r.id === parseInt(id));
      if (!baseRiver) {
        throw new Error('River not found');
      }

      const conditions = await api.calculateRiverConditions(baseRiver);
      setRiverData(conditions);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading river details:', error);
      setError(error.message || 'Error loading river details');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadRiverDetail();
  };

  const formatLastUpdated = () => {
    if (!lastUpdated) return '';
    return lastUpdated.toLocaleTimeString();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/')}
          sx={{ my: 2 }}
        >
          Back to List
        </Button>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!riverData) {
    return (
      <Container>
        <Typography variant="h6">River not found</Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')}>
          Back to List
        </Button>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', my: 2 }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/')}
        >
          Back to List
        </Button>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="caption" sx={{ mr: 1 }}>
            Last updated: {formatLastUpdated()}
          </Typography>
          <IconButton onClick={handleRefresh} disabled={loading}>
            <RefreshIcon />
          </IconButton>
        </Box>
      </Box>

      <Typography variant="h4" gutterBottom>
        {riverData.name}
      </Typography>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" color="primary" gutterBottom>
            Current Status
          </Typography>
          {riverData.isOpen === true && (
            <Typography variant="body1" color="success.main">
              Open for Fishing
            </Typography>
          )}
          {riverData.isOpen === false && (
            <Typography variant="body1" color="error.main">
              Closed to Angling
            </Typography>
          )}
          {riverData.isOpen === null && (
            <Box>
              <Typography variant="body1" color="warning.main" gutterBottom>
                Current status unknown
              </Typography>
              <Link 
                href={riverData.fishingInfoUrl}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
              >
                Check {riverData.state} Fish & Wildlife website
                <OpenInNewIcon sx={{ fontSize: 16 }} />
              </Link>
            </Box>
          )}
        </CardContent>
      </Card>

      <List>
        <ListItem>
          <ListItemText 
            primary="Anticipated Return"
            secondary={`${riverData.anticipatedReturn.toLocaleString()} fish`}
          />
        </ListItem>

        <ListItem>
          <ListItemText 
            primary="River Flow"
            secondary={
              riverData.flow === 'N/A' 
                ? 'Data not available'
                : `${riverData.flow} ft³/s (${riverData.flowTrend})`
            }
          />
        </ListItem>

        <ListItem>
          <ListItemText 
            primary="Current Temperature"
            secondary={`${Math.round(riverData.weather.main.temp)}°F`}
          />
        </ListItem>

        <ListItem>
          <ListItemText 
            primary="Weather Conditions"
            secondary={riverData.weather.weather[0].description}
          />
        </ListItem>

        <ListItem>
          <ListItemText 
            primary="Precipitation Chance"
            secondary={`${Math.round(riverData.weather.pop * 100)}%`}
          />
        </ListItem>

        <ListItem>
          <ListItemText 
            primary="Wind"
            secondary={`${Math.round(riverData.weather.wind.speed)} knots`}
          />
        </ListItem>

        <ListItem>
          <ListItemText 
            primary="Distance"
            secondary={`${riverData.distance} miles away`}
          />
        </ListItem>

        <ListItem>
          <ListItemText 
            primary="Overall Score"
            secondary={riverData.score}
          />
        </ListItem>
      </List>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Container>
  );
}

export default RiverDetail; 