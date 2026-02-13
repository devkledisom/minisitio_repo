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

async function downgradePerfil() {
  console.log('Iniciando downgrade de perfil...');

  try {

    const hoje = moment().format('YYYY-MM-DD');

    const perfilExpirado = await TokensPromocao.findOne({
      where: {
        [Op.and]: {
          dataLimitePromocao: { [Op.lt]: new Date() },
          statusPromocao: { [Op.ne]: 'vencido' }
        }
      },
      raw: true
    });

    if (perfilExpirado) {

      // 1. Atualiza o status do token para vencido
      await TokensPromocao.update({
        statusPromocao: "vencido"
      }, {
        where: { id: perfilExpirado.id }
      });

      // 2. Atualiza o anúncio vinculado
      await Anuncio.update({
        codTipoAnuncio: 1,
        codDesconto: "00.000.0001"
      }, {
        where: {
          codAnuncio: perfilExpirado.codAnuncio
        }
      });

      console.log(`Anúncio ${perfilExpirado.codAnuncio} rebaixado com sucesso.`);
    } else {
      console.log('Nenhum perfil expirado encontrado no momento.');
    }

    console.log(`downgrades em ${perfilExpirado.length} de perfis expirados.`, hoje);
  } catch (error) {
    console.error('Erro ao atualizar perfil expirados:', error);
    return;
  }
}

module.exports = {
  inativarCampanhasExpiradas,
  downgradePerfil
};