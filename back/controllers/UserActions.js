const Sequelize = require('sequelize');
const { Op } = Sequelize;

//MODELS
const Anuncio = require('../models/table_anuncio');

//VIEW ENGINE
const ejs = require('ejs');

module.exports = {
    cartaoDigital: async (req, res) => {
        const espaco = req.query.espaco;

        const anuncio = await Anuncio.findOne({
            where: {
                codAnuncio: 1
            }
        });


        const objAnuncio = {
            nmAnuncio: anuncio.descAnuncio,
            endereco: anuncio.descEndereco,
            telefone: anuncio.descTelefone,
            infos: anuncio.tags, 
            site: anuncio.descSite,
            minisitio: espaco
        };

        var pdf = require('html-pdf');

        var nomeUser = "kledisom";

    ejs.renderFile("./ejs/cartaoDigital.ejs", {
        nmAnuncio: anuncio.descAnuncio,
        endereco: anuncio.descEndereco,
        telefone: anuncio.descTelefone,
        infos: anuncio.tags, 
        site: anuncio.descSite,
        minisitio: espaco
    }, (err, html) => {
            if (err) {
                console.log("erro!", err)
            } else {
                console.log(html)

                pdf.create(html, {
                  "height": "20in",        // allowed units: mm, cm, in, px
                    "width": "11in",                     
                }).toFile("../back/public/cartaoDigital/teste.pdf", (err, result) => {
                    if (err) {
                        console.log("um erro aconteceu", err)
                    } else {
                        //console.log(result)
                        res.render('cartaoDigital', {
                            nome: nomeUser
                        });
                    }


                });


            }
        }); 
    }
}