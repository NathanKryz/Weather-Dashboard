var today = moment();
var API = "ac46c0f342f1e760ae76e73815433b41";
var citysearch = document.querySelector('#citysearch');
var countrysearch = document.querySelector('#countrysearch');
var startsearch = document.querySelector('#confirmsearch');
var searchHistory = document.querySelector('#searchHistory');
var requestedcity;
var requestedcountry;
let cityHistory = [];
let cityArray = [];
let countryArray = [];
let checkHistory = false;

// Main function to call the fetch and get the data
var searchweatherData = function (event) {
    event.preventDefault();


    var requestUrl = 'https://api.openweathermap.org/data/2.5/forecast?q='+requestedcity+ ',' + requestedcountry + '&appid='+API+'&units=metric';
    fetch(requestUrl)
        .then(function(response) {
            // If fetch is wrong
            if(response.status != 200)
            {
              alert("City entered is not valid");
              return;
            } 
            // If user does not fill out both inputs
            else if (!requestedcity || !requestedcountry){
                alert("Please fill out both categories to begin");
                return;
            }
            // Run this if its a newly entered city
            else if (checkHistory === true){
            var newSearch = $('<li class="align-center p-2 text-dark text-center border prevsearch">');
            newSearch.text(requestedcity + ' ' +requestedcountry);
            $('#searchHistory').append(newSearch);
            cityHistory.push(requestedcity + ' ' + requestedcountry);
            localStorage.setItem("searchHistory", JSON.stringify(cityHistory));
            return response.json();
            }
            // Run this if its grabbing from the search history
            else{

            return response.json();
            }
            
        })
    
   
        .then(function (data){
            // Organize the weather data into blocks of 8, 3 hour slices each.
            let dailyWeather = [];
                let currentDay = [];
            data.list.forEach(e => {
                if (currentDay.length === 0){
                  currentDay.push(e);
                }else{
                  if (currentDay[currentDay.length - 1].dt_txt.split(" ")[0] !== e.dt_txt.split(" ")[0]){
                    dailyWeather.push(currentDay);
                    currentDay = [e];
                  }else{
                    currentDay.push(e);
                  }
                }
              });
              if (currentDay.length !== 0) dailyWeather.push(currentDay);
              if (dailyWeather.length > 5) dailyWeather.shift();
                // Put the weather of today into the main card
            $("#todayweather").children(".wdate").text(today.format("MMMM Do, YYYY") + " for " + requestedcity);
            $("#todayweather").children(".wicon").attr("src", "http://openweathermap.org/img/wn/" + currentDay[0].weather[0].icon +"@2x.png");
            $("#todayweather").children(".wtemp").text("Temperature: " + currentDay[0].main.temp + " °C");    
            $("#todayweather").children(".whumid").text("Humidity: " + currentDay[0].main.humidity + " %");
            $("#todayweather").children(".wwind").text("Wind Speed: " + currentDay[0].wind.speed + " m/s");

              // For loop to fill out the row of smaller cards
            for (i = 0; i < $('#forecast').children().length; i++){
              let weatherday = moment().add((i + 1), 'days');
                $('#forecast').children().eq(i).children().find(".wdate").text(weatherday.format("MMMM Do, YYYY"));
                $('#forecast').children().eq(i).children().find(".wicon").attr("src", "http://openweathermap.org/img/wn/" + dailyWeather[i][0].weather[0].icon +"@2x.png");
                $('#forecast').children().eq(i).children().find(".wtemp").text("Temperature: " + dailyWeather[i][0].main.temp + " °C");
                $('#forecast').children().eq(i).children().find(".whumid").text("Humidity: " + dailyWeather[i][0].main.humidity + " %");
                $('#forecast').children().eq(i).children().find(".wwind").text("Wind Speed: " + dailyWeather[i][0].wind.speed + " m/s");
            }
        })

    


    
}

// Click function for the search bar
startsearch.addEventListener('click', inputCity);

function inputCity(event){
    event.preventDefault();
     requestedcity = citysearch.value.toString();
     requestedcountry = countrysearch.value.toString();
     console.log(requestedcity);
     console.log(requestedcountry);
     checkHistory = true;
    searchweatherData(event); 
}
// Delegate a listener to the search history inputs
 $(document).on('click', '.prevsearch', historyCity);

// Runs if a previously searched city is pressed
function historyCity(event){
    event.preventDefault();
     var historyCall = $(this).text();
    requestedcity = historyCall.split(' ')[0];
    requestedcountry = historyCall.split(' ')[1];
    checkHistory = false;
    searchweatherData(event);
}

// Print the local storage of city search history
function init(){
    for (i = 0; i < JSON.parse(localStorage.getItem("searchHistory")).length; i++){
        console.log(JSON.parse(localStorage.getItem("searchHistory")).length);
        var historyCall = JSON.parse(localStorage.getItem("searchHistory"));
        historyCall = historyCall[i];
        requestedcity = historyCall.split(' ')[0];
        requestedcountry = historyCall.split(' ')[1];
        var oldSearch = $('<li class="align-center p-2 bg-success text-dark text-center border prevsearch">');
        oldSearch.text(requestedcity + ' ' +requestedcountry);
        $('#searchHistory').append(oldSearch);
        cityHistory.push(requestedcity + requestedcountry);

    }
    $("#todayweather").children(".wdate").text(today.format("MMMM Do, YYYY"));
}

 init();
//Touch up CSS
// Clarity on information relayed
// Append search history to local storage
// Delegate appends to have click events to bring out the text content in a search
// Alternate print to cards fetch pull