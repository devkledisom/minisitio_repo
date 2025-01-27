const key = require('../config/config.js');
const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  const secretKey = key.apiSecret;
    const authToken = req.headers['authorization'];
    console.log(authToken, req.headers)

    if (authToken != undefined) {

        const bearer = authToken.split(' ');
        let token = bearer[1];

        jwt.verify(token, secretKey, (err, data) => {
            if (err) {
                console.log(err)
                res.status(401);
                res.json({ success: false, message: "Token inválido" });
            } else {
                req.token = token;
                req.user = { id: data.id, nome: data.nome };

                next();
            }
        });

    } else {
        res.status(401);
        res.json({ success: false, message: "Token Inválido" });
    } 
};

module.exports = auth;