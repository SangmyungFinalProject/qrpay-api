/**
 * Created by ms_20 on 2017. 5. 3..
 */

var express = require('express');
var router = express.Router();

var mysql = require('mysql');

var connection = mysql.createConnection({
    port: 3306,
    database: 'qrpay',
    host: 'localhost',
    user: 'root',
    password: '@cosin1210'
});

function readCards(email, callback) {

    console.log('user', email);

    /*var cards = [];
    var card1 = {
        company: 'WOORI',
        number : '5050-1234-4346-9101',
        cvc    : '171',
        name   : 'first card'
    };
    var card2 = {
        company: 'SHINHAN',
        number : '1234-4346-1243-2389',
        cvc    : '123',
        name   : 'second card'
    };
    var card3 = {
        company: 'SHINHAN',
        number : '1234-4346-1243-2389',
        cvc    : '133',
        name   : 'third card'
    };
    var card4 = {
        company: 'KB',
        number : '1234-4346-1243-2389',
        cvc    : '223',
        name   : 'fourth card'
    };

    cards.push(card1);
    cards.push(card2);
    cards.push(card3);
    cards.push(card4);*/

    callback(null, cards);
}

function createCard(card, userId, callback) {

    console.log('card', card);

    connection.query('insert into card_info set ?', card, function(error, result) {
        if (error) {
            console.log(error);
        } else {
            console.log(result.insertId);
            var userCardInfo ={
                user_id: userId,
                card_id: result.insertId
            };
            connection.query('insert into user_card_info set ?', userCardInfo, function(error, result)
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
