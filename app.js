var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fileStreamRotator = require('file-stream-rotator');

// Uncaught Exceptions
var error = require('debug')('books:error');
process.on('uncaughtException', function(err) {
  error("I've crashed!!! - " + (err.stack || err));
});

// Controller definitions
var routes = require('./routes/index');
var users = require('./routes/users');
var books = require('./routes/books');

// Enable express session modules
const session = require('express-session');
const FileStore = require('session-file-store')(session);

var accessLogStream;
if (process.env.REQUEST_LOG_FILE) {
  var logDirectory = path.dirname(process.env.REQUEST_LOG_FILE);
  fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
  accessLogStream = fileStreamRotator.getStream({
    filename: process.env.REQUEST_LOG_FILE,
    frequency: 'daily',
    verbose: false
  });
}

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger(process.env.REQUEST_LOG_FORMAT || 'dev', {
  stream: accessLogStream ? accessLogStream : process.stdout
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Session handler
app.use(session({
  store: new FileStore({ path: "sessions" }),
  secret: 'keyboard animal',
  resave: true,
  saveUninitialized: true
}));
users.initPassport(app);

// Controller usage
app.use('/', routes);
app.use('/users', users.router);
app.use('/books', books);

// Vendor scripts
app.use('/vendor/bootstrap', express.static(path.join(__dirname, 'node_modules', 'bootstrap', 'dist')));
app.use('/vendor/jquery', express.static(path.join(__dirname, 'node_modules', 'jquery', 'dist')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    // util.log(err.message);
    res.status(err.status || 500);
    error((err.status || 500) + ' ' + error.message);
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
  error((err.status || 500) + ' ' + error.message);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
