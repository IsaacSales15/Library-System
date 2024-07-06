const express = require('express');
const { engine } = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const login = require('./public/routes/login');
const books = require('./public/routes/books');
const admin = require('./public/routes/admin'); 
const connect = require('./public/routes/database');

const app = express();

// Configuração do Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));

app.use('/', login);
app.use('/books', books);
app.use('/admin', admin); // Uso das rotas admin

// Função para verificar autenticação
function isAuthenticated(req, res, next) {
    const { login } = req.cookies;
    if (login && login === 'authenticated') {
        return next();
    }
    res.redirect('/login');
}

// Rota raiz
app.get('/', isAuthenticated, (req, res) => {
    res.redirect('/home');
});

app.get('/login', (req, res) => {
    res.render('login');
});

// Rota para a página home
app.get('/home', isAuthenticated, (req, res) => {
    const sql = `
        SELECT b.bookTitle, b.author, c.categorieName
        FROM books b
        LEFT JOIN categories c ON b.categorieId = c.categorieId
    `;
    connect.query(sql, (error, results) => {
        if (error) {
            console.error('Erro ao buscar livros:', error);
            return res.send('Erro ao buscar livros');
        }
        console.log(results); // Adicione esta linha
        const books = results.map(row => ({
            bookTitle: row.bookTitle,
            author: row.author,
            categorieName: row.categorieName || 'Sem Categoria'
        }));
        const isAdmin = req.cookies.isAdmin === 'true';
        res.render('home', { books, isAdmin });
    });
});


// Rota para a página home do admin
app.get('/admin/home', isAuthenticated, (req, res) => {
    if (req.cookies.isAdmin === 'true') {
        const sql = `
            SELECT b.bookTitle, b.author, c.categorieName
            FROM books b
            LEFT JOIN categories c ON b.categorieId = c.categorieId
        `;
        connect.query(sql, (error, books) => {
            if (error) {
                console.error('Erro ao buscar livros:', error);
                return res.send('Erro ao buscar livros');
            }
            res.render('home_admin', { books });
        });
    } else {
        res.redirect('/home');
    }
});

app.get('/back', (req, res) => {
    res.render('home_admin')
})

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
