import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { masterPath } from "../../config/config";

/* import '../../assets/css/main.css';//assets/css/main.css
import '../../admin/assets/css/login.css';//assets/css/login.css
 */


import './css/modal.css';

//LIBS
import InputMask from 'react-input-mask';

const ContentChildLogin = (props) => {
  const [showSpinner, setShowSpinner] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [cpfCnpjValue, setcpfCnpjValue] = useState({});

  const loginValue = useRef(null);
  const passValue = useRef(null);
  const navigate = useNavigate();
  const tipoPessoa = useRef(null);
  const nuDocumento = useRef(null);


  const ocultarForm = (e) => {

    if (tipoPessoa.current.value == "") {
      alert("Selecione o tipo de pessoa!");
    } else if (!isCPForCNPJ(nuDocumento.current.value)) {
      alert("Digite um cpf ou um cnpj válido!");
    } else {
      setSearchParams({ pessoa: tipoPessoa.current.value, doc: nuDocumento.current.value });
      props.onContinue(true, "pf", "cpf");
    }

  };

  function isCPForCNPJ(value) {
    const regex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$|^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$|^\d{14}$/;
    return regex.test(value);
  }

  function teclaLogin(e) {
    if (e.key === "Enter") {
      entrar();
    }
  };

  function entrar() {
    setShowSpinner(true);
    fetch(`${masterPath.url}/entrar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        "descCPFCNPJ": loginValue.current.value,
        "senha": passValue.current.value
      })
    })
      .then((x) => x.json())
      .then((res) => {
        setShowSpinner(false);
        if (res.success) {
          sessionStorage.setItem('authTokenMN', true);
          sessionStorage.setItem('userLogged', res.data);

          //navigate("/admin");
          console.log(res)
        } else {
          alert(res.message);
          console.log(res.data);
        }

        if(res.type == 3) {
          cadastrarAnuncio(res.data.codUsuario);
        }

      })
  };

  function cadastrarAnuncio(codUser) {
    const obj = {
      codAnuncio: 37,
      codUsuario: codUser,
      codTipoAnuncio: 2,
      codAtividade: buscarElemento("codAtividade"),
      codPA: null,
      codDuplicado: null,
      tags: "torteria,bolos,tortas,salgados,festas",
      codCaderno: buscarElemento("codUf5"),
      codUf: buscarElemento("codUf4"),
      codCidade: buscarElemento("codUf5"),
      descAnuncio: buscarElemento("descAnuncio"),
      descAnuncioFriendly: "oficina-de-tortas",
      descImagem: localStorage.getItem("imgname"),
      descEndereco: buscarElemento("descEndereco"),
      descTelefone: buscarElemento("descTelefone"),
      descCelular: buscarElemento("descCelular"),
      descDescricao: "",
      descSite: "www.oficinadetortas.com.br",
      descSkype: null,
      descPromocao: "",
      descEmailComercial: buscarElemento("descEmailComercial"),
      descEmailRetorno: buscarElemento("descEmailRetorno"),
      descFacebook: "",
      descTweeter: "",
      descWhatsApp: buscarElemento("descWhatsApp"),
      descCEP: buscarElemento("descCEP"),
      descTipoPessoa: buscarElemento("descTipoPessoa-pf").checked ? "pf" : "pj",
      descCPFCNPJ: buscarElemento("descCPFCNPJ"),
      descNomeAutorizante: buscarElemento("descNomeAutorizante"),
      descEmailAutorizante: buscarElemento("descEmailAutorizante"),
      codDesconto: buscarElemento("discountHash"),
      descLat: null,
      descLng: null,
      formaPagamento: null,
      promocaoData: null,
      descContrato: null,
      descAndroid: "",
      descApple: "",
      descInsta: null,
      descPatrocinador: null,
      descPatrocinadorLink: null,
      qntVisualizacoes: 813,
      activate: 1,
      dtCadastro: 1356636164,
      dtCadastro2: "2012-12-27T16:22:44.000Z",
      dtAlteracao: "2020-11-30T23:59:59.000Z",
      descLinkedin: null,
      descTelegram: null,
      certificado_logo: null,
      certificado_texto: null,
      certificado_imagem: null,
      link_comprar: null,
      cashback_logo: null,
      cashback_link: null,
      certificado_link: null,
      cartao_digital: null,
    };

    //console.log(obj)


    function buscarElemento(param) {
      let elementoSelecionado = document.querySelector(`#${param}`);

      if (elementoSelecionado != undefined) {
        return elementoSelecionado.value;
      } else {
        return null;
      }

    }

    if (obj.descCPFCNPJ == "") {
      alert("Preencha todos os campos");
      return;
    }

    //console.log(obj);  /admin/usuario/criar-anuncio
    fetch(`${masterPath.url}/admin/anuncio/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(obj),
    })
      .then((x) => x.json())
      .then((res) => {
        // Remover um item do localStorage
        localStorage.removeItem("imgname");

        console.log(res);
        window.location.href = `/ver-anuncios/${limparCPFouCNPJ(obj.descCPFCNPJ)}`;
        //navigate(`/ver-anuncios/${limparCPFouCNPJ(obj.descCPFCNPJ)}`);
      });
  }


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

  function limparCPFouCNPJ(cpfOuCnpj) {
    return cpfOuCnpj.replace(/[.-]/g, '');
  }

  return (
    <div className="content-child-login">
      <div className="header hidden-print d-flex justify-content-center align-items-center">
        <h1>Área do assinante</h1>
      </div>

      {showSpinner && <button class="buttonload">
        <i class="fa fa-spinner fa-spin"></i>Carregando
      </button>}

      <div className="container container-login d-flex align-items-center">
        <div className="row">
          <h3 className="subtitulo">Você precisa fazer o login ou se cadastrar para finalizar o anúncio</h3>
          <div className="col-md-6 col-sm-6">
            <div className="bg-cinza margin-bottom-20 rounded">
              <h2><i className="fa fa-user"></i> Já tenho cadastro</h2>
              <form name="frm-login" id="frm-login" method="post" enctype="application/x-www-form-urlencoded">
                <div className="row">
                  <div className="col-md-12 py-3">
                    <div className="input-icon margin-top-10">
                      <i className="fa fa-user"></i>
                      <input type="text" className="form-control assinante" placeholder="Digite seu CPF ou CNPJ" id="descCPFCNPJ"
                        ref={loginValue}
                        onKeyDown={teclaLogin}
                        value={cpfCnpjValue}
                        onChange={handleCpfCnpjChange} />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="input-icon margin-top-10 py-3">
                      <i className="fa fa-key"></i>
                      <input type="password" className="form-control assinante" placeholder="Digite sua senha" id="senha" ref={passValue} onKeyDown={teclaLogin} />
                    </div>
                  </div>
                  <div className="col-md-6 col-sm-5 senha">
                    <a href="#" className="btn-forget-password">Esqueci minha senha</a>
                  </div>
                  <div className="col-md-6 col-sm-7 continuar">
                    <button type="button" className="btn cinza btn-logar" onClick={entrar}><i className="fa fa-arrow-right"></i>Continuar</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="col-md-6 col-sm-6">
            <div className="cadastro margin-bottom-20 rounded">
              <h2>
                <i className="fa fa-star-o"></i> Criar meu cadastro
              </h2>
              <form
                id="frmCreateRegister"
                name="frmCreateRegister"
                method="post"
                enctype="application/x-www-form-urlencoded"
              >
                <div className="row">
                  <div className="col-md-12 py-3 select-pfpj">
                    <i className="fa fa-user icone-form"></i>
                    <div className="form-group">
                      <select
                        className="form-control cadastro-form"
                        id="PjPf"
                        ref={tipoPessoa}
                      >
                        <option value="">
                          Selecione pessoa jurídica ou pessoa física
                        </option>
                        <option value="1">Pessoa Física</option>
                        <option value="2">Pessoa Jurídica</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="input-icon margin-top-10 py-3">
                      <i className="fa fa-tags"></i>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Digite seu CPF ou CNPJ"
                        name="rdescCPFCNPJ"
                        id="rdescCPFCNPJ"
                        ref={nuDocumento}
                      />
                    </div>
                  </div>
                  <div className="col-md-12 continuar">
                    <button type="button" className="btn cinza btn-step-one" onClick={ocultarForm}>
                      <i className="fa fa-arrow-right px-2"></i>CRIAR CADASTRO
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          {/* <div className="col-md-12 py-4">
            <div className="vantagens margin-bottom-20">
              <a href="/anuncie">
                <i className="fa fa-thumbs-up"></i> <b>Clique aqui</b> e saiba
                as <b>vantagens</b> de <b>anunciar conosco</b>
              </a>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default ContentChildLogin;
