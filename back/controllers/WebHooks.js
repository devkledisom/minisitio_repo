const crypto = require('crypto');
const config = require('../config/config');
const moment = require('moment');
const { MercadoPagoConfig, Payment, PaymentMethods, Preference } = require('mercadopago');

const Pagamento = require('../models/table_pagamentos');
const Anuncio = require('../models/table_anuncio');
const Desconto = require('../models/table_desconto');
const Globals = require('../models/table_globals');
const Campanha = require('../models/table_campanha');
const TokensPromocao = require('../models/tokens_promocao');


const { novoUsuario } = require('../functions/sendMailer');

//const client = new MercadoPagoConfig({ accessToken: config.MP_ACCESS_TOKEN_SANDBOX, options: { timeout: 5000, idempotencyKey: 'abc' } });
const client = new MercadoPagoConfig({ accessToken: config.mp_prod.AccessToken, options: { timeout: 5000, idempotencyKey: 'abc' } });

const payment = new Payment(client);
const preference = new Preference(client);

const requestOptions = {
    idempotencyKey: "" + Date.now(),
};

module.exports = {
    atualizarPagamentos: async (req, res) => {
        try {
            const signatureHeader = req.headers["x-signature"];
            const requestId = req.headers["x-request-id"];
            const { data } = req.body;
            const objData = req.body;

            console.log("Dados recebidos no webhook:", objData);

            registrarPagamento(req.body, res);

            /*   if (objData.action === 'payment.created') {
                  
              } */


            return res.status(200).send("OK");

            if (objData.resource) {
                const response = await fetch(`${objData.resource}?access_token=${config.MP_ACCESS_TOKEN_SANDBOX}`);
                const paymentData = await response.json();
                console.log("Recurso de pagamento aprovado recebido:", paymentData);
                if (paymentData.status !== 'approved') {
                    return res.status(200).send("Pagamento não aprovado, webhook ignorado.");
                }

                console.log("Recurso de pagamento aprovado recebido:", paymentData);

                novoRegistrarPagamento(paymentData);

                return res.status(200).send("OK");

            }



            /*  console.log("Recebido webhook:", req.body, signatureHeader);
 
             if (!signatureHeader) {
                 return res.status(400).send("Header x-signature ausente.");
             }
 
             // Divide `x-signature` para obter `ts` e `v1`
             const [tsPart, v1Part] = signatureHeader.split(",");
             const ts = tsPart.split("=")[1];
             const receivedSignature = v1Part.split("=")[1];
 
             if (!ts || !receivedSignature) {
                 return res.status(400).send("Formato inválido do header x-signature.");
             }
 
 
 
             // Monta o template preenchido
             let template = `id:${data?.id?.toLowerCase() || ""};`;
             if (requestId) template += `request-id:${requestId};`;
             template += `ts:${ts};`;
 
             // Gera HMAC SHA256 usando o template preenchido
             const hmac = crypto.createHmac("sha256", config.SECRET_KEY_WEBHOOK);
             hmac.update(template, "utf8");
             const calculatedSignature = hmac.digest("hex"); */

            const [tsPart, v1Part] = signatureHeader.split(",");
            const ts = tsPart.split("=")[1];
            const receivedSignature = v1Part.split("=")[1];

            let template = `id:${data?.id || ""};`;
            if (requestId) template += `request-id:${requestId};`;
            template += `ts:${ts};`;

            const cypheredSignature = crypto
                .createHmac('sha256', config.SECRET_KEY_WEBHOOK)
                .update(template)
                .digest('hex');

            console.log("❌ Falha na autenticação do webhook.", cypheredSignature, receivedSignature, req.body, template);
            // Compara a assinatura recebida com a gerada
            if (cypheredSignature !== receivedSignature) {

                return res.status(403).send("Assinatura inválida.");
            }

            registrarPagamento(req.body);
            console.log("✅ Webhook autenticado com sucesso!");
            res.status(200).send("Webhook processado com sucesso.");
        } catch (error) {
            console.error("Erro ao processar webhook:", error);
            res.status(500).send("Erro interno no servidor.");
        }
    },
    criarPagamento: async (req, res) => {

        let codigoReferenciaMp = req.params.id;
        let codDesconto = req.params.codDesconto;

        const perfilMinisitio = await Anuncio.findOne({ where: { codAnuncio: codigoReferenciaMp }, raw: true, attributes: ['codAnuncio', 'descAnuncio', 'codDesconto'] });

        const valorDesconto = perfilMinisitio.codDesconto ? await Desconto.findOne({ where: { hash: perfilMinisitio.codDesconto }, raw: true, attributes: ['hash', 'desconto'] }) : null;

        const valorBase = await Globals.findOne({
            where: { keyValue: "precoBase" },
            raw: true
        });



        let option1 = perfilMinisitio.codDesconto ? ((valorBase.value / 12) - valorDesconto.desconto) * 12 : Number(valorBase.value);

        //console.log("valorDesconto", valorDesconto, option1);


        const body = {
            "notification_url": "https://minisitio.com.br/api/webhook",
            //"notification_url": "https://8d95d3b55340.ngrok-free.app/api/webhook",
            "external_reference": codigoReferenciaMp,
            "auto_return": "approved",
            "statement_descriptor": "MINISITIO",
            "items": [
                {
                    "title": "Assinatura anual Minisitio",
                    "quantity": 1,
                    "currency_id": "BRL",
                    "unit_price": option1
                }
            ],
            "back_urls": {
                "success": `${config.domain}/perfil/${codigoReferenciaMp}`,
                "failure": `${config.domain}/perfil/${codigoReferenciaMp}`,
                "pending": `${config.domain}/perfil/${codigoReferenciaMp}`
            }
        };

        /*    console.log(body, valorDesconto, codDesconto)
           return; */

        preference.create({ body })
            .then((data) => {
                console.log(data);
                res.status(200).json({ success: true, url: data.init_point });
            })
            .catch((error) => {
                console.error(error);
                res.status(500).json({ success: false, error: 'Erro ao criar preferência' });
            });


        /*   const gerarPreferencia = await preference.create({ body })
              .then((data) => { console.log(data), res.status(200).json({ success: true, url: data.init_point }) })
              .catch(console.log); */

        /* 
                const body = {
                    transaction_amount: parseFloat(0.02),
                    payer: {
                        email: "devkledisom@gmail.com"
                    },
                    payment_method_id: "pix"
                };
        
        
        
                payment.create({ body, requestOptions }).then(console.log).catch(console.log);
        
        
                res.status(200).send("pagamento processado com sucesso."); */

    }
}

