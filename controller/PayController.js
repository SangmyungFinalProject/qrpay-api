var app = require('./../app');
var connection = app.connection;

function chargePay(info, callback) {

    console.log(info);

    var user_id = info.user_id;
    var card_id = info.card_id;
    var item_id = info.item_id;
    var total_price = info.total_price;

    var pay_set = [total_price, card_id, user_id, item_id];

    connection.query('insert into pay_info (total_price, card_id, user_id, item_id) values (?, ?, ?, ?)',
                    pay_set, function(error, result) {
        if (error) {
            console.log(error);
            callback(error);
        } else {
            console.log(result.insertId);
            var payItemInfo = {
                item_id: info.item_id,
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

            var pay_ids = [];

            var length = result.length;

            for (var i = 0 ; i < length ; i ++) {
                pay_ids.push(result[i].id);
            }
            console.log('pay_ids', pay_ids);

            connection.query('select * from pay_item_info where pay_id in (?)', pay_ids, function(error, result) {
                if (error) {
                    console.log(error);
                    callback(error);
                } else {
                    callback(null, result);
                }
            });
        }
    });

}

module.exports = {
    chargePay: chargePay,
    cancelPay: cancelPay,
    payList: payList
};
