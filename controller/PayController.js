var connection = require('../app').connection;

function chargePay(pay, callback) {

    pay.price = Number(pay.price);

    console.log('pay', pay);

    callback(null, pay);
}

function cancelPay(pay, callback) {

    console.log('pay', pay);

    callback(null, pay);
}

module.exports = {
    chargePay: chargePay,
    cancelPay: cancelPay
};
