const fs = require('fs');

//streams
const express = require('express');
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server);
const ExcelJS = require('exceljs');
const masterPath = require('../../../config/config');
const moment = require('moment');
const csv = require('csv-parser');
const archiver = require("archiver");

//models
const database = require('../../../config/db');
const Anuncio = require('../../../models/table_anuncio');
const importStage = require('../../../models/table_importStage');
const Atividade = require('../../../models/table_atividade');
const Caderno = require('../../../models/table_caderno');
const Cadernos = require('../../../models/table_caderno');
const Descontos = require('../../../models/table_desconto');
const Promocao = require('../../../models/table_promocao');
const Globals = require('../../../models/table_globals');
const Pagamento = require('../../../models/table_pagamentos');
const Uf = require('../../../models/table_uf');
const Usuarios = require('../../../models/table_usuarios');
const Campanha = require('../../../models/table_campanha');
const TokensPromocao = require('../../../models/tokens_promocao');




//Functions
const exportExcell = require('../../../functions/server');

//moduls
const Sequelize = require('sequelize');
const Desconto = require('../../../models/table_desconto');
const { Op } = Sequelize;
const readXlsxFile = require('read-excel-file/node');
const path = require('path');




module.exports = {
    gerarCampanha: async (req, res) => {
        const criarCampanha = await Campanha.create({
            idPromocional: req.body.idPromocional,
            dataFim: req.body.dataFim,
            criador: req.body.criador,
            uf: req.body.uf,
            caderno: req.body.caderno,
        }).then(async (resultCampanha) => {

            const idPromo = await Descontos.findOne({
                where: {
                    idDesconto: req.body.idPromocional
                },
                attributes: ['hash']
            });

            let whereClause = "";

            if (req.body.uf && req.body.caderno) {
                // quando tem UF + Caderno
                whereClause = "a.codUf = :uf AND a.codCaderno = :caderno";
            } else if (idPromo.hash) {
                // quando só tem idPromo
                whereClause = "a.codDesconto = :idPromo";
            }


            await database.query(`
            INSERT IGNORE INTO tokens_promocao (campanhaId, codAnuncio, tokenPromocao, dataLimitePromocao, createdAt, updatedAt)
            SELECT 
                :campanhaId AS campanhaId,
                a.codAnuncio,
                SHA1(CONCAT(a.descCPFCNPJ, 'PROMOCAO2025', a.codDesconto)) AS tokenPromocao,
                DATE_ADD(NOW(), INTERVAL 30 DAY) AS dataLimitePromocao,
                NOW(),
                NOW()
            FROM anuncio a
            WHERE ${whereClause}
          `,
                {
                    replacements: {
                        uf: req.body.uf,
                        caderno: req.body.caderno,
                        campanhaId: resultCampanha.id,
                        idPromo: idPromo.hash
                    }
                });

gerarCSVGeral(TokensPromocao, resultCampanha.id);
           /*  const campanhas = await Campanha.findAll().then((result) => {

                //gerarCSV(TokensPromocao, "./public/upload/campanha/" + "campanha-" + resultCampanha.id + ".csv", resultCampanha.id);

                

                //return res.json({ success: true, data: result });
            }).catch((error) => {
                console.error("Erro ao listar campanhas:", error);
                //return res.status(500).json({ success: false, message: "Erro ao listar campanhas." });
            }); */


            return res.json({ success: true, message: "Campanha criada com sucesso!" });
        }).catch((error) => {
            console.error("Erro ao criar campanha:", error);
            return res.status(500).json({ success: false, message: "Erro ao criar campanha." });
        });
    },
    listarCampanha: async (req, res) => {
        const campanhas = await Campanha.findAll(
            {
                include: [
                    {
                        model: Desconto,
                        as: "desconto", // mesmo alias definido na associação
                        //attributes: ["idDesconto"] // quais campos do usuário trazer
                        include: [
                            {
                                model: Usuarios,
                                as: "usuario", // alias da associação Desconto -> Usuario
                                attributes: ["descNome"]
                            }
                        ]
                    }
                ]
            }
        ).then((result) => {
            return res.json({ success: true, data: result });
        }).catch((error) => {
            console.error("Erro ao listar campanhas:", error);
            return res.status(500).json({ success: false, message: "Erro ao listar campanhas." });
        });
    },
    listarUserCampanha: async (req, res) => {
        const registros = await TokensPromocao.findAll({
            where: {
                tokenPromocao: req.params.hash
            },
            /*          include: [
                         {
                             model: Anuncio,
                             as: "promo",
                             //attributes: ["descAnuncio", "descCPFCNPJ", "descEmailRetorno"]
                         }
                     ], */
            attributes: ["codAnuncio"],
            raw: true
        })
            .then((result) => {
                return res.json({ success: true, data: result });
            }).catch((error) => {
                console.error("Erro ao listar campanhas:", error);
                return res.status(500).json({ success: false, message: "Erro ao listar campanhas." });
            });

        console.log(registros);
    },
    cancelarCampanha: async (req, res) => {

        try {
            // Apaga a campanha
            const apagarCampanha = await Campanha.destroy({
                where: { id: req.params.id }
            });

            // Apaga os tokens vinculados
            const apagarTokens = await TokensPromocao.destroy({
                where: { campanhaId: req.params.id }
            });

            fs.unlink("./public/upload/campanha/" + "campanha-" + req.params.id + ".csv", (err) => {
                if (err) {
                    console.error("Erro ao apagar CSV:", err);
                    return;
                }
                console.log("CSV apagado com sucesso!");
            });

            return res.json({
                success: true,
                data: { apagarCampanha, apagarTokens }
            });

        } catch (error) {
            console.error("Erro ao cancelar campanha:", error);
            return res.status(500).json({
                success: false,
                message: "Erro ao cancelar campanha."
            });
        }
    },
}


