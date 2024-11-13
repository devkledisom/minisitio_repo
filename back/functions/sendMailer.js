const nodemailer = require('nodemailer');

const SMTP_CONFIG = require('../config/smtp');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: false,
    auth: {
        user: SMTP_CONFIG.auth.user,
        pass: SMTP_CONFIG.auth.pass

    },
    tls: {
        rejectUnauthorized: false,
    }
});

async function sendMailError(data, msg, msgErro, nu_painel, status) {

    //variaveis do corpo de envio do email com variação de idiomas para o novo aluno


    const mailSentPT = await transporter.sendMail({
        from: '"kledisom" <devkledisom@gmail.com>',
        to: ['dev@ziiz.com.br', 'kledison2009@hotmail.com', 'wspolidoro@gmail.com', 'gerencia@oimed.com.br', 'bell@ziiz.com.br'],
        subject: `OIMED INFORMA! ${status}`,
        text: `OIMED INFORMA! Segue em anexo sua ficha de inscrição`,
        html: `
        <h2>${msg}</h2>
        <h5>Painel: ${nu_painel}</h5>
        <p>${JSON.stringify(data)}</p>
        <br />
        <h2>Erros</h2>
        <p>${JSON.stringify(msgErro)}</p>
        `
        /*       attachments: [
                  {
                      path: path
                  }
              ] */
    });
    return mailSentPT
    //---------------------------------------------------------------------------------->

};

async function faleComDono(data, emaildestino) {

    //variaveis do corpo de envio do email com variação de idiomas para o novo aluno

    const mailSentPT = await transporter.sendMail({
        //from: `${data.nome} <${data.email}>`,
        from: `kledisom <dev@ziiz.com.br>`,
        to: ['dev@ziiz.com.br', emaildestino],
        subject: `INFORMA!`,
        text: `INFORMA!`,
        html: "<h1>bem vindo</h1>"/* `
        <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pedido Recebido!</title>
</head>
<body>
    <p>De: <strong>${data.nome}</strong> &lt;${data.email}&gt;</p>
    <p>Assunto: <strong>Pedido Recebido!</strong></p>
    
    <p>Obrigado por fazer o pedido!</p>

    <p>Recebemos seu pedido com sucesso e assim que o pagamento for confirmado, você estará pronto para aproveitar todos os benefícios do melhor plano de saúde online, ${data.nome}!</p>

    <h3>Aqui estão os detalhes para acessar sua conta:</h3>

    <p><strong>Website:</strong> <a href="${data.site_venda}teleconsulta">${data.site_venda}teleconsulta</a></p>

    <p>Também estamos disponíveis nas lojas de aplicativos:</p>

    <ul>
        <li><strong>Google Play Store:</strong> <a href="${data.linkAndroid}">${data.linkAndroid}</a></li>
        <li><strong>Apple App Store:</strong> <a href="${data.linkApple}">${data.linkApple}</a></li>
    </ul>

    <h3>Para acessar sua conta:</h3>
    <ul>
        <li>Pelo link web, o acesso é imediato.</li>
        <li>Nos aplicativos, o cadastro pode levar até 24 horas para ser ativado.</li>
    </ul>

    <h3>Dados de acesso:</h3>
    <p><strong>CPF:</strong> [Insira seu CPF]</p>
    <p><strong>Senha:</strong> Os 4 primeiros dígitos do seu CPF</p>

    <p>Nossa equipe de suporte está pronta para ajudar caso você precise de alguma assistência. Entre em contato conosco pelo e-mail: <a href="mailto:${data.email}">${data.email}</a>.</p>

    <p>Seja bem-vindo(a) à ${data.nome} e aproveite os benefícios do nosso plano de saúde online!</p>

    <hr>
    <p>--</p>
    <p>Este e-mail foi enviado de um formulário de contato em <strong>${data.nome}</strong> (<a href="${data.site_venda}">${data.site_venda}</a>)</p>
</body>
        ` */
        /*       attachments: [
                  {
                      path: path
                  }
              ] */
    });
    return true;
    //---------------------------------------------------------------------------------->

};

module.exports = {
    sendMailError,
    faleComDono
};



