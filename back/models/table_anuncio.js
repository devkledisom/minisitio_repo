const Sequelize = require('sequelize');
const database = require('../config/db');
const Caderno = require('./table_caderno');
const Uf = require('./table_uf');
const Usuario = require('./table_usuarios');
const Desconto = require('./table_desconto');
const Atividade = require('./table_atividade');

const Anuncio = database.define('anuncio', {
    codAnuncio: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    codUsuario: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        },
      /*   references: {
            model: Desconto,
            key: 'idUsuario'
        } */
    },

    codTipoAnuncio: {
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    codAtividade: {
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    codPA: {
        type: Sequelize.TEXT,
        allowNull: true,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    codDuplicado: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    tags: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    codCaderno: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },
/*     codCadernoId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        },
        references: {
            model: Caderno,
            key: 'codCaderno'
        }
    }, */

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

    codCidade: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    descAnuncio: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    descAnuncioFriendly: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    descImagem: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    descEndereco: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    descTelefone: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    descCelular: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    descDescricao: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    descSite: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    descSkype: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    descPromocao: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    descEmailComercial: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    descEmailRetorno: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    descFacebook: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    descTweeter: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    descWhatsApp: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    descCEP: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    descTipoPessoa: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    descCPFCNPJ: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    descNomeAutorizante: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    descEmailAutorizante: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    codDesconto: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    descLat: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    descLng: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    formaPagamento: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    promocaoData: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    descContrato: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    descAndroid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    descApple: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    descInsta: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    descPatrocinador: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    descPatrocinadorLink: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    qntVisualizacoes: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    activate: {
        type: Sequelize.INTEGER,
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
        defaultValue: Sequelize.NOW // Define o valor padrão como a data/hora atual
    },

    dtCadastro2: {
        type: Sequelize.DATE,
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    dtAlteracao: {
        type: Sequelize.DATE,
        allowNull: true,
        unique: false,
        defaultValue: Sequelize.NOW // Define o valor padrão como a data/hora atual
    },

    descLinkedin: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    descTelegram: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    certificado_logo: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    certificado_texto: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    certificado_imagem: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    link_comprar: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    cashback_logo: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    cashback_link: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    certificado_link: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    cartao_digital: {
        type: Sequelize.INTEGER,
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

Anuncio.belongsTo(Caderno, {
    constraints: true,
    foreignKey: 'codCaderno'
});

Anuncio.belongsTo(Uf, {
    constraints: true,
    foreignKey: 'codUf'
});

Anuncio.belongsTo(Usuario, {
    constraints: true,
    foreignKey: 'codUsuario'
});

Anuncio.belongsTo(Desconto, {
    constraints: true,
    foreignKey: 'codUsuario',
    targetKey: 'idUsuario'
});

Anuncio.belongsTo(Atividade, {
    constraints: true,
    foreignKey: 'codAtividade',
    targetKey: 'id'
});

module.exports = Anuncio;