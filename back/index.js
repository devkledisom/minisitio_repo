const express = require('express');
const app = express();
const port = 3032;
const route = require('./routes/Routes');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
//streams
const http = require("http");
const cron = require('node-cron');
const { deletarPromocoesExpiradas } = require('./crons/promocao');


// Carregar certificados
const options = {
    key: fs.readFileSync("./certificados/code.key"),
    cert: fs.readFileSync("./certificados/code.crt"),
};

const server = http.createServer(app);
//const io = new Server(server);
var io = require("socket.io")(server, {
    cors: {
        origin: '*',
    }
});

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


// Middleware para passar a instância `io` para as rotas
function customMiddleware(io) {
    return (req, res, next) => {
        req.io = io;  // Passando a instância do `io` para `req`
        next();
    };
}

// Usando o middleware globalmente para todas as rotas
app.use(customMiddleware(io));

// Configurar EJS como motor de template
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'ejs'));

// Servir arquivos estáticos (CSS, imagens, etc.)
app.use(express.static(path.join(__dirname, 'ejs')));

//rota principal
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
    //console.log("Cliente conectado.", socket.id);
    socket.on("boa", (data) => {
        console.log("Cliente conectado.", data);
    })

    socket.on("progress", (data) => {
        const progress = (1 / 1) * 100;
        socket.emit("progress", data);
    });



});

app.get("/as", (req, res) => {
    io.emit("progress", { a: 1 });
})

cron.schedule('*/5 * * * *', () => {
    console.log('Deletando promoções expiradas...');
    deletarPromocoesExpiradas();
});


app.listen(port, () => {
    console.log("rodando na porta: ", port);
});


