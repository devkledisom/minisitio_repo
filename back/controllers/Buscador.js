//models
const database = require('../config/db');
const Caderno = require('../models/table_caderno');
const Anuncio = require('../models/table_anuncio');
const Atividade = require('../models/table_atividade');
const Uf = require('../models/table_uf');

const Sequelize = require('sequelize');
const { Op } = Sequelize;

module.exports = {
    busca: async (req, res) => {
        await database.sync();

        const { uf, cidade, atividade, name, telefone, nu_documento, codigoCaderno } = req.body;
        console.table([name, atividade, telefone, nu_documento]);
        /*        const result = await Caderno.findAll({
                   where: {
                       codUf: uf,
                       nomeCaderno: cidade
                   }
               }); */

        
        //Atividades
        const atividades = await Atividade.findAll({
            where: {
                atividade: {[Op.like]: `%${atividade}%`}
            }
        });

        //console.log("debug: ", atividades);
        //console.log("debug: ", codigoCaderno, uf, atividades[0].id);

        //anuncio
        const anuncios = await Anuncio.findAll({
            where: {
                [Op.or]: [
                    {[Op.and]: [
                        {codCaderno: codigoCaderno},
                        {codUf: uf},
                        {
                            [Op.or]: [
                                Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('descAnuncio')), 'LIKE', `%${atividade.toLowerCase()}%`),
                                {codAtividade: atividades.length > 0 ? atividades[0].id : ""},
                                {descTelefone: atividade},
                                {descCPFCNPJ: atividade},
                                {tags: {
                                    [Op.like]: `%${atividade}%`
                                }}
                            ]
                        }
                    ]},
                    {[Op.and]: [
                        {codUf: uf},
                        {
                            [Op.or]: [
                                Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('descAnuncio')), 'LIKE', `%${atividade.toLowerCase()}%`),
                                {codAtividade: atividades.length > 0 ? atividades[0].id : ""},
                                {descTelefone: atividade},
                                {descCPFCNPJ: atividade},
                                {tags: {
                                    [Op.like]: `%${atividade}%`
                                }}
                            ]
                        }
                    ]}
                    
                ],
                /* [Op.or]: [
                    Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('descAnuncio')), 'LIKE', `%${atividade.toLowerCase()}%`),
                    {codAtividade: atividades.length > 0 ? atividades[0].id : ""},
                    {descTelefone: atividade},
                    {descCPFCNPJ: atividade},
                    {tags: {
                        [Op.like]: `%${atividade}%`
                    }}
                ] */
                //codAtividade: 6
            }
        });

        console.log(anuncios)

        if(atividades.length > 0) {
            console.log(atividades[0].id)
        };

        const anuncio = anuncios.filter((item) => {
            var verificarCodAtividade = (atividades.length == 0) ? null : atividades[0].id;
            return item.descAnuncio == atividade ||
                item.descTelefone == atividade ||
                item.descCPFCNPJ == atividade ||
                item.codAtividade == verificarCodAtividade;
        })


        //console.log(atividade, atividades[0].id)

        res.json(anuncios);
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
    buscaGeralCadernoold: async (req, res) => {
  
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
    buscaGeralCaderno: async (req, res) => {
  
        const paginaAtual = req.query.page ? parseInt(req.query.page) : 1; // Página atual, padrão: 1
        const porPagina = 10; // Número de itens por página
        const codigoCaderno = req.params.codCaderno;
        //const offset = (paginaAtual - 1) * porPagina;


        const todosRegistros = await Anuncio.findAll({
            order: [
                [Sequelize.literal('CASE WHEN activate = 0 THEN 0 ELSE 1 END'), 'ASC'],
                ['createdAt', 'DESC'],
                ['codDuplicado', 'ASC'],
            ],
            where: {
                [Op.and]: [
                    { codUf: 27 },
                    { codCaderno: 26 }
                ]
            },
        });
        
        const indexDoItem = todosRegistros.findIndex(item => item.codAnuncio == 1134);

        const paginaDoItem = Math.floor(2003 / porPagina) + 1;
        const offset = (paginaDoItem - 1) * porPagina;
        console.log("------------------->", paginaDoItem, indexDoItem);

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

        try {
            const cader = await resultAnuncio[0].getCaderno();
            const atividades = await resultAnuncio[0].getAtividade();

            resultAnuncio[0].setDataValue('nomeCaderno', cader.dataValues.nomeCaderno);
            resultAnuncio[0].setDataValue('nomeAtividade', atividades.dataValues.atividade);
        } catch(err) {
            //console.log(err)
        }
 
        //anun.codCaderno = cader ? cader.nomeCaderno : "não registrado";

        //resultAnuncio[0].setDataValue('nomeCaderno', cader[0].nomeCaderno);

        res.json(resultAnuncio);
    }
}