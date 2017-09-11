var app = require('./../app');
var connection = app.connection;
var async = require('async');

function insertUser(user, callback) {

    var tasks = [
        function (callback) {
            var regex = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

            if (!regex.test(user.email)) return callback('email validation fail');
            else callback(null, user.email);
        },

        function (email, callback) {
            connection.query('select * from user_info where email = ?', user.email, function (err, rows) {
                if (err) return callback(err);
                else if (rows.length > 0) return callback('same email exist');
                else callback(null);
            })
        },

        function (callback) {
            connection.query('insert into user_info set ?', user, function (err, result) {
                if (err) return callback(err);
                else {
                    user.userId = result.insertId;
                    console.log(user);
                    callback(null, user);
                }
            })
        }
    ];

    async.waterfall(tasks, function (err, result) {
        if (err) {
            console.log('err:', err);
            callback(err);
        }
        else {
            console.log('done');
            callback(null, result);
        }
    });
}

function readUser(email, password, callback) {

    connection.query('select * from user_info where email = ? and password = ? order by id asc limit 1', [email, password], function (error, rows) {
       if (error) {
           console.log(error);
           callback(error);
       } else {
           if(rows.length > 0) {
               var result = {};
               result.userId = rows[0].id;
               result.email = rows[0].email;
               result.name = rows[0].name;
               callback(null, result);
           } else {
               var error = 'only signed - up user can login';
               callback(error);
           }
       }
    });
}

function deleteUser(user_id, callback) {

    console.log('user_id', user_id);

    connection.query('delete from user_info where id = ?', user_id, function(error, result) {
        if (result.affectedRows === 0) {
            var error_not_exist_user = 'user information not exist';
            callback(error_not_exist_user);
        } else {
            connection.query('delete from user_card_info where user_id = ?', user_id, function(error, result) {
                if(result.affectedRows === 0) {
                    callback(error_not_exist_user);
                } else {
                    callback(null, result);
                }
            });
        }
    });
}

function readAllUser(callback) {

    connection.query('select * from user_info', function (error, result) {
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
    insertUser: insertUser,
    deleteUser: deleteUser,
    readAllUser: readAllUser
};
