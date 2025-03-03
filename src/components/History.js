import React from 'react';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
  Box,
  Divider
} from '@mui/material';

function History() {
  const projectHistory = [
    {
      id: 1,
      prompt: "Build an application called 'Anadromous' which provides a summary of the steelhead fishing conditions for rivers around the pacific northwest.",
      details: `The factors that matter are as follows, in order of impact:

1. Access: If regulations state the river is closed to angling, no other factors matter.

2. Anticipated Return Size: If known, the more fish that are anticipated to return to the river, the better. Use current data and information from official state fish and wildlife sources. Represent anticipated return size with the number of fish.

3. River Flow: River flow is better if it has been high recently but is a day or two into dropping. Represent river flow with feet. If feet is not available use cubic feet per second. Also indicate if the value is rising, staying level, or dropping from the previous day.

4. Temperatures from previous three days: Lower temperatures are better. Represent temperature in degrees Fahrenheit

5. Weather Conditions: Cloudy is better than sunny. Represent weather conditions with a short text description

6. Precipitation: Light precipitation is okay, heavy precipitation is bad. Represent precipitation in % probability

7. Wind: No wind is better than wind. Represent wind in knots per hour

8. Weekday: Tuesday Wednesday, and Thursday are better than Friday or Monday. Saturday and Sunday are the least desirable.

9. Distance from my current location: Closer is better than farther away. Represent distance in miles from current location.

The application loads a screen with a list of rivers sorted in order of estimated conditions quality from best to worst within a 400 mile radius. The user can choose to increase or decrease the radius distance.

If a user selects a specific location, a new screen displays all the condition data used to create the rating in prioritized order. It also displays a button to go back to the list of locations.`
    },
    {
      id: 2,
      prompt: "Add more rivers to the list. Include the major rivers on the olympic peninsula as well as the Cowlitz river, the Clearwater river in Idaho, and Klickitat river in Washington",
      details: "Expanded the river database to include more Pacific Northwest locations."
    },
    {
      id: 3,
      prompt: "If the river is not known to be open for fishing, display a message that it's not known with a link to website for the department of fish and wildlife for the state the river is in.",
      details: "Added state-specific fishing regulations and links to official resources."
    },
    {
      id: 4,
      prompt: "Change API key reference to use environment variable instead of hardcoding.",
      details: "Security improvement to handle API keys using environment variables."
    }
  ];

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Project Development History
      </Typography>
      
      <Typography variant="body1" paragraph>
        This page documents the evolution of the Anadromous application through user requirements and feature requests.
      </Typography>

      <List>
        {projectHistory.map((item, index) => (
          <React.Fragment key={item.id}>
            <Paper elevation={2} sx={{ mb: 2, p: 2 }}>
              <Box>
                <Typography variant="h6" color="primary" gutterBottom>
                  Request #{item.id}
                </Typography>
                
                <Typography variant="body1" sx={{ mb: 2, fontStyle: 'italic' }}>
                  "{item.prompt}"
                </Typography>
                
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ 
                    whiteSpace: 'pre-wrap',
                    fontFamily: item.id === 1 ? 'monospace' : 'inherit'
                  }}
                >
                  {item.details}
                </Typography>
              </Box>
            </Paper>
            {index < projectHistory.length - 1 && <Divider sx={{ my: 2 }} />}
          </React.Fragment>
        ))}
      </List>
    </Container>
  );
}

export default History; 