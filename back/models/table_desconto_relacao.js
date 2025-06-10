const Sequelize = require('sequelize');
const database = require('../config/db');

const Usuario = require('./table_usuarios');
const Descontos = require('./table_desconto');
const Anuncio = require('./table_anuncio');

    // models/Tabela1.js
    Descontos.hasMany(Anuncio, { foreignKey: 'codDesconto', sourceKey: 'hash' });
    Anuncio.belongsTo(Descontos, { foreignKey: 'codDesconto', targetKey: 'hash' });


    module.exports = { Descontos, Anuncio };