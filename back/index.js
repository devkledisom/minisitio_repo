const express = require('express');
const app = express();
const port = 3032;
const route = require('./routes/Routes');
const cors = require('cors');
const path = require('path');

app.use(express.json());
//app.use(express.urlencoded({ extended: true }));

app.use(cors());

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


app.get('/outapi', (req, res) => {
    console.log(req)
    res.json({})
});

app.listen(port, () => {
    console.log("rodando na porta: ", port);
});
