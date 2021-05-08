const express = require("express");
const https = require("https");
const app = express();


//what happens when the user tries to go to the homepage
app.get("/", function(req,res){
 // res.send("Welcome to server!");

  //live data from API
  const url = "https://api.openweathermap.org/data/2.5/weather?q=Bridgetown,Barbados&appid=276f873981cd3f9c5fba6d41c93c085b&units=imperial";

  //getting the data from the API, will be in a raw format
  https.get(url, function(response){
    

  //format raw data into more readable form (JS object)
    response.on("data", function(data){
      const weatherData = JSON.parse(data);

      //get weather icon number from received data
      const iconId = weatherData.weather[0].icon;

      //concat icon number into link so it becomes dynamic
      const icon = "<img src='http://openweathermap.org/img/wn/" + iconId +"@2x.png'>";
      
      // Example of tapping into object
      console.log(weatherData.main.temp);
      //you can only have 1 res.send, so to send multiple things we can use res.write() then res.send() when finished.

      res.write("<h1> The temperature in Barbados right now is " + weatherData.main.temp + " </h1>");
      res.write("<p> The weather description for Barbados is : " +  weatherData.weather[0].description + "</p>" );
      res.write(icon);
      res.send();
    })

  })
 
})

app.listen("3000", function(){
  console.log("Server is live!");
})