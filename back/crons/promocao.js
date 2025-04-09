const cron = require('node-cron');
const Promocao = require('../models/table_promocao');

async function apagarPromocoesVencidas() {
  try {
    const deletedRows = await Promocao.destroy({
      where: {
        data_validade: {
          [Sequelize.Op.lt]: new Date(),
        },
      },
    });

    console.log(`Registros apagados: ${deletedRows}`);
  } catch (error) {
    console.error('Erro ao apagar promoções vencidas:', error);
  }
}

// Agendamento da rotina para executar todos os dias à meia-noite
cron.schedule('* * * * *', apagarPromocoesVencidas);

console.log('Rotina de apagar promoções vencidas agendada.');