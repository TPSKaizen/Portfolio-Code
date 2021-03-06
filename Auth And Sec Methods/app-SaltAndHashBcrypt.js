//jshint esversion:6
require('dotenv').config();
const express = require("express")
const ejs = require("ejs")
const mongoose = require("mongoose")
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();

app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(express.urlencoded({extended:true}))
app.use(express.json())

mongoose.connect("mongodb://localhost:27017/UsersTwoDB", {
    useUnifiedTopology: true,
    useNewUrlParser: true
  });

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Missing username param"]
    },
    password: String
})

const User = mongoose.model("user", UserSchema);

app.get("/", (req,res) => {
    res.render("home")
})

app.get("/home", (req,res) => {
    res.render("home")
})

app.get("/login", (req,res) => {
    res.render("login")
})

app.post("/login", (req,res) => {
    User.findOne({username: req.body.username}, (err,doc) => {
        if(doc){
            bcrypt.compare(process.env.BCRYPTPASS, doc.password, (err, result) => {
                if (err) console.log(err)
                else if(result) res.render("secrets");
            })
        } else {
            res.send("Login failed");
        }
    })
})

app.get("/register", (req,res) => {
    res.render("register")
})

app.post("/register", (req,res) =>{
    const uName = req.body.username;
    const uPass = req.body.password;

    User.findOne({username: uName}, (err,doc) =>{
        if (err) console.log(err) 
        
        else if (doc){
            console.log("User already exists");
            res.redirect("register")
        } 
        else {
            bcrypt.hash(process.env.BCRYPTPASS, saltRounds, (err, hash) => {
                if(err) console.log(err)
                    else {
                    const newUser = new User({
                        username: uName,
                        password: hash
                    })
                    newUser.save((err) => {
                        if (err) console.log(err)
                        else console.log("Successfully saved")
                    })
                    res.redirect("login");
                }
            })
        
        }
    })
})
        
app.get("/logout", (req,res) =>{
    res.redirect("/")
})

app.listen(3000, (req,res) =>{
    console.log("Server up!")
})