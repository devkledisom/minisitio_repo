const { faleComDono, faleComDonoCliente, contato } = require('../functions/sendMailer');

module.exports = {
    contato: async (req, res) => {
        contato(req.body);
        console.log(req.body)
        res.json({success: true, messagem: "enviado"})
    }
}