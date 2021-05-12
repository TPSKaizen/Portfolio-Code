//jshint esversion:6

const express = require("express")
const mongoose = require("mongoose")
const _ = require("lodash")
const date = require(__dirname + "/date.js");

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

//connect to mongod
  mongoose.connect("mongodb://localhost:27017/todoListPrac", {useNewUrlParser:true})

//create schema
  const itemSchema = new mongoose.Schema({
      name: {
        type: String,
        required: [true, "Missing name param. Please try again"]
      }
  })

//link schema to model
const Item = mongoose.model("Item", itemSchema);

//create default items

const item1 = new Item({
  name: "Welcome to your todolist"
})

const item2 = new Item({
  name: "Click the + button to add an item"
})

const item3 = new Item({
  name: "Click the checkbox to remove an item"
})

//create custom list schema 

const listSchema = mongoose.Schema({
    name: String,
    items: [itemSchema]
})
//link schema to model
const List = mongoose.model("List", listSchema)

const defaultItems = [item1, item2, item3];

app.get("/", function(req, res) {

  //read DB collection to see if items exist in it
  Item.find({}, function(err,items){
    //if collection length is 0, insert default items
        if(items.length === 0){
          Item.insertMany(defaultItems, function(err){
            if(err) console.log(err)
            else console.log("Successfully inserted");
            res.redirect("/");
        })
        //if not 0, simply display items already in DB
      } else {
        console.log("Displaying current items");
      res.render("list", {listTitle: "Today", newListItems: items})
    }
  })
});


app.post("/", function(req, res){

  //holds String that we have to put into a new document
  const item = req.body.newItem;
  const listName = req.body.listName;
  
  //create item
  const insertMe = new Item({
    name:item
  })

  //Since we have custom routes, we have to check where the post requests are coming from
  if(listName === "Today"){
  //check for duplicates
      Item.findOne({name: item}, function(err,doc){
        if(err) console.log(err)
        else {
            if(doc === null || doc === undefined){
              insertMe.save();
              res.redirect("/");
            }
            else{
                console.log("Duplicate entry")
                res.redirect("/");
            }
        }
      })
    } else {
    //find list in document collection
    List.findOne({name: listName}, function(err,list){    
        //we have to push since the "items" property in list is of type array
          list.items.push(insertMe);
          list.save();
          res.redirect("/" + item);
    })
  }
});

app.post("/delete", function(req,res){
    
    const id = req.body.checkBox;
    const lName = req.body.lNameDel;

    //search for list
    if(lName !== "Today"){
      //Find list document with name: lName, use PULL to delete from an array, specifiy array, specify param to delete doc within array
      List.findOneAndUpdate({name: lName}, {$pull: {items: {_id:id}}}, function(err,list){
              if(err) console.log(err)
              else res.redirect("/" + lName)
          })
      }
     else {
      Item.findByIdAndDelete(id,function(err){
        if(err) console.log(err)
        else ("successfully removed");
        res.redirect("/")
    })
    }
})

app.get("/:customListName", function(req,res){
  
    //captializing first letter regardless of input with Lodash
    const cName = _.capitalize(req.params.customListName);
    
    //check to see if list already exists to stop duplicate entries
    List.findOne({name: cName}, function(err,list){
          if(list === null || list == undefined){
            const cusList = new List({
              name : cName,
              items: defaultItems
          }) 
          cusList.save();
          res.redirect("/" + cName);
          } else {
            console.log("List with this name already exists. Displaying...");
            res.render("list", {listTitle: list.name, newListItems: list.items});
          }
    })
});



app.listen(3000, function() {
  console.log("Server started on port 3000");
});
