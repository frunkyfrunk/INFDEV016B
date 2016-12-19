var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017/DEV016B';
var passwordHolder;
var usernameHolder;
var higherLower = require('./routes/higher-lower');
var path = require('path');
var bodyParser = require('body-parser');

//jenkins commmit test, delete this line

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/views/index.html')
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/higher-lower', higherLower);


http.listen(3000, function () {
	console.log("Server started");
});



io.on('connection', function (socket) {
	console.log('a user connected');
	// socket.id = Math.random();
	// SOCKET_LIST[socket.id] = socket;

	socket.on('signInData', function (data) {
		if (isPasswordValid(data)) {
			socket.emit('signInResponse', {
				success: true
			});
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
		console.log('user disconnected');
	});

});

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