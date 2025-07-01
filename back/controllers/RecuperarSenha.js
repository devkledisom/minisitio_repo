const crypto = require('crypto');
const Usuario = require('../models/table_usuarios');
const Sequelize = require('sequelize');
const { Op } = Sequelize;
const { forgotPasswordEmail } = require('../functions/sendMailer');

module.exports = {
    forgotPassword: async (req, res) => {
        const { email } = req.body;

        const user = await Usuario.findOne({ where: { descEmail: email } });
        console.log(user)

        if (!user)
            return res.status(404).json({ message: 'E-mail não encontrado.' });

        // Gera token seguro
        const token = crypto.randomBytes(32).toString('hex');
        const expiration = new Date(Date.now() + 3600000); // 1 hora

        // Atualiza o usuário
        user.resetToken = token;
        user.resetTokenExpires = expiration;
        await user.save();

        // Link de redefinição
        const resetLink = `https://minitest.automaplay.com.br/reset-password?token=${token}`;

        const emailRecuperacao = await forgotPasswordEmail(user.descEmail, resetLink);

        console.log(req.body, emailRecuperacao, user.descEmail)
        res.json({ success: true, messagem: "enviado" });
    },
    resetPassword: async (req, res) => {
        const { token, password } = req.body;
        console.log(req.body)

        if (!token || !password)
            return res.status(400).json({ message: 'Token e nova senha são obrigatórios.' });

        try {
            // Busca o usuário com token válido
            const user = await Usuario.findOne({
                where: {
                    resetToken: token,
                    resetTokenExpires: {
                        [Op.gt]: new Date() // Token ainda é válido
                    }
                },
                attributes: ['codUsuario', 'descEmail', 'senha', 'resetToken', 'resetTokenExpires']
            });

            console.log(user)

            if (!user) {
                return res.status(400).json({ message: 'Token inválido ou expirado.' });
            }

            // Criptografa a nova senha
            //const hashedPassword = await bcrypt.hash(password, 10);
            const hashedPassword = password;

            // Atualiza e limpa os campos
            user.senha = hashedPassword;
            user.resetToken = null;
            user.resetTokenExpires = null;
            await user.save();

            res.status(200).json({ success: true, message: 'Senha atualizada com sucesso.' });

        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Erro ao redefinir senha.' });
        }
    }
}