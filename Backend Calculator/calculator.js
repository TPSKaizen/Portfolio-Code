//Installed NPM Packages : Express, Body Parser, Nodemon

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

//bodyParser.text/.json/.urlencoded
//extended: true allows us to post nested objects. BodyParser wants us to explicitly declare this.
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req,res){
  //res.send is for bits of html data

  //sending an entire webpage res.sendFile
//__dirname gives the file path of the current file no matter where its hosted

  res.sendFile(__dirname + "/index.html")
});


//install body-parser to parse the data sent in from post request
app.post("/", function(req,res){
 // res.send("Thanks for posting that!"); 
  
  let result = +req.body.num1 + +req.body.num2;

  res.send("The result of the calculation is : " + result);
});

//when you type 'bmicalculator' in the URL, then the callback functions executes
app.get('/bmicalculator', function(req,res){
  res.sendFile(__dirname + "/bmiCalculator.html");
});

app.post('/bmiCalculator', function(req,res){
  let result = (parseFloat(req.body.weight)) / (Math.pow(parseFloat(req.body.height),2));
  res.send("Your BMI is : " + result.toFixed(3));
});

app.listen(3000, function(){
  console.log("Running on Port 3000");
});