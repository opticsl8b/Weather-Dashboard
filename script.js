// element selector - Search Box
var inputCity = document.getElementById('input-city');
var resultCity = document.getElementById('result-city');
var submitButton = document.getElementById('btn-submit');
var clearButton = document.getElementById('btn-clear');
var searchHistory = document.getElementById('search-history');
// var searchBoxEl = document.getElementById('search-box');

// element selector - Current Box
var currentDate = document.getElementById('span-date');
var currentWeather = document.getElementById('img-current-weather');
var currentTemp = document.getElementById('span-current-temp');
var currentWind = document.getElementById('span-current-wind');
var currentHumidity = document.getElementById('span-current-humidity');
var currentUV = document.getElementById('span-current-uv');
// element selector - Forecast Box
var forecastWeather = document.getElementById('weather-cards');

// api key
var apiKey = "9fd3d63ef022ae3df21d9d5a84d29881"

// Save fetched data into local storage
var jsonStringify = function(data) {
    localStorage.setItem('weather', JSON.stringify(data))
};

// function fetches Geographical coordinates data
function lonlatFetch() {
    var onecallUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`
    fetch(onecallUrl).then(function(response) {
        return response.json();
    });
}

// Kelvin to Celsius conversion
function kelvinToCelcius(kelvin) {
    return kelvin - 273.15;
}
// function generates corresponding button
function createBtn() {
    searchHistory.innerHTML = "";
    var createButton = document.createElement('input');
    createButton.setAttribute('class', 'button-primary');
    createButton.setAttribute('type', 'button');
    createButton.setAttribute('value', inputCity.value);
    searchHistory.appendChild(createButton);
    //reset input text
    inputCity.value = "";
};

function clearBtn() {
    searchHistory.innerHTML = '<input class="button-primary" type="button" value="Search History">'
};
clearButton.addEventListener("click", clearBtn);

// Function handles events when user click the submit button
var submitButtonHandler = function() {


    var url = `https://api.openweathermap.org/data/2.5/weather?q=${inputCity.value}&appid=${apiKey}`;
    fetch(url)
        .then(response => response.json())
        .then(function(data) {

            // create a corresponding button
            if (inputCity.value) {
                createBtn();
            };


            console.log('data is ', data);
            console.log('data is ', data['weather'][0]['icon']);
            // display corresponding result
            // city name display
            resultCity.innerHTML = data['name'];
            // Unix convert to display format
            var dateString = moment.unix(data['dt']).format("DD/MM/YYYY");
            // current date
            currentDate.innerHTML = dateString;
            // weather Icon convert and display
            var weatherCode = data['weather'][0]['icon'];
            var weatherUrl = `http://openweathermap.org/img/wn/${weatherCode}@2x.png`;
            currentWeather.setAttribute("src", weatherUrl);
            // temperture display ,only display one digit after integer
            currentTemp.innerHTML = kelvinToCelcius(data['main']['temp']).toFixed(1) + '°C';
            // wind speed display
            currentWind.innerHTML = data['wind']['speed'] + ' m/sec';
            //Humidity display
            currentHumidity.innerHTML = data['main']['humidity'] + ' %';
            // local storage
            localStorage.setItem("main", JSON.stringify(data));

            //UV display -
            //getApi from one call
            var lat = data['coord']['lat'];
            var lon = data['coord']['lon'];
            var onecallUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`

            fetch(onecallUrl)
                .then(response => response.json())
                .then(function(onecallData) {
                    console.log('data is ', onecallData);
                    // corresponding UV color    
                    var uv = onecallData['current']['uvi'];
                    currentUV.innerHTML = uv;
                    if (uv < 4) {
                        currentUV.setAttribute('class', 'green')
                    }
                    if (uv >= 4 && uv <= 8) {
                        currentUV.setAttribute("class", "yellow");
                    }
                    if (uv > 9) {
                        currentUV.setAttribute("class", "red");
                    }

                    // 5 day forecast-
                    // Scrape a 5 Days forecast array 
                    var next5Day = onecallData['daily'].slice(1, 6);
                    console.log('data is ', next5Day);
                    // reset forcast 
                    forecastWeather.innerHTML = '';

                    // function generates forecast cards  
                    var cardsGenerator = function() {
                        var card = document.createElement('div');
                        card.setAttribute('class', 'two');
                        forecastWeather.appendChild(card);
                        // select the div just created
                        var lastDiv = forecastWeather.lastElementChild;
                        // append ul
                        var ul = document.createElement('ul');
                        lastDiv.appendChild(ul);
                    };

                    // generate loop
                    for (i = 0; i < next5Day.length; i++) {
                        // create div + ul
                        cardsGenerator();

                        // select the ul just created
                        var lastCard = forecastWeather.children[i];

                        // forecast display-Date
                        var forecastDate = moment.unix(next5Day[i]['dt']).format("DD/MM/YYYY");
                        lastCard.children[0].innerHTML = "<li><span>" + forecastDate + "</span></li>";

                        // forecast Weather Icon
                        // scrape icon code
                        var forcastWeatherCode = next5Day[i]['weather'][0]['icon'];
                        var forecastIconUrl = `http://openweathermap.org/img/wn/${forcastWeatherCode}@2x.png`;
                        // create li for icon
                        var li = document.createElement('li');
                        lastCard.children[0].appendChild(li);
                        var forcastWeather = lastCard.children[0].children[1];
                        // insert img
                        var img = document.createElement('img');
                        forcastWeather.appendChild(img);
                        forcastWeather.children[0].setAttribute("src", forecastIconUrl);
                        // forecast Temperture
                        var li = document.createElement('li');
                        lastCard.children[0].appendChild(li);
                        var forcastTemp = lastCard.children[0].children[2];
                        forcastTemp.innerHTML =
                            'Temp:<br>' + kelvinToCelcius(next5Day[i]['temp']['min']).toFixed(1) + ' ~ ' +
                            kelvinToCelcius(next5Day[i]['temp']['max']).toFixed(1) + ' °C';
                        // forecast Wind Speed
                        var li = document.createElement('li');
                        lastCard.children[0].appendChild(li);
                        var forcastWind = lastCard.children[0].children[3];
                        forcastWind.innerHTML = 'WindSpeed:<br>' + next5Day[i]['wind_speed'] + ' m/sec';
                        // forecast Humidity
                        var li = document.createElement('li');
                        lastCard.children[0].appendChild(li);
                        var forcastHumi = lastCard.children[0].children[4];
                        forcastHumi.innerHTML = 'Humidity:<br>' + next5Day[i]['humidity'] + ' %'
                        console.log('target is ', );
                    }
                    // local storage
                    localStorage.setItem("onecall", JSON.stringify(onecallData));
                })



        })
        // display error event if api fetched incorrectly
        .catch(error => alert('incorrect City Name'));
    // create a corresponding button
    if (inputCity.value) {
        createBtn();
    };

}

submitButton.addEventListener("click", submitButtonHandler);

function initialPage() {
    var mainString = localStorage.getItem('main');
    var onecallString = localStorage.getItem('onecall');
}

// Search History button event
// add corresponding(data['name']) button when click on the button-


// add button that removes all button