const { Parser } = require("@json2csv/plainjs");

//gerarCSV(TokensPromocao, "./public/upload/campanha/" + "campanha-" + 27 + ".csv");
// Função para gerar CSV

async function gerarCSVGeral(model, idCampanha) {
    const BATCH_SIZE = 100000; // número de registros por arquivo
    let offset = 0;
    let fileIndex = 1;
    const tempDir = "./public/upload/campanha";
    const zipFilePath = path.join(tempDir, `email-marketing-${idCampanha}.zip`);

    const fields = [
        { label: "Código do Anúncio", value: "codAnuncio" },
        {
            label: "url_perfil",
            value: (row) => `${masterPath.urlPublic}/promocao/${row.tokenPromocao}`
        },
       /*  { label: "Data Limite", value: "dataLimitePromocao" }, */
        { label: "Nome Anúncio", value: "promo.descAnuncio" },
        /* { label: "Documento", value: "promo.descCPFCNPJ" }, */
        { label: "Email de Retorno", value: "promo.descEmailRetorno" },
    ];

    const json2csvParser = new Parser({ fields, header: true });
    const csvFiles = [];

    try {
        console.log("Iniciando exportação em lotes de 100 registros...");

        while (true) {
            const registros = await model.findAll({
                include: [
                    {
                        model: Anuncio,
                        as: "promo",
                        attributes: ["descAnuncio", "descEmailRetorno"]
                    }
                ],
                where: { campanhaId: idCampanha },
                attributes: ["codAnuncio", "tokenPromocao"],
                raw: true,
                limit: BATCH_SIZE,
                offset: offset,
            });

            if (registros.length === 0) {
                console.log("Exportação concluída!");
                break;
            }

            const fileName = `lote_${fileIndex}.csv`;
            const outputPath = path.join(tempDir, fileName);

            // Converter e salvar CSV
            const csv = json2csvParser.parse(registros);
            fs.writeFileSync(outputPath, csv, "utf8");

            csvFiles.push(outputPath);
            console.log(`Arquivo ${fileName} gerado (${registros.length} registros).`);

            offset += BATCH_SIZE;
            fileIndex++;
        }

        // === Cria o arquivo ZIP ===
        console.log("Compactando arquivos CSV em um ZIP...");
        const output = fs.createWriteStream(zipFilePath);
        const archive = archiver("zip", { zlib: { level: 9 } });

        archive.pipe(output);

        // Adiciona todos os CSVs ao ZIP
        for (const filePath of csvFiles) {
            archive.file(filePath, { name: path.basename(filePath) });
        }

        await archive.finalize();

        // Espera a gravação do ZIP terminar
        await new Promise((resolve, reject) => {
            output.on("close", resolve);
            archive.on("error", reject);
        });

        console.log(`ZIP gerado com sucesso: ${zipFilePath}`);

        // === Remove arquivos CSV temporários ===
        for (const filePath of csvFiles) {
            fs.unlinkSync(filePath);
        }
        console.log("Arquivos CSV temporários removidos.");

        return zipFilePath;
    } catch (error) {
        console.error("Erro ao gerar CSV:", error);
    }
}




