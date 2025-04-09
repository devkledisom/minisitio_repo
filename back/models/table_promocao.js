const Sequelize = require('sequelize');
const database = require('../config/db');

const Promocao = database.define('promocao', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    codAnuncio: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    banner: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    link_externo: {
        type: Sequelize.STRING(255),
        allowNull: true,
        unique: false
    },
    data_validade: {
        type: Sequelize.STRING(10),
        allowNull: true,
        unique: false
    },
    createdAt: {
        type: Sequelize.DATE(),
        allowNull: true,
        unique: true,
      
    },
    updatedAt: {
        type: Sequelize.DATE(),
        allowNull: true,
        unique: false,
       
    }
},
    {
        freezeTableName: true,
        timestamps: false,
    });


module.exports = Promocao;