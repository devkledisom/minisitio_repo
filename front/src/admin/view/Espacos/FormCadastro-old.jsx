// components/OutroComponente.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../assets/css/users.css';
import '../../assets/css/espacos.css';
import 'font-awesome/css/font-awesome.min.css';
import { masterPath } from '../../../config/config';

//componente
import Header from "../Header";
import Spinner from '../../../components/Spinner';
import ChooseFile from "../../../components/ChooseFile";
import useFormController from '../../../controllers/formController';
import Tooltip from "../../../components/Tooltip";

//FUNCTIONS
import moveToTop from '../../functions/moverParaTop';

//LIBS
import InputMask from 'react-input-mask';

const FormCadastro = () => {


    const [ids, setIds] = useState(
        {
            "codAnuncio": 35,
            "codUsuario": "",
            "codTipoAnuncio": 2,
            "codAtividade": "",
            "codPA": null,
            "codDuplicado": null,
            "tags": "atacado,som,musica",
            "codCaderno": 5592,
            "codUf": 53,
            "codCidade": 0,
            "descAnuncio": "",
            "descAnuncioFriendly": "",
            "descImagem": "teste",
            "descEndereco": "",
            "descTelefone": "",
            "descCelular": "",
            "descDescricao": "",
            "descSite": "",
            "descSkype": null,
            "descPromocao": "",
            "descEmailComercial": "",
            "descEmailRetorno": "",
            "descFacebook": "",
            "descTweeter": "",
            "descWhatsApp": null,
            "descCEP": "",
            "descTipoPessoa": "",
            "descCPFCNPJ": "",
            "descNomeAutorizante": "",
            "descEmailAutorizante": "",
            "codDesconto": 28,
            "descLat": null,
            "descLng": null,
            "formaPagamento": null,
            "promocaoData": null,
            "descContrato": null,
            "descAndroid": "",
            "descApple": "",
            "descInsta": null,
            "descPatrocinador": null,
            "descPatrocinadorLink": null,
            "qntVisualizacoes": 73,
            "activate": 1,
            "dtCadastro": "2024-06-03T09:14:03.000Z",
            "dtCadastro2": "2012-12-27T15:14:57.000Z",
            "dtAlteracao": "2020-11-30T23:59:59.000Z",
            "descLinkedin": null,
            "descTelegram": null,
            "certificado_logo": null,
            "certificado_texto": null,
            "certificado_imagem": null,
            "link_comprar": null,
            "cashback_logo": null,
            "cashback_link": null,
            "certificado_link": null,
            "cartao_digital": null,
            "descChavePix": ""
        }
    );
    const [usuarios, setUsuarios] = useState({});
    const [atividadeValue, setAtividade] = useState(false);
    const [atividades, setAtividades] = useState();
    const [page, setPage] = useState(1);
    const [showSpinner, setShowSpinner] = useState(false);
    const [hash, setHash] = useState(false);
    const [uf, setUfs] = useState([]);
    const [ufSelected, setUf] = useState(0);
    const [caderno, setCaderno] = useState([]);


    const location = useLocation();

    const navigate = useNavigate();

    const getParam = new URLSearchParams(location.search);

    const param = getParam.get('page') ? getParam.get('page') : 1;

    const style = {
        position: "fixed",
        zIndex: "999"
    }

    const {
        formValues,
        formErrors,
        handleChangeform,
        handleSubmit
    } = useFormController();



    useEffect(() => {
        //setShowSpinner(true);
        fetch(`${masterPath.url}/admin/usuario/buscar/all`)
            .then((x) => x.json())
            .then((res) => {
                //setUsuarios(res.usuarios);
                setShowSpinner(false);
            }).catch((err) => {
                console.log(err);
                setShowSpinner(false);
            })
        /*  fetch(`${masterPath.url}/admin/anuncio/edit/${9999}`)
             .then((x) => x.json())
             .then((res) => {
                 //setIds(res[0]);
                 //setHash(res[0].hash);
 
             }).catch((err) => {
                 console.log(err)
             }) */

        fetch(`${masterPath.url}/cadernos`)
            .then((x) => x.json())
            .then((res) => {
                setCaderno(res)
            })
        fetch(`${masterPath.url}/ufs`)
            .then((x) => x.json())
            .then((res) => {
                setUfs(res);
            })
        fetch(`${masterPath.url}/atividade/:codAtividade`)
            .then((x) => x.json())
            .then((res) => {
                setAtividades(res);
                //console.log(res)
                //decodificar()
            });
    }, []);


    function gerarNumeroAleatorio() {
        // Gerar números aleatórios entre 0 e 999 para cada parte
        const parte1 = Math.floor(Math.random() * 1000);
        const parte2 = Math.floor(Math.random() * 1000);
        const parte3 = Math.floor(Math.random() * 1000);

        // Formatando os números com zeros à esquerda para garantir três dígitos
        const numeroFormatado = [
            ('000' + parte1).slice(-2), // Adiciona zeros à esquerda e pega os últimos três dígitos
            ('000' + parte2).slice(-3),
            ('000' + parte3).slice(-3)
        ].join('.'); // Une as partes com o separador '.'

        setHash(numeroFormatado);
    }


    async function criarAnuncio(e) {
        e.preventDefault();
        setShowSpinner(true);
        moveToTop();
        /*  let usuarioEcontrado = await buscarUserId();
         console.log('user: ', usuarioEcontrado)
  */


        var validation = true;


        document.querySelectorAll('[required]').forEach((item) => {
            if (item.value == "") {
                item.style.border = "1px solid red";
                validation = false;
                return;
            } else {
                item.style.border = "1px solid gray";
                validation = true;

            };
        });

        /*      document.querySelectorAll('select').forEach((item) => {
                 if (item.value == "") {
                     item.style.border = "1px solid red";
                     validation = false;
                     return;
                 } else {
                     item.style.border = "1px solid gray";
                     validation = true;
                 };
             }); 
      */
        if (validation) {
            const config = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(ids)
            };



            console.log(usuarios.codUsuario);

            e.preventDefault();

            fetch(`${masterPath.url}/admin/anuncio/create`, config)
                .then((x) => x.json())
                .then((res) => {
                    if (res.success) {
                        setShowSpinner(false);
                        alert("Anúncio Cadastrado!");
                    } else {
                        setShowSpinner(false);
                        alert(res.message);
                        console.log(res.message);
                    }
                }).catch((err) => {
                    console.log(err);
                    setShowSpinner(false);
                })
        } else {
            setShowSpinner(false);
        }

    };


    //liberar campo select
    document.querySelectorAll('[required]').forEach((item) => {
        item.addEventListener("change", (event) => {
            event.target.style.border = "1px solid gray";
        })
    });
    /*     document.querySelectorAll('select').forEach((item) => {
            item.addEventListener("change", (event) => {
                event.target.style.border = "1px solid gray";
            })
        });
        //liberar campo input
        document.querySelectorAll('[name="pwd"]').forEach((item) => {
            item.addEventListener("change", (event) => {
                event.target.style.border = "1px solid gray";
            })
        }); */

    const executarSelecao = () => {
        let codigoUf = document.querySelectorAll('#coduf')[0].value;
        setUf(codigoUf);
    };

    // Função para lidar com mudanças nos campos de entrada
    const handleChange = (e) => {
        const { name, value } = e.target;
        setIds({
            ...ids,
            [name]: value
        });
        //console.log(e.target)


    };

    const handleSelectChange = (e) => {
        executarSelecao(e);
        handleChange(e);
    };

    async function buscarUserId() {
        const campoPesquisa = document.getElementById('nm_usuario');

        if (campoPesquisa.value === '') return false;

        let encontrado = false;

        try {
            const response = await fetch(`${masterPath.url}/admin/usuario/buscar/${campoPesquisa.value}`);
            const res = await response.json();

            if (res.success) {
                setUsuarios(res.usuarios[0]);
                encontrado = true;

                setIds({
                    ...ids,
                    ["codUsuario"]: res.usuarios[0].codUsuario
                });
                // setShowSpinner(false);
            } else {
                alert("Usuário não encontrado na base de dados");
                setUsuarios(false);
                // setShowSpinner(false);
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
        }

        return encontrado;
    }


    return (
        <div className="users">
            <header style={style} className='w-100'>
                <Header />
            </header>
            <section className='py-5'>
                {showSpinner && <Spinner />}

                <div className="container">
                    <h2 className="pt-4 px-5 text-center">Adicionar Anúncio</h2>


                    <form action="/admin/anuncio/cadastro" onSubmit={(e) => alert("Anúncio cadastrado")}>

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="codUsuario" className="w-50 px-1">Usuário: (Digite o nome, e-mail ou CPF/CNPJ)</label>
                            <input type="text"
                                className={`form-control h-25 w-50 form-control`}
                                id="nm_usuario"
                                name="codUsuario"
                                value={ids.codUsuario}
                                onChange={handleChange}
                                required
                            />
                            {formErrors.codUsuario && <div className="invalid-feedback">{formErrors.codUsuario}</div>}
                            {/* <span className="text-danger">campo obr</span> */}
                        </div>

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="codAtividade" className="w-50 px-1">Atividade: (Digite o nome)</label>
                            <input list="codAtividade" name="codAtividade" id="atividade"
                                className="form-control h-25 w-50"
                                onChange={handleChange} value={ids.codAtividade}
                                required
                            />
                            <datalist
                                name="codAtividade"
                                id="codAtividade"
                                
                            >
                                {/*  <option value="">Selecione a atividade principal</option> */}
                                {atividades &&

                                    atividades.map(
                                        (item) =>

                                            <option
                                                key={item.id}
                                                value={item.atividade}
                                            />
                                        /*  {item.atividade}
                                     </option> */

                                    )}
                            </datalist>
                        </div>




                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="codTipoAnuncio" className="w-50 px-1">Tipo de anúncio</label>
                            <select name="codTipoAnuncio" id="descTipoAnuncio" className="w-50 py-1"
                                onChange={handleChange} value={ids.codTipoAnuncio} required >
                                <option selected="selected">- Selecione o tipo de anúncio -</option>
                                <option value="1">Básico</option>
                                <option value="2">Simples</option>
                                <option value="3">Completo</option>
                            </select>
                        </div>

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="codUf" className="w-50 px-1">UF:</label>
                            <select name="codUf" id="coduf" onChange={handleSelectChange} className="w-50 py-1" required>
                                <option value="" selected="selected">- Selecione um estado -</option>
                                {
                                    uf.map((uf, i) => (
                                        <option key={i} value={uf.id_uf}>{uf.sigla_uf}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="codCaderno" className="w-50 px-1">Caderno:</label>
                            <select name="codCaderno" id="codCaderno" className="w-50 py-1" onChange={handleChange} value={ids.codCaderno} required>
                                <option value="" selected="selected">- Selecione uma cidade -</option>
                                {
                                    caderno.map((cidades) => (
                                        cidades.codUf == ufSelected && (
                                            <option value={cidades.codCaderno}>{cidades.nomeCaderno}</option>
                                        )
                                    ))
                                }
                            </select>
                        </div>

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="descAnuncio" className="w-50 px-1">Nome da empresa:</label>
                            <input type="text"
                                className="form-control h-25 w-50"
                                id="descAnuncio"
                                name="descAnuncio"
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label className="w-50 px-1">Imagem:
                                <Tooltip text={"Insira o cartão de visita que irá aparecer no card do anúncio"}><span className="help-span">?</span></Tooltip>
                            </label>
                            {/* <ChooseFile codigoUser={param} largura={"w-50"} codImg={ids.descImagem} preview={true} teste={handleChange} /> */}
                            <ChooseFile codigoUser={param} largura={"w-50"} codImg={ids.descImagem} preview={false} patrocinador={handleChange} miniPreview={true} />
                        </div>

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <div className='area-promocao'>
                                <label className="w-100 px-1">Promoção:</label>
                                {/* <ChooseFile codigoUser={param} largura={"w-50"} codImg={ids.descPromocao} preview={false} /> */}
                                <ChooseFile codigoUser={param} largura={"w-100"} codImg={ids.descImagem} preview={false} patrocinador={handleChange} miniPreview={true} />

                                <div className="form-group d-flex flex-column py-3">
                                    <label className="w-100 px-1">Validade da promoção de desconto:</label>
                                    <input type="date" name="validade" id="validade" className="form-control h-25 campo-val" />
                                </div>
                            </div>


                        </div>

                        {/*                  <div className="form-group d-flex flex-column align-items-center py-3">
                            <label className="w-50 px-1">Validade da promoção de desconto:</label>
                            <input type="date" name="validade" id="validade" className="form-control h-25 w-50" />
                        </div> */}

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <div className='area-promocao'>
                            <label className="w-100 px-1">Logo da Parceria:
                                <Tooltip text={"Insira a logotipo do parceiro"}><span className="help-span">?</span></Tooltip>
                            </label>
                            {/*  <ChooseFile codigoUser={param} largura={"w-50"} codImg={ids.descPromocao} preview={false} /> */}
                            <ChooseFile codigoUser={param} largura={"w-100"} codImg={ids.descImagem} preview={false} patrocinador={handleChange} miniPreview={true} />

                            <div className="form-group d-flex flex-column align-items-center py-3">
                                <label htmlFor="urlParceria" className="w-100 px-1">Site da Parceria:</label>
                                <input type="text"
                                    className="form-control h-25 campo-val"
                                    id="urlParceria"
                                    name="urlParceria"
                                />
                                <span>Inserir URL completa para acesso ao site da parceria</span>
                            </div>
                            </div>
                        </div>

                        {/*  <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="urlParceria" className="w-50 px-1">Site da Parceria:</label>
                            <input type="text"
                                className="form-control h-25 w-50"
                                id="urlParceria"
                                name="urlParceria"
                            />
                            <span>Inserir URL completa para acesso ao site da parceria</span>
                        </div> */}

   {/*                      <div className="form-group d-flex flex-column align-items-center py-3">
                            <label className="w-50 px-1">Contrato:</label>
                            <ChooseFile codigoUser={param} largura={"w-50"} codImg={ids.descImagem} preview={false} patrocinador={handleChange} miniPreview={true} />

                        </div>
 */}
                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="descEndereco" className="w-50 px-1">Endereço:</label>
                            <input type="text"
                                className="form-control h-25 w-50"
                                id="endereco"
                                name="descEndereco"
                                value={ids.descEndereco}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="descCEP" className="w-50 px-1">CEP:</label>
                            <input type="text"
                                className="form-control h-25 w-50"
                                id="cod_postal"
                                name="descCEP"
                                value={ids.descCEP}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="descTelefone" className="w-50 px-1">Telefone:</label>
                            <InputMask
                                className="form-control h-25 w-50"
                                id="nu_telefone"
                                name="descTelefone"
                                value={ids.descTelefone}
                                onChange={handleChange}
                                required
                                mask={'+55\\ (99) 99999-9999'}></InputMask>
                            {/* <input type="text"
                                className="form-control h-25 w-50"
                                id="nu_telefone"
                                name="descTelefone"
                                value={ids.descTelefone}
                                onChange={handleChange}
                                required
                            /> */}
                        </div>

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="descCelular" className="w-50 px-1">Celular:</label>
                            <InputMask
                                className="form-control h-25 w-50"
                                id="nu_celular"
                                name="descCelular"
                                value={ids.descCelular}
                                onChange={handleChange}
                                required
                                mask={'+55\\ (99) 99999-9999'}></InputMask>
                            {/* <input type="text"
                                className="form-control h-25 w-50"
                                id="nu_celular"
                                name="descCelular"
                                value={ids.descCelular}
                                onChange={handleChange}
                                required
                            /> */}
                        </div>

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="descDescricao" className="w-50 px-1">Descrição do anúncio:</label>
                            <textarea type="text"
                                className="form-control h-25 w-50"
                                id="descDescricao"
                                name="descDescricao"
                                value={ids.descDescricao}
                                onChange={handleChange}
                            ></textarea>
                        </div>

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="descSite" className="w-50 px-1">Site:</label>
                            <input type="text"
                                className="form-control h-25 w-50"
                                id="urlSite"
                                name="descSite"
                                value={ids.descSite}
                                onChange={handleChange}
                                placeholder='Digite uma url válida'
                            />
                        </div>

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="descSkype" className="w-50 px-1">Skype:</label>
                            <input type="text"
                                className="form-control h-25 w-50"
                                id="urlSkype"
                                name="descSkype"
                                value={ids.descSkype || ''}
                                onChange={handleChange}
                                placeholder='Digite uma url válida'
                            />
                        </div>

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="descVideo" className="w-50 px-1">Youtube:</label>
                            <input type="text"
                                className="form-control h-25 w-50"
                                id="urlYoutube"
                                name="descVideo"
                                value={ids.descVideo}
                                onChange={handleChange}
                                placeholder='Digite uma url válida'
                            />
                        </div>

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="descEmailComercial" className="w-50 px-1">E-mail comercial:</label>
                            <input type="text"
                                className="form-control h-25 w-50"
                                id="emailComercial"
                                name="descEmailComercial"
                                value={ids.descEmailComercial}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="descEmailRetorno" className="w-50 px-1">E-mail alternativo:</label>
                            <input type="text"
                                className="form-control h-25 w-50"
                                id="emailAlternativo"
                                name="descEmailRetorno"
                                value={ids.descEmailRetorno}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="descFacebook" className="w-50 px-1">Facebook:</label>
                            <input type="text"
                                className="form-control h-25 w-50"
                                id="urlFacebook"
                                name="descFacebook"
                                value={ids.descFacebook}
                                onChange={handleChange}
                                placeholder='Digite uma url válida'
                            />
                        </div>

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="descInsta" className="w-50 px-1">Instagram:</label>
                            <input type="text"
                                className="form-control h-25 w-50"
                                id="urlInstagram"
                                name="descInsta"
                                value={ids.descInsta}
                                onChange={handleChange}
                                placeholder='Digite uma url válida'
                            />
                        </div>

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="descTweeter" className="w-50 px-1">Twitter:</label>
                            <input type="text"
                                className="form-control h-25 w-50"
                                id="urlTwitter"
                                name="descTweeter"
                                value={ids.descTweeter}
                                onChange={handleChange}
                                placeholder='Digite uma url válida'
                            />
                        </div>

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="descWhatsApp" className="w-50 px-1">WhatsApp:</label>
                            <InputMask
                                className="form-control h-25 w-50"
                                id="nu_whatszap"
                                name="descWhatsApp"
                                value={ids.descWhatsApp}
                                onChange={handleChange}
                                required
                                mask={'+55\\ (99) 99999-9999'}></InputMask>
                            {/*  <input type="text"
                                className="form-control h-25 w-50"
                                id="nu_whatszap"
                                name="descWhatsApp"
                                value={ids.descWhatsApp}
                                onChange={handleChange}
                                required
                            /> */}
                        </div>

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="descAndroid" className="w-50 px-1">Aplicativo Android:</label>
                            <input type="text"
                                className="form-control h-25 w-50"
                                id="urlAndroid"
                                name="descAndroid"
                                value={ids.descAndroid}
                                onChange={handleChange}
                                placeholder='Link do aplicativo'
                            />
                        </div>

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="descApple" className="w-50 px-1">Aplicativo iOS:</label>
                            <input type="text"
                                className="form-control h-25 w-50"
                                id="urlIos"
                                name="descApple"
                                value={ids.descApple}
                                onChange={handleChange}
                                placeholder='Link do aplicativo'
                            />
                        </div>

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="descTipoPessoa" className="w-50 px-1">Tipo de pessoa:</label>
                            <select name="descTipoPessoa" id="descTipoPessoa" className="w-50 py-1"
                                value={ids.descTipoPessoa} onChange={handleChange} required>
                                <option value="">- Selecione o tipo de pessoa -</option>
                                <option value="pf">Pessoa Física</option>
                                <option value="pj">Pessoa Jurídica</option>
                            </select>
                        </div>

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="descCPFCNPJ" className="w-50 px-1">CPF/CNPJ:</label>
                            <input type="text"
                                className="form-control h-25 w-50"
                                id="nu_documento"
                                name="descCPFCNPJ"
                                value={ids.descCPFCNPJ}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="descNomeAutorizante" className="w-50 px-1">Nome autorizante:</label>
                            <input type="text"
                                className="form-control h-25 w-50"
                                id="nm_autorizante"
                                name="descNomeAutorizante"
                                value={ids.descNomeAutorizante}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="descEmailAutorizante" className="w-50 px-1">E-mail autorizante:</label>
                            <input type="text"
                                className="form-control h-25 w-50"
                                id="emailAutorizante"
                                name="descEmailAutorizante"
                                value={ids.descEmailAutorizante}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="chavePix" className="w-50 px-1">Chave Pix:</label>
                            <input type="text"
                                className="form-control h-25 w-50"
                                id="chavePix"
                                name="chavePix"
                                value={ids.descChavePix}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="text-center py-3">
                            <button type="submit"
                                className="btn btn-info custom-button mx-2 text-light"
                                onClick={criarAnuncio} >Salvar</button>
                            <button type="button" className="btn custom-button" onClick={() => navigate('/admin/espacos')}>Cancelar</button>
                        </div>
                    </form>

                    {/* <h2>Vertical (basic) form</h2> */}
                    {/*  <form action="/action_page.php">
                        <div className="form-group d-flex flex-column align-items-center py-3">
                            {hash && <span>Código: {hash}</span>} 
                            <label htmlFor="user" className="w-50 px-1">Usuário:</label>
                            <select name="user" id="user" className="w-50 py-1" onChange={gerarNumeroAleatorio}>
                            {
                                    usuarios.map((user) => (
                                        <option value={user.codUsuario}>{user.descNome}</option>
                                    ))
                                }
                            </select>
                        </div>

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="descID" className="w-50 px-1">Descrição do ID:</label>
                            <input type="text" className="form-control h-25 w-50" id="descID" placeholder="" name="descID" />
                        </div>
                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="valorDesconto" className="w-50 px-1">Valor do desconto:</label>
                            <input type="text" className="form-control h-25 w-50" id="valorDesconto" placeholder="" name="valorDesconto" />
                            <span>Para alterar o valor para negativo, clique no icone ao lado do campo</span>
                        </div>


                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="patrocinador" className="w-50 px-1">Habilitar Patrocinador ?</label>
                            <select name="patrocinador" id="patrocinador" className="w-50 py-1">
                                <option value="1">Sim</option>
                                <option value="0">Não</option>
                            </select>
                        </div>
                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="utilizar-saldo" className="w-50 px-1">Utilizar Saldo ?</label>
                            <select name="utilizar-saldo" id="utilizar-saldo" className="w-50 py-1">
                                <option value="1">Sim</option>
                                <option value="0">Não</option>
                            </select>
                        </div>

                      
                        <div className="text-center py-3">
                            <button type="button"
                                className="btn btn-info custom-button mx-2 text-light"
                                onClick={criarID}
                            >Salvar</button>
                            <button type="submit" className="btn custom-button" onClick={() => navigate('/desconto')}>Cancelar</button>
                        </div>
                    </form> */}
                </div>
            </section >
            <footer className='w-100' style={{ position: "relative", bottom: "0px" }}>
                <p className='w-100 text-center'>© MINISITIO</p>
            </footer>
        </div >
    );
}

export default FormCadastro;
