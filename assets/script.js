var today = moment();
var API = "ac46c0f342f1e760ae76e73815433b41";
var citysearch = document.querySelector('#citysearch');
var countrysearch = document.querySelector('#countrysearch');
var startsearch = document.querySelector('#confirmsearch');
var searchHistory = document.querySelector('#searchHistory');

// Fetch weather data
// Organize weather data
// Print it to the cards
var searchweatherData = function (event) {
    event.preventDefault();

    var requestedcity = citysearch.value.trim().toString();
    var requestedcountry = countrysearch.value.toString();
    var requestUrl = 'https://api.openweathermap.org/data/2.5/forecast?q='+requestedcity+ ',' + requestedcountry + '&appid='+API+'&units=metric';
    fetch(requestUrl)
        .then(function(response) {
            if(response.status != 200)
            {
              alert("City entered is not valid");
              return;
            } 
            else{
            var newSearch = $('<li class="align-center p-2 bg-success text-dark text-center border">');
            newSearch.text(requestedcity + ', ' +requestedcountry);
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

            $("#todayweather").children(".wdate").text(today.format("MMMM Do, YYYY"));
            $("#todayweather").children(".wicon").attr("src", "http://openweathermap.org/img/wn/" + currentDay[0].weather[0].icon +"@2x.png");
            $("#todayweather").children(".wtemp").text("Temperature: " + currentDay[0].main.temp);    
            $("#todayweather").children(".whumid").text("Humidity: " + currentDay[0].main.humidity);
            $("#todayweather").children(".wwind").text("Wind Speed: " + currentDay[0].wind.speed);
            //One for loop for the currentDay into the big print

            for (i = 0; i < $('#forecast').children().length; i++){
              let weatherday = moment().add((i + 1), 'days');
                $('#forecast').children().eq(i).children().find(".wdate").text(weatherday.format("MMMM Do, YYYY"));
                $('#forecast').children().eq(i).children().find(".wicon").attr("src", "http://openweathermap.org/img/wn/" + dailyWeather[i][0].weather[0].icon +"@2x.png");
                $('#forecast').children().eq(i).children().find(".wtemp").text("Temperature: " + dailyWeather[i][0].main.temp);
                $('#forecast').children().eq(i).children().find(".whumid").text("Humidity: " + dailyWeather[i][0].main.humidity);
                $('#forecast').children().eq(i).children().find(".wwind").text("Wind Speed: " + dailyWeather[i][0].wind.speed);
            }
            //One for loop for the daily forecasts
        })

    


    
    // Put these in local storage?
}

startsearch.addEventListener('click', searchweatherData);



// Append search history to local storage
// Delegate appends to have click events to bring out the text content in a search
// Alternate print to cards fetch pull