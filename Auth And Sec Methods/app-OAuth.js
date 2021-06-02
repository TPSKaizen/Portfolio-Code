//jshint esversion:6
require('dotenv').config();
const express = require("express")
const ejs = require("ejs")
const mongoose = require("mongoose")
const session = require("express-session")
const passport = require("passport")
const passportLocalMongoose = require("passport-local-mongoose")
const {isAuthHome, isAuthSec, isAuthSubmit} = require('../secretss/isAuth')
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const findOrCreate = require("mongoose-findorcreate");
const { compareSync } = require('bcrypt');
const e = require('express');

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
    username: String,
    password: String,
    // this is for the google strategy
    googleId: String,
    secret: String
})

//this is for hashing and salting passwords and saving users into mongoDB 
UserSchema.plugin(passportLocalMongoose)
//to help in the 0auth configuration
UserSchema.plugin(findOrCreate)

const User = mongoose.model("user", UserSchema);

passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

passport.use(new GoogleStrategy({
    clientID: process.env.GGLECLIENTID,
    clientSecret: process.env.GGLCLIENTSEC,
    callbackURL: process.env.GGLECBURL,
    passReqToCallback   : true,
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(request, accessToken, refreshToken, profile, done) {
      console.log(profile)
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));

app.get("/", isAuthHome, (req,res) => {
    res.render("secrets")
})

app.get("/home", isAuthHome, (req,res) => {
    res.render("secrets")
})

app.get('/auth/google',
  passport.authenticate('google', { scope:
    //what we want : email, profile
      [ 'email', 'profile' ] }
));

app.get('/google/callback',
    passport.authenticate( 'google', {
        successRedirect: '/secrets',
        failureRedirect: '/login'
}));


app.get("/login", (req,res) => {
    res.render("login")
})

app.get("/register", (req,res) => {
    res.render("register")
})

app.get("/secrets", isAuthSec, (req,res) => {
    //looks through all users and picks users whose secret fields arent null
    User.find({"secret": {$ne:null}}, (err,docs) =>{
        if(err) console.log(err)
        else{
            res.render("secrets", {usersWithSecrets: docs})
        }
    })
})

app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

app.get("/submit", isAuthSubmit)

app.post("/submit",(req,res) =>{
    const submittedSecret = req.body.secret;

    User.findOne({username: req.user.username}, (err,doc) =>{
        if(err) console.log(err)
        else {
            if(doc) {
                doc.secret = submittedSecret;
                doc.save((err) =>{
                    if(err) console.log(err)
                    else res.redirect("/secrets")
                })
            }
        }
    })
    
})

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