const Sequelize = require('sequelize');
const database = require('../config/db');

const Anuncio = require('./table_anuncio');


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
        unique: false
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
    uf: {
        type: Sequelize.STRING(2),
        allowNull: true,
        unique: false
    },
    caderno: {
        type: Sequelize.STRING(100),
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

    // Obter todos os anúncios relacionados a uma promoção
    Anuncio.hasMany(Promocao, { foreignKey: "codAnuncio", sourceKey: "codAnuncio", as: "promocoes" });

    // Obter o anúncio ao qual uma promoção pertence
    Promocao.belongsTo(Anuncio, { foreignKey: "codAnuncio", targetKey: "codAnuncio", as: "anuncio" });

module.exports = Promocao;