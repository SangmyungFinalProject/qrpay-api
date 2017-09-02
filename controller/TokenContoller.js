var app = require('./../app');
var connection = app.connection;

function saveToken(userId, push_token, callback) {

    var query = 'insert into push_token_info set user_id = (select id from user_info where id = ?), token = ?';
    connection.query(query, [userId, push_token], function (error, result) {
        if (error) {
            console.log(error);
            callback(error);
        } else {
            callback(null, result);
        }
    });
}

module.exports = {
    saveToken: saveToken
};