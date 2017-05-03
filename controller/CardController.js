/**
 * Created by ms_20 on 2017. 5. 3..
 */

function readCards(email, callback) {

    console.log('user', email);

    var cards = [];
    var card1 = {
        number : '12344346',
        cvc    : '123',
        name   : 'asdg'
    };
    cards.push(card1);

    var card2 = {
        number : '12344346',
        cvc    : '123',
        name   : 'asdg'
    };
    cards.push(card2);

    callback(null, cards);
}

module.exports = {
    readCards: readCards
};