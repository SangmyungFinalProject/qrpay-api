/**
 * Created by woowahan on 2017. 5. 3..
 */

function insertUser(user, callback) {

    console.log('user', user);

    callback(null, user);
}

function readUser(user, callback) {

    console.log('user', user);

    callback(null, user);
}

module.exports = {
    insertUser: insertUser,
    readUser: readUser
};