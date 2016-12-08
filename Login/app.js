var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose/');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();
var server = app.listen(8081, function() {
    console.log(new Date().toISOString() + ": server started on port 8081");
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

//Passport init
app.use(passport.initialize());
app.use(passport.session());

//Login post
app.post('/login',
  passport.authenticate('local', {
    successRedirect: '/loginSuccess',
    failureRedirect: '/loginFailure'
  })
);

//Login handlers
//IF login failed do this
app.get('/loginFailure', function(req, res, next) {
  res.send('Failed to authenticate');
});

//If login succeeded do this
app.get('/loginSuccess', function(req, res, next) {
  res.send('Successfully authenticated');
});

//Passport Serializer
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

//Passport strategy
passport.use(new LocalStrategy(function(username, password, done) {
  process.nextTick(function() {
    // Auth Check Logic
  });
}));

//Views
app.get('/login', function(req, res) {
  res.sendfile('views/login.html');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//Mongoose
mongoose.connect('mongodb://localhost/GameDB');

var Schema = mongoose.Schema;
var UserDetail = new Schema({
      username: String,
      password: String
    }, {
      collection: 'login'
    });
var UserDetails = mongoose.model('login', UserDetail);

//Passport Strategy
passport.use(new LocalStrategy(function(username, password, done) {
  process.nextTick(function() {
    UserDetails.findOne({
      'username': username, 
    }, function(err, user) {
      if (err) {
        return done(err);
      }

      if (!user) {
        return done(null, false);
      }

      if (user.password != password) {
        return done(null, false);
      }

      return done(null, user);
    });
  });
}));



module.exports = app;
