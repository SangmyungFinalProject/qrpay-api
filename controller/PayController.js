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
            console.log('pay_id', result.insertId);
            var payItemInfo = {
                item_id: info.item_id,
                pay_id: result.insertId
            };

            var query = 'insert into user_card_info set pay_id = (select id from pay_info where id = ?), item_id = (select id from item_info where id = ?)';

            connection.query(query, [payItemInfo.pay_id, payItemInfo.item_id], function(error, result) {
                if(error) {
                    console.log(error);
                    callback(error);
                } else {
                    callback(null, payItemInfo);
                }
            });

        }
    });

}

function cancelPay(pay_id, callback) {

    pay_id = Number(pay_id);

    console.log('pay_id', pay_id);

    connection.query('update pay_info set cancel = 1 where id = ? and cancel = 0', pay_id, function(error, result) {
        if (error) {
            console.log(error);
            callback(error);
        } else {
            if(result.affectedRows.length > 0) {
                callback(null, result);
            } else { //-> 처리가 되면 0 이상, 처리가 되지 않으면 0
                var err = 'already cancel';
                callback(err);
            }
        }
    });

}

function payList(card_id, callback) {

    var params = [
        card_id = Number(card_id)
    ];

    console.log('card_id', card_id);

    connection.query('select id from pay_info where card_id = ?', params, function(error, result) {
        if (error) {
            console.log(error);
            callback(error);
        } else {
            console.log(result);

            var pay_ids = [];

            var length = result.length;

            for (var i = 0 ; i < length ; i ++) {
                Number(result[i].id);
                pay_ids.push(result[i].id);
            }
            console.log('pay_ids', pay_ids);

            var params = [pay_ids];

            connection.query('select * from pay_item_info where pay_id in (?)', params, function(error, result) {
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
