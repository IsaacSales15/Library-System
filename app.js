const express = require('express');
const { engine } = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
const cookie = require('cookie-parser');
const login = require('./public/routes/login');
const books = require('./public/routes/books');

const app = express();

//Configs do handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));

app.use('/', login);
app.use('/books', books);

//Rota raiz
app.get('/', (req, res) => {
    res.render('login');
});

// Fazer uma válidação usando cookies
// Verificar se o usuário já fez login num período de tempo curto, se esse tempo tiver passado, ele terá que fazer o login novamente.
function isAuthenticated(req, res, next) {
    const { login } = req.cookies;
    if (login && login === 'authenticated') {
        return next();
    }
    res.redirect('/');
}

app.get('/admin', isAuthenticated, (req, res) => {
    res.render('admin');
});


app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
