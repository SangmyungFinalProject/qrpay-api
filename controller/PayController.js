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

function chargePay(ID, pay, callback) {

    console.log(ID);

    console.log('pay', pay);

    ID.user_id = Number(ID.user_id);
    ID.card_id = Number(ID.card_id);
    ID.item_id = Number(ID.item_id);

    pay.price_of_all = Number(pay.price_of_all);

    var user_id = ID.user_id;
    var card_id = ID.card_id;
    var price_of_all = pay.price_of_all;
    var time_of_pay = pay.time_of_pay;

    var pay_set = [ID.user_id, ID.card_id, pay];

    connection.query('insert into pay_info (user_id, card_id, price_of_all, time_of_pay) ' +
                    'values (user_id, card_id, price_of_all, time_of_pay)', function(error, result) {
        if (error) {
            console.log(error);
            callback(error);
        } else {
            console.log(result.insertId);
            var payItemInfo = {
                item_id: ID.item_id,
                pay_id: result.insertId
            };
            connection.query('insert into pay_item_info set ?', payItemInfo, function(error, result) {
                if(error) {
                    console.log(error);
                    callback(error);
                } else {
                    callback(null, result);
                }
            });

        }
    });

    //callback(null, pay);
}

function cancelPay(pay_id, callback) {

    pay_id = Number(pay_id);

    console.log('pay_id', pay_id);

    connection.query('update pay_info set cancel = 1 where id = ?', pay_id, function(error, result) {
        if(error) {
            console.log(error);
            callback(error);
        } else {
            callback(null, result);
        }
    });

    //callback(null, pay);
}

function payList(card_id, callback) {

    card_id = Number(card_id);

    console.log('card_id', card_id);

    connection.query('select id from pay_info where card_id = ?', card_id, function(error, result) {
        if(error) {
            console.log(error);
            callback(error);
        } else {
            console.log(result);

            var pay_id = [result.insertId];

            console.log(pay_id);

            connection.query('select * from pay_item_info where pay_id = ?', pay_id, function(error, result) {
                if(error) {
                    console.log(error);
                    callback(error);
                } else {
                    callback(null, result);
                }
            });
        }
    });

    //callback(null, pay);
}

module.exports = {
    chargePay: chargePay,
    cancelPay: cancelPay,
    payList: payList
};
