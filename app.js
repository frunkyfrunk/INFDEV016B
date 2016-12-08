var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/client/index.html')
})
app.use('/client',express.static(__dirname + '/client'));

http.listen(3000, function () {
	console.log("Server started");
})

io.on('connection', function(socket){
  console.log('a user connected');
  // socket.id = Math.random();
  // SOCKET_LIST[socket.id] = socket;
  
  socket.on('signInData',function(data){
	  if(data.username == "mert"){
		socket.emit('signInResponse',{success:true});
		useDatabase(searchUserDetails(data));	
	  } else {
		socket.emit('signInResponse',{success:false});
	  }
	  
  });
  
  socket.on('registerData', function(data){
	useDatabase(insertUserDetails(data));	
  });
  
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  
});


var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
  // Connection URL
var url = 'mongodb://localhost:27017/DEV016B';
// Use connect method to connect to the server


function useDatabase(mongoQuery) {
	MongoClient.connect(url, function(err, db) {
		if (err) {
			console.log('Unable to connect to the mongoDB server. Error:', err);
		}
		else{
			console.log("Connected to the mongoDB server");
		mongoQuery(db,function(){			
			db.close();
			console.log("Disconnected from the mongoDB server");
		});	
		}			
})};

function insertUserDetails(data){
	var insertDocument = function(db, callback) {
		db.collection('user').insertOne({
			"username" : data.username,
			"password" : data.password
		},function(err, result) {
			assert.equal(err, null);
			console.log("Inserted a user into the user collection.");
			callback();
			});
		};
	return insertDocument;
};

function searchUserDetails(data){
	var findUser = function(db, callback) {
		var cursor = db.collection('user').find( { "username": "Frunk" },
		function(err, result) {
			assert.equal(err, null);
			callback();
			});
			console.log(cursor.username);
		};
		
		return findUser;
};
