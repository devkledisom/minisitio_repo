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
    path: "/api/socket.io"
}

//if (BASE_PATH) options['path'] = BASE_PATH + "/socket.io";
//const io = new Server(server);
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
app.use('/api/files/2', express.static(path.resolve(__dirname, "public", "upload", "img", "promocao")));
app.use('/api/files/3', express.static(path.resolve(__dirname, "public", "cartaoDigital")));
app.use('/api/files/institucional', express.static(path.resolve(__dirname, "public", "upload", "img", "adminInstitucional")));
app.use('/api/files/og', express.static(path.resolve(__dirname, "public", "OG")));


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
io.on("connection", (socket) => {
    console.log("🔌 Cliente conectado.", socket.id);
    socket.on('start-download', async () => {
        for (let i = 0; i <= 100; i += 10) {
            await new Promise(res => setTimeout(res, 500)); // Simula tempo
            socket.emit('download-progress', { progress: i });
        }
        socket.emit('download-complete');
    });



});



cron.schedule('*/5 * * * *', () => {
    console.log('Deletando promoções expiradas...');
    deletarPromocoesExpiradas();
});


server.listen(port, () => {
    console.log("rodando na porta: ", port);
});


