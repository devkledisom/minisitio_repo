const Sequelize = require('sequelize');
const database = require('../config/db');

const instConfig = database.define('institucional_config', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    inst_empresa: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: false
    },

    inst_objetivo: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: false
    },

    inst_visao: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: false
    },

    inst_missao: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: false
    },

    inst_img1: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    inst_img2: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    inst_img3: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    inst_img4: {
        type: Sequelize.STRING,
        allowNull: false,
    },

    inst_link1: {
        type: Sequelize.STRING,
        allowNull: false,
    },

    inst_link2: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    inst_link3: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    inst_link4: {
        type: Sequelize.STRING,
        allowNull: false,
    },


},
    {
        freezeTableName: true,
        timestamps: true,
    }
);

module.exports = instConfig;