<<<<<<< HEAD
var app = require('./../app');
var connection = app.connection;
=======
/*var app = require('./../app');
var connection = app.connection;*/

var mysql = require('mysql');

var connection = mysql.createConnection({
    port: 3306,
    database: 'qrpay',
    host: 'localhost',
    user: 'root',
    password: '@cosin1210'
});
>>>>>>> API(결제, 결제 취소, 결제 목록, 카드 삭제) 초안 작성)

function insertUser(user, callback) {

    console.log('user', user);

    console.log('connection', connection);

    connection.query('insert into user_info set ?', user, function(error, result) {
        if (error) {
            callback(error, result);
        } else {
            callback(null, user);
        }
    });
}

function readUser(user, callback) {

    var userInfo = [user.email, user.password];

    connection.query('select * from user_info where email = ? and password = ? ',userInfo, function (error, result) {
       if (error) {
           console.log(error);
           callback(error);
       } else {
           callback(null, result);
       }
    });
}

module.exports = {
    readUser: readUser,
    insertUser: insertUser
};