async function novoRegistrarPagamento(data) {

    console.log("Recurso de pagamento aprovado recebido:", data);

    if (data.payments.status === 'approved') {

        let codigoReferenciaMp = data.external_reference;

        const perfilMinisitio = await Anuncio.findOne({ where: { codAnuncio: codigoReferenciaMp }, raw: true, attributes: ['codAnuncio', 'descAnuncio'] });

        try {
            const atualizarPagamento = await Pagamento.update({
                status: res.status,
                data: Date.now()
            }, {
                where: {
                    id_mp: data.data.id,
                }

            })
            console.log(atualizarPagamento)

            if (res.status == "approved") {
                const perfil = await Anuncio.findOne({
                    where: {
                        codAnuncio: codigoReferenciaMp
                    },
                    raw: true
                });

                const idCampanha = await Campanha.findOne({
                    where: {
                        id_origem: perfil.codDesconto
                    },
                    raw: true
                })

                const perfilActivate = await Anuncio.update({
                    "codDesconto": idCampanha.id_promocional,
                    "activate": 1,
                    "codTipoAnuncio": "3",
                    "dtCadastro2": Date.now(),
                    "dueDate": moment(Date.now()).add(1, 'year').toISOString()
                }, {
                    where: {
                        codAnuncio: codigoReferenciaMp
                    }
                });

            }
        } catch (err) {
            console.log(err)
        }
    }
    if (data.action === 'payment.created') {
        fetch(`https://api.mercadopago.com/v1/payments/${data.data.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                //'Authorization': `Bearer ${config.MP_ACCESS_TOKEN_SANDBOX}`
                'Authorization': `Bearer ${config.mp_prod.AccessToken}`
            }
        })
            .then(x => x.json())
            .then(async res => {

                console.log(res.external_reference)
                if (res.message === 'Payment not found') return;

                try {
                    let codigoReferenciaMp = res.external_reference;

                    const perfilMinisitio = await Anuncio.findOne({ where: { codAnuncio: codigoReferenciaMp }, raw: true, attributes: ['codAnuncio', 'descAnuncio'] });

                    const pagamento = await Pagamento.create({
                        cliente: perfilMinisitio.descAnuncio,
                        valor: res.transaction_amount,
                        data: res.date_created,
                        status: definirStatus(res.status),
                        id_mp: data.data.id,
                        ref_mp_codAnuncio: codigoReferenciaMp
                    })

                    function definirStatus(status) {
                        switch (status) {
                            case "pending":
                                return "Pendente";
                            case "approved":
                                return "Aprovado";
                            case "cancelled":
                                return "Cancelado";
                            default:
                                return "não informado";
                        }
                    };

                    if (res.status == "approved") {
                        const perfil = await Anuncio.findOne({
                            where: {
                                codAnuncio: codigoReferenciaMp
                            },
                            raw: true
                        });

                        const idCampanha = await Campanha.findOne({
                            where: {
                                id_origem: perfil.codDesconto
                            },
                            raw: true
                        })

                        const perfilActivate = await Anuncio.update({
                            "codDesconto": idCampanha.id_promocional,
                            "activate": 1,
                            "codTipoAnuncio": "3",
                            "dtCadastro2": Date.now(),
                            "dueDate": moment(Date.now()).add(1, 'year').toISOString()
                        }, {
                            where: {
                                codAnuncio: codigoReferenciaMp
                            }
                        });
                    }

                    /*  const atualizarAnuncio = await Anuncio.update({}, {
                         where: {
                             codAnuncio: req.query.id
                         }
                     }); */


                } catch (err) {
                    console.log(err)
                }



            })
    }

    if (data.action === 'payment.updated') {

        fetch(`https://api.mercadopago.com/v1/payments/${data.data.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                //'Authorization': `Bearer ${config.MP_ACCESS_TOKEN_SANDBOX}`
                'Authorization': `Bearer ${config.mp_prod.AccessToken}`
            }
        })
            .then(x => x.json())
            .then(async res => {

                console.log(res)
                if (res.message === 'Payment not found') return;

                let codigoReferenciaMp = res.external_reference;

                const perfilMinisitio = await Anuncio.findOne({ where: { codAnuncio: codigoReferenciaMp }, raw: true, attributes: ['codAnuncio', 'descAnuncio'] });

                try {
                    const atualizarPagamento = await Pagamento.update({
                        status: res.status,
                        data: Date.now()
                    }, {
                        where: {
                            id_mp: data.data.id,
                        }

                    })
                    console.log(atualizarPagamento)

                    if (res.status == "approved") {
                        const perfil = await Anuncio.findOne({
                            where: {
                                codAnuncio: codigoReferenciaMp
                            },
                            raw: true
                        });

                        const idCampanha = await Campanha.findOne({
                            where: {
                                id_origem: perfil.codDesconto
                            },
                            raw: true
                        })

                        const perfilActivate = await Anuncio.update({
                            "codDesconto": idCampanha.id_promocional,
                            "activate": 1,
                            "codTipoAnuncio": "3",
                            "dtCadastro2": Date.now(),
                            "dueDate": moment(Date.now()).add(1, 'year').toISOString()
                        }, {
                            where: {
                                codAnuncio: codigoReferenciaMp
                            }
                        });

                    }


                } catch (err) {
                    console.log(err)
                }



            })



    }
};
/* 
 registrarPagamento({
  action: 'payment.created',
  api_version: 'v1',
  data: { id: '137979341372' },
  date_created: '2025-12-15T14:35:41Z',
  id: 127321861578,
  live_mode: true,
  type: 'payment',
  user_id: '712696516'
})   */

