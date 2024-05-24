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

        if (!users) {
            res.json({ success: false, message: "Usuario nao encontrado" })
            return;
        }


        if (users[0].ativo) {
            res.json({ success: true, message: "Usuario encontrado" })
        } else {
            res.json({ success: false, message: "Usuario nao esta ativado" })
        }


    }
}