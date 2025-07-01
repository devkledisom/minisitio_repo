const nodemailer = require('nodemailer');
const path = require('path');

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

async function faleComDono(data, emailAutorizante, filename) {

    //variaveis do corpo de envio do email com variação de idiomas para o novo aluno      

    if (filename) {
        const mailSentPT = await transporter.sendMail({
            from: `${data.nome} <${data.email}>`,
            //from: `kledisom <dev@ziiz.com.br>`,
            to: ['dev@ziiz.com.br', emailAutorizante, 'contatobr@mycardcity.net'],
            subject: `${data.option}`,
            text: `${data.option}`,
            html: `
            <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Pedido Recebido!</title>
    </head>
    <body>
        <p>De: <strong>${data.nome}</strong> &lt;${data.email}&gt;</p>
        <p>Assunto: <strong>${data.option}</strong></p>
        
        <p>Nova mensagem de contato!</p>
    
            <p>${data.mensagem}</p>
    
    
        <hr>
        <p>--</p>
    </body>
            `,
            attachments: [
                {
                    filename: filename,
                    path: path.join(__dirname, `../public/upload/anexoEmail/${filename}`)
                }
            ]
        });
        return true;
    } else {
        const mailSentPT = await transporter.sendMail({
            from: `${data.nome} <${data.email}>`,
            //from: `kledisom <dev@ziiz.com.br>`,
            to: ['dev@ziiz.com.br', emailAutorizante, 'contatobr@mycardcity.net'],
            subject: `${data.option}`,
            text: `${data.option}`,
            html: `
            <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Pedido Recebido!</title>
    </head>
    <body>
        <p>De: <strong>${data.nome}</strong> &lt;${data.email}&gt;</p>
        <p>Assunto: <strong>${data.option}</strong></p>
        
        <p>Nova mensagem de contato!</p>
    
            <p>${data.mensagem}</p>
    
    
        <hr>
        <p>--</p>
    </body>
            `
        });
        return true;
    }


    //---------------------------------------------------------------------------------->

};
async function faleComDonoCliente(data) {

    //variaveis do corpo de envio do email com variação de idiomas para o novo aluno

    const mailSentPT = await transporter.sendMail({
        from: `${data.nome} <${data.email}>`,
        //from: `kledisom <dev@ziiz.com.br>`,
        to: ['dev@ziiz.com.br', data.email, data.email_copia],
        subject: `${data.option}`,
        text: `${data.option}`,
        html: `
        <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pedido Recebido!</title>
</head>
<body>
    
    <p>Obrigado por entrar em contato!</p>

    <p>Recebemos seu pedido com sucesso, entraremos em contato em breve!</p>

    <p>Nossa equipe de suporte está pronta para ajudar caso você precise de alguma assistência. Entre em contato conosco pelo e-mail: <a href="mailto:${data.email}">${data.email}</a>.</p>

    <hr>
    <p>--</p>
</body>
        `
        /*       attachments: [
                  {
                      path: path
                  }
              ] */
    });
    return true;
    //---------------------------------------------------------------------------------->

};

async function contato(data) {
    const mailSentPT = await transporter.sendMail({
        from: `${data.nome} <${data.email}>`,
        //from: `kledisom <dev@ziiz.com.br>`,
        to: ['dev@ziiz.com.br', 'contatobr@mycardcity.net'],
        subject: "contato de cliente",
        text: "contato de cliente",
        html: `
        <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pedido Recebido!</title>
</head>
<body>
    
<p>o cliente <strong>${data.nome}</strong> entrou em contato</p>
    <p>Email do cliente: <strong>${data.email}</strong></p>
    <p>Telefone do cliente: <strong>${data.telefone}</strong></p>

    <hr>

    <p>
        ${data.mensagem}
    </p>


    <hr>
    <p>--</p>
</body>
        `
    });
    return true;
    //---------------------------------------------------------------------------------->

};

async function novoUsuario(email, nome, doc) {
    const mailSentPT = await transporter.sendMail({
        //from: `${data.nome} <${data.email}>`,
        from: `kledisom <dev@ziiz.com.br>`,
        to: ['dev@ziiz.com.br', 'contatobr@mycardcity.net', email],
        subject: "Minisitio",
        text: "Minisitio",
        html: `
        <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cadastro!</title>
</head>
<body>
    
<p>Seja bem Vindo(a) <strong>${nome}</strong></p>
<p>segue abaixo o seu acesso para gerenciar o seu perfil Minisitio</p>
    <p>Login: <strong>${doc}</strong></p>
    <p>Senha: <strong>${doc.substr(0, 5)}</strong></p>

    <hr>
    <p>-A nossa equipe está feliz por ter você na nossa plataforma-</p>
</body>
        `
    });
    return true;

};

async function forgotPasswordEmail(email, resetLink) {
    const mailSentPT = await transporter.sendMail({
        //from: `${data.nome} <${data.email}>`,
        from: `Minisitio <dev@ziiz.com.br>`,
        to: ['dev@ziiz.com.br', 'contatobr@mycardcity.net', email],
        subject: "Recuperação de Senha",
        html: `
        <p>Você solicitou a recuperação de senha.</p>
        <p>Clique no link abaixo para redefinir sua senha:</p>
        <a href="${resetLink}">${resetLink}</a>
         `
    });

    return "enviado";
};


module.exports = {
    sendMailError,
    faleComDono,
    faleComDonoCliente,
    contato,
    novoUsuario,
    forgotPasswordEmail
};


//<p>Nossa equipe de suporte está pronta para ajudar caso você precise de alguma assistência. Entre em contato conosco pelo e-mail: <a href="mailto:${data.email}">${data.email}</a>.</p>
//<p>Nossa equipe de suporte está pronta para ajudar caso você precise de alguma assistência. Entre em contato conosco pelo e-mail: <a href="mailto:${data.email}">${data.email}</a>.</p>

