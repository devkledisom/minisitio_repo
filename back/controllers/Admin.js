const fs = require('fs');

//streams
const express = require('express');
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server);
const ExcelJS = require('exceljs');
const masterPath = require('../config/config');
const moment = require('moment');
const csv = require('csv-parser');

//models
const database = require('../config/db');
const Anuncio = require('../models/table_anuncio');
const Atividade = require('../models/table_atividade');
const Caderno = require('../models/table_caderno');
const Cadernos = require('../models/table_caderno');
const Calhau = require('../models/table_calhau');
const Descontos = require('../models/table_desconto');
const Promocao = require('../models/table_promocao');
const DDD = require('../models/table_ddd');
const Globals = require('../models/table_globals');
const Pin = require('../models/table_pin');
const Pagamento = require('../models/table_pagamentos');
const Uf = require('../models/table_uf');
const Usuarios = require('../models/table_usuarios');
const Ufs = require('../models/table_uf');
const Tags = require('../models/table_tags');
const TokensPromocao = require('../models/tokens_promocao');




//Functions
const verificarNudoc = require('./identificarNuDoc');
const exportExcell = require('../functions/server');
const exportExcellId = require('../functions/serverExportId');
const exportExcellUser = require('../functions/serverExportUser');
const exportExcellCaderno = require('../functions/exportExcellCaderno');
const exportExcellAtividade = require('../functions/exportExcellAtividade');
const archiverCompactor = require('../functions/archiver');

//moduls
const Sequelize = require('sequelize');
const Desconto = require('../models/table_desconto');
const { Op } = Sequelize;
const readXlsxFile = require('read-excel-file/node');
const path = require('path');
const { totalmem } = require('os');
const Users = require('./Users');
const { hash } = require('crypto');
const Campanha = require('../models/table_campanha');




