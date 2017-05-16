/**
 * Created by ms_20 on 2017. 5. 9..
 */


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
