var app = require('./../app');
var connection = app.connection;

function sendPush(token, total_price, callback) {

    callback(null, true);
}

module.exports = {
    sendPush: sendPush
};
