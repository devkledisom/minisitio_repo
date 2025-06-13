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

        console.log(resultCaderno)

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
                    { atividade: { [Op.like]: `%${req.query.nome}%` } }
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
            //atividade: req.body.atividade,
            nomeAmigavel: req.body.nomeAmigavel,
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


        res.json({
            success: true, message: ids
        })


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
    //ESPACOS
    listaTeste: async (req, res) => {


        /*    const PAGE_SIZE = 100; // Quantidade de registros por lote
   
           //async function streamDataByBatch(req, res) {
               try {
                   if (!req.params.uf || !req.params.caderno) {
                       return res.status(400).send('Parâmetros inválidos');
                   }
           
                   let offset = 0;
                   let hasMore = true;
           
                   // Configuração inicial da resposta
                   res.setHeader('Content-Type', 'application/json');
                   res.write('[');
                   let isFirst = true;
           
                   while (hasMore) {
                       const query = `
                           SELECT 
                               codAtividade, codCaderno, codAnuncio, codUf, descAnuncio, 
                               COUNT(codAtividade) AS quantidade
                           FROM anuncio
                           WHERE codUf = ?
                             AND codCaderno = ?
                           GROUP BY codAtividade
                           ORDER BY codAtividade ASC
                           LIMIT ? OFFSET ?;
                       `;
           
                       const results = await database.query(query, {
                           replacements: [req.params.uf, req.params.caderno, PAGE_SIZE, offset],
                           type: Sequelize.QueryTypes.SELECT,
                       });
           
                       if (results.length === 0) {
                           hasMore = false; // Se não houver mais registros, terminar o loop
                           break;
                       }
           
                       results.forEach((row) => {
                           if (!isFirst) res.write(',');
                           res.write(JSON.stringify(row));
                           isFirst = false;
                       });
           
                       offset += PAGE_SIZE; // Ir para o próximo lote
                   }
           
                   res.write(']');
                   res.end();
               } catch (error) {
                   console.error('Erro ao processar os dados:', error);
                   res.status(500).send('Erro interno do servidor');
               } */
        // }


        //return;

        /*        const allPerfil = await Anuncio.findAndCountAll({
                  where: {
                      codCaderno: 'curitiba',
                      codUf: 'PR'
                  },
                  attributes: ['codAtividade', 'codCaderno', 'codAnuncio', 'codUf', 'descAnuncio']
              }); */
        const allPerfil = await database.query(
            `
    SELECT 
      a.codAtividade,
      a.codCaderno,
      a.codAnuncio,
      a.codUf,
      a.descAnuncio,
      a.page,
      COUNT(a.codAtividade) AS quantidade,
      b.nomeAmigavel
    FROM anuncio AS a
    LEFT JOIN atividade AS b ON a.codAtividade = b.atividade
    WHERE a.codUf = :codUf
      AND a.codCaderno = :codCaderno
    GROUP BY a.codAtividade
    ORDER BY a.codAtividade ASC;
  `,
            {
                replacements: {
                    codUf: req.params.uf,
                    codCaderno: req.params.caderno
                },
                type: Sequelize.QueryTypes.SELECT
            }
        );

        /* funcional
                const allPerfil = await database.query(
                    `
                        SELECT 
                            codAtividade, codCaderno, codAnuncio, codUf, descAnuncio, page,
                            COUNT(codAtividade) AS quantidade
                        FROM anuncio
                        WHERE codUf = :codUf
                          AND codCaderno = :codCaderno
                        GROUP BY codAtividade
                        ORDER BY codAtividade ASC;
                        `,
                    {
                        replacements: { codUf: req.params.uf, codCaderno: req.params.caderno }, // Substitua por variáveis dinâmicas, req.params.caderno
                        type: Sequelize.QueryTypes.SELECT,
                        include: [
                            {
                                model: Atividade,
                                attributes: ['nomeAmigavel'],
                                as: 'atividadeAmigavel',
                            }
                        ]
                    }
                ); */

        //console.log('kledisom', allPerfil, "kledisom")
        res.json({ success: true, data: allPerfil })
        return;

        const mysql = require('mysql2'); // Substitua por 'pg' se usar PostgreSQL
        const query = `
        SELECT 
            codAtividade, codCaderno, codAnuncio, codUf, descAnuncio, page,
            COUNT(codAtividade) AS quantidade
        FROM anuncio
        WHERE codUf = ?
          AND codCaderno = ?
          
        GROUP BY codAtividade
        ORDER BY codAtividade ASC;
    `;
        //AND codAtividade != 'ADMINISTRAÇÃO REGIONAL / PREFEITURA'

        try {
            // Obter uma conexão do Sequelize
            const connection = await database.connectionManager.getConnection();
            //console.log(connection.config.host)

            // Criar a conexão nativa usando o `mysql2` ou `pg`
            const nativeConnection = mysql.createConnection({
                host: connection.config.host,
                user: connection.config.user,
                password: connection.config.password,
                database: connection.config.database,
            });

            // Definir a consulta SQL
            /*    const query = `
                   SELECT codAtividade, codCaderno, codAnuncio, codUf, descAnuncio, COUNT(codAtividade) AS quantidade
                   FROM oi_clientes
                   WHERE codUf = ? AND codCaderno = ? AND codAtividade != 'ADMINISTRAÇÃO REGIONAL / PREFEITURA'
                   GROUP BY codAtividade
                   ORDER BY codAtividade ASC
               `; */

            // Iniciar o streaming
            const stream = nativeConnection.query(query, [req.params.uf, req.params.caderno]).stream();
            //const stream = [1,2,3,4,5,6,7,8,9].stream()
            console.log("kledisom", stream)
            // Configurar o cabeçalho da resposta
            res.setHeader('Content-Type', 'application/json');
            res.write('['); // Iniciar o JSON

            let isFirst = true;

            stream.on('data', (row) => {
                if (!isFirst) res.write(',');
                res.write(JSON.stringify(row));
                isFirst = false;
            });

            stream.on('end', () => {
                res.write(']'); // Finalizar o JSON
                res.end();

                // Fechar a conexão ao final
                nativeConnection.end((err) => {
                    if (err) console.error('Erro ao fechar a conexão:', err);
                });
            });

            stream.on('error', (err) => {
                console.error('Erro no streaming:', err);
                res.status(500).send('Erro ao processar os dados');

                // Certifique-se de fechar a conexão em caso de erro
                nativeConnection.end((endErr) => {
                    if (endErr) console.error('Erro ao fechar a conexão após erro:', endErr);
                });
            });

            stream.on('close', () => {
                console.log('Stream fechado.');
            });
        } catch (error) {
            console.error('Erro ao criar o stream:', error);
            res.status(500).send('Erro interno do servidor');
        }
    },
    listarEspacos: async (req, res) => {

        //await database.sync();

        const paginaAtual = req.query.page ? parseInt(req.query.page) : 1; // Página atual, padrão: 1
        const porPagina = 10; // Número de itens por página

        const offset = (paginaAtual - 1) * porPagina;

        try {
            console.time("espaco")
            // Consulta para recuperar apenas os itens da página atual
            const anuncio = await Anuncio.findAll({
                order: [
                    //[Sequelize.literal('CASE WHEN activate = 0 THEN 0 ELSE 1 END'), 'ASC'],
                    ['activate', 'ASC'],
                    ['createdAt', 'DESC'],
                    ['codDuplicado', 'ASC'],
                ],
                limit: porPagina,
                offset: offset,
                attributes: [
                    'codAnuncio',
                    'codOrigem',
                    'codDuplicado',
                    'descCPFCNPJ',
                    'descAnuncio',
                    'codTipoAnuncio',
                    'codCaderno',
                    'codUf',
                    'activate',
                    'descPromocao',
                    'createdAt',
                    'dueDate',
                    'codDesconto',
                    'codAtividade',
                    'periodo'
                ],
                include: {
                    model: Pagamento,
                    as: "pagamentos",  // Nome definido no `hasMany`
                    attributes: ["id", "valor", "status", "data"]
                }
            });

            console.timeEnd("espaco")

            const consultarRegistros = await Globals.findAll({
                where: {
                    keyValue: "total_perfis"
                },
                raw: true
            })

            // Número total de itens
            const totalItens = consultarRegistros[0].value;
            // Número total de páginas
            const totalPaginas = Math.ceil(totalItens / porPagina);


            await Promise.all(anuncio.map(async (anun, i) => {
                const user = await anun.getUsuario();
                //console.log("adjasldj",user)
                if (user) {
                    anun.codUsuario = user.descNome;
                    anun.dataValues.loginUser = user.descCPFCNPJ;
                    anun.dataValues.loginPass = user.senha;
                    anun.dataValues.loginEmail = user.descEmail;
                    anun.dataValues.loginContato = user.descTelefone;
                }

            }));

            res.json({
                success: true,
                message: {
                    anuncios: anuncio, // Itens da página atual
                    paginaAtual: paginaAtual,
                    totalPaginas: totalPaginas,
                    totalItem: totalItens
                }
            });
        } catch (err) {
            console.error("Erro ao processar os anúncios:", err);
            res.status(500).json({ success: false, message: "Erro interno ao processar os dados." });
        }



    },
    listarEspacosold: async (req, res) => {

        await database.sync();

        const paginaAtual = req.query.page ? parseInt(req.query.page) : 1; // Página atual, padrão: 1
        const porPagina = 10; // Número de itens por página

        const offset = (paginaAtual - 1) * porPagina;

        // Consulta para recuperar apenas os itens da página atual
        const anuncio = await Anuncio.findAndCountAll({
            order: [
                //[Sequelize.literal('CASE WHEN activate = 0 THEN 0 ELSE 1 END'), 'ASC'],
                ['activate', 'ASC'],
                ['createdAt', 'DESC'],
                ['codDuplicado', 'ASC'],
            ],
            limit: porPagina,
            offset: offset,
            attributes: [
                'codAnuncio',
                'codOrigem',
                'codDuplicado',
                'descCPFCNPJ',
                'descAnuncio',
                'codTipoAnuncio',
                'codCaderno',
                'codUf',
                'activate',
                'descPromocao',
                'createdAt',
                'dueDate',
                'codDesconto',
                'codAtividade',
                'periodo'
            ]
        });

        // Número total de itens
        const totalItens = anuncio.count;
        // Número total de páginas
        const totalPaginas = Math.ceil(totalItens / porPagina);

        // Importe a biblioteca 'iconv-lite'
        /*       const iconv = require('iconv-lite');
      
              // Função para corrigir caracteres codificados incorretamente
              function corrigirCaracteres(cadeiaCodificada) {
                  // Decodifica a cadeia usando UTF-8
                  const buffer = Buffer.from(cadeiaCodificada, 'binary');
                  const cadeiaCorrigida = iconv.decode(buffer, 'utf-8');
      
                  return cadeiaCorrigida;
              }
       */
        try {
            await Promise.all(anuncio.rows.map(async (anun, i) => {
                const user = await anun.getUsuario();
                //console.log("adjasldj",user)
                if (user) {
                    anun.codUsuario = user.descNome;
                    anun.dataValues.loginUser = user.descCPFCNPJ;
                    anun.dataValues.loginPass = user.senha;
                    anun.dataValues.loginEmail = user.descEmail;
                    anun.dataValues.loginContato = user.descTelefone;
                }

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

        try {
            /*    const result = await Anuncio.findAll({
                   where: {
                       [Op.and]: [
                           { codUf: req.params.uf },
                           { codCaderno: req.params.caderno },
                           { codAtividade: { [Op.ne]: "ADMINISTRAÇÃO REGIONAL / PREFEITURA" } }
                       ]
                   },
                   attributes: [
                       'codAtividade', 'codCaderno', 'codAnuncio', 'codUf', 'descAnuncio',
                       [Sequelize.fn('COUNT', Sequelize.col('codAtividade')), 'quantidade']
                   ],
                   group: ['codAtividade'],
                   order: [['codAtividade', 'ASC']]
               }); */

            //console.log("resultado", result.map(r => r.toJSON())); // Resultado formatado


            const anuncioTeste = await Anuncio.findAndCountAll({
                where: {
                    [Op.and]: [
                        { codUf: req.params.uf },
                        { codCaderno: req.params.caderno }
                    ],
                    [Op.or]: [
                        { codAtividade: "ADMINISTRAÇÃO REGIONAL / PREFEITURA" },
                        { codAtividade: "EMERGÊNCIA" },
                        { codAtividade: "UTILIDADE PÚBLICA" },
                        { codAtividade: "HOSPITAIS PÚBLICOS" },
                        { codAtividade: "CÂMARA DE VEREADORES - CÂMARA DISTRITAL" },
                        { codAtividade: "SECRETARIA DE TURISMO" },
                        { codAtividade: "INFORMAÇÕES" },
                        { codAtividade: "EVENTOS NA CIDADE" },
                    ]
                }
            });

            const contador = await Caderno.findOne({
                where: { UF: req.params.uf, nomeCaderno: req.params.caderno },
                raw: true
            })

            res.json({
                success: true,
                //data: result.map(r => r.toJSON()),
                teste: anuncioTeste,
                //anuncio2: anuncio2,
                mosaico: contador.descImagem,
                kledisom: 123,
                totalRegistros: contador.total
            });

        } catch (error) {
            console.error('Erro ao buscar dados:', error);
        }



        return;


        // Consulta para recuperar apenas os itens da página atual
        const codCaderno = await Caderno.findAll({
            where: {
                UF: req.params.uf,
                [Op.or]: [
                    { nomeCaderno: req.params.caderno },
                    { codCaderno: req.params.caderno }
                ]
            },
            attributes: ['descImagem']
        });

        //console.log(codCaderno)


        const anuncio = await Anuncio.findAndCountAll({
            where: {
                [Op.and]: [
                    { codUf: req.params.uf },
                    { codCaderno: req.params.caderno }
                    /*  { codUf: codCaderno[0].dataValues.UF },
                     { codCaderno: codCaderno[0].dataValues.nomeCaderno } */
                ]
            },
            attributes: ['codAtividade', 'codAnuncio', 'descAnuncio', 'codUf', 'codCaderno']
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

        function removerAcentosESpeciaisComRegex(str) {
            return str
                .replace(/[ÀÁÂÃÄÅàáâãäå]/g, 'a')
                .replace(/[ÈÉÊËèéêë]/g, 'e')
                .replace(/[ÌÍÎÏìíîï]/g, 'i')
                .replace(/[ÒÓÔÕÖØòóôõöø]/g, 'o')
                .replace(/[ÙÚÛÜùúûü]/g, 'u')
                .replace(/[Çç]/g, 'c')
                .replace(/[Ññ]/g, 'n')
                .replace(/[^a-zA-Z0-9\s]/g, ''); // Remove outros caracteres especiais
        }

        const arrayClassificado = [];

        for (let x in count) {
            const anun = anuncio.rows.find(item => item.codAtividade == x);
            const atividade = atividades.find(item => removerAcentosESpeciaisComRegex(item.atividade.toLowerCase()) == removerAcentosESpeciaisComRegex(x.toLowerCase()));


            //console.log("asdasjdhas: ", " | ", atividades[3014].atividade, " | ", removerAcentosESpeciaisComRegex(x.toLowerCase()))

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
                    { codUf: req.params.uf },
                    { codCaderno: req.params.caderno }
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

        /*      const anuncio2 = await Anuncio.findAndCountAll({
                 where: {
                     [Op.and]: [
                         { codUf: req.params.uf },
                         { codCaderno: req.params.caderno }
                     ]
                 } ,
                 order: [
                     ['nomeAtividade', 'ASC'],
                 ] 
             }); */

        res.json({
            success: true,
            data: arrayClassificado,
            teste: anuncioTeste,
            //anuncio2: anuncio2,
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
    listarClassificadoGeral2: async (req, res) => {

        const paginaAtual = req.query.page ? parseInt(req.query.page) : 1; // Página atual, padrão: 1
        const porPagina = 10; // Número de itens por página

        const offset = (paginaAtual - 1) * porPagina;

        //console.log("offsewt: ", offset)

        // Consulta para recuperar apenas os itens da página atual
        const codCaderno = await Caderno.findAll({
            where: {
                //codUf: req.query.uf,
                [Op.or]: [
                    { nomeCaderno: req.query.caderno },
                    { codCaderno: req.query.caderno },
                    //{ codUf: req.params.uf }
                ]
            }
        });

        console.log(codCaderno);

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
    listarClassificadoGeral: async (req, res) => {

        const page = req.query.page ? parseInt(req.query.page) : 1;
        const limit = 10;
        const offset = Math.max(0, (page - 1) * limit);


        const anuncioTeste = await Anuncio.findAndCountAll({
            where: {
                [Op.and]: [
                    { codUf: req.params.uf },
                    { codCaderno: req.params.caderno },
                    { page: req.query.page },
                ],
                codAtividade: {
                    [Op.notIn]: ['ADMINISTRAÇÃO REGIONAL / PREFEITURA', "EMERGÊNCIA", "UTILIDADE PÚBLICA", "HOSPITAIS PÚBLICOS", "CÂMARA DE VEREADORES - CÂMARA DISTRITAL", "SECRETARIA DE TURISMO", "INFORMAÇÕES", "EVENTOS NA CIDADE"]  // Ignorar esse valor
                },
            },
            order: [['codAtividade', 'ASC']],
            /*  limit,
             offset, */
            attributes: ['codAnuncio', 'codAtividade', 'descAnuncio', 'descTelefone', 'descImagem', 'codDesconto', 'page'],
            include: [
                {
                    model: Atividade,
                    attributes: ['nomeAmigavel'],
                    as: 'atividadeAmigavel',
                }
            ]
        });

        const contador = await Anuncio.count({
            where: { codUf: req.params.uf, codCaderno: req.params.caderno },
        })
        //console.log("daskdaklsdjalkj", contador)

        res.json({
            success: true,
            teste: anuncioTeste,
            mosaico: 0,
            qtdaConsulta: contador,
            paginaLocalizada: req.query.page,
        });




    },
    listarTodosClassificados: async (req, res) => {

        const page = req.query.page ? parseInt(req.query.page) : 1;
        const limit = 10;
        //const offset = (page - 1) * limit;
        const offset = Math.max(0, (page - 1) * limit);


        const anuncioTeste = await Anuncio.findAll({
            where: {
                [Op.and]: [
                    { codUf: req.params.uf },
                    { codCaderno: req.params.caderno },
                    //{ page: req.query.page },
                ],
                codAtividade: {
                    [Op.notIn]: ['ADMINISTRAÇÃO REGIONAL / PREFEITURA', "EMERGÊNCIA", "UTILIDADE PÚBLICA", "HOSPITAIS PÚBLICOS", "CÂMARA DE VEREADORES - CÂMARA DISTRITAL", "SECRETARIA DE TURISMO", "INFORMAÇÕES", "EVENTOS NA CIDADE"]  // Ignorar esse valor
                },
            },
            order: [['codAtividade', 'ASC'], ['createdAt', 'DESC']],
            limit: limit,
            offset: offset,
            attributes: ['codAnuncio', 'codAtividade', 'descAnuncio', 'descTelefone', 'descImagem', 'codDesconto', 'page'],
        });

        const contador = await Caderno.findOne({
            where: { UF: req.params.uf, nomeCaderno: req.params.caderno },
            raw: true
        })
        console.log("daskdaklsdjalkj", contador)

        res.json({
            success: true,
            teste: anuncioTeste,
            mosaico: 0,
            qtdaConsulta: contador.total,
            paginaLocalizada: req.query.page,
        });




    },
    listarClassificadoGeralold3: async (req, res) => {

        const paginaAtual = req.query.page ? parseInt(req.query.page) : 1; // Página atual, padrão: 1
        const porPagina = 10; // Número de itens por página

        //const offset = (paginaAtual - 1) * porPagina;
        const offset = Math.max(0, (paginaAtual - 1) * porPagina);


        console.log("offsewt: ", offset, paginaAtual)




        // Consulta para recuperar apenas os itens da página atual
        /* var codCaderno = await Caderno.findAll({
            where: {
                //codUf: req.params.uf,
                [Op.or]: [
                    { nomeCaderno: req.params.caderno },
                    { codCaderno: req.params.caderno },
                    //{ codUf: req.params.uf }
                ]
            }
        }); */

        let codCaderno;

        if (!req.params.caderno) return;

        if (req.params.caderno == "null" || req.params.caderno == "TODO") {
            let codCaderno = await Caderno.findAll({
                where: {
                    //codUf: req.params.uf,
                    [Op.or]: [
                        { nomeCaderno: req.params.caderno },
                        { codCaderno: req.params.caderno },
                        { codUf: req.params.uf }
                    ]
                }
            });

            console.log(codCaderno, req.params.uf);

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

            console.log("debug------------------>2", [
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

        } else {
            /*        let codCaderno = await Caderno.findAll({
                       where: {
                           //codUf: req.params.uf,
                           [Op.or]: [
                               { nomeCaderno: req.params.caderno },
                               //{ codCaderno: req.params.caderno }, 
                               //{ codUf: req.params.uf }
                           ]
                       },
                       attributes: ['descImagem']
                   });  */

            console.log(codCaderno, req.params.uf);
            console.log("estreesse: ", req.params.caderno)


            /*      const anuncioChave = await Anuncio.findAll({
                     where: {
                         [Op.and]: [
                             { codUf: codCaderno[0].dataValues.UF },
                             { codCaderno: codCaderno[0].dataValues.nomeCaderno },
                         ]
     
                     },
                     order: [['codAtividade', 'ASC']], // Ordena alfabeticamente
                     attributes: ['codAtividade', 'codAnuncio']
                 }); */

            //console.log("estreesse: ", anuncioChave)


            /*        const anuncio = await Anuncio.findAndCountAll({
                       where: {
                           [Op.and]: [
                               { codUf: codCaderno[0].dataValues.UF },
                               { codCaderno: codCaderno[0].dataValues.nomeCaderno },
                           ]
       
                       },
                       order: [['codAtividade', 'ASC']], // Ordena alfabeticamente
                       limit: 10,          // Tamanho da página
                       offset: offset           // Registros ignorados
       
                   });
       
                   console.log("estreesse: ", anuncio.count, offset)
                   console.log("estreesse: ", req.params.uf)
       
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
       
                   //console.log("--------------====> ", atividades[0].dataValues)
       
                   function removerAcentosESpeciaisComRegex(str) {
                       return str
                           .replace(/[ÀÁÂÃÄÅàáâãäå]/g, 'a')
                           .replace(/[ÈÉÊËèéêë]/g, 'e')
                           .replace(/[ÌÍÎÏìíîï]/g, 'i')
                           .replace(/[ÒÓÔÕÖØòóôõöø]/g, 'o')
                           .replace(/[ÙÚÛÜùúûü]/g, 'u')
                           .replace(/[Çç]/g, 'c')
                           .replace(/[Ññ]/g, 'n')
                           .replace(/[^a-zA-Z0-9\s]/g, ''); // Remove outros caracteres especiais
                   }
       
                   const arrayClassificado = [];
       
                   for (let x in count) {
                       const anun = anuncio.rows.find(item => item.codAtividade == x);
                       const atividade = atividades.find(item => removerAcentosESpeciaisComRegex(item.atividade.toLowerCase()) == removerAcentosESpeciaisComRegex(x.toLowerCase()));
                       //const atividade = atividades.find(item => item.id == x);
       
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
       
                   console.log("debug------------------>3", [
                       { codUf: codCaderno[0].dataValues.codUf },
                       { codCaderno: codCaderno[0].dataValues.codCaderno }
                   ]);
        */


            /*            const resultado = await database.query(`
                           SELECT codAnuncio, codAtividade, 
                           CEIL(ROW_NUMBER() OVER (ORDER BY codAtividade ASC) / 10) AS 'page_number' 
                           FROM anuncio 
                           WHERE codUf = :codUf AND codCaderno = :codCaderno
                           ORDER BY codAtividade ASC
                       `, {
                           replacements: {
                               codUf: codCaderno[0].dataValues.UF,
                               codCaderno: codCaderno[0].dataValues.nomeCaderno,
                               codAnuncio: 126313
                           },
                           type: database.QueryTypes.SELECT
                       });
                       
                         
                         
                         
                         let byIndex = resultado.find(item => item.codAnuncio == 126313);
                         console.log('Resultado:', byIndex); */

            let quantidadeGeral = await Anuncio.findAndCountAll({
                where: {
                    [Op.and]: [
                        { codUf: req.params.uf },
                        { codCaderno: req.params.caderno },
                    ]
                },
                attributes: ['codAnuncio'],
                raw: true
            });



            if (req.query.unique == 'false') {
                let anuncioIdd = await Anuncio.findOne({
                    where: {
                        [Op.and]: [
                            { codUf: req.params.uf },
                            { codCaderno: req.params.caderno },
                            { codAnuncio: req.query.idd }
                        ]
                    },
                    attributes: ['page'],
                    raw: true
                });


                const anuncioTeste = await Anuncio.findAndCountAll({
                    where: {
                        [Op.and]: [
                            { codUf: req.params.uf },
                            { codCaderno: req.params.caderno },
                            { page: anuncioIdd.page }
                        ]
                    },
                    order: [['codAtividade', 'ASC']], // Ordena alfabeticamente
                    attributes: ['codAnuncio', 'codAtividade', 'descAnuncio', 'descTelefone', 'descImagem', 'page'],

                });

                res.json({
                    success: true,
                    //data: arrayClassificado,
                    teste: anuncioTeste,
                    mosaico: 0,
                    qtdaConsulta: quantidadeGeral.count,
                    paginaLocalizada: anuncioIdd.page,
                });
            } else {

                const anuncioTeste = await Anuncio.findAndCountAll({
                    where: {
                        [Op.and]: [
                            { codUf: req.params.uf },
                            { codCaderno: req.params.caderno },
                            { page: paginaAtual }
                        ]
                    },
                    order: [['codAtividade', 'ASC']], // Ordena alfabeticamente
                    attributes: ['codAnuncio', 'codAtividade', 'descAnuncio', 'descTelefone', 'descImagem', 'page'],

                });

                res.json({
                    success: true,
                    teste: anuncioTeste,
                    mosaico: 0,
                    qtdaConsulta: quantidadeGeral.count,
                    paginaLocalizada: paginaAtual
                });
            }





            /*      anuncioTeste.rows.map((item, index) => {
                     item.codAnuncio2 = anuncioChave.findIndex(position => position.codAnuncio == item.codAnuncio)
                 }) */


            //console.log(anuncioTeste)

            /*            buscarAtividade(res,{
                           success: true,
                           data: arrayClassificado,
                           teste: anuncioTeste,
                           mosaico: codCaderno[0].dataValues.descImagem
                       }, req.params.caderno, req.params.uf, atividades) */

            //let b = anuncioChave.findIndex(item => item.codAnuncio == 126313)//139964

            //console.log("-==========================> ", b)


        }

        async function buscarAtividade(res, response, caderno, uf, atividades) {
            //fetch(`${masterPath.url}/admin/anuncio/classificado/geral/${caderno}/${estado}`)

            //console.log(res, caderno)
            if (response.success) {

                const codigosAtividades = response.teste.rows.map((item) => item.codAtividade);
                const valores = [...new Set(codigosAtividades)];

                //const codigosTable = await fetch(`${masterPath.url}/atividade/6`).then(response => response.json());
                const atividadesEncontradas = atividades.filter((item) => valores.includes(item.id));

                //const arrTeste = res.data.filter((category) => category.id == res.teste.rows[0].codAtividade);

                let result = response.teste.rows.filter(category =>
                    response.data.some(anuncio => category.id === anuncio.codAtividade)
                );

                const arr = [];

                let result1 = response.data.map((category, index) => {
                    // Filtra os anúncios que correspondem à categoria atual
                    let teste = response.teste.rows.filter(anuncio => category.atividade === anuncio.codAtividade);

                    // Adiciona a nova propriedade 'kledisom' com os anúncios correspondentes
                    category.kledisom = teste;
                    teste.forEach((item) => {
                        item.codAtividade = category.atividade; //adiciona as categorias
                        arr.push(item); //salva so os anuncios
                    });

                    console.log(index)

                    // Retorna o objeto category modificado
                    return category;
                });

                //console.log(result1);

                // Atualiza o estado com os dados paginados
                /* setMinisitio({ anuncios: result1 });
                setNomeAtividade(result1); */
                if (arr.length == 100) {
                    const obj = { ...response, arr }

                    res.json(obj)
                }


                /*     if (pageNumberUnique) {
                        //console.log("arr", arr)
                        arr.sort((a, b) => a.codAtividade.localeCompare(b.codAtividade));
    
                        const itemIndex = arr.findIndex(item => item.codAnuncio == id) + 1;
    
                        const pageNumberClass = Math.ceil(itemIndex / 10);
    
                        //console.log(`pagina ${pageNumberClass}`, itemIndex);
                        
    
                    } else {
                        // paginator(arr);
                        console.log(arr)
                    } */
            }


        }




    },
    listarClassificadoGeralold2: async (req, res) => {

        const paginaAtual = req.query.page ? parseInt(req.query.page) : 1; // Página atual, padrão: 1
        const porPagina = 10; // Número de itens por página

        //const offset = (paginaAtual - 1) * porPagina;
        const offset = Math.max(0, (paginaAtual - 1) * porPagina);


        console.log("offsewt: ", offset, paginaAtual)




        // Consulta para recuperar apenas os itens da página atual
        /* var codCaderno = await Caderno.findAll({
            where: {
                //codUf: req.params.uf,
                [Op.or]: [
                    { nomeCaderno: req.params.caderno },
                    { codCaderno: req.params.caderno },
                    //{ codUf: req.params.uf }
                ]
            }
        }); */

        let codCaderno;

        if (!req.params.caderno) return;

        if (req.params.caderno == "null" || req.params.caderno == "TODO") {
            let codCaderno = await Caderno.findAll({
                where: {
                    //codUf: req.params.uf,
                    [Op.or]: [
                        { nomeCaderno: req.params.caderno },
                        { codCaderno: req.params.caderno },
                        { codUf: req.params.uf }
                    ]
                }
            });

            console.log(codCaderno, req.params.uf);

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

            console.log("debug------------------>2", [
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

        } else {
            /*   let codCaderno = await Caderno.findAll({
                  where: {
                      //codUf: req.params.uf,
                      [Op.or]: [
                          { nomeCaderno: req.params.caderno },
                          //{ codCaderno: req.params.caderno }, 
                          //{ codUf: req.params.uf }
                      ]
                  }
              }); */

            console.log(codCaderno, req.params.uf);
            console.log("estreesse: ", req.params.caderno)


            // Consultar o registro específico
            const registroId = 126331; // O ID do registro que você quer buscar


            /*      const anuncioChave = await Anuncio.findAll({
                     where: {
                         [Op.and]: [
                             { codUf: codCaderno[0].dataValues.UF },
                             { codCaderno: codCaderno[0].dataValues.nomeCaderno },
                         ]
     
                     },
                     order: [['codAtividade', 'ASC']], // Ordena alfabeticamente
                     attributes: ['codAtividade', 'codAnuncio']
                 }); */

            //console.log("estreesse: ", anuncioChave)


            /*        const anuncio = await Anuncio.findAndCountAll({
                       where: {
                           [Op.and]: [
                               { codUf: codCaderno[0].dataValues.UF },
                               { codCaderno: codCaderno[0].dataValues.nomeCaderno },
                           ]
       
                       },
                       order: [['codAtividade', 'ASC']], // Ordena alfabeticamente
                       limit: 10,          // Tamanho da página
                       offset: offset           // Registros ignorados
       
                   });
       
                   console.log("estreesse: ", anuncio.count, offset)
                   console.log("estreesse: ", req.params.uf)
       
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
       
                   //console.log("--------------====> ", atividades[0].dataValues)
       
                   function removerAcentosESpeciaisComRegex(str) {
                       return str
                           .replace(/[ÀÁÂÃÄÅàáâãäå]/g, 'a')
                           .replace(/[ÈÉÊËèéêë]/g, 'e')
                           .replace(/[ÌÍÎÏìíîï]/g, 'i')
                           .replace(/[ÒÓÔÕÖØòóôõöø]/g, 'o')
                           .replace(/[ÙÚÛÜùúûü]/g, 'u')
                           .replace(/[Çç]/g, 'c')
                           .replace(/[Ññ]/g, 'n')
                           .replace(/[^a-zA-Z0-9\s]/g, ''); // Remove outros caracteres especiais
                   }
       
                   const arrayClassificado = [];
       
                   for (let x in count) {
                       const anun = anuncio.rows.find(item => item.codAtividade == x);
                       const atividade = atividades.find(item => removerAcentosESpeciaisComRegex(item.atividade.toLowerCase()) == removerAcentosESpeciaisComRegex(x.toLowerCase()));
                       //const atividade = atividades.find(item => item.id == x);
       
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
       
                   console.log("debug------------------>3", [
                       { codUf: codCaderno[0].dataValues.codUf },
                       { codCaderno: codCaderno[0].dataValues.codCaderno }
                   ]);
        */


            /*            const resultado = await database.query(`
                           SELECT codAnuncio, codAtividade, 
                           CEIL(ROW_NUMBER() OVER (ORDER BY codAtividade ASC) / 10) AS 'page_number' 
                           FROM anuncio 
                           WHERE codUf = :codUf AND codCaderno = :codCaderno
                           ORDER BY codAtividade ASC
                       `, {
                           replacements: {
                               codUf: codCaderno[0].dataValues.UF,
                               codCaderno: codCaderno[0].dataValues.nomeCaderno,
                               codAnuncio: 126313
                           },
                           type: database.QueryTypes.SELECT
                       });
                       
                         
                         
                         
                         let byIndex = resultado.find(item => item.codAnuncio == 126313);
                         console.log('Resultado:', byIndex); */

            let quantidadeGeral = await Anuncio.findAndCountAll({
                where: {
                    [Op.and]: [
                        { codUf: req.params.uf },
                        { codCaderno: req.params.caderno },
                    ]
                },
                attributes: ['codAnuncio'],
                raw: true
            });


            if (req.query.idd && req.query.unique == false) {
                let anuncioIdd = await Anuncio.findAndCountAll({
                    where: {
                        [Op.and]: [
                            { codUf: codCaderno[0].dataValues.UF },
                            { codCaderno: codCaderno[0].dataValues.nomeCaderno },
                            { codAnuncio: req.query.idd }
                        ]
                    },
                    attributes: ['page'],
                    raw: true
                });


                const anuncioTeste = await Anuncio.findAndCountAll({
                    where: {
                        [Op.and]: [
                            { codUf: codCaderno[0].dataValues.UF },
                            { codCaderno: codCaderno[0].dataValues.nomeCaderno },
                            { page: anuncioIdd.page }
                        ]
                    },
                    order: [['codAtividade', 'ASC']], // Ordena alfabeticamente

                });

                res.json({
                    success: true,
                    data: arrayClassificado,
                    teste: anuncioTeste,
                    mosaico: codCaderno[0].dataValues.descImagem,
                    qtdaConsulta: quantidadeGeral.count,
                    paginaLocalizada: anuncioIdd.page,
                    pagina: paginaAtual
                });
            } else {

                console.log("dasdasdasdsa", 2, paginaAtual)

                let quantidadeGeral = await Anuncio.findAndCountAll({
                    where: {
                        [Op.and]: [
                            { codUf: codCaderno[0].dataValues.UF },
                            { codCaderno: codCaderno[0].dataValues.nomeCaderno },
                        ]
                    },
                    raw: true
                });

                const anuncioTeste = await Anuncio.findAndCountAll({
                    where: {
                        [Op.and]: [
                            { codUf: codCaderno[0].dataValues.UF },
                            { codCaderno: codCaderno[0].dataValues.nomeCaderno },
                            { page: 1 }
                        ]
                    },
                    order: [['codAtividade', 'ASC']], // Ordena alfabeticamente
                    /*  limit: 10,          // Tamanho da página
                     offset: offset  */
                });

                res.json({
                    success: true,
                    data: arrayClassificado,
                    teste: anuncioTeste,
                    mosaico: codCaderno[0].dataValues.descImagem,
                    qtdaConsulta: quantidadeGeral.count,
                    paginaLocalizada: paginaAtual
                });
            }





            /*      anuncioTeste.rows.map((item, index) => {
                     item.codAnuncio2 = anuncioChave.findIndex(position => position.codAnuncio == item.codAnuncio)
                 }) */


            //console.log(anuncioTeste)

            /*            buscarAtividade(res,{
                           success: true,
                           data: arrayClassificado,
                           teste: anuncioTeste,
                           mosaico: codCaderno[0].dataValues.descImagem
                       }, req.params.caderno, req.params.uf, atividades) */

            //let b = anuncioChave.findIndex(item => item.codAnuncio == 126313)//139964

            //console.log("-==========================> ", b)


        }

        async function buscarAtividade(res, response, caderno, uf, atividades) {
            //fetch(`${masterPath.url}/admin/anuncio/classificado/geral/${caderno}/${estado}`)

            //console.log(res, caderno)
            if (response.success) {

                const codigosAtividades = response.teste.rows.map((item) => item.codAtividade);
                const valores = [...new Set(codigosAtividades)];

                //const codigosTable = await fetch(`${masterPath.url}/atividade/6`).then(response => response.json());
                const atividadesEncontradas = atividades.filter((item) => valores.includes(item.id));

                //const arrTeste = res.data.filter((category) => category.id == res.teste.rows[0].codAtividade);

                let result = response.teste.rows.filter(category =>
                    response.data.some(anuncio => category.id === anuncio.codAtividade)
                );

                const arr = [];

                let result1 = response.data.map((category, index) => {
                    // Filtra os anúncios que correspondem à categoria atual
                    let teste = response.teste.rows.filter(anuncio => category.atividade === anuncio.codAtividade);

                    // Adiciona a nova propriedade 'kledisom' com os anúncios correspondentes
                    category.kledisom = teste;
                    teste.forEach((item) => {
                        item.codAtividade = category.atividade; //adiciona as categorias
                        arr.push(item); //salva so os anuncios
                    });

                    console.log(index)

                    // Retorna o objeto category modificado
                    return category;
                });

                //console.log(result1);

                // Atualiza o estado com os dados paginados
                /* setMinisitio({ anuncios: result1 });
                setNomeAtividade(result1); */
                if (arr.length == 100) {
                    const obj = { ...response, arr }

                    res.json(obj)
                }


                /*     if (pageNumberUnique) {
                        //console.log("arr", arr)
                        arr.sort((a, b) => a.codAtividade.localeCompare(b.codAtividade));
    
                        const itemIndex = arr.findIndex(item => item.codAnuncio == id) + 1;
    
                        const pageNumberClass = Math.ceil(itemIndex / 10);
    
                        //console.log(`pagina ${pageNumberClass}`, itemIndex);
                        
    
                    } else {
                        // paginator(arr);
                        console.log(arr)
                    } */
            }


        }




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
    buscarAnuncioIdpublic: async (req, res) => {
        //await database.sync();
        //const nu_hash = req.params.id;
        const nu_hash = req.query.search;
        console.log(nu_hash);


        const paginaAtual = req.query.page ? parseInt(req.query.page) : 1; // Página atual, padrão: 1
        const porPagina = 10; // Número de itens por página
        const offset = (paginaAtual - 1) * porPagina;



        //verificação
        const contemNumero = () => /\d/.test(nu_hash);


        //ANUNCIO
        const resultAnuncio = await Anuncio.findAll({
            where: {
                descCPFCNPJ: nu_hash,
                /* codUf: "AL" */
            },
            attributes: ['codAnuncio', 'descAnuncio', 'createdAt', 'updatedAt', 'dueDate', 'codUf', 'codCaderno'],
            raw: false,
            limit: porPagina,
            offset: offset
        });

        const resultUser = await Usuarios.findAll({
            where: {
                descCPFCNPJ: nu_hash,
                /* codUf: "AL" */
            },
            attributes: ['codTipoUsuario'],
            raw: false
        });

        console.table([1, "id", nu_hash])

        if (resultAnuncio.length > 0) {
            /*  await Promise.all(resultAnuncio.map(async (anun, i) => {
             
 
                 const user = await anun.getUsuario();
 
                 if (user) {
                     anun.codUsuario = user.descNome;
                     anun.dataValues.loginUser = user.descCPFCNPJ;
                     anun.dataValues.loginPass = user.senha;
                     anun.dataValues.loginEmail = user.descEmail;
                     anun.dataValues.loginContato = user.descTelefone;
                 }
 
             })); */

            /*    const resultAnuncioCount = await Anuncio.count({
                   where: {
                       [Op.or]: [
                           { codAnuncio: nu_hash },
                           { descCPFCNPJ: nu_hash },
                           { codDesconto: nu_hash },
                           { codUf: nu_hash }
                       ]
                   },
               });
   
               const totalItens = resultAnuncioCount;
               const totalPaginas = Math.ceil(totalItens / porPagina); */

            res.json({
                success: true,
                message: {
                    anuncios: resultAnuncio,
                    role: resultUser
                    // Itens da página atual
                    /*   paginaAtual: paginaAtual,
                      totalPaginas: totalPaginas,
                      totalItem: totalItens */
                },

            });

        } else {
            const resultUser = await Usuarios.findAll({
                where: {
                    descCPFCNPJ: nu_hash,
                    /* codUf: "AL" */
                },
                attributes: ['codTipoUsuario'],
                raw: false
            });

            res.json({
                success: false,
                message: { role: resultUser }
            });
        }



    },
    buscarAnuncioId: async (req, res) => {

        console.log(req.query.search, req.query.require)
        //const nu_hash = req.params.id;
        const nu_hash = req.query.search;
        const requisito = req.query.require;
        const estado = req.query.uf;
        const caderno = req.query.caderno

        const paginaAtual = req.query.page ? parseInt(req.query.page) : 1; // Página atual, padrão: 1
        const porPagina = 10; // Número de itens por página
        const offset = (paginaAtual - 1) * porPagina;

        if (!requisito) return;


        if (requisito === 'codCaderno') {
            buscaPorCaderno();
        } else if (requisito === 'descAnuncio') {
            buscaPorNome();
        } else if (requisito === 'codUf') {
            buscaUf();
        } else {
            buscaNormal();
        }

        //verificação
        async function buscaPorCaderno() {
            console.time('espaco')
            const resultAnuncio = await Anuncio.findAll({
                where: {
                    //[requisito]: nu_hash
                    codUf: estado,
                    codCaderno: caderno
                },
                limit: porPagina,
                offset: offset,
                attributes: [
                    'codAnuncio',
                    'codOrigem',
                    'codDuplicado',
                    'descCPFCNPJ',
                    'descAnuncio',
                    'codTipoAnuncio',
                    'codCaderno',
                    'codUf',
                    'activate',
                    'descPromocao',
                    'createdAt',
                    'dueDate',
                    'codDesconto',
                    'codAtividade',
                    'periodo'
                ],
                include: {
                    model: Pagamento,
                    as: "pagamentos",  // Nome definido no `hasMany`
                    attributes: ["id", "valor", "status", "data"]
                }
            });
            console.timeEnd("espaco")
            console.table([1, "id", nu_hash])

            if (resultAnuncio.length < 1) return res.json({ success: false, message: 'Não encontrado' });

            if (resultAnuncio.length > 0) {
                await Promise.all(resultAnuncio.map(async (anun, i) => {

                    const cader = await anun.getCaderno();
                    anun.codCaderno = cader ? cader.nomeCaderno : "não registrado";

                    //const estado = await anun.getUf();
                    //anun.codUf = estado.sigla_uf;

                    const desconto = await anun.getDesconto();
                    anun.codPA = desconto != undefined ? desconto.hash : "99.999.9999";

                    const user = await anun.getUsuario();

                    if (user) {
                        anun.codUsuario = user.descNome;
                        anun.dataValues.loginUser = user.descCPFCNPJ;
                        anun.dataValues.loginPass = user.senha;
                        anun.dataValues.loginEmail = user.descEmail;
                        anun.dataValues.loginContato = user.descTelefone;
                    }

                }));


                const consultarRegistros = await Cadernos.findAll({
                    where: {
                        //nomeCaderno: { [Op.like]: `${nu_hash}%` }
                        nomeCaderno: caderno
                    },
                    raw: true,
                    attributes: ['total']
                })

                if (consultarRegistros.length < 1) return res.json({ success: false, message: 'Não encontrado' });

                const totalItens = consultarRegistros[0].total;
                const totalPaginas = Math.ceil(totalItens / porPagina);

                res.json({
                    success: true,
                    message: {
                        anuncios: resultAnuncio, // Itens da página atual
                        paginaAtual: paginaAtual,
                        totalPaginas: totalPaginas,
                        totalItem: totalItens
                    }
                });
                return;


            }
        }
        async function buscaPorNome() {

            const whereClause = {
                [requisito]: { [Op.like]: `${nu_hash}%` },
            }

            if (estado != 'todos' && estado != 'null') {
                whereClause.codUf = estado;
            }

            if (caderno != 'todos' && caderno != 'null') {
                whereClause.codCaderno = caderno;
            }

            const resultAnuncio = await Anuncio.findAll({
                where: whereClause/* {
                    [requisito]: { [Op.like]: `${nu_hash}%` },
                    codUf: estado,
                    codCaderno: caderno
                } */,
                limit: porPagina,
                offset: offset,
                attributes: [
                    'codAnuncio',
                    'codOrigem',
                    'codDuplicado',
                    'descCPFCNPJ',
                    'descAnuncio',
                    'codTipoAnuncio',
                    'codCaderno',
                    'codUf',
                    'activate',
                    'descPromocao',
                    'createdAt',
                    'dueDate',
                    'codDesconto',
                    'codAtividade',
                    'periodo'
                ],
                include: {
                    model: Pagamento,
                    as: "pagamentos",  // Nome definido no `hasMany`
                    attributes: ["id", "valor", "status", "data"]
                }
            });

            console.table([1, "idnome", nu_hash])

            if (resultAnuncio.length < 1) return res.json({ success: false, message: 'Não encontrado' });

            if (resultAnuncio.length > 0) {
                await Promise.all(resultAnuncio.map(async (anun, i) => {

                    const cader = await anun.getCaderno();
                    anun.codCaderno = cader ? cader.nomeCaderno : "não registrado";

                    //const estado = await anun.getUf();
                    //anun.codUf = estado.sigla_uf;

                    const desconto = await anun.getDesconto();
                    anun.codPA = desconto != undefined ? desconto.hash : "99.999.9999";

                    const user = await anun.getUsuario();

                    if (user) {
                        anun.codUsuario = user.descNome;
                        anun.dataValues.loginUser = user.descCPFCNPJ;
                        anun.dataValues.loginPass = user.senha;
                        anun.dataValues.loginEmail = user.descEmail;
                        anun.dataValues.loginContato = user.descTelefone;
                    }

                }));

                const resultAnuncioCount = await Anuncio.count({
                    where: {
                        [requisito]: nu_hash
                    },
                });

                const totalItens = resultAnuncioCount;
                const totalPaginas = Math.ceil(totalItens / porPagina);

                res.json({
                    success: true,
                    message: {
                        anuncios: resultAnuncio, // Itens da página atual
                        paginaAtual: paginaAtual,
                        totalPaginas: totalPaginas,
                        totalItem: totalItens
                    }
                });
                return;


            }
        }
        async function buscaNormal() {

            const whereClause = {
                [requisito]: nu_hash,
            }

            if (estado != 'todos' && estado != 'null') {
                whereClause.codUf = estado;
            }

            if (caderno != 'todos' && caderno != 'null') {
                whereClause.codCaderno = caderno;
            }

            const resultAnuncio = await Anuncio.findAll({
                where: whereClause,
                limit: porPagina,
                offset: offset,
                attributes: [
                    'codAnuncio',
                    'codOrigem',
                    'codDuplicado',
                    'descCPFCNPJ',
                    'descAnuncio',
                    'codTipoAnuncio',
                    'codCaderno',
                    'codUf',
                    'activate',
                    'descPromocao',
                    'createdAt',
                    'dueDate',
                    'codDesconto',
                    'codAtividade',
                    'periodo'
                ],
                include: {
                    model: Pagamento,
                    as: "pagamentos",  // Nome definido no `hasMany`
                    attributes: ["id", "valor", "status", "data"]
                }
            });

            console.table([1, "id", nu_hash])
            if (resultAnuncio.length < 1) return res.json({ success: false, message: 'Não encontrado' });

            if (resultAnuncio.length > 0) {
                await Promise.all(resultAnuncio.map(async (anun, i) => {

                    const cader = await anun.getCaderno();
                    anun.codCaderno = cader ? cader.nomeCaderno : "não registrado";

                    //const estado = await anun.getUf();
                    //anun.codUf = estado.sigla_uf;

                    const desconto = await anun.getDesconto();
                    anun.codPA = desconto != undefined ? desconto.hash : "99.999.9999";

                    const user = await anun.getUsuario();

                    if (user) {
                        anun.codUsuario = user.descNome;
                        anun.dataValues.loginUser = user.descCPFCNPJ;
                        anun.dataValues.loginPass = user.senha;
                        anun.dataValues.loginEmail = user.descEmail;
                        anun.dataValues.loginContato = user.descTelefone;
                    }

                }));

                const resultAnuncioCount = await Anuncio.count({
                    where: whereClause/* {
                        [requisito]: nu_hash
                    } */,
                });

                const totalItens = resultAnuncioCount;
                const totalPaginas = Math.ceil(totalItens / porPagina);

                res.json({
                    success: true,
                    message: {
                        anuncios: resultAnuncio, // Itens da página atual
                        paginaAtual: paginaAtual,
                        totalPaginas: totalPaginas,
                        totalItem: totalItens
                    }
                });
                return;


            }
        }
        async function buscaUf() {

            const resultAnuncio = await Anuncio.findAll({
                where: {
                    [requisito]: nu_hash,
                    codUf: estado,
                },
                limit: porPagina,
                offset: offset,
                attributes: [
                    'codAnuncio',
                    'codOrigem',
                    'codDuplicado',
                    'descCPFCNPJ',
                    'descAnuncio',
                    'codTipoAnuncio',
                    'codCaderno',
                    'codUf',
                    'activate',
                    'descPromocao',
                    'createdAt',
                    'dueDate',
                    'codDesconto',
                    'codAtividade',
                    'periodo'
                ],
                include: {
                    model: Pagamento,
                    as: "pagamentos",  // Nome definido no `hasMany`
                    attributes: ["id", "valor", "status", "data"]
                }
            });

            console.table([1, "id", nu_hash])
            if (resultAnuncio.length < 1) return res.json({ success: false, message: 'Não encontrado' });

            if (resultAnuncio.length > 0) {
                await Promise.all(resultAnuncio.map(async (anun, i) => {

                    const cader = await anun.getCaderno();
                    anun.codCaderno = cader ? cader.nomeCaderno : "não registrado";

                    //const estado = await anun.getUf();
                    //anun.codUf = estado.sigla_uf;

                    const desconto = await anun.getDesconto();
                    anun.codPA = desconto != undefined ? desconto.hash : "99.999.9999";

                    const user = await anun.getUsuario();

                    if (user) {
                        anun.codUsuario = user.descNome;
                        anun.dataValues.loginUser = user.descCPFCNPJ;
                        anun.dataValues.loginPass = user.senha;
                        anun.dataValues.loginEmail = user.descEmail;
                        anun.dataValues.loginContato = user.descTelefone;
                    }

                }));

                const resultAnuncioCount = await Anuncio.count({
                    where: {
                        [requisito]: nu_hash,
                        codUf: estado,
                    },
                });

                const totalItens = resultAnuncioCount;
                const totalPaginas = Math.ceil(totalItens / porPagina);

                res.json({
                    success: true,
                    message: {
                        anuncios: resultAnuncio, // Itens da página atual
                        paginaAtual: paginaAtual,
                        totalPaginas: totalPaginas,
                        totalItem: totalItens
                    },
                    data: "kl"
                });
                return;


            }
        }

    },
    buscarAnuncioIdold: async (req, res) => {

        console.log(req.query.search, req.query.require)
        //const nu_hash = req.params.id;
        const nu_hash = req.query.search;
        const requisito = req.query.require;

        const paginaAtual = req.query.page ? parseInt(req.query.page) : 1; // Página atual, padrão: 1
        const porPagina = 10; // Número de itens por página
        const offset = (paginaAtual - 1) * porPagina;

        if (!requisito) return;


        if (requisito === 'codCaderno') {
            buscaPorCaderno();
        } else if (requisito === 'descAnuncio') {
            buscaPorNome();
        } else {
            buscaNormal();
        }

        //verificação
        async function buscaPorCaderno() {
            console.time('espaco')
            const resultAnuncio = await Anuncio.findAll({
                where: {
                    [requisito]: nu_hash
                },
                limit: porPagina,
                offset: offset,
                attributes: [
                    'codAnuncio',
                    'codOrigem',
                    'codDuplicado',
                    'descCPFCNPJ',
                    'descAnuncio',
                    'codTipoAnuncio',
                    'codCaderno',
                    'codUf',
                    'activate',
                    'descPromocao',
                    'createdAt',
                    'dueDate',
                    'codDesconto',
                    'codAtividade',
                    'periodo'
                ],
                include: {
                    model: Pagamento,
                    as: "pagamentos",  // Nome definido no `hasMany`
                    attributes: ["id", "valor", "status", "data"]
                }
            });
            console.timeEnd("espaco")
            console.table([1, "id", nu_hash])

            if (resultAnuncio.length < 1) return res.json({ success: false, message: 'Não encontrado' });

            if (resultAnuncio.length > 0) {
                await Promise.all(resultAnuncio.map(async (anun, i) => {

                    const cader = await anun.getCaderno();
                    anun.codCaderno = cader ? cader.nomeCaderno : "não registrado";

                    //const estado = await anun.getUf();
                    //anun.codUf = estado.sigla_uf;

                    const desconto = await anun.getDesconto();
                    anun.codPA = desconto != undefined ? desconto.hash : "99.999.9999";

                    const user = await anun.getUsuario();

                    if (user) {
                        anun.codUsuario = user.descNome;
                        anun.dataValues.loginUser = user.descCPFCNPJ;
                        anun.dataValues.loginPass = user.senha;
                        anun.dataValues.loginEmail = user.descEmail;
                        anun.dataValues.loginContato = user.descTelefone;
                    }

                }));


                const consultarRegistros = await Cadernos.findAll({
                    where: {
                        nomeCaderno: { [Op.like]: `${nu_hash}%` }
                    },
                    raw: true,
                    attributes: ['total']
                })

                const totalItens = consultarRegistros[0].total;
                const totalPaginas = Math.ceil(totalItens / porPagina);

                res.json({
                    success: true,
                    message: {
                        anuncios: resultAnuncio, // Itens da página atual
                        paginaAtual: paginaAtual,
                        totalPaginas: totalPaginas,
                        totalItem: totalItens
                    }
                });
                return;


            }
        }
        async function buscaPorNome() {

            const resultAnuncio = await Anuncio.findAll({
                where: {
                    [requisito]: { [Op.like]: `${nu_hash}%` }
                },
                limit: porPagina,
                offset: offset,
                attributes: [
                    'codAnuncio',
                    'codOrigem',
                    'codDuplicado',
                    'descCPFCNPJ',
                    'descAnuncio',
                    'codTipoAnuncio',
                    'codCaderno',
                    'codUf',
                    'activate',
                    'descPromocao',
                    'createdAt',
                    'dueDate',
                    'codDesconto',
                    'codAtividade',
                    'periodo'
                ],
                include: {
                    model: Pagamento,
                    as: "pagamentos",  // Nome definido no `hasMany`
                    attributes: ["id", "valor", "status", "data"]
                }
            });

            console.table([1, "idnome", nu_hash])

            if (resultAnuncio.length < 1) return res.json({ success: false, message: 'Não encontrado' });

            if (resultAnuncio.length > 0) {
                await Promise.all(resultAnuncio.map(async (anun, i) => {

                    const cader = await anun.getCaderno();
                    anun.codCaderno = cader ? cader.nomeCaderno : "não registrado";

                    //const estado = await anun.getUf();
                    //anun.codUf = estado.sigla_uf;

                    const desconto = await anun.getDesconto();
                    anun.codPA = desconto != undefined ? desconto.hash : "99.999.9999";

                    const user = await anun.getUsuario();

                    if (user) {
                        anun.codUsuario = user.descNome;
                        anun.dataValues.loginUser = user.descCPFCNPJ;
                        anun.dataValues.loginPass = user.senha;
                        anun.dataValues.loginEmail = user.descEmail;
                        anun.dataValues.loginContato = user.descTelefone;
                    }

                }));

                const resultAnuncioCount = await Anuncio.count({
                    where: {
                        [requisito]: nu_hash
                    },
                });

                const totalItens = resultAnuncioCount;
                const totalPaginas = Math.ceil(totalItens / porPagina);

                res.json({
                    success: true,
                    message: {
                        anuncios: resultAnuncio, // Itens da página atual
                        paginaAtual: paginaAtual,
                        totalPaginas: totalPaginas,
                        totalItem: totalItens
                    }
                });
                return;


            }
        }
        async function buscaNormal() {

            const resultAnuncio = await Anuncio.findAll({
                where: {
                    [requisito]: nu_hash
                },
                limit: porPagina,
                offset: offset,
                attributes: [
                    'codAnuncio',
                    'codOrigem',
                    'codDuplicado',
                    'descCPFCNPJ',
                    'descAnuncio',
                    'codTipoAnuncio',
                    'codCaderno',
                    'codUf',
                    'activate',
                    'descPromocao',
                    'createdAt',
                    'dueDate',
                    'codDesconto',
                    'codAtividade',
                    'periodo'
                ],
                include: {
                    model: Pagamento,
                    as: "pagamentos",  // Nome definido no `hasMany`
                    attributes: ["id", "valor", "status", "data"]
                }
            });

            console.table([1, "id", nu_hash])
            if (resultAnuncio.length < 1) return res.json({ success: false, message: 'Não encontrado' });

            if (resultAnuncio.length > 0) {
                await Promise.all(resultAnuncio.map(async (anun, i) => {

                    const cader = await anun.getCaderno();
                    anun.codCaderno = cader ? cader.nomeCaderno : "não registrado";

                    //const estado = await anun.getUf();
                    //anun.codUf = estado.sigla_uf;

                    const desconto = await anun.getDesconto();
                    anun.codPA = desconto != undefined ? desconto.hash : "99.999.9999";

                    const user = await anun.getUsuario();

                    if (user) {
                        anun.codUsuario = user.descNome;
                        anun.dataValues.loginUser = user.descCPFCNPJ;
                        anun.dataValues.loginPass = user.senha;
                        anun.dataValues.loginEmail = user.descEmail;
                        anun.dataValues.loginContato = user.descTelefone;
                    }

                }));

                const resultAnuncioCount = await Anuncio.count({
                    where: {
                        [requisito]: nu_hash
                    },
                });

                const totalItens = resultAnuncioCount;
                const totalPaginas = Math.ceil(totalItens / porPagina);

                res.json({
                    success: true,
                    message: {
                        anuncios: resultAnuncio, // Itens da página atual
                        paginaAtual: paginaAtual,
                        totalPaginas: totalPaginas,
                        totalItem: totalItens
                    }
                });
                return;


            }
        }

        return;

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


            if (resultID < 1) {
                //res.json({ success: false, message: "anúncio não encontrado" });
                //return;
            } else {
                const descId = resultID[0].idDesconto;
                const resultAnuncio = await Anuncio.findAll({
                    where: {
                        codDesconto: nu_hash
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

        //buscar por nome de perfil
        if (resultAnuncio < 1) {
            //console.log(nu_hash)
            const resultID = await Usuarios.findAll({
                where: {
                    descNome: { [Op.like]: `%${nu_hash}%` }
                    //descNome: nu_hash
                }
            });


            if (resultID < 1) {
                res.json({ success: false, message: "anúncio não encontrado" });
                return;
            } else {
                //const descId = resultID[0].idDesconto;
                const resultAnuncio = await Anuncio.findAll({
                    where: {
                        codUsuario: resultID[0].codUsuario
                    },
                    limit: porPagina,
                    offset: offset
                });

                const resultAnuncioCount = await Anuncio.count({
                    where: {
                        codUsuario: resultID[0].codUsuario
                    }
                });

                if (resultAnuncioCount < 1) {
                    res.json({ success: false, message: "anúncio não encontrado" });
                    return;
                }

                // Número total de itens
                const totalItens = resultAnuncioCount;
                // Número total de páginas
                const totalPaginas = Math.ceil(totalItens / porPagina);

                //console.log("dasjfhsjklfsfhlksajhfdsaklfjhsjkfd", resultAnuncio, resultID[0].codUsuario)
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

                });




            }
        }


    },
    listarAnuncioId: async (req, res) => {

        const uuid = req.params.id;

        //IDS
        const resultAnuncio = await Anuncio.findAll({
            where: {
                codAnuncio: uuid
            },
            include: [
                {
                    model: Promocao,
                    as: 'promoc',
                    attributes: ['data_validade', 'banner']
                }
            ]
        });

        // Verifica se o resultado está vazio
        if (resultAnuncio.length === 0) {
            return res.status(404).json({ message: 'Anúncio não encontrado' });
        }

        let obj = resultAnuncio[0];

        const user = await obj.getUsuario();
        obj.codUsuario = user.descNome;
        console.log(user)



        /*     const atividade = await obj.getAtividade();
            const descontoHash = await obj.getDesconto(); */
        //obj.codAtividade = atividade != null ? atividade.id : '';

        obj.setDataValue('nomeAtividade', obj.codAtividade);
        obj.setDataValue('hash', obj.codDesconto);
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
            cartao_digital,
            descYouTube } = req.body;


        const dadosAnuncio = {
            //"codAnuncio": 88888,
            "codUsuario": 88,//codigoUsuario[0].codUsuario,
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
            "descDescricao": "",
            "descSite": "",
            "descSkype": "",
            "descPromocao": descPromocao || 0,//codigoDeDesconto.length > 0 ? codigoDeDesconto[0].desconto : '0',
            "descEmailComercial": descEmailComercial,
            "descEmailRetorno": descEmailRetorno,
            "descFacebook": "",
            "descTweeter": "",
            "descWhatsApp": descWhatsApp,
            "descCEP": descCEP,
            "descTipoPessoa": descTipoPessoa,
            "descCPFCNPJ": descCPFCNPJ,
            "descNomeAutorizante": descNomeAutorizante,
            "descEmailAutorizante": descEmailAutorizante,
            "codDesconto": codDesconto || '00.000.0000',//codigoDeDesconto.length > 0 ? codigoDeDesconto[0].idDesconto : '00.000.0000',
            "descLat": 0,
            "descLng": 0,
            "formaPagamento": 0,
            "promocaoData": 0,
            "descContrato": 0,
            "descAndroid": "",
            "descApple": "",
            "descInsta": "",
            "descPatrocinador": 0,
            "descPatrocinadorLink": 0,
            "qntVisualizacoes": 0,
            "activate": 0,
            //"dtCadastro": dataNow(),
            "dtCadastro2": dtCadastro2,
            "dtAlteracao": Date.now(),
            "descLinkedin": "",
            "descTelegram": "",
            "certificado_logo": "",
            "certificado_texto": "",
            "certificado_imagem": "",
            "link_comprar": "",
            "cashback_logo": "",
            "cashback_link": "",
            "certificado_link": "",
            "cartao_digital": "",
            "descYouTube": descYouTube,
        };

        function registarTags(id) {
            console.log("chamando tags")
            JSON.parse(tags).map(async item => {
                console.log(item)
                const createTags = await Tags.create({
                    codAnuncio: id,
                    tagValue: item
                })

            })
        };

        try {
            const listaAnuncios = await Anuncio.create(dadosAnuncio);

            registarTags(listaAnuncios.dataValues.codAnuncio)

            console.log(`Reorganização concluída para o estado:`, { estado: dadosAnuncio.codUf, caderno: dadosAnuncio.codCaderno });
            if (codTipoAnuncio == 3) {
                const idUtilizado = await Desconto.update({
                    //utilizar_saldo: codigoDeDesconto[0].utilizar_saldo + 1,
                    saldo: Sequelize.literal('saldo - 1')//codigoDeDesconto[0].saldo - 1

                }, {
                    where: {
                        hash: codDesconto
                    }
                })
            }


            if (codTipoAnuncio == 1) {
                await Caderno.increment('basico', {
                    where: {
                        UF: dadosAnuncio.codUf,
                        nomeCaderno: dadosAnuncio.codCaderno
                    }
                });
            } else if (codTipoAnuncio == 3) {
                await Caderno.increment('completo', {
                    where: {
                        UF: dadosAnuncio.codUf,
                        nomeCaderno: dadosAnuncio.codCaderno
                    }
                });
            }

            await Caderno.increment('total', {
                where: {
                    UF: dadosAnuncio.codUf,
                    nomeCaderno: dadosAnuncio.codCaderno
                }
            });

            res.json({ success: true, message: listaAnuncios }); // Envia a resposta primeiro

            // Executa a query em segundo plano

            try {
                const query = `UPDATE anuncio
                        JOIN (
                            SELECT codAnuncio, 
                                CEIL(ROW_NUMBER() OVER (ORDER BY codAtividade ASC, createdAt DESC) / 10) AS 'page_number'
                            FROM anuncio
                            WHERE codUf = :estado AND codCaderno = :caderno
                        ) AS temp
                        ON anuncio.codAnuncio = temp.codAnuncio
                        SET anuncio.page = temp.page_number
                        WHERE anuncio.codUf = :estado AND anuncio.codCaderno = :caderno
                    `;

                database.query(query, {
                    replacements: { estado: dadosAnuncio.codUf, caderno: dadosAnuncio.codCaderno },
                    type: Sequelize.QueryTypes.UPDATE,
                });

                console.log(`Reorganização concluída para o estado:`, dadosAnuncio.codUf);
            } catch (error) {
                console.error("Erro ao executar a reorganização:", error);
            }


            /*   if (listaAnuncios) {
                  const query = `UPDATE anuncio
                  JOIN (
                      SELECT codAnuncio, 
                          CEIL(ROW_NUMBER() OVER (ORDER BY codAtividade ASC, createdAt DESC) / 10) AS 'page_number'
                      FROM anuncio
                      WHERE codUf = :estado AND codCaderno = :caderno
                  ) AS temp
                  ON anuncio.codAnuncio = temp.codAnuncio
                  SET anuncio.page = temp.page_number
                  WHERE anuncio.codUf = :estado AND anuncio.codCaderno = :caderno
               `;
  
                  await database.query(query, {
                      replacements: { estado: dadosAnuncio.codUf, caderno: dadosAnuncio.codCaderno }, // Substitui o parâmetro :estado
                      type: Sequelize.QueryTypes.UPDATE, // Define o tipo de query
                  });
                  console.log(`Reorganização concluída para o estado:`);
              }
  
  
  
              res.json({ success: true, message: listaAnuncios }) */
        } catch (err) {
            console.log(err)
            res.json({ success: false, message: err, ter: codTipoAnuncio })
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
            descParceiro,
            descParceiroLink,
            codDesconto,
            descLat,
            descLng,
            formaPagamento,
            logoPromocao,
            linkPromo,
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
            cartao_digital,
            descDonoPix,
            descChavePix,
            descYouTube,
            periodo,
            dueDate
        } = req.body;

        const dadosAnuncio = {
            //"codAnuncio": 88888,
            //"codUsuario": codigoUsuario[0].codUsuario,
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
            "descImagem": descImagem || 0,
            "descEndereco": descEndereco,
            "descTelefone": descTelefone,
            "descCelular": descCelular,
            "descDescricao": descDescricao,
            "descSite": descSite,
            "descSkype": descSkype,
            //"descPromocao": codigoDeDesconto.length > 0 ? codigoDeDesconto[0].desconto : '0',
            "descEmailComercial": descEmailComercial,
            "descEmailRetorno": descEmailRetorno,
            "descFacebook": descFacebook,
            "descTweeter": descTweeter,
            "descWhatsApp": descWhatsApp,
            "descCEP": descCEP,
            "descTipoPessoa": descTipoPessoa,
            "descCPFCNPJ": descCPFCNPJ,
            "descNomeAutorizante": descNomeAutorizante,
            "descEmailAutorizante": descEmailAutorizante,
            "descParceiro": descParceiro,
            "descParceiroLink": descParceiroLink,
            //"codDesconto": codigoDeDesconto.length > 0 ? codigoDeDesconto[0].idDesconto : '00.000.0000',
            "descLat": 0,
            "descLng": 0,
            "formaPagamento": 0,
            "logoPromocao": logoPromocao,
            "linkPromo": linkPromo || 'null',
            "promocaoData": promocaoData,
            "descContrato": 0,
            "descAndroid": descAndroid,
            "descApple": descApple,
            "descInsta": descInsta,
            "descPatrocinador": 0,
            "descPatrocinadorLink": 0,
            /* "qntVisualizacoes": 0, */
            "activate": 1,
            /*    "dtCadastro": dataNow(),
               "dtCadastro2": "2012-12-27T16:22:44.000Z", */
            "dtAlteracao": dataNow(),
            "descLinkedin": descLinkedin,
            "descTelegram": descTelegram,
            "certificado_logo": certificado_logo,
            "certificado_texto": certificado_texto,
            "certificado_imagem": certificado_imagem,
            "descYouTube": descYouTube,
            "link_comprar": link_comprar,
            "cashback_logo": cashback_logo,
            "cashback_link": cashback_link,
            "certificado_link": certificado_link,
            "cartao_digital": cartao_digital,
            "descDonoPix": descDonoPix,
            "descChavePix": descChavePix,
            "periodo": periodo,
            "dueDate": dueDate || null
        };
        console.log(dadosAnuncio)

        const idAnuncio = req.query.id;

        console.log(idAnuncio,
            logoPromocao,
            linkPromo,
            promocaoData)

        const promocaoExistente = await Promocao.findOne({
            where: {
                codAnuncio: idAnuncio,
                //link_externo: linkPromo,
                //data_validade: promocaoData,
            },
        });

        if (promocaoExistente) {
            const atualizarPromocao = await Promocao.update({
                data_validade: promocaoData,
            }, {
                where: {
                    codAnuncio: idAnuncio
                }
            });
        }

        if (!promocaoExistente) {
            if (logoPromocao != '' && promocaoData != '') {
                const criarPromocao = await Promocao.create({
                    codAnuncio: idAnuncio,
                    banner: logoPromocao || "",
                    link_externo: linkPromo,
                    data_validade: promocaoData,
                    uf: codUf,
                    caderno: codCaderno
                });
            }
            /*             if (linkPromo != '' && promocaoData != '') {
                            const criarPromocao = await Promocao.create({
                                codAnuncio: idAnuncio,
                                banner: logoPromocao,
                                link_externo: linkPromo,
                                data_validade: promocaoData,
                                uf: codUf,
                                caderno: codCaderno
                            });
                        } */

        }


        try {
            const listaAnuncios = await Anuncio.update(dadosAnuncio, {
                where: {
                    codAnuncio: req.query.id
                }
            });

            try {
                const parsedTags = JSON.parse(tags);

                // Remove tags antigas
                await Tags.destroy({
                    where: { codAnuncio: req.query.id }
                });

                // Insere novas tags
                const novaLista = parsedTags.map(tag => ({
                    codAnuncio: req.query.id,
                    tagValue: tag
                }));

                await Tags.bulkCreate(novaLista);

            } catch (err) {
                console.log("Erro ao atualizar promoções", err)
            }



            res.json({ success: true, message: listaAnuncios })
        } catch (err) {
            console.log(err)
            res.json({ success: false, message: err })
        }
    },
    atualizarTipoPerfil: async (req, res) => {
        const atualizarPerfil = await Anuncio.update(req.body, {
            where: {
                codAnuncio: req.body.codAnuncio
            },
            raw: true
        });

        res.json({ success: true, message: atualizarPerfil });
    },
    deleteAnuncio: async (req, res) => {
        const uuid = req.params.id;
        const type = req.query.type;

        if (type == "dup") {
            const ufAnuncio = await Anuncio.findAll({
                where: {
                    codAnuncio: uuid
                },
                attributes: ['codUf', 'codCaderno', 'descAnuncio'],
                raw: true
            })

            console.log(ufAnuncio)

            /*         const result = await database.query(
                        `
                    DELETE FROM anuncio 
                    WHERE CAST(codDuplicado AS UNSIGNED) > 0 
                      AND descAnuncio = 'empresa 13'
                  `,
                        {
                            type: Sequelize.QueryTypes.DELETE,
                            replacements: { descAnuncio: ufAnuncio[0].descAnuncio }
                        }
                    );
                    //res.json({ success: true, message: uuid });
                    console.log(result)
        
                    if (result && result.affectedRows > 0) {
                        // MySQL/MariaDB
                        res.json({ success: true, message: `${result.affectedRows} anúncio(s) deletado(s)` });
                    } */

            const deletedCount = await Anuncio.destroy({
                where: {
                    codDuplicado: {
                        [Sequelize.Op.gt]: 0
                    },
                    descAnuncio: ufAnuncio[0].descAnuncio
                }
            });

            console.log(`Registros deletados: ${deletedCount}`);
            res.json({ success: true, message: `${deletedCount} perfil(s) deletado(s)` });


            return;
        }

        let registro = await Anuncio.findAll({
            where: {
                codAnuncio: uuid
            },
            raw: true
        });



        /*     let codigoDeDesconto = await Descontos.findAll({
                where: {
                    idDesconto: registro[0].codDesconto
                }
            }); */

        ///console.log("dasfjdsfshdljh", codigoDeDesconto[0].hash)

        try {

            const tipoAnuncio = registro[0].codTipoAnuncio;
            const uf = registro[0].codUf;
            const caderno = registro[0].codCaderno;


            //Anuncios
            const deleteAnuncio = await Anuncio.destroy({
                where: {
                    codAnuncio: uuid
                }

            });

            if (tipoAnuncio == 1) {
                await Caderno.decrement('basico', {
                    where: {
                        UF: uf,
                        nomeCaderno: caderno
                    }
                });
            } else if (tipoAnuncio == 3) {
                await Caderno.decrement('completo', {
                    where: {
                        UF: uf,
                        nomeCaderno: caderno
                    }
                });
            }

            await Caderno.decrement('total', {
                where: {
                    UF: uf,
                    nomeCaderno: caderno
                }
            });


            /* 
                        const idUtilizado = await Desconto.update({
                            utilizar_saldo: codigoDeDesconto[0].utilizar_saldo - 1,
                            //saldo: codigoDeDesconto[0].saldo - 1
            
                        },{
                            where: {
                                hash: codigoDeDesconto[0].hash
                            }
                        }) */


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
    quantidadeUf: async (req, res) => {



        const resultados = await Anuncio.findAll({
            attributes: [
                "codUf",
                [Sequelize.fn("COUNT", Sequelize.col("codUf")), "total"]
            ],
            group: ["codUf"],
            raw: true
        });

        // Mapear os resultados com os nomes dos estados
        const estadosBrasil = [
            { sigla: "AC", nome: "Acre" },
            { sigla: "AL", nome: "Alagoas" },
            { sigla: "AP", nome: "Amapá" },
            { sigla: "AM", nome: "Amazonas" },
            { sigla: "BA", nome: "Bahia" },
            { sigla: "CE", nome: "Ceará" },
            { sigla: "DF", nome: "Distrito Federal" },
            { sigla: "ES", nome: "Espírito Santo" },
            { sigla: "GO", nome: "Goiás" },
            { sigla: "MA", nome: "Maranhão" },
            { sigla: "MT", nome: "Mato Grosso" },
            { sigla: "MS", nome: "Mato Grosso do Sul" },
            { sigla: "MG", nome: "Minas Gerais" },
            { sigla: "PA", nome: "Pará" },
            { sigla: "PB", nome: "Paraíba" },
            { sigla: "PR", nome: "Paraná" },
            { sigla: "PE", nome: "Pernambuco" },
            { sigla: "PI", nome: "Piauí" },
            { sigla: "RJ", nome: "Rio de Janeiro" },
            { sigla: "RN", nome: "Rio Grande do Norte" },
            { sigla: "RS", nome: "Rio Grande do Sul" },
            { sigla: "RO", nome: "Rondônia" },
            { sigla: "RR", nome: "Roraima" },
            { sigla: "SC", nome: "Santa Catarina" },
            { sigla: "SP", nome: "São Paulo" },
            { sigla: "SE", nome: "Sergipe" },
            { sigla: "TO", nome: "Tocantins" }
        ];

        const arr = estadosBrasil.map(estado => {
            const matching = resultados.find(result => result.codUf === estado.sigla);
            return {
                estado: estado.sigla,
                empresas: matching ? matching.total : 0
            };
        });

        res.json({ success: true, data: arr });



        /* const estadosBrasil = [
            { sigla: "AC", nome: "Acre" },
            { sigla: "AL", nome: "Alagoas" },
            { sigla: "AP", nome: "Amapá" },
            { sigla: "AM", nome: "Amazonas" },
            { sigla: "BA", nome: "Bahia" },
            { sigla: "CE", nome: "Ceará" },
            { sigla: "DF", nome: "Distrito Federal" },
            { sigla: "ES", nome: "Espírito Santo" },
            { sigla: "GO", nome: "Goiás" },
            { sigla: "MA", nome: "Maranhão" },
            { sigla: "MT", nome: "Mato Grosso" },
            { sigla: "MS", nome: "Mato Grosso do Sul" },
            { sigla: "MG", nome: "Minas Gerais" },
            { sigla: "PA", nome: "Pará" },
            { sigla: "PB", nome: "Paraíba" },
            { sigla: "PR", nome: "Paraná" },
            { sigla: "PE", nome: "Pernambuco" },
            { sigla: "PI", nome: "Piauí" },
            { sigla: "RJ", nome: "Rio de Janeiro" },
            { sigla: "RN", nome: "Rio Grande do Norte" },
            { sigla: "RS", nome: "Rio Grande do Sul" },
            { sigla: "RO", nome: "Rondônia" },
            { sigla: "RR", nome: "Roraima" },
            { sigla: "SC", nome: "Santa Catarina" },
            { sigla: "SP", nome: "São Paulo" },
            { sigla: "SE", nome: "Sergipe" },
            { sigla: "TO", nome: "Tocantins" }
          ];
          

          const arr = [];
          estadosBrasil.map(async estado => {
            const userActivate = await Anuncio.count({
                where: {
                    codUf: estado.sigla
                }
            });
            arr.push(userActivate);
            console.log(userActivate);
          });
       

        res.json({ success: true, message: arr }) */

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
        console.log("duplicar", duplicateType, idAnuncio);



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
                let codCaderno = item.dataValues.nomeCaderno;
                let codUf = item.dataValues.UF;

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
                let codCaderno = item.dataValues.nomeCaderno;
                let codUf = item.dataValues.UF;

                anuncioObj.codOrigem = idAnuncio;
                anuncioObj.codDuplicado = index + 1;//`${String(idAnuncio)}.${String(index + 1)}`;
                anuncioObj.codCaderno = codCaderno;
                anuncioObj.codCidade = codCaderno;
                anuncioObj.codUf = codUf;

                //console.log(anuncioObj.codOrigem);
                //console.log(typeof(idAnuncio), typeof(index));
                console.log(anuncioObj);

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
                let codCaderno = item.dataValues.nomeCaderno;
                let codUf = item.dataValues.UF;

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
        const ufParam = req.query.uf;
        const cadernoParam = req.query.caderno;
        const totalConsulta = req.query.limit;
        const nomeFiltro = req.query.require;
        const pesquisaValue = req.query.search;
        var definirPesquisa;

        var query = `SELECT 
        a.codAnuncio, a.codOrigem, a.codDuplicado, a.descCPFCNPJ, a.descAnuncio, 
        a.codTipoAnuncio, a.codCaderno, a.codUf, a.activate, a.descPromocao, 
        a.createdAt, a.dueDate, a.codDesconto, a.codAtividade, a.periodo,
        u.descNome, u.descCPFCNPJ, u.senha, u.descEmail, u.descTelefone  -- Pegando informações do usuário
    FROM anuncio AS a 
    LEFT JOIN usuario AS u ON a.descCPFCNPJ = u.descCPFCNPJ
    WHERE a.codCaderno = :caderno
    LIMIT 50000;
    `;


        if (nomeFiltro === "codAtividade") {
            query = `SELECT 
                a.codAnuncio, a.codOrigem, a.codDuplicado, a.descCPFCNPJ, a.descAnuncio, 
                a.codTipoAnuncio, a.codCaderno, a.codUf, a.activate, a.descPromocao, 
                a.createdAt, a.dueDate, a.codDesconto, a.codAtividade, a.periodo, a.page,
                u.descNome, u.descCPFCNPJ, u.senha, u.descEmail, u.descTelefone  -- Pegando informações do usuário
            FROM anuncio AS a 
            LEFT JOIN usuario AS u ON a.descCPFCNPJ = u.descCPFCNPJ
            WHERE a.codAtividade = :itemSearch AND a.codCaderno = :caderno
            LIMIT 50000;
            `
            definirPesquisa = pesquisaValue;
        } else if (nomeFiltro === "codAnuncio") {
            query = `SELECT 
                a.codAnuncio, a.codOrigem, a.codDuplicado, a.descCPFCNPJ, a.descAnuncio, 
                a.codTipoAnuncio, a.codCaderno, a.codUf, a.activate, a.descPromocao, 
                a.createdAt, a.dueDate, a.codDesconto, a.codAtividade, a.periodo, a.page,
                u.descNome, u.descCPFCNPJ, u.senha, u.descEmail, u.descTelefone  -- Pegando informações do usuário
            FROM anuncio AS a 
            LEFT JOIN usuario AS u ON a.descCPFCNPJ = u.descCPFCNPJ
            WHERE a.codAnuncio = :itemSearch AND a.codCaderno = :caderno
            LIMIT 50000;
            `
            definirPesquisa = pesquisaValue;
        } else if (nomeFiltro === "descAnuncio") {
            query = `SELECT 
                a.codAnuncio, a.codOrigem, a.codDuplicado, a.descCPFCNPJ, a.descAnuncio, 
                a.codTipoAnuncio, a.codCaderno, a.codUf, a.activate, a.descPromocao, 
                a.createdAt, a.dueDate, a.codDesconto, a.codAtividade, a.periodo, a.page,
                u.descNome, u.descCPFCNPJ, u.senha, u.descEmail, u.descTelefone  -- Pegando informações do usuário
            FROM anuncio AS a 
            LEFT JOIN usuario AS u ON a.descCPFCNPJ = u.descCPFCNPJ
            WHERE a.descAnuncio = :itemSearch AND a.codCaderno = :caderno
            LIMIT 50000;
            `
            definirPesquisa = pesquisaValue;

        } else if (nomeFiltro === "codUf") {
            query = `SELECT 
                a.codAnuncio, a.codOrigem, a.codDuplicado, a.descCPFCNPJ, a.descAnuncio, 
                a.codTipoAnuncio, a.codCaderno, a.codUf, a.activate, a.descPromocao, 
                a.createdAt, a.dueDate, a.codDesconto, a.codAtividade, a.periodo, a.page,
                u.descNome, u.descCPFCNPJ, u.senha, u.descEmail, u.descTelefone  -- Pegando informações do usuário
            FROM anuncio AS a 
            LEFT JOIN usuario AS u ON a.descCPFCNPJ = u.descCPFCNPJ
            WHERE a.codUf = :itemSearch
            LIMIT 50000;
            `
            definirPesquisa = ufParam;

        } else if (nomeFiltro === "descCPFCNPJ") {
            query = `SELECT 
                a.codAnuncio, a.codOrigem, a.codDuplicado, a.descCPFCNPJ, a.descAnuncio, 
                a.codTipoAnuncio, a.codCaderno, a.codUf, a.activate, a.descPromocao, 
                a.createdAt, a.dueDate, a.codDesconto, a.codAtividade, a.periodo, a.page,
                u.descNome, u.descCPFCNPJ, u.senha, u.descEmail, u.descTelefone  -- Pegando informações do usuário
            FROM anuncio AS a 
            LEFT JOIN usuario AS u ON a.descCPFCNPJ = u.descCPFCNPJ
            WHERE a.descCPFCNPJ = :itemSearch AND a.codCaderno = :caderno
            LIMIT 50000;
            `
            definirPesquisa = pesquisaValue;

        } else if (nomeFiltro === "codDesconto") {
            query = `SELECT 
                a.codAnuncio, a.codOrigem, a.codDuplicado, a.descCPFCNPJ, a.descAnuncio, 
                a.codTipoAnuncio, a.codCaderno, a.codUf, a.activate, a.descPromocao, 
                a.createdAt, a.dueDate, a.codDesconto, a.codAtividade, a.periodo, a.page,
                u.descNome, u.descCPFCNPJ, u.senha, u.descEmail, u.descTelefone  -- Pegando informações do usuário
            FROM anuncio AS a 
            LEFT JOIN usuario AS u ON a.descCPFCNPJ = u.descCPFCNPJ
            WHERE a.codDesconto = :itemSearch AND a.codCaderno = :caderno
            LIMIT 50000;
            `
            definirPesquisa = pesquisaValue;
        }


        //console.log(cadernoParam, nomeFiltro, pesquisaValue)

        console.time('exp');
        /* const resultAnuncio = await Anuncio.findAll({
            where: {
                codCaderno: cadernoParam
            },
            limit: 10000,
            //offset: offset,
            attributes: [
                'codAnuncio',
                'codOrigem',
                'codDuplicado',
                'descCPFCNPJ',
                'descAnuncio',
                'codTipoAnuncio',
                'codCaderno',
                'codUf',
                'activate',
                'descPromocao',
                'createdAt',
                'dueDate',
                'codDesconto',
                'codAtividade',
                'periodo'
            ]
        }); */
        /* 
                const query = `
            SELECT codAnuncio, codOrigem, codDuplicado, descCPFCNPJ, descAnuncio, codTipoAnuncio, codCaderno, codUf, activate, descPromocao, createdAt, dueDate, codDesconto, codAtividade, periodo
            FROM anuncio
            IGNORE INDEX (idx_anuncio_codCaderno_otimizado, idx_anuncio_codCaderno)
            WHERE codCaderno = :caderno
            LIMIT 50000;
        `; */
        /*         const query = `SELECT 
            a.codAnuncio, a.codOrigem, a.codDuplicado, a.descCPFCNPJ, a.descAnuncio, 
            a.codTipoAnuncio, a.codCaderno, a.codUf, a.activate, a.descPromocao, 
            a.createdAt, a.dueDate, a.codDesconto, a.codAtividade, a.periodo,
            u.descNome, u.descCPFCNPJ, u.senha, u.descEmail, u.descTelefone  -- Pegando informações do usuário
        FROM anuncio AS a 
        LEFT JOIN usuario AS u ON a.descCPFCNPJ = u.descCPFCNPJ
        WHERE a.codCaderno = :caderno
        LIMIT 50000;
        `; */
        //IGNORE INDEX (idx_anuncio_codCaderno_otimizado, idx_anuncio_codCaderno)



        const resultAnuncio = await database.query(query, {
            replacements: { itemSearch: definirPesquisa, caderno: cadernoParam },
            type: Sequelize.QueryTypes.SELECT
        });
        console.log(resultAnuncio.length)
        console.timeEnd('exp');

        /*         await Promise.all(
                    resultAnuncio.map(async (anun) => {
                        try {
                            //const user = usuarios.find(teste => teste.descCPFCNPJ == anun.dataValues.descCPFCNPJ);
                            const user = await Usuarios.findAll({
                                where: {
                                    descCPFCNPJ: anun.dataValues.descCPFCNPJ
                                }
                            });
        
                            function dateformat(data) {
                                const date = new Date(data);
                                const formattedDate = date.toISOString().split('T')[0];
        
                                return formattedDate;
                            };
        
        
                            if (user) {
                                // Cria um novo objeto com as informações do usuário inseridas após 'codDesconto'
                                const reorderedData = {};
                                for (const key in anun.dataValues) {
                                    reorderedData[key] = anun.dataValues[key];
                                    if (key === 'codDesconto') {
                                        // Adiciona as propriedades do usuário após 'codDesconto'
                                        reorderedData.codUsuario = user.descNome;
                                        reorderedData.loginUser = user.descCPFCNPJ;
                                        reorderedData.loginPass = user.senha;
                                        reorderedData.loginEmail = user.descEmail;
                                        reorderedData.loginContato = user.descTelefone;
                                        reorderedData.link = `${masterPath.domain}/local/${encodeURIComponent(
                                            anun.dataValues.descAnuncio
                                        )}?id=${anun.dataValues.codAnuncio}`;
                                        reorderedData.createdAt = dateformat(anun.dataValues.createdAt);
                                        reorderedData.dueDate = dateformat(anun.dataValues.dueDate);
                                    }
                                }
                                anun.dataValues = reorderedData;
                            }
        
                            // Traduzindo valores específicos
                            anun.dataValues.codTipoAnuncio =
                                anun.dataValues.codTipoAnuncio == 3 ? "Completo" : anun.dataValues.codTipoAnuncio;
                            anun.dataValues.activate = anun.dataValues.activate == 1 ? "Ativo" : "Inativo";
                        } catch (error) {
                            console.error(`Erro ao processar anúncio ${anun.dataValues.codAnuncio}:`, error);
                        }
                    })
                );
         */




        const ExcelJS = require('exceljs');

        async function createExcel() {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Dados');

            // Definir cabeçalhos
            worksheet.columns = [
                { header: 'COD', key: 'id', width: 10 },
                { header: 'COD_OR', key: 'tipo', width: 10 },
                { header: 'DUPLI', key: 'doc', width: 10 },
                { header: 'CNPJ', key: 'nome', width: 30 },
                { header: 'NOME', key: 'email', width: 30 },
                { header: 'TIPO', key: 'tipoPerfil', width: 30 },
                { header: 'CADERNO', key: 'tipoUser', width: 10 },
                { header: 'UF', key: 'uf', width: 10 },
                { header: 'STATUS', key: 'status', width: 10 },
                { header: 'DATA_PAG', key: 'dataPag', width: 10 },
                { header: 'VALOR', key: 'cidade', width: 10 },
                { header: 'DESCONTO', key: 'duedate', width: 10 },
                { header: 'CAD. PARA CONF', key: 'cadParaConf', width: 10 },
                { header: 'CONFIRMADO', key: 'atividade', width: 10 },
                { header: 'DATA_FIM', key: 'atividade', width: 10 },
                { header: 'TEMP. VALE PR. TIPO', key: 'tempValidade', width: 10 },
                { header: 'ID', key: 'desconto', width: 10 },
                { header: 'USUARIO/DECISOR', key: 'user', width: 30 },
                { header: 'LOGIN', key: 'loginUser', width: 30 },
                { header: 'SENHA', key: 'senhaUser', width: 10 },
                { header: 'EMAIL', key: 'emailUser', width: 30 },
                { header: 'CONTATO', key: 'contatoUser', width: 30 },
                { header: 'LINK_PERFIL', key: 'linkPerfil', width: 30 },
                { header: 'codAtividade', key: 'atividade', width: 30 },
                { header: 'page', key: 'pagina', width: 30 },
            ];


            resultAnuncio.forEach(item => {

                let tipPerfil = () => {
                    if (item.codTipoAnuncio == 3) {
                        return "ANUNCIANTE";
                    } else if (item.codTipoAnuncio == 5) {
                        return "PREFEITURA";
                    } else {
                        return "não informado"
                    }
                }

                worksheet.addRow({
                    id: item.codAnuncio,
                    tipo: item.codOrigem,
                    doc: item.codDuplicado,
                    nome: item.descCPFCNPJ,
                    email: item.descAnuncio,
                    tipoPerfil: tipPerfil(),
                    tipoUser: item.codCaderno,
                    uf: item.codUf,
                    status: item.activate == 1 ? "ATIVO" : "DESATIVADO",
                    dataPag: item.descPromocao,
                    statu: item.createdAt,
                    duedate: item.dueDate,
                    desconto: item.codDesconto,
                    tempValidade: item.periodo,
                    //teste: item.loginUser,
                    user: item.descNome,
                    loginUser: item.descCPFCNPJ,
                    senhaUser: item.senha,
                    emailUser: item.descEmail,
                    contatoUser: item.descTelefone,
                    //linkPerfil: `${masterPath.domain}/perfil/${item.codAnuncio}`,
                    linkPerfil: {
                        text: `${masterPath.domain}/perfil/${item.codAnuncio}`,
                        hyperlink: `${masterPath.domain}/perfil/${item.codAnuncio}`
                    },
                    atividade: item.codAtividade,
                    pagina: item.page
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

        return;


        async function convertTxtToExcel() {
            const xl = require('excel4node');
            const filePath = path.join(__dirname, 'dados.txt');
            const wb = new xl.Workbook();
            const ws = wb.addWorksheet('Dados');

            // Cabeçalhos da tabela
            const headingColumnNames = [
                "COD", "COD_OR", "DUPLI", "CNPJ", "NOME", "TIPO", "CADERNO",
                "UF", "STATUS", "DATA_PAG", "VALOR", "DESCONTO",
                "CAD. PARA CONF.", "CONFIRMADO", "DATA_FIM", "TEMP. VALE PR. TIPO",
                "ID", "USUARIO/DECISOR", "LOGIN", "SENHA", "EMAIL", "CONTATO",
                "LINK_PERFIL", "ATIVIDADE PRINCIPAL"
            ];

            // Estilo do cabeçalho
            const headerStyle = wb.createStyle({
                font: { bold: true, color: '#000000', size: 12 },
                fill: { type: 'pattern', patternType: 'solid', fgColor: 'ffff00' },
                alignment: { horizontal: 'center', vertical: 'center' },
            });

            // Escreve os cabeçalhos
            headingColumnNames.forEach((heading, index) => {
                ws.cell(1, index + 1).string(heading).style(headerStyle);
            });

            // Ajusta larguras automaticamente (ou manualmente)
            headingColumnNames.forEach((_, index) => {
                ws.column(index + 1).setWidth(20); // Largura padrão
            });

            // Lê os dados do arquivo
            if (!fs.existsSync(filePath)) {
                console.error('Arquivo não encontrado:', filePath);
                return;
            }

            const data = fs.readFileSync(filePath, 'utf8').trim();
            if (!data) {
                console.error('O arquivo está vazio.');
                return;
            }

            // Escreve os dados na planilha
            const rows = data.split('\n');
            rows.forEach((line, rowIndex) => {
                const values = line.split(';'); // Assume separação por ponto e vírgula
                values.forEach((value, colIndex) => {
                    ws.cell(rowIndex + 2, colIndex + 1).string(value.trim());
                });
            });

            // Salva o Excel
            wb.write('dados.xlsx', (err) => {
                if (err) console.error('Erro ao gerar Excel:', err);
                else console.log('Excel gerado com sucesso!');
            });
        }




        try {
            if (req.query.export == "full") {

                const directoryPath = path.join(__dirname, `../public/export/caderno`);

                try {
                    // Lê os arquivos existentes no diretório
                    const files = await fs.promises.readdir(directoryPath);
                    console.log("Arquivos encontrados:", files);

                    // Exclui o primeiro arquivo da lista, se existir
                    if (files.length > 0) {
                        for (const file of files) {
                            const filePathToDelete = path.join(directoryPath, file);
                            await fs.promises.unlink(filePathToDelete);
                            console.log("Arquivo apagado:", filePathToDelete);
                        }

                    }
                } catch (err) {
                    console.error("Erro ao manipular arquivos:", err);
                    //return res.status(500).json({ success: false, message: "Erro ao processar a exportação." });
                }

                let countRegistros = 0;

                async function exportFullTest(execCount, flagFim, offset) {
                    const paginaAtual = req.query.page ? parseInt(req.query.page) : 1; // Página atual, padrão: 1
                    const porPagina = 10; // Número de itens por página

                    //const offset = (paginaAtual - 1) * porPagina;


                    // Consulta para recuperar apenas os itens da página atual
                    const anuncio = await Anuncio.findAndCountAll({
                        where: {
                            codCaderno: cadernoParam
                        },
                        limit: 10000,
                        offset: offset,
                        raw: false,
                        attributes: [
                            'codAnuncio',
                            'codOrigem',
                            'codDuplicado',
                            'descCPFCNPJ',
                            'descAnuncio',
                            'codTipoAnuncio',
                            'codCaderno',
                            'codUf',
                            'activate',
                            'descPromocao',
                            'createdAt',
                            'dueDate',
                            'codDesconto',
                            'codAtividade'
                        ]
                    });
                    //console.log(anuncio)

                    countRegistros = anuncio.count;

                    const usuarios = await Usuarios.findAll({
                        where: {
                            codCidade: cadernoParam
                        },
                        attributes: [
                            'descNome',
                            'descCPFCNPJ',
                            'senha',
                            'descTelefone',
                            'descEmail'],
                        limit: 10000,
                        offset: offset,
                        raw: true,
                    });


                    function dateformat(data) {
                        const date = new Date(data);
                        const formattedDate = date.toISOString().split('T')[0];

                        return formattedDate;
                    };

                    await Promise.all(
                        anuncio.rows.map(async (anun) => {
                            try {
                                const user = usuarios.find(teste => teste.descCPFCNPJ == anun.dataValues.descCPFCNPJ);

                                if (user) {
                                    // Cria um novo objeto com as informações do usuário inseridas após 'codDesconto'
                                    const reorderedData = {};
                                    for (const key in anun.dataValues) {
                                        reorderedData[key] = anun.dataValues[key];
                                        if (key === 'codDesconto') {
                                            // Adiciona as propriedades do usuário após 'codDesconto'
                                            reorderedData.codUsuario = user.descNome;
                                            reorderedData.loginUser = user.descCPFCNPJ;
                                            reorderedData.loginPass = user.senha;
                                            reorderedData.loginEmail = user.descEmail;
                                            reorderedData.loginContato = user.descTelefone;
                                            reorderedData.link = `${masterPath.domain}/local/${encodeURIComponent(
                                                anun.dataValues.descAnuncio
                                            )}?id=${anun.dataValues.codAnuncio}`;
                                            reorderedData.createdAt = dateformat(anun.dataValues.createdAt);
                                            reorderedData.dueDate = dateformat(anun.dataValues.dueDate);
                                        }
                                    }
                                    anun.dataValues = reorderedData;
                                }

                                // Traduzindo valores específicos
                                anun.dataValues.codTipoAnuncio =
                                    anun.dataValues.codTipoAnuncio == 3 ? "Completo" : anun.dataValues.codTipoAnuncio;
                                anun.dataValues.activate = anun.dataValues.activate == 1 ? "Ativo" : "Inativo";
                            } catch (error) {
                                console.error(`Erro ao processar anúncio ${anun.dataValues.codAnuncio}:`, error);
                            }
                        })
                    );




                    //console.log(usuarios)


                    exportExcell(anuncio.rows, res, startTime, cadernoParam, execCount, flagFim).then(response => {
                        console.log("resultado do service", response);

                    })

                    return anuncio.rows.length;
                }

                let offset = 0;
                const limit = 10000;
                const maxRecords = totalConsulta;//83517;
                let totalFetched = 0;

                while (totalFetched < maxRecords) {
                    //exportFullTest();
                    try {
                        let fim = ((totalFetched + limit) >= maxRecords) ? true : false;
                        let count = await exportFullTest(totalFetched, fim, offset);

                        totalFetched += count;
                        offset += limit;

                        if (count < limit) {
                            console.log("Todos os registros foram consultados.");
                            //return res.json({ success: true, message: "Exportação Finalizada", downloadUrl: `${masterPath.url}/export/arquivo.xlsx`, time: 'executionTime' });
                            //break;
                        }

                        console.log(`Consulta finalizada. Total de registros recuperados: ${totalFetched}`);
                    } catch (error) {
                        console.error("Erro ao processar exportação:", error);
                        break;
                    }

                }


                if (totalFetched >= maxRecords) {
                    console.log("Todos os registros foram consultados.");
                    //archiverCompactor();
                    return res.json({ success: true, message: "Exportação Finalizada", downloadUrl: `${masterPath.url}/export/arquivo.zip`, time: 'executionTime' });
                    //break;
                }


            } else {
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
                    offset: offset,
                    raw: false,
                    attributes: [
                        'codAnuncio',
                        'codOrigem',
                        'codDuplicado',
                        'descCPFCNPJ',
                        'descAnuncio',
                        'codTipoAnuncio',
                        'codCaderno',
                        'codUf',
                        'activate',
                        'descPromocao',
                        'createdAt',
                        'dueDate',
                        'codDesconto',
                        'codAtividade'
                    ]
                });


                function dateformat(data) {
                    const date = new Date(data);
                    return date.toISOString().split('T')[0];
                }

                await Promise.all(
                    anuncio.rows.map(async (anun) => {
                        try {
                            const user = await anun.getUsuario();

                            if (user) {
                                // Cria um novo objeto com as informações do usuário inseridas após 'codDesconto'
                                const reorderedData = {};
                                for (const key in anun.dataValues) {
                                    reorderedData[key] = anun.dataValues[key];
                                    if (key === 'codDesconto') {
                                        // Adiciona as propriedades do usuário após 'codDesconto'
                                        reorderedData.codUsuario = user.descNome;
                                        reorderedData.loginUser = user.descCPFCNPJ;
                                        reorderedData.loginPass = user.senha;
                                        reorderedData.loginEmail = user.descEmail;
                                        reorderedData.loginContato = user.descTelefone;
                                        reorderedData.link = `${masterPath.domain}/local/${encodeURIComponent(
                                            anun.dataValues.descAnuncio
                                        )}?id=${anun.dataValues.codAnuncio}`;
                                        reorderedData.createdAt = dateformat(anun.dataValues.createdAt);
                                        reorderedData.dueDate = dateformat(anun.dataValues.dueDate);
                                    }
                                }
                                anun.dataValues = reorderedData;
                            }

                            // Traduzindo valores específicos
                            anun.dataValues.codTipoAnuncio =
                                anun.dataValues.codTipoAnuncio == 3 ? "Completo" : anun.dataValues.codTipoAnuncio;
                            anun.dataValues.activate = anun.dataValues.activate == 1 ? "Ativo" : "Inativo";
                        } catch (error) {
                            console.error(`Erro ao processar anúncio ${anun.dataValues.codAnuncio}:`, error);
                        }
                    })
                );




                exportExcell(anuncio.rows, res);
            }
        } catch (err) {
            console.log(err)
            res.json({ success: false, message: `o numero máximo de registros é ${anunciosCount}` })
        }




    },
    export4excellold2: async (req, res) => {
        //const anunciosCount = await Anuncio.count();
        //const limit = Number(req.query.limit);
        const cadernoParam = req.query.caderno;
        const totalConsulta = req.query.limit;


        const startTime = Date.now(); // Início da medição do tempo
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

        /*  const filePath = path.join(__dirname, 'dados.json');
         const stream = fs.createWriteStream(filePath, { flags: 'a' });
         
         let offset = 0;
         const limit = 2000;
         const arr = [];
         
         while (true) {
             const dados = await database.query(
                 "SELECT codAnuncio, codOrigem, codDuplicado, descCPFCNPJ, descAnuncio, codTipoAnuncio, codCaderno, codUf, activate, descPromocao, createdAt, dueDate, codDesconto, codAtividade FROM anuncio WHERE codCaderno = 'AGUA BRANCA' LIMIT :limit OFFSET :offset",
                 {
                     replacements: { limit, offset },
                     type: database.QueryTypes.SELECT,
                 },
             );
         
             if (dados.length === 0) {
               
                 exportExcell(arr, res);
                 break
 
             }; // Sai do loop se não houver mais registros
         
             // Escreve os dados no arquivo como JSON
             dados.forEach(record => {
                 arr.push(record)
                 const jsonRecord = JSON.stringify(record); // Converte o registro para JSON
                 stream.write(jsonRecord + '\n'); // Adiciona cada linha em formato JSON no arquivo
             });
         
             offset += limit;
         }
         
         stream.end(); 
         console.log(`Dados salvos em: ${filePath}`); */
        //console.log(arr);


        //convertTxtToExcel()

        async function convertTxtToExcel() {
            const xl = require('excel4node');
            const filePath = path.join(__dirname, 'dados.txt');
            const wb = new xl.Workbook();
            const ws = wb.addWorksheet('Dados');

            // Cabeçalhos da tabela
            const headingColumnNames = [
                "COD", "COD_OR", "DUPLI", "CNPJ", "NOME", "TIPO", "CADERNO",
                "UF", "STATUS", "DATA_PAG", "VALOR", "DESCONTO",
                "CAD. PARA CONF.", "CONFIRMADO", "DATA_FIM", "TEMP. VALE PR. TIPO",
                "ID", "USUARIO/DECISOR", "LOGIN", "SENHA", "EMAIL", "CONTATO",
                "LINK_PERFIL", "ATIVIDADE PRINCIPAL"
            ];

            // Estilo do cabeçalho
            const headerStyle = wb.createStyle({
                font: { bold: true, color: '#000000', size: 12 },
                fill: { type: 'pattern', patternType: 'solid', fgColor: 'ffff00' },
                alignment: { horizontal: 'center', vertical: 'center' },
            });

            // Escreve os cabeçalhos
            headingColumnNames.forEach((heading, index) => {
                ws.cell(1, index + 1).string(heading).style(headerStyle);
            });

            // Ajusta larguras automaticamente (ou manualmente)
            headingColumnNames.forEach((_, index) => {
                ws.column(index + 1).setWidth(20); // Largura padrão
            });

            // Lê os dados do arquivo
            if (!fs.existsSync(filePath)) {
                console.error('Arquivo não encontrado:', filePath);
                return;
            }

            const data = fs.readFileSync(filePath, 'utf8').trim();
            if (!data) {
                console.error('O arquivo está vazio.');
                return;
            }

            // Escreve os dados na planilha
            const rows = data.split('\n');
            rows.forEach((line, rowIndex) => {
                const values = line.split(';'); // Assume separação por ponto e vírgula
                values.forEach((value, colIndex) => {
                    ws.cell(rowIndex + 2, colIndex + 1).string(value.trim());
                });
            });

            // Salva o Excel
            wb.write('dados.xlsx', (err) => {
                if (err) console.error('Erro ao gerar Excel:', err);
                else console.log('Excel gerado com sucesso!');
            });
        }




        try {
            if (req.query.export == "full") {

                const directoryPath = path.join(__dirname, `../public/export/caderno`);

                try {
                    // Lê os arquivos existentes no diretório
                    const files = await fs.promises.readdir(directoryPath);
                    console.log("Arquivos encontrados:", files);

                    // Exclui o primeiro arquivo da lista, se existir
                    if (files.length > 0) {
                        for (const file of files) {
                            const filePathToDelete = path.join(directoryPath, file);
                            await fs.promises.unlink(filePathToDelete);
                            console.log("Arquivo apagado:", filePathToDelete);
                        }

                    }
                } catch (err) {
                    console.error("Erro ao manipular arquivos:", err);
                    //return res.status(500).json({ success: false, message: "Erro ao processar a exportação." });
                }

                let countRegistros = 0;

                async function exportFullTest(execCount, flagFim, offset) {
                    const paginaAtual = req.query.page ? parseInt(req.query.page) : 1; // Página atual, padrão: 1
                    const porPagina = 10; // Número de itens por página

                    //const offset = (paginaAtual - 1) * porPagina;


                    // Consulta para recuperar apenas os itens da página atual
                    const anuncio = await Anuncio.findAndCountAll({
                        where: {
                            codCaderno: cadernoParam
                        },
                        limit: 10000,
                        offset: offset,
                        raw: false,
                        attributes: [
                            'codAnuncio',
                            'codOrigem',
                            'codDuplicado',
                            'descCPFCNPJ',
                            'descAnuncio',
                            'codTipoAnuncio',
                            'codCaderno',
                            'codUf',
                            'activate',
                            'descPromocao',
                            'createdAt',
                            'dueDate',
                            'codDesconto',
                            'codAtividade'
                        ]
                    });
                    //console.log(anuncio)

                    countRegistros = anuncio.count;

                    const usuarios = await Usuarios.findAll({
                        where: {
                            codCidade: cadernoParam
                        },
                        attributes: [
                            'descNome',
                            'descCPFCNPJ',
                            'senha',
                            'descTelefone',
                            'descEmail'],
                        limit: 10000,
                        offset: offset,
                        raw: true,
                    });


                    function dateformat(data) {
                        const date = new Date(data);
                        const formattedDate = date.toISOString().split('T')[0];

                        return formattedDate;
                    };

                    await Promise.all(
                        anuncio.rows.map(async (anun) => {
                            try {
                                const user = usuarios.find(teste => teste.descCPFCNPJ == anun.dataValues.descCPFCNPJ);

                                if (user) {
                                    // Cria um novo objeto com as informações do usuário inseridas após 'codDesconto'
                                    const reorderedData = {};
                                    for (const key in anun.dataValues) {
                                        reorderedData[key] = anun.dataValues[key];
                                        if (key === 'codDesconto') {
                                            // Adiciona as propriedades do usuário após 'codDesconto'
                                            reorderedData.codUsuario = user.descNome;
                                            reorderedData.loginUser = user.descCPFCNPJ;
                                            reorderedData.loginPass = user.senha;
                                            reorderedData.loginEmail = user.descEmail;
                                            reorderedData.loginContato = user.descTelefone;
                                            reorderedData.link = `${masterPath.domain}/local/${encodeURIComponent(
                                                anun.dataValues.descAnuncio
                                            )}?id=${anun.dataValues.codAnuncio}`;
                                            reorderedData.createdAt = dateformat(anun.dataValues.createdAt);
                                            reorderedData.dueDate = dateformat(anun.dataValues.dueDate);
                                        }
                                    }
                                    anun.dataValues = reorderedData;
                                }

                                // Traduzindo valores específicos
                                anun.dataValues.codTipoAnuncio =
                                    anun.dataValues.codTipoAnuncio == 3 ? "Completo" : anun.dataValues.codTipoAnuncio;
                                anun.dataValues.activate = anun.dataValues.activate == 1 ? "Ativo" : "Inativo";
                            } catch (error) {
                                console.error(`Erro ao processar anúncio ${anun.dataValues.codAnuncio}:`, error);
                            }
                        })
                    );




                    //console.log(usuarios)


                    exportExcell(anuncio.rows, res, startTime, cadernoParam, execCount, flagFim).then(response => {
                        console.log("resultado do service", response);

                    })

                    return anuncio.rows.length;
                }

                let offset = 0;
                const limit = 10000;
                const maxRecords = totalConsulta;//83517;
                let totalFetched = 0;

                while (totalFetched < maxRecords) {
                    //exportFullTest();
                    try {
                        let fim = ((totalFetched + limit) >= maxRecords) ? true : false;
                        let count = await exportFullTest(totalFetched, fim, offset);

                        totalFetched += count;
                        offset += limit;

                        if (count < limit) {
                            console.log("Todos os registros foram consultados.");
                            //return res.json({ success: true, message: "Exportação Finalizada", downloadUrl: `${masterPath.url}/export/arquivo.xlsx`, time: 'executionTime' });
                            //break;
                        }

                        console.log(`Consulta finalizada. Total de registros recuperados: ${totalFetched}`);
                    } catch (error) {
                        console.error("Erro ao processar exportação:", error);
                        break;
                    }

                }


                if (totalFetched >= maxRecords) {
                    console.log("Todos os registros foram consultados.");
                    //archiverCompactor();
                    return res.json({ success: true, message: "Exportação Finalizada", downloadUrl: `${masterPath.url}/export/arquivo.zip`, time: 'executionTime' });
                    //break;
                }


            } else {
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
                    offset: offset,
                    raw: false,
                    attributes: [
                        'codAnuncio',
                        'codOrigem',
                        'codDuplicado',
                        'descCPFCNPJ',
                        'descAnuncio',
                        'codTipoAnuncio',
                        'codCaderno',
                        'codUf',
                        'activate',
                        'descPromocao',
                        'createdAt',
                        'dueDate',
                        'codDesconto',
                        'codAtividade'
                    ],
                    /*      include: [
                            {
                                model: Usuarios,
                                as: 'usuario',
                            },
                        ], */
                });


                /*  await Promise.all(anuncio.rows.map(async (anun, i) => {
 
                     function dateformat(data) {
                         const date = new Date(data);
                         const formattedDate = date.toISOString().split('T')[0];
 
                         return formattedDate;
                     };
 
                     const user = await anun.getUsuario();
 
                     for (let key in anun.dataValues) {
                         //console.log("key: ", key)
                         if (key == 'codDesconto') {
                             //newObj['newProperty'] = 42; // Adiciona a nova propriedade após 'a'
                             
                             if (user) {
                                 anun.codUsuario = user.descNome;
                                 anun.dataValues.loginUser = user.descCPFCNPJ;
                                 anun.dataValues.loginPass = user.senha;
                                 anun.dataValues.loginEmail = user.descEmail;
                                 anun.dataValues.loginContato = user.descTelefone;
                                 anun.dataValues.link = `${masterPath.domain}/local/${encodeURIComponent(anun.dataValues.descAnuncio)}?id=${anun.dataValues.codAnuncio}`;
                                 anun.dataValues.createdAt = dateformat(anun.dataValues.createdAt);
                                 anun.dataValues.dueDate = dateformat(anun.dataValues.dueDate);
                             };
                         }
                     }
 
                  
 
                     if (anun.dataValues.codTipoAnuncio == 3) {
                         anun.dataValues.codTipoAnuncio = "Completo";
                     }
 
                     if (anun.dataValues.activate == 1) {
                         anun.dataValues.activate = "Ativo";
                     } else {
                         anun.dataValues.activate = "Inativo";
                     }
 
 
       
                     //console.log(anuncio.rows[i])
                 })); */


                /*      let dados = await Promise.all(req.body.map(async item => {
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


                function dateformat(data) {
                    const date = new Date(data);
                    return date.toISOString().split('T')[0];
                }

                await Promise.all(
                    anuncio.rows.map(async (anun) => {
                        try {
                            const user = await anun.getUsuario();

                            if (user) {
                                // Cria um novo objeto com as informações do usuário inseridas após 'codDesconto'
                                const reorderedData = {};
                                for (const key in anun.dataValues) {
                                    reorderedData[key] = anun.dataValues[key];
                                    if (key === 'codDesconto') {
                                        // Adiciona as propriedades do usuário após 'codDesconto'
                                        reorderedData.codUsuario = user.descNome;
                                        reorderedData.loginUser = user.descCPFCNPJ;
                                        reorderedData.loginPass = user.senha;
                                        reorderedData.loginEmail = user.descEmail;
                                        reorderedData.loginContato = user.descTelefone;
                                        reorderedData.link = `${masterPath.domain}/local/${encodeURIComponent(
                                            anun.dataValues.descAnuncio
                                        )}?id=${anun.dataValues.codAnuncio}`;
                                        reorderedData.createdAt = dateformat(anun.dataValues.createdAt);
                                        reorderedData.dueDate = dateformat(anun.dataValues.dueDate);
                                    }
                                }
                                anun.dataValues = reorderedData;
                            }

                            // Traduzindo valores específicos
                            anun.dataValues.codTipoAnuncio =
                                anun.dataValues.codTipoAnuncio == 3 ? "Completo" : anun.dataValues.codTipoAnuncio;
                            anun.dataValues.activate = anun.dataValues.activate == 1 ? "Ativo" : "Inativo";
                        } catch (error) {
                            console.error(`Erro ao processar anúncio ${anun.dataValues.codAnuncio}:`, error);
                        }
                    })
                );




                exportExcell(anuncio.rows, res);
            }
        } catch (err) {
            console.log(err)
            res.json({ success: false, message: `o numero máximo de registros é ${anunciosCount}` })
        }




    },
    export4excellold: async (req, res) => {
        const anunciosCount = await Anuncio.count();
        //const limit = Number(req.query.limit);
        const cadernoParam = req.query.caderno;


        const startTime = Date.now(); // Início da medição do tempo
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

        /*  const filePath = path.join(__dirname, 'dados.json');
         const stream = fs.createWriteStream(filePath, { flags: 'a' });
         
         let offset = 0;
         const limit = 2000;
         const arr = [];
         
         while (true) {
             const dados = await database.query(
                 "SELECT codAnuncio, codOrigem, codDuplicado, descCPFCNPJ, descAnuncio, codTipoAnuncio, codCaderno, codUf, activate, descPromocao, createdAt, dueDate, codDesconto, codAtividade FROM anuncio WHERE codCaderno = 'AGUA BRANCA' LIMIT :limit OFFSET :offset",
                 {
                     replacements: { limit, offset },
                     type: database.QueryTypes.SELECT,
                 },
             );
         
             if (dados.length === 0) {
               
                 exportExcell(arr, res);
                 break
 
             }; // Sai do loop se não houver mais registros
         
             // Escreve os dados no arquivo como JSON
             dados.forEach(record => {
                 arr.push(record)
                 const jsonRecord = JSON.stringify(record); // Converte o registro para JSON
                 stream.write(jsonRecord + '\n'); // Adiciona cada linha em formato JSON no arquivo
             });
         
             offset += limit;
         }
         
         stream.end(); 
         console.log(`Dados salvos em: ${filePath}`); */
        //console.log(arr);


        //convertTxtToExcel()

        async function convertTxtToExcel() {
            const xl = require('excel4node');
            const filePath = path.join(__dirname, 'dados.txt');
            const wb = new xl.Workbook();
            const ws = wb.addWorksheet('Dados');

            // Cabeçalhos da tabela
            const headingColumnNames = [
                "COD", "COD_OR", "DUPLI", "CNPJ", "NOME", "TIPO", "CADERNO",
                "UF", "STATUS", "DATA_PAG", "VALOR", "DESCONTO",
                "CAD. PARA CONF.", "CONFIRMADO", "DATA_FIM", "TEMP. VALE PR. TIPO",
                "ID", "USUARIO/DECISOR", "LOGIN", "SENHA", "EMAIL", "CONTATO",
                "LINK_PERFIL", "ATIVIDADE PRINCIPAL"
            ];

            // Estilo do cabeçalho
            const headerStyle = wb.createStyle({
                font: { bold: true, color: '#000000', size: 12 },
                fill: { type: 'pattern', patternType: 'solid', fgColor: 'ffff00' },
                alignment: { horizontal: 'center', vertical: 'center' },
            });

            // Escreve os cabeçalhos
            headingColumnNames.forEach((heading, index) => {
                ws.cell(1, index + 1).string(heading).style(headerStyle);
            });

            // Ajusta larguras automaticamente (ou manualmente)
            headingColumnNames.forEach((_, index) => {
                ws.column(index + 1).setWidth(20); // Largura padrão
            });

            // Lê os dados do arquivo
            if (!fs.existsSync(filePath)) {
                console.error('Arquivo não encontrado:', filePath);
                return;
            }

            const data = fs.readFileSync(filePath, 'utf8').trim();
            if (!data) {
                console.error('O arquivo está vazio.');
                return;
            }

            // Escreve os dados na planilha
            const rows = data.split('\n');
            rows.forEach((line, rowIndex) => {
                const values = line.split(';'); // Assume separação por ponto e vírgula
                values.forEach((value, colIndex) => {
                    ws.cell(rowIndex + 2, colIndex + 1).string(value.trim());
                });
            });

            // Salva o Excel
            wb.write('dados.xlsx', (err) => {
                if (err) console.error('Erro ao gerar Excel:', err);
                else console.log('Excel gerado com sucesso!');
            });
        }




        try {
            /*      const anuncios = await Anuncio.findAll({
                     limit: limit
                 }); */

            if (req.query.export == "full") {
                const paginaAtual = req.query.page ? parseInt(req.query.page) : 1; // Página atual, padrão: 1
                const porPagina = 10; // Número de itens por página

                const offset = (paginaAtual - 1) * porPagina;


                // Consulta para recuperar apenas os itens da página atual
                const anuncio = await Anuncio.findAndCountAll({
                    where: {
                        codCaderno: cadernoParam
                    },
                    /*      order: [
                             [Sequelize.literal('CASE WHEN activate = 0 THEN 0 ELSE 1 END'), 'ASC'],
                             ['createdAt', 'DESC'],
                             ['codDuplicado', 'ASC'],
                         ], */
                    limit: 10,
                    //offset: offset, 
                    raw: false,
                    attributes: [
                        'codAnuncio',
                        'codOrigem',
                        'codDuplicado',
                        'descCPFCNPJ',
                        'descAnuncio',
                        'codTipoAnuncio',
                        'codCaderno',
                        'codUf',
                        'activate',
                        'descPromocao',
                        'createdAt',
                        'dueDate',
                        'codDesconto',
                        'codAtividade'
                    ],
                    /*    include: [
                         {
                             model: Usuarios,
                             as: 'usuario',
                         },
                     ],  */
                });
                //console.log(anuncio)
                const usuarios = await Usuarios.findAll({
                    where: {
                        codCidade: cadernoParam
                    },
                    attributes: [
                        'descNome',
                        'descCPFCNPJ',
                        'senha',
                        'descTelefone',
                        'descEmail'],
                    /*      order: [
                             [Sequelize.literal('CASE WHEN activate = 0 THEN 0 ELSE 1 END'), 'ASC'],
                             ['createdAt', 'DESC'],
                             ['codDuplicado', 'ASC'],
                         ], */
                    limit: 10,
                    //offset: offset, 
                    raw: true,

                    /*    include: [
                         {
                             model: Usuarios,
                             as: 'usuario',
                         },
                     ],  */
                });


                function dateformat(data) {
                    const date = new Date(data);
                    const formattedDate = date.toISOString().split('T')[0];

                    return formattedDate;
                };

                await Promise.all(
                    anuncio.rows.map(async (anun) => {
                        try {
                            const user = usuarios.find(teste => teste.descCPFCNPJ == anun.dataValues.descCPFCNPJ);

                            if (user) {
                                // Cria um novo objeto com as informações do usuário inseridas após 'codDesconto'
                                const reorderedData = {};
                                for (const key in anun.dataValues) {
                                    reorderedData[key] = anun.dataValues[key];
                                    if (key === 'codDesconto') {
                                        // Adiciona as propriedades do usuário após 'codDesconto'
                                        reorderedData.codUsuario = user.descNome;
                                        reorderedData.loginUser = user.descCPFCNPJ;
                                        reorderedData.loginPass = user.senha;
                                        reorderedData.loginEmail = user.descEmail;
                                        reorderedData.loginContato = user.descTelefone;
                                        reorderedData.link = `${masterPath.domain}/local/${encodeURIComponent(
                                            anun.dataValues.descAnuncio
                                        )}?id=${anun.dataValues.codAnuncio}`;
                                        reorderedData.createdAt = dateformat(anun.dataValues.createdAt);
                                        reorderedData.dueDate = dateformat(anun.dataValues.dueDate);
                                    }
                                }
                                anun.dataValues = reorderedData;
                            }

                            // Traduzindo valores específicos
                            anun.dataValues.codTipoAnuncio =
                                anun.dataValues.codTipoAnuncio == 3 ? "Completo" : anun.dataValues.codTipoAnuncio;
                            anun.dataValues.activate = anun.dataValues.activate == 1 ? "Ativo" : "Inativo";
                        } catch (error) {
                            console.error(`Erro ao processar anúncio ${anun.dataValues.codAnuncio}:`, error);
                        }
                    })
                );




                //console.log(usuarios)

                exportExcell(anuncio.rows, res, startTime).then(response => {
                    console.log("resultado do service", response);
                })


            } else {
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
                    offset: offset,
                    raw: false,
                    attributes: [
                        'codAnuncio',
                        'codOrigem',
                        'codDuplicado',
                        'descCPFCNPJ',
                        'descAnuncio',
                        'codTipoAnuncio',
                        'codCaderno',
                        'codUf',
                        'activate',
                        'descPromocao',
                        'createdAt',
                        'dueDate',
                        'codDesconto',
                        'codAtividade'
                    ],
                    /*      include: [
                            {
                                model: Usuarios,
                                as: 'usuario',
                            },
                        ], */
                });


                /*  await Promise.all(anuncio.rows.map(async (anun, i) => {
 
                     function dateformat(data) {
                         const date = new Date(data);
                         const formattedDate = date.toISOString().split('T')[0];
 
                         return formattedDate;
                     };
 
                     const user = await anun.getUsuario();
 
                     for (let key in anun.dataValues) {
                         //console.log("key: ", key)
                         if (key == 'codDesconto') {
                             //newObj['newProperty'] = 42; // Adiciona a nova propriedade após 'a'
                             
                             if (user) {
                                 anun.codUsuario = user.descNome;
                                 anun.dataValues.loginUser = user.descCPFCNPJ;
                                 anun.dataValues.loginPass = user.senha;
                                 anun.dataValues.loginEmail = user.descEmail;
                                 anun.dataValues.loginContato = user.descTelefone;
                                 anun.dataValues.link = `${masterPath.domain}/local/${encodeURIComponent(anun.dataValues.descAnuncio)}?id=${anun.dataValues.codAnuncio}`;
                                 anun.dataValues.createdAt = dateformat(anun.dataValues.createdAt);
                                 anun.dataValues.dueDate = dateformat(anun.dataValues.dueDate);
                             };
                         }
                     }
 
                  
 
                     if (anun.dataValues.codTipoAnuncio == 3) {
                         anun.dataValues.codTipoAnuncio = "Completo";
                     }
 
                     if (anun.dataValues.activate == 1) {
                         anun.dataValues.activate = "Ativo";
                     } else {
                         anun.dataValues.activate = "Inativo";
                     }
 
 
       
                     //console.log(anuncio.rows[i])
                 })); */


                /*      let dados = await Promise.all(req.body.map(async item => {
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


                function dateformat(data) {
                    const date = new Date(data);
                    return date.toISOString().split('T')[0];
                }

                await Promise.all(
                    anuncio.rows.map(async (anun) => {
                        try {
                            const user = await anun.getUsuario();

                            if (user) {
                                // Cria um novo objeto com as informações do usuário inseridas após 'codDesconto'
                                const reorderedData = {};
                                for (const key in anun.dataValues) {
                                    reorderedData[key] = anun.dataValues[key];
                                    if (key === 'codDesconto') {
                                        // Adiciona as propriedades do usuário após 'codDesconto'
                                        reorderedData.codUsuario = user.descNome;
                                        reorderedData.loginUser = user.descCPFCNPJ;
                                        reorderedData.loginPass = user.senha;
                                        reorderedData.loginEmail = user.descEmail;
                                        reorderedData.loginContato = user.descTelefone;
                                        reorderedData.link = `${masterPath.domain}/local/${encodeURIComponent(
                                            anun.dataValues.descAnuncio
                                        )}?id=${anun.dataValues.codAnuncio}`;
                                        reorderedData.createdAt = dateformat(anun.dataValues.createdAt);
                                        reorderedData.dueDate = dateformat(anun.dataValues.dueDate);
                                    }
                                }
                                anun.dataValues = reorderedData;
                            }

                            // Traduzindo valores específicos
                            anun.dataValues.codTipoAnuncio =
                                anun.dataValues.codTipoAnuncio == 3 ? "Completo" : anun.dataValues.codTipoAnuncio;
                            anun.dataValues.activate = anun.dataValues.activate == 1 ? "Ativo" : "Inativo";
                        } catch (error) {
                            console.error(`Erro ao processar anúncio ${anun.dataValues.codAnuncio}:`, error);
                        }
                    })
                );




                exportExcell(anuncio.rows, res);
            }
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
        res.json({ success: true, message: "Importação" });

        const filePath = path.join(__dirname, '../public/importLog.json');
        const arquivoImportado = path.join(__dirname, '../public/import/uploadedfile.csv');
        const DELAY_MS = 1000; // Delay configurável entre linhas

        async function importarPerfis() {
            let totalLinhas = 0;

            function updateJsonName(filePath, endProccess, progress) {
                try {
                    const now = new Date();
                    const hours = now.getHours();
                    const minutes = now.getMinutes();
                    const seconds = now.getSeconds();

                    const jsonData = fs.readFileSync(filePath, 'utf8');
                    const data = JSON.parse(jsonData);

                    data.progress = progress;
                    data.fim = `${hours}:${minutes}:${seconds}`;
                    data.endProccess = endProccess;

                    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
                    console.log(`Progresso atualizado para: ${progress}`);
                } catch (error) {
                    console.error('Erro ao atualizar progresso:', error);
                }
            }

            async function processRow(row, index) {
                //console.log(`Processando linha ${index}:`, row);
                //return;
                try {
                    if (index === 1) updateJsonName(filePath, false, 0);

                    const codTipoAnuncio = row['TIPO'];
                    const idDesconto = row['ID'];
                    const nomeAnuncio = row['NOMe'];
                    const telefone = row['TELEFONE'];
                    const cep = row['CEP'];
                    const estado = row['UF'];
                    const cidade = row['CIDADE'];
                    const tipoAtividade = row['ATIVIDADE_PRINCIPAL_CNAE'];
                    const nuDocumento = row['CNPJ_CPF'];
                    const autorizante = row['AUTORIZANTE'];
                    const email = row['EMAIL'];
                    const senha = 12345;

                    const verificarUserExists = await Usuarios.findOne({
                        where: { descCPFCNPJ: nuDocumento }
                    });

                    let codUser;
                    if (verificarUserExists) {
                        codUser = verificarUserExists.dataValues.codUsuario;
                    } else {
                        const dadosUsuario = {
                            codTipoPessoa: "pf",
                            descCPFCNPJ: nuDocumento,
                            descNome: nomeAnuncio || `import${index}`,
                            descEmail: email || "atualizar",
                            senha,
                            codTipoUsuario: 3,
                            descTelefone: telefone || "atualizar",
                            codUf: estado,
                            codCidade: cidade,
                            dtCadastro: dataNow(),
                            usuarioCod: 0,
                            dtCadastro2: dataNow(),
                            dtAlteracao: dataNow(),
                            ativo: "1"
                        };
                        const novoUsuario = await Usuarios.create(dadosUsuario);
                        codUser = novoUsuario.dataValues.codUsuario;
                    }

                    let codigoDeDesconto = await Descontos.findOne({ where: { hash: idDesconto } });

                    const dataObj = {
                        codUsuario: codUser,
                        codTipoAnuncio,
                        codAtividade: tipoAtividade,
                        codCaderno: cidade,
                        codUf: estado,
                        codCidade: cidade,
                        descAnuncio: nomeAnuncio || `import${index}`,
                        descImagem: 0,
                        descEndereco: "atualizar",
                        descTelefone: telefone || "atualizar",
                        descCelular: 0,
                        descEmailComercial: 0,
                        descEmailRetorno: email,
                        descWhatsApp: 0,
                        descCEP: cep,
                        descTipoPessoa: "pf",
                        descCPFCNPJ: nuDocumento,
                        descNomeAutorizante: autorizante || `import${index}`,
                        descEmailAutorizante: 0,
                        codDesconto: codigoDeDesconto ? codigoDeDesconto.idDesconto : '00.000.0000',
                        descChavePix: 'chavePix',
                        qntVisualizacoes: 0,
                        codDuplicado: 0,
                        descPromocao: 0,
                        activate: 1,
                    };

                    await Anuncio.create(dataObj);
                    updateJsonName(filePath, false, index);
                    console.log(`Linha ${index} importada com sucesso.`);
                } catch (error) {
                    console.error(`Erro ao importar linha ${index}:`, error);
                }
            }

            function dataNow() {
                const dataAtual = new Date();
                const ano = dataAtual.getFullYear();
                const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
                const dia = String(dataAtual.getDate()).padStart(2, '0');
                const hora = String(dataAtual.getHours()).padStart(2, '0');
                const minutos = String(dataAtual.getMinutes()).padStart(2, '0');
                const segundos = String(dataAtual.getSeconds()).padStart(2, '0');
                return `${ano}-${mes}-${dia} ${hora}:${minutos}:${segundos}`;
            }

            async function processFile() {
                console.log("Iniciando leitura do arquivo...");
                let index = 1;
                const stream = fs.createReadStream(arquivoImportado).pipe(csv());

                for await (const row of stream) {
                    await processRow(row, index);
                    await new Promise(resolve => setTimeout(resolve, DELAY_MS));
                    index++;
                }

                console.log("Arquivo lido com sucesso!");
                updateJsonName(filePath, false, index - 1);
                // Zera o arquivo importLog.json após a última iteração
                const logInicial = {
                    progress: 0,
                    //fim: "",
                    endProccess: true
                };
                fs.writeFileSync(filePath, JSON.stringify(logInicial, null, 2), 'utf8');
            }

            await processFile();
        }

        // Para rodar a importação, basta chamar:
        importarPerfis();
    },

    import4excell2: async (req, res, io) => {

        const filePath = path.join(__dirname, '../public/importLog.json');
        const csv = require('csv-parser');
        const arquivoImportado = path.join(__dirname, '../public/import/uploadedfile.csv');
        let totalLinhas = 0;

        function processRowWithDelay(row, totalLinhas, callback) {
            setTimeout(() => {
                //updateJsonName(filePath, false, totalLinhas);

                novaImportacao1(row, totalLinhas);
                callback();
            }, delay);
        }




        function delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        async function processRow(row) {
            if (totalLinhas === 0) {
                updateJsonName(filePath, false, 0);
            }

            totalLinhas++;

            const test = await novaImportacao1(row, totalLinhas);
            await delay(1000); // Espera 1 segundo antes de processar a próxima linha
        }

        async function processFile() {
            console.log("Iniciando leitura do arquivo...");

            const stream = fs.createReadStream(arquivoImportado).pipe(csv());

            for await (const row of stream) {
                await processRow(row);
            }

            console.log("Arquivo lido com sucesso!");
            updateJsonName(filePath, true, totalLinhas);
        }

        processFile();





        const now = new Date();
        const hours = now.getHours(); // Horas (0-23)
        const minutes = now.getMinutes(); // Minutos (0-59)
        const seconds = now.getSeconds(); // Segundos (0-59)

        //console.log(`Hora atual: ${hours}:${minutes}:${seconds}`);



        // Caminho do arquivo JSON


        // Função para alterar a propriedade "name"
        function updateJsonName(filePath, endProccess, newName) {
            try {
                // 1. Ler o conteúdo do arquivo JSON
                const jsonData = fs.readFileSync(filePath, 'utf8');
                const data = JSON.parse(jsonData); // Converte o texto em um objeto JavaScript

                // 2. Modificar a propriedade "name"
                data.progress = newName;// ? newName : data.progress;
                data.fim = `${hours}:${minutes}:${seconds}`;
                data.endProccess = endProccess;

                // 3. Escrever o conteúdo atualizado de volta no arquivo
                fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8'); // null e 2 para formatar com indentação
                console.log(`Propriedade "name" atualizada para: ${newName}`);
            } catch (error) {
                console.error('Erro ao atualizar a propriedade "name":', error);
            }
        }


        async function novaImportacao1(result, index) {

            //console.log(result, index, result[1])

            const codTipoAnuncio = result['TIPO'];
            const idDesconto = result['ID'];
            const nomeAnuncio = result['NOMe'];
            const telefone = result['TELEFONE'];
            const cep = result['CEP'];
            const estado = result['UF'];
            const cidade = result['CIDADE'];
            const tipoAtividade = result['ATIVIDADE_PRINCIPAL_CNAE'];
            const nuDocumento = result['CNPJ_CPF'];
            const autorizante = result['AUTORIZANTE'];
            const email = result['EMAIL'];
            //const chavePix = result['PIX'];
            //const login = result[9];
            //const senha = 12345;


            const verificarUserExists = await Usuarios.findAll({
                where: {
                    descCPFCNPJ: nuDocumento
                }
            });

            if (verificarUserExists.length > 0) {
                let codUser = verificarUserExists[0].dataValues.codUsuario;


                let sucesso = await criarAnuncioImportado(codUser);
                console.log("dsadhjakhdlajdkasd: ", sucesso)
                return sucesso;
            } else {

                const dadosUsuario = {
                    "codTipoPessoa": "pf",
                    "descCPFCNPJ": nuDocumento,
                    "descNome": nomeAnuncio || `import${index}`,
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


                    //criarAnuncioImportado(codUser);

                    let sucesso = await criarAnuncioImportado(codUser);
                    return sucesso;

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

            async function criarAnuncioImportado(codUser) {

                let codigoDeDesconto = await Descontos.findAll({
                    where: {
                        hash: idDesconto
                    }
                });

                const dataObj = {
                    "codUsuario": codUser,
                    "codTipoAnuncio": codTipoAnuncio,
                    "codAtividade": tipoAtividade, //await buscarAtividade(),
                    "codCaderno": cidade,
                    "codUf": estado,
                    "codCidade": cidade,
                    "descAnuncio": nomeAnuncio || `import${index}`,
                    "descImagem": 0,
                    "descEndereco": "atualizar",
                    "descTelefone": telefone || "atualizar",
                    "descCelular": 0,
                    "descEmailComercial": 0,
                    "descEmailRetorno": email,
                    "descWhatsApp": 0,
                    "descCEP": cep,
                    "descTipoPessoa": "pf",
                    "descCPFCNPJ": nuDocumento,
                    "descNomeAutorizante": autorizante || `import${index}`,
                    "descEmailAutorizante": 0,
                    "codDesconto": codigoDeDesconto.length > 0 ? codigoDeDesconto[0].idDesconto : '00.000.0000',
                    "descChavePix": 'chavePix',
                    "qntVisualizacoes": 0,
                    "codDuplicado": 0,
                    "descPromocao": 0,
                    "activate": 1,

                };

                const criarAnuncios = await Anuncio.create(dataObj);
                updateJsonName(filePath, false, index);

                console.log(criarAnuncios);
                const progress = index; // Progresso fictício
                console.log("laksljhasfasdfgafsdf: ", progress);
                // Atualizar o nome
                return true;

            };



        }


        return;


        updateJsonName(filePath, false, 0);

        async function processExcelInChunks() {


            const workbook = new ExcelJS.stream.xlsx.WorkbookReader(path.join(__dirname, '../public/import/uploadedfile.xlsx'));

            console.log("kledisom", workbook[0]);

            //Desativar indexes
            await database.query(`ALTER TABLE anuncio DISABLE KEYS;`, {
                type: Sequelize.QueryTypes.RAW,
            });

            await database.query(`ALTER TABLE usuario DISABLE KEYS;`, {
                type: Sequelize.QueryTypes.RAW,
            });


            var index = 0;
            for await (const worksheet of workbook) {
                console.log(`Processando planilha: ${worksheet.name}`, worksheet);

                let rowIndex = 0; // Inicialize o índice

                for await (const row of worksheet) {
                    console.log(row.values[0]); // Processa cada linha aqui
                    //teste(row.values)

                    if (row.values[1] != "TIPO") {
                        let novo = await novaImportacao(row.values, rowIndex)
                        rowIndex++; // Incrementa o índice
                        index++; // Incrementa o índice
                    }

                }
            }

            updateJsonName(filePath, true, index);

            console.log("Processamento concluído.");

            //reativar indexes
            await database.query(`ALTER TABLE anuncio ENABLE KEYS;`, {
                type: Sequelize.QueryTypes.RAW,
            });

            await database.query(`ALTER TABLE usuario ENABLE KEYS;`, {
                type: Sequelize.QueryTypes.RAW,
            });

        }

        //processExcelInChunks().catch(console.error);



        //return;

        //console.log("dasdasdas", te)
        /*      setInterval(() => {
                 const progress = Math.floor(Math.random() * 100); // Progresso fictício
                 req.io.emit("progress", { progress }); // Envia progresso ao cliente conectado
             }, 2000); */

        /*         const now = new Date();
                const hours = now.getHours(); // Horas (0-23)
                const minutes = now.getMinutes(); // Minutos (0-59)
                const seconds = now.getSeconds(); // Segundos (0-59) */

        //console.log(`Hora atual: ${hours}:${minutes}:${seconds}`);



        // Caminho do arquivo JSON


        // Função para alterar a propriedade "name"
        /*   function updateJsonName(filePath, endProccess, newName) {
              try {
                  // 1. Ler o conteúdo do arquivo JSON
                  const jsonData = fs.readFileSync(filePath, 'utf8');
                  const data = JSON.parse(jsonData); // Converte o texto em um objeto JavaScript
  
                  // 2. Modificar a propriedade "name"
                  data.progress = newName ? newName : data.progress;
                  data.fim = `${hours}:${minutes}:${seconds}`;
                  data.endProccess = endProccess;
  
                  // 3. Escrever o conteúdo atualizado de volta no arquivo
                  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8'); // null e 2 para formatar com indentação
                  console.log(`Propriedade "name" atualizada para: ${newName}`);
              } catch (error) {
                  console.error('Erro ao atualizar a propriedade "name":', error);
              }
          } */


        async function novaImportacao(result, index) {

            console.log(result, index, result[1])

            const codTipoAnuncio = result[1];
            const idDesconto = result[2];
            const nomeAnuncio = result[3];
            const telefone = result[4];
            const cep = result[5];
            const estado = result[6];
            const cidade = result[7];
            const tipoAtividade = result[8];
            const nuDocumento = result[9];
            const autorizante = result[10];
            const email = result[11];
            //const chavePix = result['PIX'];
            const login = result[9];
            const senha = 12345;

            /*             const codTipoAnuncio = result['TIPO'];
                        const idDesconto = result['ID'];
                        const nomeAnuncio = result['NOME'];
                        const telefone = result['TELEFONE'];
                        const cep = result['CEP'];
                        const estado = result['UF'];
                        const cidade = result['CIDADE'];
                        const tipoAtividade = result['ATIVIDADE_PRINCIPAL_CNAE'];
                        const nuDocumento = result['CNPJ_CPF'];
                        const autorizante = result['AUTORIZANTE'];
                        const email = result['EMAIL'];
                        //const chavePix = result['PIX'];
                        const login = result['CNPJ/CPF'];
                        const senha = 12345; */




            const verificarUserExists = await Usuarios.findAll({
                where: {
                    descCPFCNPJ: nuDocumento
                }
            });

            if (verificarUserExists.length > 0) {
                let codUser = verificarUserExists[0].dataValues.codUsuario;


                let sucesso = await criarAnuncioImportado(codUser);
                console.log("dsadhjakhdlajdkasd: ", sucesso)
                return sucesso;
            } else {

                const dadosUsuario = {
                    "codTipoPessoa": "pf",
                    "descCPFCNPJ": nuDocumento,
                    "descNome": nomeAnuncio || `import${index}`,
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


                    //criarAnuncioImportado(codUser);

                    let sucesso = await criarAnuncioImportado(codUser);
                    return sucesso;

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

            async function criarAnuncioImportado(codUser) {

                let codigoDeDesconto = await Descontos.findAll({
                    where: {
                        hash: idDesconto
                    }
                });

                const dataObj = {
                    "codUsuario": codUser,
                    "codTipoAnuncio": codTipoAnuncio,
                    "codAtividade": tipoAtividade, //await buscarAtividade(),
                    "codCaderno": cidade,
                    "codUf": estado,
                    "codCidade": cidade,
                    "descAnuncio": nomeAnuncio || `import${index}`,
                    "descImagem": 0,
                    "descEndereco": "atualizar",
                    "descTelefone": telefone || "atualizar",
                    "descCelular": 0,
                    "descEmailComercial": 0,
                    "descEmailRetorno": email,
                    "descWhatsApp": 0,
                    "descCEP": cep,
                    "descTipoPessoa": "pf",
                    "descCPFCNPJ": nuDocumento,
                    "descNomeAutorizante": autorizante || `import${index}`,
                    "descEmailAutorizante": 0,
                    "codDesconto": codigoDeDesconto.length > 0 ? codigoDeDesconto[0].idDesconto : '00.000.0000',
                    "descChavePix": 'chavePix',
                    "qntVisualizacoes": 0,
                    "codDuplicado": 0,
                    "descPromocao": 0,
                    "activate": 1,

                };

                /*   count++
                  arrayImportado.push(dataObj); */
                const criarAnuncios = await Anuncio.create(dataObj);
                updateJsonName(filePath, false, index);

                //console.log(criarAnuncios);
                const progress = index; // Progresso fictício
                //req.io.emit("progress", { progress }); // Envia progresso ao cliente conectado
                console.log("laksljhasfasdfgafsdf: ", progress);
                // Atualizar o nome
                return true;

            };



        }


        function teste(linhas) {
            //console.log(linhas);

            const data = linhas;


            /*     const resultPlan = data.slice(1).map(row => {
                    return row.reduce((obj, value, index) => {
                        obj[data[0][index]] = value; // Usa o cabeçalho como chave
                        return obj;
                    }, {});
                });
     */
            const arrayImportado = [];
            let count = 0;

            async function novaImportacao(result, index) {
                /*   console.log(result, data.length, index)
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
                  const cidadeId = resultCidade.length > 0 ? resultCidade[0].dataValues.codCaderno : 0; */


                const codTipoAnuncio = result['TIPO'];
                const idDesconto = result['ID'];
                const nomeAnuncio = result['NOME'];
                const telefone = result['TELEFONE'];
                const cep = result['CEP'];
                const estado = result['UF'];
                const cidade = result['CIDADE'];
                const tipoAtividade = result['ATIVIDADE_PRINCIPAL_CNAE'];
                const nuDocumento = result['CNPJ_CPF'];
                const autorizante = result['AUTORIZANTE'];
                const email = result['EMAIL'];
                //const chavePix = result['PIX'];
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
                        "descNome": nomeAnuncio || `import${index}`,
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
                        "codCaderno": cidade,
                        "codUf": estado,
                        "codCidade": cidade,
                        "descAnuncio": nomeAnuncio || `import${index}`,
                        "descImagem": 0,
                        "descEndereco": "atualizar",
                        "descTelefone": telefone || "atualizar",
                        "descCelular": 0,
                        "descEmailComercial": 0,
                        "descEmailRetorno": email,
                        "descWhatsApp": 0,
                        "descCEP": cep,
                        "descTipoPessoa": "pf",
                        "descCPFCNPJ": nuDocumento,
                        "descNomeAutorizante": autorizante || `import${index}`,
                        "descEmailAutorizante": 0,
                        "codDesconto": codigoDeDesconto.length > 0 ? codigoDeDesconto[0].idDesconto : '00.000.0000',
                        "descChavePix": 'chavePix',
                        "qntVisualizacoes": 0,
                        "codDuplicado": 0,
                        "descPromocao": 0,
                        "activate": 1,

                    };

                    count++
                    arrayImportado.push(dataObj);
                    const criarAnuncios = await Anuncio.create(dataObj);
                    updateJsonName(filePath, false, count);

                    //console.log(criarAnuncios);
                    const progress = index; // Progresso fictício
                    //req.io.emit("progress", { progress }); // Envia progresso ao cliente conectado
                    console.log("laksljhasfasdfgafsdf: ", progress);
                    // Atualizar o nome

                    if (index + 1 == data.length - 1) {
                        //res.json({ success: true, progress: index })
                        //res.redirect("https://br.minisitio.net/admin/espacos");
                    }

                };

            }
        }

        if (!req.file) {
            return res.status(400).send('Nenhum arquivo foi enviado.');
        }



        // Acessar o arquivo: req.file.path para o caminho completo
        console.log('Arquivo enviado:', req.file);

        res.json({ success: true, message: 'Arquivo recebido com sucesso!' });
        //res.redirect("https://minitest.minisitio.online/admin/espacos");
    },
    import4excellFuncinal: async (req, res, io) => {

        //console.log("dasdasdas", te)
        /*      setInterval(() => {
                 const progress = Math.floor(Math.random() * 100); // Progresso fictício
                 req.io.emit("progress", { progress }); // Envia progresso ao cliente conectado
             }, 2000); */

        const now = new Date();
        const hours = now.getHours(); // Horas (0-23)
        const minutes = now.getMinutes(); // Minutos (0-59)
        const seconds = now.getSeconds(); // Segundos (0-59)

        //console.log(`Hora atual: ${hours}:${minutes}:${seconds}`);



        // Caminho do arquivo JSON
        const filePath = path.join(__dirname, '../public/importLog.json');

        // Função para alterar a propriedade "name"
        function updateJsonName(filePath, newName) {
            try {
                // 1. Ler o conteúdo do arquivo JSON
                const jsonData = fs.readFileSync(filePath, 'utf8');
                const data = JSON.parse(jsonData); // Converte o texto em um objeto JavaScript

                // 2. Modificar a propriedade "name"
                data.progress = newName;
                data.fim = `${hours}:${minutes}:${seconds}`;

                // 3. Escrever o conteúdo atualizado de volta no arquivo
                fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8'); // null e 2 para formatar com indentação
                console.log(`Propriedade "name" atualizada para: ${newName}`);
            } catch (error) {
                console.error('Erro ao atualizar a propriedade "name":', error);
            }
        }




        // req.file é o arquivo 'uploadedfile'
        // req.body conterá os campos de texto, se houver
        //Realizando leitura dos dados
        readXlsxFile(path.join(__dirname, '../public/import/uploadedfile.xlsx')).then(async (linhas) => {
            //console.log(linhas);

            const data = linhas;


            const resultPlan = data.slice(1).map(row => {
                return row.reduce((obj, value, index) => {
                    obj[data[0][index]] = value; // Usa o cabeçalho como chave
                    return obj;
                }, {});
            });

            const arrayImportado = [];
            let count = 0;

            async function novaImportacao(result, index) {
                console.log(result, data.length, index)
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
                const idDesconto = result['ID'];
                const nomeAnuncio = result['NOME'];
                const telefone = result['TELEFONE'];
                const cep = result['CEP'];
                const estado = estadoId;
                const cidade = cidadeId;
                const tipoAtividade = result['ATIVIDADE_PRINCIPAL_CNAE'];
                const nuDocumento = result['CNPJ_CPF'];
                const autorizante = result['AUTORIZANTE'];
                const email = result['EMAIL'];
                //const chavePix = result['PIX'];
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
                        "descNome": nomeAnuncio || `import${index}`,
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
                        "descAnuncio": nomeAnuncio || `import${index}`,
                        "descImagem": 0,
                        "descEndereco": "atualizar",
                        "descTelefone": telefone || "atualizar",
                        "descCelular": 0,
                        "descEmailComercial": 0,
                        "descEmailRetorno": email,
                        "descWhatsApp": 0,
                        "descCEP": cep,
                        "descTipoPessoa": "pf",
                        "descCPFCNPJ": nuDocumento,
                        "descNomeAutorizante": autorizante || `import${index}`,
                        "descEmailAutorizante": 0,
                        "codDesconto": codigoDeDesconto.length > 0 ? codigoDeDesconto[0].idDesconto : '00.000.0000',
                        "descChavePix": 'chavePix',
                        "qntVisualizacoes": 0,
                        "codDuplicado": 0,
                        "descPromocao": 0,
                        "activate": 1,

                    };

                    count++
                    arrayImportado.push(dataObj);
                    const criarAnuncios = await Anuncio.create(dataObj);
                    updateJsonName(filePath, count);

                    //console.log(criarAnuncios);
                    const progress = index; // Progresso fictício
                    //req.io.emit("progress", { progress }); // Envia progresso ao cliente conectado
                    console.log("laksljhasfasdfgafsdf: ", progress);
                    // Atualizar o nome

                    if (index + 1 == data.length - 1) {
                        //res.json({ success: true, progress: index })
                        //res.redirect("https://br.minisitio.net/admin/espacos");
                    }

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


            const BATCH_SIZE = 500; // Tamanho do lote para processar de cada vez

            async function processBatch(batch) {
                return Promise.all(batch.map(async (result, index) => {
                    try {
                        console.log(result)
                        await novaImportacao(result, index);
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

            // Readable Stream.
            /*   const progress = (1 / linhas) * 100;
              req.customParam.emit("progress", { progress }); */
        });



        if (!req.file) {
            return res.status(400).send('Nenhum arquivo foi enviado.');
        }



        // Acessar o arquivo: req.file.path para o caminho completo
        console.log('Arquivo enviado:', req.file);
        //console.log('Arquivo enviado:', req.customParam);




        res.json({ success: true, message: 'Arquivo recebido com sucesso!' });
        //res.redirect("https://minitest.minisitio.online/admin/espacos");
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


    //PAGAMENTOS
    listarPagamentos: async (req, res) => {
        const dataPaginacao = await paginador(req, 10);
        console.log(dataPaginacao)

        const todosPagamentos = await Pagamento.findAll({
            limit: dataPaginacao.limit,
            offset: dataPaginacao.offset,
            order: [['data', 'DESC']],
            raw: true
        });

        res.json({
            success: true,
            data: todosPagamentos,
            paginaAtual: dataPaginacao.paginaAtual,
            totalPaginas: dataPaginacao.totalPaginas,
            totalItem: dataPaginacao.totalItens
        })
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
