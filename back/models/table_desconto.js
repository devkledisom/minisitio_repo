const Sequelize = require('sequelize');
const database = require('../config/db');

const Usuario = require('./table_usuarios');
const Anuncio = require('./table_anuncio');



const Desconto = database.define('desconto', {
    idDesconto: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    idUsuario: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    userType: {
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    desconto: {
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },
    descricao: {
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },
    hash: {
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },
    borda: {
        type: Sequelize.STRING(150),
        allowNull: true,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },
    descImagem: {
        type: Sequelize.STRING(150),
        allowNull: true,
        unique: false,
    },
    descImagem2: {
        type: Sequelize.STRING(150),
        allowNull: true,
        unique: false,
    },
    descImagem3: {
        type: Sequelize.STRING(150),
        allowNull: true,
        unique: false,
    },
    descLink: {
        type: Sequelize.STRING(150),
        allowNull: true,
        unique: false
    },
    borda2: {
        type: Sequelize.STRING(150),
        allowNull: true,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },
    descPromocao: {
        type: Sequelize.STRING(150),
        allowNull: true,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },
    descLink2: {
        type: Sequelize.STRING(150),
        allowNull: true,
        unique: false
    },
    descLink3: {
        type: Sequelize.STRING(150),
        allowNull: true,
        unique: false
    },
    dtCadastro: {
        type: Sequelize.DATE,
        allowNull: true,
        unique: false,
        defaultValue: Sequelize.NOW
    },
    ativo: {
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },
    patrocinador_ativo: {
        type: Sequelize.STRING(150),
        allowNull: true,
        unique: false
    },
    utilizar_saldo: {
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },
    saldo: {
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: false,
        /* validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        } */
    },
    total_registros: {
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: false,
        /* validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        } */
    },
    is_capa: {
        type: Sequelize.BOOLEAN(),
        allowNull: false,
        unique: false,
        /* validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        } */
    }
},
    {
        freezeTableName: true,
        timestamps: false,
    });

Desconto.belongsTo(Usuario, {
    constraints: true,
    foreignKey: 'idUsuario',
    targetKey: 'codUsuario'
});




// models/Tabela1.js
/*    Desconto.hasMany(Anuncio, { foreignKey: 'codDesconto', sourceKey: 'hash' });
   Anuncio.belongsTo(Desconto, { foreignKey: 'codDesconto', targetKey: 'hash' }); */


/*    Desconto.belongsTo(Anuncio, {
       constraints: true,
       foreignKey: 'hash',
       targetKey: 'codDesconto'
   }); */
/*   Desconto.belongsTo(Usuario, {
      constraints: true,
      targetKey: 'codUsuario',  
      foreignKey: 'idUsuario'
  }); */

module.exports = Desconto;