// components/OutroComponente.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../assets/css/users.css';
import '../../assets/css/helptip.css';
import 'font-awesome/css/font-awesome.min.css';
import { masterPath } from '../../../config/config';

//LIBS
import InputMask from 'react-input-mask';

//componente
import Header from "../Header";
import Spinner from '../../../components/Spinner';
import ChooseFile from "../../../components/ChooseFile";
import Tooltip from "../../../components/Tooltip";
import HelpTip from '../../components/HelpTip';
//import { Tooltip } from 'bootstrap/dist/js/bootstrap.bundle.min';

const FormEdit = () => {


    /* const [ids, setIds] = useState([]); */
    const [usuarios, setUsuarios] = useState([]);
    const [atividadeValue, setAtividade] = useState(false);
    const [atividades, setAtividades] = useState();
    const [page, setPage] = useState(1);
    const [uf, setUfs] = useState([]);
    const [ufSelected, setUf] = useState(0);
    const [caderno, setCaderno] = useState([]);


    const [showSpinner, setShowSpinner] = useState(false);

    const [nm_usuario, setNmUsuario] = useState(false);
    const [descricaoId, setDescricaoId] = useState(false);
    const [descontoId, setDescontoId] = useState(false);
    const [hash, setHash] = useState(false);

    const [ids, setIds] = useState(
        {
            "activate": 1,
            "cashback_link": null,
            "cashback_logo": null,
            "cartao_digital": null,
            "certificado_imagem": null,
            "certificado_link": null,
            "certificado_logo": null,
            "certificado_texto": null,
            "codAnuncio": 35,
            "codAtividade": "",
            "codCaderno": 5592,
            "codCidade": 0,
            "codDesconto": 28,
            "codDuplicado": null,
            "codPA": null,
            "codTipoAnuncio": 2,
            "codUf": 53,
            "codUsuario": "",
            "descAndroid": "",
            "descAnuncio": "1",
            "descAnuncioFriendly": "",
            "descApple": "",
            "descAutorizante": "",
            "descCEP": "",
            "descCPFCNPJ": "",
            "descCelular": "",
            "descChavePix": "",
            "descContrato": null,
            "descDescricao": "",
            "descEmailAutorizante": "",
            "descEmailComercial": "",
            "descEmailRetorno": "",
            "descEndereco": "",
            "descFacebook": "",
            "descImagem": "teste",
            "descInsta": null,
            "descLat": null,
            "descLinkedin": null,
            "descLng": null,
            "descNomeAutorizante": "",
            "descPatrocinador": null,
            "descPatrocinadorLink": null,
            "descPromocao": "",
            "descSite": "",
            "descSkype": null,
            "descTelefone": "",
            "descTweeter": "",
            "descWhatsApp": null,
            "dtAlteracao": "2020-11-30T23:59:59.000Z",
            "dtCadastro": "2024-06-03T09:14:03.000Z",
            "dtCadastro2": "2012-12-27T15:14:57.000Z",
            "formaPagamento": null,
            "link_comprar": null,
            "promocaoData": null,
            "qntVisualizacoes": 73,
            "tags": "atacado,som,musica",
            "periodo": null
        }

    );



    const location = useLocation();

    const navigate = useNavigate();

    const getParam = new URLSearchParams(location.search);

    const param = getParam.get('id') ? getParam.get('id') : 1;

    const style = {
        position: "fixed",
        zIndex: "999"
    }

    useEffect(() => {
        setShowSpinner(true);

        fetch(`${masterPath.url}/atividade/:codAtividade`)
            .then((x) => x.json())
            .then((res) => {
                setAtividades(res);
                //console.log(res)
                //decodificar()
            });

        fetch(`${masterPath.url}/admin/anuncio/edit/${param}`)
            .then((x) => x.json())
            .then((res) => {
                setIds(res[0]);
                setDescricaoId(res[0].descricao);
                setDescontoId(res[0].desconto);
                setHash(res[0].hash);
                setUf(res[0].codUf);

                fetch(`${masterPath.url}/cadernos?uf=${res[0].codUf}`)
                    .then((x) => x.json())
                    .then((res) => {
                        setCaderno(res);
                    })

            }).catch((err) => {
                console.log(err)
            })
        fetch(`${masterPath.url}/admin/usuario/buscar/all`)
            .then((x) => x.json())
            .then((res) => {
                setUsuarios(res.usuarios);
                setShowSpinner(false);
            }).catch((err) => {
                console.log(err);
                setShowSpinner(false);
            })

        /*     fetch(`${masterPath.url}/cadernos`)
                .then((x) => x.json())
                .then((res) => {
                    setCaderno(res)
                }) */
        fetch(`${masterPath.url}/ufs`)
            .then((x) => x.json())
            .then((res) => {
                setUfs(res);
            })

    }, []);


    function editID() {

        ids.descImagem = localStorage.getItem("imgname");
        console.log(ids)

        var validation = false;
        setShowSpinner(true);

        document.querySelectorAll('[name="pwd"]').forEach((item) => {
            if (item.value == "") {
                item.style.border = "1px solid red";
                validation = false;
                return;
            } else {
                item.style.border = "1px solid gray";
                validation = true;
            };
        });

        document.querySelectorAll('select').forEach((item) => {
            if (item.value == "") {
                item.style.border = "1px solid red";
                validation = false;
                return;
            } else {
                item.style.border = "1px solid gray";
                validation = true;
            };
        });



        const config = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "authorization": 'Bearer ' + masterPath.accessToken
            },
            body: JSON.stringify(ids)
        };

        if (validation) {
            fetch(`${masterPath.url}/admin/anuncio/update?id=${param}`, config)
                .then((x) => x.json())
                .then((res) => {
                    console.log(res)
                    if (res.success) {
                        setShowSpinner(false);
                        alert("anuncio Atualizado!");
                        document.querySelector(".espacos").click();
                    } else {
                        alert(res.message);
                    }
                })
        }

    };


    //liberar campo select
    document.querySelectorAll('select').forEach((item) => {
        item.addEventListener("change", (event) => {
            event.target.style.border = "1px solid gray";
        })
    });
    //liberar campo input
    document.querySelectorAll('[name="pwd"]').forEach((item) => {
        item.addEventListener("change", (event) => {
            event.target.style.border = "1px solid gray";
        })
    });


    function teste(meuParam) {
        let user = usuarios.find(user => user.codUsuario == meuParam);

        if (user != undefined) {
            return user.descNome
        }
        console.log("users", meuParam, user)

    }

    const executarSelecao = () => {
        let codigoUf = document.querySelectorAll('#coduf')[0].value;
        setUf(codigoUf);
    };

    // Função para lidar com mudanças nos campos de entrada
    const handleChange = (e) => {
        const { name, value } = e.target;
        setIds({
            ...ids,
            [name]: value,

        });

        /*  console.log("resressedsfasdfsf----------->", name, value)
         console.log(ids.descCPFCNPJ.replace(/\D/g, '').length)
         console.log(ids.descCPFCNPJ.replace(/\D/g, '')) */

    };

    const handleSelectChange = (e) => {
        executarSelecao(e);
        handleChange(e);
    };

    // Determina a máscara com base no tamanho do valor inserido
    //const mask = ids.descCPFCNPJ.length <= 14 ? '999.999.999-99' : '99.999.999/9999-99';
    const unmaskedValue = ids.descCPFCNPJ.replace(/\D/g, ''); // Remove tudo que não é número
    const mask = unmaskedValue.length == 14
        ? '99.999.999/9999-99' // CNPJ
        : '999.999.999-99';    // CPF


    function changeUf(e) {
        fetch(`${masterPath.url}/cadernos?uf=${e.target.value}`)
            .then((x) => x.json())
            .then((res) => {
                setCaderno(res);
            })
        //setEstadoSelecionado(e.target.value)
        setUf(e.target.value);
        console.log(e.target.value)
    }

    return (

        <div className="users">
            {/* console.log(ids) */}
            <header style={style} className='w-100'>
                <Header />
            </header>
            <section className='py-5'>
                {showSpinner && <Spinner />}

                <div className="container">
                    <h2 className="pt-4 px-5 text-center">Editar Anúncio</h2>
                    {/* <h2>Vertical (basic) form</h2> */}
                    <form action="/action_page.php">
                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="codUsuario" className="w-50 px-1">Usuário: (Digite o nome, e-mail ou CPF/CNPJ)</label>
                            <input type="text"
                                className="form-control h-25 w-50"
                                id="nm_usuario"
                                name="codUsuario"
                                value={ids.codUsuario}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="codAtividade" className="w-50 px-1">Atividade: (Digite o nome)</label>
                            <select
                                name="codAtividade"
                                id="codAtividade"
                                className="w-50"
                                style={{ 'height': '30px' }}
                                onChange={handleChange}
                                value={ids.codAtividade}
                                required
                            >

                                {atividades &&

                                    atividades.map(
                                        (item) => (
                                            <option key={item.id} value={item.atividade}>
                                                {item.nomeAmigavel}
                                            </option>
                                        )
                                    )
                                }
                            </select>
                        </div>

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="codTipoAnuncio" className="w-50 px-1">Tipo de anúncio</label>
                            <select name="codTipoAnuncio" id="descTipoAnuncio" className="w-50 py-1" onChange={handleChange} value={ids.codTipoAnuncio} >
                                <option selected="selected">- Selecione o tipo de anúncio -</option>
                                <option value="1">Básico</option>
                                <option value="2">Simples</option>
                                <option value="3">Completo</option>
                            </select>
                        </div>

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="codUf" className="w-50 px-1">UF:</label>
                            <select name="codUf" id="coduf" onChange={(e) => changeUf(e)} className="w-50 py-1" value={ufSelected} >
                                <option value="" selected="selected">- Selecione um estado -</option>
                                {
                                    uf.map((uf) => (
                                        <option key={uf.id_uf} value={uf.sigla_uf}>{uf.sigla_uf}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="codCaderno" className="w-50 px-1">Caderno:</label>
                            <select name="codCaderno" id="codCaderno" className="w-50 py-1" value={ids.codCaderno} onChange={handleChange}>
                                {/*  <option value="" selected="selected">- Selecione uma cidade -</option> */}
                                {
                                    caderno.map((cidades) => (
                                        cidades.UF == ufSelected &&
                                        <option value={cidades.nomeCaderno}>{cidades.nomeCaderno}</option>
                                    ))
                                    /*   caderno.map((cidades) => (
                                         <option value={cidades.codCaderno}>{cidades.nomeCaderno}</option>
                                     ))  */
                                }
                            </select>
                        </div>




                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="descAnuncio" className="w-50 px-1">Nome da empresa:</label>
                            <input type="text"
                                className="form-control h-25 w-50"
                                id="nm_empresa"
                                name="descAnuncio"
                                value={ids.descAnuncio}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label className="w-50 px-1">Imagem:
                                <Tooltip text={"Insira o cartão de visita que irá aparecer no card do anúncio"}><span className="help-span">?</span></Tooltip>

                            </label>
                            <ChooseFile codigoUser={param} largura={"w-50"} codImg={ids.descImagem} preview={false} patrocinador={handleChange} miniPreview={true} />
                        </div>


                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label className="w-50 px-1">Promoção:
                            </label>
                            <ChooseFile codigoUser={param} largura={"w-50"} codImg={ids.descPromocao} preview={false} />
                        </div>


                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label className="w-50 px-1">Validade da promoção de desconto:</label>
                            <input type="date" name="validade" id="validade" className="form-control h-25 w-50" />
                        </div>

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label className="w-50 px-1">Imagem da Parceria:
                                <Tooltip text={"Insira a logotipo do parceiro"}><span className="help-span">?</span></Tooltip>
                            </label>
                            <ChooseFile codigoUser={param} largura={"w-50"} codImg={ids.descPromocao} preview={false} />
                        </div>

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="urlParceria" className="w-50 px-1">Site da Parceria:</label>
                            <input type="text"
                                className="form-control h-25 w-50"
                                id="urlParceria"
                                name="urlParceria"
                                value={descontoId}
                                onChange={(e) => setDescontoId(e.target.value)}
                            />
                            <span>Inserir URL completa para acesso ao site da parceria</span>
                        </div>

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label className="w-50 px-1">Contrato:</label>
                            <ChooseFile codigoUser={param} largura={"w-50"} codImg={ids.descPromocao} preview={false} />
                        </div>

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="descEndereco" className="w-50 px-1">Endereço:</label>
                            <input type="text"
                                className="form-control h-25 w-50"
                                id="endereco"
                                name="descEndereco"
                                value={ids.descEndereco}
                                onChange={handleChange}
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
                            />
                        </div>

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="descTelefone" className="w-50 px-1">Telefone:</label>
                            <InputMask mask={'+55\\ (99) 9999-9999'}
                                className="form-control h-25 w-50"
                                id="nu_telefone"
                                name="descTelefone"
                                value={ids.descTelefone}
                                onChange={handleChange}
                            ></InputMask>
                            {/*         <input type="text"
                                className="form-control h-25 w-50"
                                id="nu_telefone"
                                name="descTelefone"
                                value={ids.descTelefone}
                                onChange={handleChange}
                                
                            /> */}


                        </div>

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="descCelular" className="w-50 px-1">Celular:</label>
                            <InputMask mask={'+55\\ (99) 9999-9999'}
                                className="form-control h-25 w-50"
                                id="nu_celular"
                                name="descCelular"
                                value={ids.descCelular}
                                onChange={handleChange}
                            ></InputMask>
                            {/*      <input type="text"
                                className="form-control h-25 w-50"
                                id="nu_celular"
                                name="descCelular"
                                value={ids.descCelular}
                                onChange={handleChange}
                            /> */}
                        </div>

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="descDescricao" className="w-50 px-1">Descrição do anúncio:</label>
                            <textarea type="text"
                                className="form-control h-25 w-50"
                                id="descAnuncio"
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
                            <InputMask mask={'+55\\ (99) 9999-9999'}
                                className="form-control h-25 w-50"
                                id="nu_whatszap"
                                name="descWhatsApp"
                                value={ids.descWhatsApp}
                                onChange={handleChange}></InputMask>
                            {/*              <input type="text"
                                className="form-control h-25 w-50"
                                id="nu_whatszap"
                                name="descWhatsApp"
                                value={ids.descWhatsApp}
                                onChange={handleChange}
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
                                placeholder='Digite uma url válida'
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
                                placeholder='Digite uma url válida'
                            />
                        </div>

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="descTipoPessoa" className="w-50 px-1">Tipo de pessoa:</label>
                            <select name="descTipoPessoa" id="descTipoPessoa" className="w-50 py-1" value={ids.descTipoPessoa} onChange={handleChange}>
                                <option selected="selected">- Selecione o tipo de pessoa -</option>
                                <option value="pf">Pessoa Física</option>
                                <option value="pj">Pessoa Jurídica</option>
                            </select>
                        </div>

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="descCPFCNPJ" className="w-50 px-1">CPF/CNPJ:</label>
                            {/*     <InputMask
                            className="form-control h-25 w-50"
                            id="nu_documento"
                            name="descCPFCNPJ"
                            value={ids.descCPFCNPJ}
                            onChange={handleChange}
                            mask={mask}></InputMask> */}
                            <input type="text"
                                className="form-control h-25 w-50"
                                id="nu_documento"
                                name="descCPFCNPJ"
                                value={ids.descCPFCNPJ}
                                onChange={handleChange}
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

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="periodo" className="w-50 px-1">Periodo de teste:</label>
                            <input type="text"
                                className="form-control h-25 w-50"
                                id="periodo"
                                name="periodo"
                                value={ids.periodo}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="text-center py-3">
                            <button type="button"
                                className="btn btn-info custom-button mx-2 text-light"
                                onClick={editID} >Salvar</button>
                            <button type="submit" className="btn custom-button" onClick={() => navigate('/admin/espacos')}>Cancelar</button>
                        </div>
                    </form>
                </div>
            </section >
            <footer className='w-100' style={{ position: "relative", bottom: "0px" }}>
                <p className='w-100 text-center'>© MINISITIO</p>
            </footer>
        </div >
    );
}

export default FormEdit;
