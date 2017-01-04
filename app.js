var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var http = require('http');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = module.exports = express();

var User = require('./models/user')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', routes);
app.use('/users', users);

/*-------------------------------------------------------*/
//Mongoose
mongoose.connect('mongodb://localhost:27017/DEV016B-Test');
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('MongoDB connected!');
});

/*------------------------------------------------------*/
//Hitman page
app.get('/hitman', (req, res) => {
  res.sendfile('public/Hitman.html');
})

app.post('/reward/:username', (req, res) => {
	var username;

	if(req.params.username == null){ username = req.body.player;}
	else{ username = req.params.username;}

	rewardPlayer(username);

	res.status(200);
    	res.send('User has been rewarded!').end();

})

/*------------------------------------------------------------*/
//Fuctions Mongoose
function rewardPlayer(name){
	console.log('Player: ' + name);
	var query = User.findOne({ username: name }, function (err, doc){
		var oldMoney = doc.money;
		var newMoney = oldMoney + 25;

		console.log('Old money: ' + oldMoney);
		console.log('New money: ' + newMoney);

		doc.money = newMoney;
		doc.save();
		console.log('Player is rewarded $' + (newMoney - oldMoney));
	});
}

/*------------------------------------------------------------*/
//Server
var server = app.listen(3000, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://localhost:%s", port)
})
/*------------------------------------------------------------*/

/* ERROR HANDLING */
/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
