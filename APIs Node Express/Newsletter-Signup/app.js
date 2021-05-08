const express = require("express");
const request = require("request");
const https = require("https");
const { json } = require("express");
const { send } = require("process");


const app = express();

//apparently body-parser is depreciated now, so we can just use exprss as specified below
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//to server static files such as local css and images, we have to use a special function of express called static
//in the html we dont use "public/css or public/images, we use a relative link so it would be (foldername inside public)/styles.css etc"
app.use(express.static("public"))

app.get("/", function(req,res){
    res.sendFile(__dirname + "/signup.html");
})


app.post("/", function(req,res){
    console.log("Someone has posted data!");

    //mailchimp expects data in the form of a flat-pack JSON file. 
    // So we have to create an object, then stringify it and send it

    let firstName = req.body.inputFN;
    let lastName = req.body.inputLN;
    let email = req.body.inputEmail;

    //creation of javascript object
    let data = {
        members: [
            //only 1 object in the array because we are subscribing one person at a time
            {
            email_address: email,
            status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    //flat-packing the javascript object
    let jsonData = JSON.stringify(data);

    //we now have to make a POST request towards their servers

    //after the api end point, you need to specify the listID since you can have multiple lists in mailchimp.
    //you also have to replace the X in 'usX' to the number next to 'us' in your apiKey
    const url =  'https://us1.api.mailchimp.com/3.0/lists/listkey';
    const options = {
        method: "POST",
        auth: 'brian:apiKey-us1'
    }

    //we have to save the request into a constant and then use it to send things over to the mailchimp server
    const request = https.request(url, options, function(response){

      if(response.statusCode == 200){
          res.sendFile(__dirname + "/success.html");
      } else{
        res.sendFile(__dirname + "/failure.html");
      }
        
        response.on("data", function(data){
           let apiData = (JSON.parse(data));
         //  console.log(apiData.errors[0].error_code);
        })
    })

    //using request to pass the data to the mailchimp server
    request.write(jsonData);
    request.end();
})

app.post("/failure", function(req,res){
    //this redirect will go to line 18 and execute the code there since that code is targeting the home route.
    res.redirect("/");
})

app.listen( process.env.PORT || 3000, function(){
    console.log("Server is live on port 3000!");
})


