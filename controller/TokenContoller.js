var app = require('./../app');
var connection = app.connection;

function saveToken(userId, push_token, callback) {

    callback(null, true);
}

module.exports = {
    saveToken: saveToken
};