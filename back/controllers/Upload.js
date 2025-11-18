const database = require('../config/db');
const Users = require('../models/table_user_login');
const Anuncio = require('../models/table_anuncio');
const path = require('path');
const fs = require('node:fs/promises');

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
                success: true,
                fileName: req.file.filename,
                mensagem: "Upload realizado com sucesso!"
            });
        }

        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Upload não realizado com sucesso, necessário enviar uma imagem PNG ou JPG!"
        });

    },
    uploadPdf: async (req, res) => {
        console.log(req.query.cod, req.savedFileName, req.query.id)

        const caminho = path.join(__dirname, '../public/cartaoDigital/' + req.query.id);

        apagarPdfAntigo(caminho)

        async function apagarPdfAntigo(caminho) {
            try {
                await fs.unlink(caminho);
            } catch (err) {
                if (err.code === "ENOENT") {
                    console.error(`Erro: Arquivo "${caminho}" não encontrado.`);
                } else {
                    console.error(`Erro ao apagar o arquivo "${caminho}":`, err);
                }
            }
        }

        if (req.file) {
            return res.json({
                erro: true,
                mensagem: "Upload realizado com sucesso!",
                name: req.savedFileName
            });
        }

        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Upload não realizado com sucesso, necessário enviar uma imagem PNG ou JPG!"
        });

    },
    listFiles: async (req, res) => {
        res.send("ok")
    }
}