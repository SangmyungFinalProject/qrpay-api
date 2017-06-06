/**
 * Created by ms_20 on 2017. 6. 6..
 */

var mysql = require('mysql');
var config = require('./db_info.json').local;

var connection = mysql.createConnection({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: config.database
});

module.exports = {
    connection: connection
};
