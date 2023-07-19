const apiKey = "80aeee43969143fcb67d8e344bf0fdab";
const searchButton = document.querySelector(".search-btn");
const cityInput = document.getElementById("cityInput");
const cityNameElement = document.getElementById("cityName");
const weatherIconElement = document.getElementById("weatherIcon");
const temperatureElement = document.getElementById("temperature");
const windSpeedElement = document.getElementById("windSpeed");
const humidityElement = document.getElementById("humidity");
const forecastElement = document.querySelector(".days-forecast .weather-cards");

// Retrieve search history from local storage
const searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

// Function to save search history in local storage
function saveSearchHistory(city) {
  searchHistory.push(city);
  localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
}

// Function to display current weather
function displayCurrentWeather(data) {
  cityNameElement.textContent = data.name;
  const iconURL = data.weather[0].icon;
  weatherIconElement.src = `https://openweathermap.org/img/wn/${iconURL}.png`;
  temperatureElement.textContent = `Temperature: ${data.main.temp}°C`;
  windSpeedElement.textContent = `Wind: ${data.wind.speed} km/h`;
  humidityElement.textContent = `Humidity: ${data.main.humidity}%`;
}

// Function to display forecast
function displayForecast(data) {
  forecastElement.innerHTML = "";

  for (let i = 1; i < 6; i++) {
    const forecastData = data.daily[i];
    const date = new Date(forecastData.dt * 1000).toLocaleDateString();
    const iconURL = forecastData.weather[0].icon;
    const temperature = forecastData.temp.day;
    const windSpeed = forecastData.wind_speed;
    const humidity = forecastData.humidity;

    const card = document.createElement("li");
    card.classList.add("card");
    card.innerHTML = `
      <h4>${date}</h4>
      <div class="icon">
        <img src="https://openweathermap.org/img/wn/${iconURL}.png">
      </div>
      <h4>Temp: ${temperature}°C</h4>
      <h4>Wind: ${windSpeed} km/h</h4>
      <h4>Humidity: ${humidity}%</h4>
    `;

    forecastElement.appendChild(card);
  }
}

// Function to get city coordinates
async function getCityCoordinates(city) {
  const geocodingApiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
  const response = await fetch(geocodingApiUrl);
  const data = await response.json();
  if (data.length === 0) {
    throw new Error("City not found");
  }
  return { lat: data[0].lat, lon: data[0].lon };
}

// Function to search weather
async function searchWeather(city) {
  try {
    const coordinates = await getCityCoordinates(city);
    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&units=metric&appid=${apiKey}`;
    const response = await fetch(weatherApiUrl);
    const data = await response.json();
    displayCurrentWeather(data.current);
    displayForecast(data);
    saveSearchHistory(city);
  } catch (error) {
    console.error(error);
    alert("City not found. Please try again.");
  }
}

// Event listener for the search button click
searchButton.addEventListener("click", function() {
  const city = cityInput.value.trim();
  if (city !== "") {
    searchWeather(city);
    cityInput.value = "";
  }
});

// Initial display of search history
const searchHistoryElement = document.querySelector(".search-history");
for (const city of searchHistory) {
  const li = document.createElement("li");
  li.textContent = city;
  li.addEventListener("click", function() {
    searchWeather(city);
  });
  searchHistoryElement.appendChild(li);
}



  