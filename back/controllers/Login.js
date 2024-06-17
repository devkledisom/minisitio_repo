const database = require('../config/db');
const Login = require('../models/table_user_login');

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


        if (users.length < 1) {
            res.json({ success: false, message: "Usuario nao encontrado" })
            return;
        }


        if (users[0].ativo && users[0].codTipoUsuario == 1) {
            res.json({ success: true, message: "Usuario encontrado" })
        } else if (users[0].ativo && users[0].codTipoUsuario == 2) {
            res.json({ success: false, message: "Não é possível entrar com acesso MASTER" })
        } else if (users[0].ativo && users[0].codTipoUsuario == 3) {
            res.json({ success: false, message: "Não é possível entrar com acesso ANUNCIANTE" })
        } else {
            res.json({ success: false, message: "O usuário não está ativo, por favor fale com o suporte." })
        }


    }
}