/* registrarPagamento({
    action: 'payment.updated',
    api_version: 'v1',
    data: { id: '138033834376' },
    date_created: '2025-12-15T21:01:13Z',
    id: 127320801382,
    live_mode: true,
    type: 'payment',
    user_id: '712696516'
}) */

async function registrarPagamento(data, res) {

    if (data.action === 'payment.created') {
        fetch(`https://api.mercadopago.com/v1/payments/${data.data.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                //'Authorization': `Bearer ${config.MP_ACCESS_TOKEN_SANDBOX}`
                'Authorization': `Bearer ${config.mp_prod.AccessToken}`
            }
        })
            .then(x => x.json())
            .then(async res => {

                console.log(res)
                if (res.message === 'Payment not found') return;

                try {
                    let codigoReferenciaMp = res.external_reference;

                    const perfilMinisitio = await Anuncio.findOne({ where: { codAnuncio: codigoReferenciaMp }, raw: true, attributes: ['codAnuncio', 'descAnuncio'] });

                    const pagamento = await Pagamento.create({
                        cliente: perfilMinisitio.descAnuncio,
                        valor: res.transaction_amount,
                        data: res.date_created,
                        status: definirStatus(res.status),
                        id_mp: data.data.id,
                        ref_mp_codAnuncio: codigoReferenciaMp
                    })


                    if (res.status == "approved") {
                        const perfil = await Anuncio.findOne({
                            where: {
                                codAnuncio: codigoReferenciaMp
                            },
                            raw: true
                        });

                        const idDesconto = await Desconto.findOne({
                            where: {
                                hash: perfil.codDesconto
                            },
                            raw: true
                        })

                        const idCampanha = await Campanha.findOne({
                            where: {
                                id_origem: idDesconto.idDesconto
                            },
                            raw: true
                        })

                        const objUpdated = {
                            "activate": 1,
                            "codTipoAnuncio": "3",
                            "dtCadastro2": Date.now(),
                            "dueDate": moment(Date.now()).add(1, 'year').toISOString()
                        };

                        console.log("idCampanha", idCampanha);

                        //enviar email para novo perfil pago
                        novoUsuario(perfil.descEmailAutorizante, perfil.descNomeAutorizante, perfil.descCPFCNPJ, perfil.codAnuncio);

                        //atualizar status do pagamento na tabela tokens_promoção
                        await TokensPromocao.update({
                            statusPagamento: "pago"
                        }, {
                            where: {
                                codAnuncio: codigoReferenciaMp
                            }
                        });

                        //atualizar o codDesconto apenas se existir a campanha
                        if (idCampanha) {
                            objUpdated.codDesconto = await getDescontoPorHash(idCampanha.idPromocional);
                        }

                        const perfilActivate = await Anuncio.update(objUpdated, {
                            where: {
                                codAnuncio: codigoReferenciaMp
                            }
                        });

                        res.status(200).send("OK");
                    }

                } catch (err) {
                    console.log(err)
                }



            })
    }

    if (data.action === 'payment.updated') {

        fetch(`https://api.mercadopago.com/v1/payments/${data.data.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                //'Authorization': `Bearer ${config.MP_ACCESS_TOKEN_SANDBOX}`
                'Authorization': `Bearer ${config.mp_prod.AccessToken}`
            }
        })
            .then(x => x.json())
            .then(async res => {

                console.log(res)
                if (res.message === 'Payment not found') return;

                let codigoReferenciaMp = res.external_reference;

                const perfilMinisitio = await Anuncio.findOne({ where: { codAnuncio: codigoReferenciaMp }, raw: true, attributes: ['codAnuncio', 'descAnuncio'] });

                try {
                    const atualizarPagamento = await Pagamento.update({
                        status: definirStatus(res.status),
                        data: Date.now()
                    }, {
                        where: {
                            id_mp: data.data.id,
                        }

                    })
                    console.log(atualizarPagamento)

                    if (res.status == "approved") {
                        const perfil = await Anuncio.findOne({
                            where: {
                                codAnuncio: codigoReferenciaMp
                            },
                            raw: true
                        });

                        const idDesconto = await Desconto.findOne({
                            where: {
                                hash: perfil.codDesconto
                            },
                            raw: true
                        })

                        const idCampanha = await Campanha.findOne({
                            where: {
                                id_origem: idDesconto.idDesconto
                            },
                            raw: true
                        })

                        console.log("idCampanha", idDesconto, idCampanha, await getDescontoPorHash(idCampanha.idPromocional));

                        const perfilActivate = await Anuncio.update({
                            "codDesconto": await getDescontoPorHash(idCampanha.idPromocional),
                            "activate": 1,
                            "codTipoAnuncio": "3",
                            "dtCadastro2": Date.now(),
                            "dueDate": moment(Date.now()).add(1, 'year').toISOString()
                        }, {
                            where: {
                                codAnuncio: codigoReferenciaMp
                            }
                        });

                        //enviar email para novo perfil pago
                        novoUsuario(perfil.descEmailAutorizante, perfil.descNomeAutorizante, perfil.descCPFCNPJ, perfil.codAnuncio);

                        //atualizar status do pagamento na tabela tokens_promoção
                        await TokensPromocao.update({
                            statusPagamento: "pago"
                        }, {
                            where: {
                                codAnuncio: codigoReferenciaMp
                            }
                        });


                    }


                } catch (err) {
                    console.log(err)
                }



            })



    }
};

