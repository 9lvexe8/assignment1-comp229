const express = require("express");
const bodyParser = require("body-parser");
const mongoose=require("mongoose");
const app = express();
Feed = require("./models/feed");


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//mongoose.connect("mongodb+srv://Username:Password@cluster0.yhptq.mongodb.net/feedback", { useUnifiedTopology: true, useNewUrlParser: true });

// -*-*-*-*-*-*-*-*Routs-*-*-*-*-*-*-*-*



app.get("/", function(req,res) {
  res.render("home");
});
app.get("/home", function(req,res) {
  res.render("home");
});
app.get("/about", function(req,res) {
  res.render("about");
});
app.get("/contact", function(req,res) {
  res.render("contact");
});

// _*_*_*_*_*_*_*_*_*_*_*_*create data Schema for Feedback form_*_*_*_*_*_*_*_*_*_*_*_*

 app.post("/",function(req,res){
   let newFeed= new Feed({
     fullName:req.body.fullName,
     mobile:req.body.mobile,
     email:req.body.email,
     content:req.body.content
   });
   newFeed.save();
   res.redirect("/");
 })


var port = process.env.PORT || 3000;
app.listen(port, function() {
      console.log("server is started on port 3000");});
