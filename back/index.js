const express = require('express');
const app = express();
const port = 3032;
const route = require('./routes/Routes');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
//streams
const http = require("http");
//const { Server } = require("socket.io");


// Carregar certificados
const options = {
    key: fs.readFileSync("./certificados/key.pem"),
    cert: fs.readFileSync("./certificados/cert.pem"),
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

app.use(cors({
    origin: 'http://localhost:3000', // Permita apenas esta origem
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
    credentials: true, // Permite envio de cookies e credenciais
}));

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

/* const Admin = require('./controllers/Admin');
const saveImport = require('./functions/serverImport');
app.post('/api/admin/anuncio/import', saveImport().single('uploadedfile'), (req, res) => Admin.import4excellindex(req, res, io)); */

app.get("/as", (req, res) => {
    io.emit("progress", { a:1 });
})

server.listen(port, () => {
    console.log("rodando na porta: ", port);
});
