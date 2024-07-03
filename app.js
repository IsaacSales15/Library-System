const express = require('express');
const { engine } = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
const login = require('./public/routes/login');

const app = express();

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));

//Rotas brabíssimas
app.use('/', login);

app.get('/register', (req, res) => {
    res.render('register'); 
});


app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
