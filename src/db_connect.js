//Call this file when you need database connection.
const mysql = require('mysql');
const bluebird = require('bluebird');

//MySQL setup:
var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'labdb'
});
db.on('error', ex=>{
console.log(ex);
})
db.connect();
bluebird.promisifyAll(db);
module.exports = db;