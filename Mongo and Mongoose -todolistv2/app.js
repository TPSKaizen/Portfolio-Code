//jshint esversion:6

const express = require("express");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

//const items = ["Buy Food", "Cook Food", "Eat Food"];
//const workItems = [];

//create new DB In mongo
mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true});

//create new schema

const itemsSchema = new mongoose.Schema({
    name: String
})

//create mongoose model based on schema
const Item = mongoose.model("item", itemsSchema);

//create some new documents

const itemOne = new Item({
  name: "Welcome to your todoList"
})

const itemTwo = new Item({
  name: "Hit the + button to add a new item"
})

const itemThree = new Item({
  name: "Click the checkbox to delete an item"
})

const defaultItems = [itemOne, itemTwo, itemThree];

//for every new list, it will have a name and will have an array of itemSchema items
const listSchema = new mongoose.Schema({
    name: String,
    items: [itemsSchema]
})

const List = mongoose.model("list", listSchema);

//reading from DB
app.get("/", function(req, res){

//const day = date.getDate();

//find documents from within mongodb collection
Item.find({}, function(err, items){
  if(err)
    console.log(err);
  else{
      //check if array is empty, insert default data
      if(items.length === 0){
        Item.insertMany(defaultItems, function(err){
          if(err)
            console.log(err);
          else
            console.log("Successfully added items");
        }) //after inserting, redirect to home route so that content will be rendered
        res.redirect("/");
      } else{ 
    //render items within collection
    //attributes can be accessed in EJS e.g .name ._id etc
    console.log(items);
    res.render("list", {listTitle: "Today", newListItems: items})
    }
   }
  })
})

app.get("/:customListName", function(req,res){
 
 const customListName = _.capitalize(req.params.customListName);

 //to avoid creating lists with the same name but diff ids, we have to check if one exits already

 List.findOne({name: customListName}, function(err,result){
      if(err)
          console.log(err);
      else { 
  
          if(result === null){
            //create new item since it doesn't exist in DB
            const list = new List({
              name: customListName,
              items: defaultItems
            })
            list.save(function(err){
              if(err) console.log(err)
              else
              res.redirect("/" + customListName);
            })
            //redirect to display specified page
          }
          else{
            //Display item that currently exists in DB
            res.render("list", {listTitle: result.name, newListItems: result.items })
          }
      }
  })

})

app.post("/", function(req, res){

  //create a new document based off model
  const newItem = new Item({
    name: req.body.newItem
  })

  if(req.body.list === "Today"){
    //save to default list
      newItem.save();
      res.redirect("/");
  } else {
    //find custom list name, push item to it and save list
    List.findOne({name: req.body.list}, function(err,foundList) {
          foundList.items.push(newItem);
          foundList.save();
          res.redirect("/" + req.body.list);
    })
  }
});

app.post("/delete", function(req,res){

    const listName = req.body.listName;
    const id = req.body.checkBox;

    if (req.body.listName === "Today"){
          //we gave checkBox a value in EJS, now node can use it to communicate with Mongo
    Item.findByIdAndRemove({_id:req.body.checkBox}, function(err){
      if(err) 
        console.log(err)
      else 
        console.log("Successfully removed")
    })

    res.redirect("/");
    } 
    
    else{
      //Tap in the List model, specfic the list you want to find, specify the update you want to make to the list
      List.findOneAndUpdate({name: listName},{$pull: {items: {_id: id}}}, function(err,results){
          if(err) console.log(err)
          else{
              res.redirect("/" + listName);
          }
      })
  }

})

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
