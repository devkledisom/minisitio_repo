//models
const database = require('../config/db');
const Anuncio = require('../models/table_anuncio');
const Atividade = require('../models/table_atividade');
const Uf = require('../models/table_uf');
const Usuarios = require('../models/table_usuarios');
const Ufs = require('../models/table_uf');
const Caderno = require('../models/table_caderno');
const Cadernos = require('../models/table_caderno');
const Descontos = require('../models/table_desconto');
const DDD = require('../models/table_ddd');


//Functions
const verificarNudoc = require('./identificarNuDoc');

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
    //cadernos
    listarCadernos: async (req, res) => {
        const listaCadernos = await Cadernos.findAll();
        const listaUf = await Ufs.findAll();
        /*res.json({success: true, data: {cidades: listaCadernos, estados: listaUf} }) */
        console.log(req.query.page)

        const paginaAtual = req.query.page ? parseInt(req.query.page) : 1; // Página atual, padrão: 1
        const porPagina = parseInt(req.query.rows) || 10; // Número de itens por página
        const codigoCaderno = req.params.codCaderno;

        const offset = (paginaAtual - 1) * porPagina;

        // Consulta para recuperar apenas os itens da página atual
        const anuncios = await Cadernos.findAndCountAll({
            order: [
                ['UF', 'ASC'], // Ordena pelo campo 'name' em ordem ascendente (alfabética)
                [Sequelize.literal('isCapital ASC')],
                ['nomeCaderno', 'ASC']

            ],
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
    criarCaderno: async (req, res) => {

        let ufSigla = await Ufs.findAll({
            where: {
                id_uf: req.body.codUf
            }
        });


        // Verificação e ajuste dos valores recebidos

        const mosaico = req.body.descImagem || 0;
        const cepInicial = req.body.cepInicial || 0;
        const cepFinal = req.body.cepFinal || 0;
        const capital = req.body.isCapital || 1;
        try {
            //Atividades
            const CadernoCriado = await Cadernos.create({
                codUf: req.body.codUf,
                UF: ufSigla[0].sigla_uf,
                nomeCaderno: req.body.nomeCaderno,
                nomeCadernoFriendly: req.body.nomeCadernoFriendly,
                descImagem: mosaico,
                cep_inicial: cepInicial,
                cep_final: cepFinal,
                isCapital: capital

            });
            res.json({ success: true, message: CadernoCriado });
        } catch (err) {
            res.json({ success: false, message: err });
            console.log(err)
        }

    },
    buscarRegistroCaderno: async (req, res) => {
        //const nu_hash = req.params.id;
        const nu_hash = req.query.search;


        //Descontos
        const resultAnuncio = await Cadernos.findAll({
            order: [
                ['UF', 'ASC'], // Ordena pelo campo 'name' em ordem ascendente (alfabética)
                [Sequelize.literal('isCapital ASC')],
                ['nomeCaderno', 'ASC']

            ],
            where: {
                [Op.or]: [
                    { UF: nu_hash },
                    { nomeCaderno: nu_hash },
                ]
            }
        });

        if (resultAnuncio < 1) {
            res.json({ success: false, message: "Registro não encontrado" });
            return;
        }

        res.json({
            success: true,
            message: {
                registros: resultAnuncio
            }
        });

    },
    atualizarCadernos: async (req, res) => {

        // Consulta para recuperar apenas os itens da página atual
        const cadernos = await Cadernos.update({
            codUf: req.body.codUf,
            UF: req.body.UF,
            nomeCaderno: req.body.nomeCaderno,
            nomeCadernoFriendly: req.body.nomeCaderno,
            descImagem: req.body.descImagem,
            cep_inicial: req.body.cep_inicial,
            cep_final: req.body.cep_final,
            isCapital: req.body.isCapital
        }, {
            where: {
                codCaderno: req.query.id
            },

        });


        res.json({
            success: true, message: cadernos
        })


    },
    deleteCadernos: async (req, res) => {

        const uuid = req.params.id;

        try {
            //Atividades
            const resultCaderno = await Cadernos.destroy({
                where: {
                    codCaderno: uuid
                }

            });
            res.json({ success: true, message: `Usuário ${uuid} apagado da base!` });
        } catch (err) {
            res.json(err);
        }

    },
    listarCadernoId: async (req, res) => {
        await database.sync();

        const uuid = req.params.id;

        //Atividades
        const resultCaderno = await Cadernos.findAll({
            where: {
                codCaderno: uuid
            }
        });

        res.json(resultCaderno);
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
                descImagem: req.body.descImagem,
                descImagem2: req.body.descImagem2,
                descImagem3: req.body.descImagem3,
                descLink: req.body.descLink || "#",
                borda2: null,
                descPromocao: null,
                descLink2: req.body.descLink2 || "#",
                descLink3: req.body.descLink3 || "#",
                dtCadastro: dataNow(),
                ativo: 1,
                utilizar_saldo: 0,
                saldo: req.body.saldo

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
    buscarDDD: async (req, res) => {
        await database.sync();

        const codUf = req.params.id;

        const dddBusca = await DDD.findAll({
            where: {
                id_uf: codUf
            }
        });

<<<<<<< HEAD
        const descontoBusca = await Descontos.count();

=======
>>>>>>> df008fdbf9e109404e2935e0dea287976642a27b
        if (dddBusca < 1) {
            res.json({ success: false, message: "ddd não encontrado" });
            return;
        }

<<<<<<< HEAD
        res.json({ success: true, data: dddBusca[0], qtdeIds: descontoBusca });
=======
        res.json({ success: true, data: dddBusca });
>>>>>>> df008fdbf9e109404e2935e0dea287976642a27b
        //Descontos
        /*  const resultAnuncio = await Descontos.findAll({
             where: {
                 hash: nu_hash
             }
         });
 
         if (resultAnuncio < 1) {
             res.json({ success: false, message: "Usuario não encontrado" });
             return;
         }
         console.log(resultAnuncio)
 
         res.json({ success: true, IdsValue: resultAnuncio }); */



    },
    //espacos
    listarEspacos: async (req, res) => {

        await database.sync();

        const paginaAtual = req.query.page ? parseInt(req.query.page) : 1; // Página atual, padrão: 1
        const porPagina = 10; // Número de itens por página

        const offset = (paginaAtual - 1) * porPagina;

        // Consulta para recuperar apenas os itens da página atual
        const anuncio = await Anuncio.findAndCountAll({
            limit: porPagina,
            offset: offset
        });

        // Número total de itens
        const totalItens = anuncio.count;
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

        anuncio.rows.map(async (anun, i) => {
            const cader = await anun.getCaderno();
            anun.codCaderno = cader ? cader.nomeCaderno : "não registrado";

            const estado = await anun.getUf();
            anun.codUf = estado.sigla_uf;

            const desconto = await anun.getDesconto();
            anun.codPA = desconto.hash;
            console.log("-----------------------------------> ", desconto);

            const user = await anun.getUsuario();
            anun.codUsuario = user.descNome;


            //console.log(cader.nomeCaderno);
            //console.log(desconto);


            if (i === anuncio.rows.length - 1) {
                res.json({
                    success: true,
                    message: {
                        anuncios: anuncio.rows, // Itens da página atual
                        paginaAtual: paginaAtual,
                        totalPaginas: totalPaginas
                    }
                })
            }

        })


        /*      const anun = await Anuncio.findOne({where: {codCaderno: 1}});
             const cader = await anun.getCaderno();
             console.log(cader); */


        /*    anuncio.rows.map(item => {
               console.log(item.dataValues.atividade);
               item.dataValues.atividade = corrigirCaracteres(item.dataValues.atividade)
           })
    */

        //console.log("teste", anuncio.rows[1].dataValues.descAnuncio)




    },
    buscarAnuncioId: async (req, res) => {
        //const nu_hash = req.params.id;
        const nu_hash = req.query.search;


        //Descontos
        const resultAnuncio = await Anuncio.findAll({
            where: {
                [Op.or]: [
                    { codAnuncio: nu_hash },
                    { descCPFCNPJ: nu_hash },
                ]
            }
        });

        if (resultAnuncio < 1) {
            res.json({ success: false, message: "Usuario não encontrado" });
            return;
        }

        res.json({
            success: true,
            message: {
                anuncios: resultAnuncio
            }
        });

    },
    listarAnuncioId: async (req, res) => {

        const uuid = req.params.id;

        //Anuncios
        const resultAnuncio = await Anuncio.findAll({
            where: {
                codAnuncio: uuid
            }
        });

        // Verifica se o resultado está vazio
        if (resultAnuncio.length === 0) {
            return res.status(404).json({ message: 'Anúncio não encontrado' });
        }

        let obj = resultAnuncio[0];

        const user = await obj.getUsuario();
        obj.codUsuario = user.descNome;

        const atividade = await obj.getAtividade();
        obj.codAtividade = atividade.atividade;

        console.log(atividade)


        res.json(resultAnuncio);
    },
    criarAnuncio: async (req, res) => {



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
    visualizacoes: async (req, res) => {



       const visualizacoesAtivas = await Anuncio.findAll({
            where: {
                codAnuncio: req.query.id
            }
        });
 

        try {
            //Descontos
            const aumentarVisualizacao = await Anuncio.update({
                qntVisualizacoes: visualizacoesAtivas[0].qntVisualizacoes + 1
            }, {
                where: {
                    codAnuncio: req.query.id
                }
            });

            console.log(req.body)

            res.json({ success: true, message: "Nova visualizção!" });
        } catch (err) {
            res.json({ success: false, message: err });
        }

    },


}

function dataNow() {
    // Criar um novo objeto Date (representando a data e hora atuais)
    var dataAtual = new Date();

    // Extrair os componentes da data e hora
    var ano = dataAtual.getFullYear();
    var mes = dataAtual.getMonth() + 1; // Meses começam de 0, então adicionamos 1
    var dia = dataAtual.getDate();
    var hora = dataAtual.getHours();
    var minutos = dataAtual.getMinutes();
    var segundos = dataAtual.getSeconds();

    // Formatar a data e hora
    var dataFormatada = ano + '-' + mes + '-' + dia;
    var horaFormatada = hora + ':' + minutos + ':' + segundos;

    // Exibir a data e hora atual
    console.log('Data atual:', dataFormatada);
    console.log('Hora atual:', horaFormatada);

    return dataFormatada + " " + horaFormatada;
};