// Define your default city
const defaultCity = 'Delhi'; // You can set this to any default city you prefer

let cityInput = document.getElementById('city_input'),
    searchBtn = document.getElementById('searchBtn'),
    api_key = '9c97c1d95341f6cb18f239e94d2198e9',
    locationBtn = document.getElementById('locationBtn'),
    currentWeatherCard = document.querySelectorAll('.weather-left .card')[0],
    fiveDaysForecastCard = document.querySelector('.day-forecast'),
    aqiCard = document.querySelectorAll('.highlights .card')[0],
    sunriseCard = document.querySelectorAll('.highlights .card')[1],
    humidityval = document.getElementById('humidityval'),
    pressureval = document.getElementById('pressureval'),
    Visibilityval = document.getElementById('Visibilityval'),
    windspeedval = document.getElementById('windspeedval'),
    feelsval = document.getElementById('feelsval'),
    hourlyForecastCard = document.querySelector('.hourly-forecast'),
    aqiList = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor']; 

// Function to fetch and display weather details
function getWeatherDetails(name, lat, lon, country, state){
    let FORECAST_API_URL  = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`,
        WEATHER_API_URL  = `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${api_key}&units=metric`,
        AIR_POLLUTION_API_URL  = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${api_key}`,
        days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Fetch air quality data
    fetch(AIR_POLLUTION_API_URL)
        .then(res => res.json())
        .then(data => {
            let {co, no, no2, o3, so2, pm2_5, pm10, nh3} = data.list[0].components;
            aqiCard.innerHTML = `
                <div class="card-head">
                    <p>Air Quality Index</p>
                    <p class="air-index aqi-${data.list[0].main.aqi}">${aqiList[data.list[0].main.aqi - 1]}</p>
                </div>
                <div class="air-indices">
                    <i class="fa-solid fa-wind"></i>
                    <div class="item">
                        <p>PM2.5</p>
                        <h2>${pm2_5}</h2>
                    </div>
                    <div class="item">
                        <p>PM10</p>
                        <h2>${pm10}</h2>
                    </div>
                    <div class="item">
                        <p>SO2</p>
                        <h2>${so2}</h2>
                    </div>
                    <div class="item">
                        <p>CO</p>
                        <h2>${co}</h2>
                    </div>
                    <div class="item">
                        <p>NO</p>
                        <h2>${no}</h2>
                    </div>
                    <div class="item">
                        <p>NO2</p>
                        <h2>${no2}</h2>
                    </div>
                    <div class="item">
                        <p>NH3</p>
                        <h2>${nh3}</h2>
                    </div>
                    <div class="item">
                        <p>O3</p>
                        <h2>${o3}</h2>
                    </div>
                </div>
            `;
        })
        .catch(() => alert('Failed to fetch air quality index'));

    // Fetch current weather data
    fetch(WEATHER_API_URL)
        .then(res => res.json())
        .then(data => {
            let date = new Date();
            currentWeatherCard.innerHTML = `
                <div class="details">
                    <p>Now</p>
                    <h2>${data.main.temp}&deg;C</h2>
                    <p>${data.weather[0].description}</p>
                </div>
                <div class="weather-icon">
                    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png">
                </div>
                <div class="card-footer">
                    <p><i class="fa-regular fa-calendar"></i> ${days[date.getDay()]}, ${date.getDate()}, ${months[date.getMonth()]}, ${date.getFullYear()}</p>
                    <p><i class="fa-solid fa-location-dot"></i> ${name}, ${country}</p>
                </div>
            `;
            let {sunrise, sunset} = data.sys,
                {timezone} = data,
                {humidity, pressure, feels_like} = data.main,
                {speed} = data.wind,
                sRiseTime = moment.utc(sunrise, 'X').add(timezone, 'seconds').format('hh:mm:A'),
                sSetTime = moment.utc(sunset, 'X').add(timezone, 'seconds').format('hh:mm:A');
            sunriseCard.innerHTML = `
                <div class="card">
                    <p>Sunrise & Sunset</p>
                    <div class="sunrise-sunset">
                        <div class="item">
                            <div class="icon">
                                <i class="fa-solid fa-sun"></i>
                            </div>
                            <div>
                                <p>Sunrise</p>
                                <h2>${sRiseTime}</h2>
                            </div>
                        </div>
                        <div class="item">
                            <div class="icon">
                                <i class="fa-regular fa-sun"></i>
                            </div>
                            <div>
                                <p>Sunset</p>
                                <h2>${sSetTime}</h2>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            humidityval.innerHTML = `${humidity}%`;
            pressureval.innerHTML = `${pressure} hPa`;
            Visibilityval.innerHTML = `${data.visibility / 1000} km`;
            windspeedval.innerHTML = `${speed} m/s`;
            feelsval.innerHTML = `${data.main.feels_like}&deg;C`;
        })
        .catch(() => alert('Failed to fetch current weather'));

    // Fetch 5-day forecast data
    fetch(FORECAST_API_URL)
        .then(res => res.json())
        .then(data => {
            let hourlyForecast = data.list;
            hourlyForecastCard.innerHTML = '';
            for (let i = 0; i <= 7; i++) {
                let hrForecastDate = new Date(hourlyForecast[i].dt_txt);
                let hr = hrForecastDate.getHours();
                let a = 'PM';
                if (hr < 12) a = 'AM';
                if (hr === 0) hr = 12;
                if (hr > 12) hr -= 12;
                hourlyForecastCard.innerHTML += `
                    <div class="card" style="width:80px;">
                        <p>${hr} ${a}</p>
                        <img src="https://openweathermap.org/img/wn/${hourlyForecast[i].weather[0].icon}.png" height="60px" width="60px">
                        <p>${(hourlyForecast[i].main.temp).toFixed(2)}&deg;C</p>
                    </div>
                `;
            }
            let uniqueForecastDays = [];
            let fiveDaysForecast = hourlyForecast.filter(forecast => {
                let forecastDate = new Date(forecast.dt_txt).getDate();
                if (!uniqueForecastDays.includes(forecastDate)) {
                    return uniqueForecastDays.push(forecastDate);
                }
            });
            fiveDaysForecastCard.innerHTML = '';
            for (let i = 1; i < fiveDaysForecast.length; i++) {
                let date = new Date(fiveDaysForecast[i].dt_txt);
                fiveDaysForecastCard.innerHTML += `
                    <div class="forecast-item">
                        <div class="icon-wrapper">
                            <img src="https://openweathermap.org/img/wn/${fiveDaysForecast[i].weather[0].icon}.png" height="60px" width="60px">
                            <span>${(fiveDaysForecast[i].main.temp).toFixed(2)}&deg;C</span>
                            <span>${date.getDate()} ${months[date.getMonth()]}</span>
                            <span>${days[date.getDay()]}</span>
                        </div>
                    </div>
                `;
            }
        })
        .catch(() => alert('Failed to fetch forecast data'));
}

// Function to fetch city coordinates
function getCityCoordinates(cityName){
    let GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${api_key}`;
    fetch(GEOCODING_API_URL)
        .then(res => res.json())
        .then(data => {
            let {name, lat, lon, country, state} = data[0];
            getWeatherDetails(name, lat, lon, country, state);
        })
        .catch(() => alert(`Failed to fetch coordinates of ${cityName}`));
}

// Function to fetch user coordinates
function getUserCoordinates(){
    navigator.geolocation.getCurrentPosition(position => {
        let {latitude, longitude} = position.coords;
        let REVERSE_GEOCODING_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${api_key}`;
        fetch(REVERSE_GEOCODING_URL)
            .then(res => res.json())
            .then(data => {
                let {name, country, state} = data[0];
                getWeatherDetails(name, latitude, longitude, country, state);
            })
            .catch(() => alert('Failed to fetch user coordinates'));
    }, error => {
        if (error.code === error.PERMISSION_DENIED) {
            alert('Geolocation permission denied. Please reset location permission to grant access again');
        }
    });
}

// Event listeners
searchBtn.addEventListener('click', () => {
    let cityName = cityInput.value.trim();
    cityInput.value = '';
    if (cityName) getCityCoordinates(cityName);
});
locationBtn.addEventListener('click', getUserCoordinates);
cityInput.addEventListener('keyup', e => {
    if (e.key === 'Enter') {
        let cityName = cityInput.value.trim();
        cityInput.value = '';
        if (cityName) getCityCoordinates(cityName);
    }
});

// Set default city data on page load
window.addEventListener('load', () => getCityCoordinates(defaultCity));
