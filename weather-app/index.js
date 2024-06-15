require('dotenv').config();
const http = require('http');
const config = require('./config');

const apiKey = config.WEATHERSTACK_API_KEY;
const city = process.argv[2] || 'Moscow';

if (!apiKey) {
  console.error('API key is missing! Please set it in the .env file or in config.js');
  process.exit(1);
}

const url = `http://api.weatherstack.com/current?access_key=${apiKey}&query=${city}`;

http.get(url, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    if (res.statusCode === 200) {
      try {
        const weatherData = JSON.parse(data);
        if (weatherData.error) {
          console.error('Error:', weatherData.error.info);
        } else {
          console.log(`Current temperature in ${city} is ${weatherData.current.temperature}°C`);
        }
      } catch (error) {
        console.error('Error parsing JSON:', error.message);
      }
    } else {
      console.error('Failed to fetch data from API. Status code:', res.statusCode);
    }
  });
}).on('error', (error) => {
  console.error('Error with the request:', error.message);
});
