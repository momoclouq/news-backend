require('dotenv').config();

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const helmet = require("helmet");
const compression = require("compression");
const cors = require('cors');

//set up mongoose connection
const mongoose = require('mongoose');
//the user name and key will be hidden on the development branch
const mongoDB = process.env.DB_ROOT || 'mongodb+srv://momocloud:Tuikhongbiet123@cluster0.qmodu.mongodb.net/database1?retryWrites=true&w=majority';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set("useCreateIndex", true);
let db = mongoose.connection;
db.on('error', console.error.bind(console,'MongoDB connection error:'));
db.once("open", function(){
    console.log("we are in");
});

mongoose.Promise = global.Promise;

//auth file
require('./auth/auth');

var indexRouter = require('./routes/index');

var app = express();

//cors usage for all routes
app.use(cors());

//extra middleware for better connection and security
app.use(compression());
app.use(helmet());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

module.exports = app;
