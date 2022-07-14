require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const favicon = require("serve-favicon");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();
app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(favicon(__dirname + '/public/favicon.ico'));

mongoose.connect("mongodb+srv://" + process.env.MONGODB + "paintDB");

const userSchema = new mongoose.Schema({
  email: {type:String},
  password: String,
});

const User = new mongoose.model("User",userSchema);

app.get("/",function(req,res){
  res.render("home");
});

app.get("/login",function(req,res){
  res.render("login");
});

app.get("/register",function(req,res){
  res.render("register");
});

app.post("/register",function(req,res){

  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    const newUser = new User({
      email:req.body.username,
      password:hash
    });
    newUser.save(function(err){
      if(err)console.log(err);
      else{
        res.render("paint");
      }
    })
  });

});

app.post("/login",function(req,res){

  const userName = req.body.username;
  const password = req.body.password;

  User.findOne({email:userName},function(err,foundUser){
    if(err)console.log(err);
    else{
      if(foundUser){
        bcrypt.compare(password, foundUser.password, function(err, result) {
          if(result===true)res.render("paint");
        });
      }
    }
  })

});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port,function(){
  console.log("server started on port 3000");
});
