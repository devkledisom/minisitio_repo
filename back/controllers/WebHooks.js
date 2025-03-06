const crypto = require('crypto');
const config = require('../config/config');
const { MercadoPagoConfig, Payment } = require('mercadopago');

const Pagamento = require('../models/table_pagamentos');

const client = new MercadoPagoConfig({ accessToken: config.MP_ACCESS_TOKEN_SANDBOX, options: { timeout: 5000, idempotencyKey: 'abc' } });

const payment = new Payment(client);

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
        const body = {
            transaction_amount: parseFloat(0.02),
            payment_method_id: "Visa",
            payer: {
                email: "devkledisom@gmail.com"
            },
        };



        payment.create({ body, requestOptions }).then(console.log).catch(console.log);




        async function executarPagamento() {

            let id = "" + Date.now();

            const dados = {
                items: [
                    item = {
                        id: id,
                        description: "2x tesrt",
                        quantity: 1,
                        currency_id: 'BRL',
                        unit_price: parseFloat(150)
                    }
                ],
                payer: {
                    email: "devkledisom@gmail.com"
                },
                external_reference: id
            }

            const pagamento = await MercadoPago.preferences.create(dados);
            console.log(pagamento)

        
           
        }
        
        // Executar a função
        //executarPagamento();
        
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

function registrarPagamento(data) {
    console.log(data)
    if(data.action === 'payment.updated') {
        fetch(`https://api.mercadopago.com/v1/payments/${data.data.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.mp_prod.AccessToken}`
            }
        })
        .then(x=>x.json())
        .then(async res => {
            
            console.log(res)
            if(res.message === 'Payment not found') return;

            const pagamento = await Pagamento.create({
                id: res.id,
                cliente: res.payer.identification.number,
                valor: res.transaction_amount,
                data: res.date_created
            })

            console.log(pagamento)
        })
    }
};


const testoj = {
    "id": 20359978,
    "date_created": "2019-07-10T14:47:58.000Z",
    "date_approved": "2019-07-10T14:47:58.000Z",
    "date_last_updated": "2019-07-10T14:47:58.000Z",
    "money_release_date": "2019-07-24T14:47:58.000Z",
    "issuer_id": 25,
    "payment_method_id": "visa",
    "payment_type_id": "credit_card",
    "status": "approved",
    "status_detail": "accredited",
    "currency_id": "BRL",
    "description": "Point Mini a maquininha que dá o dinheiro de suas vendas na hora.",
    "taxes_amount": 0,
    "shipping_amount": 0,
    "collector_id": 448876418,
    "payer": {
      "id": 123,
      "email": "test_user_80507629@testuser.com",
      "identification": {
        "number": 19119119100,
        "type": "CPF"
      },
      "type": "customer"
    },
    "metadata": {},
    "additional_info": {
      "items": [
        {
          "id": "PR0001",
          "title": "Point Mini",
          "description": "Producto Point para cobros con tarjetas mediante bluetooth",
          "picture_url": "https://http2.mlstatic.com/resources/frontend/statics/growth-sellers-landings/device-mlb-point-i_medium2x.png",
          "category_id": "electronics",
          "quantity": 1,
          "unit_price": 58
        }
      ],
      "payer": {
        "registration_date": "2019-01-01T15:01:01.000Z"
      },
      "shipments": {
        "receiver_address": {
          "street_name": "Av das Nacoes Unidas",
          "street_number": "3003",
          "zip_code": "12312-123",
          "city_name": "Buzios",
          "state_name": "Rio de Janeiro"
        }
      }
    },
    "external_reference": "MP0001",
    "transaction_amount": 58,
    "transaction_amount_refunded": 50,
    "coupon_amount": 15,
    "transaction_details": {
      "net_received_amount": 56,
      "total_paid_amount": 58,
      "overpaid_amount": 0,
      "installment_amount": 58
    },
    "fee_details": [
      {
        "type": "coupon_fee",
        "amount": 2,
        "fee_payer": "payer"
      }
    ],
    "statement_descriptor": "MercadoPago",
    "installments": 1,
    "card": {
      "first_six_digits": 423564,
      "last_four_digits": 5682,
      "expiration_month": 6,
      "expiration_year": 2023,
      "date_created": "2019-07-10T14:47:58.000Z",
      "date_last_updated": "2019-07-10T14:47:58.000Z",
      "cardholder": {
        "name": "APRO",
        "identification": {
          "number": 19119119100,
          "type": "CPF"
        }
      }
    },
    "notification_url": "https://www.suaurl.com/notificacoes/",
    "processing_mode": "aggregator",
    "point_of_interaction": {
      "type": "PIX",
      "application_data": {
        "name": "NAME_SDK",
        "version": "VERSION_NUMBER"
      },
      "transaction_data": {
        "qr_code_base64": "iVBORw0KGgoAAAANSUhEUgAABRQAAAUUCAYAAACu5p7oAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAIABJREFUeJzs2luO3LiWQNFmI+Y/Zd6vRt36KGNXi7ZOBtcagHD4kNLeiLX33v8DAAAAABD879sDAAAAAAA/h6AIAAAAAGSCIgAAAACQCYoAAAAAQCYoAgAAAACZoAgAAAAAZIIiAAAAAJAJigAAAABAJigCAAAAAJmgCAAAAABkgiIAAAAAkAmKAAAAAEAmKAIAAAAAmaAIAAAAAGSCIgAAAACQCYoAAAAAQCYoAgAAAACZoAgAAAAAZIIiAAAAAJAJigAAAABAJigCA...",
        "qr_code": "00020126600014br.gov.bcb.pix0117test@testuser.com0217dados adicionais520400005303986540510.005802BR5913Maria Silva6008Brasilia62070503***6304E2CA",
        "ticket_url": "https://www.mercadopago.com.br/payments/123456789/ticket?caller_id=123456&hash=123e4567-e89b-12d3-a456-426655440000"
      }
    }
  }

/* {
    action: 'payment.updated',
    api_version: 'v1',
    data: { id: '123456' },
    date_created: '2021-11-01T02:02:02Z',
    id: '123456',
    live_mode: false,
    type: 'payment',
    user_id: 712696516
  } */




  