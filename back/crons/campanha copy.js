const Campanha = require('../models/table_campanha');
const Sequelize = require('sequelize');
const { Op } = Sequelize;
const moment = require('moment');

async function inativarCampanhasExpiradas() {
  console.log('Iniciando inativação de campanhas expiradas...');

  try {

    const hoje = moment().format('YYYY-MM-DD');

    // Buscar campanhas expiradas
    const campanhasExpiradas = await Campanha.update({
      status: 'expired'
    },{
       where: {
        [Op.and]: {
          status: 'valid',
          data_fim: { [Op.lt]: new Date() }
        }        
      } 
    });


    console.log(`Inativadas ${campanhasExpiradas.length} campanhas expiradas.`, hoje);
  } catch (error) {
    console.error('Erro ao inativar campanhas expiradas:', error);
    return;
  }
}


 
module.exports = {
  inativarCampanhasExpiradas
};