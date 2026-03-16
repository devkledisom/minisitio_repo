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
  idRetorno: {
    type: Sequelize.TEXT,
    allowNull: false,
    field: "id_retorno", // mapeia para a coluna no banco
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
  total_registros: {
    type: Sequelize.FLOAT,
    allowNull: false,
    field: "total_registros", // mapeia para a coluna no banco
  },
  bloco_registers_number: {
    type: Sequelize.FLOAT,
    allowNull: false,
    field: "bloco_registers_number", // mapeia para a coluna no banco
  },
  separador_csv: {
    type: Sequelize.TEXT,
    allowNull: false,
    field: "separador_csv", // mapeia para a coluna no banco
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

Campanha.belongsTo(Desconto, {
  foreignKey: "idRetorno",
  targetKey: "idDesconto",
  as: "retorno"
});

Desconto.hasMany(Campanha, {
  foreignKey: "idPromocional",
  sourceKey: "idDesconto",
  as: "campanhas"
});



module.exports = Campanha;
