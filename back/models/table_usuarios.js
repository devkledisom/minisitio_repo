const Sequelize = require('sequelize');
const database = require('../config/db');
//const DDD = require('./table_ddd');

const Usuario = database.define('usuario', {
    codUsuario: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    codTipoPessoa: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    descCPFCNPJ: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    descNome: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    descEmail: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    senha: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    hashCode: {
        type: Sequelize.TEXT,
        allowNull: true,
        unique: false
    },

    descValue: {
        type: Sequelize.TEXT,
        allowNull: true,
        unique: false
    },

    codTipoUsuario: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    descTelefone: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    descRepresentanteConvenio: {
        type: Sequelize.TEXT,
        allowNull: true,
        unique: false
    },

    descEndereco: {
        type: Sequelize.TEXT,
        allowNull: true,
        unique: false
    },

    codUf: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    codCidade: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    dtCadastro: {
        type: Sequelize.DATE,
        allowNull: true,
        unique: false,
        //defaultValue: Sequelize.NOW
    },

    usuarioCod: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    dtCadastro2: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    dtAlteracao: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    ativo: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },
    resetToken: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    resetTokenExpires: {
        type: Sequelize.DATE,
        allowNull: true
    }
},
    {
        freezeTableName: true,
        timestamps: false,
    },

    {
        indexes: [
            {
                name: 'descCPFCNPJ',
                fields: ['descCPFCNPJ'], // O campo para o qual o índice será criado
            },
            {
                name: 'idx_usuario_ordem',
                fields: ['codCidade', 'dtCadastro', 'descNome']
            }
        ]
    }
);

/* Usuario.belongsTo(DDD, {
    constraints: true,
    foreignKey: "id_ddd"
});
 */
module.exports = Usuario;