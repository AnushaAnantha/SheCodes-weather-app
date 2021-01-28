function formatDate(currentDate) {
  let date = currentDate.getDate();
  let hours = currentDate.getHours();
  let minutes = currentDate.getMinutes();
  let year = currentDate.getFullYear();
  let days = ["Sunday", "Monday", "Tueday", "Wednesday", "Thursday", "Friday", "Saturday"];
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
function  formatMinutes(minutes){
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

function returnCelsius(){
  let h1 = document.querySelector("h1");
  h1.innerHTML = "0 °C";
}

function returnFahrenheit(){
    let h1 = document.querySelector("h1");
    h1.innerHTML = "32 °F";
}

let anchorCelsius = document.querySelector("#celsius-click");
anchorCelsius.addEventListener("click", returnCelsius);

let anchorFahrenheit = document.querySelector("#fahrenheit-click");
anchorFahrenheit.addEventListener("click", returnFahrenheit);

// adding the  real-time weather update feature

function updateTemperature(){
  let enterCity = document.querySelector("#search-text-input");
  let h2 = document.querySelector("h2");
  h2.innerHTML = `${enterCity.value}`;
  h2.innerHTML = h2.innerHTML.toUpperCase();

 let apiUrl =`https://api.openweathermap.org/data/2.5/weather?q=${enterCity.value} &appid=667b283f74e42ac5a41950daddbddfc8&units=metric`;
axios.get(apiUrl).then(showTemperature);
}
  function showTemperature(response) {
  let temperature = Math.round(response.data.main.temp);
  let h1 = document.querySelector("h1");
  h1.innerHTML = `${temperature}˚C`;
}

//Bonus - display current location and temperature

function getTemperatureUsingLatLong(position){
let lat = position.coords.latitude;
let long = position.coords.longitude;
let reverseLookupApiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${long}`;
let apiUrl =`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=667b283f74e42ac5a41950daddbddfc8&units=metric`;
 axios.get(apiUrl).then(showTemperature);
  axios.get(reverseLookupApiUrl).then(displayCityName);
}

function displayCityName(response){
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


 
