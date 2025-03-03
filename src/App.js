import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import RiverList from './components/RiverList';
import RiverDetail from './components/RiverDetail';
import History from './components/History';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import '@fontsource/source-sans-pro';

const theme = createTheme({
  typography: {
    fontFamily: '"Source Sans Pro", sans-serif',
    h4: {
      fontFamily: '"Source Sans Pro", sans-serif',
      fontWeight: 600,
    },
    h6: {
      fontFamily: '"Source Sans Pro", sans-serif',
      fontWeight: 600,
    },
    body1: {
      fontFamily: '"Source Sans Pro", sans-serif',
    },
    body2: {
      fontFamily: '"Source Sans Pro", sans-serif',
    },
  },
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#2196f3',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Anadromous
            </Typography>
            <Box>
              <Button 
                color="inherit" 
                component={RouterLink} 
                to="/"
              >
                Rivers
              </Button>
              <Button 
                color="inherit" 
                component={RouterLink} 
                to="/history"
              >
                History
              </Button>
            </Box>
          </Toolbar>
        </AppBar>

        <Box sx={{ pt: 2 }}>
          <Routes>
            <Route path="/" element={<RiverList />} />
            <Route path="/river/:id" element={<RiverDetail />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
