// Create web server
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// create database
var Datastore = require('nedb');
var db = new Datastore({ filename: 'comments.db', autoload: true });

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// allow CORS
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

// start web server
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

// get all comments
app.get('/comments', function (req, res) {
  db.find({}, function (err, docs) {
    res.send(docs);
  });
});

// add new comment
app.post('/comments', function (req, res) {
  var comment = {
    name: req.body.name,
    text: req.body.text,
    date: new Date()
  };

  db.insert(comment, function (err, newDoc) {
    db.find({}, function (err, docs) {
      res.send(docs);
    });
  });
});

// delete comment
app.delete('/comments/:id', function (req, res) {
  db.remove({ _id: req.params.id }, { multi: false }, function (err, numRemoved) {
    db.find({}, function (err, docs) {
      res.send(docs);
    });
  });
});