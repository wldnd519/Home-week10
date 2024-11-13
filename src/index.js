import axios from 'axios';

// form fields
const form = document.querySelector('.form-data');
const region1 = document.querySelector('#region1');
const region2 = document.querySelector('#region2');
const region3 = document.querySelector('#region3');
const apiKey = document.querySelector('.api-key');
// results
const errors = document.querySelector('.errors');
const loading = document.querySelector('.loading');
const clearBtn = document.querySelector('.clear-btn');

const calculateColor = async (value) => {
  let co2Scale = [0, 150, 600, 750, 800];
  let colors = ['#2AA364', '#F5EB4D', '#9E4229', '#381D02', '#381D02'];
  let closestNum = co2Scale.sort((a, b) => Math.abs(a - value) - Math.abs(b - value))[0];
  let num = (element) => element > closestNum;
  let scaleIndex = co2Scale.findIndex(num);
  let closestColor = colors[scaleIndex];
  chrome.runtime.sendMessage({ action: 'updateIcon', value: { color: closestColor } });
};

const displayCarbonUsage = async (apiKey, region, usageElement, fossilFuelElement, regionElement) => {
  try {
    const response = await axios.get('https://api.co2signal.com/v1/latest', {
      params: {
        countryCode: region,
      },
      headers: {
        'auth-token': apiKey,
      },
    });
    
    const CO2 = Math.floor(response.data.data.carbonIntensity);
    calculateColor(CO2); // 각 지역의 CO2 값에 따라 색상 설정

    loading.style.display = 'none';
    form.style.display = 'none';
    regionElement.textContent = region;
    usageElement.textContent = `${CO2} grams (grams CO2 emitted per kilowatt hour)`;
    fossilFuelElement.textContent = `${response.data.data.fossilFuelPercentage.toFixed(2)}% (percentage of fossil fuels used to generate electricity)`;
  } catch (error) {
    console.error(error);
    loading.style.display = 'none';
    errors.textContent = `Sorry, we have no data for the region ${region} you have requested.`;
  }
};

function handleSubmit(e) {
  e.preventDefault();
  const apiKeyValue = apiKey.value;
  const regions = [region1.value, region2.value, region3.value];
  
  loading.style.display = 'block';
  errors.textContent = '';
  clearBtn.style.display = 'block';

  // Display carbon usage for each region
  displayCarbonUsage(apiKeyValue, regions[0], document.querySelector('.carbon-usage1'), document.querySelector('.fossil-fuel1'), document.querySelector('.my-region1'));
  displayCarbonUsage(apiKeyValue, regions[1], document.querySelector('.carbon-usage2'), document.querySelector('.fossil-fuel2'), document.querySelector('.my-region2'));
  displayCarbonUsage(apiKeyValue, regions[2], document.querySelector('.carbon-usage3'), document.querySelector('.fossil-fuel3'), document.querySelector('.my-region3'));
}

function init() {
  form.style.display = 'block';
  loading.style.display = 'none';
  clearBtn.style.display = 'none';
  errors.textContent = '';
}

function reset(e) {
  e.preventDefault();
  init();
}

form.addEventListener('submit', handleSubmit);
clearBtn.addEventListener('click', reset);
init();
