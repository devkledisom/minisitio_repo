const Sequelize = require('sequelize');

//PROD
const sequelize = new Sequelize('miniv2_minisitio_prod', 'miniv2_minisitio_dba', 'Para@2023', {
    dialect: 'mysql',
    host: '51.222.94.129',
    port: 3306,
    timezone: '-03:00', // Ajuste conforme o fuso horário necessário
}); 

//HOMOLOG
/* const sequelize = new Sequelize('minisitio_painel', 'minisitio_teste', 'Para@2023', {
    dialect: 'mysql',
    host: '51.222.94.129',
    port: 3306,
    timezone: '-03:00', // Ajuste conforme o fuso horário necessário
});  */

//LOCAL
/*  const sequelize = new Sequelize('minisitio_teste', 'root', 'root', {
    dialect: 'mysql',
    host: '127.0.0.1',
    port: 3307
});  */

module.exports = sequelize;

