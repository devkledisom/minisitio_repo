const database = require('../config/db');
const Login = require('../models/table_user_login');
const key = require('../config/config.js');
const secretKey = key.apiSecret;
const jwt = require('jsonwebtoken');

//model
const Usuarios = require('../models/table_usuarios');

module.exports = {
    login: async (req, res) => {
        await database.sync();

        const { descCPFCNPJ, senha } = req.body;

        console.log(descCPFCNPJ, senha)

        const user = await Usuarios.findOne({
            where: {
                descCPFCNPJ: descCPFCNPJ
            },
            raw: true,
            attributes: ['codUsuario', 'descNome', 'descCPFCNPJ', 'senha', 'codTipoUsuario', 'ativo']
        });

        if (!user || senha != user.senha) {
            return res.status(401).json({ success: false, message: "Credenciais inválidas" });
        }

        const token = jwt.sign({ id: user.id, role: user.codTipoUsuario, uuid: user.codUsuario }, secretKey, { expiresIn: "1h" });

        user.success = true;

        //execLogin(req, res, users);
        if (user.ativo && user.codTipoUsuario == 1) {
            res.json({ success: true, message: "Usuario encontrado", data: user, type: 1, accessToken: token })
        } else if (user.ativo && user.codTipoUsuario == 2) {
            res.json({ success: true, message: "Não é possível entrar com acesso MASTER", data: user, type: 2, accessToken: token })
        } else if (user.ativo && user.codTipoUsuario == 3) {
            res.json({ success: true, message: "Não é possível entrar com acesso ANUNCIANTE", data: user, type: 3, accessToken: token })
        } else if (user.ativo && user.codTipoUsuario == 5) {
            res.json({ success: true, message: "Não é possível entrar com acesso ANUNCIANTE", data: user, type: 5, accessToken: token })
        } else {
            res.json({ success: false, message: "O usuário não está ativo, por favor fale com o suporte." })
        }

    },
    sessionVerification: async (req, res) => {
        const user = await Usuarios.findOne({
            where: {
                codUsuario: req.userId
            },
            raw: true,
            attributes: ['codUsuario', 'descNome', 'descCPFCNPJ', 'senha', 'codTipoUsuario', 'ativo']
        });

         res.json({success: true, data: user})
    },
    loginold: async (req, res) => {
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

                jwt.sign({ id: credentialKey.id, user: credentialKey.nome, uuid: users[0].codUsuario }, secretKey, { expiresIn: '1h' }, (err, token) => {
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

