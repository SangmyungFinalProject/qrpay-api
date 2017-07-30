var app = require('./../app');
var connection = app.connection;

function readCards(userId, callback) {

    console.log('userId', userId);

    connection.query('select * from user_card_info where user_id = ?', userId, function (error, result) {
        if (error) {
            console.log(error);
            callback(error);
        } else {
            console.log('result : ', result);
            callback(null, result);
        }
    });
}

function createCard(card, userId, callback) {

    console.log('card', card);

    connection.query('insert into card_info set ?', card, function(error, result) {
        if (error) {
            console.log(error);
            callback(error);
        } else {
            console.log(result.insertId);
            var userCardInfo = {
                user_id: userId,
                card_id: result.insertId
            };
            connection.query('insert into user_card_info set ?', userCardInfo, function(error, result) {
                if(error) {
                    console.log(error);
                    callback(error);
                } else {
                    card.card_id = userCardInfo.card_id;
                    callback(null, card);
                }
            });

        }
    });
}

function deleteCard(card_id, callback) {

    console.log('card_id', card_id);

    connection.query('delete from card_info where id = ?', card_id, function(error) {
        if (error) {
            console.log(error);
            callback(error);
        } else {
            connection.query('delete from user_card_info where card_id = ?', card_id, function(error, result) {
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

module.exports = {
    readCards: readCards,
    createCard: createCard,
    deleteCard: deleteCard
};
