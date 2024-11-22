const { faleComDono, faleComDonoCliente, contato, novoUsuario } = require('../functions/sendMailer');

module.exports = {
    contato: async (req, res) => {
        contato(req.body);
        console.log(req.body)
        res.json({success: true, messagem: "enviado"})
    },
     novoUsuario: async (req, res) => {
        novoUsuario(req.body);
        console.log(req.body)
        res.json({success: true, messagem: "enviado"})
    }
}