import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import RiverList from './components/RiverList';
import RiverDetail from './components/RiverDetail';

const theme = createTheme({
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
        <Routes>
          <Route path="/" element={<RiverList />} />
          <Route path="/river/:id" element={<RiverDetail />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
