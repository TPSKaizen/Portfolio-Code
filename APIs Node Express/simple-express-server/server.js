//normal setup barebones server

const express = require("express");
const app = express();

// the '/' is the root of the server
// app.get defines what should when someone makes a get request to the home root, then the callback function tells the server what to do when the request happens.

app.get('/', function(req,res){
  console.log(req);
  res.send("<h1> Hacker got in! :O </h1>");
});

//route for contact page
app.get('/contact', function(req,res){
  res.send("Contact me at briancamcc@gmail.com!");
});

//route for about page
app.get('/about', function(req,res){
  res.send("<p> Name : Brian <br> Age : 22<br> Favourite food: Shrimp Pasta </p>")
});


app.listen(3000, function(){
 console.log("Server started on port 3000!")});


