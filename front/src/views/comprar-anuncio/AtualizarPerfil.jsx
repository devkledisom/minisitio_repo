import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { masterPath } from "../../config/config";
import Badge from 'react-bootstrap/Badge';
import Stack from 'react-bootstrap/Stack';

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
import "../../assets/css/atualizar-perfil.css";

import Mosaico from "../../components/Mosaico";
import Busca from "../../components/Busca";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import Tooltip from "../../components/Tooltip";
import AlertMsg from "../../components/Alerts/AlertMsg";
import Header from "../../admin/view/Header";

//FUNCTION EXTERNA
import { checkoutUpdate } from "./_components/checkoutUpdate";

//LIBS
import Swal from 'sweetalert2';

function ComprarAnuncio({ isAdmin }) {
  //States
  const [ufSelected, setUf] = useState(0);
  const [uf, setUfs] = useState([]);
  const [caderno, setCaderno] = useState([]);
  const [codUser, setCodUser] = useState([]);
  const [atividades, setAtividades] = useState();
  const [radioCheck, setRadioCheck] = useState(3);
  const [personType, setPersonType] = useState("pf");
  const [cep, setCep] = useState();
  const [showMap, setShowMap] = useState("none");
  const [precoFixo, setPrecoFixo] = useState(10);
  const [descValor, setDescValor] = useState(0);
  const [cpfCnpjValue, setcpfCnpjValue] = useState(null);
  const [descontoAtivado, setDescontoAtivado] = useState(false);
  const [tagValue, setTagValue] = useState([]);
  const [showSpinner, setShowSpinner] = useState(false);
  const [alert, setAlert] = useState(false);
  const [texto, setTexto] = useState(null);
  const [isCapa, setIsCapa] = useState(false);
  const [minisitio, setMinisitio] = useState([]);

  //REFS
  const customText = useRef(null);
  const discountHash = useRef(null);

  const { codAnuncio } = useParams();


  const executarSelecao = (e) => {
    let codigoUf = e.target.value;
    setUf(codigoUf);

    fetch(`${masterPath.url}/cadernos?uf=${codigoUf}`)
      .then((x) => x.json())
      .then((res) => {
        setCaderno(res);
      });

  };

  useEffect(() => {

    fetch(`${masterPath.url}/admin/anuncio/edit/${codAnuncio}`)
      .then((x) => x.json())
      .then((res) => {
        setMinisitio(res[0]);


        /*    fetch(`${masterPath.url}/cadernos?uf=${res[0].codUf}`)
             .then((x) => x.json())
             .then((res) => {
               setCaderno(res);
             })
           setUf(res[0].codUf) */
        document.querySelector("#descAnuncio").focus();

      }).catch((err) => {
        console.log(err)
      })


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

    fetch(`${masterPath.url}/admin/preco-base/read`)
      .then((x) => x.json())
      .then((res) => {
        setPrecoFixo(res.value / 12);
      });


  }, []);


  const [descAnuncio, setDescAnuncio] = useState(false);
  const [descEndereco, setDescEndereco] = useState(false);
  const [descTelefone, setDescTelefone] = useState(false);
  const [descCelular, setDescCelular] = useState(false);
  const [codDescontoInserido, setcodDescontoInserido] = useState(false);

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
    setcodDescontoInserido(codId);
    if (codId.length >= 11 && codId.length <= 12) {
      fetch(`${masterPath.url}/admin/desconto/aplicar/${codId}`)
        .then((x) => x.json())
        .then((res) => {
          if (res.success) {
            if (res.IdsValue[0].is_capa && radioCheck == 4) {
              let valorDesconto = res.IdsValue[0].desconto;
              let precoComDesconto = precoFixo - valorDesconto;
              if (precoComDesconto >= 0) {
                setPrecoFixo(precoComDesconto);
                setDescValor(valorDesconto);
                setDescontoAtivado(res.success);
                setTexto(res.IdsValue[0].descricao);
                setIsCapa(true);
              } else {
                setTexto("Não foi possível aplicar esse desconto");
              customText.current.style.color = "red";
              }




              document.getElementById('anunciar').disabled = false;

            } else if (!res.IdsValue[0].is_capa && radioCheck == 4) {
              document.getElementById('anunciar').disabled = true;
              setTexto("Este ID não está habilitado para capa!");
              customText.current.style.color = "red";
            } else {

              let valorDesconto = res.IdsValue[0].desconto;
              let precoComDesconto = precoFixo - valorDesconto;
              console.log(precoComDesconto)
              if (precoComDesconto >= 0) {
                setPrecoFixo(precoComDesconto);
                setDescValor(valorDesconto);
                setDescontoAtivado(res.success);
                setTexto(res.IdsValue[0].descricao);
                document.getElementById('anunciar').disabled = false;
              } else {
                setTexto("Não foi possível aplicar esse desconto");
              customText.current.style.color = "red";
              }


            }


          } else {
            setDescontoAtivado(res.success);
            document.getElementById('anunciar').disabled = true;
          }

        })
    } else {
      //setPrecoFixo(10);
      setDescontoAtivado(false);
      setTexto(null);
      document.getElementById('anunciar').disabled = false;
      customText.current.style.color = "#000";
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

  // Obter a data de hoje
  const hoje = new Date();

  // Adicionar um ano
  const proximoAno = new Date(hoje);
  proximoAno.setFullYear(proximoAno.getFullYear() + 1);

  // Função para formatar a data
  function formatarData(data) {
    const dia = String(data.getDate()).padStart(2, '0'); // Adiciona zero à esquerda se necessário
    const mes = String(data.getMonth() + 1).padStart(2, '0'); // Meses começam em 0
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }


  return (
    <div className="atualizar-perfil">
      {isAdmin &&
        <header style={{ position: "fixed", zIndex: "999" }} className='w-100'>
          <Header />
        </header>
      }

      {!isAdmin &&
        <header>
          <Mosaico logoTop={true} borda="none" />
        </header>
      }

      <main>
        {/*      <TemplateModal
          descontoAtivado={descontoAtivado}
          radioCheck={radioCheck}
          tagValue={tagValue}
        /> */}

        {showSpinner && <button class="buttonload">
          <i class="fa fa-spinner fa-spin"></i>CADASTRANDO PERFIL
        </button>}

        {alert && <AlertMsg message={"Cadastro Realizado, verifique a sua caixa de email para obter o acesso a plataforma"} />}

        {!isAdmin && <Busca paginaAtual={"caderno"} />}
        {/*  */}
        <h1 id="title-caderno" className="py-2 text-center">
          Renovação de Assinatura/Espaço Minisitio
        </h1>
        {/*  <h2 className="py-4">
          Preencha os campos abaixo para simular e incluir sua
          Assinatura/Espaço Minisitio.
        </h2> */}
        <div className="container d-flex justify-content-center form-create">
          {/*inicio da row form */}
          <div className="row col-md-5 p-3 interna" id="form-cadastro-data">
            <div className="formulario-de-cadastro-titulo">
              <h2>Formulário de Renovação</h2>
            </div>
            <div className="anuncio p-0">
              <div className="form-group">
                <label className="col-md-12 w-100 control-label tipo-de-anuncio">
                  Tipo de perfil no minisitio:
                </label>
                <div className="col-md-12 anuncio-options">
                  <Stack direction="horizontal" gap={2} className="justify-content-center">
                    <Badge bg="success" style={{ fontSize: "18px" }}>{minisitio.codTipoAnuncio == 3 ? "Completo" : "Básico"}</Badge>
                  </Stack>
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
                <InputMask
                  type="text"
                  name="discountHash"
                  id="discountHash"
                  className="form-control"
                  placeholder="Digite seu código"
                  style={{ backgroundColor: "#96d18b" }}
                  onChange={aplicarCupom}
                  ref={discountHash}
                  mask="99.999.9999"
                ></InputMask>
                <input
                  type="hidden"
                  name="discountValue"
                  value=""
                  id="discountValue"
                />
              </div>

              <h5 className="text-start py-2" ref={customText}>
                {texto ? texto : ""}
              </h5>



            </div>}

            {/*dados para publicação*/}
            <div className="assinatura">
              <h2>Confira os dados</h2>
            </div>

            <div className="codigo-promocional">
              <h4 style={{ margin: "10px 0 25px 2px" }}>
                {/*  Código PA: <strong>569882</strong> */}
              </h4>

              <div className="form-group">
                <div className="input-icon margin-top-10">
                  <i className="fa fa-briefcase icone-form p-0"></i>
                  {radioCheck != 4 &&
                    <select
                      name="codAtividade"
                      id="codAtividade"
                      className="form-control"
                      required
                    >
                      <option value={minisitio.codAtividade} selected>{minisitio.codAtividade}</option>
                      {/*  {atividades &&

                        atividades.map(
                          (item, i) =>
                            i > 7 ? <option
                              key={item.id}
                              value={item.atividade}
                            >
                              {item.atividade}
                            </option> : ""


                        )} */}
                    </select>
                  }
                </div>

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
                        <option value={minisitio.codUf} selected>
                          {minisitio.codUf}
                        </option>
                        {/* {uf.map((item) => (
                          <option
                            id={item.id_uf}
                            key={item.id_uf}
                            value={item.sigla_uf}
                          >
                            {item.sigla_uf}
                          </option>
                        ))} */}
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
                        required
                      >
                        <option value={minisitio.codCaderno} selected>{minisitio.codCaderno}</option>
                        {/*  {caderno.map(
                          (item) =>
                            item.UF == ufSelected && (
                              <option
                                id={item.codCaderno}
                                key={item.codCaderno}
                                value={item.nomeCaderno}
                              >
                                {item.nomeCaderno}
                              </option>
                            )
                        )} */}
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
                    className="form-control input-disabled"
                    placeholder="Digite o nome"
                    maxlength="40"
                    onChange={changePreview}
                    value={minisitio.descAnuncio}
                    disabled
                    required
                  />
                </div>

                {/* {radioCheck != 1 && <ChooseFile codigoUser={codUser} />} */}

                <div className="input-icon margin-top-10">
                  <i className="fa fa-map-marker"></i>
                  <input
                    type="text"
                    name="descEndereco"
                    id="descEndereco"
                    className="form-control input-disabled"
                    placeholder="Digite o endereço"
                    onChange={changePreview}
                    value={minisitio.descEndereco}
                    disabled
                    required
                  />
                </div>
                {/*  {radioCheck != 1 && <div
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
                  />
                </div>} */}

                {/*  <MapContainer cep={cep} showMap={showMap} /> */}


                <div className="row webcard" style={{ display: "block" }}>
                  <div className="col-md-12"></div>
                </div>
                <div className="input-icon margin-top-10">
                  <i className="fa fa-phone"></i>
                  <InputMask
                    type="text"
                    name="descTelefone"
                    id="descTelefone"
                    className="form-control input-disabled"
                    placeholder="(99) 99999-9999"
                    onChange={changePreview}
                    value={minisitio.descTelefone}
                    disabled
                    required
                    mask={'(99) 99999-9999'}></InputMask>
                </div>
                {/*  {radioCheck != 1 && <div
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
                    mask={'(99) 99999-9999'}></InputMask>
                </div>} */}
              </div>
            </div>
            {/*dados para publicação*/}

            {/* Detalhes do anuncio */}

            {radioCheck != 1 && <div className="assinatura webcard" style={{ display: "block" }}>
              <h2>Detalhes do Perfil Minisitio</h2>
            </div>}
            {radioCheck != 1 && <div
              className="codigo-promocional webcard"
              style={{ display: "block" }}
            >
              {/*         <div className="input-icon margin-top-10">
                <i className="fa fa-youtube"></i>
                <input
                  type="text"
                  name="descYouTube"
                  id="descYouTube"
                  className="form-control"
                  placeholder="Digite o vídeo"
                  onChange={handleCpfCnpjChange}
                />
              </div> */}
              <div className="input-icon margin-top-10">
                <i className="fa fa-envelope"></i>
                <input
                  type="text"
                  name="descEmailComercial"
                  id="descEmailComercial"
                  className="form-control input-disabled"
                  placeholder="Digite o e-mail (comercial)"
                  value={minisitio.descEmailComercial}
                  disabled
                />{" "}
              </div>
              <div className="input-icon margin-top-10">
                <i className="fa fa-envelope-o"></i>
                <input
                  type="text"
                  name="descEmailRetorno"
                  id="descEmailRetorno"
                  className="form-control input-disabled"
                  placeholder="Digite o e-mail (alternativo)"
                  value={minisitio.descEmailRetorno}
                  disabled
                />{" "}
              </div>
              <div className="input-icon margin-top-10">
                <i className="fa fa-mobile"></i>
                <input
                  type="text"
                  name="descWhatsApp"
                  id="descWhatsApp"
                  className="form-control input-disabled"
                  placeholder="Digite o whatsapp"
                  value={minisitio.descWhatsApp}
                  disabled
                />{" "}
              </div>
            </div>}
            {/* Detalhes do anuncio */}

            {/* Autorizante */}

            <div className="assinatura">
              <h2>Autorizante</h2>
            </div>
            <div className="codigo-promocional">
              <div className="row">
                {/*<div className="form-group row">
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
                </div>*/}
              </div>
              <div className="input-icon margin-top-10">
                <i className="fa fa-credit-card"></i>
                <input
                  type="text"
                  name="descCPFCNPJ"
                  id="descCPFCNPJ"
                  className="form-control input-disabled"
                  placeholder="Digite um CPF ou CNPJ"
                  onChange={handleCpfCnpjChange}
                  value={minisitio.descCPFCNPJ}
                  disabled
                  required
                />{" "}
              </div>
              <div className="input-icon margin-top-10  py-2">
                <i className="fa fa-user"></i>
                <input
                  type="text"
                  name="descNomeAutorizante"
                  id="descNomeAutorizante"
                  className="form-control input-disabled"
                  placeholder="Digite o seu nome"
                  value={minisitio.descNomeAutorizante}
                  disabled
                  required
                />{" "}
              </div>
              <div className="input-icon margin-top-10">
                <i className="fa fa-envelope"></i>
                <input
                  type="text"
                  name="descEmailAutorizante"
                  id="descEmailAutorizante"
                  className="form-control input-disabled"
                  placeholder="Digite o seu e-mail"
                  value={minisitio.descEmailAutorizante}
                  disabled
                  required
                />{" "}
              </div>
              {/*  {radioCheck != 1 && <div class="input-icon margin-top-10">
                <h4 className="text-start pt-2">Responsável pela Indicação (opcional)</h4>
                <div class="input-icon margin-top-10" id="codigoPromocional">
                  <i class="fa fa-credit-card"></i>

                  <input type="text" name="discountHash" id="discountHash" value="" class="form-control" placeholder="Digite seu código" />
                  <input type="hidden" name="discountValue" value="" id="discountValue" />
                </div>
              </div>} */}
            </div>
            {/* Autorizante */}

            {/* Forma de Pagamento */}

            {(radioCheck != 1 && descontoAtivado == false) && <div
              className="assinatura webcard formaPagamento"
              style={{ display: "block" }}
            >
              <h2>Forma de Pagamento</h2>
            </div>}
            {(radioCheck != 1 && descontoAtivado == false) && <div
              className="codigo-promocional webcard formaPagamento"
              style={{ display: "block" }}
            >
              <div className="row">
                <div className="form-group">
                  <div className="hidden">
                    <label>
                      {/*  <input
                        type="radio"
                        name="formaPagamento"
                        id="formaPagamento-pagseguro"
                        value="pagseguro"
                        checked="checked"
                      /> */}
                      <i
                        className="wid pagseguro"
                        data-toggle="tooltip"
                        title="PAGSEGURO"
                      ></i>
                    </label>{" "}
                  </div>
                  <div className="col-md-12 observacao">
                    <h5>
                      Você será redirecionado para o ambiente do Mercado pago
                    </h5>
                    <img src="/assets/cartoes.gif" alt="Cartões" />
                  </div>
                </div>
              </div>
            </div>}
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
          <div className="row col-md-6 p-3 interna">
            <div
              className="simulacao"
            /* style={{ position: "sticky" }} */
            /* style={(elementoProximoTopo) ? {position: "fixed", top: "0px", marginTop: "20px"} : { position: "relative" }} */
            >
              <div className="posicao-preview">
                <div className="simulacao-do-anuncio">
                  <h2 className="assinatura">Simulação do Espaço Minisitio</h2>
                </div>

                {/* preview */}

                <div className="codigo-promocional card-preview">
                  <div className="cartao p-4">
                    <div className="conteudo semImagem">
                      <h2 className="nome-empresa text-start">{(minisitio.descAnuncio) ? minisitio.descAnuncio : "Nome da empresa"}</h2>
                      {radioCheck != 1 && <h4
                        className="slogan webcard text-start"
                        style={{ display: "block" }}
                      >
                        Frase/slogan da empresa
                      </h4>}
                      <p className="text-start">
                        <i className="fa fa-map-marker"></i>{" "}
                        <span className="sim-end">{(minisitio.descEndereco) ? minisitio.descEndereco : "Endereço da empresa"}</span>
                      </p>
                      <p className="text-start">
                        <i className="fa fa-phone"></i>{" "}
                        <span className="sim-tel">{(minisitio.descTelefone) ? minisitio.descTelefone : "(xx) xxxxx-xxxx"}</span>
                      </p>
                      {radioCheck != 1 && <p
                        className="webcard text-start"
                        style={{ display: "block" }}
                      >
                        <i className="fa fa-phone"></i>{" "}
                        <span className="cel">{(minisitio.descCelular) ? minisitio.descCelular : "(xx) xxxxx-xxxx"}</span>
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
                            height={30}
                          />
                        </i>
                      </Tooltip>

                      <Tooltip text={"Site"}>
                        <i>
                          <img
                            src="../assets/img/link_site.png"
                            alt=""
                            height={30}
                          />
                        </i>
                      </Tooltip>
                      <Tooltip text={"Promoção"}>
                        <i>
                          <img
                            src="../assets/img/link_promocao.png"
                            alt=""
                            height={30}
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
                      <span> {formatarData(proximoAno)}.</span>
                    </p>}

                    <button
                      type="button"
                      className="btn-block formulario-de-cadastro btn btn-primary"
                      id="anunciar"
                      onClick={() => checkoutUpdate(radioCheck, descontoAtivado, minisitio, codDescontoInserido, precoFixo)}
                    >
                      Renovar
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* preview */}
          </div>
          {/* simulacao row */}
        </div>
      </main>

      {isAdmin &&
        <footer className='w-100' style={{ position: "relative", bottom: "0px" }}>
          <p className='w-100 text-center'>© MINISITIO</p>
        </footer>
      }

      {!isAdmin &&
        <footer>
          <Nav styleclassName="Nav" />
          <Footer />
        </footer>
      }
    </div>
  );
}

export default ComprarAnuncio;
