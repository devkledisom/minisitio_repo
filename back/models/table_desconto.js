const Sequelize = require('sequelize');
const database = require('../config/db');

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
        unique: false,
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
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },
    descLink: {
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
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
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },
    dtCadastro: {
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
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
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    }
},
    {
        freezeTableName: true,
        timestamps: false,
    });

module.exports = Desconto;