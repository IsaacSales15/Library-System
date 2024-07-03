const express = require('express');
const router = express.Router();
const connect = require('./database'); 

router.get('/', (req, res) => {
    res.render('login');
});

router.post('/register', (req, res) => {
    let name = req.body.userName;
    let email = req.body.userEmail;
    let password = req.body.userPassword;

    let sql = `INSERT INTO library (userName, userEmail, userPassword) VALUES (?, ?, ?)`;
    connect.query(sql, [name, email, password], (err, result) => {
        if (err) {
            console.error('Erro:', err);
            return;
        }
        console.log(result);
    });
});

module.exports = router;
