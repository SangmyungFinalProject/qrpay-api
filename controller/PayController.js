var app = require('./../app');
var connection = app.connection;
var PushController = require('./PushController');

function chargePay(payInfo, callback) {

    console.log(payInfo);

    var errorSet = {
        dataNull: '1',
        boundsOver: '2',
        validOver: '3',
        notExist: '5',
        syntaxError: '6'
    };

    /*connection.query('insert into pay_info (total_price, card_id, user_id, item_id) values (?)',
     [payInfo], function(error, result) {
     if (error) {
     console.log(error);
     callback(error);
     } else {
     console.log('pay_id', result.insertId);
     var payItemInfo = {
     item_id: payInfo.item_id,
     pay_id: result.insertId
     };

     var query = 'insert into pay_item_info set pay_id = (select id from pay_info where id = ?), item_id = (select id from item_info where id = ?)';

     connection.query(query, [payItemInfo.pay_id, payItemInfo.item_id], function(error, result) {
     if(error) {
     console.log(error);
     callback(error);
     } else {
     PushController.sendPush(payInfo.user_id, payInfo.total_price, function (err, result) {
     if (err)
     {
     console.log(err);
     callback(err);
     } else {
     callback(null, result);
     }
     });
     }
     });
     }
     }); */

    if (isNaN(payInfo.user_id) || isNaN(payInfo.cvc) || isNaN(payInfo.card_number) || isNaN(payInfo.total_price)) {
        callback(errorSet.dataNull);
    } else {
        /*if(시간 비교해서 1분 넘었을 경우) {
         var error = 'time over'
         console.log(error);
         callback(error);
         } else */
            connection.query('select id, bounds, valid_date from card_info where number = ? and cvc = ?', [payInfo.card_number, payInfo.cvc], function (error_miss, rows) {
                if (rows.length === 0) {
                    callback(errorSet.notExist);
                } else {
                    console.log('card_id:', rows[0].id, 'bounds:', rows[0].bounds, 'valid_date:', rows[0].valid_date);

                    var bounds_user = Number(rows[0].bounds);

                    var dt = new Date();

                    // /var d = dt.toFormat('YYYY-MM-DD HH24:MI:SS');
                    var YY_MM = (Number(dt.toFormat('YYYY')) % 100 * 100 + Number(dt.toFormat('MM')));

                    if ((YY_MM - Number(rows[0].valid_date)) > 0) {
                        callback(errorSet.validOver);
                    } else {
                        var query = 'select * from user_card_info where user_id = ? and card_id = ?';
                        connection.query(query, [payInfo.user_id, rows[0].id], function(error, rows) {
                            if(rows.length === 0) {
                                callback(errorSet.notExist);
                            } else {
                                var bounds_calc = bounds_user - payInfo.total_price;

                                if (bounds_calc < 0) {
                                    callback(errorSet.boundsOver);
                                } else {
                                    connection.query('update card_info set bounds = ? where id = 6', bounds_calc, function (error, result) {
                                        if (error) {
                                            callback(errorSet.syntaxError);
                                        } else {
                                            callback(null, result);
                                        }
                                    });
                                }
                            }
                        });
                    }
                }
            });
        }


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
