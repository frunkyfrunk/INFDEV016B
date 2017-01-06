var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017/DEV016B';
var passwordHolder;
var usernameHolder;

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/client/index.html')
})
app.use('/client', express.static(__dirname + '/client'));

http.listen(3000, function () {
	console.log("Server started");
})

var SOCKET_LIST = {};
var PLAYER_LIST = [];

io.on('connection', function (socket) {
	 socket.id = Math.random();
	 socket.x = 0;
	 socket.y = 0;
	 SOCKET_LIST[socket.id] = socket;
	 PLAYER_LIST.push(socket.id);
	 
	 console.log('active players ' + PLAYER_LIST.length);
	 console.log('socket ' + socket.id + ' has connected to the server ');

	socket.on('signInData', function (data) {
		if (isPasswordValid(data)) {
			socket.emit('signInResponse', {
				success: true
			});
			socket.broadcast.emit('onlinePlayersUpdate', {onlinePlayers:  PLAYER_LIST.length});
		} else {
			socket.emit('signInResponse', {
				success: false
			});
		}

	});

	socket.on('registerData', function (data) {
		if (isUsernameAvailable(data)) {
			socket.emit('registerResponse', {success: true});
			//useDatabase(insertUserDetails(data));

		} else {
			socket.emit('registerResponse', {success: false});
		}
	});

	socket.on('disconnect', function () {
		console.log('socket ' + socket.id  + ' disconnected');
		PLAYER_LIST.splice(socket.id,1);
		socket.broadcast.emit('onlinePlayersUpdate', {onlinePlayers:  PLAYER_LIST.length});
	});

});

setInterval(function() {
	var pack = [];
	
	for(var i in SOCKET_LIST){
		var socket = SOCKET_LIST[i];
		socket.x++;
		socket.y++;
		pack.push({
			x:socket.x,
			y:socket.y
		});
	}
	
	for(var i in SOCKET_LIST){
		var socket = SOCKET_LIST[i];
		socket.emit('newPositions', pack);
	}	
}, 1000/25);


// Use connect method to connect to the server
function useDatabase(mongoQuery) {
	MongoClient.connect(url, function (err, db) {
		if (err) {
			console.log('Unable to connect to the mongoDB server. Error:', err);
		} else {
			console.log("Connected to the mongoDB server");
			mongoQuery(db, function () {
				db.close();
				console.log("Disconnected from the mongoDB server");
			});
		}
	})
};


function insertUserDetails(data) {
	var insertDocument = function (db, callback) {
		db.collection('user').insertOne({
			"username": data.username,
			"password": data.password
		}, function (err, result) {
			assert.equal(err, null);
			console.log("Inserted a user into the user collection.");
			callback();
		});
	};
	return insertDocument;
};

function searchUserDetails(data) {
	var findDocuments = function (db, callback) {
		db.collection('user').find({
			"username": data.username
		})
		.toArray(function (err, docs) {
			assert.equal(err, null);
			if (typeof docs[0] !== 'undefined') {
				usernameHolder = docs[0]["username"];
				passwordHolder = docs[0]["password"];	
			}
			callback(docs);
			
		});
	};
	return findDocuments;
};

function isPasswordValid(data) {
	useDatabase(searchUserDetails(data));
	if (data.password == passwordHolder) {
		console.log("Password is correct");
		return true;
	} else {
		console.log("Password is incorrect")
		return false;
	};
};

function isUsernameAvailable(data) {
	useDatabase(searchUserDetails(data));
	if (data.username == usernameHolder) {
		console.log("Username is unavailable");
		return false;
	} else {
		console.log("Username is avialable")
		return true;
	};
};