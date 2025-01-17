import React, { useEffect, useState } from "react";
import "../Components/Weather.css";
import search_icon from "../assets/search.png";
import clear_icon from "../assets/clear.png";
import cloud_icon from "../assets/cloud.png";
import drizzle_icon from "../assets/drizzle.png";
import humidity_icon from "../assets/humidity.png";
import rain_icon from "../assets/rain.png";
import snow_icon from "../assets/snow.png";
import wind_icon from "../assets/wind.png";

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState(""); // To store the input city name
  const [error, setError] = useState(null); // For error messages

  const allIcon = {
    "01d": clear_icon,
    "01n": clear_icon,
    "02d": cloud_icon,
    "02n": cloud_icon,
    "03d": cloud_icon,
    "03n": cloud_icon,
    "04d": drizzle_icon,
    "04n": drizzle_icon,
    "09d": rain_icon,
    "09n": rain_icon,
    "10d": rain_icon,
    "10n": rain_icon,
    "13d": snow_icon,
    "13n": snow_icon,
  };

  const fetchWeather = async (cityName) => {
    if (!cityName) {
      setError("Please enter a city name.");
      return;
    }

    try {
      setError(null); // Clear any previous errors
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=02997956149cd5fc2cfb981b380f1fba`
      ;
      const response = await fetch(url);

      if (!response.ok) throw new Error("City not found");

      const data = await response.json();
      const icon = allIcon[data.weather?.[0]?.icon] || clear_icon;

      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temperature: Math.floor(data.main.temp),
        location: data.name,
        icon: icon,
      });
    } catch (error) {
      console.error("Error fetching weather data:", error.message);
      setError("City not found or invalid API key.");
      setWeatherData(null); // Reset state if there's an error
    }
  };

  useEffect(() => {
    fetchWeather("kottayam"); // Fetch weather for default city on load
  }, []);

  const handleSearch = () => {
    fetchWeather(city.trim()); // Trim to remove extra spaces
  };

  return (
    <div className="weather">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <img
          src={search_icon}
          alt="Search"
          onClick={handleSearch}
          style={{ cursor: "pointer" }}
        />
      </div>

      {error ? (
        <p style={{ textAlign: "center", marginTop: "20px", color: "red" }}>
          {error}
        </p>
      ) : weatherData ? (
        <>
          <img src={weatherData.icon} alt="Weather Icon" className="weather-icon" />
          <p className="temperature">{weatherData.temperature}°C</p>
          <p className="location">{weatherData.location}</p>
          <div className="weather-data">
            <div className="col">
              <img src={humidity_icon} alt="Humidity Icon" />
              <div>
                <p>{weatherData.humidity}%</p>
                <span>Humidity</span>
              </div>
            </div>
            <div className="col">
              <img src={wind_icon} alt="Wind Icon" />
              <div>
                <p>{weatherData.windSpeed} m/s</p>
                <span>Wind Speed</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <p style={{ textAlign: "center", marginTop: "20px" }}>
          Enter a city to get the weather details.
        </p>
      )}
    </div>
  );
};

export default Weather;
