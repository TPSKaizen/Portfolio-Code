const express = require("express");
const date = require(__dirname + "/date.js")
const app = express();

console.log(date.getDay());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"))

app.set("view engine", "ejs");

const arrItems = ["Buy Food", "Cook Food", "Eat Food"];
const arrWork =[];

app.get("/", function(req,res){

    let today = date.getDate();

    res.render("index" , {listTitle: today, newItems: arrItems});
})

app.post("/", function(req,res){
    let item = req.body.item;

    console.log(req.body);

    if(req.body.list === "Work List"){
        arrWork.push(item);
        res.redirect("/work");
    } else{ 
        arrItems.push(item);
        res.redirect("/");
    }
})


app.get("/work", function(req,res){
    res.render("index", {listTitle: "Work List", newItems: arrWork} )
})

app.get("/about", function(req,res){
    res.render("about");
})

app.listen( process.env.PORT || 3000, function(){
    console.log("Server is live on port 3000!");
})
