function formatDate(currentDate) {
  let date = currentDate.getDate();
  let hours = currentDate.getHours();
  let minutes = currentDate.getMinutes();
  let year = currentDate.getFullYear();
  let days = [
    "Sunday",
    "Monday",
    "Tueday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  let day = days[currentDate.getDay()];
  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];
  let month = months[currentDate.getMonth()];
  minutes = formatMinutes(minutes);
  return ` ${day},  ${hours}:${minutes} <br/>${month} ${date}, ${year}`;
}
function formatMinutes(minutes) {
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return minutes;
}
let formattedDate = formatDate(new Date());
let dateAndTime = document.querySelector("#dateAndTime");
dateAndTime.innerHTML = formattedDate;


let form = document.querySelector("#search-form");
form.addEventListener("submit", updateTemperature);

let fahrenheit = false;
let temperatureCelsius = 0;

function returnCelsius() {
  let h1 = document.querySelector("h1");
  h1.innerHTML =  `${temperatureCelsius}˚C`;
  fahrenheit = false;
  getTemperature();
}

function returnFahrenheit() {
  let h1 = document.querySelector("h1");
  h1.innerHTML = `${Math.round(temperatureCelsius * 9/5) + 32}˚F`;
  fahrenheit = true;
  getTemperature();

}

let anchorCelsius = document.querySelector("#celsius-click");
anchorCelsius.addEventListener("click", returnCelsius);

let anchorFahrenheit = document.querySelector("#fahrenheit-click");
anchorFahrenheit.addEventListener("click", returnFahrenheit);

// adding the  real-time weather update feature



function updateTemperature(event) {
  event.preventDefault();
  getTemperature();
}

function getTemperature(){
  let enterCity = document.querySelector("#search-text-input");
  let h2 = document.querySelector("h2");
  h2.innerHTML = `${enterCity.value}`;
  h2.innerHTML = h2.innerHTML.charAt(0).toUpperCase() + h2.innerHTML.slice(1).toLowerCase();
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${enterCity.value} &appid=667b283f74e42ac5a41950daddbddfc8&units=metric`;
  axios.get(apiUrl).then(showTemperature);

  let forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${enterCity.value} &appid=667b283f74e42ac5a41950daddbddfc8&units=metric`;
  axios.get(forecastApiUrl).then(showForecastTemperature);
}
function showTemperature(response) {
  console.log(response);
  temperatureCelsius = Math.round(response.data.main.temp);
  let tempMax = Math.round(response.data.main.temp_max);
  let tempMin = Math.round(response.data.main.temp_min);
  let feelsLikeTemp = Math.round(response.data.main.feels_like);

  let h1 = document.querySelector("h1");
  let h6 = document.querySelector("#tempMinMax");
  let humidity = document.querySelector("#humidity");
  let feelsLike = document.querySelector("#feelsLike");
  if (fahrenheit == true){
    let temperatureFahrenheit = (temperatureCelsius * 9/5) + 32;
    let temperatureFahrenheitMax = (tempMax * 9/5) + 32;
    let temperatureFahrenheitMin = (tempMin * 9/5) + 32;
    let feelsLikeFahrenheit = (feelsLikeTemp * 9/5 ) + 32;
    h6.innerHTML ="Today : " + temperatureFahrenheitMax + '/' + temperatureFahrenheitMin + ' ˚F';
    h1.innerHTML = `${Math.round(temperatureFahrenheit)}˚F`;
    feelsLike.innerHTML = "Feels like : " + feelsLikeFahrenheit + "  ˚F ";

  }else{
    h1.innerHTML = `${Math.round(temperatureCelsius)}˚C`;
    h6.innerHTML = "Today : " + tempMax + '/' + tempMin + ' ˚C' ;
    feelsLike.innerHTML = "Feels like : " + feelsLikeTemp + " ˚C";
  }

  humidity.innerHTML = "Humidity : "  + response.data.main.humidity + " %";
  

}

function showForecastTemperature(response) {
 let weatherList = response.data.list;
 let cardNumber = 1;
 let cardName = 'forecast';
 weatherList = weatherList.slice(0,3);
 let weatherIconURL = "http://openweathermap.org/img/wn/";
 weatherList.forEach( function(weatherForecastValue){
    let cardId = `${cardName}_`+ `${cardNumber}`;
    let forecastCard = document.querySelector(`#${cardId}`);
    let dateTime = new Date(weatherForecastValue.dt_txt);
    let weatherForecastHour = weatherForecastValue.main.temp;
    let weatherIcon = weatherIconURL + weatherForecastValue.weather[0].icon + "@2x.png";
    if (fahrenheit == true){
    forecastCard.innerHTML = formatDate(dateTime)+ "<br/>" + (Math.round(weatherForecastHour * 9/5) + 32) + `˚F <br/> <img src=${weatherIcon} >`   ;
    }
    else{
      forecastCard.innerHTML = formatDate(dateTime)+ "<br/>" + Math.round(weatherForecastHour) + `˚C <br/> <img src=${weatherIcon} >`;
    }
    cardNumber = cardNumber + 1;
 });

 }

//Bonus - display current location and temperature

function getTemperatureUsingLatLong(position) {
  let lat = position.coords.latitude;
  let long = position.coords.longitude;
  let reverseLookupApiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${long}`;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=667b283f74e42ac5a41950daddbddfc8&units=metric`;
  axios.get(apiUrl).then(showTemperature);
  axios.get(reverseLookupApiUrl).then(displayCityName);
}

function displayCityName(response) {
  let cityName = response.data.address.city;
  let h2 = document.querySelector("h2");
  h2.innerHTML = `${cityName}`;
  h2.innerHTML = h2.innerHTML.toUpperCase();
}

function showCurrentPosition() {
  navigator.geolocation.getCurrentPosition(getTemperatureUsingLatLong);
}

let currentLocation = document.querySelector("#current-location");
currentLocation.addEventListener("click", showCurrentPosition);

// forecast control

let forecastCardsRow = document.querySelector("#forecast_cards");




 


