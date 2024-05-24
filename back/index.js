const express = require('express');
const app = express();
const port = 3032;
const route = require('./routes/Routes');
const cors = require('cors');
const path = require('path');

app.use(express.json());
//app.use(express.urlencoded({ extended: true }));

app.use(cors());

//rota principal
app.use(route);

app.use('/files', express.static(path.resolve(__dirname, "public", "upload", "img")));

app.listen(port, () => {
    console.log("rodando na porta: ", port);
});
