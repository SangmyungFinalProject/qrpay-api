/**
 * Created by woowahan on 2017. 5. 3..
 */


var express = require('express');
var router = express.Router();

var mysql = require('mysql');

var connection = mysql.createConnection({
    port: 3306,
    database: 'qrpay',
    host: 'localhost',
    user: 'root',
    password: '@cosin1210'
});

function insertUser(user, callback) {

    console.log('user', user);

    connection.query('insert into user_info set ?', user, function(error, result, fields) {
        if (error) {
            console.log(error);
        } else {
            console.log(result);
        }
    });

    callback(null, user);
}

function readUser(user, callback) {

    console.log('user', user);

    callback(null, user);
}

module.exports = {
    readUser: readUser,
    insertUser: insertUser
};
