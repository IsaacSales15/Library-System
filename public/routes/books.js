//Hora da desgraça acontecer
const express = require('express');
const router = express.Router();
const connect = require('./database');

router.get('/', (req, res) => {
    connect.query('SELECT * FROM categories', (err, results) => {
        if (err) throw err;
        res.render('categories', { categories: results });
    });
});


router.post('/save', (req, res) => {
    const { categoryId, categoryName } = req.body;

    let sql = categoryId ? 
        'UPDATE categories SET categoryName = ? WHERE categoryId = ?' : 
        'INSERT INTO categories (categoryName) VALUES (?)';

    let params = categoryId ? [categoryName, categoryId] : [categoryName];

    connect.query(sql, params, (error, result) => {
        if (error) throw error;
        res.redirect('/home');
    });
});

module.exports = router;
