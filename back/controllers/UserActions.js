const Sequelize = require('sequelize');
const { Op } = Sequelize;
const masterPath = require('../config/config');

//MODELS
const Anuncio = require('../models/table_anuncio');

//VIEW ENGINE
const ejs = require('ejs');

module.exports = {
    cartaoDigital: async (req, res) => {
        const espaco = req.query.espaco;
        const id = req.query.id;

        const anuncio = await Anuncio.findOne({
            where: {
                codAnuncio: id
            }
        });


        const objAnuncio = {
            nmAnuncio: anuncio.descAnuncio,
            endereco: anuncio.descEndereco == "atualizar" ? "" : anuncio.descEndereco,
            telefone: anuncio.descTelefone,
            infos: anuncio.tags,
            site: anuncio.descSite,
            minisitio: espaco
        };

        var pdf = require('html-pdf');

        var nomeUser = "kledisom";

        ejs.renderFile("./ejs/cartaoDigital.ejs", {
            anuncio: anuncio.descAnuncio,
            endereco: anuncio.descEndereco == "atualizar" ? "Endereço da empresa" : anuncio.descEndereco,
            telefone: anuncio.descTelefone == 0 ? "(xx) xxxx-xxxx" : anuncio.descTelefone,
            celular: anuncio.descCelular == 0 ? "(xx) xxxxx-xxxx" : anuncio.descCelular,
            infos: anuncio.tags == null ? "Informações adicionais" : anuncio.tags,
            site: anuncio.descSite == null ? "Site da empresa" : anuncio.descSite,
            minisitio: espaco
        }, (err, html) => {
            if (err) {
                console.log("erro!", err)
            } else {
                console.log(html)

                pdf.create(html, {
                    "height": "20in",        // allowed units: mm, cm, in, px
                    "width": "5in",
                   /*  "border": {
                        "top": "0",            // default is 0, units: mm, cm, in, px
                        "right": "0",
                        "bottom": "0",
                        "left": "1.5in"
                      } */
                }).toFile("../back/public/cartaoDigital/teste.pdf", (err, result) => {
                    if (err) {
                        console.log("um erro aconteceu", err);
                    } else {
                        console.log(result)
                        res.json({success: true, url:`${masterPath.url}/cartaoDigital/teste.pdf`})
                     /*    res.render('cartaoDigital', {
                            anuncio: anuncio.descAnuncio,
                            endereco: anuncio.descEndereco == "atualizar" ? "Endereço da empresa" : anuncio.descEndereco,
                            telefone: anuncio.descTelefone == 0 ? "(xx) xxxx-xxxx" : anuncio.descTelefone,
                            celular: anuncio.descCelular == 0 ? "(xx) xxxxx-xxxx" : anuncio.descCelular,
                            infos: anuncio.tags == null ? "Informações adicionais" : anuncio.tags,
                            site: anuncio.descSite == null ? "Site da empresa" : anuncio.descSite,
                            minisitio: espaco
                        }); */
                    }


                });


            }
        });
    }
}