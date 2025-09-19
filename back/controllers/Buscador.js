//models
const database = require('../config/db');
const Caderno = require('../models/table_caderno');
const Anuncio = require('../models/table_anuncio');
const Atividade = require('../models/table_atividade');
const Promocao = require('../models/table_promocao');
const Uf = require('../models/table_uf');
const path = require('path');
const fs = require('fs');

const Sequelize = require('sequelize');
const Pagamento = require('../models/table_pagamentos');
const { Op } = Sequelize;

module.exports = {
    busca: async (req, res) => {
        const paginaAtual = req.query.page ? parseInt(req.query.page) : 1; // Página atual, padrão: 1
        const porPagina = 10; // Número de itens por página
        const offset = (paginaAtual - 1) * porPagina;


        const { uf, cidade, atividade, name, telefone, nu_documento, codigoCaderno } = req.body;
        //console.table([name, atividade, telefone, nu_documento, uf, codigoCaderno]);

        //anuncio
        const anuncios = await database.query(`
  SELECT DISTINCT a.*
  FROM anuncio a
  LEFT JOIN tags t ON t.codAnuncio = a.codAnuncio
  WHERE (
    a.descAnuncio LIKE :termo OR 
    a.codAtividade LIKE :termo OR 
    t.tagValue LIKE :termo
  )
  AND a.codUf = :uf
  AND a.codCaderno = :caderno
  ORDER BY codAtividade ASC, codTipoAnuncio DESC, createdAt ASC, descAnuncio ASC
  LIMIT :limit OFFSET :offset
`, {
            replacements: {
                termo: `${atividade}%`,
                uf: uf,
                caderno: codigoCaderno,
                limit: porPagina,
                offset: offset
            },
            type: database.QueryTypes.SELECT,
        });

//activate ASC, createdAt DESC, codDuplicado ASC
        console.log(req.query, anuncios)

        if (req.query.totalPages > 0) {
            return res.json({
                success: true, data: anuncios,
                paginaAtual: req.query.paginaAtual,
                totalPaginas: req.query.totalPaginas,
                totalItem: req.query.totalItens
            });
        } else {
            /*             const resultAnuncioCount = await Anuncio.count({
                            where: {
                                [Op.and]: [
                                    { codCaderno: codigoCaderno },
                                    { codUf: uf },
                                    {
                                        [Op.or]: [
                                            ///Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('descAnuncio')), 'LIKE', `${atividade.toLowerCase()}%`),
                                            { descAnuncio: { [Op.like]: `${atividade}%` } },
                                            //{ codAtividade: { [Op.like]: `%${atividade}%` } }, //atividades.length > 0 ? atividades[0].id : "" },
                                            //{ descTelefone: atividade },
                                            //{ descCPFCNPJ: atividade },
                                            {
                                                tags: {
                                                    [Op.like]: `%${atividade}%`
                                                }
                                            }
                                        ]
                                    }
                                ]
                            },
                            //attributes: ['codAnuncio']
                        }); */


            const [resultAnuncioCount] = await database.query(`
  SELECT COUNT(DISTINCT a.codAnuncio) AS total
  FROM anuncio a
  LEFT JOIN tags t ON t.codAnuncio = a.codAnuncio
  WHERE (
    a.descAnuncio LIKE :termo OR
    a.codAtividade LIKE :termo OR
    t.tagValue LIKE :termo
  )
  AND a.codUf = :uf
  AND a.codCaderno = :caderno
`, {
                replacements: {
                    termo: `${atividade}%`,
                    uf: uf,
                    caderno: codigoCaderno
                },
                type: database.QueryTypes.SELECT
            });



            const totalItens = resultAnuncioCount.total;
            const totalPaginas = Math.ceil(totalItens / porPagina);

            res.json({
                success: true, data: anuncios,
                paginaAtual: paginaAtual,
                totalPaginas: totalPaginas,
                totalItem: totalItens, teste: ""
            });
        }

        return;

        const verificarAtividade = await Atividade.findOne({
            where: {
                atividade: { [Op.like]: `${atividade}` }
            },
            raw: true
        });


        if (verificarAtividade) {
            const anuncios = await Anuncio.findAll({
                where: {
                    [Op.and]: [
                        { codCaderno: codigoCaderno },
                        { codUf: uf },
                        {
                            [Op.or]: [
                                ///Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('descAnuncio')), 'LIKE', `${atividade.toLowerCase()}%`),
                                //{ descAnuncio: { [Op.like]: `${atividade}%` } },
                                { codAtividade: { [Op.like]: `${atividade}%` } }, //atividades.length > 0 ? atividades[0].id : "" },
                                //{ descTelefone: atividade },
                                //{ descCPFCNPJ: atividade },
                                /* {
                                    tags: {
                                        [Op.like]: `%${atividade}%`
                                    }
                                } */
                            ]
                        }
                    ]
                },
                limit: porPagina,
                offset: offset,
                order: [
                    //[Sequelize.literal('CASE WHEN activate = 0 THEN 0 ELSE 1 END'), 'ASC'],
                    ['activate', 'ASC'],
                    ['createdAt', 'DESC'],
                    ['codDuplicado', 'ASC'],
                ],
                //attributes: ['codAnuncio', 'codAtividade', 'descAnuncio']
            });

            //console.log(req.query, anuncios)

            if (req.query.totalPages > 0) {
                console.log("dasdafasdfsfasfdasfasfasdfasdfa")
                return res.json({
                    success: true, data: anuncios,
                    paginaAtual: req.query.paginaAtual,
                    totalPaginas: req.query.totalPaginas,
                    totalItem: req.query.totalItens
                });
            } else {
                const resultAnuncioCount = await Anuncio.count({
                    where: {
                        [Op.and]: [
                            { codCaderno: codigoCaderno },
                            { codUf: uf },
                            {
                                [Op.or]: [
                                    ///Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('descAnuncio')), 'LIKE', `${atividade.toLowerCase()}%`),
                                    //{ descAnuncio: { [Op.like]: `${atividade}%` } },
                                    { codAtividade: { [Op.like]: `%${atividade}%` } }, //atividades.length > 0 ? atividades[0].id : "" },
                                    //{ descTelefone: atividade },
                                    //{ descCPFCNPJ: atividade },
                                    /*  {
                                         tags: {
                                             [Op.like]: `%${atividade}%`
                                         }
                                     } */
                                ]
                            }
                        ]
                    },
                    //attributes: ['codAnuncio']
                });

                const totalItens = resultAnuncioCount;
                const totalPaginas = Math.ceil(totalItens / porPagina);

                res.json({
                    success: true, data: anuncios,
                    paginaAtual: paginaAtual,
                    totalPaginas: totalPaginas,
                    totalItem: totalItens
                });
            }
        } 
    },
    buscarCaderno: async (req, res) => {
        const uf = req.query.uf;

        try {
                  const cadernos = await Caderno.findAll({
            where: {
                UF: uf
            },
            order: [
                ['isCapital', 'ASC'],
                ['nomeCaderno', 'ASC']
            ],
        });

        return res.json(cadernos);
        } catch (error) {
            console.log(error)
        }
  
    },
    buscarUf: async (req, res) => {

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

        const codAtividade = req.params.codAtividade;

        //Atividades
        const resultAtividades = await Atividade.findAll();

        res.json(resultAtividades);
    },
    buscaAnuncio: async (req, res) => {
        await database.sync();

        const codigoAnuncio = req.params.codAnuncio;

        //anuncio
        const resultAnuncio = await Anuncio.findAll({
            where: {
                codAnuncio: codigoAnuncio
            },
            include: [{
                model: Promocao,
                as: 'promoc',
                attributes: ['data_validade', 'banner']
            },
            {
                model: Pagamento,
                as: 'dataPagamento',
                attributes: ['data']
            }]
        });

        try {
            const cader = await resultAnuncio[0].getCaderno();
            const atividades = await resultAnuncio[0].getAtividade();
            const descontoHash = await resultAnuncio[0].getDesconto();
            console.log(resultAnuncio[0].codCaderno)

            resultAnuncio[0].setDataValue('nomeCaderno', resultAnuncio[0].codCaderno);
            resultAnuncio[0].setDataValue('nomeAtividade', resultAnuncio[0].codAtividade);
            resultAnuncio[0].setDataValue('hash', resultAnuncio[0].codDesconto);
            /*      resultAnuncio[0].setDataValue('nomeCaderno', cader.dataValues.nomeCaderno);
                 resultAnuncio[0].setDataValue('nomeAtividade', atividades.dataValues.atividade);
                 resultAnuncio[0].setDataValue('hash', descontoHash.hash); */

            res.json(resultAnuncio);
        } catch (err) {
            console.log(err)
        }

        //anun.codCaderno = cader ? cader.nomeCaderno : "não registrado";

        //resultAnuncio[0].setDataValue('nomeCaderno', cader[0].nomeCaderno);


    },
    progressImport: async (req, res) => {

        // Caminho do arquivo JSON
        const filePath = path.join(__dirname, '../public/importLog.json');

        // Função para ler o arquivo JSON
        function readJsonFile(filePath) {
            try {
                const jsonData = fs.readFileSync(filePath, 'utf8'); // Lê o arquivo como texto
                const data = JSON.parse(jsonData); // Converte o texto em um objeto JavaScript
                //console.log('Conteúdo do arquivo JSON:', data);
                res.json({ success: true, message: data })
                return data;
            } catch (error) {
                console.error('Erro ao ler o arquivo JSON:', error);
                return null;
            }
        }

        // Chamar a função
        const jsonData = readJsonFile(filePath);

        // Exemplo: acessar os dados do JSON
        /*      if (jsonData) {
                 console.log(`Nome: ${jsonData.name}`);
                 console.log(`Idade: ${jsonData.age}`);
                 console.log(`Email: ${jsonData.email}`);
             } */



    },
    buscarPromocoes: async (req, res) => {
        const { caderno, uf } = req.params;

        const promocoes = await Promocao.findAll({
            where: {
                uf: uf,
                caderno: caderno
            },
            include: {
                model: Anuncio,
                as: 'anuncio',
                attributes: ['codAtividade', 'descEndereco']
            }
        });

        if (promocoes.length < 1) {
            res.json({ success: false, message: 'não existe promoção para esse caderno' }).status(404)
        } else {
            res.json({ success: true, promocoes: promocoes }).status(200)
        }

    }
}