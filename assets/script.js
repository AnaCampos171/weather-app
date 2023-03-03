// Define a constant variable for the OpenWeather API key, find various HTML elements by their IDs, and assign them to corresponding constant variables. 
const apiKey = "298c5d0a2519392d45c5787e4ff86e60"; 
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const searchHistoryList = document.getElementById("search-history-list");
const currentWeatherContainer = document.getElementById("current-weather-container");
const forecastWeatherContainer = document.getElementById("forecast-weather-container");
const cityTitle = document.getElementById("city-title");
let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

// Function to get current weather data
async function getCurrentWeather(city) {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
  const data = await response.json();
  return data;
}

// Function to get 5-day forecast data
async function getForecast(city) {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
  const data = await response.json();
  return data;
}

// Function to render current weather data
function renderCurrentWeather(data) {
  const date = new Date(data.dt * 1000).toLocaleDateString();
  const icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

  currentWeatherContainer.innerHTML = `
    <h2>${data.name} (${date}) <img src="${icon}" alt="${data.weather[0].description}"></h2>
    <p>Temperature: ${data.main.temp} °C</p>
    <p>Humidity: ${data.main.humidity}%</p>
    <p>Wind Speed: ${data.wind.speed} km/h</p>
  `;
}

// Function to render 5-day forecast data
function renderForecast(data) {
  let forecastHTML = "";
  for (let i = 0; i < data.list.length; i += 8) {
    const forecast = data.list[i];
    const date = new Date(forecast.dt * 1000).toLocaleDateString();
    const icon = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`;

    forecastHTML += `
      <div class="forecast-item">
        <h3>${date}</h3>
        <img src="${icon}" alt="${forecast.weather[0].description}">
        <p>Temperature: ${forecast.main.temp} °C</p>
        <p>Humidity: ${forecast.main.humidity}%</p>
        <p>Wind Speed: ${forecast.wind.speed} km/h</p>
      </div>
    `;
  }
  forecastWeatherContainer.innerHTML = forecastHTML;
}

// Function to handle search form submit
async function handleSearchFormSubmit(event) {
  event.preventDefault();
  const city = searchInput.value.trim();
  if (!city) return;
  
  // Get current weather data and render it
  const currentWeatherData = await getCurrentWeather(city);
  renderCurrentWeather(currentWeatherData);
  
  // Get 5-day forecast data and render it
  const forecastData = await getForecast(city);
  renderForecast(forecastData);
  
  // Add city to search history if it doesn't already exist
  if (!searchHistory.includes(city)) {
  searchHistory.unshift(city);
  }
  
  // Render the search history list
  searchHistoryList.innerHTML = searchHistory.map(city => `<li><button class="search-history-item">${city}</button></li>`).join("");

  
  // Store the search history in localStorage
  localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
  }
  
  // Add event listener to search form
  searchForm.addEventListener("submit", handleSearchFormSubmit);
  
  // Add event listener to each button element in search history list
  searchHistoryList.addEventListener("click", event => {
  if (event.target.classList.contains("search-history-item")) {
    
  // Set the search input value to the clicked city and trigger a search
  const city = event.target.textContent.trim();
  searchInput.value = city;
  handleSearchFormSubmit(event);
  }
  });
  
  // Render the initial search history list
  searchHistoryList.innerHTML = searchHistory.map(city => `<li><button class="search-history-item">${city}</button></li>`).join("");