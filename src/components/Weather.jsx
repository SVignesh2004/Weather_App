import React, { useEffect, useState } from 'react';
import './Weather.css';
import search_icon from '../assets/search.png';
import clear_icon from '../assets/clear.png';
import cloud_icon from '../assets/cloud.png';
import rain_icon from '../assets/rain.png';
import snow_icon from '../assets/snow.png';
import drizzle_icon from '../assets/drizzle.png';
import humidity_icon from '../assets/humidity.png';
import wind_icon from '../assets/wind.png';

const Weather = () => {
    const [city, setCity] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [error, setError] = useState(''); // To handle error messages

    const search = async (city) => {
        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${import.meta.env.VITE_APP_ID}&units=metric`;
            const response = await fetch(url);
            const data = await response.json();

            if (response.ok) {
                setWeatherData(data);
                setError(''); // Clear any previous errors if search is successful
            } else if (data.cod === '404') {
                // City not found
                setError('Enter a valid city name');
                setWeatherData(null); // Clear previous weather data
            }
        } catch (error) {
            console.log(error);
            setError('An error occurred while fetching the data.');
        }
    };

    const handleSearch = () => {
        if (!city.trim()) {
            // If the city input is empty or contains only whitespace
            setError('Enter the city');
            setWeatherData(null); // Clear any previous data
        } else {
            search(city);
        }
    };

    useEffect(() => {
        search('London'); // Default city
    }, []);

    const getWeatherIcon = (weatherMain) => {
        switch (weatherMain) {
            case 'Clear':
                return clear_icon;
            case 'Clouds':
                return cloud_icon;
            case 'Rain':
                return rain_icon;
            case 'Drizzle':
                return drizzle_icon;
            case 'Snow':
                return snow_icon;
            default:
                return clear_icon;
        }
    };

    return (
        <div className='weather'>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder='Search'
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />
                <img
                    src={search_icon}
                    alt="search"
                    onClick={handleSearch}
                    
                />
            </div>

            {/* Display error message if city is not entered or invalid */}
            {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}

            {weatherData && weatherData.main && (
                <>
                    <img
                        className='weather-icon'
                        src={getWeatherIcon(weatherData.weather[0].main)} 
                        alt={weatherData.weather[0].description} 
                    />
                    <p className='temperature'>{weatherData.main.temp}°C</p>
                    <p className='location'>{weatherData.name}</p>
                    <div className='weather-data'>
                        <div className='col'>
                            <img src={humidity_icon} alt="humidity" />
                            <div>
                                <p>{weatherData.main.humidity}%</p>
                                <span>Humidity</span>
                            </div>
                        </div>
                        <div className='col'>
                            <img src={wind_icon} alt="wind" />
                            <div>
                                <p>{weatherData.wind.speed} Km/h</p>
                                <span>Wind Speed</span>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {!weatherData && !error && <p>Loading...</p>}
        </div>
    );
};

export default Weather;
