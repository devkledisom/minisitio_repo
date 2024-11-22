const database = require('../config/db');
const Users = require('../models/table_user_login');
const DDD = require('../models/table_ddd');
const Anuncio = require('../models/table_anuncio');
const Descontos = require('../models/table_desconto');
const Cadernos = require('../models/table_caderno');

//moduls
const Sequelize = require('sequelize');
const { Op } = Sequelize;
const { novoUsuario } = require('../functions/sendMailer');


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
            "dtCadastro": dataNow(),
            "usuarioCod": usuarioCod,
            "dtCadastro2": dataNow(),
            "dtAlteracao": dataNow(),
            "ativo": "1"
        };

        try {
            const listaUsers = await Users.create(dadosUsuario);
            if(listaUsers) {
                novoUsuario(Email, Nome, CPFCNPJ);
                console.log("sjhajklhdsajlkfsafd", listaUsers.length)
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
        await database.sync();

        const nu_doc = req.params.id;

        if (nu_doc != "all") {
            //Atividades
            const resultAnuncio = await Users.findAll({
                where: {
                    [Op.or]: [
                        { descNome: { [Op.like]: `%${nu_doc}%` } },
                        { descEmail: nu_doc },
                        { descCPFCNPJ: nu_doc }
                    ]

                },
                order: [['dtCadastro', 'DESC'], ['descNome', 'ASC']],
            });

            console.log("debug: ", resultAnuncio.length);

            if (resultAnuncio.length < 1) {
                const resultAnuncio = await Cadernos.findAll({
                    where: {
                        [Op.or]: [
                            { UF: nu_doc },
                            { nomeCaderno: nu_doc }
                        ]

                    }
                });

                if(resultAnuncio < 1) {
                    res.json({ success: false, usuarios: resultAnuncio });
                    return;
                }

/*                 console.log(resultAnuncio[0].dataValues.codUf);
 */

                const resultAnuncio2 = await Users.findAll({
                    where: {
                        [Op.or]: [
                            { codUf: { [Op.like]: `%${resultAnuncio[0].dataValues.codUf}%` } },
                            { codCidade: { [Op.like]: `%${resultAnuncio[0].dataValues.codCaderno}%` } },
                        ]

                    },
                    order: [['dtCadastro', 'DESC'], ['descNome', 'ASC']],
                });
                const paginaAtual = req.query.page ? parseInt(req.query.page) : 1;

                // Número total de itens
                const totalItens = resultAnuncio2.length;
                console.log("dasdads", totalItens)
                // Número total de páginas
                const totalPaginas = Math.ceil(totalItens / 10);

                res.json({
                    success: true, usuarios: resultAnuncio2, paginaAtual: paginaAtual,
                    totalPaginas: totalPaginas, totalItem: totalItens
                });
                return;
            } else {
                //res.json({ success: false, message: "Usuario não encontrado1" });
                //return;
            }

            res.json({ success: true, usuarios: resultAnuncio });
        } else {
            //Atividades
            const resultAnuncio = await Users.findAll();

            if (resultAnuncio < 1) {
                res.json({ success: false, message: "Usuario não encontrado" });
                return;
            }

            res.json({ success: true, usuarios: resultAnuncio });
        }


    }

}






