var app = require('./../app');
var connection = app.connection;

function saveToken(userId, token, callback) {

    callback(null, true);
}

module.exports = {
    saveToken: saveToken
};