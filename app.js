if(process.env.NODE_ENV !== "production"){
  require("dotenv").config()
}



const express = require("express");
const bodyParser = require("body-parser");
const mongoose=require("mongoose");
const app = express();
Feed = require("./models/feed");
const bcrypt = require("bcrypt");
const initializePassport = require("./passport-config");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override")



initializePassport(
    passport,
    email => users.find(user => user.email === email), // Check if the email it's the same as the one saved on the database from login
    id => users.find(user => user.id === id)
  )


const users = []   //Fill all hashed passwords from users


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(express.urlencoded({extended: false}));
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false, // we won't resave the session variable if nothing is changed
  saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"))

//Configuring Login
app.post("/login", checkNotAuthenticated, passport.authenticate("local", {
  successRedirect: "/home",
  failureRedirect: "/login",
  failureFlash: true
}))

// Configuring the register post functionlity
app.post("/register", checkNotAuthenticated, async(req, res) => {
    try
    {
      const hashedPassword = await bcrypt.hash(req.body.password, 10); //Will pass every password it's inputed on register
      users.push({
        id: Date.now().toString(),
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
      })
      res.redirect("/login")
    }
    catch (e) //error
    {
      console.log(e);
      res.redirect("/register")
    }
});


// -*-*-*-*-*-*-*-*Routs-*-*-*-*-*-*-*-*

app.get("/", checkAuthenticated, (req,res) => {
  res.render("login.ejs");
});
app.get("/login", checkNotAuthenticated, (req,res) => {
  res.render("login.ejs");
});
app.get("/register", checkNotAuthenticated, (req,res) => {
  res.render("register.ejs");
});
app.get("/home", (req,res) => {
  res.render("home");
});
app.get("/about", (req,res) => {
  res.render("about");
});
app.get("/contact", (req,res) => {
  res.render("contact");
});

app.delete("/logout", (req, res) => {
  req.logout(req.user, err => {
      if (err) return next(err)
      res.redirect("/")
  })
})

function checkAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next()
  }
  res.redirect("/login")
}

function checkNotAuthenticated(req, res, next){
  if(req.isAuthenticated()){
     return res.redirect("/")
  }
  next()
}

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


 console.log(users); //Display newly registered people

var port = process.env.PORT || 3000;
app.listen(port, function() {
      console.log("server is started on port 3000");});
