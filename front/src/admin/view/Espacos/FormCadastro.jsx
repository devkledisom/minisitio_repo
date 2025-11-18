import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { masterPath } from '../../../config/config';
import he from 'he';



//lib
import {
    BsShareFill,
    BsFillSendFill,
    BsFacebook,
    BsInstagram,
    BsTwitter,
    BsYoutube,
    BsWhatsapp,
    BsSkype,
    BsHeadset,
} from "react-icons/bs";

//componente
import Header from "../Header";
import "../../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../../assets/css/formEspacos.css";
import "../../assets/css/comprar-anuncio.css";
import ChooseFile from "../../components/ChooseFile";
import TemplateModal from "../../../components/Modal/TemplateModal";

import Mosaico from "../../../components/Mosaico";
import Busca from "../../../components/Busca";
import Nav from "../../../components/Nav";
import Footer from "../../../components/Footer";
import Tooltip from "../../../components/Tooltip";
import Localidade from "../../../components/Localidade";
import Marcadores from "../../../components/Forms/Marcadores";
import Map from '../../../components/Maps/Map';
import MapContainer from "../../../components/MapContainer";
import TagsInput from "../../components/TagsInput";
import Spinner from '../../../components/Spinner';


//FUNCTIONS
import moveToTop from '../../functions/moverParaTop';

//LIBS
import InputMask from 'react-input-mask';

