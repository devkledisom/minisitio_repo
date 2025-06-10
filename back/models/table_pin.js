const Sequelize = require('sequelize');
const database = require('../config/db');

const Pin = database.define('pin', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    codigo: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    validade: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    }
}/* ,
    {
        freezeTableName: true,
        timestamps: false,
    } */);

module.exports = Pin;