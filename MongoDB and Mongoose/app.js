const mongoose = require("mongoose");

//if fruitsDB doesnt exist, it will make it
mongoose.connect("mongodb://localhost:27017/fruitsDB", { useNewUrlParser: true },  { useUnifiedTopology: true });

//how data in a particular collection is to be structured
//this is how every new fruit doc will look
//validation occurs within the schema
const fruitSchema = new mongoose.Schema ({
    name: {
        type:String,
        required: [true, "Please check your data entry, no name was specified"]
    },
    rating: {
        type: Number,
        min:1,
        max:10
    },
    review: String
})

//next create model with schema
// takes two params (Name of collection in a singular form, created schema)
const Fruit = mongoose.model("Fruit",fruitSchema);

//creating a new document from the model
const fruit = new Fruit ( {
    rating: 9,
    review: "Juicy and refreshing."
});

//saves this fruit document into a Fruit collection inside our fruitsDB
//fruit.save();

const kiwi = new Fruit ( {
    name: "kiwi",
    rating: 7,
    review: "Pretty solid."
});


const banana = new Fruit ( {
    name: "banana",
    rating: 6,
    review: "It's okay, could be better."
});


const orange = new Fruit ( {
    name: "orange",
    rating: 9,
    review: "Sour and nice!"
});

//to bulk save we can use : 

/*Fruit.insertMany([kiwi,banana,orange,fruit], function(err){
    if(err)
        console.log(err)
    else
        console.log("Successfully saved all the fruits to fruitsDB");
}) */


//ESTABLISHING RELATIONSHIPS BETWEEN DOCUMENTS
const personSchema = new mongoose.Schema({
    name: String,
    age: Number,
    favFruit: fruitSchema //tells mongoose we are embedding a fruit document inside this property inside our person document
})

const Person = mongoose.model("person", personSchema)

const pineapple = new Fruit({
    name: "Pineapple",
    rating: 9,
    review: "Great Fruit"
});

//pineapple.save();

const Amy = new Person({
    name: "Amy",
    age: 20,
    favFruit: pineapple 
}); 

//Amy.save();


const grape = new Fruit({
    name: "Grape",
    rating: 10,
    review: "Best fruit"
})

grape.save();

const person = new Person({
    name: "John",
    age: 26,
    favFruit: grape
})

person.save();

/*
person.save(function(err){
    if(err) 
        console.log(err);
    else
        console.log("Successfully added a person");
}); */






//READING FROM DB

Fruit.find(function(err, fruits){
    if(err)
        console.log(err);
    else{
        console.log(fruits);

        mongoose.connection.close();
        
        fruits.forEach(function(fruit){
            console.log(fruit.name);
        });
    }
})

//UPDATING AND DELETING

//UPDATING, takes three params (What you want to update, what you want to update about the specified field, callback to log errors)

/*
Fruit.updateOne({ _id: "6092e589e7f84937dc8fb78d"}, {name: "Peach"}, function(err){
    if(err)
        console.log(err)
    else
        console.log("Successfully updated document");
}) */

//DELETING

/*
Fruit.deleteOne({name: "Grape"}, function(err){
    if(err)
        console.log(err)
    else
        console.log("Successfully removed document");
}) 

Person.deleteOne({name: "Amy"}, function(err){
    if(err)
        console.log(err)
    else
        console.log("Successfully removed document");
}) */

/*
Person.deleteMany({name: "John"}, function(err){
    if(err)
        console.log(err);
    else
        console.log("Successfully cleared out People collection");
}) */