async function getDescontoPorHash(nuHash) {
    const idDesconto = await Desconto.findOne({
        where: {
            idDesconto: nuHash
        },
        raw: true
    })

    return idDesconto.hash;
};

function definirStatus(status) {
    switch (status) {
        case "pending":
            return "Pendente";
        case "approved":
            return "Aprovado";
        case "cancelled":
            return "Cancelado";
        case "rejected":
            return "Rejeitado";
        default:
            return "não informado";
    }
};


async function registrarPagamentoOld(data) {

    if (data.action === 'payment.created') {
        fetch(`https://api.mercadopago.com/v1/payments/${data.data.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                //'Authorization': `Bearer ${config.MP_ACCESS_TOKEN_SANDBOX}`
                'Authorization': `Bearer ${config.mp_prod.AccessToken}`
            }
        })
            .then(x => x.json())
            .then(async res => {

                console.log(res.external_reference)
                if (res.message === 'Payment not found') return;

                try {
                    let codigoReferenciaMp = res.external_reference;

                    const perfilMinisitio = await Anuncio.findOne({ where: { codAnuncio: codigoReferenciaMp }, raw: true, attributes: ['codAnuncio', 'descAnuncio'] });

                    const pagamento = await Pagamento.create({
                        cliente: perfilMinisitio.descAnuncio,
                        valor: res.transaction_amount,
                        data: res.date_created,
                        status: definirStatus(res.status),
                        id_mp: data.data.id,
                        ref_mp_codAnuncio: codigoReferenciaMp
                    })

                    function definirStatus(status) {
                        switch (status) {
                            case "pending":
                                return "Pendente";
                            case "approved":
                                return "Aprovado";
                            case "cancelled":
                                return "Cancelado";
                            default:
                                return "não informado";
                        }
                    };

                    if (res.status == "approved") {
                        const perfil = await Anuncio.findOne({
                            where: {
                                codAnuncio: codigoReferenciaMp
                            },
                            raw: true
                        });

                        const idCampanha = await Campanha.findOne({
                            where: {
                                id_origem: perfil.codDesconto
                            },
                            raw: true
                        })

                        const perfilActivate = await Anuncio.update({
                            "codDesconto": idCampanha.id_promocional,
                            "activate": 1,
                            "codTipoAnuncio": "3",
                            "dtCadastro2": Date.now(),
                            "dueDate": moment(Date.now()).add(1, 'year').toISOString()
                        }, {
                            where: {
                                codAnuncio: codigoReferenciaMp
                            }
                        });
                    }

                    /*  const atualizarAnuncio = await Anuncio.update({}, {
                         where: {
                             codAnuncio: req.query.id
                         }
                     }); */


                } catch (err) {
                    console.log(err)
                }



            })
    }

    if (data.action === 'payment.updated') {

        fetch(`https://api.mercadopago.com/v1/payments/${data.data.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                //'Authorization': `Bearer ${config.MP_ACCESS_TOKEN_SANDBOX}`
                'Authorization': `Bearer ${config.mp_prod.AccessToken}`
            }
        })
            .then(x => x.json())
            .then(async res => {

                console.log(res)
                if (res.message === 'Payment not found') return;

                let codigoReferenciaMp = res.external_reference;

                const perfilMinisitio = await Anuncio.findOne({ where: { codAnuncio: codigoReferenciaMp }, raw: true, attributes: ['codAnuncio', 'descAnuncio'] });

                try {
                    const atualizarPagamento = await Pagamento.update({
                        status: res.status,
                        data: Date.now()
                    }, {
                        where: {
                            id_mp: data.data.id,
                        }

                    })
                    console.log(atualizarPagamento)

                    if (res.status == "approved") {
                        const perfil = await Anuncio.findOne({
                            where: {
                                codAnuncio: codigoReferenciaMp
                            },
                            raw: true
                        });

                        const idCampanha = await Campanha.findOne({
                            where: {
                                id_origem: perfil.codDesconto
                            },
                            raw: true
                        })

                        const perfilActivate = await Anuncio.update({
                            "codDesconto": idCampanha.id_promocional,
                            "activate": 1,
                            "codTipoAnuncio": "3",
                            "dtCadastro2": Date.now(),
                            "dueDate": moment(Date.now()).add(1, 'year').toISOString()
                        }, {
                            where: {
                                codAnuncio: codigoReferenciaMp
                            }
                        });

                    }


                } catch (err) {
                    console.log(err)
                }



            })



    }
};



