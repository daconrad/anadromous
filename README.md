# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)


## Roadmap
* Include wind speed/direction as part of weather
* Include three-day forecast
* Add more rivers (Grand Ronde, Willamette, etc.)
* Sort control (sorty by rating, distance, temp/precipitation/etc.)

## Vibe Code...

Act as a JavaScript developer. Build  an application called “Anadromous” which provides a summary of the steelhead fishing conditions for rivers around the pacific northwest. 

For all weather-related data, use Openweather with the API Key: Sssshhhhhhh....

For all river-flow data, use USGS water data

The factors that matter are as follows, in order of impact:

Access: If regulations state the river is closed to angling, no other factors matter.

Anticipated Return Size: If known, the more fish that are anticipated to return to the river, the better. Use current data and information from official state fish and wildlife sources. Represent anticipated return size with the number of fish.

River Flow: River flow is better if it has been high recently but is a day or two into dropping. Represent river flow with feet. If feet is not available use cubic feet per second. Also indicate if the value is rising, staying level, or dropping from the previous day.

Temperatures from previous three days: Lower temperatures are better. Represent temperature in degrees Fahrenheit

Weather Conditions: Cloudy is better than sunny. Represent weather conditions with a short text description

Precipitation: Light precipitation is okay, heavy precipitation is bad. Represent precipitation in % probability

Wind: No wind is better than wind. Represent wind in knots per hour

Weekday: Tuesday Wednesday, and Thursday are better than Friday or Monday. Saturday and Sunday are the least desirable.

Distance from my current location: Closer is better than farther away. Represent distance in miles from current location.

After launching the application loads a screen with a list of rivers sorted in order of estimated conditions quality from best to worst within a 400 mile radius. The user can choose to increase or decrease the radius distance.

If a user selects a specific location, a new screen displays all the condition data used to create the rating in prioritized order. It also displays a button to go back to the list of locations.