function ComprarAnuncio() {
    //States
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
    const [ufSelected, setUf] = useState(0);
    const [uf, setUfs] = useState([]);
    const [caderno, setCaderno] = useState([]);
    const [codUser, setCodUser] = useState([]);
    const [atividades, setAtividades] = useState();
    const [radioCheck, setRadioCheck] = useState(1);
    const [personType, setPersonType] = useState("pf");
    const [cep, setCep] = useState();
    const [showMap, setShowMap] = useState("none");
    const [precoFixo, setPrecoFixo] = useState(5);
    const [tagValue, setTagValue] = useState();
    const [showSpinner, setShowSpinner] = useState(false);
    const [usuarios, setUsuarios] = useState({});
    const [cpfCnpjValue, setcpfCnpjValue] = useState({});



    const executarSelecao = () => {
        let codigoUf = document.querySelectorAll("#codUf4")[0].value;
        setUf(codigoUf);
    };

    useEffect(() => {
      /*   fetch(`${masterPath.url}/cadernos`)
            .then((x) => x.json())
            .then((res) => {
                setCaderno(res);
                //console.log(res)
            });
        fetch(`${masterPath.url}/ufs`)
            .then((x) => x.json())
            .then((res) => {
                setUfs(res);
                //console.log(res)
            }); */
        fetch(`${masterPath.url}/pa`)
            .then((x) => x.json())
            .then((res) => {
                setCodUser(res.message + 1);
                //console.log(res)
            });
        fetch(`${masterPath.url}/atividade/:codAtividade`)
            .then((x) => x.json())
            .then((res) => {
                setAtividades(res);
                //console.log(res)
                //decodificar()
            });
    }, []);



    const [descAnuncio, setDescAnuncio] = useState(false);
    const [descEndereco, setDescEndereco] = useState(false);
    const [descTelefone, setDescTelefone] = useState(false);
    const [descCelular, setDescCelular] = useState(false);

    const changePreview = (event) => {

        switch (event.target.name) {
            case "descAnuncio":
                setDescAnuncio(event.target.value);
                break;
            case "descEndereco":
                setDescEndereco(event.target.value);
                break;
            case "descTelefone":
                const novoValorTel = event.target.value.replace(/\D/g, '');

                if (novoValorTel.length > 0) {
                    const valorComMascara = `(${novoValorTel.substring(0, 2)}) ${novoValorTel.substring(2, 6)}-${novoValorTel.substring(6, 10)}`;
                    setDescTelefone(valorComMascara);
                } else {
                    setDescTelefone(false);
                }
                break;
            case "descCelular":
                const novoValor = event.target.value.replace(/\D/g, '');

                if (novoValor.length > 0) {
                    const valorComMascara = `(${novoValor.substring(0, 2)}) ${novoValor.substring(2, 7)}-${novoValor.substring(7, 11)}`;
                    setDescCelular(valorComMascara);
                } else {
                    setDescCelular(false);
                }
                break;

        }
    };

    function aplicarCupom(e) {
        let codId = e.target.value;

        if (codId.length == 11 || codId.length == 12) {
            fetch(`${masterPath.url}/admin/desconto/buscar/${codId}`)
                .then((x) => x.json())
                .then((res) => {
                    let valorDesconto = res.IdsValue[0].desconto;
                    let precoComDesconto = precoFixo - valorDesconto;
                    setPrecoFixo(precoComDesconto);
                    //console.log(precoComDesconto)
                })
        }



        //console.log(codId);
    };

    const style = {
        position: "fixed",
        zIndex: "999"
    }

    function cadastrarAnuncio(e) {
        e.preventDefault();
        setShowSpinner(true);
        moveToTop();

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

        const formData = new FormData(e.target);
        const formValues = Object.fromEntries(formData.entries());

        console.log(formValues);

        setIds((prevIds) => {
            console.log('Estado Anterior:', prevIds);
            return {
                ...prevIds,
                ...formValues
            };
        });

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
            event.target.style.border = "none";
        })
    });

    // Função para lidar com mudanças nos campos de entrada
    const handleChange = (e) => {
        const { name, value } = e.target;
        setIds({
            ...ids,
            [name]: value
        });
        //console.log(e.target)


    };

    const handleCpfCnpjChange = (event) => {
        // Obter apenas os números da entrada de dados
        let data = event.target.value.replace(/\D/g, "");

        // Verificar o comprimento dos dados para definir se é CPF ou CNPJ
        if (data.length > 11) {
            // É CNPJ
            data = `${data.substr(0, 2)}.${data.substr(2, 3)}.${data.substr(5, 3)}/${data.substr(8, 4)}-${data.substr(12, 2)}`;
        } else {
            // É CPF
            if (data.length > 9) {
                data = `${data.substr(0, 3)}.${data.substr(3, 3)}.${data.substr(6, 3)}-${data.substr(9, 2)}`;
            } else if (data.length > 6) {
                data = `${data.substr(0, 3)}.${data.substr(3, 3)}.${data.substr(6)}`;
            } else if (data.length > 3) {
                data = `${data.substr(0, 3)}.${data.substr(3)}`;
            }
        }

        // Atualizar o estado
        setcpfCnpjValue(data);
    };


    return (
        <div className="App">
           {/*  <header style={style} className='w-100'>
                <Header />
            </header> */}
            {showSpinner && <Spinner />}
            <main>
                <h1 id="title-caderno">
                    Cadastro da Assinatura/Anúncio
                </h1>
                <h2 className="py-4">
                    Preencha os campos abaixo para simular e incluir sua
                    Assinatura/Anúncio.
                </h2>
                <form className="container d-flex flex-row" onSubmit={cadastrarAnuncio}>
                    {/*inicio da row form */}
                    <div className="row col-md-6 p-3 interna" id="form-cadastro-data">
                        <div className="formulario-de-cadastro-titulo">
                            <h2>Formulário de Cadastro</h2>
                        </div>
                        <div className="anuncio">
                            <div className="form-group">
                                <label className="col-md-5 control-label tipo-de-anuncio">
                                    Tipo de anúncio:
                                </label>
                                <div className="col-md-12 anuncio-options">
                                    <label>
                                        <input
                                            type="radio"
                                            name="codTipoAnuncio"
                                            id="codTipoAnuncio-1"
                                            value="1"
                                            onClick={(e) => { setRadioCheck(e.target.value); setShowMap("none") }}
                                            checked={radioCheck == 1}
                                        />
                                        Básico
                                    </label>
                                    {/*  <label className="px-3">
                                        <input
                                            type="radio"
                                            name="codTipoAnuncio"
                                            id="codTipoAnuncio-2"
                                            value="2"
                                            onClick={(e) => { setRadioCheck(e.target.value); setShowMap("block") }}
                                            checked={radioCheck == 2}
                                        />
                                        Simples
                                    </label> */}
                                    <label className="mx-2">
                                        <input
                                            type="radio"
                                            name="codTipoAnuncio"
                                            id="codTipoAnuncio-3"
                                            value="3"
                                            onClick={(e) => setRadioCheck(e.target.value)}
                                            checked={radioCheck == 3}
                                        />
                                        Completo
                                    </label>
                                </div>
                            </div>
                        </div>
                        {/*dados para codigo promocional*/}
                        {radioCheck != 1 && <div
                            className="codigo-promocional webcard"
                            style={{ display: "block" }}
                        >
                            <h4 className="text-start">Código Promocional (ID):</h4>
                            <div className="input-icon margin-top-10" id="codigoPromocional">
                                <i className="fa fa-credit-card"></i>
                                <input
                                    type="text"
                                    name="codDesconto"
                                    id="codDesconto"
                                    className="form-control"
                                    placeholder="Digite seu código"
                                    style={{ backgroundColor: "#96d18b" }}
                                    onChange={aplicarCupom}
                                />
                                <input
                                    type="hidden"
                                    name="discountValue"
                                    value=""
                                    id="discountValue"
                                />
                            </div>
                            <h5 className="text-start">
                                Ao inserir o código não esqueça dos pontos. (Ex: 99.1234.9874)
                            </h5>
                        </div>}

                        {/*dados para publicação*/}
                        <div className="assinatura">
                            <h2>Dados para Publicação</h2>
                        </div>

                        <div className="codigo-promocional">
                            <h4 style={{ margin: "10px 0 25px 2px" }}>
                               {/*  Código PA: <strong>{codUser}</strong> */}
                            </h4>



                            <div className="input-icon margin-top-10">
                                <i className="fa fa-user"></i>

                                <input
                                    type="text"
                                    name="codUsuario"
                                    id="codUsuario"
                                    className="form-control"
                                    placeholder="Digite o nome, e-mail ou CPF/CNPJ do usuario"
                                    maxlength="40"
                                    onChange={changePreview}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <div className="input-icon margin-top-10">
                                    <i className="fa fa-briefcase icone-form p-0"></i>
                                    <select
                                        name="codAtividade"
                                        id="codAtividade"
                                        className="form-control"
                                        required
                                    >
                                        <option value="">Selecione a atividade principal</option>
                                        {atividades &&

                                            atividades.map(
                                                (item) =>

                                                    <option
                                                        key={item.id}
                                                        value={item.id}
                                                    >
                                                        {item.atividade}
                                                    </option>

                                            )}
                                    </select>
                                </div>

                                {/* <Marcadores /> */}
                                <TagsInput tagValue={setTagValue} />

                                <div className="row">
                                    <div class="col-md-4 col-xs-12">
                                        <div class="form-group input-icon margin-top-10">
                                            <i class="fa fa-compass icone-form p-0"></i>
                                            <select
                                                name="codUf"
                                                id="codUf4"
                                                class="form-control"
                                                onChange={executarSelecao}
                                                required
                                            >
                                                <option value="" selected="selected">
                                                    - UF -
                                                </option>
                                                {uf.map((item) => (
                                                    <option
                                                        id={item.id_uf}
                                                        key={item.id_uf}
                                                        value={item.id_uf}
                                                    >
                                                        {item.sigla_uf}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div class="col-md-8 col-xs-12">
                                        <div class="form-group selectCaderno form-group input-icon margin-top-10">
                                            <i class="fa fa-map-marker icone-form p-0"></i>
                                            <select
                                                name="codCaderno"
                                                id="codUf5"
                                                class="form-control"
                                                required
                                            >
                                                <option value="">- TODO -</option>
                                                {caderno.map(
                                                    (item) =>
                                                        item.codUf == ufSelected && (
                                                            <option
                                                                id={item.codCaderno}
                                                                key={item.codCaderno}
                                                                value={item.codCaderno}
                                                            >
                                                                {item.nomeCaderno}
                                                            </option>
                                                        )
                                                )}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="input-icon margin-top-10">
                                    <i className="fa fa-building"></i>

                                    <input
                                        type="text"
                                        name="descAnuncio"
                                        id="descAnuncio"
                                        className="form-control"
                                        placeholder="Digite o nome"
                                        maxlength="40"
                                        onChange={changePreview}
                                        required
                                    />
                                </div>

                                {radioCheck != 1 && <ChooseFile codigoUser={codUser} />}
                                {/*      {radioCheck != 1 && 
                                
                                <ChooseFile codigoUser={codUser} largura={"w-100"} codImg={ids.descImagem} preview={false} patrocinador={handleChange} miniPreview={true} />


                                } */}

                                <div className="input-icon margin-top-10">
                                    <i className="fa fa-map-marker"></i>
                                    <input
                                        type="text"
                                        name="descEndereco"
                                        id="descEndereco"
                                        className="form-control"
                                        placeholder="Digite o endereço"
                                        onChange={changePreview}
                                        required
                                    />
                                </div>
                                {radioCheck != 1 && <div
                                    className="input-icon margin-top-10 webcard"
                                    style={{ display: "block" }}
                                >
                                    <i className="fa fa-location-arrow"></i>
                                    <input
                                        type="text"
                                        name="descCEP"
                                        id="descCEP"
                                        className="form-control"
                                        placeholder="Digite o CEP"
                                        onChange={(e) => setCep(e.target.value)}
                                        required
                                    />
                                </div>}

                                {/* {radioCheck != 1 && <MapContainer cep={cep} />} */}
                                <MapContainer cep={cep} showMap={showMap} />


                                <div className="row webcard" style={{ display: "block" }}>
                                    <div className="col-md-12"></div>
                                </div>
                                <div className="input-icon margin-top-10">
                                    <i className="fa fa-phone"></i>
                                    <InputMask
                                        type="text"
                                        name="descTelefone"
                                        id="descTelefone"
                                        className="form-control"
                                        placeholder="(99) 99999-9999"
                                        onChange={changePreview}
                                        required
                                        mask={'(99) 9999-9999'}></InputMask>

                                </div>
                                {radioCheck != 1 && <div
                                    className="input-icon margin-top-10 webcard"
                                    style={{ display: "block" }}
                                >
                                    <i className="fa fa-mobile"></i>
                                    <InputMask
                                        type="text"
                                        name="descCelular"
                                        id="descCelular"
                                        className="form-control"
                                        placeholder="(99) 99999-9999"
                                        onChange={changePreview}
                                        required
                                        mask={'(99) 99999-9999'}></InputMask>
                                    {/*  <input
                                        type="text"
                                        name="descCelular"
                                        id="descCelular"
                                        className="form-control"
                                        placeholder="Digite o seu celular"
                                        maxLength={11}
                                        onChange={changePreview}
                                        required
                                    /> */}
                                </div>}
                            </div>
                        </div>
                        {/*dados para publicação*/}

                        {/* Detalhes do anuncio */}

                        {radioCheck != 1 && <div className="assinatura webcard" style={{ display: "block" }}>
                            <h2>Detalhes do Anúncio</h2>
                        </div>}
                        {radioCheck != 1 && <div
                            className="codigo-promocional webcard"
                            style={{ display: "block" }}
                        >
                            <div className="input-icon margin-top-10">
                                <i className="fa fa-youtube"></i>
                                <input
                                    type="text"
                                    name="descVideo"
                                    id="descVideo"
                                    className="form-control"
                                    placeholder="Digite o vídeo"
                                />
                            </div>
                            <div className="input-icon margin-top-10">
                                <i className="fa fa-envelope"></i>
                                <input
                                    type="text"
                                    name="descEmailComercial"
                                    id="descEmailComercial"
                                    className="form-control"
                                    placeholder="Digite o e-mail (comercial)"
                                    required
                                />
                            </div>
                            <div className="input-icon margin-top-10">
                                <i className="fa fa-envelope-o"></i>
                                <input
                                    type="text"
                                    name="descEmailRetorno"
                                    id="descEmailRetorno"
                                    className="form-control"
                                    placeholder="Digite o e-mail (alternativo)"
                                />
                            </div>
                            <div className="input-icon margin-top-10">
                                <i className="fa fa-mobile"></i>
                                <InputMask
                                    type="text"
                                    name="descWhatsApp"
                                    id="descWhatsApp"
                                    className="form-control"
                                    placeholder="(99) 99999-9999"
                                    onChange={changePreview}
                                    required
                                    mask={'(99) 99999-9999'}></InputMask>
                            </div>
                        </div>}
                        {/* Detalhes do anuncio */}

                        {/* Autorizante */}

                        <div className="assinatura">
                            <h2>Autorizante</h2>
                        </div>
                        <div className="codigo-promocional">
                            <div className="row">
                                <div className="form-group row">
                                    <label className="col-md-4 control-label tipo-de-anuncio">
                                        Tipo:
                                    </label>
                                    <div className="col-md-8 anuncio-options">
                                        <label className="px-3">
                                            <input
                                                type="radio"
                                                name="descTipoPessoa"
                                                id="descTipoPessoa-pf"
                                                value="pf"
                                                onChange={(e) => setPersonType(e.target.value)}
                                                checked={personType == "pf"}
                                            />
                                            Pessoa física
                                        </label>
                                        <span className="radio-saparator"></span>
                                        <label>
                                            <input
                                                type="radio"
                                                name="descTipoPessoa"
                                                id="descTipoPessoa-pj"
                                                value="pj"
                                                onChange={(e) => setPersonType(e.target.value)}
                                                checked={personType == "pj"}
                                            />
                                            Pessoa jurídica
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="input-icon margin-top-10">
                                <i className="fa fa-credit-card"></i>
                                <input
                                    type="text"
                                    name="descCPFCNPJ"
                                    id="descCPFCNPJ"
                                    className="form-control"
                                    placeholder="Digite um CPF ou CNPJ"
                                    onChange={handleCpfCnpjChange}
                                    value={cpfCnpjValue}
                                    required
                                />
                            </div>
                            <div className="input-icon margin-top-10  py-2">
                                <i className="fa fa-user"></i>
                                <input
                                    type="text"
                                    name="descNomeAutorizante"
                                    id="descNomeAutorizante"
                                    className="form-control"
                                    placeholder="Digite o seu nome"
                                    required
                                />
                            </div>
                            <div className="input-icon margin-top-10">
                                <i className="fa fa-envelope"></i>
                                <input
                                    type="text"
                                    name="descEmailAutorizante"
                                    id="descEmailAutorizante"
                                    className="form-control"
                                    placeholder="Digite o seu e-mail"
                                    required
                                />
                            </div>
                            {/* {radioCheck != 1 && */} <div class="input-icon margin-top-10">
                                <h4 className="text-start pt-2">Responsável pela Indicação (opcional)</h4>
                                <div class="input-icon margin-top-10" id="codigoPromocional">
                                    <i class="fa fa-credit-card"></i>

                                    <input type="text" name="discountHash" id="discountHash" value="" class="form-control" placeholder="Digite seu código" />
                                    <input type="hidden" name="discountValue" value="" id="discountValue" />
                                </div>
                                {/* <h5 className="text-start">Ao inserir o código não esqueça dos pontos. (Ex: 99.1234.9874)</h5> */}
                            </div>{/* } */}
                        </div>
                        {/* Autorizante */}

                        {/* Forma de Pagamento */}

                        {radioCheck != 1 && <div
                            className="assinatura webcard formaPagamento"
                            style={{ display: "block" }}
                        >
                            <h2>Forma de Pagamento</h2>
                        </div>}
                        {radioCheck != 1 && <div
                            className="codigo-promocional webcard formaPagamento"
                            style={{ display: "block" }}
                        >
                            <div className="row">
                                <div className="form-group">
                                    <div className="hidden">
                                        <label>
                                            <input
                                                type="radio"
                                                name="formaPagamento"
                                                id="formaPagamento-pagseguro"
                                                value="pagseguro"
                                                checked="checked"
                                            />
                                            <i
                                                className="wid pagseguro"
                                                data-toggle="tooltip"
                                                title="PAGSEGURO"
                                            ></i>
                                        </label>
                                    </div>
                                    <div className="col-md-12 observacao">
                                        <h5>
                                            Você será redirecionado para o ambiente do PagSeguro
                                        </h5>
                                        <img src="../../assets/img/cartoes.gif" alt="Cartões" />
                                    </div>
                                </div>
                            </div>
                        </div>}
                        {/* Forma de Pagamento */}

                    </div>
                    {/*fina da row*/}

                    {/* simulacao preview row */}
                    <div className="row col-md-7 p-4 interna">
                        <div
                            className="simulacao"
                            style={{ position: "sticky" }}
                        /* style={(elementoProximoTopo) ? {position: "fixed", top: "0px", marginTop: "20px"} : { position: "relative" }} */
                        >


                            {/* preview */}

                            <div className="posicao-preview">

                                <div className="simulacao-do-anuncio">
                                    <h2 className="assinatura">Simulação do Anúncio</h2>
                                </div>

                                <div className="codigo-promocional posicao-preview">
                                    <div className="cartao p-3">
                                        <div className="conteudo semImagem">
                                            <h2 className="nome-empresa text-start">{(descAnuncio) ? descAnuncio : "Nome da empresa"}</h2>
                                            {radioCheck != 1 && <h4
                                                className="slogan webcard text-start"
                                                style={{ display: "block" }}
                                            >
                                                Frase/slogan da empresa
                                            </h4>}
                                            <p className="text-start">
                                                <i className="fa fa-map-marker"></i>
                                                <span className="sim-end">{(descEndereco) ? descEndereco : "Endereço da empresa"}</span>
                                            </p>
                                            <p className="text-start">
                                                <i className="fa fa-phone"></i>
                                                <span className="sim-tel">{(descTelefone) ? descTelefone : "(xx) xxxx-xxxx"}</span>
                                            </p>
                                            {radioCheck != 1 && <p
                                                className="webcard text-start"
                                                style={{ display: "block" }}
                                            >
                                                <i className="fa fa-phone"></i>
                                                <span className="cel">{(descCelular) ? descCelular : "(xx) xxxxx-xxxx"}</span>
                                            </p>}
                                        </div>
                                        <div class="conteudo comImagem" style={{ display: "none" }}>
                                            <img src="/resources/upload/istockphoto_1442417585_612x612_20240428_215703.jpg" height={191} />
                                        </div>
                                        {radioCheck != 1 && <div id="area-icons-actions" className="col-md-6">
                                            <Tooltip text={"Mídias"}>
                                                <div className="dropdown">
                                                    <button
                                                        id="dropdown"
                                                        className="btn btn-primary dropdown-toggle"
                                                        data-bs-toggle="dropdown"
                                                    >
                                                        <i>
                                                            <BsShareFill />
                                                        </i>
                                                    </button>
                                                    <ul id="dropdown-redes" className="dropdown-menu">
                                                        <a href="#" className="dropdown-item">
                                                            <BsFacebook /> Facebook
                                                        </a>
                                                        <a href="#" className="dropdown-item">
                                                            <BsInstagram /> Instagram
                                                        </a>
                                                        <a href="#" className="dropdown-item">
                                                            <BsTwitter /> Tweet
                                                        </a>
                                                        <a href="#" className="dropdown-item">
                                                            <BsYoutube className="redes" /> Youtube
                                                        </a>
                                                        <a href="#" className="dropdown-item">
                                                            <BsWhatsapp /> Whatsapp
                                                        </a>
                                                        <a href="#" className="dropdown-item">
                                                            <BsSkype /> Skype
                                                        </a>
                                                        <a href="#" className="dropdown-item">
                                                            <BsHeadset /> Sac-Fale Comigo
                                                        </a>
                                                    </ul>
                                                </div>
                                            </Tooltip>
                                            <Tooltip text={"Mapa"}>
                                                <i>
                                                    <img
                                                        src="../assets/img/link_mapa.png"
                                                        alt=""
                                                        height={40}
                                                    />
                                                </i>
                                            </Tooltip>

                                            <Tooltip text={"Site"}>
                                                <i>
                                                    <img
                                                        src="../assets/img/link_site.png"
                                                        alt=""
                                                        height={40}
                                                    />
                                                </i>
                                            </Tooltip>
                                            <Tooltip text={"Promoção"}>
                                                <i>
                                                    <img
                                                        src="../assets/img/link_promocao.png"
                                                        alt=""
                                                        height={40}
                                                    />
                                                </i>
                                            </Tooltip>

                                            <Tooltip text={"Compartilhar"}>
                                                <div className="dropdown">
                                                    <button
                                                        id="dropdown"
                                                        className="btn btn-primary dropdown-toggle"
                                                        data-bs-toggle="dropdown"
                                                    >
                                                        <i>
                                                            <BsFillSendFill />
                                                        </i>
                                                    </button>
                                                    <ul id="dropdown-redes" className="dropdown-menu">
                                                        <a href="#" className="dropdown-item">
                                                            <BsFacebook /> Facebook
                                                        </a>
                                                        <a href="#" className="dropdown-item">
                                                            <BsInstagram /> Instagram
                                                        </a>
                                                        <a href="#" className="dropdown-item">
                                                            <BsTwitter /> Tweet
                                                        </a>
                                                        <a href="#" className="dropdown-item">
                                                            <BsYoutube /> Youtube
                                                        </a>
                                                        <a href="#" className="dropdown-item">
                                                            <BsWhatsapp /> Whatsapp
                                                        </a>
                                                    </ul>
                                                </div>
                                            </Tooltip>
                                        </div>}

                                    </div>
                                    <div className="assinatura margin-top-20">

                                        {radioCheck != 1 && <h2 className="webcard">
                                            <span className="preco">R$ {precoFixo},00</span>/mês
                                        </h2>}
                                        {radioCheck == 1 && <h2 className="simples uppercase">
                                            Grátis
                                        </h2>}
                                    </div>
                                    <div className="margin-top-20">
                                        {radioCheck != 1 && <p className="webcard" style={{ display: "block" }}>
                                            *A duração da assinatura é de 12 meses, portanto válido até
                                            14/04/2025.
                                        </p>}
                                        <button
                                            type="submit"
                                            className="btn-block formulario-de-cadastro btn btn-primary"
                                            id="anunciar"
                                        /* onClick={cadastrarAnuncio} */
                                        >
                                            Confirmar
                                        </button>
                                    </div>
                                </div>

                            </div>


                        </div>
                        {/* preview */}
                    </div>
                    {/* simulacao row */}
                </form>
            </main>

            <footer className='w-100' style={{ position: "relative", bottom: "0px" }}>
                <p className='w-100 text-center'>© MINISITIO</p>
            </footer>
        </div>
    );
}

export default ComprarAnuncio;
