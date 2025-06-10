const Sequelize = require('sequelize');
const database = require('../config/db');

const contatoConfig = database.define('contato_config', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  telefone: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: true,
    validate: {
      isEmail: true,
    },
  },
  endereco: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  facebook: {
    type: Sequelize.STRING,
    allowNull: true,
    validate: {
      isUrl: true,
    },
  },
  instagram: {
    type: Sequelize.STRING,
    allowNull: true,
    validate: {
      isUrl: true,
    },
  },
},
    {
        freezeTableName: true,
        timestamps: true,
    }
);

module.exports = contatoConfig;