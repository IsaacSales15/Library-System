const mysql = require('mysql2');

const connect = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'library'
});

connect.connect(function(err){
    if (err) throw err;
    console.log('Quem brinca demais acaba virando brinquedo.');
});

module.exports = connect;
