const Campanha = require('../models/table_campanha');
const TokensPromocao = require('../models/tokens_promocao');
const Anuncio = require('../models/table_anuncio');
const Sequelize = require('sequelize');
const { Op } = Sequelize;
const moment = require('moment');
const { raw } = require('mysql2');

async function inativarCampanhasExpiradas() {
  console.log('Iniciando inativação de campanhas expiradas...');

  try {

    const hoje = moment().format('YYYY-MM-DD');

    // Buscar campanhas expiradas
    const campanhasExpiradas = await Campanha.update({
      status: 'expired'
    }, {
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
//mudar cron para 24 horas, pegar todos registros de uma vez só, todo dia 3 horas da manhã

async function downgradePerfil() {
  console.log('Iniciando downgrade de perfil...');

  try {

    const hoje = moment().format('YYYY-MM-DD');

    const tokensExpirados = await TokensPromocao.findAll({
      where: {
        [Op.and]: {
          dataLimitePromocao: { [Op.lt]: new Date() },
          statusPromocao: { [Op.ne]: 'vencido' }
        }
      },
      raw: true
    });

    if (!tokensExpirados.length) {
      console.log('Nenhum perfil expirado encontrado no momento.');
      return;
    }

    const tokenIds = tokensExpirados.map(token => token.id);
    await TokensPromocao.update({
      statusPromocao: 'vencido'
    }, {
      where: {
        id: {
          [Op.in]: tokenIds
        }
      }
    });

    const campanhaIds = [...new Set(tokensExpirados.map(token => token.campanhaId).filter(Boolean))];
    const campanhas = await Campanha.findAll({
      where: { id: { [Op.in]: campanhaIds } },
      attributes: ['id', 'idRetorno'],
      raw: true
    });
    const retornoMap = Object.fromEntries(campanhas.map(campanha => [campanha.id, campanha.idRetorno]));

    for (const token of tokensExpirados) {
      const codDesconto = retornoMap[token.campanhaId] ?? token.idRetorno;
      await Anuncio.update({
        codTipoAnuncio: 1,
        codDesconto
      }, {
        where: {
          codAnuncio: token.codAnuncio
        }
      });
      console.log(`Anúncio ${token.codAnuncio} rebaixado com sucesso.`);
    }

    console.log(`downgrades em ${tokensExpirados.length} de perfis expirados.`, hoje);
  } catch (error) {
    console.error('Erro ao atualizar perfil expirados:', error);
    return;
  }
}

module.exports = {
  inativarCampanhasExpiradas,
  downgradePerfil
};
