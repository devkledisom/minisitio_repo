//models
const database = require('../config/db');
const Caderno = require('../models/table_caderno');
const Anuncio = require('../models/table_anuncio');
const Atividade = require('../models/table_atividade');
const Uf = require('../models/table_uf');
const Usuarios = require('../models/table_usuarios');
const Ufs = require('../models/table_uf');
const Cadernos = require('../models/table_caderno');
const Descontos = require('../models/table_desconto');

//moduls
const Sequelize = require('sequelize');
const { Op } = Sequelize;

module.exports = {
    listarUsuarios: async (req, res) => {
        await database.sync();


        //anuncio
        //const users = await Usuarios.findAll();

        const paginaAtual = req.query.page ? parseInt(req.query.page) : 1; // Página atual, padrão: 1
        const porPagina = 10; // Número de itens por página
        const codigoCaderno = req.params.codCaderno;

        const offset = (paginaAtual - 1) * porPagina;

        // Consulta para recuperar apenas os itens da página atual
        const users = await Usuarios.findAndCountAll({
            limit: porPagina,
            offset: offset
        });

        // Número total de itens
        const totalItens = users.count;
        // Número total de páginas
        const totalPaginas = Math.ceil(totalItens / porPagina);

        console.log({
            anuncios: users.rows, // Itens da página atual
            paginaAtual: paginaAtual,
            totalPaginas: totalPaginas
        })



        res.json({
            usuarios: users.rows, // Itens da página atual
            paginaAtual: paginaAtual,
            totalPaginas: totalPaginas
        });
    },
    listarCadernos: async (req, res) => {
        const listaCadernos = await Cadernos.findAll();
        const listaUf = await Ufs.findAll();
        /*res.json({success: true, data: {cidades: listaCadernos, estados: listaUf} }) */
        console.log(req.query.page)

        const paginaAtual = req.query.page ? parseInt(req.query.page) : 1; // Página atual, padrão: 1
        const porPagina = 10; // Número de itens por página
        const codigoCaderno = req.params.codCaderno;

        const offset = (paginaAtual - 1) * porPagina;

        // Consulta para recuperar apenas os itens da página atual
        const anuncios = await Cadernos.findAndCountAll({
            /*         where: {
                        codCaderno: 2,
                    }, */
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
            success: true, data: { cidades: listaCadernos, estados: listaUf }, message: {
                anuncios: anuncios.rows, // Itens da página atual
                paginaAtual: paginaAtual,
                totalPaginas: totalPaginas
            }
        })

        /*    res.json({
               anuncios: anuncios.rows, // Itens da página atual
               paginaAtual: paginaAtual,
               totalPaginas: totalPaginas
           }); */

    },
    //atividades
    listarAtividades: async (req, res) => {

        const paginaAtual = req.query.page ? parseInt(req.query.page) : 1; // Página atual, padrão: 1
        const porPagina = 10; // Número de itens por página
        const codigoCaderno = req.params.codCaderno;

        const offset = (paginaAtual - 1) * porPagina;

        // Consulta para recuperar apenas os itens da página atual
        const atividades = await Atividade.findAndCountAll({
            /*         where: {
                        codCaderno: 2,
                    }, */
            limit: porPagina,
            offset: offset
        });

        // Número total de itens
        const totalItens = atividades.count;
        // Número total de páginas
        const totalPaginas = Math.ceil(totalItens / porPagina);



        // Importe a biblioteca 'iconv-lite'
        const iconv = require('iconv-lite');

        // Função para corrigir caracteres codificados incorretamente
        function corrigirCaracteres(cadeiaCodificada) {
            // Decodifica a cadeia usando UTF-8
            const buffer = Buffer.from(cadeiaCodificada, 'binary');
            const cadeiaCorrigida = iconv.decode(buffer, 'utf-8');

            return cadeiaCorrigida;
        }


        atividades.rows.map(item => {
            console.log(item.dataValues.atividade);
            item.dataValues.atividade = corrigirCaracteres(item.dataValues.atividade)
        })

        res.json({
            success: true, message: {
                atividades: atividades.rows, // Itens da página atual
                paginaAtual: paginaAtual,
                totalPaginas: totalPaginas
            }
        })



    },
    listarAtividadesId: async (req, res) => {



        // Consulta para recuperar apenas os itens da página atual
        const atividades = await Atividade.findAll({
            where: {
                [Op.or]: [
                    { id: req.query.id ? req.query.id : "" },
                    { atividade: req.query.nome ? req.query.nome : "" }
                ]

            },

        });

        // Importe a biblioteca 'iconv-lite'
        const iconv = require('iconv-lite');

        // Função para corrigir caracteres codificados incorretamente
        function corrigirCaracteres(cadeiaCodificada) {
            // Decodifica a cadeia usando UTF-8
            const buffer = Buffer.from(cadeiaCodificada, 'binary');
            const cadeiaCorrigida = iconv.decode(buffer, 'utf-8');

            return cadeiaCorrigida;
        }


        atividades.map(item => {
            console.log(item.dataValues.atividade);
            item.dataValues.atividade = corrigirCaracteres(item.dataValues.atividade)
        })

        res.json({
            success: true, message: atividades
        })


    },
    atualizarAtividades: async (req, res) => {

        // Consulta para recuperar apenas os itens da página atual
        const atividades = await Atividade.update({
            atividade: req.body.atividade,
            corTitulo: req.body.corTitulo
        }, {
            where: {
                id: req.query.id,
            },

        });


        res.json({
            success: true, message: atividades
        })


    },
    deleteAtividade: async (req, res) => {

        const uuid = req.params.id;

        try {
            //Atividades
            const resultAnuncio = await Atividade.destroy({
                where: {
                    id: uuid
                }

            });
            res.json(resultAnuncio);
        } catch (err) {
            res.json(err);
        }

    },
    criarAtividade: async (req, res) => {

        try {
            //Atividades
            const atividadeCriada = await Atividade.create({

                atividade: req.body.atividade,
                corTitulo: req.body.corTitulo

            });
            res.json({ success: true, message: atividadeCriada });
        } catch (err) {
            res.json({ success: false, message: err });
        }

    },
    //gerenciar Ids
    listarIds: async (req, res) => {

        const paginaAtual = req.query.page ? parseInt(req.query.page) : 1; // Página atual, padrão: 1
        const porPagina = 10; // Número de itens por página
        const codigoCaderno = req.params.codCaderno;

        const offset = (paginaAtual - 1) * porPagina;

        // Consulta para recuperar apenas os itens da página atual
        const Ids = await Descontos.findAndCountAll({
            /*         where: {
                        codCaderno: 2,
                    }, */
            limit: porPagina,
            offset: offset
        });

        // Número total de itens
        const totalItens = Ids.count;
        // Número total de páginas
        const totalPaginas = Math.ceil(totalItens / porPagina);



        // Importe a biblioteca 'iconv-lite'
        const iconv = require('iconv-lite');

        // Função para corrigir caracteres codificados incorretamente
        function corrigirCaracteres(cadeiaCodificada) {
            // Decodifica a cadeia usando UTF-8
            const buffer = Buffer.from(cadeiaCodificada, 'binary');
            const cadeiaCorrigida = iconv.decode(buffer, 'utf-8');

            return cadeiaCorrigida;
        }


        Ids.rows.map(item => {
            console.log(item.dataValues.descricao);
            item.dataValues.atividade = corrigirCaracteres(item.dataValues.descricao)
        })

        res.json({
            success: true, message: {
                IdsValue: Ids.rows, // Itens da página atual
                paginaAtual: paginaAtual,
                totalPaginas: totalPaginas
            }
        })



    },
    listarUserId: async (req, res) => {
        await database.sync();

        const uuid = req.params.id;

        //Atividades
        const resultAnuncio = await Descontos.findAll({
            where: {
                idDesconto: uuid
            }
        });



        res.json(resultAnuncio);
    },
    atualizarIds: async (req, res) => {

        // Consulta para recuperar apenas os itens da página atual
        const atividades = await Descontos.update({
            descricao: req.body.descricao,
            desconto: req.body.valorDesconto,
        }, {
            where: {
                idDesconto: req.query.id,
            },

        });


        res.json({
            success: true, message: atividades
        })


    },
    criarIds: async (req, res) => {



        const usuario = await Usuarios.findAll({
            where: {
                codUsuario: req.body.usuario
            }
        });


        try {
            //Descontos
            const descontoCriado = await Descontos.create({
                idUsuario: req.body.usuario,
                userType: usuario[0].codTipoPessoa,
                desconto: req.body.valorDesconto,
                descricao: req.body.descricao,
                hash: req.body.hash,
                borda: null,
                descImagem: null,
                descLink: "#",
                borda2: null,
                descPromocao: null,
                descLink2: "#",
                dtCadastro: "12/12/2012",
                ativo: req.body.patrocinador,
                utilizar_saldo: req.body.saldoUtilizado,
                saldo: 0


            });

            console.log(req.body)

            res.json({ success: true, message: "ID criado com sucesso!" });
        } catch (err) {
            res.json({ success: false, message: err });
        }

    },
    deleteIds: async (req, res) => {

        const uuid = req.params.id;

        try {
            //Atividades
            const resultAnuncio = await Descontos.destroy({
                where: {
                    idDesconto: uuid
                }

            });
            res.json({ success: true, message: `Usuário ${uuid} apagado da base!` });
        } catch (err) {
            res.json(err);
        }

    },
    buscarId: async (req, res) => {
        await database.sync();

        const nu_hash = req.params.id;


        //Descontos
        const resultAnuncio = await Descontos.findAll({
            where: {
                hash: nu_hash
            }
        });

        if (resultAnuncio < 1) {
            res.json({ success: false, message: "Usuario não encontrado" });
            return;
        }
        console.log(resultAnuncio)

        res.json({ success: true, IdsValue: resultAnuncio });



    },
    //espacos
    listarEspacos: async (req, res) => {

        const paginaAtual = req.query.page ? parseInt(req.query.page) : 1; // Página atual, padrão: 1
        const porPagina = 10; // Número de itens por página

        const offset = (paginaAtual - 1) * porPagina;

        // Consulta para recuperar apenas os itens da página atual
        const atividades = await Anuncio.findAndCountAll({
            limit: porPagina,
            offset: offset
        });

        // Número total de itens
        const totalItens = atividades.count;
        // Número total de páginas
        const totalPaginas = Math.ceil(totalItens / porPagina);



        // Importe a biblioteca 'iconv-lite'
        const iconv = require('iconv-lite');

        // Função para corrigir caracteres codificados incorretamente
        function corrigirCaracteres(cadeiaCodificada) {
            // Decodifica a cadeia usando UTF-8
            const buffer = Buffer.from(cadeiaCodificada, 'binary');
            const cadeiaCorrigida = iconv.decode(buffer, 'utf-8');

            return cadeiaCorrigida;
        }


        /*    atividades.rows.map(item => {
               console.log(item.dataValues.atividade);
               item.dataValues.atividade = corrigirCaracteres(item.dataValues.atividade)
           })
    */
        res.json({
            success: true, message: {
                anuncios: atividades.rows, // Itens da página atual
                paginaAtual: paginaAtual,
                totalPaginas: totalPaginas
            }
        })



    }


}