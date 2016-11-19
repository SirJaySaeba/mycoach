var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var nunjucks  = require('nunjucks');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// port
var port = 3012;
if ( process.env.PORT && (parseInt(process.env.PORT, 10) > 0) ) {
  port = 12 + parseInt(process.env.PORT, 10);
}

app.listen(port);

nunjucks.configure('views', {
  autoescape: true,
  express   : app,
  watch     : true
});

app.get('/', function(req, res) {
  res.render('index.html', {
    title : 'My Coach Startseite',
    content : 'startseite',
    items : [
      { name : 'Sergej' },
      { name : 'Alex' },
      { name : 'Geräte' },
      { name : 'Preise' },
    ]
  });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
// TODO: ADD FAVICON
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

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
