const OPENWEATHER_API_KEY = 'c31621e8271961f1c5b100dcb3ae1565';
const axios = require('axios');
const User = require('../models/userModel');
const Weather = require('../models/weatherModel');

const getWeatherData = async (req, res) => {
  try {

    const city = req.query.city || 'Astana';
    const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPENWEATHER_API_KEY}&units=metric`);
    const data = response.data;
    let weather;

    const existingWeather = await Weather.findOne({ city: city });
    if (existingWeather) {
      existingWeather.description = data.weather[0].description;
      existingWeather.temperature = data.main.temp;
      existingWeather.pressure = data.main.pressure;
      existingWeather.windSpeed = data.wind.speed;
      existingWeather.humidity = data.main.humidity;
      await existingWeather.save();
      weather = existingWeather;
    } else {
      weather = await Weather.create({
        city: city,
        description: data.weather[0].description,
        temperature: data.main.temp,
        longitude: data.coord.lon,
        latitiude: data.coord.lat,
        pressure: data.main.pressure,
        windSpeed: data.wind.speed,
        humidity: data.main.humidity,
        icon: data.weather[0].icon,
      });
    }

    const userId = req.session.user.id;
    const user = await User.findById(userId);

    try {
      await User.findByIdAndUpdate(userId, {
        $addToSet: { history: weather._id }
      });
    } catch (error) {
      console.error("Error updating user history:", error);
      return res.status(500).json({ error: 'Internal Server Error UPT' });
    } 

    var time = new Date();
    const formattedTime = `${time.getHours()}:${time.getMinutes()}`;
    res.render('main', { time: formattedTime, user: req.session.user, weatherData: data, city:city });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}


module.exports = { getWeatherData };