module.exports = {
    //usuarios
    listarUsuarios: async (req, res) => {
        const paginaAtual = req.query.page ? parseInt(req.query.page) : 1; // Página atual, padrão: 1
        const porPagina = 10; // Número de itens por página
        const codigoCaderno = req.params.codCaderno;


        const offset = (paginaAtual - 1) * porPagina;

        // Consulta para recuperar apenas os itens da página atual
        console.time("Tempo da consulta");
        const users = await Usuarios.findAll({
            order: [['dtCadastro', 'DESC'], ['descNome', 'ASC']],
            limit: porPagina,
            offset: offset,
            attributes: [
                //[Sequelize.literal('DISTINCT `descCPFCNPJ`'), 'descCPFCNPJ'],
                'codUsuario',
                'descCPFCNPJ', // Aplique DISTINCT diretamente aqui
                'descNome',
                'descEmail',
                'senha',
                'codTipoUsuario',
                'codUf',
                'codCidade',
                'dtCadastro',
                'ativo'
            ],
            distinct: false,

        });
        console.timeEnd("Tempo da consulta");

        const consultarRegistros = await Globals.findAll({
            where: {
                keyValue: "total_usuarios"
            },
            raw: true
        })

        // console.log('daadsa', consultarRegistros[0].value)


        // Número total de itens
        const totalItens = consultarRegistros[0].value;
        // Número total de páginas
        const totalPaginas = Math.ceil(totalItens / porPagina);

        /*      console.log({
                 anuncios: users, // Itens da página atual
                 paginaAtual: paginaAtual,
                 totalPaginas: totalPaginas
             })
      */


        res.json({
            usuarios: users, // Itens da página atual
            paginaAtual: paginaAtual,
            totalPaginas: totalPaginas,
            totalItem: totalItens
        });
    },
    listarUsuariosold: async (req, res) => {
        const paginaAtual = req.query.page ? parseInt(req.query.page) : 1; // Página atual, padrão: 1
        const porPagina = 10; // Número de itens por página
        const codigoCaderno = req.params.codCaderno;


        const offset = (paginaAtual - 1) * porPagina;

        // Consulta para recuperar apenas os itens da página atual
        console.time("Tempo da consulta");
        const users = await Usuarios.findAndCountAll({
            order: [['dtCadastro', 'DESC'], ['descNome', 'ASC']],
            limit: porPagina,
            offset: offset,
            attributes: [
                //[Sequelize.literal('DISTINCT `descCPFCNPJ`'), 'descCPFCNPJ'],
                'codUsuario',
                'descCPFCNPJ', // Aplique DISTINCT diretamente aqui
                'descNome',
                'descEmail',
                'senha',
                'codTipoUsuario',
                'codUf',
                'codCidade',
                'dtCadastro',
                'ativo'
            ],
            distinct: false,

        });
        console.timeEnd("Tempo da consulta")

        // Número total de itens
        const totalItens = users.count;
        // Número total de páginas
        const totalPaginas = Math.ceil(totalItens / porPagina);

        console.log({
            anuncios: users.rows[0].dataValues, // Itens da página atual
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
        const limit = Number(req.query.limit);
        const exportarTodos = req.query.exportAll;
        /*    const ufs = await Ufs.findAll();
           const cidades = await Cadernos.findAll(); */

        const requisito = req.query.require;
        var nu_doc = req.query.id;

        console.log(req.query);

        if (exportarTodos == "true") {
            const corpo = req.body.usuarios;
            console.time('user');
            const users = await Usuarios.findAll({
                where: {
                    [requisito]: nu_doc
                },
                attributes: [
                    //[Sequelize.literal('DISTINCT `descCPFCNPJ`'), 'descCPFCNPJ'],
                    'codUsuario',
                    'codTipoPessoa',
                    'descCPFCNPJ', // Aplique DISTINCT diretamente aqui
                    'descNome',
                    'descEmail',
                    'senha',
                    'codTipoUsuario',
                    'codUf',
                    'codCidade',
                    'dtCadastro',
                    'ativo'
                ],
                distinct: false,
                raw: true
            });
            console.timeEnd("user");


            //exportExcellUser(users, res, Date.now(), 1);

            const ExcelJS = require('exceljs');

            async function createExcel() {
                const workbook = new ExcelJS.Workbook();
                const worksheet = workbook.addWorksheet('Dados');

                // Definir cabeçalhos
                worksheet.columns = [
                    { header: 'codUsuario', key: 'id', width: 10 },
                    { header: 'codTipoPessoa', key: 'tipo', width: 30 },
                    { header: 'descCPFCNPJ', key: 'doc', width: 10 },
                    { header: 'descNome', key: 'nome', width: 10 },
                    { header: 'descEmail', key: 'email', width: 10 },
                    { header: 'senha', key: 'senha', width: 10 },
                    { header: 'codTipoUsuario', key: 'tipoUser', width: 10 },
                    { header: 'codUf', key: 'uf', width: 10 },
                    { header: 'codCidade', key: 'cidade', width: 10 },
                    { header: 'dtCadastro', key: 'data', width: 10 },
                    { header: 'status', key: 'status', width: 10 },
                ];

                // Adicionar dados
                /*    worksheet.addRow({ id: 1, nome: 'João', idade: 25 });
                   worksheet.addRow({ id: 2, nome: 'Maria', idade: 30 });
                   worksheet.addRow({ id: 3, nome: 'Pedro', idade: 28 }); */

                users.forEach(item => {

                    if (item.codTipoUsuario == 1) {
                        item.codTipoUsuario = 'Ativo';
                    } else if (item.codTipoUsuario == 2) {
                        item.codTipoUsuario = 'MASTER';
                    } else if (item.codTipoUsuario == 3) {
                        item.codTipoUsuario = 'ANUNCIANTE';
                    } else if (item.codTipoUsuario == 5) {
                        item.codTipoUsuario = 'PREFEITURA';
                    }

                    if (item.ativo == 1) {
                        item.codTipoUsuario = 'Ativo';
                    }

                    worksheet.addRow({
                        id: item.codUsuario,
                        tipo: item.codTipoPessoa,
                        doc: item.descCPFCNPJ,
                        nome: item.descNome,
                        email: item.descEmail,
                        senha: item.senha,
                        tipoUser: item.codTipoUsuario,
                        uf: item.codUf,
                        cidade: item.codCidade,
                        data: item.dtCadastro,
                        status: item.ativo
                    })
                })

                res.setHeader(
                    "Content-Type",
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                );
                res.setHeader("Content-Disposition", "attachment; filename=planilha.xlsx");

                await workbook.xlsx.write(res);
                res.end();

                /*    // Definir o caminho do arquivo
                   const filePath = path.join(__dirname, `../public/export/plan.xlsx`);
   
                   // Salvar o arquivo
                   await workbook.xlsx.writeFile(filePath);
                   console.log(`Planilha criada com sucesso: ${filePath}`);
   
                   res.download(filePath, "planilha.xlsx", (err) => {
                       if (err) {
                           console.error("Erro ao enviar o arquivo:", err);
                       }
                       // Removendo o arquivo temporário após o download
                       fs.unlinkSync(filePath);
                   }); */
            }

            // Chamar a função
            createExcel().catch(console.error);



            return; //res.json({ success: true, message: "Exportação Finalizada", downloadUrl: `${masterPath.url}/export/arquivo.xlsx` });

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
            const usuarios = await Usuarios.findAll({
                where: {
                    codCaderno: nu_doc
                }
            });
            /*  const allUserObj = usuarios.map(registro => registro.get({ plain: true }));
             const corpo = allUserObj; */

            /*     corpo.map(async (item, index) => {
    
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
    
                }) */

            exportExcellUser(usuarios, res, Date.now(), 2);
        }







    },
    //cadernos
    listarCadernos: async (req, res) => {
        /*   const listaCadernos = await Cadernos.findAll();
          const listaUf = await Ufs.findAll(); */

        const paginaAtual = req.query.page ? parseInt(req.query.page) : 1; // Página atual, padrão: 1
        const porPagina = parseInt(req.query.rows) || 10; // Número de itens por página
        const codigoCaderno = req.params.codCaderno;

        const offset = (paginaAtual - 1) * porPagina;

        /*      try {
                 // Configura o cabeçalho para streaming JSON
                 res.setHeader('Content-Type', 'application/json');
     
                 // Consulta para obter os cadernos
                 const cadernos = await Cadernos.findAndCountAll({
                     order: [
                         ['UF', 'ASC'],
                         [Sequelize.literal('isCapital ASC')],
                         ['nomeCaderno', 'ASC']
                     ],
                     limit: porPagina,
                     offset: offset
                 });
     
                   // Calculando o número total de itens e páginas
         const totalItens = cadernos.count;
         const totalPaginas = Math.ceil(totalItens / porPagina);
     
         // Envia as informações de total de itens e páginas antes dos registros
         res.write(JSON.stringify({
             totalItens,
             totalPaginas,
             paginaAtual
         }));
     
                 // Obter todos os dados de resumo de anúncios para todos os cadernos em uma consulta
                 const anunciosResumo = await Anuncio.findAll({
                     where: {
                         codUf: { [Sequelize.Op.in]: cadernos.rows.map(c => c.UF) }, // Buscar somente para os estados dos cadernos
                         codCaderno: { [Sequelize.Op.in]: cadernos.rows.map(c => c.nomeCaderno) } // Buscar somente para os cadernos dos cadernos
                     },
                     attributes: [
                         'codUf',
                         'codCaderno',
                         [Sequelize.literal('SUM(CASE WHEN codTipoAnuncio = 1 THEN 1 ELSE 0 END)'), 'basico'],
                         [Sequelize.literal('SUM(CASE WHEN codTipoAnuncio = 3 THEN 1 ELSE 0 END)'), 'completo']
                     ],
                     group: ['codUf', 'codCaderno'],
                     raw: true
                 });
     
                 // Criar um mapa para acessar os resumos de anúncios de forma eficiente
                 const resumoMap = anunciosResumo.reduce((acc, resumo) => {
                     acc[`${resumo.codUf}-${resumo.codCaderno}`] = resumo;
                     return acc;
                 }, {});
     
                 let isFirst = true;
     
     
                 for (const caderno of cadernos.rows) {
                     // Use o mapa de resumos para encontrar o resumo correspondente
                     const resumo = resumoMap[`${caderno.UF}-${caderno.nomeCaderno}`];
     
                     const record = {
                         caderno: {
                             codCaderno: caderno.codCaderno,
                             UF: caderno.UF,
                             nomeCaderno: caderno.nomeCaderno,
                             descImagem: caderno.descImagem,
                             isCapital: caderno.isCapital,
                             cep_inicial: caderno.cep_inicial,
                             cep_final: caderno.cep_final,
                             basico: resumo.basico,
                             completo: resumo.completo,
                             paginaAtual: paginaAtual,
                             totalPaginas: totalPaginas,
                             totalItem: totalItens,
                         },
                         resumo: resumo || {} // Caso não encontre o resumo, retorna um objeto vazio
                     };
     
                     // Envia o registro em formato JSON
                     // if (!isFirst) res.write(','); // Adiciona vírgula antes de cada registro, exceto o primeiro
                     res.write(JSON.stringify(record));
                     isFirst = false;
     
                     // Pequeno atraso opcional para simular streaming
                     await new Promise((resolve) => setTimeout(resolve, 100)); // 100ms (opcional)
                 }
     
                 res.end(); // Finaliza a resposta
             } catch (error) {
                 console.error('Erro ao buscar dados:', error);
                 res.status(500).json({ success: false, message: 'Erro interno do servidor' });
             }
      */



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
        /* 
                const results = await Anuncio.findAll({
                    where: {
                        codUf: 'AL',
                        codCaderno: 'PENEDO',
                        codTipoAnuncio: 1
                      },
                    attributes: [
                        'codUf', 'codCaderno',
                        [Sequelize.literal('SUM(CASE WHEN codTipoAnuncio = 1 THEN 1 ELSE 0 END)'), 'basico'],
                        [Sequelize.literal('SUM(CASE WHEN codTipoAnuncio = 3 THEN 1 ELSE 0 END)'), 'completo'],
                    ],
                    group: ['codUf', 'codCaderno'],
                });
                console.log('12331231231221312', results) */

        /* anuncios.rows.map(async (item) => {
            //console.log(item.dataValues)
            
            const qtdBasico = await Anuncio.count({
              where: {
                codUf: item.UF,
                codCaderno: item.nomeCaderno,
                codTipoAnuncio: 1
              }
            });

            const qtdCompleto = await Anuncio.count({
              where: {
                codUf: item.UF,
                codCaderno: item.nomeCaderno,
                codTipoAnuncio: 3
              }
            });

            console.log("dasdadqasdasd", qtdAnuncios)
            item.dataValues.basico = qtdBasico
            item.dataValues.completo = qtdCompleto
        }) */
        /* 
                const qtdAnuncios = await Anuncio.count({
                    order: [
                        ['UF', 'ASC'], // Ordena pelo campo 'name' em ordem ascendente (alfabética)
                        [Sequelize.literal('isCapital ASC')],
                        ['nomeCaderno', 'ASC']
        
                    ],
                    limit: porPagina,
                    offset: offset
                }); */

        console.log({
            anuncios: anuncios.rows[0], // Itens da página atual
            paginaAtual: paginaAtual,
            totalPaginas: totalPaginas,
            //qtd: results
        })

        res.json({
            success: true, message: {
                anuncios: anuncios.rows, // Itens da página atual
                paginaAtual: paginaAtual,
                totalPaginas: totalPaginas,
                totalItem: totalItens,
                //qtd: results
            }
        })
        /*           res.json({
                     success: true, data: { cidades: listaCadernos, estados: listaUf }, message: {
                         anuncios: anuncios.rows, // Itens da página atual
                         paginaAtual: paginaAtual,
                         totalPaginas: totalPaginas,
                         totalItem: totalItens,
                         //qtd: results
                     }
                 }) 
   */
    },
    listarCadernosPortal: async (req, res) => {
        const anuncios = await Cadernos.findAll({
            order: [
                ['UF', 'ASC'], // Ordena pelo campo 'name' em ordem ascendente (alfabética)
                [Sequelize.literal('isCapital ASC')],
                ['nomeCaderno', 'ASC']

            ],
            limit: porPagina,
            offset: offset,
            raw: true
        });

        res.json({
            success: true, message: {
                anuncios: anuncios
            }
        })
    },
    countPerfis: async (req, res) => {

        const arrCadernos = req.body.data;

        const anunciosResumo = await Anuncio.findAll({
            /*     where: {
                    codUf: req.query.uf, // Buscar somente para os estados dos cadernos
                }, */
            where: {
                codUf: req.query.uf, // Buscar somente para os estados dos cadernos
                codCaderno: { [Sequelize.Op.in]: arrCadernos } // Buscar somente para os cadernos dos cadernos
            },
            attributes: [
                'codUf',
                'codCaderno',
                [Sequelize.literal('SUM(CASE WHEN codTipoAnuncio = 1 THEN 1 ELSE 0 END)'), 'basico'],
                [Sequelize.literal('SUM(CASE WHEN codTipoAnuncio = 3 THEN 1 ELSE 0 END)'), 'completo']
            ],
            group: ['codUf', 'codCaderno'],
            raw: true
        });
        res.json(anunciosResumo)


    },
    criarCaderno: async (req, res) => {

        let ufSigla = await Ufs.findAll({
            where: {
                id_uf: req.body.codUf
            }
        });

        // Verificação e ajuste dos valores recebidos

        const mosaico = req.body.descImagem || 0;
        const cepInicial = req.body.cep_inicial || 0;
        const cepFinal = req.body.cep_final || 0;
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

        const paginaAtual = req.query.page ? parseInt(req.query.page) : 1; // Página atual, padrão: 1
        const porPagina = parseInt(req.query.rows) || 10; // Número de itens por página
        const codigoCaderno = req.params.codCaderno;

        const offset = (paginaAtual - 1) * porPagina;

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
            },
            limit: porPagina,
            offset: offset
        });

        if (resultAnuncio < 1) {
            res.json({ success: false, message: "Registro não encontrado" });
            return;
        }

        const countCadernos = await Cadernos.count({
            where: {
                [Op.or]: [
                    { UF: nu_hash },
                    { nomeCaderno: nu_hash },
                ]
            }
        });
        //console.log(countCadernos)

        // Número total de itens
        const totalItens = countCadernos;
        // Número total de páginas
        const totalPaginas = Math.ceil(totalItens / porPagina);

        res.json({
            success: true,
            message: {
                registros: resultAnuncio,
                paginaAtual: paginaAtual,
                totalPaginas: totalPaginas,
                totalItem: totalItens,
            }
        });

    },
    atualizarCadernos: async (req, res) => {

        const cadernoOldName = await Cadernos.findOne({
            where: {
                codCaderno: req.query.id
            },
            raw: true
        });

        const atualizarPerfis = await Anuncio.update({
            codCidade: req.body.nomeCaderno,
            codCaderno: req.body.nomeCaderno,
        }, {
            where: {
                codCaderno: cadernoOldName.nomeCaderno,
            }
        })

        const atualizarUsuarios = await Usuarios.update({
            codCidade: req.body.nomeCaderno,
        }, {
            where: {
                codCidade: cadernoOldName.nomeCaderno,
            }
        })


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
    cadernoLegenda: async (req, res) => {
        console.log("dasjkhdkljashdfas")

        const uf = req.params.uf;
        const caderno = req.params.caderno;
        //console.log(uf, caderno)

        //Atividades
        const resultCaderno = await Cadernos.findAll({
            where: {
                nomeCaderno: caderno,
                UF: uf
            },
            attributes: ['legenda'],
            raw: true
        });
        console.log(resultCaderno)
        res.json(resultCaderno);
    },
    cadernoLegendaUpdate: async (req, res) => {

        const uf = req.params.uf;
        const caderno = req.params.caderno;
        const data = req.body.legenda;

        //Atividades
        const resultCaderno = await Cadernos.update({
            legenda: data
        }, {
            where: {
                nomeCaderno: caderno,
                UF: uf
            }
        });

        console.log(resultCaderno, uf, caderno)

        res.json({ success: true, message: resultCaderno });
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
                ['nomeAmigavel', 'ASC'],
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
                    { atividade: { [Op.like]: `%${req.query.nome}%` } },
                    { nomeAmigavel: { [Op.like]: `%${req.query.nome}%` } }
                    //req.query.nome ? req.query.nome : ""
                ]

            },

        });

        if (atividades.length < 1) {
            res.json({ success: false, message: "Registro não encontrado" });
            return;
        }

        res.json({
            success: true, message: atividades
        })


    },
    atualizarAtividades: async (req, res) => {
        // Consulta para recuperar apenas os itens da página atual
        const atividades = await Atividade.update({
            //atividade: req.body.nomeAmigavel,
            nomeAmigavel: req.body.nomeAmigavel,
            corTitulo: req.body.corTitulo
        }, {
            where: {
                id: req.query.id,
            },

        });

        const nameAtividade = await Atividade.findOne({
            where: {
                id: req.query.id,
            },
            raw: true
        });

        const anunciosAtividade = await Anuncio.findAll({
            where: {
                codAtividade: nameAtividade.atividade,
            },
            attributes: ['codUf', 'codCaderno'],
            group: ['codUf', 'codCaderno'],
            raw: true
        });

        //console.log("very", nameAtividade.atividade, anunciosAtividade)

        res.json({
            success: true, message: atividades
        })

        for (let caderno of anunciosAtividade) {
            try {
                const query = `
UPDATE anuncio
JOIN (
    SELECT a.codAnuncio, 
           CEIL(ROW_NUMBER() OVER (ORDER BY b.nomeAmigavel ASC, a.createdAt DESC) / 10) AS page_number
    FROM anuncio a
    JOIN atividade b ON a.codAtividade = b.atividade
    WHERE a.codUf = :estado AND a.codCaderno = :caderno
) AS temp
ON anuncio.codAnuncio = temp.codAnuncio
SET anuncio.page = temp.page_number
WHERE anuncio.codUf = :estado AND anuncio.codCaderno = :caderno;
                            `;

                await database.query(query, {
                    replacements: { estado: caderno.codUf, caderno: caderno.codCaderno },
                    type: Sequelize.QueryTypes.UPDATE,
                });

                console.log(`Reorganização concluída para o estado:`, caderno.codUf);
            } catch (error) {
                console.error("Erro ao executar a reorganização:", error);
            }
        }


        /* for (let caderno of cadernos) {
            try {
                const query = `
UPDATE anuncio
JOIN (
    SELECT a.codAnuncio, 
           CEIL(ROW_NUMBER() OVER (ORDER BY b.nomeAmigavel ASC, a.createdAt DESC) / 10) AS page_number
    FROM anuncio a
    JOIN atividade b ON a.codAtividade = b.atividade
    WHERE a.codUf = :estado AND a.codCaderno = :caderno
) AS temp
ON anuncio.codAnuncio = temp.codAnuncio
SET anuncio.page = temp.page_number
WHERE anuncio.codUf = :estado AND anuncio.codCaderno = :caderno;
                            `;

                await database.query(query, {
                    replacements: { estado: caderno.UF, caderno: caderno.nomeCaderno },
                    type: Sequelize.QueryTypes.UPDATE,
                });

                console.log(`Reorganização concluída para o estado:`, caderno.UF);
            } catch (error) {
                console.error("Erro ao executar a reorganização:", error);
            }
        } */

        /*         try {
                    const query = `
        UPDATE anuncio
        JOIN (
            SELECT a.codAnuncio, 
                   CEIL(ROW_NUMBER() OVER (ORDER BY b.nomeAmigavel ASC, a.createdAt DESC) / 10) AS page_number
            FROM anuncio a
            JOIN atividade b ON a.codAtividade = b.atividade
            WHERE a.codUf = :estado AND a.codCaderno = :caderno
        ) AS temp
        ON anuncio.codAnuncio = temp.codAnuncio
        SET anuncio.page = temp.page_number
        WHERE anuncio.codUf = :estado AND anuncio.codCaderno = :caderno;
                                    `;
        
                    database.query(query, {
                        replacements: { estado: dadosAnuncio.codUf, caderno: dadosAnuncio.codCaderno },
                        type: Sequelize.QueryTypes.UPDATE,
                    });
        
                    console.log(`Reorganização concluída para o estado:`, dadosAnuncio.codUf);
                } catch (error) {
                    console.error("Erro ao executar a reorganização:", error);
                } */




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
                nomeAmigavel: req.body.atividade,
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
            limit: porPagina,
            offset: offset
        });

        /*         console.log(Ids.rows)
        return; */
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


        /*         Ids.rows.map(async item => {
                    console.log(item.dataValues.descricao);
                    item.dataValues.atividade = corrigirCaracteres(item.dataValues.descricao)
                    item.dataValues.qtdaGeral = await Anuncio.findAndCountAll({
                        where: {
                            codDesconto: item.dataValues.idDesconto
                        }
                    });
                })
        
                console.log(Ids.rows) */

        await Promise.all(
            Ids.rows.map(async (item) => {
                console.log(item.dataValues.descricao);

                // Corrigir caracteres na descrição
                item.dataValues.atividade = corrigirCaracteres(item.dataValues.descricao);

                const user = await item.getUsuario();
                //item.dataValues.nmUsuario = user.descNome;

                if (user) {
                    item.dataValues = {
                        nmUsuario: user.descNome, // Adiciona a nova propriedade no início
                        ...item.dataValues, // Mantém as demais propriedades
                    };
                }




            })
        );


        /*  const idsData = Ids.rows.map((item) => ({
             hash: item.dataValues.hash,
             descricao: item.dataValues.descricao,
           }));
           
           // Obter todos os códigos hash em uma única consulta
           const hashes = idsData.map((item) => item.hash);
           
           try {
             // Consulta para contar os registros agrupados por codDesconto
             const totais = await Anuncio.findAll({
               attributes: [
                 'codDesconto',
                 [Sequelize.fn('COUNT', Sequelize.col('codDesconto')), 'qtdaGeral'],
               ],
               where: {
                 codDesconto: hashes, // Filtra apenas os códigos que precisamos
               },
               group: ['codDesconto'],
               raw: true,
             });
           
             // Transformar o resultado em um mapa para acesso rápido
             const totaisMap = totais.reduce((acc, item) => {
               acc[item.codDesconto] = parseInt(item.qtdaGeral, 10);
               return acc;
             }, {});
           
             // Atualizar cada item com os dados calculados
             await Promise.all(
               Ids.rows.map(async (item) => {
                 const { hash, descricao } = item.dataValues;
           
                 // Corrigir caracteres na descrição
                 item.dataValues.atividade = corrigirCaracteres(descricao);
           
                 // Buscar o total do mapa (ou 0 se não existir)
                 item.dataValues.qtdaGeral = totaisMap[hash] || 0;
           
                 // Adicionar informações do usuário
                 const user = await item.getUsuario();
                 if (user) {
                   item.dataValues = {
                     nmUsuario: user.descNome, // Adiciona a nova propriedade no início
                     ...item.dataValues, // Mantém as demais propriedades
                   };
                 }
               })
             );
           
             console.log('Processamento concluído!');
           } catch (err) {
             console.error('Erro ao processar os dados:', err);
           } */




        /* 
                const arrCadernos = req.body.data;
        
                async function contarNumeros() {
                  try {
                    const resultado = await Anuncio.findAll({
                        where: {
                            codCaderno: { [Sequelize.Op.in]: arrCadernos } // Buscar somente para os cadernos dos cadernos
                        },
                      attributes: ['codDesconto', [Sequelize.fn('COUNT', Sequelize.col('codDesconto')), 'total']],
                      group: ['codDesconto'], // Agrupa por valores na coluna "numero"
                      raw: true, // Retorna os dados como objetos simples
                    });
                
                    console.log("asdasdas", resultado);
                    // Saída:
                    // [
                    //   { numero: 1, total: 3 },
                    //   { numero: 2, total: 2 },
                    //   { numero: 3, total: 1 }
                    // ]
                  } catch (error) {
                    console.error('Erro ao contar números:', error);
                  }
                }
                
                contarNumeros(); */


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

        const uuid = req.params.id;

        //Atividades
        const resultAnuncio = await Descontos.findAll({
            where: {
                [Op.or]: {
                    idDesconto: uuid,
                    hash: uuid
                }
            }
        });



        res.json(resultAnuncio);
    },
    atualizarIds: async (req, res) => {

        let { img_1, img_2, img_3, newImg_1, newImg_2, newImg_3 } = req.body.imagens;

        try {
            // Consulta para recuperar apenas os itens da página atual
            const ids = await Descontos.update({
                idUsuario: req.body.usuario,
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

            if (newImg_1 && newImg_1 != img_1) {
                console.log("remover imagem antiga 1:", img_1)
                fs.unlink(path.join(__dirname, `../public/upload/img/logoParceiro/${img_1}`), (err) => {
                    if (err) {
                        console.error("Erro ao excluir o arquivo:", err);
                        return;
                    }
                    console.log('Arquivo apagado com sucesso!');
                });
            }
            if (newImg_2 && newImg_2 != img_2) {
                console.log("remover imagem antiga 2:", img_2)
                fs.unlink(path.join(__dirname, `../public/upload/img/logoParceiro/${img_2}`), (err) => {
                    if (err) {
                        console.error("Erro ao excluir o arquivo:", err);
                        return;
                    }
                    console.log('Arquivo apagado com sucesso!');
                });
            }
            if (newImg_3 && newImg_3 != img_3) {
                console.log("remover imagem antiga 3:", img_3)
                fs.unlink(path.join(__dirname, `../public/upload/img/logoParceiro/${img_3}`), (err) => {
                    if (err) {
                        console.error("Erro ao excluir o arquivo:", err);
                        return;
                    }
                    console.log('Arquivo apagado com sucesso!');
                });
            }

            res.json({
                success: true, message: ids
            })
        } catch (err) {
            console.log(err.original)
        }



    },
    criarIds: async (req, res) => {



        const usuario = await Usuarios.findAll({
            where: {
                codUsuario: req.body.usuario
            }
        });

        console.log(usuario)

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
                utilizar_saldo: req.body.saldoUtilizado,
                saldo: req.body.saldo,
                total_registros: 0,
                is_capa: req.body.is_capa
            });

            res.json({ success: true, message: "ID criado com sucesso!" });
        } catch (err) {
            res.json({ success: false, message: err });
        }

    },
    deleteIds: async (req, res) => {

        const uuid = req.params.id;

        try {
            //const resultDesconto = await Descontos.findAll({ where: { idDesconto: uuid } });

            //const apagarUsuario = await Usuarios.destroy({ where: { codUsuario: resultDesconto[0].idUsuario } });

            //const apagarEspaco = await Anuncio.destroy({ where: { codUsuario: resultDesconto[0].idUsuario } });

            const resultAnuncio = await Descontos.destroy({ where: { idDesconto: uuid } });


            res.json({ success: true, message: `Registro ${uuid} apagado da base!` });
        } catch (err) {
            res.json(err);
        }
        //res.json({ success: true, message: `Usuário ${uuid} apagado da base!`, teste: resultDesconto[0].idUsuario });

    },
    buscarId: async (req, res) => {

        /*    if(pages === "all") {
               const allIds = await Descontos.findAll();
   
               res.json({success: true, data: allIds});
   
               return;
           }; */

        const nu_hash = req.params.id;

        const resultUser = await Usuarios.findAll({
            where: {
                [Op.and]: [
                    { descNome: { [Op.like]: `%${nu_hash}%` } },
                    { codTipoUsuario: 2 }
                ]

            },
            attributes: ['codUsuario']
        });

        //console.log(resultUser)

        if (resultUser[0]) {
            //Descontos
            const resultAnuncio = await Descontos.findAll({
                where: {
                    [Op.or]: [
                        { idUsuario: resultUser[0].codUsuario }
                    ]

                }
            });

            if (resultAnuncio < 1) {
                res.json({ success: false, message: "ID não encontrado" });
                return;
            }

            await Promise.all(
                resultAnuncio.map(async (item) => {
                    const user = await item.getUsuario();

                    item.dataValues = {
                        nmUsuario: user.descNome, // Adiciona a nova propriedade no início
                        ...item.dataValues, // Mantém as demais propriedades
                    };
                })
            );


            res.json({ success: true, IdsValue: resultAnuncio, totalItem: resultAnuncio.length, totalPaginas: 1, paginaAtual: 1 });
        } else {
            //Descontos
            const resultAnuncio = await Descontos.findAll({
                where: {
                    [Op.or]: [
                        { hash: nu_hash },
                        { idDesconto: nu_hash }
                    ]

                }
            });
            if (resultAnuncio < 1 || resultAnuncio[0].hash == "00.000.0000") {
                res.json({ success: false, message: "ID não encontrado 0" });
                return;
            }

            await Promise.all(
                resultAnuncio.map(async (item) => {
                    const user = await item.getUsuario();
                    if (user) {
                        item.dataValues = {
                            nmUsuario: user.descNome, // Adiciona a nova propriedade no início
                            ...item.dataValues, // Mantém as demais propriedades
                        };
                    }
                })
            );

            res.json({ success: true, IdsValue: resultAnuncio });
        }




    },
    aplicarDesconto: async (req, res) => {
        //Descontos
        const nu_hash = req.params.id;
        const resultAnuncio = await Descontos.findAll({
            where: {
                hash: nu_hash
                /*      [Op.or]: [
                         { hash: nu_hash },
                         { idDesconto: nu_hash }
                     ] */

            },
            attributes: ['desconto', 'descricao', 'is_capa']
        });
        if (resultAnuncio < 1 || resultAnuncio[0].hash == "00.000.0000") {
            res.json({ success: false, message: "ID não encontrado 0" });
            return;
        }

        await Promise.all(
            resultAnuncio.map(async (item) => {
                const user = await item.getUsuario();
                if (user) {
                    item.dataValues = {
                        nmUsuario: user.descNome, // Adiciona a nova propriedade no início
                        ...item.dataValues, // Mantém as demais propriedades
                    };
                }
            })
        );

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
    buscarUsuarioId: async (req, res) => {

        //usuarios
        const resultUsuario = await Usuarios.findAll({
            where: {
                codUsuario: req.params.id
            },
            attributes: ['codUsuario', 'descNome']
        });

        if (resultUsuario < 1) {
            res.json({ success: false, message: "Usuario não encontrado" });
            return;
        }

        res.json({ success: true, usuarios: resultUsuario });



    },
    buscarDDD: async (req, res) => {
        await database.sync();

        const codUf = req.params.id;

        const dddBusca = await DDD.findAll({
            where: {
                sigla_uf: codUf
            }
        });

        const descontoBusca = await Descontos.count();

        const masters = await Usuarios.count({
            where: {
                codUf: codUf,
                codTipoUsuario: 2
            }
        })

        if (dddBusca < 1) {
            res.json({ success: false, message: "ddd não encontrado" });
            return;
        }

        res.json({ success: true, data: dddBusca[0], qtdeIds: descontoBusca, masters: masters });
        //res.json({ success: true, data: dddBusca });
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
        const filtro = req.query.filtro;

        if (filtro === "true") {
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
        } else {
            try {
                const Ids = await Descontos.findAll({
                    order: [['dtCadastro', 'DESC']],
                    raw: false
                });

                const arr = [];

                await Promise.all(
                    Ids.map(async (item) => {
                        const user = await item.getUsuario();

                        try {
                            item.dataValues = {
                                nmUsuario: user.descNome, // Adiciona a nova propriedade no início
                                ...item.dataValues, // Mantém as demais propriedades
                            };
                        } catch (err) {
                            item.dataValues = {
                                nmUsuario: "alterar", // Adiciona a nova propriedade no início
                                ...item.dataValues, // Mantém as demais propriedades
                            };
                        }

                        arr.push(item.dataValues);

                    })
                );
                //console.log(arr)
                exportExcellId(arr, res)
            } catch (err) {
                console.log(err)
                res.json({ success: false, message: `o numero máximo de registros é ${anunciosCount}` })
            }
        }
    },
    //CAMPANHA
    CampanhalistarIds: async (req, res) => {

        const paginaAtual = req.query.page ? parseInt(req.query.page) : 1; // Página atual, padrão: 1
        const porPagina = 10; // Número de itens por página
        const codigoCaderno = req.params.codCaderno;

        const offset = (paginaAtual - 1) * porPagina;

        // Consulta para recuperar apenas os itens da página atual
        const Ids = await Descontos.findAll({
            where: {
                [Op.and]: [
                    { hash: { [Op.ne]: "00.000.0000" } },
                    { hash: { [Op.ne]: "0" } },
                    { desconto: { [Op.gt]: 0 } },
                ]
            },
            order: [['hash', 'ASC']],
            //order: [['dtCadastro', 'DESC']],
            /*   limit: porPagina,
              offset: offset */
        });

        /*         console.log(Ids.rows)
        return; */
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


        await Promise.all(
            Ids.map(async (item) => {
                //console.log(item.dataValues.descricao);

                // Corrigir caracteres na descrição
                item.dataValues.atividade = corrigirCaracteres(item.dataValues.descricao);

                const user = await item.getUsuario();
                //item.dataValues.nmUsuario = user.descNome;

                if (user) {
                    item.dataValues = {
                        nmUsuario: user.descNome, // Adiciona a nova propriedade no início
                        ...item.dataValues, // Mantém as demais propriedades
                    };
                }




            })
        );

        res.json({
            success: true, message: {
                IdsValue: Ids,
            }
        })



    },


    //MODULO PIN
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
                totalPaginas: totalPaginas,
                totalItens: totalItens
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
    listarPinPortal: async (req, res) => {


        const pin = await Pin.findOne({ order: [['createdAt', 'DESC']] });

        // Verifica se o resultado está vazio
        if (pin.length === 0) {
            return res.status(404).json({ message: 'Pin não encontrado' });
        }

        let hoje = moment();
        let validade = moment(pin.validade, "DD/MM/YYYY");
        console.log(hoje.isBefore(validade), pin.validade)

        if (hoje.isBefore(validade)) {
            res.json({ success: true, pin: pin });
        } else {
            res.json({ success: false, message: "pin vencido" });
        }


    },

    //MODULO CALHAU
    listarCalhau: async (req, res) => {

        const paginaAtual = req.query.page ? parseInt(req.query.page) : 1; // Página atual, padrão: 1
        const porPagina = 10; // Número de itens por página
        const codigoCaderno = req.params.codCaderno;

        const offset = (paginaAtual - 1) * porPagina;

        // Consulta para recuperar apenas os itens da página atual
        const frases = await Calhau.findAll({
            //order: [['createdAt', 'DESC']],
            limit: porPagina,
            offset: offset,
            raw: true
        });

        // Número total de itens
        /*       const totalItens = frases.count;
              // Número total de páginas
              const totalPaginas = Math.ceil(totalItens / porPagina); */

        res.json({
            success: true, message: {
                frases: frases, // Itens da página atual
                /*    paginaAtual: paginaAtual,
                   totalPaginas: totalPaginas */
            }
        })

        //res.json({success: true, data: pin});

    },
    criarCalhau: async (req, res) => {
        console.log(req.body)
        await database.sync();

        try {
            const novoCalhau = await Calhau.create(req.body);
            console.log(novoCalhau)
            res.json({ success: true, data: novoCalhau });
        } catch (err) {
            console.log(err)
            res.json({ success: false, err: "erro ao cadastrar" });
        }


    },
    deletarCalhau: async (req, res) => {
        let id = req.params.id;

        const calhau = await Calhau.destroy({
            where: {
                id: id
            }
        });

        res.json({ success: true, data: calhau });

    },

    //rota de exportar unica
    exportPadrao: async (req, res) => {
        const modulo = req.params.modulo;

        try {

            switch (modulo) {
                case "cadernos":
                    if (Object.keys(req.body).length <= 0) {
                        console.time("caderno")
                        const allCadernos = await Caderno.findAll({ raw: true });
                        console.timeEnd("caderno")
                        const ExcelJS = require('exceljs');

                        async function createExcel() {
                            const workbook = new ExcelJS.Workbook();
                            const worksheet = workbook.addWorksheet('Dados');

                            // Definir cabeçalhos
                            worksheet.columns = [
                                { header: 'codCaderno', key: 'id', width: 10 },
                                { header: 'codUf', key: 'tipo', width: 30 },
                                { header: 'UF', key: 'doc', width: 10 },
                                { header: 'nomeCaderno', key: 'nome', width: 10 },
                                { header: 'nomeCadernoFriendly', key: 'email', width: 10 },
                                { header: 'descImagem', key: 'senha', width: 10 },
                                { header: 'cep_inicial', key: 'tipoUser', width: 10 },
                                { header: 'cep_final', key: 'uf', width: 10 },
                                { header: 'isCapital', key: 'cidade', width: 10 },
                                { header: 'basico', key: 'data', width: 10 },
                                { header: 'completo', key: 'status', width: 10 },
                            ];

                            // Adicionar dados
                            /*    worksheet.addRow({ id: 1, nome: 'João', idade: 25 });
                               worksheet.addRow({ id: 2, nome: 'Maria', idade: 30 });
                               worksheet.addRow({ id: 3, nome: 'Pedro', idade: 28 }); */

                            allCadernos.forEach(item => {
                                /* 
                                                    if(item.codTipoUsuario == 1) {
                                                        item.codTipoUsuario = 'Ativo';
                                                    } else if(item.codTipoUsuario == 2) {
                                                        item.codTipoUsuario = 'MASTER';
                                                    } else if(item.codTipoUsuario == 3) {
                                                        item.codTipoUsuario = 'ANUNCIANTE';
                                                    } else if(item.codTipoUsuario == 5) {
                                                        item.codTipoUsuario = 'PREFEITURA';
                                                    }
                                
                                                    if(item.ativo == 1) {
                                                        item.codTipoUsuario = 'Ativo';
                                                    } */

                                worksheet.addRow({
                                    id: item.codCaderno,
                                    tipo: item.codUf,
                                    doc: item.UF,
                                    nome: item.nomeCaderno,
                                    email: item.nomeCadernoFriendly,
                                    senha: item.descImagem,
                                    tipoUser: item.cep_inicial,
                                    uf: item.cep_final,
                                    cidade: item.isCapital,
                                    data: item.basico,
                                    status: item.completo
                                })
                            })

                            res.setHeader(
                                "Content-Type",
                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                            );
                            res.setHeader("Content-Disposition", "attachment; filename=planilha.xlsx");

                            await workbook.xlsx.write(res);
                            res.end();

                        }

                        // Chamar a função
                        createExcel().catch(console.error);

                        // Supondo que você tenha o modelo 'Anuncio'
                        /* const resultados = await Anuncio.findAll({
                            where: { codCaderno: "PENEDO" },
                            attributes: [
                                'codCaderno',
                                'basico',
                                'completo'
                         
                            ],
                            group: ['codCaderno'], // Agrupar por codCaderno
                            raw: true
                        }); */

                        //console.log("debug=======:> ", resultados)

                        /*        const allCadernosObj = allCadernos.map((registro, i) => {
                                   registro.basico = resultados[i].basico;
                                   registro.completo = resultados[i].completo;
                                   return registro;
                               }); */


                        //console.log(resultados)
                        ///exportExcellCaderno(allCadernos, res, resultados);
                        /*   const allCadernosObj = newObj.map(registro => registro.get({ plain: true }));
                          console.log(allCadernosObj)
                          exportExcellCaderno(allCadernosObj, res); */

                    } else {
                        const allCadernos = await Caderno.findAll({ raw: true });

                        // Supondo que você tenha o modelo 'Anuncio'
                        const resultados = await Anuncio.findAll({
                            where: { codCaderno: "PENEDO" },
                            attributes: [
                                'codCaderno', // Referência ao campo codCaderno
                                [Sequelize.literal('SUM(CASE WHEN codTipoAnuncio = 1 THEN 1 ELSE 0 END)'), 'basico'],
                                [Sequelize.literal('SUM(CASE WHEN codTipoAnuncio = 3 THEN 1 ELSE 0 END)'), 'completo'],
                                /*   [fn('SUM', fn('CASE', { when: col('codTipoAnuncio'), op: 1 }, 1, 0)), 'basico'], // SUM CASE para codTipoAnuncio = 1
                                  [fn('SUM', fn('CASE', { when: col('codTipoAnuncio'), op: 3 }, 1, 0)), 'completo'] // SUM CASE para codTipoAnuncio = 3 */
                            ],
                            group: ['codCaderno'], // Agrupar por codCaderno
                            raw: true
                        });

                        console.log("debug=======:> ", resultados)

                        /*        const allCadernosObj = allCadernos.map((registro, i) => {
                                   registro.basico = resultados[i].basico;
                                   registro.completo = resultados[i].completo;
                                   return registro;
                               }); */


                        //console.log(resultados)
                        exportExcellCaderno(allCadernos, res, resultados);
                        //exportExcellCaderno(req.body, res);
                    }
                    break;
                case "atividades":
                    const allAtividades = await Atividade.findAll({
                        order: [
                            [Sequelize.literal('corTitulo ASC')],
                            [Sequelize.fn('LEFT', Sequelize.col('atividade'), 1), 'ASC'],
                            ['createdAt', 'DESC'],
                            ['nomeAmigavel', 'ASC']
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

    //CAMPANHA PROMOÇÃO

    //PAGAMENTOS
    listarPagamentos: async (req, res) => {
        const dataPaginacao = await paginador(req, 10);
        console.log(dataPaginacao)

        const todosPagamentos = await Pagamento.findAll({
            limit: dataPaginacao.limit,
            offset: dataPaginacao.offset,
            order: [['data', 'DESC']],
            raw: true,
            attributes: ['id', 'cliente', 'valor', 'data', 'status', 'id_mp', 'ref_mp_codAnuncio']
        });

        res.json({
            success: true,
            data: todosPagamentos,
            paginaAtual: dataPaginacao.paginaAtual,
            totalPaginas: dataPaginacao.totalPaginas,
            totalItem: dataPaginacao.totalItens
        })
    },
    listarValorBase: async (req, res) => {
        const valorBase = await Globals.findOne({
            where: { keyValue: "precoBase" },
            raw: true
        });

        //const prazoCampanha = await Campanha.

        res.json({ success: true, value: valorBase.value })
    },
    atualizarValorBase: async (req, res) => {
        const valorBase = await Globals.update({ value: req.body.novoValor }, {
            where: { keyValue: "precoBase" },
            raw: true
        });

        res.json({ success: true, value: valorBase.value, message: "Preço base atualizado!" })
    }

}

async function paginador(req, limit) {
    const paginaAtual = req.query.page ? parseInt(req.query.page) : 1; // Página atual, padrão: 1
    const porPagina = limit; // Número de itens por página
    const offset = (paginaAtual - 1) * porPagina;

    const consultarRegistros = await Globals.findAll({
        where: {
            keyValue: "total_pagamentos"
        },
        raw: true
    })


    // Número total de itens
    const totalItens = consultarRegistros[0].value;
    // Número total de páginas
    const totalPaginas = Math.ceil(totalItens / porPagina);

    return {
        paginaAtual: paginaAtual,
        totalPaginas: totalPaginas,
        totalItens: totalItens,
        limit: limit,
        offset: offset
    }
};

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
console.log(path.join(__dirname, `../public/export/caderno/`))
