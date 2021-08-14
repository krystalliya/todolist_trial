//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();

app.set("view engine", "ejs");  //tell the app to use ejs as a view engine

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

var todos = [
  {
    id: 1,
    event: "Buy cat food",
    dueDate: "End August",
    isCompleted: false
  }, 
  {
    id: 2,
    event: "Feed Cats",
    dueDate: "mid August",
    isCompleted: false
  }, 
  {
    id: 3,
    event: "Refill Water",
    dueDate: "31 August",
    isCompleted: true
  }
];


app.get("/", function(req, res){

  var url = "https://api.openweathermap.org/data/2.5/weather?q=singapore&appid=63d037e35559d27a0cb72e9538af1f24&units=metric";
  https.get(url, function(response){
    console.log(response.statusCode);

    response.on("data", function(data){
      const weatherData = JSON.parse(data);
      var temp = weatherData.main.temp;
      var weatherDes = weatherData.weather[0].main;

////////。。。。分割线。。。。////////
      var today = new Date();

      var options = {
        weekday: "long",
        day: "numeric",
        month: "short",
        year: "numeric"
      };

      var day = today.toLocaleDateString("en-us", options);

      //response by rendering a file called list which inside the views folder
      //then has to have the extention .ejs
      //into the list passing in a single variable: kindOfDay
      //the value of the variable: day
      res.render("list", {theDate: day, todoList: todos, temperature: temp, weather: weatherDes});
    });
  });

});

app.post("/", function(req, res){

  //to get the input data
  var event = req.body.newEvent;
  var dueDate = req.body.newDueDate;

  // create an object to push to the array
  var eventObject = {
    id: todos[todos.length - 1].id + 1,
    event: event,
    dueDate: dueDate,
    isCompleted: false
  }

  todos.push(eventObject);

  res.redirect("/");

})

app.post("/delete/:id", function(req, res){
  // console.log(req.params);

  // to check the index of the delete item based on it's id in the array of the objects
  var deleteIndex = todos.findIndex(function(todo){
    return todo.id === parseInt(req.params.id) //change the string to number by parseInt
  })

  //to delete the object in the array based on the index
  todos.splice(deleteIndex, 1); //1 means only delete 1 item in the array

  res.redirect("/");
})

app.listen(process.env.PORT || 3000, function(){
  console.log(`The server is running on port ${process.env.PORT || 3000}.`);
})