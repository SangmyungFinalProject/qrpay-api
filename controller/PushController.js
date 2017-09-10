var app = require('./../app');
var connection = app.connection;
var request = require('request');

function sendPush(push_token, total_price, payId, callback) {
    request({
        uri: "http://13.124.174.11:8080/qrpay-0.0.1-SNAPSHOT/push/send",
        method: "POST",
        form: {
            title: "QRpay",
            contents: total_price,
            deviceToken: push_token,
            payId: payId
        } }, function(error, response, body) {
        if(error) {
            callback(error);
        } else {
            callback(null, JSON.parse(body));
        }
    });
}

module.exports = {
    sendPush: sendPush
};
