const Sequelize = require('sequelize');
const database = require('../config/db');

const Tags = database.define('tags', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    codAnuncio: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: false,
    },

    tagValue: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: false
    }
},
    {
        freezeTableName: true,
        timestamps: false,
    });

module.exports = Tags;