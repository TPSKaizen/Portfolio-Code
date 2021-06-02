//jshint esversion:6
require('dotenv').config();
const express = require("express")
const ejs = require("ejs")
const mongoose = require("mongoose")
const session = require("express-session")
const passport = require("passport")
const passportLocalMongoose = require("passport-local-mongoose")
const {isAuthHome, isAuthSec} = require('../secretss/isAuth')

const app = express();

app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(express.urlencoded({extended:true}))
app.use(express.json())

//SET UP SESSION & SESSION-STORE

app.use(session ({
    secret: process.env.SESSIONSECRET,
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

//SET UP DB FOR USERS
mongoose.connect(process.env.DBNAME, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  });

mongoose.set("useCreateIndex", true);

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Missing username param"]
    },
    password: String
})

//this is for hashing and salting passwords and saving users into mongoDB 
UserSchema.plugin(passportLocalMongoose)

const User = mongoose.model("user", UserSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.get("/", isAuthHome, (req,res) => {
    res.render("secrets")
})

app.get("/home", isAuthHome, (req,res) => {
    res.render("secrets")
})

app.get("/login", (req,res) => {
    res.render("login")
})

app.get("/register", (req,res) => {
    res.render("register")
})

app.get("/secrets", isAuthSec, (req,res) => {
    res.render("secrets")
})

app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

app.post("/login", passport.authenticate('local', { failureRedirect: '/login'}), (req,res) => {
        res.redirect("/secrets")
})

app.post("/register", (req,res, next) =>{
    User.register({username: req.body.username}, req.body.password, (err, user) =>{
        if(err){
         console.log("Error while registering user", err)
         return next(err)
        }
        console.log("User registered!");
        
        res.redirect('/');
    })

})



app.listen(3000, (req,res) =>{
    console.log("Server up!")
})