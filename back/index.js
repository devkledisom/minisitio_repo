const express = require('express');
const app = express();
const port = 3032;

const cors = require('cors');
const path = require('path');
const fs = require('fs');
//streams
const http = require("http");
const { Server } = require('socket.io');
const cron = require('node-cron');
const { deletarPromocoesExpiradas } = require('./crons/promocao');
const { inativarCampanhasExpiradas } = require('./crons/campanha');


/* // Carregar certificados
const options = {
    key: fs.readFileSync("./certificados/code.key"),
    cert: fs.readFileSync("./certificados/code.crt"),
};
 */
const server = http.createServer(app);
const BASE_PATH = "/api";

const options = {
    cors: {
        origin: "*", // ou '*' para liberar geral (não recomendado em produção)
        methods: ["GET", "POST"]
    },
    path: "/socket.io"
}


const io = new Server(server, options);

app.use(express.json());
//app.use(express.urlencoded({ extended: true }));

const allowedOrigins = [
    'https://meufrontend.com',
    'https://admin.meufrontend.com'
];

/* app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
})); */

app.use(cors());


// Configurar EJS como motor de template
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'ejs'));

// Servir arquivos estáticos (CSS, imagens, etc.)
app.use(express.static(path.join(__dirname, 'ejs')));

//rota principal
const route = require('./routes/Routes')(io);
app.use(route);

app.use('/api', express.static('public'));
app.use('/imgdefault', express.static('public'));

app.use('/api/files', express.static(path.resolve(__dirname, "public", "upload", "img")));
app.use('/api/files/mosaicos', express.static(path.resolve(__dirname, "public", "upload", "img", "mosaico")));
app.use('/api/files/2', express.static(path.resolve(__dirname, "public", "upload", "img", "promocao")));
app.use('/api/files/3', express.static(path.resolve(__dirname, "public", "cartaoDigital")));
app.use('/api/files/institucional', express.static(path.resolve(__dirname, "public", "upload", "img", "adminInstitucional")));
app.use('/api/files/og', express.static(path.resolve(__dirname, "public", "OG")));
app.use('/api/files/campanha', express.static(path.resolve(__dirname, "public", "upload", "campanha")));


app.get('/api/files/2/download/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.resolve(__dirname, "public", "upload", "img", "promocao", filename);

    res.download(filePath, filename, (err) => {
        if (err) {
            console.error('Erro ao forçar o download:', err);
            res.status(404).send('Arquivo não encontrado');
        }
    });
});


app.get('/outapi', (req, res) => {
    console.log(req)
    res.json({})
});

// WebSocket
/* io.on("connection", (socket) => {
    console.log("🔌 Cliente conectado.", socket.id);
    socket.on('start-download', async () => {
        for (let i = 0; i <= 100; i += 10) {
            await new Promise(res => setTimeout(res, 500)); // Simula tempo
            socket.emit('download-progress', { progress: i });
        }
        socket.emit('download-complete');
    });



}); */

const saveImport = require('./functions/serverImport');
const csv = require('csv-parser');
const Atividade = require('./models/table_atividade');
const Usuarios = require('./models/table_usuarios');
const Descontos = require('./models/table_desconto');
//const Anuncio = require('./models/table_anuncio');
const ImportStage = require('./models/table_importStage');
const Caderno = require('./models/table_caderno');
const database = require('./config/db');
const Sequelize = require('sequelize');
const Globals = require('./models/table_globals');
const { Op } = Sequelize;

