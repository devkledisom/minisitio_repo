const database = require('../config/db');
const Users = require('../models/table_user_login');
const DDD = require('../models/table_ddd');
const Anuncio = require('../models/table_anuncio');
const Descontos = require('../models/table_desconto');
const Cadernos = require('../models/table_caderno');
const Globals = require('../models/table_globals');

//moduls
const Sequelize = require('sequelize');
const { Op } = Sequelize;
const { novoUsuario } = require('../functions/sendMailer');
const Usuario = require('../models/table_usuarios');


module.exports = {
    create: async (req, res) => {
        await database.sync();

        const { TipoPessoa,
            CPFCNPJ,
            Nome,
            Email,
            senha,
            hashCode,
            Value,
            TipoUsuario,
            Telefone,
            RepresentanteConvenio,
            Endereco,
            Uf,
            Cidade,
            Cadastro,
            usuarioCod,
            dtCadastro2,
            dtAlteracao,
            ativo } = req.body;

            const gerarSenha = () => {
                const origem = CPFCNPJ.replace(/[.\-\/]/g, '');
                return origem.slice(0, 5);
            }

            

        const dadosUsuario = {
            "codTipoPessoa": TipoPessoa,
            "descCPFCNPJ": CPFCNPJ,
            "descNome": Nome,
            "descEmail": Email,
            "senha": gerarSenha(),
            "hashCode": hashCode,
            "descValue": Value,
            "codTipoUsuario": TipoUsuario,
            "descTelefone": Telefone,
            "descRepresentanteConvenio": RepresentanteConvenio,
            "descEndereco": Endereco,
            "codUf": Uf,
            "codCidade": Cidade,
            "dtCadastro": dataNow(),
            "usuarioCod": usuarioCod,
            "dtCadastro2": dataNow(),
            "dtAlteracao": dataNow(),
            "ativo": "1"
        };

        try {
            const listaUsers = await Users.create(dadosUsuario);
            if (listaUsers) {
                novoUsuario(Email, Nome, CPFCNPJ);
            }

            res.json({ success: true, message: listaUsers })



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
            var dataFormatada = ano + '-' + mes + '-' + dia;
            var horaFormatada = hora + ':' + minutos + ':' + segundos;

            // Exibir a data e hora atual
            console.log('Data atual:', dataFormatada);
            console.log('Hora atual:', horaFormatada);

            return dataFormatada + " " + horaFormatada;
        };

    },
    update: async (req, res) => {
        await database.sync();

        const uuid = req.params.id;

        const { TipoPessoa,
            CPFCNPJ,
            Nome,
            Email,
            senha,
            hashCode,
            Value,
            TipoUsuario,
            Telefone,
            RepresentanteConvenio,
            Endereco,
            Uf,
            Cidade,
            Cadastro,
            usuarioCod,
            dtCadastro2,
            dtAlteracao,
            ativo } = req.body

        const dadosUsuario = {
            "codTipoPessoa": TipoPessoa,
            "descCPFCNPJ": CPFCNPJ,
            "descNome": Nome,
            "descEmail": Email,
            "senha": senha,
            "hashCode": hashCode,
            "descValue": Value,
            "codTipoUsuario": TipoUsuario,
            "descTelefone": Telefone,
            "descRepresentanteConvenio": RepresentanteConvenio,
            "descEndereco": Endereco,
            "codUf": Uf,
            "codCidade": Cidade,
            //"dtCadastro": dataNow(),
            "usuarioCod": usuarioCod,
            "dtAlteracao": dataNow(),
            "ativo": "1"
        };

        try {
            const listaUsers = await Users.update(dadosUsuario, {
                where: {
                    codUsuario: uuid
                }
            });


            res.json({ success: true, message: listaUsers })
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
            var dataFormatada = ano + '-' + mes + '-' + dia;
            var horaFormatada = hora + ':' + minutos + ':' + segundos;

            // Exibir a data e hora atual
            console.log('Data atual:', dataFormatada);
            console.log('Hora atual:', horaFormatada);

            return dataFormatada + " " + horaFormatada;
        };


    },
    updateStatus: async (req, res) => {
        await database.sync();

        const uuid = req.params.id;

        const ativo = req.body.ativo;

        try {
            const listaUsers = await Users.update({
                "ativo": ativo == "Ativado" ? 0 : 1
            }, {
                where: {
                    codUsuario: uuid
                }
            });


            res.json({ success: true, message: listaUsers })
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
            var dataFormatada = ano + '-' + mes + '-' + dia;
            var horaFormatada = hora + ':' + minutos + ':' + segundos;

            // Exibir a data e hora atual
            console.log('Data atual:', dataFormatada);
            console.log('Hora atual:', horaFormatada);

            return dataFormatada + " " + horaFormatada;
        };


    },
    delete: async (req, res) => {
        await database.sync();

        const uuid = req.params.id;

        try {
            //Atividades
            const resultAnuncio = await Users.destroy({
                where: {
                    codUsuario: uuid
                }

            });

            if (resultAnuncio) {
                const apagarEspaco = await Anuncio.destroy({
                    where: {
                        codUsuario: uuid
                    }

                });
            }

            res.json({ success: true, message: resultAnuncio });
        } catch (err) {
            res.json(err);
        }

    },
    buscarUsuario: async (req, res) => {
        await database.sync();

        const uuid = req.params.id;

        //Atividades
        const resultAnuncio = await Users.findAll({
            where: {
                codUsuario: uuid
            }
        });



        res.json(resultAnuncio[0]);
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
            cartao_digital } = req.body

        //console.log("tajsdnfkjfbdsjkbfsd;;;;;;", req.body)
        let codigoDeDesconto = await Descontos.findAll({
            where: {
                hash: codDesconto
            }
        });

        const dadosAnuncio = {
            //"codAnuncio": 88888,
            "codUsuario": codUsuario,
            "codTipoAnuncio": 2,
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
            "descPromocao": codigoDeDesconto[0].desconto,
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
            "codDesconto": codigoDeDesconto[0].idDesconto,
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
            "qntVisualizacoes": 813,
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
    qtdaAnuncio: async (req, res) => {
        try {
            const listaAnuncios = await Anuncio.count();
            //console.log(listaAnuncios)

            res.json({ success: true, message: listaAnuncios })
        } catch (err) {
            res.status(500).json({ success: false, message: err });
        }
    },
    buscarUsuarioId: async (req, res) => {
        const paginaAtual = req.query.page ? parseInt(req.query.page) : 1; // Página atual, padrão: 1
        const porPagina = 10; // Número de itens por página
        const codigoCaderno = req.params.codCaderno;
        const { require, uf, caderno } = req.query;
        //const requisito = req.query.require;
        console.log("dasdasd", require, uf, caderno)

        if (!require) {
            res.json({ success: false, message: "não encontrado" });
            return;
        }

        const offset = (paginaAtual - 1) * porPagina;
        var nu_doc = req.params.id;

        if (nu_doc != "all") {
            console.log(nu_doc)

            const arrTypes = ['super admin', 'master'];

            if (arrTypes.includes(nu_doc.toLowerCase())) {


                switch (nu_doc.toLowerCase()) {
                    case "super admin":
                        buscarPorTipoUsuario(1);
                        break;
                    case "master":
                        buscarPorTipoUsuario(2);
                        break;
                    default:
                        console.log("não localizado")
                }

                return;
            }

            //busca por caderno
            if (require === "codCidade") {
                console.time("teste")
                const resultUser = await Users.findAll({
                    where: {
                        //[require]: { [Op.like]: `${nu_doc}%` }
                        [require]: caderno

                    },
                    //order: [['dtCadastro', 'DESC'], ['descNome', 'ASC']],
                    attributes: [
                        //[Sequelize.literal('DISTINCT `descCPFCNPJ`'), 'descCPFCNPJ'],
                        'codUsuario',
                        'descCPFCNPJ',
                        'descNome',
                        'descEmail',
                        'senha',
                        'codTipoUsuario',
                        'codUf',
                        'codCidade',
                        'dtCadastro',
                        'ativo'
                    ],
                    limit: porPagina,
                    offset: offset,
                });
                console.log(resultUser);

                console.timeEnd("teste")
                console.log("debug: ", resultUser.length);
                if (resultUser.count < 1) {
                    res.json({ success: false, message: "não encontrado" });
                    return;
                }

                try {

                } catch (err) {
                    console.log(err)
                }
                const consultarRegistros = await Cadernos.findAll({
                    where: {
                        nomeCaderno: caderno
                    },
                    raw: true,
                    attributes: ['total']
                })


                const totalItens = consultarRegistros[0].total;
                const totalPaginas = Math.ceil(totalItens / porPagina);

                return res.json({ success: true, usuarios: resultUser, totalItem: totalItens, totalPaginas: totalPaginas, paginaAtual: paginaAtual, });
            }

            //Atividades
            console.time("teste")
            const resultUser = await Users.findAndCountAll({
                where: {
                    [require]: { [Op.like]: `${nu_doc}%` },
                    codUf: uf,
                    codCidade: caderno

                },
                order: [['dtCadastro', 'DESC'], ['descNome', 'ASC']],
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
                limit: porPagina,
                offset: offset,
            });
            console.log(resultUser);

            console.timeEnd("teste")
            console.log("debug: ", resultUser.length);
            if (resultUser.count < 1) {
                res.json({ success: false, message: "não encontrado" });
                return;
            }

            const totalItens = resultUser.count;
            const totalPaginas = Math.ceil(totalItens / porPagina);

            res.json({ success: true, usuarios: resultUser.rows, totalItem: totalItens, totalPaginas: totalPaginas, paginaAtual: paginaAtual, });

        } else {
            //Atividades
            const resultUser = await Users.findAll();

            if (resultUser < 1) {
                res.json({ success: false, message: "Usuario não encontrado" });
                return;
            }

            res.json({ success: true, usuarios: resultUser });
        }

        async function buscarPorTipoUsuario(codigo) {
            const resultUser = await Users.findAndCountAll({
                where: {
                    [Op.or]: [
                        { codTipoUsuario: codigo },
                    ]
                },
                order: [['descNome', 'ASC']],//['dtCadastro', 'DESC'], 
                attributes: [
                    'codUsuario',
                    'descCPFCNPJ',
                    'descNome',
                    'descEmail',
                    'senha',
                    'codTipoUsuario',
                    'codUf',
                    'codCidade',
                    'dtCadastro',
                    'ativo'
                ],
            });

            const totalItens = resultUser.count;
            const totalPaginas = Math.ceil(totalItens / porPagina);

            res.json({ success: true, usuarios: resultUser.rows, totalItem: totalItens, totalPaginas: totalPaginas });
        }


    },
    consultarUsuarioPortal: async (req, res) => {
        const usuario = await Usuario.findOne({
            where: {
                descCPFCNPJ: req.params.id
            },
            attributes: ['codUsuario', 'descCPFCNPJ'],
            raw: true
        })
        console.log(usuario)

        if(usuario) {
            res.json({success: true, usuario: usuario}).status(200)
        } else {
            res.json({success: false}).status(404)
        }
        
       
    },
    buscarUsuarioIdold: async (req, res) => {
        const paginaAtual = req.query.page ? parseInt(req.query.page) : 1; // Página atual, padrão: 1
        const porPagina = 10; // Número de itens por página
        const codigoCaderno = req.params.codCaderno;
        const requisito = req.query.require;
        console.log("dasdasd", requisito)

        if (!requisito) {
            res.json({ success: false, message: "não encontrado" });
            return;
        }

        const offset = (paginaAtual - 1) * porPagina;
        var nu_doc = req.params.id;

        if (nu_doc != "all") {
            console.log(nu_doc)

            const arrTypes = ['super admin', 'master'];

            if (arrTypes.includes(nu_doc.toLowerCase())) {


                switch (nu_doc.toLowerCase()) {
                    case "super admin":
                        buscarPorTipoUsuario(1);
                        break;
                    case "master":
                        buscarPorTipoUsuario(2);
                        break;
                    default:
                        console.log("não localizado")
                }

                return;
            }



            //Atividades
            console.time("teste")
            const resultUser = await Users.findAndCountAll({
                where: {
                    /*   [Op.or]: [
                         { descNome: { [Op.like]: `%${nu_doc}%` } },
                         { descEmail: nu_doc },
                         { descCPFCNPJ: nu_doc },
                         { codUf: { [Op.like]: `${nu_doc}%` } },
                         { codCidade: { [Op.like]: `${nu_doc}%` } }
                     ]   */
                    //[requisito]:  nu_doc 
                    [requisito]: { [Op.like]: `${nu_doc}%` }

                },
                order: [['dtCadastro', 'DESC'], ['descNome', 'ASC']],
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
                limit: porPagina,
                offset: offset,
            });


            /*      const resultUser = await database.query(`SELECT codUsuario, descCPFCNPJ, descNome, descEmail, senha, codTipoUsuario, 
    codUf, codCidade, dtCadastro, ativo 
    FROM usuario AS usuario 
    FORCE INDEX (idx_usuario_ordem)
    WHERE usuario.codCidade LIKE 'curitiba%' 
    
    LIMIT 0, 10
                `, {
                    replacements: { nu_doc: `${nu_doc}`, limit: porPagina, offset },
                    type: Sequelize.QueryTypes.SELECT
                }); */

            console.log(resultUser);



            console.timeEnd("teste")
            console.log("debug: ", resultUser.length);
            if (resultUser.count < 1) {
                res.json({ success: false, message: "não encontrado" });
                return;
            }

            if (resultUser.length < 1) {
                const resultUser = await Cadernos.findAll({
                    where: {
                        [Op.or]: [
                            { UF: nu_doc },
                            { nomeCaderno: nu_doc }
                        ]

                    }
                });

                if (resultUser < 1) {
                    res.json({ success: false, usuarios: resultUser });
                    return;
                }

                /*                 console.log(resultUser[0].dataValues.codUf);
                 */

                const resultUser2 = await Users.findAll({
                    where: {
                        [Op.or]: [
                            { codUf: { [Op.like]: `%${resultUser[0].dataValues.codUf}%` } },
                            { codCidade: { [Op.like]: `%${resultUser[0].dataValues.codCaderno}%` } },
                        ]

                    },
                    order: [['dtCadastro', 'DESC'], ['descNome', 'ASC']],
                });
                const paginaAtual = req.query.page ? parseInt(req.query.page) : 1;

                // Número total de itens
                const totalItens = resultUser2.length;
                console.log("dasdads", totalItens)
                // Número total de páginas
                const totalPaginas = Math.ceil(totalItens / 10);

                res.json({
                    success: true, usuarios: resultUser2, paginaAtual: paginaAtual,
                    totalPaginas: totalPaginas, totalItem: totalItens
                });
                return;
            }

            //res.json({ success: true, usuarios: resultUser });
            /*  console.log(resultUser);
             return; */

            /*      const consultarRegistros = await Cadernos.findAll({
                     where: {
                         keyValue: "total_usuarios"
                     },
                     raw: true
                 })
     
                 console.log(consultarRegistros)
                 return; */

            const totalItens = resultUser.count;
            const totalPaginas = Math.ceil(totalItens / porPagina);

            res.json({ success: true, usuarios: resultUser.rows, totalItem: totalItens, totalPaginas: totalPaginas, paginaAtual: paginaAtual, });

        } else {
            //Atividades
            const resultUser = await Users.findAll();

            if (resultUser < 1) {
                res.json({ success: false, message: "Usuario não encontrado" });
                return;
            }

            res.json({ success: true, usuarios: resultUser });
        }
        /* 
                if(nu_doc == "formList") {
                    const resultUser = await Users.findAll({
                        where: {
                            [Op.or]: [
                                { codUf: { [Op.like]: `%${resultUser[0].dataValues.codUf}%` } },
                                { codCidade: { [Op.like]: `%${resultUser[0].dataValues.codCaderno}%` } },
                            ]
        
                        },
                        order: [['dtCadastro', 'DESC'], ['descNome', 'ASC']],
                    });
        
        
                    res.json({ success: true, usuarios: resultUser });
                }
         */
        async function buscarPorTipoUsuario(codigo) {
            const resultUser = await Users.findAndCountAll({
                where: {
                    [Op.or]: [
                        { codTipoUsuario: codigo },
                    ]

                },
                order: [['descNome', 'ASC']],//['dtCadastro', 'DESC'], 
                attributes: [
                    'codUsuario',
                    'descCPFCNPJ',
                    'descNome',
                    'descEmail',
                    'senha',
                    'codTipoUsuario',
                    'codUf',
                    'codCidade',
                    'dtCadastro',
                    'ativo'
                ],
            });

            const totalItens = resultUser.count;
            const totalPaginas = Math.ceil(totalItens / porPagina);

            res.json({ success: true, usuarios: resultUser.rows, totalItem: totalItens, totalPaginas: totalPaginas });
        }


    }

}






