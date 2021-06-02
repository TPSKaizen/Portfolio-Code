const { response } = require("express");

module.exports = {

   isAuthHome(req,res,next){
        if (req.isAuthenticated()) next();
        else res.render('home')
    },
    
    isAuthSec(req,res,next){
        if (req.isAuthenticated()) next();
        else res.render('login')
    },

    isAuthSubmit(req,res,next){
        if (req.isAuthenticated()){
            res.render("submit")
            next();
        } 
        else res.redirect('login')
    }
    
}

