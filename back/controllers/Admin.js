const fs = require('fs');



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
const Pin = require('../models/table_pin');




//Functions
const verificarNudoc = require('./identificarNuDoc');
const exportExcell = require('../functions/server');
const exportExcellId = require('../functions/serverExportId');
const exportExcellUser = require('../functions/serverExportUser');
const exportExcellCaderno = require('../functions/exportExcellCaderno');
const exportExcellAtividade = require('../functions/exportExcellAtividade');

//moduls
const Sequelize = require('sequelize');
const Desconto = require('../models/table_desconto');
const { Op } = Sequelize;
const readXlsxFile = require('read-excel-file/node');
const path = require('path');
const { totalmem } = require('os');


module.exports = {
    //usuarios
    listarUsuarios: async (req, res) => {
        await database.sync();

        const paginaAtual = req.query.page ? parseInt(req.query.page) : 1; // Página atual, padrão: 1
        const porPagina = 10; // Número de itens por página
        const codigoCaderno = req.params.codCaderno;

        const offset = (paginaAtual - 1) * porPagina;

        // Consulta para recuperar apenas os itens da página atual
        const users = await Usuarios.findAndCountAll({
            order: [['dtCadastro', 'DESC'], ['descNome', 'ASC']],
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
            totalPaginas: totalPaginas,
            totalItem: totalItens
        });
    },
    updateUserStatus: async (req, res) => {
        await database.sync();

        const uuid = req.params.id;

        const ativo = req.body.ativo;

        try {
            const listaUsers = await Desconto.update({
                "ativo": ativo == "Ativado" ? 0 : 1
            }, {
                where: {
                    idDesconto: uuid
                }
            });


            res.json({ success: true, message: listaUsers })
        } catch (err) {
            res.json({ success: false, message: err })
        }

    },
    exportUser: async (req, res) => {
        const anunciosCount = await Usuarios.count();
        const limit = Number(req.query.limit);
        const exportarTodos = req.query.exportAll;
        const ufs = await Ufs.findAll();
        const cidades = await Cadernos.findAll();

        console.log(req.query);

        if (exportarTodos == "true") {
            const corpo = req.body.usuarios;

            corpo.map(async (item, index) => {

                delete item.hashCode;
                delete item.descValue;
                delete item.descTelefone;
                delete item.descRepresentanteConvenio;
                delete item.descEndereco;
                delete item.usuarioCod;
                delete item.dtCadastro2;
                delete item.dtAlteracao;

                switch (item.codTipoUsuario) {
                    case 1:
                        corpo[index].codTipoUsuario = "SUPER ADMIN";
                        break;
                    case 2:
                        corpo[index].codTipoUsuario = "MASTER";
                        break;
                    case 3:
                        corpo[index].codTipoUsuario = "ANUNCIANTE";
                        break;
                    default:
                        console.log("tipo nao encontrado")
                };

                //estados
                ufs.forEach((uf) => {
                    if (item.codUf == uf.id_uf) {
                        corpo[index].codUf = uf.sigla_uf;
                    }
                });

                //cidades
                cidades.forEach((cidade) => {
                    if (item.codCidade == cidade.codCaderno) {
                        corpo[index].codCidade = cidade.nomeCaderno;
                    }
                });

                switch (item.ativo) {
                    case 1:
                        corpo[index].ativo = "Ativado";
                        break;
                    case 2:
                        corpo[index].ativo = "Desativado";
                        break;
                    default:
                        console.log("tipo nao encontrado")
                };

                const date = new Date(item.dtCadastro);

                const day = String(date.getDate()).padStart(2, '0'); // Adiciona zero à esquerda se necessário
                const month = String(date.getMonth() + 1).padStart(2, '0'); // Mês começa em 0, então é necessário adicionar 1
                const year = date.getFullYear();

                const formattedDate = `${day}/${month}/${year}`;
                corpo[index].dtCadastro = formattedDate;

            })

            exportExcellUser(corpo, res, Date.now(), 1);

        }
        if (exportarTodos == "false") {
            const usuarios = await Usuarios.findAll();
            const allUserObj = usuarios.map(registro => registro.get({ plain: true }));
            const corpo = allUserObj;

            corpo.map(async (item, index) => {

                delete item.hashCode;
                delete item.descValue;
                delete item.descTelefone;
                delete item.descRepresentanteConvenio;
                delete item.descEndereco;
                delete item.usuarioCod;
                delete item.dtCadastro2;
                delete item.dtAlteracao;

                switch (item.codTipoUsuario) {
                    case 1:
                        corpo[index].codTipoUsuario = "SUPER ADMIN";
                        break;
                    case 2:
                        corpo[index].codTipoUsuario = "MASTER";
                        break;
                    case 3:
                        corpo[index].codTipoUsuario = "ANUNCIANTE";
                        break;
                    default:
                        console.log("tipo nao encontrado")
                };

                //estados
                ufs.forEach((uf) => {
                    if (item.codUf == uf.id_uf) {
                        corpo[index].codUf = uf.sigla_uf;
                    }
                });

                //cidades
                cidades.forEach((cidade) => {
                    if (item.codCidade == cidade.codCaderno) {
                        corpo[index].codCidade = cidade.nomeCaderno;
                    }
                });

                switch (item.ativo) {
                    case 1:
                        corpo[index].ativo = "Ativado";
                        break;
                    case 2:
                        corpo[index].ativo = "Desativado";
                        break;
                    default:
                        console.log("tipo nao encontrado")
                };

                const date = item.dtCadastro;

                const day = String(date.getDate()).padStart(2, '0'); // Adiciona zero à esquerda se necessário
                const month = String(date.getMonth() + 1).padStart(2, '0'); // Mês começa em 0, então é necessário adicionar 1
                const year = date.getFullYear();

                const formattedDate = `${day}/${month}/${year}`;
                corpo[index].dtCadastro = formattedDate;

            })

            exportExcellUser(corpo, res, Date.now(), 2);
        }


        try {

        } catch (err) {
            console.log(err)
            res.json({ success: false, message: `o numero máximo de registros é ${anunciosCount}` })
        }




    },
    //cadernos
    listarCadernos: async (req, res) => {
        const listaCadernos = await Cadernos.findAll();
        const listaUf = await Ufs.findAll();

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
            limit: porPagina,
            offset: offset
        });

        // Número total de itens
        const totalItens = anuncios.count;
        // Número total de páginas
        const totalPaginas = Math.ceil(totalItens / porPagina);

        anuncios.rows.map((item) => {
            console.log(item)
        })

        console.log({
            anuncios: anuncios.rows, // Itens da página atual
            paginaAtual: paginaAtual,
            totalPaginas: totalPaginas,

        })

        res.json({
            success: true, data: { cidades: listaCadernos, estados: listaUf }, message: {
                anuncios: anuncios.rows, // Itens da página atual
                paginaAtual: paginaAtual,
                totalPaginas: totalPaginas,
                totalItem: totalItens
            }
        })

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
            /*       where: {
                      corTitulo: "normal"
                  }, */
            order: [
                [Sequelize.literal('corTitulo ASC')],
                //[Sequelize.fn('LEFT', Sequelize.col('atividade'), 1), 'ASC'],
                ['atividade', 'ASC'],
                ['createdAt', 'DESC'],

            ],
            limit: porPagina,
            offset: offset
        });



        const ordenarRegistros = (a, b) => {
            console.log(a.atividade[0])
            // Primeiro, compara o primeiro caractere de 'atividade'
            /*            const charA = a.atividade[0].toLowerCase();
                       const charB = b.atividade[0].toLowerCase();
                       console.log(charA, charB)
                       
                       if (charA < charB) return -1;
                       if (charA > charB) return 1;
                       
                       // Se o primeiro caractere for o mesmo, ordena pela data de criação (mais recente primeiro)
                       const dataA = new Date(a.createdAt);
                       const dataB = new Date(b.createdAt);
                       
                       return dataB - dataA; */
        };

        //const registrosOrdenados = atividades.rows.sort(ordenarRegistros);




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
            //console.log(item.dataValues.atividade);
            item.dataValues.atividade = item.dataValues.atividade;
            //item.dataValues.atividade = corrigirCaracteres(item.dataValues.atividade)
        })

        res.json({
            success: true, message: {
                atividades: atividades.rows, // Itens da página atual
                paginaAtual: paginaAtual,
                totalPaginas: totalPaginas,
                totalItem: totalItens
            }
        })



    },
    listarAtividadesId: async (req, res) => {



        // Consulta para recuperar apenas os itens da página atual
        const atividades = await Atividade.findAll({
            where: {
                [Op.or]: [
                    { id: req.query.id ? req.query.id : "" },
                    { atividade: { [Op.like]: `%${req.query.nome}%` } }
                    //req.query.nome ? req.query.nome : ""
                ]

            },

        });

        // Importe a biblioteca 'iconv-lite'
        const iconv = require('iconv-lite');

        // Função para corrigir caracteres codificados incorretamente
        /*  function corrigirCaracteres(cadeiaCodificada) {
             // Decodifica a cadeia usando UTF-8
             const buffer = Buffer.from(cadeiaCodificada, 'binary');
             const cadeiaCorrigida = iconv.decode(buffer, 'utf-8');
 
             return cadeiaCorrigida;
         }
 
 
         atividades.map(item => {
             console.log(item.dataValues.atividade);
             item.dataValues.atividade = corrigirCaracteres(item.dataValues.atividade)
         }) */

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
            res.json({ success: true, messege: resultAnuncio });
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
            //console.log(atividadeCriada);
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
            order: [['dtCadastro', 'DESC']],
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
                totalPaginas: totalPaginas,
                totalItem: totalItens

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
            patrocinador_ativo: req.body.patrocinador,
            descImagem: req.body.descImagem,
            descImagem2: req.body.descImagem2,
            descImagem3: req.body.descImagem3,
            descLink: req.body.descLink,
            descLink2: req.body.descLink2,
            descLink3: req.body.descLink3,
            utilizar_saldo: req.body.utilizarSaldo,
            saldo: req.body.addSaldo == '' ? 0 : req.body.addSaldo
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
                patrocinador_ativo: req.body.patrocinador,
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

        /*    if(pages === "all") {
               const allIds = await Descontos.findAll();
   
               res.json({success: true, data: allIds});
   
               return;
           }; */

        const nu_hash = req.params.id;


        //Descontos
        const resultAnuncio = await Descontos.findAll({
            where: {
                [Op.or]: [
                    { hash: nu_hash },
                    { idDesconto: nu_hash }
                ]

            }
        });
            console.log(resultAnuncio)
        if (resultAnuncio < 1) {
            res.json({ success: false, message: "ID não encontrado" });
            return;
        }
        console.log(resultAnuncio)

        res.json({ success: true, IdsValue: resultAnuncio });



    },
    buscarAllId: async (req, res) => {
        //Descontos
        const todosIds = await Descontos.findAll();

        if (todosIds < 1) {
            res.json({ success: false, message: "não encontrado" });
            return;
        }

        res.json({ success: true, data: todosIds });

    },
    buscarDDD: async (req, res) => {
        await database.sync();

        const codUf = req.params.id;

        const dddBusca = await DDD.findAll({
            where: {
                id_uf: codUf
            }
        });

        const descontoBusca = await Descontos.count();

        if (dddBusca < 1) {
            res.json({ success: false, message: "ddd não encontrado" });
            return;
        }

        res.json({ success: true, data: dddBusca[0], qtdeIds: descontoBusca });
        res.json({ success: true, data: dddBusca });
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
    exportID: async (req, res) => {
        const anunciosCount = await Anuncio.count();
        const limit = Number(req.query.limit);

        //console.log(req.body)

        try {
            /*      const anuncios = await Anuncio.findAll({
                     limit: limit
                 }); */
            /*        let dados = await Promise.all(req.body.map(async item => {
                       const {
                           codAtividade,
                           codPA,
                           tags,
                           codCidade,
                           descAnuncioFriendly,
                           descImagem,
                           descEndereco,
                           descCelular,
                           descDescricao,
                           descSite,
                           descSkype,
                           descPromocao,
                           descEmailComercial,
                           descEmailRetorno,
                           descFacebook,
                           descTweeter,
                           descCEP,
                           descTipoPessoa,
                           descNomeAutorizante,
                           descLat,
                           descLng,
                           formaPagamento,
                           promocaoData,
                           descContrato,
                           descAndroid,
                           descApple,
                           descInsta,
                           descPatrocinador,
                           descPatrocinadorLink,
                           qntVisualizacoes,
                           dtAlteracao,
                           descLinkedin,
                           descTelegram,
                           certificado_logo,
                           certificado_texto,
                           certificado_imagem,
                           cashback_logo,
                           cashback_link,
                           certificado_link,
                           cartao_digital,
                           descChavePix, ...newObject } = item;
       
       
       
                       return newObject;
                   })); */

            exportExcellId(req.body, res)
        } catch (err) {
            console.log(err)
            res.json({ success: false, message: `o numero máximo de registros é ${anunciosCount}` })
        }




    },
    //ESPACOS
    listarEspacos: async (req, res) => {

        await database.sync();

        const paginaAtual = req.query.page ? parseInt(req.query.page) : 1; // Página atual, padrão: 1
        const porPagina = 10; // Número de itens por página

        const offset = (paginaAtual - 1) * porPagina;

        // Consulta para recuperar apenas os itens da página atual
        const anuncio = await Anuncio.findAndCountAll({
            order: [
                [Sequelize.literal('CASE WHEN activate = 0 THEN 0 ELSE 1 END'), 'ASC'],
                ['createdAt', 'DESC'],
                ['codDuplicado', 'ASC'],
            ],
            limit: porPagina,
            offset: offset
        });
        console.log("dasdasdsa", anuncio)

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

        try {
            await Promise.all(anuncio.rows.map(async (anun, i) => {
                const cader = await anun.getCaderno();
                anun.codCaderno = cader ? cader.nomeCaderno : "não registrado";

                const estado = await anun.getUf();
                anun.codUf = estado.sigla_uf;

                const desconto = await anun.getDesconto();
                anun.codPA = desconto != undefined ? desconto.hash : "99.999.9999";

                const user = await anun.getUsuario();
                anun.codUsuario = user.descNome;
                anun.dataValues.loginUser = user.descCPFCNPJ;
                anun.dataValues.loginPass = user.senha;
                anun.dataValues.loginEmail = user.descEmail;
                anun.dataValues.loginContato = user.descTelefone;

                const atividades = await anun.getAtividade();
                anun.dataValues.mainAtividade = atividades.atividade

                //console.log(anuncio.rows[i])
            }));

            res.json({
                success: true,
                message: {
                    anuncios: anuncio.rows, // Itens da página atual
                    paginaAtual: paginaAtual,
                    totalPaginas: totalPaginas,
                    totalItem: totalItens
                }
            });
        } catch (err) {
            console.error("Erro ao processar os anúncios:", err);
            res.status(500).json({ success: false, message: "Erro interno ao processar os dados." });
        }


        /*         anuncio.rows.forEach(async (anun, i) => {
                    try {
                        const cader = await anun.getCaderno();
                        anun.codCaderno = cader ? cader.nomeCaderno : "não registrado";
        
                        const estado = await anun.getUf();
                        anun.codUf = estado.sigla_uf;
        
                        const desconto = await anun.getDesconto();
                        anun.codPA = desconto != undefined ? desconto.hash : "99.999.9999";
                        //console.log("-----------------------------------> ", anun.codPA);
        
                        const user = await anun.getUsuario();
                        anun.codUsuario = user.descNome;
        
                        anuncio.rows[i].kledisom = 123;
        
                        //console.log(cader.nomeCaderno);
        
        
        
                        if (i === anuncio.rows.length - 1) {
                            res.json({
                                success: true,
                                message: {
                                    anuncios: anuncio.rows, // Itens da página atual
                                    paginaAtual: paginaAtual,
                                    totalPaginas: totalPaginas,
                                    totalItem: totalItens
                                }
                            })
                        }
        
        
                    } catch (err) {
                        console.log(err);
                        res.status(500)
                    }
        
        
        
                }); */
    },
    listarClassificado: async (req, res) => {

        const paginaAtual = req.query.page ? parseInt(req.query.page) : 1; // Página atual, padrão: 1
        const porPagina = 10; // Número de itens por página

        console.log(req.params)

        // Consulta para recuperar apenas os itens da página atual
        const codCaderno = await Caderno.findAll({
            where: {
                codUf: req.params.uf,
                [Op.or]: [
                    { nomeCaderno: req.params.caderno },
                    { codCaderno: req.params.caderno }
                ]

            }
        });

        //console.log(codCaderno)


        const anuncio = await Anuncio.findAndCountAll({
            where: {
                [Op.and]: [
                    { codUf: codCaderno[0].dataValues.codUf },
                    { codCaderno: codCaderno[0].dataValues.codCaderno }
                ]
            }
        });

        if (anuncio.count < 1) {
            res.json({
                success: false,
                message: "caderno não localizado"
            });

            return;
        };

        const count = anuncio.rows.reduce((acc, item) => {
            // Incrementa o contador do codAtividade no acumulador
            acc[item.codAtividade] = (acc[item.codAtividade] || 0) + 1;
            return acc;
        }, {});

        const atividades = await Atividade.findAll({
            order: [
                ['atividade', 'ASC']
            ]
        });

        const arrayClassificado = [];

        for (let x in count) {
            const anun = anuncio.rows.find(item => item.codAtividade == x);
            const atividade = atividades.find(item => item.id == x);

            arrayClassificado.push({
                id: atividade.dataValues.id,
                nomeAtividade: atividade.dataValues.atividade,
                qtdAtividade: count[x],
                codigoAnuncio: anun.codAnuncio,
                nomeAnuncio: anun.descAnuncio,
                estado: anun.codUf,
                caderno: anun.codCaderno
            });

            //console.log(anun.dataValues)
            //console.log(x, /* atividades[0].dataValues */)
        }

        arrayClassificado.sort((a, b) => a.nomeAtividade.localeCompare(b.nomeAtividade));

        //console.log(count);

        const anuncioTeste = await Anuncio.findAndCountAll({
            where: {
                [Op.and]: [
                    { codUf: codCaderno[0].dataValues.codUf },
                    { codCaderno: codCaderno[0].dataValues.codCaderno }
                ],
                [Op.or]: [
                    { codAtividade: 1 },
                    { codAtividade: 2 },
                    { codAtividade: 3 },
                    { codAtividade: 4 },
                    { codAtividade: 5 },
                    { codAtividade: 6 },
                    { codAtividade: 7 },
                    { codAtividade: 8 },
                ]
            }
        });

        const anuncio2 = await Anuncio.findAndCountAll({
            where: {
                [Op.and]: [
                    { codUf: codCaderno[0].dataValues.codUf },
                    { codCaderno: codCaderno[0].dataValues.codCaderno }
                ]
            }/* ,
            order: [
                ['nomeAtividade', 'ASC'],
            ] */
        });

        res.json({
            success: true,
            data: arrayClassificado,
            teste: anuncioTeste,
            anuncio2: anuncio2,
            mosaico: codCaderno[0].dataValues.descImagem,
            kledisom: 123
        });


    },
    listarClassificadoGeralould: async (req, res) => {

        const paginaAtual = req.query.page ? parseInt(req.query.page) : 1; // Página atual, padrão: 1
        const porPagina = 10; // Número de itens por página

        const offset = (paginaAtual - 1) * porPagina;

        console.log("offsewt: ", offset)

        try {
            // Passo 1: Buscar anúncios da tabela "anuncio" (res.teste.rows)
            let anuncios = await Anuncio.findAll({
                where: {
                    codCaderno: 26,  // ou outros filtros relevantes
                    codUf: 27
                }
            });

            // Obter os codAtividade de todos os anúncios
            let codigosAtividades = anuncios.map(anuncio => anuncio.codAtividade);

            // Remover duplicatas usando Set
            let valoresUnicos = [...new Set(codigosAtividades)];

            // Passo 2: Buscar atividades com esses codAtividades
            let atividadesEncontradas = await Atividade.findAll({
                where: {
                    id: {
                        [Op.in]: valoresUnicos  // Encontrar atividades cujos IDs estão no array de atividades
                    }
                }
            });

            // Passo 3: Filtrar os anúncios que possuem um codAtividade correspondente
            let anunciosFiltrados = anuncios.filter(anuncio =>
                atividadesEncontradas.some(atividade => atividade.id === anuncio.codAtividade)
            );

            // Passo 4: Paginação usando Sequelize
            let pageNumber = 1; // Número da página que você quer
            let pageSize = 100;  // Tamanho da página (100 registros por página)

            // Sequelize também pode fazer a paginação diretamente na consulta com offset e limit
            let paginatedAnuncios = await Anuncio.findAll({
                where: {
                    codAtividade: {
                        [Op.in]: valoresUnicos
                    }
                },
                offset: (pageNumber - 1) * pageSize,  // Índice de onde começa a página
                limit: pageSize                      // Quantos registros por página
            });

            // Definir o estado com os resultados
            /* setMinisitio({ anuncios: paginatedAnuncios });
            setNomeAtividade(atividadesEncontradas); */

            res.json({
                success: true,
                teste: paginatedAnuncios
                /*    data: arrayClassificado,
                   teste: anuncioTeste,
                   mosaico: codCaderno[0].dataValues.descImagem */
            });

            console.log("Paginated anuncios:", paginatedAnuncios);

        } catch (error) {
            console.error("Error fetching data:", error);
        }



    },
    listarClassificadoGeral: async (req, res) => {

        const paginaAtual = req.query.page ? parseInt(req.query.page) : 1; // Página atual, padrão: 1
        const porPagina = 10; // Número de itens por página

        const offset = (paginaAtual - 1) * porPagina;

        //console.log("offsewt: ", offset)

        // Consulta para recuperar apenas os itens da página atual
        const codCaderno = await Caderno.findAll({
            where: {
                //codUf: req.params.uf,
                [Op.or]: [
                    { nomeCaderno: req.params.caderno },
                    { codCaderno: req.params.caderno },
                    {codUf: req.params.uf}
                ]
            }
        });

        console.log(codCaderno)


        const anuncio = await Anuncio.findAndCountAll({
            where: {
                [Op.and]: [
                    { codUf: codCaderno[0].dataValues.codUf },
                    { codCaderno: codCaderno[0].dataValues.codCaderno }
                ]
            }/* ,
            limit: porPagina,
            offset: offset */
        });

        if (anuncio.count < 1) {
            res.json({
                success: false,
                message: "caderno não localizado"
            });

            return;
        };

        const count = anuncio.rows.reduce((acc, item) => {
            // Incrementa o contador do codAtividade no acumulador
            acc[item.codAtividade] = (acc[item.codAtividade] || 0) + 1;
            return acc;
        }, {});

        const atividades = await Atividade.findAll(/* {order: [
            ['atividade', 'ASC']
        ],
            limit: porPagina,
            offset: offset
        } */);

        //console.log("--------------====> ", atividades[0].dataValues)

        const arrayClassificado = [];

        for (let x in count) {
            const anun = anuncio.rows.find(item => item.codAtividade == x);
            const atividade = atividades.find(item => item.id == x);

            arrayClassificado.push({
                id: atividade.dataValues.id,
                atividade: atividade.dataValues.atividade,
                qtdAtividade: count[x],
                codigoAnuncio: anun.codAnuncio,
                nomeAnuncio: anun.descAnuncio,
                estado: anun.codUf,
                caderno: anun.codCaderno
            });

            //console.log(anun.dataValues)
            //console.log()
        }

        console.log("debug------------------>", [
            { codUf: codCaderno[0].dataValues.codUf },
            { codCaderno: codCaderno[0].dataValues.codCaderno }
        ]);

        const anuncioTeste = await Anuncio.findAndCountAll({
            /*             order: [
                            [Sequelize.literal('CASE WHEN activate = 0 THEN 0 ELSE 1 END'), 'ASC'],
                            ['createdAt', 'DESC'],
                            ['codDuplicado', 'ASC'],
                        ], */
            where: {
                [Op.and]: [
                    { codUf: codCaderno[0].dataValues.codUf },
                    { codCaderno: codCaderno[0].dataValues.codCaderno }
                ]
            }/* ,
            limit: porPagina,
            offset: offset */
        });

        res.json({
            success: true,
            data: arrayClassificado,
            teste: anuncioTeste,
            mosaico: codCaderno[0].dataValues.descImagem
        });

    },
    listarClassificadoGeralold: async (req, res) => {

        const paginaAtual = req.query.page ? parseInt(req.query.page) : 1; // Página atual, padrão: 1
        const porPagina = 10; // Número de itens por página

        const offset = (paginaAtual - 1) * porPagina;

        console.log("offsewt: ", offset)

        // Consulta para recuperar apenas os itens da página atual
        const codCaderno = await Caderno.findAll({
            where: {
                [Op.and]: [
                    { codUf: req.params.uf },
                    { nomeCaderno: req.params.caderno }
                ]
            }
        });

        //console.log(codCaderno)


        const anuncio = await Anuncio.findAndCountAll({
            where: {
                [Op.and]: [
                    { codUf: codCaderno[0].dataValues.codUf },
                    { codCaderno: codCaderno[0].dataValues.codCaderno }
                ]
            }/* ,
            limit: porPagina,
            offset: offset */
        });

        if (anuncio.count < 1) {
            res.json({
                success: false,
                message: "caderno não localizado"
            });

            return;
        };

        const count = anuncio.rows.reduce((acc, item) => {
            // Incrementa o contador do codAtividade no acumulador
            acc[item.codAtividade] = (acc[item.codAtividade] || 0) + 1;
            return acc;
        }, {});

        const atividades = await Atividade.findAll(/* {order: [
            ['atividade', 'ASC']
        ],
            limit: porPagina,
            offset: offset
        } */);

        //console.log("--------------====> ", atividades[0].dataValues)

        const arrayClassificado = [];

        for (let x in count) {
            const anun = anuncio.rows.find(item => item.codAtividade == x);
            const atividade = atividades.find(item => item.id == x);

            arrayClassificado.push({
                id: atividade.dataValues.id,
                atividade: atividade.dataValues.atividade,
                qtdAtividade: count[x],
                codigoAnuncio: anun.codAnuncio,
                nomeAnuncio: anun.descAnuncio,
                estado: anun.codUf,
                caderno: anun.codCaderno
            });

            //console.log(anun.dataValues)
            //console.log()
        }

        //console.log(count);

        const anuncioTeste = await Anuncio.findAndCountAll({
            /*             order: [
                            [Sequelize.literal('CASE WHEN activate = 0 THEN 0 ELSE 1 END'), 'ASC'],
                            ['createdAt', 'DESC'],
                            ['codDuplicado', 'ASC'],
                        ], */
            where: {
                [Op.and]: [
                    { codUf: codCaderno[0].dataValues.codUf },
                    { codCaderno: codCaderno[0].dataValues.codCaderno }
                ]
            }/* ,
            limit: porPagina,
            offset: offset */
        });

        res.json({
            success: true,
            data: arrayClassificado,
            teste: anuncioTeste,
            mosaico: codCaderno[0].dataValues.descImagem
        });

    },
    listarClassificadoEspecifico: async (req, res) => {

        const paginaAtual = req.query.page ? parseInt(req.query.page) : 1; // Página atual, padrão: 1
        const porPagina = 10; // Número de itens por página

        const offset = (paginaAtual - 1) * porPagina;

        console.log("offsewt: ", offset)

        // Consulta para recuperar apenas os itens da página atual
        const codCaderno = await Caderno.findAll({
            where: {
                [Op.and]: [
                    { codUf: req.params.uf },
                    { nomeCaderno: req.params.caderno }
                ]
            }
        });

        //console.log(codCaderno)


        const anuncio = await Anuncio.findAndCountAll({
            where: {
                [Op.and]: [
                    { codUf: codCaderno[0].dataValues.codUf },
                    { codCaderno: codCaderno[0].dataValues.codCaderno }
                ]
            },
            limit: porPagina,
            offset: offset
        });

        if (anuncio.count < 1) {
            res.json({
                success: false,
                message: "caderno não localizado"
            });

            return;
        };

        const count = anuncio.rows.reduce((acc, item) => {
            // Incrementa o contador do codAtividade no acumulador
            acc[item.codAtividade] = (acc[item.codAtividade] || 0) + 1;
            return acc;
        }, {});

        const atividades = await Atividade.findAll();

        const arrayClassificado = [];

        for (let x in count) {
            const anun = anuncio.rows.find(item => item.codAtividade == x);
            const atividade = atividades.find(item => item.id == x);

            arrayClassificado.push({
                id: atividade.dataValues.id,
                nomeAtividade: atividade.dataValues.atividade,
                qtdAtividade: count[x],
                codigoAnuncio: anun.codAnuncio,
                nomeAnuncio: anun.descAnuncio,
                estado: anun.codUf,
                caderno: anun.codCaderno
            });

            //console.log(anun.dataValues)
            console.log(x, /* atividades[0].dataValues */)
        }

        //console.log(count);

        const anuncioTeste = await Anuncio.findAndCountAll({
            order: [
                [Sequelize.literal('CASE WHEN activate = 0 THEN 0 ELSE 1 END'), 'ASC'],
                ['createdAt', 'DESC'],
                ['codDuplicado', 'ASC'],
            ],
            where: {
                codAnuncio: 1134
            },
            limit: porPagina,
            offset: offset
        });

        res.json({
            success: true,
            data: arrayClassificado,
            teste: anuncioTeste,
            mosaico: codCaderno[0].dataValues.descImagem
        });

    },
    buscarAnuncioId: async (req, res) => {
        await database.sync();
        //const nu_hash = req.params.id;
        const nu_hash = req.query.search;

        //verificação
        const contemNumero = () => /\d/.test(nu_hash);

        console.log('dasifsdfsdgsfg', contemNumero())

        //ANUNCIO
        const resultAnuncio = await Anuncio.findAll({
            where: {
                [Op.or]: [
                    { codAnuncio: nu_hash },
                    { descCPFCNPJ: nu_hash },
                ]
            }
        });

        if (resultAnuncio.length > 0) {
            await Promise.all(resultAnuncio.map(async (anun, i) => {
                const cader = await anun.getCaderno();
                anun.codCaderno = cader ? cader.nomeCaderno : "não registrado";

                const estado = await anun.getUf();
                anun.codUf = estado.sigla_uf;

                const desconto = await anun.getDesconto();
                anun.codPA = desconto != undefined ? desconto.hash : "99.999.9999";

                const user = await anun.getUsuario();
                anun.codUsuario = user.descNome;
                anun.dataValues.loginUser = user.descCPFCNPJ;
                anun.dataValues.loginPass = user.senha;
                anun.dataValues.loginEmail = user.descEmail;
                anun.dataValues.loginContato = user.descTelefone;

                const atividades = await anun.getAtividade();
                anun.dataValues.mainAtividade = atividades.atividade

                //console.log(anuncio.rows[i])
            }));

            const totalItens = resultAnuncio.length;
            console.log(totalItens)

            res.json({
                success: true,
                message: {
                    anuncios: resultAnuncio, // Itens da página atual
                    paginaAtual: 1,
                    totalPaginas: 1,
                    totalItem: totalItens
                }
            });
            return;
        };

        //buscar por uf
        const resultEstado = await Uf.findAll({
            where: {
                sigla_uf: nu_hash
            }
        });

        if (resultEstado.length > 0) {
            const resultAnuncioEstado = await Anuncio.findAll({
                where: {
                    codUf: resultEstado[0].dataValues.id_uf
                }
            });


            if (resultAnuncioEstado.length > 0) {
                await Promise.all(resultAnuncioEstado.map(async (anun, i) => {
                    const cader = await anun.getCaderno();
                    anun.codCaderno = cader ? cader.nomeCaderno : "não registrado";

                    const estado = await anun.getUf();
                    anun.codUf = estado.sigla_uf;

                    const desconto = await anun.getDesconto();
                    anun.codPA = desconto != undefined ? desconto.hash : "99.999.9999";

                    const user = await anun.getUsuario();
                    anun.codUsuario = user.descNome;
                    anun.dataValues.loginUser = user.descCPFCNPJ;
                    anun.dataValues.loginPass = user.senha;
                    anun.dataValues.loginEmail = user.descEmail;
                    anun.dataValues.loginContato = user.descTelefone;

                    const atividades = await anun.getAtividade();
                    anun.dataValues.mainAtividade = atividades.atividade

                    //console.log(anuncio.rows[i])
                }));

                const totalItens = resultAnuncioEstado.length;
                console.log(totalItens)

                res.json({
                    success: true,
                    message: {
                        anuncios: resultAnuncioEstado, // Itens da página atual
                        paginaAtual: 1,
                        totalPaginas: 1,
                        totalItem: totalItens
                    }
                });
                return;
            }
        }


        //buscar por numero de ID
        if (resultAnuncio < 1) {
            const resultID = await Desconto.findAll({
                where: {
                    hash: nu_hash
                }
            });
            console.log('dqasdadasdas', resultID)

            if (resultID < 1) {
                res.json({ success: false, message: "anúncio não encontrado" });
                return;
            } else {
                const descId = resultID[0].idDesconto;
                const resultAnuncio = await Anuncio.findAll({
                    where: {
                        codDesconto: descId
                    }
                });


                resultAnuncio.map(async (anun, i) => {
                    try {
                        await Promise.all(resultAnuncio.map(async (anun, i) => {
                            const cader = await anun.getCaderno();
                            anun.codCaderno = cader ? cader.nomeCaderno : "não registrado";

                            const estado = await anun.getUf();
                            anun.codUf = estado.sigla_uf;

                            const desconto = await anun.getDesconto();
                            anun.codPA = desconto != undefined ? desconto.hash : "99.999.9999";

                            const user = await anun.getUsuario();
                            anun.codUsuario = user.descNome;
                            anun.dataValues.loginUser = user.descCPFCNPJ;
                            anun.dataValues.loginPass = user.senha;
                            anun.dataValues.loginEmail = user.descEmail;
                            anun.dataValues.loginContato = user.descTelefone;

                            const atividades = await anun.getAtividade();
                            anun.dataValues.mainAtividade = atividades.atividade

                            //console.log(anuncio.rows[i])
                        }));


                        if (i === resultAnuncio.length - 1) {
                            res.json({
                                success: true,
                                message: {
                                    anuncios: resultAnuncio, // Itens da página atual
                                    paginaAtual: 1,
                                    totalPaginas: 1,
                                    totalItem: resultAnuncio.length
                                }
                            })
                        }


                    } catch (err) {
                        console.log(err);
                        res.status(500)
                    }

                });

            }
        } else {

            /*       res.json({
                      success: true,
                      message: {
                          anuncios: resultAnuncio
                      }
                  }); */
        }


    },
    listarAnuncioId: async (req, res) => {

        const uuid = req.params.id;

        //IDS
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
        //obj.codAtividade = atividade != null ? atividade.id : '';

        obj.setDataValue('nomeAtividade', atividade.atividade);
        //obj.kledisom = atividade != null ? atividade.id : null; 



        res.json(resultAnuncio);
    },
    criarAnuncio: async (req, res) => {
        await database.sync();
        const { codAnuncio,
            codUsuario,
            codTipoAnuncio,
            codAtividade,
            codPA,
            codDuplicado,
            tags,
            codCaderno,
            codUf,
            codCidade,
            descAnuncio,
            descAnuncioFriendly,
            descImagem,
            descEndereco,
            descTelefone,
            descCelular,
            descDescricao,
            descSite,
            descSkype,
            descPromocao,
            descEmailComercial,
            descEmailRetorno,
            descFacebook,
            descTweeter,
            descWhatsApp,
            descCEP,
            descTipoPessoa,
            descCPFCNPJ,
            descNomeAutorizante,
            descEmailAutorizante,
            codDesconto,
            descLat,
            descLng,
            formaPagamento,
            promocaoData,
            descContrato,
            descAndroid,
            descApple,
            descInsta,
            descPatrocinador,
            descPatrocinadorLink,
            qntVisualizacoes,
            activate,
            dtCadastro,
            dtCadastro2,
            dtAlteracao,
            descLinkedin,
            descTelegram,
            certificado_logo,
            certificado_texto,
            certificado_imagem,
            link_comprar,
            cashback_logo,
            cashback_link,
            certificado_link,
            cartao_digital } = req.body;

        console.log(req.body)

        const codigoUsuario = await Usuarios.findAll({
            where: {
                [Op.or]: [
                    { descNome: codUsuario },
                    { descEmail: codUsuario },
                    { descCPFCNPJ: codUsuario },
                    { codUsuario: codUsuario }
                ]

            }
        });

        //console.log(codigoUsuario[0].codUsuario)

        if (codigoUsuario < 1) {
            res.json({ success: false, message: "Usuario não encontrado, por favor digite a identificação correta, caso contrário não será possível atribuir esse anúncio a nenhum usúario" });
            return;
        }

        //console.log("tajsdnfkjfbdsjkbfsd;;;;;;", descAnuncio)
        let codigoDeDesconto = await Descontos.findAll({
            where: {
                hash: codDesconto
            }
        });



        const dadosAnuncio = {
            //"codAnuncio": 88888,
            "codUsuario": codigoUsuario[0].codUsuario,
            "codTipoAnuncio": codTipoAnuncio,
            "codAtividade": codAtividade,
            "codPA": 0,
            "codDuplicado": 0,
            "tags": tags,
            "codCaderno": codCaderno,
            "codUf": codUf,
            "codCidade": codCidade,
            "descAnuncio": descAnuncio,
            "descAnuncioFriendly": "oficina-de-tortas",
            "descImagem": descImagem,
            "descEndereco": descEndereco,
            "descTelefone": descTelefone,
            "descCelular": descCelular,
            "descDescricao": "teste",
            "descSite": "www.oficinadetortas.com.br",
            "descSkype": 0,
            "descPromocao": codigoDeDesconto.length > 0 ? codigoDeDesconto[0].desconto : '0',
            "descEmailComercial": descEmailComercial,
            "descEmailRetorno": descEmailRetorno,
            "descFacebook": "teste",
            "descTweeter": "teste",
            "descWhatsApp": descWhatsApp,
            "descCEP": descCEP,
            "descTipoPessoa": descTipoPessoa,
            "descCPFCNPJ": descCPFCNPJ,
            "descNomeAutorizante": descNomeAutorizante,
            "descEmailAutorizante": descEmailAutorizante,
            "codDesconto": codigoDeDesconto.length > 0 ? codigoDeDesconto[0].idDesconto : '00.000.0000',
            "descLat": 0,
            "descLng": 0,
            "formaPagamento": 0,
            "promocaoData": 0,
            "descContrato": 0,
            "descAndroid": "teste",
            "descApple": "teste",
            "descInsta": 0,
            "descPatrocinador": 0,
            "descPatrocinadorLink": 0,
            "qntVisualizacoes": 0,
            "activate": 0,
            "dtCadastro": dataNow(),
            "dtCadastro2": "2012-12-27T16:22:44.000Z",
            "dtAlteracao": "2020-11-30T23:59:59.000Z",
            "descLinkedin": 0,
            "descTelegram": 0,
            "certificado_logo": 0,
            "certificado_texto": 0,
            "certificado_imagem": 0,
            "link_comprar": 0,
            "cashback_logo": 0,
            "cashback_link": 0,
            "certificado_link": 0,
            "cartao_digital": 0
        };

        try {
            const listaAnuncios = await Anuncio.create(dadosAnuncio);


            res.json({ success: true, message: listaAnuncios })
        } catch (err) {
            res.json({ success: false, message: err })
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
            var dataFormatada = dia + '/' + mes + '/' + ano;
            var horaFormatada = hora + ':' + minutos + ':' + segundos;

            // Exibir a data e hora atual
            console.log('Data atual:', dataFormatada);
            console.log('Hora atual:', horaFormatada);

            return dataFormatada + " " + horaFormatada;
        };

    },
    atualizarAnuncio: async (req, res) => {

        const { codAnuncio,
            codUsuario,
            codTipoAnuncio,
            codAtividade,
            codPA,
            codDuplicado,
            tags,
            codCaderno,
            codUf,
            codCidade,
            descAnuncio,
            descAnuncioFriendly,
            descImagem,
            descEndereco,
            descTelefone,
            descCelular,
            descDescricao,
            descSite,
            descSkype,
            descPromocao,
            descEmailComercial,
            descEmailRetorno,
            descFacebook,
            descTweeter,
            descWhatsApp,
            descCEP,
            descTipoPessoa,
            descCPFCNPJ,
            descNomeAutorizante,
            descEmailAutorizante,
            codDesconto,
            descLat,
            descLng,
            formaPagamento,
            promocaoData,
            descContrato,
            descAndroid,
            descApple,
            descInsta,
            descPatrocinador,
            descPatrocinadorLink,
            qntVisualizacoes,
            activate,
            dtCadastro,
            dtCadastro2,
            dtAlteracao,
            descLinkedin,
            descTelegram,
            certificado_logo,
            certificado_texto,
            certificado_imagem,
            link_comprar,
            cashback_logo,
            cashback_link,
            certificado_link,
            cartao_digital } = req.body;

        console.log(descImagem)

        const dadosAnuncio = {
            //"codAnuncio": 88888,
            //"codUsuario": codigoUsuario[0].codUsuario,
            "codTipoAnuncio": codTipoAnuncio,
            "codAtividade": codAtividade,
            "codPA": 0,
            "codDuplicado": 0,
            "tags": "torteria,bolos,tortas,salgados,festas",
            "codCaderno": codCaderno,
            "codUf": codUf,
            "codCidade": codCidade,
            "descAnuncio": descAnuncio,
            "descAnuncioFriendly": "oficina-de-tortas",
            "descImagem": descImagem,
            "descEndereco": descEndereco,
            "descTelefone": descTelefone,
            "descCelular": descCelular,
            "descDescricao": "teste",
            "descSite": "www.oficinadetortas.com.br",
            "descSkype": 0,
            //"descPromocao": codigoDeDesconto.length > 0 ? codigoDeDesconto[0].desconto : '0',
            "descEmailComercial": descEmailComercial,
            "descEmailRetorno": descEmailRetorno,
            "descFacebook": "teste",
            "descTweeter": "teste",
            "descWhatsApp": descWhatsApp,
            "descCEP": descCEP,
            "descTipoPessoa": descTipoPessoa,
            "descCPFCNPJ": descCPFCNPJ,
            "descNomeAutorizante": descNomeAutorizante,
            "descEmailAutorizante": descEmailAutorizante,
            //"codDesconto": codigoDeDesconto.length > 0 ? codigoDeDesconto[0].idDesconto : '00.000.0000',
            "descLat": 0,
            "descLng": 0,
            "formaPagamento": 0,
            "promocaoData": 0,
            "descContrato": 0,
            "descAndroid": "teste",
            "descApple": "teste",
            "descInsta": 0,
            "descPatrocinador": 0,
            "descPatrocinadorLink": 0,
            "qntVisualizacoes": 0,
            "activate": 1,
            "dtCadastro": dataNow(),
            "dtCadastro2": "2012-12-27T16:22:44.000Z",
            "dtAlteracao": "2020-11-30T23:59:59.000Z",
            "descLinkedin": 0,
            "descTelegram": 0,
            "certificado_logo": 0,
            "certificado_texto": 0,
            "certificado_imagem": 0,
            "link_comprar": 0,
            "cashback_logo": 0,
            "cashback_link": 0,
            "certificado_link": 0,
            "cartao_digital": 0
        };



        try {
            const listaAnuncios = await Anuncio.update(dadosAnuncio, {
                where: {
                    codAnuncio: req.query.id
                }
            });


            res.json({ success: true, message: codAtividade })
        } catch (err) {
            console.log(codAtividade)
            res.json({ success: false, message: err })
        }
    },
    deleteAnuncio: async (req, res) => {
        await database.sync();

        const uuid = req.params.id;

        console.log(req.body)

        try {
            //Atividades
            const deleteAnuncio = await Anuncio.destroy({
                where: {
                    codAnuncio: uuid
                }

            });
            res.json({ success: true, message: deleteAnuncio });
        } catch (err) {
            res.json({ success: false, message: "não foi possivel apagar o anuncio selecionado" });
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
                qntVisualizacoes: parseInt(visualizacoesAtivas[0].qntVisualizacoes) + 1
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
    updateAnuncioStatus: async (req, res) => {
        await database.sync();

        const uuid = req.params.id;

        const ativo = req.body.ativo;

        try {
            const userActivate = await Anuncio.update({
                "activate": ativo == "Ativado" ? 0 : 1
            }, {
                where: {
                    codAnuncio: uuid
                }
            });


            res.json({ success: true, message: userActivate })
        } catch (err) {
            res.json({ success: false, message: err })
        }

    },
    //ESPAÇOS DUPLICADOS
    duplicar: async (req, res) => {

        /**
         * Esta variável armazena o tipo de duplicação obtido da query.
         * 
         * @type {number} 1 - duplicar em todos os cadernos
         * @type {number} 2 - duplicar em todos os estados selecionados
         * @type {number} 3 - duplicar em todos as cidades selecionadas
         */



        let duplicateType = req.query.duplicationType;
        let idAnuncio = req.query.id;


        const anuncio = await Anuncio.findAll({
            where: {
                codAnuncio: idAnuncio
            }
        });

        let anuncioObj = anuncio[0].dataValues;

        switch (Number(duplicateType)) {
            case 1:
                todosCadernos();
                break;
            case 2:
                todosEstados();
                break;
            case 3:
                todosCidades();
                break;
            default:
                console.log("nenhuma opcao selecionada!")
        };


        async function todosCadernos() {
            //buscar todos os cadernos
            const cadernos = await Cadernos.findAll();
            cadernos.map(async (item, index) => {
                let codAnuncio = anuncioObj.codAnuncio;
                let codCaderno = item.dataValues.codCaderno;
                let codUf = item.dataValues.codUf;

                anuncioObj.codOrigem = idAnuncio;
                anuncioObj.codDuplicado = index + 1;
                //anuncioObj.codDuplicado = `${String(idAnuncio)}.${String(index + 1)}`;
                anuncioObj.codCaderno = codCaderno;
                anuncioObj.codCidade = codCaderno;
                anuncioObj.codUf = codUf;

                //console.log(anuncioObj.codDuplicado);
                //console.log(typeof(idAnuncio), typeof(index));

                //Remover a propriedade codAnuncio
                delete anuncioObj.codAnuncio;


                //console.log(anuncioObj.codCaderno, anuncioObj.codUf);
                const listaAnuncios = await Anuncio.create(anuncioObj);

                if (cadernos.length == index + 1) {
                    res.json({ success: true, message: "Duplicação concluída", qtdeDup: cadernos.length });
                };

            })
        };

        async function todosEstados() {
            let ufSelecionado = req.query.uf;

            const cadernos = await Cadernos.findAll({
                where: {
                    codUf: ufSelecionado
                }
            });

            cadernos.map(async (item, index) => {
                let codCaderno = item.dataValues.codCaderno;
                let codUf = item.dataValues.codUf;

                anuncioObj.codOrigem = idAnuncio;
                anuncioObj.codDuplicado = index + 1;//`${String(idAnuncio)}.${String(index + 1)}`;
                anuncioObj.codCaderno = codCaderno;
                anuncioObj.codCidade = codCaderno;
                anuncioObj.codUf = codUf;

                //console.log(anuncioObj.codDuplicado);
                //console.log(typeof(idAnuncio), typeof(index));

                //Remover a propriedade codAnuncio
                delete anuncioObj.codAnuncio;


                //console.log(anuncioObj.codCaderno, anuncioObj.codUf);
                const listaAnuncios = Anuncio.create(anuncioObj);

                if (cadernos.length == index + 1) {
                    res.json({ success: true, message: "Duplicação concluída", qtdeDup: cadernos.length });
                };

            })

        };

        async function todosCidades() {
            let cidadeSelecionada = req.body;
            const cidades = await Cadernos.findAll({
                where: {
                    codCaderno: {
                        [Op.and]: [cidadeSelecionada]
                    }
                }
            });

            cidades.map(async (item, index) => {
                let codCaderno = item.dataValues.codCaderno;
                let codUf = item.dataValues.codUf;

                anuncioObj.codOrigem = idAnuncio;
                anuncioObj.codDuplicado = index + 1;
                //anuncioObj.codDuplicado = `${String(idAnuncio)}.${String(index + 1)}`;
                anuncioObj.codCaderno = codCaderno;
                anuncioObj.codCidade = codCaderno;
                anuncioObj.codUf = codUf;

                //Remover a propriedade codAnuncio
                delete anuncioObj.codAnuncio;


                //console.log(anuncioObj.codCaderno, anuncioObj.codUf);
                const listaAnuncios = await Anuncio.create(anuncioObj);

                if (cidades.length == index + 1) {
                    res.json({ success: true, message: "Duplicação concluída", qtdeDup: cidades.length });
                };
            });

        };






        try {
            //console.log(anuncioObj)

            //res.json({ success: true, message: "Nova visualizção!" });
        } catch (err) {
            res.json({ success: false, message: err });
        }

    },
    export4excell: async (req, res) => {
        const anunciosCount = await Anuncio.count();
        const limit = Number(req.query.limit);

        const definirTipoAnuncio = (tipo) => {
            switch (tipo) {
                case 1:
                    return "Básico";
                case 2:
                    return "Simples";
                case 3:
                    return "Completo";
                default:
                    return "Tipo desconhecido";
            }
        };


        try {
            /*      const anuncios = await Anuncio.findAll({
                     limit: limit
                 }); */
            let dados = await Promise.all(req.body.map(async item => {
                const {
                    codAtividade,
                    codPA,
                    tags,
                    codCidade,
                    descAnuncioFriendly,
                    descImagem,
                    descEndereco,
                    descCelular,
                    descDescricao,
                    descSite,
                    descSkype,
                    descPromocao,
                    descEmailComercial,
                    descEmailRetorno,
                    descFacebook,
                    descTweeter,
                    descCEP,
                    descTipoPessoa,
                    descNomeAutorizante,
                    descLat,
                    descLng,
                    formaPagamento,
                    promocaoData,
                    descContrato,
                    descAndroid,
                    descApple,
                    descInsta,
                    descPatrocinador,
                    descPatrocinadorLink,
                    qntVisualizacoes,
                    dtAlteracao,
                    descLinkedin,
                    descTelegram,
                    certificado_logo,
                    certificado_texto,
                    certificado_imagem,
                    cashback_logo,
                    cashback_link,
                    certificado_link,
                    cartao_digital,
                    descChavePix, ...newObject } = item;


                /* 
                                const dateTimeString = newObject.dtCadastro2;
                                const dateObject = new Date(dateTimeString);
                
                                const dateTimeString2 = newObject.dtCadastro2;
                                const dateObject2 = new Date(dateTimeString2);
                
                                // Formata a data no formato YYYY-MM-DD
                                const dateOnly = dateObject.toISOString().split('T')[0];
                                const dateOnly2 = dateObject2.toISOString().split('T')[0];
                
                                newObject.dtCadastro = dateOnly;
                                newObject.dtCadastro2 = dateOnly2;
                
                                //atualizar nome do usuario
                                const user = await item.getUsuario();
                                newObject.codUsuario = user.descNome;
                
                                //atualizar nome do estado
                                const estado = await item.getUf();
                                newObject.codUf = estado.sigla_uf;
                
                                //atualizar tipo de anuncio
                                newObject.codTipoAnuncio = definirTipoAnuncio(item.codTipoAnuncio);
                
                                //atualizar nome do caderno
                                const cader = await item.getCaderno();
                                newObject.codCaderno = cader ? cader.nomeCaderno : "não registrado";
                
                                //atualizar codigo de id
                                const desconto = await item.getDesconto();
                                newObject.codDesconto = desconto != undefined ? desconto.hash : "99.999.9999";
                
                                //atualizar status
                                newObject.activate = item.activate == 1 ? "Ativado" : "Desativado" */

                return newObject;
            }));

            exportExcell(dados, res)
        } catch (err) {
            console.log(err)
            res.json({ success: false, message: `o numero máximo de registros é ${anunciosCount}` })
        }




    },
    import4excellolrotateste: async (req, res) => {
        const atividades = await Atividade.findAll({
            where: {
                atividade: { [Op.like]: `%${tipoAtividade}%` }
            },

        });

        res.json(atividades)
    },
    import4excell: async (req, res) => {
        // req.file é o arquivo 'uploadedfile'
        // req.body conterá os campos de texto, se houver
        //Realizando leitura dos dados
        readXlsxFile(path.join(__dirname, '../public/import/uploadedfile.xlsx')).then(async linhas => {
            //console.log(linhas);

            const data = linhas;

            const resultPlan = data.slice(1).map(row => {
                return row.reduce((obj, value, index) => {
                    obj[data[0][index]] = value; // Usa o cabeçalho como chave
                    return obj;
                }, {});
            });

            const arrayImportado = [];

            async function novaImportacao(result) {
                //buscar por uf
                const resultEstado = await Uf.findAll({
                    where: {
                        sigla_uf: result['UF']
                    }
                });

                //buscar por cidade
                const resultCidade = await Cadernos.findAll({
                    where: {
                        nomeCaderno: { [Op.like]: `%${result['CIDADE']}%` }
                    }
                });


                const estadoId = resultEstado.length > 0 ? resultEstado[0].dataValues.id_uf : 0;
                const cidadeId = resultCidade.length > 0 ? resultCidade[0].dataValues.codCaderno : 0;


                const codTipoAnuncio = result['TIPO'];
                const idDesconto = result['ID (MASTER)'];
                const nomeAnuncio = result['NOME'];
                const telefone = result['TEL'];
                const estado = estadoId;
                const cidade = cidadeId;
                const tipoAtividade = result['ATIVIDADE PRINCIPAL  (CNAE)'];
                const nuDocumento = result['CNPJ/CPF'];
                const autorizante = result['AUTORIZANTE'];
                const email = result['E-MAIL'];
                const chavePix = result['PIX ( chave)'];
                const login = result['CNPJ/CPF'];
                const senha = 12345;




                const verificarUserExists = await Usuarios.findAll({
                    where: {
                        descCPFCNPJ: nuDocumento
                    }
                });

                if (verificarUserExists.length > 0) {
                    let codUser = verificarUserExists[0].dataValues.codUsuario;


                    criarAnuncioImportado(codUser);
                } else {

                    await database.sync();

                    const dadosUsuario = {
                        "codTipoPessoa": "pf",
                        "descCPFCNPJ": nuDocumento,
                        "descNome": nomeAnuncio,
                        "descEmail": email || "atualizar",
                        "senha": senha,
                        "codTipoUsuario": 3,
                        "descTelefone": telefone || "atualizar",
                        "codUf": estado,
                        "codCidade": cidade,
                        "dtCadastro": dataNow(),
                        "usuarioCod": 0,
                        "dtCadastro2": dataNow(),
                        "dtAlteracao": dataNow(),
                        "ativo": "1"
                    };


                    try {
                        const listaUsers = await Usuarios.create(dadosUsuario);

                        let codUser = listaUsers.dataValues.codUsuario;


                        criarAnuncioImportado(codUser);

                        //res.status(201).json({ success: true, message: listaUsers })


                    } catch (erro) {
                        console.error(erro.message);
                        //res.status(500).json({ success: false, message: erro.errors[0].message })
                    }
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


                async function buscarAtividade() {
                    const atividades = await Atividade.findAll({
                        where: {
                            atividade: { [Op.like]: `%${tipoAtividade}%` }
                        },

                    });

                    if (atividades.length > 0) {
                        return atividades[0].dataValues.id;
                    } else {
                        return 3845;
                    }


                };


                async function criarAnuncioImportado(codUser) {

                    let codigoDeDesconto = await Descontos.findAll({
                        where: {
                            hash: idDesconto
                        }
                    });

                    const dataObj = {
                        "codUsuario": codUser,
                        "codTipoAnuncio": codTipoAnuncio,
                        "codAtividade": await buscarAtividade(),
                        "codCaderno": cidadeId,
                        "codUf": estadoId,
                        "codCidade": cidadeId,
                        "descAnuncio": nomeAnuncio,
                        "descImagem": 0,
                        "descEndereco": "atualizar",
                        "descTelefone": telefone || "atualizar",
                        "descCelular": 0,
                        "descEmailComercial": 0,
                        "descEmailRetorno": email,
                        "descWhatsApp": 0,
                        "descCEP": 0,
                        "descTipoPessoa": "pf",
                        "descCPFCNPJ": nuDocumento,
                        "descNomeAutorizante": autorizante,
                        "descEmailAutorizante": 0,
                        "codDesconto": codigoDeDesconto.length > 0 ? codigoDeDesconto[0].idDesconto : '00.000.0000',
                        "descChavePix": chavePix,
                        "qntVisualizacoes": 0,
                        "codDuplicado": 0,
                        "descPromocao": 0,
                        "activate": 1,

                    };


                    arrayImportado.push(dataObj);
                    const criarAnuncios = await Anuncio.create(dataObj);

                    //console.log(criarAnuncios);

                };
            }




            /* 
                        resultPlan.forEach(async (item, index) => {
                            novaImportacao(item);
            
                            if (resultPlan.length == index + 1) {
                                console.log(arrayImportado)
                                //res.status(201).json({ success: true, message: "importacao concluida" })
                            }
                        }); */

            /*       try{
                      console.log(arrayImportado)
                      //const lotes = await Anuncio.bulkCreate(resultPlan); 
                  } catch(err) {
                      console.log(err.message)
                  } */


            const BATCH_SIZE = 100; // Tamanho do lote para processar de cada vez

            async function processBatch(batch) {
                return Promise.all(batch.map(async (result) => {
                    try {
                        await novaImportacao(result);
                    } catch (error) {
                        console.error("Erro ao importar:", error);
                    }
                }));
            }

            async function processImport(data) {
                const resultPlan = data.slice(1).map(row => {
                    return row.reduce((obj, value, index) => {
                        obj[data[0][index]] = value; // Usa o cabeçalho como chave
                        return obj;
                    }, {});
                });

                for (let i = 0; i < resultPlan.length; i += BATCH_SIZE) {
                    const batch = resultPlan.slice(i, i + BATCH_SIZE);
                    await processBatch(batch); // Processa cada lote
                }

                console.log(arrayImportado);
                // res.status(201).json({ success: true, message: "importacao concluida" });
            }

            await processImport(data);


        });



        if (!req.file) {
            return res.status(400).send('Nenhum arquivo foi enviado.');
        }



        // Acessar o arquivo: req.file.path para o caminho completo
        console.log('Arquivo enviado:', req.file);

        // Readable Stream.

        //res.json({success: true, message: 'Arquivo recebido com sucesso!'});
        res.redirect("https://minitest.minisitio.online/admin/espacos");
    },
    listarPin: async (req, res) => {

        const paginaAtual = req.query.page ? parseInt(req.query.page) : 1; // Página atual, padrão: 1
        const porPagina = 10; // Número de itens por página
        const codigoCaderno = req.params.codCaderno;

        const offset = (paginaAtual - 1) * porPagina;

        // Consulta para recuperar apenas os itens da página atual
        const pins = await Pin.findAndCountAll({
            order: [['createdAt', 'DESC']],
            limit: porPagina,
            offset: offset
        });

        // Número total de itens
        const totalItens = pins.count;
        // Número total de páginas
        const totalPaginas = Math.ceil(totalItens / porPagina);

        res.json({
            success: true, message: {
                pins: pins.rows, // Itens da página atual
                paginaAtual: paginaAtual,
                totalPaginas: totalPaginas
            }
        })

        //res.json({success: true, data: pin});

    },
    criarPin: async (req, res) => {
        await database.sync();

        try {
            const pin = await Pin.create(req.body);

            res.json({ success: true, data: pin });
        } catch (err) {
            res.json({ success: false, err: "o codigo escolhido já está em uso" });
        }


    },
    atualizarPin: async (req, res) => {
        let id = req.query.id;

        const pin = await Pin.update(req.body, {
            where: {
                id: id
            }
        });

        res.json({ success: true, data: pin });

    },
    deletarPin: async (req, res) => {
        let id = req.params.id;

        const pin = await Pin.destroy({
            where: {
                id: id
            }
        });

        res.json({ success: true, data: pin });

    },
    listarPinId: async (req, res) => {

        const uuid = req.params.id;
        console.log(uuid)
        //Anuncios
        const pin = await Pin.findAll({
            where: {
                id: uuid
            }
        });

        // Verifica se o resultado está vazio
        if (pin.length === 0) {
            return res.status(404).json({ message: 'Anúncio não encontrado' });
        }


        res.json({ success: true, data: pin });
    },

    //rota de exportar unica
    exportPadrao: async (req, res) => {
        const modulo = req.params.modulo;

        try {

            switch (modulo) {
                case "cadernos":
                    if (Object.keys(req.body).length == 0) {
                        const allCadernos = await Caderno.findAll();
                        const allCadernosObj = allCadernos.map(registro => registro.get({ plain: true }));
                        console.log(allCadernosObj)
                        exportExcellCaderno(allCadernosObj, res);

                    } else {
                        exportExcellCaderno(req.body, res);
                    }
                    break;
                case "atividades":
                    const allAtividades = await Atividade.findAll({
                        order: [
                            [Sequelize.literal('corTitulo ASC')],
                            [Sequelize.fn('LEFT', Sequelize.col('atividade'), 1), 'ASC'],
                            ['createdAt', 'DESC'],
                        ],
                    });
                    const allAtividadesObj = allAtividades.map(registro => registro.get({ plain: true }));

                    // Removendo as propriedades de cada objeto no array
                    allAtividadesObj.forEach(obj => {
                        delete obj.createdAt;
                        delete obj.updatedAt;
                    });



                    exportExcellAtividade(allAtividadesObj, res);
                    break;

            };



        } catch (err) {
            console.log(err)
            res.json({ success: false, message: `numero máximo de registro` })
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

//exportExcell();

