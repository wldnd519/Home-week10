import axios from 'axios';

const form = document.querySelector('.form-data');
const locationInput = document.querySelector('.location-input');
const apiKeyInput = document.querySelector('.api-key');
const errors = document.querySelector('.errors');
const loading = document.querySelector('.loading');
const results = document.querySelector('.result-container');
const locationName = document.querySelector('.location-name');
const temperature = document.querySelector('.temperature');
const weatherDesc = document.querySelector('.weather-desc');
const clearBtn = document.querySelector('.clear-btn');

// 날씨 정보 표시 함수
const displayWeather = async (apiKey, location) => {
    try {
        loading.style.display = 'block';
        errors.textContent = '';
        results.style.display = 'none';

        const response = await axios.get('http://api.weatherstack.com/current', {
            params: {
                access_key: apiKey,
                query: location
            }
        });

        if (response.data.error) {
            throw new Error(response.data.error.info);
        }

        loading.style.display = 'none';
        locationName.textContent = response.data.location.name + ', ' + response.data.location.country;
        temperature.textContent = response.data.current.temperature + ' °C';
        weatherDesc.textContent = response.data.current.weather_descriptions[0];
        results.style.display = 'block';
        form.style.display = 'none';
        clearBtn.style.display = 'block';

        localStorage.setItem('weatherApiKey', apiKey);
        localStorage.setItem('weatherLocation', location);
    } catch (error) {
        console.log(error);
        loading.style.display = 'none';
        errors.textContent = 'Sorry, we have no data for the location you have requested.';
    }
};

function handleSubmit(e) {
    e.preventDefault();
    const apiKey = apiKeyInput.value;
    const location = locationInput.value;
    displayWeather(apiKey, location);
}

function init() {
    const storedApiKey = localStorage.getItem('weatherApiKey');
    const storedLocation = localStorage.getItem('weatherLocation');

    if (storedApiKey && storedLocation) {
        displayWeather(storedApiKey, storedLocation);
        form.style.display = 'none';
    } else {
        form.style.display = 'block';
        results.style.display = 'none';
        loading.style.display = 'none';
        clearBtn.style.display = 'none';
        errors.textContent = '';
    }
}

function reset(e) {
    e.preventDefault();
    localStorage.removeItem('weatherApiKey');
    localStorage.removeItem('weatherLocation');
    form.style.display = 'block';
    results.style.display = 'none';
    clearBtn.style.display = 'none';
    errors.textContent = '';
    locationInput.value = '';
    apiKeyInput.value = '';
}

form.addEventListener('submit', (e) => handleSubmit(e));
clearBtn.addEventListener('click', (e) => reset(e));

init();
