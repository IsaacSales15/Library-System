const express = require('express');
const router = express.Router();
const connect = require('./database'); 

router.get('/edit', (req, res) => {
    if (req.cookies.isAdmin === 'true') {
        connect.query('SELECT * FROM books', (error, books) => {
            if (error) {
                console.error('Erro ao buscar livros:', error);
                return res.send('Erro ao buscar livros');
            }
            connect.query('SELECT * FROM categories', (error, categories) => {
                if (error) {
                    console.error('Erro ao buscar categorias:', error);
                    return res.send('Erro ao buscar categorias');
                }
                res.render('edit', { books, categories });
            });
        });
    } else {
        res.redirect('/home');
    }
});

// Método POST para editar um livro
router.post('/edit/book', (req, res) => {
    const { bookTitle, author, categorieName } = req.body;

    // Verifica se a categoria existe
    const checkCategorySql = `SELECT categorieId FROM categories WHERE categorieName = ?`;
    connect.query(checkCategorySql, [categorieName], (error, results) => {
        if (error) {
            return res.send('Erro ao verificar categoria');
        }

        if (results.length === 0) {
            return res.send('Categoria não existe');
        }

        const categorieId = results[0].categorieId;
        const insertBookSql = `INSERT INTO books (bookTitle, author, categorieId) VALUES (?, ?, ?)`;
        connect.query(insertBookSql, [bookTitle, author, categorieId], (error) => {
            if (error) {
                console.error('Erro ao adicionar livro:', error);
                return res.send('Erro ao adicionar livro');
            }
            res.redirect('/admin/edit');
        });
    });
});

// Método POST para adicionar uma nova categoria
router.post('/edit/category', (req, res) => {
    const { categorieName } = req.body;
    const sql = `INSERT INTO categories (categorieName) VALUES (?)`;
    connect.query(sql, [categorieName], (error, result) => {
        if (error) {
            console.error('Erro ao adicionar categoria:', error);
            return res.send('Erro ao adicionar categoria');
        }
        console.log(result);
        res.redirect('/admin/edit');
    });
});

router.get('/back', (req, res) => {
    res.redirect('/admin/home');
})

module.exports = router;
