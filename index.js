var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser());

// connection with db 
mongoose.connect('mongodb://127.0.0.1:27017/myapp').then(() => {
    console.log("Database connected !")
})
    .catch(error => console.log("error->", error));

const user = require('./routes/user-routes.js');
const menuData = require('./menu.js');

app.use('/user', user);
app.use('', menuData);

app.listen(3000);