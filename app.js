//select elements

const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".locatinon p");
const notificationElement = document.querySelector(".notification");

const weather = {};
weather.temperature = {
    unit: "celsius"
}
const KELVIN = 273;

const key = "82005d27a116c2880c8f0fcb866998a0";

//checking broser support

if('geolocation' in navigator)
{
    navigator.geolocation.getCurrentPosition(setPosition, showError);
}
else
{
    notificationElement.style.display = "block";
    notificationElement.innerHTML = "<p>Browser Dosn't suport geolocation</p>"
}

//set users position

function setPosition(position)
{
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    getWeather(latitude, longitude);
}

// this will show error when there is an issue

function showError(error)
{
    notificationElement.style.display = 'block';
    notificationElement.innerHTML = "<p>${error.message}</p>"
}

function getWeather(latitude, longitude)
{
    let api =`http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;
    fetch(api)
    .then(function(response){
        let data = response.json();
        return data;
    })

    .then(function(data){
        weather.temperature.value = Math.floor(data.main.temp - KELVIN);
        weather.description = data.weather[0].description;
        weather.iconId = data.weather[0].icon;
        weather.city = data.name;
        weather.country = data.sys.country;
    })
    .then(function(){
        displayWeather();
    })
}

function displayWeather()
{
    iconElement.innerHTML = `<img src = "icons/${weather.iconId}.png"/>`;
    tempElement.innerHTML = `${weather.temperature.value}°<span></span>`
    locationElement.innerHTML = `${weather.city},${weather.country}`;
    descElement.innerHTML = weather.description;
}

function celsuisToFahrenheit(temperature)
{
    return(temperature * 9 / 5) + 32;
}

tempElement.addEventListener(`click`,function(){
    if(weather.temperature.value === undefined) return;
    if(weather.temperature.unit == 'celsius')
    {
        let fahrenheit = celsuisToFahrenheit(weather.temperature.value);
        fahrenheit = Math.floor(fahrenheit);
        tempElement.innerHTML = `${fahrenheit}°<span></span>`;
        weather.temperature.unit = "fahrenheit";
    }
    else
    {
        tempElement.innerHTML = `${weather.temperature.value}°<span></span>`;
        weather.temperature.unit = "celsius";
    }
})