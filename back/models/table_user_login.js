const Sequelize = require('sequelize');
const database = require('../config/db');

const UserLogin = database.define('usuario', {
    codUsuario: {
        type: Sequelize.INTEGER(11),
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    codTipoPessoa: {
        type: Sequelize.STRING(6),
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    descCPFCNPJ: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    descNome: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },
    descEmail: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },
    senha: {
        type: Sequelize.STRING(60),
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },
    hashCode: {
        type: Sequelize.STRING(30),
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },
    descValue: {
        type: Sequelize.STRING(30),
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },
    codTipoUsuario: {
        type: Sequelize.INTEGER(5),
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },
    descTelefone: {
        type: Sequelize.STRING(25),
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },
    descRepresentanteConvenio: {
        type: Sequelize.STRING(60),
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },
    descEndereco: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },
    codUf: {
        type: Sequelize.INTEGER(5),
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },
    codCidade: {
        type: Sequelize.INTEGER(5),
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },
    dtCadastro: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },
    usuarioCod: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },
    dtCadastro2: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },
    dtAlteracao: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },
    ativo: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },
},
    {
        freezeTableName: true,
        timestamps: false,
    });

module.exports = UserLogin;