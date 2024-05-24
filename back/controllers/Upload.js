const database = require('../config/db');
const Users = require('../models/table_user_login');
const Anuncio = require('../models/table_anuncio');
const path = require('path');

module.exports = {
    uploadImg: async (req, res) => {
        console.log(req.query.cod)
        if (req.file) {
            //console.log(req.file);

         /*    const listaAnuncio = await Anuncio.update({
                descImagem: req.file.filename
            }, {
                where: {

                }
            }); */
            

            return res.json({
                erro: false,
                mensagem: "Upload realizado com sucesso!"
            });
        }
    
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Upload não realizado com sucesso, necessário enviar uma imagem PNG ou JPG!"
        });

    },
    listFiles: async(req, res) => {
        res.send("ok")
     }
}