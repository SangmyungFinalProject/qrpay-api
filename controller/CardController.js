var faker = require('faker');

function generateRandomCardNumber() {

    return (Math.floor(Math.random() * 5999) + 5000) +
        '-' + (Math.floor(Math.random() * 9999) + 1000) +
        '-' + (Math.floor(Math.random() * 9999) + 1000) +
        '-' + (Math.floor(Math.random() * 9999) + 1000);
}

function readCards(email, callback) {

    console.log('user', email);

    var cards = [];

    for (var i = 0; i < 22; i++) {
        var card = {};
        var randomCard = faker.helpers.createCard();
        card.company = randomCard.company.name;
        card.name = randomCard.name;
        card.number = generateRandomCardNumber();
        card.cvc = Math.floor(Math.random() * 999) + 100;

        console.log('card : ', card);
        cards.push(card);
    }

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
