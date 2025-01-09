const Sequelize = require('sequelize');

//PROD
 const sequelize = new Sequelize('miniv2_minisitio_prod', 'miniv2_minisitio_dba', 'Para@2023', {
    dialect: 'mysql',
    host: '51.222.94.129',
    port: 3306,
    timezone: '-03:00', // Ajuste conforme o fuso horário necessário
   /*  pool: {
        max: 10, // Máximo de conexões
        min: 0,
        acquire: 30000, // Tempo máximo para adquirir conexão (ms)
        idle: 10000, // Tempo de ociosidade antes de liberar a conexão (ms)
    }, */
}); 

//HOMOLOG
/*  const sequelize = new Sequelize('minisitio_painel', 'minisitio_teste', 'Para@2023', {
    dialect: 'mysql',
    host: '51.222.94.129',
    port: 3306,
    timezone: '-03:00', // Ajuste conforme o fuso horário necessário
    pool: {
        max: 10, // Máximo de conexões
        min: 0,
        acquire: 30000, // Tempo máximo para adquirir conexão (ms)
        idle: 10000, // Tempo de ociosidade antes de liberar a conexão (ms)
      }
});   */
/* const sequelize = new Sequelize('minisitio_miniv2_minisitio_temp', 'minisitio_teste', 'Para@2023', {
    dialect: 'mysql',
    host: '51.222.94.129',
    port: 3306,
    timezone: '-03:00', // Ajuste conforme o fuso horário necessário
    pool: {
        max: 10, // Máximo de conexões
        min: 0,
        acquire: 30000, // Tempo máximo para adquirir conexão (ms)
        idle: 10000, // Tempo de ociosidade antes de liberar a conexão (ms)
    }
}); */

//LOCAL
/*   const sequelize = new Sequelize('minisitio_teste', 'root', 'root', {
    dialect: 'mysql',
    host: '127.0.0.1',
    port: 3307
});   */

module.exports = sequelize;

