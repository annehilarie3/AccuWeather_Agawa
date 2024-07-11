document.addEventListener("DOMContentLoaded", function() {
    const apiKey = "qYAhl0n0rYsZw8Fj8sq80GLg3GB2Ubuk";
    const form = document.getElementById("cityForm");
    const weatherDiv = document.getElementById("weather");
    const hourlyDiv = document.getElementById("hourlyforecast");
    const dailyDiv = document.getElementById("dailyforecast");

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        const city = document.getElementById("cityInput").value;
        getWeather(city);
    });

    function getWeather(city) {
        const url = `https://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${city}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    const locationKey = data[0].Key;
                    fetchWeatherData(locationKey);
                    fetchHourlyForecast(locationKey);
                    fetchDailyForecast(locationKey);
                } else {
                    weatherDiv.innerHTML = `<p class="error-message">City not found.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching location data:", error);
                weatherDiv.innerHTML = `<p class="error-message">Error fetching location data.</p>`;
            });
    }

    function fetchWeatherData(locationKey) {
        const url = `https://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${apiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    displayWeather(data[0]);
                } else {
                    weatherDiv.innerHTML = `<p class="error-message">No weather data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching weather data:", error);
                weatherDiv.innerHTML = `<p class="error-message">Error fetching weather data.</p>`;
            });
    }

    function fetchHourlyForecast(locationKey) {
        const url = `https://dataservice.accuweather.com/forecasts/v1/hourly/1hour/${locationKey}?apikey=${apiKey}&details=true`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    displayHourlyForecast(data);
                } else {
                    hourlyDiv.innerHTML = `<p class="error-message">No hourly forecast data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching hourly forecast data:", error);
                hourlyDiv.innerHTML = `<p class="error-message">Error fetching hourly forecast data.</p>`;
            });
    }

    function fetchDailyForecast(locationKey) {
        const url = `https://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${apiKey}&details=true`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.DailyForecasts.length > 0) {
                    displayDailyForecast(data.DailyForecasts);
                } else {
                    dailyDiv.innerHTML = `<p class="error-message">No daily forecast data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching daily forecast data:", error);
                dailyDiv.innerHTML = `<p class="error-message">Error fetching daily forecast data.</p>`;
            });
    }

    function displayWeather(data) {
        const temperature = data.Temperature.Metric.Value;
        const weather = data.WeatherText;
        const iconNumber = data.WeatherIcon;
        const iconUrl = getWeatherIconUrl(iconNumber);
        const weatherContent = `
            <div class="weather-info">
                <h2>Current Weather</h2>
                <img src="${iconUrl}" alt="Weather Icon">
                <p><strong>Temperature:</strong> ${temperature}°C</p>
                <p><strong>Weather:</strong> ${weather}</p>
            </div>
        `;
        weatherDiv.innerHTML = weatherContent;
    }

    function displayHourlyForecast(data) {
        let forecastContent = '<div class="forecast-info"><h2>Hourly Forecast</h2>';
        data.forEach(hour => {
            const iconNumber = hour.WeatherIcon;
            const iconUrl = getWeatherIconUrl(iconNumber);
            forecastContent += `
                <div class="hourly-forecast">
                    <img src="${iconUrl}" alt="Weather Icon">
                    <p><strong>Time:</strong> ${new Date(hour.DateTime).toLocaleTimeString()}</p>
                    <p><strong>Temperature:</strong> ${hour.Temperature.Value}°C</p>
                    <p><strong>Weather:</strong> ${hour.IconPhrase}</p>
                </div>
            `;
        });
        forecastContent += '</div>';
        hourlyDiv.innerHTML = forecastContent;
    }
    

    function displayDailyForecast(data) {
        let forecastContent = '<div class="forecast-info"><h2>5 Days Forecast</h2>';
        data.forEach(day => {
            const iconNumber = day.Day.Icon;
            const iconUrl = getWeatherIconUrl(iconNumber);
            const dayOfWeek = new Date(day.Date).toLocaleDateString('en-US', { weekday: 'long' });
            forecastContent += `
                <div class="daily-forecast">
                    <img src="${iconUrl}" alt="Weather Icon">
                    <p><strong class="day-of-week">${dayOfWeek}</strong></p>
                    <p><strong>Date:</strong> ${new Date(day.Date).toLocaleDateString()}</p>
                    <p><strong>Temperature:</strong> ${day.Temperature.Minimum.Value}°C - ${day.Temperature.Maximum.Value}°C</p>
                    <p><strong>Weather:</strong> ${day.Day.IconPhrase}</p>
                </div>
            `;
        });
        forecastContent += '</div>';
        dailyDiv.innerHTML = forecastContent;
    }

    function getWeatherIconUrl(iconNumber) {
        return `https://developer.accuweather.com/sites/default/files/${iconNumber < 10 ? '0' : ''}${iconNumber}-s.png`;
    }
});
