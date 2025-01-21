const database = require('../config/db');
const Login = require('../models/table_user_login');
const key = require('../config/config.js');
const secretKey = key.apiSecret;
const jwt = require('jsonwebtoken');

module.exports = {
    login: async (req, res) => {
        await database.sync();

        const { descCPFCNPJ, senha } = req.body;
    
        if (descCPFCNPJ == "" || senha == "") {
            res.json({ success: false, message: "Login ou senha vazios" })
            return;
        }
    
        const users = await Login.findAll({
            where: {
                descCPFCNPJ: descCPFCNPJ,
                senha: senha
            }
        });
    
    
        console.log("teste", users);
        if (users.length < 1) {
            res.json({ success: false, message: "Usuario nao encontrado" })
            return;
        }

        execLogin(req, res, users);
     
     
    }
}

async function execLogin(req, res, users) {
    const credentials = [
        {
            id: 12,
            nome: "jose",
            api_key: "keytesteProd",
            secret_key: "secrettesteProd"
        },
    ];
    
    //AUTHORIZATION
        try {
            const { api_key, secret_key } = req.headers;
            console.log(api_key, secret_key)
            //var { api_key, secret_key } = req.body;
            let credentialKey = credentials.find(i => i.api_key == api_key);
            
            if (credentialKey != undefined) {
                if (credentialKey.secret_key == secret_key) {
    
                    jwt.sign({ id: credentialKey.id, user: credentialKey.nome }, secretKey, { expiresIn: '1h' }, (err, token) => {
                        if (err) {
                            res.status(400);
                            res.json({ err: "falha interna" });
                        } else {
                            if (req.query.login == "true") {
                                res.json({ queryParam: "chave", token: token });
                            } else {
                             /*    res.status(200);
                                res.json({ token: token });  */
                                if (users[0].ativo && users[0].codTipoUsuario == 1) {
                                    res.json({ success: true, message: "Usuario encontrado", data: users[0].descNome, type: 1, accessToken: token })
                                } else if (users[0].ativo && users[0].codTipoUsuario == 2) {
                                    res.json({ success: true, message: "Não é possível entrar com acesso MASTER", data: users[0], type: 2, accessToken: token })
                                } else if (users[0].ativo && users[0].codTipoUsuario == 3) {
                                    res.json({ success: true, message: "Não é possível entrar com acesso ANUNCIANTE", data: users[0], type: 3, accessToken: token })
                                } else if (users[0].ativo && users[0].codTipoUsuario == 5) {
                                    res.json({ success: true, message: "Não é possível entrar com acesso ANUNCIANTE", data: users[0], type: 5, accessToken: token })
                                } else {
                                    res.json({ success: false, message: "O usuário não está ativo, por favor fale com o suporte." })
                                }
                            }
                        }
                    });
    
                } else {
                    res.status(401);
                    res.json({ err: "Credenciais inválidas" });
                }
            } else {
                res.status(404);
                res.json({ err: "os dados enviados não existe" });
            }
    
        } catch (err) {
            console.log("erro na autenticação", err)
            res.status(400);
            res.json({ err: "falha interna" });
        }
}

