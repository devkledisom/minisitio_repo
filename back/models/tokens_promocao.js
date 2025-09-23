const Sequelize = require('sequelize');
const database = require('../config/db');

const TokensPromocao = database.define('tokens_promocao', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
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

module.exports = TokensPromocao;