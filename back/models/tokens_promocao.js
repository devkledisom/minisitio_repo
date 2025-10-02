const Sequelize = require('sequelize');
const database = require('../config/db');

const Anuncio = require('./table_anuncio');

const TokensPromocao = database.define('tokens_promocao', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    codAnuncio: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },

    tokenPromocao: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    dataLimitePromocao: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    dataAcessoToken: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        unique: false
    },

    updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        unique: false
    }
},
{
    tableName: 'tokens_promocao'
}
);

TokensPromocao.belongsTo(Anuncio, {
  foreignKey: "codAnuncio",   // chave estrangeira em Campanha
  targetKey: "codAnuncio",  // PK em Usuario
  as: "promo"            // alias
});

Anuncio.hasMany(TokensPromocao, {
    foreignKey: "codAnuncio",
    sourceKey: "codAnuncio",
    as: "tokens"
});

module.exports = TokensPromocao;