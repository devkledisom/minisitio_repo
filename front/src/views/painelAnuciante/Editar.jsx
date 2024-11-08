import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { masterPath } from "../../config/config";
import he from 'he';

import InputMask from 'react-input-mask';


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

import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../../assets/css/caderno.css";
import "../../assets/css/comprar-anuncio.css";
import ChooseFile from "../../admin/components/ChooseFile";
import TemplateModal from "../../components/Modal/TemplateModal";

//COMPONENTS
import Tooltip from "../../components/Tooltip";
import MapContainer from "../../components/MapContainer";
import UserNav from './UserNav';

function Editar(props) {
  //States
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
  const [cpfCnpjValue, setcpfCnpjValue] = useState(null);
  const [descontoAtivado, setDescontoAtivado] = useState(false);
  const [minisitio, setMinisitio] = useState({});


  const executarSelecao = () => {
    let codigoUf = document.querySelectorAll("#codUf4")[0].value;
    setUf(codigoUf);
  };

  useEffect(() => {
    console.log("child", props.espacoId)
  });

  useEffect(() => {
    fetch(`${masterPath.url}/admin/anuncio/edit/${props.espacoId}`)
    .then((x) => x.json())
    .then((res) => {
        setMinisitio(res[0]);
        setUf(res[0].codUf);
        setPersonType(res[0].descTipoPessoa);
        setRadioCheck(res[0].codTipoAnuncio);
    }).catch((err) => {
        console.log(err)
    })

    fetch(`${masterPath.url}/cadernos`)
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
      });
    fetch(`${masterPath.url}/pa`)
      .then((x) => x.json())
      .then((res) => {
        setCodUser(res.message + 1);
        //console.log(res.message + 1)
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

    if (codId.length == 11) {
      fetch(`${masterPath.url}/admin/desconto/buscar/${codId}`)
        .then((x) => x.json())
        .then((res) => {
          let valorDesconto = res.IdsValue[0].desconto;
          let precoComDesconto = precoFixo - valorDesconto;
          setPrecoFixo(precoComDesconto);
          setDescontoAtivado(res.success);
          console.log("desconto ", res)
        })
    }



    //console.log(codId);
  };

  //const [tipoPessoa, setTipoPessoa] = useState(null);

  const handleCpfCnpjChange = (event) => {
    // Obter apenas os números da entrada de dados
    let data = event.target.value.replace(/\D/g, "");

    // Verificar o comprimento dos dados para definir se é CPF ou CNPJ
    if (personType == 'pj') {
      // É CNPJ
      if (data.length > 12) {
        data = `${data.substr(0, 2)}.${data.substr(2, 3)}.${data.substr(5, 3)}/${data.substr(8, 4)}-${data.substr(12, 2)}`;
      } else if (data.length > 8) {
        data = `${data.substr(0, 2)}.${data.substr(2, 3)}.${data.substr(5, 3)}/${data.substr(8, 4)}`;
      } else if (data.length > 5) {
        data = `${data.substr(0, 2)}.${data.substr(2, 3)}.${data.substr(5, 3)}`;
      } else if (data.length > 2) {
        data = `${data.substr(0, 2)}.${data.substr(2, 3)}`;
      }

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

  const [validation, setValidation] = useState();

  function cadastrarAnuncio() {
    var validation = true;
    document.querySelectorAll('[required]').forEach((item) => {
      if (item.value == "") {
        item.style.border = "1px solid red";
        validation = false;
        setValidation(false);
        return;
      } else {
        item.style.border = "1px solid gray";
        validation = true;
        setValidation(true);
      };
    });
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMinisitio({
        ...minisitio,
        [name]: value,
        
    });
    setUf(minisitio.codUf);
};

const handleSelectChange = (e) => {
  changePreview(e);
  handleChange(e);
  executarSelecao();
};

function editID(e) {

  minisitio.descImagem = localStorage.getItem("imgname");
  console.log(minisitio)

  var validation = false;
  //setShowSpinner(true);

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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(minisitio)
  };

  if (validation) {
      fetch(`${masterPath.url}/admin/anuncio/update?id=${props.espacoId}`, config)
          .then((x) => x.json())
          .then((res) => {
              console.log(res)
              if (res.success) {
                  //setShowSpinner(false);
                  alert("anuncio Atualizado!");
                  props.selectPage(e, 4);
              } else {
                  alert(res.message);
              }
          })
  }

};

  return (
    <div className="App">
      <main>
        <TemplateModal
          descontoAtivado={descontoAtivado}
          radioCheck={radioCheck}
        />
      {/*   <h1 id="title-caderno" className="py-2">
          Cadastro da Assinatura/Anúncio
        </h1> */}
        {/* <UserNav /> */}
        <h2 className="py-4">
          Preencha os campos abaixo para simular e incluir sua
          Assinatura/Anúncio.
        </h2>
        <div className="container d-flex flex-row">
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
                      className="mx-1"
                    />
                    Básico
                  </label>
                  {/*        <label className="px-3">
                    <input
                      type="radio"
                      name="codTipoAnuncio"
                      id="codTipoAnuncio-2"
                      value="2"
                      onClick={(e) => {setRadioCheck(e.target.value); setShowMap("block")}}
                      checked={radioCheck == 2}
                    />
                    Simples
                  </label> */}
                  <label className="mx-3">
                    <input
                      type="radio"
                      name="codTipoAnuncio"
                      id="codTipoAnuncio-3"
                      value="3"
                      onClick={(e) => setRadioCheck(e.target.value)}
                      checked={radioCheck == 3}
                      className="mx-1"
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
                  name="discountHash"
                  id="discountHash"
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
                Código PA: <strong>569882</strong>
              </h4>

              <div className="form-group">
                <div className="input-icon margin-top-10">
                  <i className="fa fa-briefcase icone-form p-0"></i>
                  <select
                    name="codAtividade"
                    id="codAtividade"
                    className="form-control"
                    value={minisitio.codAtividade}
                    onChange={handleSelectChange}
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

                <div className="row">
                  <div class="col-md-4 col-xs-12">
                    <div class="form-group input-icon margin-top-10">
                      <i class="fa fa-compass icone-form p-0"></i>
                      <select
                        name="codUf"
                        id="codUf4"
                        class="form-control"
                        /* onChange={executarSelecao} */
                        value={minisitio.codUf}
                        onChange={handleSelectChange}
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
                      </select>{" "}
                    </div>
                  </div>

                  <div class="col-md-8 col-xs-12">
                    <div class="form-group selectCaderno form-group input-icon margin-top-10">
                      <i class="fa fa-map-marker icone-form p-0"></i>
                      <select
                        name="codCaderno"
                        id="codUf5"
                        class="form-control"
                        value={minisitio.codCaderno}
                        onChange={handleSelectChange}
                      >
                        <option value="">- CIDADE -</option>
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
                      </select>{" "}
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
                    value={minisitio.descAnuncio}
                    onChange={handleSelectChange}
                  />
                </div>

                {radioCheck != 1 && <ChooseFile codigoUser={codUser} />}

                <div className="input-icon margin-top-10">
                  <i className="fa fa-map-marker"></i>
                  <input
                    type="text"
                    name="descEndereco"
                    id="descEndereco"
                    className="form-control"
                    placeholder="Digite o endereço"
                    value={minisitio.descEndereco}
                    onChange={handleSelectChange}
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
                    onChange={(e) => {setCep(e.target.value);handleSelectChange(e)}}
                    value={minisitio.descCEP}
                  />
                </div>}

                {radioCheck != 1 && <MapContainer cep={cep} />} 
                {/* <MapContainer cep={cep} showMap={"block"} /> */}


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
                    required
                    mask={'(99) 9999-9999'}
                    value={minisitio.descTelefone}
                    onChange={handleSelectChange}
                    ></InputMask>
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
                    value={minisitio.descCelular}
                    onChange={handleSelectChange}
                    required
                    mask={'(99) 99999-9999'}></InputMask>
                </div>}
              </div>
            </div>
            {/*dados para publicação*/}

            {/* Detalhes do anuncio */}

            {radioCheck != 1 && <div className="assinatura webcard" style={{ display: "block" }}>
              <h2>Promoção</h2>
            </div>}
            {radioCheck != 1 && <div
              className="codigo-promocional webcard"
              style={{ display: "block" }}
            >
              {radioCheck != 1 && <ChooseFile codigoUser={codUser} />}
              <div className="input-icon margin-top-10">
                <i className="fa fa-calendar"></i>
                <input
                  type="date"
                  name="descVideo"
                  id="descVideo"
                  className="form-control"
                  placeholder="Digite o vídeo"
                  value={minisitio.descVideo}
                  onChange={handleSelectChange}
                />
              </div>
            </div>}
            {radioCheck != 1 && <div className="assinatura webcard" style={{ display: "block" }}>
              <h2>Cartão Digital</h2>
            </div>}
            {radioCheck != 1 && <div
              className="codigo-promocional webcard"
              style={{ display: "block" }}
            >
              {radioCheck != 1 && <ChooseFile codigoUser={codUser} />}
              
            </div>}
            {radioCheck != 1 && <div className="assinatura webcard" style={{ display: "block" }}>
              <h2>Parceria</h2>
            </div>}
            {radioCheck != 1 && <div
              className="codigo-promocional webcard"
              style={{ display: "block" }}
            >
              {radioCheck != 1 && <ChooseFile codigoUser={codUser} />}
              <div className="input-icon margin-top-10">
                <i className="fa fa-globe"></i>
                <input
                  type="text"
                  name="descVideo"
                  id="descVideo"
                  className="form-control"
                  placeholder="Digite o link da parceria"
                  value={minisitio.descVideo}
                  onChange={handleSelectChange}
                />
              </div>
            </div>}
            {radioCheck != 1 && <div className="assinatura webcard" style={{ display: "block" }}>
              <h2>Certificação Profissional</h2>
            </div>}
            {radioCheck != 1 && <div
              className="codigo-promocional webcard"
              style={{ display: "block" }}
            >
              {radioCheck != 1 && <ChooseFile codigoUser={codUser} />}
              <div className="input-icon margin-top-10">
                <i className="fa fa-globe"></i>
                <input
                  type="text"
                  name="descVideo"
                  id="descVideo"
                  className="form-control"
                  placeholder="Digite o link"
                  value={minisitio.descVideo}
                  onChange={handleSelectChange}
                />
                <i className="fa fa-tag"></i>
                <input
                  type="text"
                  name="descVideo"
                  id="descVideo"
                  className="form-control"
                  placeholder="Digite o texto"
                  value={minisitio.descVideo}
                  onChange={handleSelectChange}
                />
              </div>
              {radioCheck != 1 && <ChooseFile codigoUser={codUser} />}
            </div>}
            {radioCheck != 1 && <div className="assinatura webcard" style={{ display: "block" }}>
              <h2>CashBack</h2>
            </div>}
            {radioCheck != 1 && <div
              className="codigo-promocional webcard"
              style={{ display: "block" }}
            >
              {radioCheck != 1 && <ChooseFile codigoUser={codUser} />}
              <div className="input-icon margin-top-10">
                <i className="fa fa-globe"></i>
                <input
                  type="text"
                  name="descVideo"
                  id="descVideo"
                  className="form-control"
                  placeholder="Digite o link da parceria"
                  value={minisitio.descVideo}
                  onChange={handleSelectChange}
                />
              </div>
            </div>}



            {radioCheck != 1 && <div className="assinatura webcard" style={{ display: "block" }}>
              <h2>Detalhes do Anúncio</h2>
            </div>}
            {radioCheck != 1 && <div
              className="codigo-promocional webcard"
              style={{ display: "block" }}
            >
              <div className="input-icon margin-top-10">
                <i className="fa fa-globe"></i>
                <textarea
                  type="text"
                  name="descVideo"
                  id="descVideo"
                  className="form-control"
                  placeholder="Texto livre"
                  value={minisitio.descVideo}
                  onChange={handleSelectChange}
                ></textarea>
              </div>
              <div className="input-icon margin-top-10">
                <i className="fa fa-globe"></i>
                <input
                  type="text"
                  name="descVideo"
                  id="descVideo"
                  className="form-control"
                  placeholder="Digite o site"
                  value={minisitio.descVideo}
                  onChange={handleSelectChange}
                />
              </div>
              <div className="input-icon margin-top-10">
                <i className="fa fa-youtube"></i>
                <input
                  type="text"
                  name="descVideo"
                  id="descVideo"
                  className="form-control"
                  placeholder="Digite o vídeo"
                  value={minisitio.descVideo}
                  onChange={handleSelectChange}
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
                  value={minisitio.descEmailComercial}
                  onChange={handleSelectChange}
                />{" "}
              </div>
              <div className="input-icon margin-top-10">
                <i className="fa fa-envelope-o"></i>
                <input
                  type="text"
                  name="descEmailRetorno"
                  id="descEmailRetorno"
                  className="form-control"
                  placeholder="Digite o e-mail (alternativo)"
                  value={minisitio.descEmailRetorno}
                  onChange={handleSelectChange}
                />{" "}
              </div>
              <div className="input-icon margin-top-10">
                <i className="fa fa-mobile"></i>
                <input
                  type="text"
                  name="descWhatsApp"
                  id="descWhatsApp"
                  className="form-control"
                  placeholder="Digite o whatsapp"
                  value={minisitio.descWhatsapp}
                  onChange={handleSelectChange}
                />{" "}
              </div>
              <div className="input-icon margin-top-10">
                <i className="fa fa-send"></i>
                <input
                  type="text"
                  name="descTelegram"
                  id="descTelegram"
                  className="form-control"
                  placeholder="Digite o telegram"
                  value={minisitio.descTelegram}
                  onChange={handleSelectChange}
                />{" "}
              </div>
              <div className="input-icon margin-top-10">
                <i className="fa fa-globe"></i>
                <input
                  type="text"
                  name="descSkype"
                  id="descSkype"
                  className="form-control"
                  placeholder="Digite o google meu negócio"
                  value={minisitio.descSkype}
                  onChange={handleSelectChange}
                />{" "}
              </div>
              <div className="input-icon margin-top-10">
                <i className="fa fa-facebook"></i>
                <input
                  type="text"
                  name="descFacebook"
                  id="descFacebook"
                  className="form-control"
                  placeholder="Digite o facebook"
                  value={minisitio.descFacebook}
                  onChange={handleSelectChange}
                />
              </div>
              <div className="input-icon margin-top-10">
                <i className="fa fa-instagram"></i>
                <input
                  type="text"
                  name="descInsta"
                  id="descInsta"
                  className="form-control"
                  placeholder="Digite o instagram"
                  value={minisitio.descInsta}
                  onChange={handleSelectChange}
                />
              </div>
              <div className="input-icon margin-top-10">
                <i className="fa fa-twitter"></i>
                <input
                  type="text"
                  name="descTweeter"
                  id="descTweeter"
                  className="form-control"
                  placeholder="Digite o twitter"
                  value={minisitio.descTweeter}
                  onChange={handleSelectChange}
                />
              </div>
              <div className="input-icon margin-top-10">
                <i className="fa fa-linkedin"></i>
                <input
                  type="text"
                  name="descLinkedin"
                  id="descLinkedin"
                  className="form-control"
                  placeholder="Digite o linkedin"
                  value={minisitio.descLinkedin}
                  onChange={handleSelectChange}
                />
              </div>
              <div className="input-icon margin-top-10">
                <i className="fa fa-shopping-cart"></i>
                <input
                  type="text"
                  name="link_comprar"
                  id="link_comprar"
                  className="form-control"
                  placeholder="Digite o link de venda"
                  value={minisitio.link_comprar}
                  onChange={handleSelectChange}
                />
              </div>
              <div className="input-icon margin-top-10">
                <i className="fa fa-android"></i>
                <input
                  type="text"
                  name="descAndroid"
                  id="descAndroid"
                  className="form-control"
                  placeholder="Digite o link do aplicativo android"
                  value={minisitio.descAndroid}
                  onChange={handleSelectChange}
                />
              </div>
              <div className="input-icon margin-top-10">
                <i className="fa fa-apple"></i>
                <input
                  type="text"
                  name="descApple"
                  id="descApple"
                  className="form-control"
                  placeholder="Digite o link do aplicativo IOS"
                  value={minisitio.descApple}
                  onChange={handleSelectChange}
                />
              </div>
              <div className="input-icon margin-top-10">
                <i className="fa fa-money"></i>
                <input
                  type="text"
                  name="descChavePix"
                  id="descChavePix"
                  className="form-control"
                  placeholder="Digite sua chave PIX"
                  value={minisitio.descChavePix}
                  onChange={handleSelectChange}
                />
              </div>
              {radioCheck != 1 && <ChooseFile codigoUser={codUser} />}
            </div>}
            {/* Detalhes do anuncio */}

            {/* Autorizante */}

{/*             <div className="assinatura">
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
                        className="mx-1"
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
                        className="mx-1"
                      />
                      Pessoa jurídica
                    </label>{" "}
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
                  placeholder="Digite o seu CPF ou CNPJ"
                  value={minisitio.descCPFCNPJ}
                  onChange={handleSelectChange}
                />{" "}
              </div>
              <div className="input-icon margin-top-10  py-2">
                <i className="fa fa-user"></i>
                <input
                  type="text"
                  name="descNomeAutorizante"
                  id="descNomeAutorizante"
                  className="form-control"
                  placeholder="Digite o seu nome"
                  value={minisitio.descNomeAutorizante}
                  onChange={handleSelectChange}
                />{" "}
              </div>
              <div className="input-icon margin-top-10">
                <i className="fa fa-envelope"></i>
                <input
                  type="text"
                  name="descEmailAutorizante"
                  id="descEmailAutorizante"
                  className="form-control"
                  placeholder="Digite o seu e-mail"
                  value={minisitio.descEmailAutorizante}
                  onChange={handleSelectChange}
                />{" "}
              </div>
            </div> */}
            {/* Autorizante */}

            {/* Forma de Pagamento */}

           {/*  {radioCheck != 1 && <div
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
      
                      <i
                        className="wid pagseguro"
                        data-toggle="tooltip"
                        title="PAGSEGURO"
                      ></i>
                    </label>{" "}
                  </div>
                  <div className="col-md-12 observacao">
                    <h5>
                      Você será redirecionado para o ambiente do PagSeguro
                    </h5>
                    <img src="../assets/cartoes.gif" alt="Cartões" />
                  </div>
                </div>
              </div>
            </div>}
            */}
            {/* Forma de Pagamento */}

            {/* Area de Download do formulario */}
            {/* 
            <div className="codigo-promocional margin-top-20 hidden-sm hidden-xs">
              <div className="row forma-de-pagamento">
                <div className="col-md-1">
                  <i className="fa fa-download"></i>
                </div>
                <div className="col-md-11">
                  <a href="/resources/pdfs/formulario_pa.pdf" target="_blank">
                    <h3>Faça o download do formulário</h3>
                  </a>
                </div>
              </div>
            </div> */}

            {/* Area de Download do formulario */}
          </div>
          {/*fina da row*/}

          {/* simulacao preview row */}
          <div className="row col-md-7 p-3 interna">
            <div
              className="simulacao"
            /* style={{ position: "sticky" }} */
            /* style={(elementoProximoTopo) ? {position: "fixed", top: "0px", marginTop: "20px"} : { position: "relative" }} */
            >
              <div className="posicao-preview">
                <div className="simulacao-do-anuncio">
                  <h2 className="assinatura">Simulação do Anúncio</h2>
                </div>

                {/* preview */}

                <div className="codigo-promocional">
                  <div className="cartao p-4">
                    <div className="conteudo semImagem">
                      <h2 className="nome-empresa text-start">{(descAnuncio) ? descAnuncio : "Nome da empresa"}</h2>
                      {radioCheck != 1 && <h4
                        className="slogan webcard text-start"
                        style={{ display: "block" }}
                      >
                        Frase/slogan da empresa
                      </h4>}
                      <p className="text-start">
                        <i className="fa fa-map-marker"></i>{" "}
                        <span className="sim-end">{(descEndereco) ? descEndereco : "Endereço da empresa"}</span>
                      </p>
                      <p className="text-start">
                        <i className="fa fa-phone"></i>{" "}
                        <span className="sim-tel">{(descTelefone) ? descTelefone : "(xx) xxxx-xxxx"}</span>
                      </p>
                      {radioCheck != 1 && <p
                        className="webcard text-start"
                        style={{ display: "block" }}
                      >
                        <i className="fa fa-phone"></i>{" "}
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
                 {/*  <div className="assinatura margin-top-20">

                    {radioCheck != 1 && <h2 className="webcard">
                      <span className="preco">R$ {precoFixo},00</span>/mês
                    </h2>}
                    {radioCheck == 1 && <h2 className="simples uppercase">
                      Grátis
                    </h2>}
                  </div> */}
                  <div className="margin-top-20">
                   {/*  {radioCheck != 1 && <p className="webcard" style={{ display: "block" }}>
                      *A duração da assinatura é de 12 meses, portanto válido até
                      14/04/2025.
                    </p>} */}
                    {!validation &&
                      <button
                        type="button"
                        className="btn-block formulario-de-cadastro btn btn-primary"
                        id="anunciar"
                        /* data-bs-toggle="modal" data-bs-target="#myModal"*/
                        onClick={editID} 
                      >
                        Confirmar
                      </button>
                    }
                  </div>
                </div>
              </div>
            </div>
            {/* preview */}
          </div>
          {/* simulacao row */}
        </div>
      </main>
    </div>
  );
}

export default Editar;
