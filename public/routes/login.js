const express = require('express');
const router = express.Router();
const connect = require('./database');

//Função para fazer essa comparação ai (literalmente a ideia mais idiota que eu tive, mas funcionou (: )
function match (a, b) {
    if(a === b){
        return true;
    } else {
        return false;
    }
}

// Rota de registro
router.get('/register', (req, res) => {
    res.render('register');
});

// Método POST para o cadastro do usuário
router.post('/register', async (req, res) => {
    let name = req.body.username;
    let email = req.body.useremail;
    let password = req.body.password;

    // Bagulho para inserir no banco
    try {
        let sql = `INSERT INTO users (userName, userEmail, userPassword) VALUES ('${name}', '${email}', '${password}' )`;
        connect.query(sql, [name, email, password], (err, result) => {
            if (err) {
                console.error('Erro:', err);
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
    let email = req.body.useremail;
    let password = req.body.password;

    let sql = `SELECT * FROM users WHERE userEmail = ?`;
    connect.query(sql, [email], async (error, results) => {
        if (error) {
            console.log('Erro:', error);
            return res.send('Erro no servidor');
        }

        if (results.length > 0) {
            let user = results[0];
            console.log('Usuário encontrado:', user);

            try {
                
                if (match(password, user.userPassword)) {
                    res.redirect('/home');
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

//Rota do home, daqui a pouco vou tirar isso daqui
router.get('/home', (req, res) => {
    res.render('home');
});

module.exports = router;
