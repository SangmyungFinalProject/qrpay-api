/**
 * Created by ms_20 on 2017. 5. 3..
 */

var express = require('express');
var router = express.Router();
var con = require('../db_con');

/*var mysql = require('mysql');

var connection = mysql.createConnection({
    port: 3306,
    database: 'qrpay',
    host: 'localhost',
    user: 'root',
    password: '@cosin1210'
});*/

function readCards(email, callback) {

    console.log('user', email);

    callback(null, cards);
}

function createCard(card, userId, callback) {

    console.log('card', card);

    con.connection.query('insert into card_info set ?', card, function(error, result) {
        if (error) {
            console.log(error);
        } else {
            console.log(result.insertId);
            var userCardInfo ={
                user_id: userId,
                card_id: result.insertId
            };
            con.connection.query('insert into user_card_info set ?', userCardInfo, function(error, result)
            {
                if(error) {
                    console.log(error);
                    return callback(error);
                }
                callback(null, result);
            });

        }
    });
}

module.exports = {
    readCards: readCards,
    createCard: createCard
};
