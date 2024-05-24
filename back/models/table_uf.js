const Sequelize = require('sequelize');
const database = require('../config/db');

const Uf = database.define('uf', {
    id_uf: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    sigla_uf: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    nome_uf: {
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    id_pais: {
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    }
},
    {
        freezeTableName: true,
        timestamps: false,
    });

module.exports = Uf;