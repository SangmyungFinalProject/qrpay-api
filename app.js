var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var os = require('os');
var redis = require('redis');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var passport = require('passport');
var app = express();
var host = os.hostname();
var redisConfig = require('./config/redisConfig');

console.log('host', host);

var connection = mysql.createPool({
    connectionLimit: 40,
    acquireTimeout: 30000,
    port: 3306,
    database: 'qrpay',
    host: '13.124.113.193',
    user: 'root',
    password: 'blaster1122'
});

// todo host 분기처리는 config 내에서 !!
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
    redisConfig = {
        url: 'redis://localhost:6379',
        address: 'localhost',
        port: 6379,
        no_ready_check: true,
        db: 0,
        ttl: 2592000
    };
}
if (host === 'gimjihun-ui-MacBook-Pro.local') {
    redisConfig = {
        url: 'redis://localhost:6379',
        address: 'localhost',
        port: 6379,
        no_ready_check: true,
        db: 0,
        ttl: 2592000
    };
}

var client = redis.createClient(redisConfig.port, redisConfig.address);
var redisStore = new RedisStore({host: redisConfig.url, port: redisConfig.port, client: client, ttl: redisConfig.ttl});
exports.connection = connection;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(session(
    {
        // 비밀키
        secret: 'user-session',
        store: redisStore,
        cookie: {
            secure: false,
            maxAge: 1000 * 60 * 60 * 24 * 30 // 쿠키 유효기간 1달
        },
        saveUninitialized: true,
        resave: true
    }
));




// 로그인 성공 시 유저 정보 저장
passport.serializeUser(function (user, done) {
    console.log('serialize : ' + JSON.stringify(user));
    done(null, user);
});

// 인증 후, 페이지 접근시 마다 사용자 정보를 Session에서 읽어옴.
passport.deserializeUser(function (user, done) {
    //findById(id, function (err, user) {
    console.log('deserialize : ' + JSON.stringify(user));
    done(null, user);
    //});
});

app.use(passport.initialize());
app.use(passport.session());

require('./passport').initPassport(passport); // poassport initPassport 에서 connection 사용


exports.passport = passport;

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


// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;