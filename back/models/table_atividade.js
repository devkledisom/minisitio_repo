const Sequelize = require('sequelize');
const database = require('../config/db');

const Atividade = database.define('atividade', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    atividade: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    corTitulo: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    }/* ,
    createdAt: {
        type: Sequelize.DATE
    } */
},
    {
        freezeTableName: true,
        timestamps: true,
    });

module.exports = Atividade;