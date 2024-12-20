const Sequelize = require('sequelize');
const database = require('../config/db');
const Caderno = require('./table_caderno');
const Uf = require('./table_uf');
const Usuario = require('./table_usuarios');
const Desconto = require('./table_desconto');
const Atividade = require('./table_atividade');

const Anuncio = database.define('anuncio', {
    codAnuncio: {
        type: Sequelize.INTEGER(11),
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
        type: Sequelize.INTEGER,
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

    codOrigem: {
        type: Sequelize.FLOAT,
        allowNull: true,
        unique: false
    },

    codDuplicado: {
        type: Sequelize.FLOAT,
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
        allowNull: true,
        unique: false
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
        type: Sequelize.TEXT,
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    descAnuncioFriendly: {
        type: Sequelize.TEXT,
        allowNull: true,
        unique: false
    },

    descImagem: {
        type: Sequelize.TEXT,
        allowNull: true,
        unique: false
    },

    descEndereco: {
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

    descCelular: {
        type: Sequelize.TEXT,
        allowNull: true,
        unique: false
    },

    descDescricao: {
        type: Sequelize.TEXT,
        allowNull: true,
        unique: false
    },

    descSite: {
        type: Sequelize.TEXT,
        allowNull: true,
        unique: false
    },

    descSkype: {
        type: Sequelize.TEXT,
        allowNull: true,
        unique: false
    },

    descPromocao: {
        type: Sequelize.TEXT,
        allowNull: true,
        unique: false
    },

    descEmailComercial: {
        type: Sequelize.TEXT,
        allowNull: true,
        unique: false
    },

    descEmailRetorno: {
        type: Sequelize.TEXT,
        allowNull: true,
        unique: false
    },

    descFacebook: {
        type: Sequelize.TEXT,
        allowNull: true,
        unique: false
    },

    descTweeter: {
        type: Sequelize.TEXT,
        allowNull: true,
        unique: false
    },

    descWhatsApp: {
        type: Sequelize.TEXT,
        allowNull: true,
        unique: false
    },

    descCEP: {
        type: Sequelize.TEXT,
        allowNull: true,
        unique: false
    },

    descTipoPessoa: {
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

    descNomeAutorizante: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    descEmailAutorizante: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    descParceiro: {
        type: Sequelize.TEXT,
        allowNull: true,
        unique: false
    },

    descParceiroLink: {
        type: Sequelize.TEXT,
        allowNull: true,
        unique: false
    },

    codDesconto: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    descLat: {
        type: Sequelize.TEXT,
        allowNull: true,
        unique: false
    },

    descLng: {
        type: Sequelize.TEXT,
        allowNull: true,
        unique: false
    },

    formaPagamento: {
        type: Sequelize.TEXT,
        allowNull: true,
        unique: false,
        /*  validate: {
             notEmpty: {
                 msg: "Esse campo não pode está vazio.."
             },
         } */
    },

    logoPromocao: {
        type: Sequelize.TEXT,
        allowNull: true,
        unique: false
    },

    promocaoData: {
        type: Sequelize.TEXT,
        allowNull: true,
        unique: false
    },

    descContrato: {
        type: Sequelize.TEXT,
        allowNull: true,
        unique: false
    },

    descAndroid: {
        type: Sequelize.TEXT,
        allowNull: true,
        unique: false
    },

    descApple: {
        type: Sequelize.TEXT,
        allowNull: true,
        unique: false
    },

    descInsta: {
        type: Sequelize.TEXT,
        allowNull: true,
        unique: false
    },

    descYouTube: {
        type: Sequelize.TEXT,
        allowNull: true,
        unique: false
    },

    descPatrocinador: {
        type: Sequelize.TEXT,
        allowNull: true,
        unique: false
    },

    descPatrocinadorLink: {
        type: Sequelize.TEXT,
        allowNull: true,
        unique: false
    },

    qntVisualizacoes: {
        type: Sequelize.TEXT,
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
        allowNull: true,
        unique: false
    },

    dtAlteracao: {
        type: Sequelize.DATE,
        allowNull: true,
        unique: false,
        defaultValue: Sequelize.NOW // Define o valor padrão como a data/hora atual
    },

    descLinkedin: {
        type: Sequelize.TEXT,
        allowNull: true,
        unique: false
    },

    descTelegram: {
        type: Sequelize.TEXT,
        allowNull: true,
        unique: false
    },

    certificado_logo: {
        type: Sequelize.TEXT,
        allowNull: true,
        unique: false
    },

    certificado_texto: {
        type: Sequelize.TEXT,
        allowNull: true,
        unique: false
    },

    certificado_imagem: {
        type: Sequelize.TEXT,
        allowNull: true,
        unique: false
    },

    link_comprar: {
        type: Sequelize.TEXT,
        allowNull: true,
        unique: false
    },

    cashback_logo: {
        type: Sequelize.TEXT,
        allowNull: true,
        unique: false
    },

    cashback_link: {
        type: Sequelize.TEXT,
        allowNull: true,
        unique: false
    },

    certificado_link: {
        type: Sequelize.TEXT,
        allowNull: true,
        unique: false
    },

    cartao_digital: {
        type: Sequelize.TEXT,
        allowNull: true,
        unique: false
    },

    descChavePix: {
        type: Sequelize.TEXT,
        allowNull: true,
        unique: false,
        /* validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        } */
    },

    descChavePix: {
        type: Sequelize.TEXT(255),
        allowNull: true,
        unique: false
    },

    dueDate: {
        type: Sequelize.DATE,
        allowNull: true
    },
},
    {
        freezeTableName: true,
        timestamps: true,
    });

Anuncio.beforeCreate((instance, options) => {
    const dueDate = new Date(instance.createdAt);
    dueDate.setDate(dueDate.getDate() + 365); // Exemplo: adiciona 30 dias
    instance.dueDate = dueDate;
});

Anuncio.belongsTo(Caderno, {
    constraints: true,
    foreignKey: 'codCaderno',
    targetKey: 'nomeCaderno'
});

Anuncio.belongsTo(Uf, {
    constraints: true,
    foreignKey: 'codUf'
});

Anuncio.belongsTo(Desconto, {
    constraints: true,
    foreignKey: 'codDesconto',
    targetKey: 'idDesconto'
});

Anuncio.belongsTo(Usuario, {
    constraints: true,
    foreignKey: 'descCPFCNPJ',
    targetKey: 'descCPFCNPJ'
});

Anuncio.belongsTo(Atividade, {
    constraints: true,
    foreignKey: 'codAtividade',
    targetKey: 'id'
});

module.exports = Anuncio;