
const keyAPI = `318af96fb947921162d1a48081262b65`;
const submitButton = document.querySelector('#search-button');

// Click event to initiate a weather search after pressing the search button.
submitButton.addEventListener('click', function(event) {

    event.preventDefault();

    let cityNameText = document.querySelector('#search-input').value;

    getWeatherInfo(cityNameText)
})

// Function that constructs, displays, and combines retrieved weather information.
function getWeatherInfo (city) { 
    document.querySelector('#today').innerHTML = '';
    document.querySelector('#forecast').innerHTML = '';
    document.querySelector('#history').innerHTML = '';
    // API for finding the coordinates of a searched city.
    let queryUrlLocation = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${keyAPI}`;

    fetch(queryUrlLocation)
    .then(function (response){
    return response.json();
    })
    .then(function (data){
    console.log(data);

    let locationLat = data[0].lat;
    let locationLon = data[0].lon;
    let cityName = data[0].name;
    
    todayForcast(locationLat,locationLon);
    futureForcast(locationLat,locationLon);
    storeCityData(cityName);
})}

//Function to retrieve current weather conditions and calls for a function to create a row.
function todayForcast (lat, lon) {
    // API to retrieve current weather information based on provided coordinates.
    let queryUrlCurrentWeather = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${keyAPI}&units=metric`;

    fetch(queryUrlCurrentWeather)
    .then(function (response){
        return response.json();
    })
    .then(function (data){
        console.log(data);
        addCurrentWeatherRow(data);
    })
} 

//Function to retrieve weather forecast for next five days and calls for a function to create a five days forecast.
function futureForcast (lat, lon) {
    // API to retrieve wether forcast based on the coordinates.
    let queryUrlFiveDays = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${keyAPI}&units=metric`;

    fetch(queryUrlFiveDays)
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        console.log(data);
        fiveDayForecastRow(data);
    })
}

// Function to dynamically create current weather html element and display all gathered information.
function addCurrentWeatherRow(weatherData) {
    
    let currentWeatherDataEl = document.querySelector('#today');
    currentWeatherDataEl.classList.add('border-light-subtle', 'border-end', 'border-bottom', 'border-2', 'bg-body-tertiary');
    let cityName = document.createElement('h2');
    let currentTime = dayjs.unix(weatherData.dt);
    let currentDate = `(${dayjs(currentTime).format('DD/MM/YYYY')})`;
    let weatherIcon = document.createElement('img');
    let currentTemp = document.createElement('p');
    let currentHumidity = document.createElement('p');
    let currentWindSpeed = document.createElement('p');

    // API to retrieve img based on the weather id assigned to coordinates.
    weatherIcon.setAttribute('src', src=`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`)
    cityName.textContent = `City: ${weatherData.name} ${currentDate}`;
    currentTemp.textContent = `Tempature: ` + weatherData.main.temp + ` °C`;
    currentHumidity.textContent = `Humidity: ` + weatherData.main.humidity + `%`;
    currentWindSpeed.textContent = `Wind speed: ` + weatherData.wind.speed + `km/h`;

    cityName.append(weatherIcon);
    currentWeatherDataEl.append(cityName, currentTemp, currentHumidity, currentWindSpeed);

}

//Function to dynamically create and display weather forecasts for the next five days.
function fiveDayForecastRow (fiveDayData) {

    let fiveDayForecastEl = document.querySelector('#forecast');
    let forecastTitle = document.createElement('h3');
    let forecastContainer = document.createElement('div');
    forecastContainer.classList.add('row');
    forecastTitle.textContent = `5- Day Forecast:`;

    fiveDayForecastEl.append(forecastTitle, forecastContainer);
    // As we get a forecast for every 3h, this loop iterates over it choosing 24h intervals. 
    for (let i = 7; i < 40; i+=8) {
        
        let weatherData = fiveDayData.list[i];
        let dayContainer = document.createElement('div');
        dayContainer.classList.add('bg-primary-subtle', 'col-2', 'border', 'border-secondary-subtle', 'm-2'); 
        let forcastTime = dayjs.unix(weatherData.dt);
        let forcastDate = `(${dayjs(forcastTime).format('DD/MM/YYYY')})`;
        let weatherIcon = document.createElement('img');
        let forecastTemp = document.createElement('p');
        let forecastHumidity = document.createElement('p');
        let forecastWindSpeed = document.createElement('p');
        // API for displaying an img based on id assigned to coordinates.
        weatherIcon.setAttribute('src', src=`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`)
        
        forecastTemp.textContent = `Tempature: ` + weatherData.main.temp + ` °C`;
        forecastHumidity.textContent = `Humidity: ` + weatherData.main.humidity + `%`;
        forecastWindSpeed.textContent = `Wind speed: ` + weatherData.wind.speed + `km/h`;

        dayContainer.append(forcastDate, weatherIcon, forecastTemp, forecastHumidity, forecastWindSpeed);
        forecastContainer.append(dayContainer);
    }
}
// Function to store city names already used in search in a local storage. 
function storeCityData (city){

    let cityStorage = JSON.parse(localStorage.getItem('Cities')) || [];

    if (cityStorage.includes(city) !== true) {
        cityStorage.push(city);
        localStorage.setItem('Cities', JSON.stringify(cityStorage));
    }
    // This recall function automatically and adds a new city to the history list.
    getCityData();
} 

//Function to display and create buttons, with cities from a previous search. 
function getCityData(){

    let cityStorage = JSON.parse(localStorage.getItem('Cities')) || [];

    for (let i = cityStorage.length - 1; i >= 0; i--) {
        let historyCol = document.querySelector('#history');
        let cityButton = document.createElement('button');
        cityButton.classList.add('btn', 'btn-outline-secondary', 'm-1');
        cityButton.textContent = cityStorage[i];
        //To add an event listener upon creating a button.
        cityButton.addEventListener('click', getInfo);
        historyCol.append(cityButton);
    }
}
// Click event to use past city searches and recall the current and forecast weather conditions. 
function getInfo(event) {

    event.preventDefault();
    
    let cityNameText = event.target.textContent;
    
    getWeatherInfo(cityNameText);    
}

// Display city history upon loading a page.
getCityData();