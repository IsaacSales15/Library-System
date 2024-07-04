const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const connect = require('./database');

// Rota de registro
router.get('/register', (req, res) => {
    res.render('register');
});

// Método POST para o cadastro do usuário
router.post('/register', async (req, res) => {
    let name = req.body.username;
    let email = req.body.useremail;
    let password = req.body.password;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        let sql = `INSERT INTO users (userName, userEmail, userPassword) VALUES ('${name}', '${email}', '${password}')`;
        connect.query(sql, [name, email, hashedPassword], (err, result) => {
            if (err) {
                console.error('Erro:', err);
                return res.send('Erro ao cadastrar o usuário');
            }
            console.log(result);
            res.redirect('/');
        });
    } catch (error) {
        console.error('Erro ao criar hash da senha:', error);
        res.status(500).send('Erro ao cadastrar o usuário');
    }
});

// Método POST para sistema de verificação (login)
router.post('/login', (req, res) => {
    let email = req.body.useremail;
    let password = req.body.password;

    let sql = `SELECT * FROM users WHERE userEmail = ?`;
    connect.query(sql, [email], async (error, results) => {
        if (error) {
            console.log('Erro:', error);
            return res.status(500).send('Erro no servidor');
        }

        if (results.length > 0) {
            let user = results[0];

            try {
                const match = await bcrypt.compare(password, user.userPassword);
                if (match) {
                    res.redirect('/main');
                } else {
                    res.send('Senha incorreta!');
                }
            } catch (error) {
                console.error('Erro ao comparar senhas:', error);
                res.send('Erro ao realizar login');
            }
        } else {
            res.send('Usuário não encontrado');
        }
    });
});

module.exports = router;
