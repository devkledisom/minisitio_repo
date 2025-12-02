const crypto = require('crypto');
const config = require('../config/config');
const { MercadoPagoConfig, Payment, PaymentMethods, Preference } = require('mercadopago');

const Pagamento = require('../models/table_pagamentos');
const Anuncio = require('../models/table_anuncio');
const Desconto = require('../models/table_desconto');
const Globals = require('../models/table_globals');
const Campanha = require('../models/table_campanha');

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
            const calculatedSignature = hmac.digest("hex");

            // Compara a assinatura recebida com a gerada
            if (calculatedSignature !== receivedSignature) {
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

        const valorDesconto = codDesconto ? await Desconto.findOne({ where: { hash: codDesconto }, raw: true, attributes: ['hash', 'desconto'] }) : null;

        const valorBase = await Globals.findOne({
            where: { keyValue: "precoBase" },
            raw: true
        });

      

        let option1 = codDesconto ? ((valorBase.value / 12) - valorDesconto.desconto) * 12 : Number(valorBase.value);
  

        const body = {
            "notification_url": "https://minisitio.com.br/api/webhook",
            //"notification_url": "https://minisitio.com.br/api/webhook",
            "external_reference": codigoReferenciaMp,
            "items": [
                {
                    "title": "Assinatura Minisitio",
                    "quantity": 1,
                    "currency_id": "BRL",
                    "unit_price": option1
                }
            ],
            "back_urls": {
                "success": "https://minisitio.com.br/login",
                "pending": "https://minisitio.com.br/login"
            }
        };

        /*    console.log(body, valorDesconto, codDesconto)
           return; */

        const gerarPreferencia = await preference.create({ body })
            .then((data) => { console.log(data), res.status(200).json({ success: true, url: data.init_point }) })
            .catch(console.log);

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

    },
    criarPagamentoold: async (req, res) => {
        async function executarPagamento() {
            const url = "https://api.mercadopago.com/v1/advanced_payments";

            const headers = {
                "Content-Type": "application/json",
                "X-Idempotency-Key": "0d5020ed-1af6-469c-ae06-c3bec19954bb",
                "X-Meli-Session-Id": "DEVICE_ID",
                "Authorization": 'Bearer TEST-3820088477508275-012414-7ae9ad0ec7dbed5822ae4d0d1afc3db8-712696516'
            };

            const body = JSON.stringify({
                wallet_payment: {
                    transaction_amount: '125.98',
                    description: "Payment for the purchase of furniture",
                    external_reference: "Payment_seller_123",
                    forward_data: {
                        sub_merchant: {
                            sub_merchant_id: "123123",
                            mcc: "5462",
                            country: "BRA",
                            address_door_number: 1,
                            zip: "2222222",
                            document_number: "222222222222222",
                            city: "SÃO PAULO",
                            address_street: "RUA A",
                            legal_name: "LOJINHA DO ZÉ",
                            region_code_iso: "BR-MG",
                            region_code: "BR",
                            document_type: "CNPJ",
                            phone: null,
                            url: "www.nomedofacilitador.com.br"
                        }
                    },
                    /*     discount: {
                            amount: 10,
                            description: "DESC20",
                            code: null,
                            detail: {
                                cap: 1000000,
                                type: "percentage",
                                value: 10
                            }
                        } */
                },
                payer: {
                    token: "abcdef1e23f4567d8e9123eb6591ff68df74c57930551ed980239f4538a7e530",
                    type_token: "wallet-tokens"
                },
                binary_mode: false,
                capture: false
            });

            try {
                const response = await fetch(url, {
                    method: "POST",
                    headers: headers,
                    body: body
                });

                if (!response.ok) {
                    throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
                }

                const data = await response.json();
                console.log("Pagamento realizado com sucesso:", data);
            } catch (error) {
                console.error("Erro ao processar o pagamento:", error.message);
            }
        }

        // Executar a função
        executarPagamento();

    }
}

async function registrarPagamento(data) {

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



