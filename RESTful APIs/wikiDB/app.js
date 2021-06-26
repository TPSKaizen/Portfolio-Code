const express = require("express")
const mongoose = require("mongoose")
const ejs = require("ejs");
const { urlencoded } = require("express");

const app = express();

app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(express.static("public"))

app.set("view engine", "ejs")

mongoose.connect("mongodb://localhost:27017/WikiDB", {
useUnifiedTopology: true,
useNewUrlParser: true
});

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Missing title"]
    },

    content: {
        type: String,
        required: [true, "Missing content"]
    }
})

const Article = mongoose.model("article", articleSchema);

//HTTP verbs : GET POST PUT PATCH DELETE. We have to cover both general and specific
//GENERAL

//chaining route handlers with route method
app.route("/articles")
//GET
.get(function(req,res){
    Article.find({}, function(err,docs){
        if(err) res.send(err)
        else res.send(docs)
    });
})
//POST
.post(function(req,res){

    //testing data with POSTMAN post request
    console.log(req.body.title)
    console.log(req.body.content)

    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content        
    })

    newArticle.save(function(err){
        if (err) res.send(err)
        else res.send("Saved a new article!");
    });
})
//DELETE
//if you leave the conditions empty, it will delete everything
.delete(function(req,res){
    Article.deleteMany({}, function(err){
        if(err) res.send(err)
        else res.send("Deleting everything")
    });
});

//SPECIFIC
// GET a SINGLE document
app.route("/articles/:articleTitle")
.get(function(req,res){
    Article.findOne({title: req.params.articleTitle}, function(err,doc){
        if(err) res.send(err)
        else res.send(doc)
    });
})

//PUT a SINGLE document
.put(function(req,res){
    Article.replaceOne(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        function(err, doc){
            if(err) res.send(err)
            else res.send(doc)
    });
})

//PATCH a SINGLE document
.patch(function(req,res){
    Article.updateOne(
        {title: req.params.articleTitle}, 
        //$set becomes dynamic such that the user specifies what they want to change
        {$set: req.body},
        function(err){
        if (err) res.send(err)
        else res.send("Successfully updated")
    });
})

.delete(function(req,res){
    Article.deleteOne({title: req.params.articleTitle}, function(err){
        if(err) res.send(err)
        else res.send("Sucessfully deleted")
    });
});


app.listen(3000, function(req,res){
    console.log("Server is up!")
})