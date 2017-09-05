var app = require('./../app');
var connection = app.connection;

function sendPush(push_token, total_price, callback) {

    callback(null, push_token);
}

module.exports = {
    sendPush: sendPush
};
