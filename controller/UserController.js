var app = require('./../app');
var connection = app.connection;

function email_check(email, callback) {
    var regex = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
    callback(regex.test(email));
}

function insertUser(user, callback) {

    console.log('user', user);

    console.log('connection', connection);


    email_check(user.email, function(result) {
        if(result) {
            connection.query('insert into user_info set ?', user, function (error, result) {
                if (error) {
                    callback(error, result);
                } else {
                    callback(null, user);
                }
            });
        } else {
            var error = 'email validation fail';
            callback(error);
        }
    });
}

function readUser(user, callback) {

    var userInfo = [user.email, user.password];

    connection.query('select * from user_info where email = ? and password = ? ', userInfo, function (error, result) {
       if (error) {
           console.log(error);
           callback(error);
       } else {
           callback(null, result);
       }
    });
}

function deleteUser(user_id, callback) {

    console.log('user_id', user_id);

    connection.query('delete from user_info where id = ?', user_id, function(error) {
        if (error) {
            console.log(error);
            callback(error);
        } else {
            connection.query('delete from user_card_info where user_id = ?', user_id, function(error, result) {
                if(error) {
                    console.log(error);
                    callback(error);
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
