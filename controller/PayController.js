var app = require('./../app');
var connection = app.connection;
var PushController = require('./PushController');
var async = require('async');
var aes = require('aes-cross');

var errorSet = {
    dataNull: '1',
    boundsOver: '2',
    validOver: '3',
    timeOver: '4',
    notExist: '5',
    syntaxError: '6'
};

function chargePay(encryptedData, callback) {

    var payInfo = decrypt(encryptedData);

    if (payInfo === errorSet.timeOver) {
        return callback(errorSet.timeOver);
    }

    var dt = new Date();

    //var d = dt.toFormat('YYYY-MM-DD HH24:MI:SS');
    var YY_MM = (Number(dt.toFormat('YYYY')) % 100 * 100 + Number(dt.toFormat('MM')));

    var pay_card_id = 0;
    var valid_date = '0000';

    var bounds_user = 0;
    var bounds_calc = 0;

    var tasks = [
        function (callback) {
            if (isNaN(payInfo.userId) || isNaN(payInfo.cvc) || isNaN(payInfo.card_number) || isNaN(payInfo.total_price))
                return callback(errorSet.dataNull);
            else callback(null);
        },

        function (callback) {
            var query = 'select id, bounds, valid_date from card_info where number = ? and cvc = ?';
            connection.query(query, [payInfo.card_number, payInfo.cvc], function (error, rows) {
                if (error) return callback(errorSet.syntaxError);
                else if (rows.length === 0) return callback(errorSet.notExist);
                else {
                    pay_card_id = Number(rows[0].id);
                    valid_date = rows[0].valid_date;
                    bounds_user = Number(rows[0].bounds);
                    callback(null);
                }
            })
        },

        function (callback) {
            if ((YY_MM - valid_date) > 0) return callback(errorSet.validOver);
            else callback(null);
        },

        function (callback) {
            var query = 'select * from user_card_info where user_id = ? and card_id = ?';
            connection.query(query, [payInfo.userId, pay_card_id], function (error, rows) {
                if (error) return callback(errorSet.syntaxError);
                else if (rows.length === 0) return callback(errorSet.notExist);
                else {
                    bounds_calc = bounds_user - payInfo.total_price;
                    console.log(bounds_calc);
                    callback(null);
                }
            })
        },

        function (callback) {
            if (bounds_calc < 0) return callback(errorSet.boundsOver);
            else callback(null);
        },

        function (callback) {
            var query = 'update card_info set bounds = ? where id = ?';
            connection.query(query, [bounds_calc, pay_card_id], function (error, result) {
                if (error) return callback(errorSet.syntaxError);
                else callback(null);
            })
        },

        function (callback) {
            var query = 'insert into pay_info (total_price, card_id, user_id) values (?, ?, ?)';
            connection.query(query, [payInfo.total_price, pay_card_id, payInfo.userId], function (error, result) {
                if (error) return callback(errorSet.syntaxError);
                else callback(null, result.insertId);
            })
        },

        function (payId, callback) {
            PushController.sendPush(payInfo.deviceToken, payInfo.total_price, payId, function (error, result) {
                if (error) return callback(error);
                else callback(null);
            })
        }
    ];

    async.waterfall(tasks, function (err) {
        if (err) {
            console.log('err:', err);
            callback(err);
        }
        else {
            console.log('done');
            callback(null);
        }
    });
}

function cancelPay(pay_id, callback) {

    pay_id = Number(pay_id);

    var errorSet = {
        notExist: '1',
        alreadyCancel: '2',
        syntaxError: '3'
    };

    connection.query('select * from pay_info where id = ?', pay_id, function (error, rows) {
        if (rows.length === 0) {
            callback(errorSet.notExist);
        } else {
            connection.query('update pay_info set cancel = 1 where id = ? and cancel = 0', pay_id, function (error, result) {
                if (error) {
                    callback(errorSet.syntaxError);
                } else if (result.affectedRows <= 0) {
                    callback(errorSet.alreadyCancel);
                } else { //-> 처리가 되면 1 이상, 처리가 되지 않으면 0 이하
                    callback(null);
                }
            });
        }
    });
}

function payList(userId, callback) {

    connection.query('select * from pay_info where user_id = ?', userId, function (error, rows) {
        if (error) {
            callback(error);
        } else {
            callback(null, rows);
        }
    });
}

function decrypt(encryptedData) {
    // decrypt encryptedData

    aes.setKeySize(256);
    var iv = new Buffer(new Array(16));
    var key = new Buffer(new Array(32));

    var decryptedData = aes.decText(encryptedData.crypto, key, iv);

    var data = JSON.parse(decryptedData);

    var payInfo = {
        card_company: data.cardDisplayModel.cardCompany,
        card_number: data.cardDisplayModel.cardNumber,
        cvc: data.cardDisplayModel.cvc,
        total_price: Number(encryptedData.total_price),
        userId: data.userId,
        deviceToken: data.token,
        time: data.time,
        pos_time: encryptedData.pos_time
    };


    if (Number(payInfo.pos_time)- Number(payInfo.time) < 60 * 1000) {
        return errorSet.timeOver;
    }

    console.log(payInfo);

    return payInfo;
}

module.exports = {
    chargePay: chargePay,
    cancelPay: cancelPay,
    payList: payList
};
