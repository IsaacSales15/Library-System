const express = require('express');
const router = express.Router();
const connect = require('./database');

// Rota de registro
router.get('/register', (req, res) => {
    res.render('register');
});

// Método POST para o cadastro do usuário
router.post('/register', async (req, res) => {
    const { username, useremail, password } = req.body;

    // Negócio para inserir no banco
    try {
        let sql = `INSERT INTO users (userName, userEmail, userPassword) VALUES ('${username}', '${useremail}', '${password}' )`;
        connect.query(sql, [username, useremail, password], (error, result) => {
            if (error) {
                console.error('Erro:', error);
                return res.send('Erro ao cadastrar o usuário');
            }
            console.log(result);
            res.redirect('/');
        });
    } catch (error) {
        res.send('Erro ao cadastrar o usuário');
    }
});

router.get('/', (req, res) => {
    res.render('login');
});

// Método POST para sistema de verificação (login)
router.post('/login', (req, res) => {
    const { useremail, password } = req.body;

    if (useremail === 'admin@gmail.com' && password === 'admin') {
        res.cookie('login', 'authenticated', { maxAge: 900000, httpOnly: true });
        return res.redirect('/home');
    } else {
        connect.query('SELECT * FROM users WHERE userEmail = ?', [useremail], (error, results) => {
            if (error) {
                console.error('Erro ao executar a consulta:', error);
                return res.status(500).send('Erro interno ao tentar fazer login');
            }

            if (results.length > 0) {
                const user = results[0];

                if (password === user.userPassword) {
                    res.cookie('login', 'authenticated', { maxAge: 900000, httpOnly: true });
                    return res.redirect('/home');
                } else {
                    return res.send('Senha incorreta');
                }
            } else {
                return res.status(404).send('Usuário não encontrado');
            }
        });
    }
});


router.get('/logout', (req, res) => {
    res.clearCookie('login');
    res.redirect('/');
});

//Rota do home, daqui a pouco vou tirar isso daqui
router.get('/home', (req, res) => {
    res.render('home');
});

module.exports = router;
