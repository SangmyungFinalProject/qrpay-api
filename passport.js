/**
 * Created by woowahan on 2017. 8. 21..
 */
var exports = module.exports = {};
var app = require('./app');
var UserHandler = require('./controller/UserController');
var LocalStrategy = require('passport-local').Strategy;

exports.initPassport = function (passport) {
// 인증 method 정의 - 가입.
    passport.use('local-signup', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true,
            session: false
        }
        , function (req, email, password, done) {
            createUser = function () {
                var user = {};
                user.name = req.body.name;
                user.email = email;
                user.password = password;
                UserHandler.insertUser(user, function (err, insertUser) {

                    if (err || !insertUser) {
                        console.error(err);
                        console.error(err);
                        return done(null, false);
                    }

                    user.userId = insertUser.userId;
                    delete user.password;
                    console.log('user local-signup : ' + user.userId);

                    return done(null, user);
                });
            };
            process.nextTick(createUser);
        }
    ));

// 인증 method 정의 - 로그인
    passport.use('local-login', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true,
            session: false
        }
        , function (req, email, password, done) {
            readUser = function () {
                UserHandler.readUser(email, password, function (err, result) {

                    console.log('passport.js :err ', err);
                    console.log('passport.js :result ', result);

                    if (err) {
                        console.error(err);
                        console.error(err);
                        return done(err, false);
                    }

                    var user = {};
                    user.userId = result.userId;
                    user.email = email;
                    user.name = result.name;

                    console.log('user local-login : ' + JSON.stringify(user));

                    return done(null, user);
                });
            };
            process.nextTick(readUser);
        }
    ));
};
