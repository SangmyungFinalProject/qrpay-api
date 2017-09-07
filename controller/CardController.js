var app = require('./../app');
var connection = app.connection;

function cardValidate(cardNumber, callback) {
    cardNumber = cardNumber.replace(/[ -]/g, '');
    var regex = /^(?:(94[0-9]{14})|(4[0-9]{12}(?:[0-9]{3})?)|(5[1-5][0-9]{14})|(6(?:011|5[0-9]{2})[0-9]{12})|(3[47][0-9]{13})|(3(?:0[0-5]|[68][0-9])[0-9]{11})|((?:2131|1800|35[0-9]{3})[0-9]{11}))$/;
    callback(regex.exec(cardNumber));
}

function readCards(userId, callback) {

    console.log('userId', userId);

    connection.query('select * from user_card_info where user_id = ?', userId, function (error, rows) {
        if (error) {
            console.log(error);
            callback(error);
        } else {
            var cards = [];
            rows.forEach(function (row) {
                cards.push(row.card_id);
            });

            console.log('cards : ', cards);

            if (cards.length <= 0) {
                return callback(null, cards);
            }

            var params = [cards];

            connection.query('select * from card_info where id in (?)', params, function (error, result) {
                if (error) {
                    console.log(error);
                    callback(error);
                } else {
                    console.log('result : ', result);
                    callback(null, result);
                }
            });
        }
    });
}

function createCard(card, userId, callback) {

    console.log('card', card);

    card.bounds = Math.floor(Math.random() * 500000) + 500000; // 50 ~ 100만 사이의 값

    console.log(card.bounds);

    cardValidate(card.number, function (result) {
        if (result) {
            connection.query('select * from card_info where number = ?', card.number, function (error, rows) {
                if (error) {
                    console.log(error);
                    callback(error);
                } else {
                    if (rows.length > 0) {
                        var params = [Number(userId), rows[0].id];
                        console.log('params: ',params);
                        var query = 'insert into user_card_info set user_id = (select id from user_info where id = ?), card_id = (select id from card_info where id = ?)';
                        connection.query(query, params, function (error, result) {
                            if (error) {
                                console.log(error);
                                callback(error);
                            } else {
                                callback(null, card);
                            }
                        });
                    } else {
                        connection.query('select id from card_company_info where id = ?', card.company, function (error, rows) {
                            if (rows.length === 0) {
                                var error_not_id = 'company not exist';
                                console.log(error_not_id);
                                callback(error_not_id);
                            } else {
                                connection.query('insert into card_info set ?', card, function (error, result) {
                                    if (error) {
                                        console.log(error);
                                        callback(error);
                                    } else {

                                        var params = [userId, result.insertId];
                                        console.log('params : ', params);
                                        var query = 'insert into user_card_info set user_id = (select id from user_info where id = ?), card_id = (select id from card_info where id = ?)';
                                        connection.query(query, params, function (error, result) {
                                            if (error) {
                                                console.log(error);
                                                callback(error);
                                            } else {
                                                callback(null, card);
                                            }
                                        });
                                    }

                                });
                            }
                        });
                    }
                }
            });
        } else {
            var error = 'card validation fail';
            callback(error);
        }
    });
}

function deleteCard(card_id, callback) {

    console.log('card_id', card_id);

    connection.query('delete from card_info where id = ?', card_id, function (error) {
        if (error) {
            console.log(error);
            callback(error);
        } else {
            connection.query('delete from user_card_info where card_id = ?', card_id, function (error, result) {
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

function updateCard(card, card_id, callback) {

    connection.query('update card_info set ? where id = ?', [card, card_id], function (error, result) {
        if (error) {
            console.log(error);
            callback(error);
        } else {
            callback(null, result);
        }
    });
}

module.exports = {
    readCards: readCards,
    createCard: createCard,
    deleteCard: deleteCard,
    updateCard: updateCard
};
