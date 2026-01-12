const Sequelize = require('sequelize');
const database = require('../config/db');

const Desconto = require('./table_desconto');

const Campanha = database.define("Campanha", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  idOrigem: {
    type: Sequelize.INTEGER,
    allowNull: false,
    unique: true,
    field: "id_origem", // mapeia para a coluna no banco
  },
  idPromocional: {
    type: Sequelize.INTEGER,
    allowNull: false,
    field: "id_promocional", // mapeia para a coluna no banco
  },
  uf: {
    type: Sequelize.CHAR(2),
    allowNull: false,
  },
  caderno: {
    type: Sequelize.STRING(100),
    allowNull: false,
  },
  dataFim: {
    type: Sequelize.DATEONLY,
    allowNull: false,
    field: "data_fim",
  },
  criador: {
    type: Sequelize.STRING(100),
    allowNull: false,
  },
  status: {
    type: Sequelize.STRING(8),
    allowNull: false,
  },
  statusLink: {
    type: Sequelize.STRING(7),
    allowNull: false,
  },
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,

  },
  updatedAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,

  },
}, {
  tableName: "campanhas",
  timestamps: false, // desativa createdAt e updatedAt automáticos
});

Campanha.belongsTo(Desconto, {
  foreignKey: "idPromocional",   // chave estrangeira em Campanha
  targetKey: "idDesconto",  // PK em Usuario
  as: "desconto"            // alias
});

Desconto.hasMany(Campanha, {
  foreignKey: "idPromocional",
  sourceKey: "idDesconto",
  as: "campanhas"
});



module.exports = Campanha;