app.post('/api/admin/anuncio/import/:socketId', saveImport().single('uploadedfile'), async (req, res) => {
    //res.json({ success: true, message: "Importação" });


    // const io = req.io;
    const socketId = req.params.socketId;
    const readline = require('readline');

    console.log("🔌 Cliente conectado.", socketId);


    const filePath = path.join(__dirname, './public/importLog.json');
    const arquivoImportado = path.join(__dirname, './public/import/uploadedfile.csv');
    const DELAY_MS = 1000; // Delay configurável entre linhas
    let qtdaBasico = 0;
    let qtdaCompleto = 0;
    let dataObjGeral;



    const fileStream = fs.createReadStream(arquivoImportado);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let total = 0;

    for await (const line of rl) {
        if (line.trim() !== '') total++; // ignora linhas vazias
    }

    const totalLinhasCsv = total - 1;


    const salvarQtdaImportacao = await Globals.update({
        value: totalLinhasCsv
    }, {
        where: {
            keyValue: "total_importacao"
        }
    })

    /*            const consultarRegistros = await Globals.findAll({
                where: {
                    keyValue: "total_usuarios"
                },
                raw: true
            }) */



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
            /*      console.log(`Processando linha ${index}:`, totalAtual.count);
                 return; */
            try {
                if (index === 1) updateJsonName(filePath, false, 0);

                const idImport = row['idImport'];
                const codTipoAnuncio = row['TIPO'];
                const idDesconto = row['ID'];
                const nomeAnuncio = row['NOME'];
                const telefone = row['TELEFONE'];
                const cep = row['CEP'];
                const estado = row['UF'];
                const cidade = row['CIDADE'];
                let tipoAtividade = row['ATIVIDADE_PRINCIPAL_CNAE'];
                const nuDocumento = row['CNPJ_CPF'];
                const autorizante = row['AUTORIZANTE'];
                const email = row['EMAIL'];
                const senha = 12345;

                console.log(tipoAtividade)

                const verificarAtividadeExists = await Atividade.findOne({
                    where: { atividade: tipoAtividade }
                });

                if (!verificarAtividadeExists) {
                    tipoAtividade = "Compras e Serviços";
                }
                console.log("very", tipoAtividade)

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
                        descEndereco: "atualizar",
                        senha,
                        hashCode: "0",
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
                    idImport: idImport,
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
                    codDesconto: codigoDeDesconto ? codigoDeDesconto.hash : '00.000.0000',
                    descChavePix: 'chavePix',
                    qntVisualizacoes: 0,
                    codDuplicado: 0,
                    descPromocao: 0,
                    activate: 1,
                };

                dataObjGeral = dataObj;

                if (dataObj.codTipoAnuncio == 1) {
                    qtdaBasico += 1
                }

                if (dataObj.codTipoAnuncio == 3) {
                    qtdaCompleto += 1
                }

                await ImportStage.create(dataObj);
                updateJsonName(filePath, false, index);
                console.log(`Linha ${index} importada com sucesso.`);

                const progress = Math.round((index / totalLinhasCsv) * 100);

                //console.log("progredindo", progress, index, totalLinhasCsv)
                io.to(socketId).emit('download-progress', { progress });


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
            const stream = fs.createReadStream(arquivoImportado).pipe(csv({
                separator: ';',
                quote: '"',
            }));

            for await (const row of stream) {


                let codigoDeDesconto = await Descontos.findOne({ where: { hash: row["ID"] } });

                if (!codigoDeDesconto) {
                    console.log(`Processando linha ${row['ID']}:`);
                    return res.status(404).json({ success: false, message: "O codigo de ID não foi encontrado. Por favor insira um ID válido no arquivo ou gere um novo ID e tente novamente." });
                }
                await processRow(row, index);
                await new Promise(resolve => setTimeout(resolve, DELAY_MS));
                index++;
            }

            console.log("Arquivo lido com sucesso!");
            res.json({ success: true, message: "Importação" });
            updateJsonName(filePath, false, index - 1);
            // Zera o arquivo importLog.json após a última iteração
            const logInicial = {
                progress: 0,
                //fim: "",
                endProccess: true
            };
            fs.writeFileSync(filePath, JSON.stringify(logInicial, null, 2), 'utf8');



            try {

                const cadernos = await Caderno.findOne({
                    where: {
                        UF: dataObjGeral.codUf,
                        nomeCaderno: dataObjGeral.codCaderno
                    },
                    attributes: ['codCaderno', 'basico', 'completo', 'total']
                });


                if (dataObjGeral.codTipoAnuncio == 1) {
                    cadernos.basico = cadernos.basico + qtdaBasico;
                    cadernos.total = cadernos.total + (qtdaBasico + qtdaCompleto);

                    await cadernos.save();
                }

                if (dataObjGeral.codTipoAnuncio == 3) {
                    cadernos.completo = cadernos.completo + qtdaCompleto;
                    cadernos.total = cadernos.total + (qtdaBasico + qtdaCompleto);

                    await cadernos.save();
                }

                io.to(socketId).emit('download-complete');

                const query = `UPDATE importStage
                        JOIN (
                            SELECT codAnuncio, 
                                CEIL(ROW_NUMBER() OVER (ORDER BY codAtividade ASC, createdAt DESC) / 10) AS 'page_number'
                            FROM importStage
                            WHERE codUf = :estado AND codCaderno = :caderno
                        ) AS temp
                        ON importStage.codAnuncio = temp.codAnuncio
                        SET importStage.page = temp.page_number
                        WHERE importStage.codUf = :estado AND importStage.codCaderno = :caderno
                    `;

                /*        const query = `UPDATE anuncio
                         JOIN (
                             SELECT codAnuncio, 
                                 CEIL(ROW_NUMBER() OVER (ORDER BY codAtividade ASC, createdAt DESC) / 10) AS 'page_number'
                             FROM anuncio
                             WHERE codUf = :estado AND codCaderno = :caderno
                         ) AS temp
                         ON anuncio.codAnuncio = temp.codAnuncio
                         SET anuncio.page = temp.page_number
                         WHERE anuncio.codUf = :estado AND anuncio.codCaderno = :caderno
                     `; */

                database.query(query, {
                    replacements: { estado: dataObjGeral.codUf, caderno: dataObjGeral.codCaderno },
                    type: Sequelize.QueryTypes.UPDATE,
                });

                console.log(`Reorganização concluída para o estado:`, dataObjGeral.codUf);
                /* 
                                const zerarGlobalsTotalImport = await Globals.update({
                                    value: 0
                                }, {
                                    where: {
                                        keyValue: "total_importacao"
                                    }
                                }) */

            } catch (error) {
                console.error("Erro ao executar a reorganização:", error);
            }

        }

        await processFile();
    }

    // Para rodar a importação, basta chamar:
    try {
        importarPerfis();
    } catch (err) {
        console.error("Erro ao importar perfis:", err);
    }


});

