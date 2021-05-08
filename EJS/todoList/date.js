module.exports.getDate = function(){

const date = new Date();

const options= {
    weekday: "long",
    day: "numeric",
    month: "long"
};

return date.toLocaleDateString("en-US",options);
    
}

module.exports.getDay = function(){

const date = new Date();

const options= {
    weekday: "long",
};

return date.toLocaleDateString("en-US",options);
}