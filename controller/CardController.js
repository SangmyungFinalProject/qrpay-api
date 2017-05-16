/**
 * Created by ms_20 on 2017. 5. 3..
 */

function readCards(email, callback) {

    console.log('user', email);

    var cards = [];
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
    cards.push(card4);

    callback(null, cards);
}

function createCard(card, callback) {

    console.log('card', card);

    callback(null, card);
}

module.exports = {
    readCards: readCards,
    createCard: createCard
};
