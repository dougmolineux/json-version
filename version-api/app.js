var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/version';
var bodyParser = require('body-parser');
var appDb;

app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

MongoClient.connect(url, function(err, resultDb) {
  	console.log("Connected correctly to server");
	appDb = resultDb;
});

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

app.use(function(req, res, next) {
	req.db = appDb;
	next();
});

var routes = require('./routes')(app);
var server = app.listen(3000);

