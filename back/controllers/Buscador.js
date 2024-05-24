//models
const database = require('../config/db');
const Caderno = require('../models/table_caderno');
const Anuncio = require('../models/table_anuncio');
const Atividade = require('../models/table_atividade');
const Uf = require('../models/table_uf');

module.exports = {
    busca: async (req, res) => {
        await database.sync();

        const { uf, cidade, atividade, name, telefone, nu_documento, codigoCaderno } = req.body;

        /*        const result = await Caderno.findAll({
                   where: {
                       codUf: uf,
                       nomeCaderno: cidade
                   }
               }); */

        //anuncio
        const anuncios = await Anuncio.findAll({
            where: {
                codCaderno: codigoCaderno,
                //codAtividade: 6
            }
        });

        //Atividades
        const atividades = await Atividade.findAll({
            where: {
                atividade: atividade
            }
        });

        const anuncio = anuncios.filter((item) => {
            var verificarCodAtividade = (atividades.length == 0) ? null : atividades[0].id;
            return item.descAnuncio == atividade ||
                item.descTelefone == atividade ||
                item.descCPFCNPJ == atividade ||
                item.codAtividade == verificarCodAtividade;
        })


        //console.log(atividade, atividades[0].id)

        res.json(anuncio);
    },
    buscarCaderno: async (req, res) => {
        await database.sync();

        const cadernos = await Caderno.findAll();

        res.json(cadernos);
    },
    buscarUf: async (req, res) => {
        await database.sync();

        const ufs = await Uf.findAll();

        res.json(ufs);
    },
    buscaGeralCaderno: async (req, res) => {
        /*        await database.sync();
       
               const codigoCaderno = req.params.codCaderno;
       
               //anuncio
               const anuncios = await Anuncio.findAll({
                   where: {
                       codCaderno: codigoCaderno,
                   }
               }); */


        //console.log(atividade, atividades[0].id)

        const paginaAtual = req.query.page ? parseInt(req.query.page) : 1; // Página atual, padrão: 1
        const porPagina = 10; // Número de itens por página
        const codigoCaderno = req.params.codCaderno;

        const offset = (paginaAtual - 1) * porPagina;

        // Consulta para recuperar apenas os itens da página atual
        const anuncios = await Anuncio.findAndCountAll({
            where: {
                codCaderno: codigoCaderno,
            },
            limit: porPagina,
            offset: offset
        });

        // Número total de itens
        const totalItens = anuncios.count;
        // Número total de páginas
        const totalPaginas = Math.ceil(totalItens / porPagina);

        console.log({
            anuncios: anuncios.rows, // Itens da página atual
            paginaAtual: paginaAtual,
            totalPaginas: totalPaginas
        })

        res.json({
            anuncios: anuncios.rows, // Itens da página atual
            paginaAtual: paginaAtual,
            totalPaginas: totalPaginas
        });
    },
    buscaAtividade: async (req, res) => {
        await database.sync();

        const codAtividade = req.params.codAtividade;

        //Atividades
        const resultAtividades = await Atividade.findAll();

        res.json(resultAtividades);
    },
    buscaAnuncio: async (req, res) => {
        await database.sync();

        const codigoAnuncio = req.params.codAnuncio;

        //Atividades
        const resultAnuncio = await Anuncio.findAll({
            where: {
                codAnuncio: codigoAnuncio
            }
        });

        res.json(resultAnuncio);
    }
}