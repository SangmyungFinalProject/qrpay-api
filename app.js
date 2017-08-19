var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var os = require('os');
var app = express();

var host = os.hostname();

var connection = mysql.createPool({
    connectionLimit: 40,
    acquireTimeout: 30000,
    port: 3306,
    database: 'qrpay',
    host: '13.124.113.193',
    user: 'root',
    password: 'blaster1122'
});

if (host === 'MS-20ui-MacBook-Pro.local') {
    connection = mysql.createPool({
        connectionLimit: 40,
        acquireTimeout: 30000,
        port: 3306,
        database: 'qrpay',
        host: 'localhost',
        user: 'root',
        password: '@cosin1210'
    });
}

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

exports.connection = connection;

var index = require('./routes/index');
var users = require('./routes/users');
var join = require('./routes/join');
var cards = require('./routes/cards');
var pay = require('./routes/pay');

app.use('/', index);
app.use('/users', users);
app.use('/join', join);
app.use('/cards', cards);
app.use('/pay', pay);


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