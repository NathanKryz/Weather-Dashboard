var today = moment();
var API = "ac46c0f342f1e760ae76e73815433b41";
var citysearch = document.querySelector('#citysearch');
var startsearch = document.querySelector('#confirmsearch');
var searchHistory = document.querySelector('#searchHistory');

// Fetch weather data
// Organize weather data
// Print it to the cards
var searchweatherData = function (event) {
    event.preventDefault();

    var requestedcity = citysearch.value.trim().toString();
    var requestUrl = 'https://api.openweathermap.org/data/2.5/forecast?q='+requestedcity+'&appid='+API+'&units=metric';
    fetch(requestUrl)
        .then(function(response) {
            if(response.status != 200)
            {
              alert("City entered is not valid");
              return;
            } 
            else{
            var newSearch = $('<li class="align-center p-2 bg-success text-dark text-center">');
            newSearch.text(requestedcity);
            $('#searchHistory').append(newSearch);
            return response.json();
            }
            
        })
    
   
        .then(function (data){
            
            console.log(data);
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
              console.log(currentDay);
              console.log(dailyWeather);
            //For loop to get the afternoon temperature?
           // weatherIcon = currentDay.weather[0].icon;
           console.log(currentDay[0].weather[0].icon);
            $("#todayweather").children(".wdate").text(today.format("MMMM Do, YYYY"));
            $("#todayweather").children(".wicon").attr("src", "http://openweathermap.org/img/wn/" + currentDay[0].weather[0].icon +"@2x.png");
          //  $("#todayweather").children(".wicon").attr("src", "http://openweathermap.org/img/wn/10d@2x.png");
            $("#todayweather").children(".wtemp").text("Temperature: " + currentDay[0].main.temp);    
            $("#todayweather").children(".whumid").text("Humidity: " + currentDay[0].main.humidity);
            $("#todayweather").children(".wwind").text("Wind Speed: " + currentDay[0].wind.speed);
            //One for loop for the currentDay into the big print

            //One for loop for the daily forecasts
        })

    


    
    // Put these in local storage?
}

startsearch.addEventListener('click', searchweatherData);



// Append search history to local storage
// Delegate appends to have click events to bring out the text content in a search
// Alternate print to cards fetch pull