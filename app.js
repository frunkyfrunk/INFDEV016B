var express = require('express');
var path = require('path');
var logger = require('morgan');
var http = require('http');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
var server = http.createServer(app);

global.SOCKET_LIST = {};
global.PLAYER_LIST = [];
//---------------------------------------------------------------------------------------------------
//Own dependencies
var io = require('socket.io').listen(server);
var game = require('./game/game.js');

game.startGame(io);

/*-------------------------------------------------------*/
//Mongoose
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/DEV016B');
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
	console.log('MongoDB connected!');
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
		extended: true
	}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

app.get('/game', (req, res) => {
	res.sendfile('public/game.html');
})

//---------------------------------------SOCKETCODE---------------------------------------------------


//----------------------------------------------------------------------------------------------------
//Server
server.listen(3000);

//-----------------------------------------------------------------------------------------------------
//-----------------------------------------JUNK--------------------------------------------------------

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
