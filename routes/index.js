var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('isAuthenticated : ',req.isAuthenticated());
  console.log('user : ', req.user);
  res.send('hello');
});

router.post('/login', passport.authenticate('local', {failureRedirect: '/login', failureFlash: true}),
            // 인증 실패 시 401 리턴, {} -> 인증 스트레티지
    function (req, res) {
        res.redirect('/');
    });

passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true //인증을 수행하는 인증 함수로 HTTP request를 그대로  전달할지 여부를 결정한다
}, function (req, username, password, done) {
    if(username === 'user001' && password === 'password'){
        return done(null, {
            'user_id': username
        });
    } else {
        return done(false, null)
    }
}));

passport.serializeUser(function (user, done) {
    done(null, user)
});

passport.deserializeUser(function (user, done) {
    console.log(user);
    done(null, user);
});


module.exports = router;
