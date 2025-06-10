const Promocao = require('../models/table_promocao');
const Sequelize = require('sequelize');
const { Op } = Sequelize;

async function deletarPromocoesExpiradas() {

  try {
    // Buscar promoções expiradas
    const promocoes = await Promocao.findAll({
      where: {
        data_validade: { [Op.lt]: new Date() }
      }
    });

    if (promocoes.length < 1) return;

    // Para cada promoção, deletar com destroy()
    for (const promocao of promocoes) {
      await promocao.destroy();  // dispara os hooks para deletar imagem
    }

    console.log(`Deletadas ${promocoes.length} promoções expiradas.`);
  } catch (error) {
    console.error('Erro ao deletar promoções expiradas:', error);
    return;
  }
}

module.exports = {
  deletarPromocoesExpiradas
};