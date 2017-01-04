var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

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

/*------------------------------------------------------*/

//Home page
app.get('/home', (req, res) => {
  res.sendfile('public/index.html');
})

app.post('/hitman', (req, res) => {
  var user = req.param('user');
  var money = req.param('money');

  console.log('Username: ' + user);
  console.log('Money: ' + money);

  db.collection('user').findOneAndUpdate(
	{username: user},
	{$inc:{money: parseInt(money)}},
	{returnNewDocument : true}
  )
  console.log('Money updated!');

  //res.send('Mission passed');
})

/*----------------------------------------*/

//Hitman page
app.get('/hitman', (req, res) => {
  res.sendfile('public/Hitman.html');
})

app.post('/hitman', (req, res) => {
  var user = req.body.user;
  var money = req.body.reward;

  console.log('Username: ' + user);
  console.log('Money: ' + money);

  db.collection('user').findOneAndUpdate(
	{username: user},
	{$inc:{money: parseInt(money)}},
	{returnNewDocument : true}
  )
  console.log('Money updated!');

  //res.send('Mission passed');
})

app.get('/hello', (req, res) => {
  res.send('Hello!');
})

/*-----------------------------------------------------*/

/* DATABASE */
//Info
var db;
var URI = 'mongodb://localhost:27017/DEV016B';
var port = 3000;

//Server
MongoClient.connect(URI, (err, database) => {
	if (err) return console.log(err)
		db = database
		app.listen(port, () => {
		console.log('listening on ' + port)
	})
})


// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});

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
