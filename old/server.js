const express = require('express');
const bodyParser= require('body-parser')
const MongoClient = require('mongodb').MongoClient

//App
const app = express();

//App.use
app.use(bodyParser.urlencoded({extended: true}))

//Database
var db

//Servers
MongoClient.connect('mongodb://localhost:27017/DEV016B', (err, database) => {
	if (err) return console.log(err)
		db = database
		app.listen(3000, () => {
		console.log('listening on 3000')
	})
})

//Pages
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/client/Hitman.html')
})

app.post('/', (req, res) => {
  console.log('Username: ' + req.body.username);
  console.log('Money: ' + req.body.money);

  db.collection('user').findOneAndUpdate(
	{username: req.body.username},
	{$inc:{money: parseInt(req.body.money)}}
  )
  console.log('Money updated!');

  //res.send('Mission passed');
})

app.use(express.static(__dirname)); //this will make index.html available to every request

// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});