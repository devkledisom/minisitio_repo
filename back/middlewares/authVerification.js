const key = require('../config/config.js');
const jwt = require('jsonwebtoken');


const verificarToken = (req, res, next) => {
    const secretKey = key.apiSecret;
    const token = req.headers.authorization?.split(" ")[1]; // Pegando só o token sem "Bearer"

    if (!token) return res.status(401).json({ message: "Token não fornecido" });

    try {
        const decoded = jwt.verify(token, secretKey); // Decodifica o token
        req.userId = decoded.uuid; // Salva o ID no objeto req
        console.log("dev", decoded, decoded.uuid)
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token inválido" });
    }
};

module.exports = verificarToken;