function reorganizarAnuncios(codUf, codCaderno) {

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
            replacements: { estado: codUf, caderno: codCaderno },
            type: Sequelize.QueryTypes.UPDATE,
        });

        console.log(`Reorganização concluída para o estado:`, codUf);
    } catch (error) {
        console.error("Erro ao executar a reorganização:", error);
    }
}

//reorganizarAnuncios("DF", "SUDOESTE - OCTOGONAL")



cron.schedule('*/5 * * * *', () => {
    console.log('Deletando promoções expiradas...');
    deletarPromocoesExpiradas();
});

cron.schedule('0 5 * * *', () => {
    console.log('inativando campanhas expiradas...');
    inativarCampanhasExpiradas();
});


server.listen(port, () => {
    console.log("rodando na porta: ", port);
});




/*
app.post('/api/admin/anuncio/import/:socketId', saveImport().single('uploadedfile'), async (req, res) => {
    res.json({ success: true, message: "Importação" });

    // const io = req.io;
    const socketId = req.params.socketId;
    const readline = require('readline');

    console.log("🔌 Cliente conectado.", socketId);


    const filePath = path.join(__dirname, './public/importLog.json');
    const arquivoImportado = path.join(__dirname, './public/import/uploadedfile.csv');
    const DELAY_MS = 1000; // Delay configurável entre linhas
    let qtdaBasico = 0;
    let qtdaCompleto = 0;
    let dataObjGeral;



    const fileStream = fs.createReadStream(arquivoImportado);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let total = 0;

    for await (const line of rl) {
        if (line.trim() !== '') total++; // ignora linhas vazias
    }

    const totalLinhasCsv = total - 1;



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
          
            try {
                if (index === 1) updateJsonName(filePath, false, 0);

                const codTipoAnuncio = row['TIPO'];
                const idDesconto = row['ID'];
                const nomeAnuncio = row['NOME'];
                const telefone = row['TELEFONE'];
                const cep = row['CEP'];
                const estado = row['UF'];
                const cidade = row['CIDADE'];
                let tipoAtividade = row['ATIVIDADE_PRINCIPAL_CNAE'];
                const nuDocumento = row['CNPJ_CPF'];
                const autorizante = row['AUTORIZANTE'];
                const email = row['EMAIL'];
                const senha = 12345;

                const verificarAtividadeExists = await Atividade.findOne({
                    where: { atividade: tipoAtividade }
                });

                if (!verificarAtividadeExists) {
                    tipoAtividade = "Compras e Serviços";
                }
                console.log("very", tipoAtividade)

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
                        descEndereco: "atualizar",
                        senha,
                        hashCode: "0",
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

                dataObjGeral = dataObj;

                if (dataObj.codTipoAnuncio == 1) {
                    qtdaBasico += 1
                }

                if (dataObj.codTipoAnuncio == 3) {
                    qtdaCompleto += 1
                }

                await Anuncio.create(dataObj);
                updateJsonName(filePath, false, index);
                console.log(`Linha ${index} importada com sucesso.`);

                const progress = Math.round((index / totalLinhasCsv) * 100);

                //console.log("progredindo", progress, index, totalLinhasCsv)
                io.to(socketId).emit('download-progress', { progress });


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
            const stream = fs.createReadStream(arquivoImportado).pipe(csv({
                separator: ';',
                quote: '"',
            }));

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



            try {

                const cadernos = await Caderno.findOne({
                    where: {
                        UF: dataObjGeral.codUf,
                        nomeCaderno: dataObjGeral.codCaderno
                    },
                    attributes: ['codCaderno', 'basico', 'completo', 'total']
                });


                if (dataObjGeral.codTipoAnuncio == 1) {
                    cadernos.basico = cadernos.basico + qtdaBasico;
                    cadernos.total = cadernos.total + (qtdaBasico + qtdaCompleto);

                    await cadernos.save();
                }

                if (dataObjGeral.codTipoAnuncio == 3) {
                    cadernos.completo = cadernos.completo + qtdaCompleto;
                    cadernos.total = cadernos.total + (qtdaBasico + qtdaCompleto);

                    await cadernos.save();
                }

                io.to(socketId).emit('download-complete');

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
                    replacements: { estado: dataObjGeral.codUf, caderno: dataObjGeral.codCaderno },
                    type: Sequelize.QueryTypes.UPDATE,
                });

                console.log(`Reorganização concluída para o estado:`, dataObjGeral.codUf);
            } catch (error) {
                console.error("Erro ao executar a reorganização:", error);
            }

        }

        await processFile();
    }

    // Para rodar a importação, basta chamar:
    try {
        importarPerfis();
    } catch (err) {
        console.error("Erro ao importar perfis:", err);
    }


});

*/ 