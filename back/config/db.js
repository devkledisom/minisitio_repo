const Sequelize = require('sequelize');
const sequelize = new Sequelize('minisitio_painel', 'minisitio_teste', 'Para@2023', {
    dialect: 'mysql',
    host: '51.222.94.129',
    port: 3306
}); 
/* const sequelize = new Sequelize('minisitio_teste', 'root', 'root', {
    dialect: 'mysql',
    host: '192.168.0.150',
    port: 3307
}); */

module.exports = sequelize;

