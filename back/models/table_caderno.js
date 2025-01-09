const Sequelize = require('sequelize');
const database = require('../config/db');
const Uf = require('./table_uf');

const Caderno = database.define('caderno', {
    codCaderno: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    codUf: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },
    UF: {
        type: Sequelize.TEXT(255),
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    nomeCaderno: {
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    nomeCadernoFriendly: {
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    descImagem: {
        type: Sequelize.TEXT,
        allowNull: true,
        unique: false,
    },

    cep_inicial: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    cep_final: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    isCapital: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    legenda: {
        type: Sequelize.TEXT,
        allowNull: true
    }
},
    {
        freezeTableName: true,
        timestamps: false,
    });
Caderno.belongsTo(Uf, {
    constraints: true,
    foreignKey: 'codUf'
});

module.exports = Caderno;