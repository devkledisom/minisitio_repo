const Sequelize = require('sequelize');
const database = require('../config/db');

const Calhau = database.define('calhau', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    frase: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
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
});

module.exports = Calhau;