import React, { useState, useEffect, useRef } from "react";
import Localidade from "../../components/Localidade";
import { masterPath } from "../../config/config";

//css
import './css/formChild.css';

//Components
import InputCpf from '../InputCpf';
import AlertMsg from "../Alerts/AlertMsg";

const ContentChildForm = (props) => {
  //state
  const [ufSelected, setUf] = useState(0);
  const [uf, setUfs] = useState([]);
  const [caderno, setCaderno] = useState([]);
  const [atividades, setAtividades] = useState();
  const [cpf, setCPF] = useState('');
  const [liberado, setLiberado] = useState(false);
  const [alert, setAlert] = useState(false);
  

  //ref
  const loadingButton = useRef();

  const executarSelecao = () => {
    let codigoUf = document.querySelectorAll("#codUf6")[0].value;
    setUf(codigoUf);
  };

  useEffect(() => {
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
        //setCodUser(res.message + 1);
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

  function sendObj() {
    const obj = {
      "TipoPessoa": pegarElemento('#descTipoPessoa-pf').checked ? "pf" : "pj",
      "CPFCNPJ": pegarElemento('#descCPFCNPJ').replace(/[.-]/g, ''),
      "Nome": pegarElemento('#descNome'),
      "Email": pegarElemento('#descEmail'),
      "senha": pegarElemento('#senha'),
      "hashCode": 0,
      "Value": 0,
      "TipoUsuario": pegarElemento('#codTipoUsuario'),
      "Telefone": pegarElemento('#descTelefone'),
      "RepresentanteConvenio": "default",
      "Endereco": pegarElemento('#descEndereco'),
      "Uf": pegarElemento('#codUf6'),
      "Cidade": pegarElemento('#codCidade7'),
      "Cadastro": 31323,
      "usuarioCod": 0,
      "dtCadastro2": "12-12-2012",
      "dtAlteracao": "12-12-2012",
      "ativo": "1"

    };

    document.querySelectorAll(".modal-content input").forEach((item, i) => {
      if (item.value.trim() == '') {
        item.style.border = "1px solid red";
        setLiberado(false)
      } else {
        item.style.border = "none";
        setLiberado(true)
      }
    })

    if (!liberado) {
      return;
    } else {
      loadingButton.current.style.display = "block";
    }


    console.log(obj)

    fetch(`${masterPath.url}/admin/usuario/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(obj),
    })
      .then((x) => x.json())
      .then((res) => {
        if (res.success) {
          cadastrarAnuncio(res.message.codUsuario)
          loadingButton.current.style.display = "none";
          setAlert(true);
        } else {
          loadingButton.current.style.display = "none";
        }
        console.log(res);
      });



  }

  function pegarElemento(elemento) {
    return document.querySelector(elemento).value;
  };

  const ocultarForm = () => {
    props.onContinue(false);
  };

  function cadastrarAnuncio(codUser) {
    const obj = {
      codAnuncio: 37,
      codUsuario: codUser,
      codTipoAnuncio: 2,
      codAtividade: buscarElemento("codAtividade").value,
      codPA: null,
      codDuplicado: null,
      tags: "torteria,bolos,tortas,salgados,festas",
      codCaderno: buscarElemento("codUf5").value,
      codUf: buscarElemento("codUf4").value,
      codCidade: buscarElemento("codUf5").value,
      descAnuncio: buscarElemento("descAnuncio").value,
      descAnuncioFriendly: "oficina-de-tortas",
      descImagem: localStorage.getItem("imgname"),
      descEndereco: buscarElemento("descEndereco").value,
      descTelefone: buscarElemento("descTelefone").value,
      descCelular: buscarElemento("descCelular").value,
      descDescricao: "",
      descSite: "www.oficinadetortas.com.br",
      descSkype: null,
      descPromocao: "",
      descEmailComercial: buscarElemento("descEmailComercial").value,
      descEmailRetorno: buscarElemento("descEmailRetorno").value,
      descFacebook: "",
      descTweeter: "",
      descWhatsApp: buscarElemento("descWhatsApp").value,
      descCEP: buscarElemento("descCEP").value,
      descTipoPessoa: buscarElemento("descTipoPessoa-pf").checked ? "pf" : "pj",
      descCPFCNPJ: buscarElemento("descCPFCNPJ").value,
      descNomeAutorizante: buscarElemento("descNomeAutorizante").value,
      descEmailAutorizante: buscarElemento("descEmailAutorizante").value,
      codDesconto: buscarElemento("discountHash").value,
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
      return elementoSelecionado;
    }

    if (obj.descCPFCNPJ == "") {
      alert("Preencha todos os campos");
      return;
    }

    //console.log(obj);
    fetch(`${masterPath.url}/admin/usuario/criar-anuncio`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(obj),
    })
      .then((x) => x.json())
      .then((res) => {
        // Remover um item do localStorage
        localStorage.removeItem("imgname");

        console.log(res);
      });
  }


  return (
    <div className="content-child-form">
      <div className="header hidden-print d-flex justify-content-center align-items-center">
        <h1>Cadastro de Usuário</h1>
      </div>

      {alert && <AlertMsg />}

      <button class="buttonload" style={{ display: "none" }} ref={loadingButton}>
        <i class="fa fa-spinner fa-spin"></i>Carregando
      </button>

      {/* <!-- CADASTRO --> */}
      <div className="interna" style={{ marginTop: "65px" }}>
        <div className="row">
          <div className="col-md-12">
            <div className="bg-cinza text-start">
              <h2 className=" py-3">
                <i className="fa fa-envelope"></i> Preencha o formulário
              </h2>
              <div className="formularioCadastro">
                <form
                  id="bg-registro-usuario"
                  action=""
                  method="post"
                  enctype="application/x-www-form-urlencoded"
                >
                  <input
                    type="hidden"
                    name="codUsuario"
                    value=""
                    id="codUsuario"
                  />
                  <input
                    type="hidden"
                    name="codTipoPessoa"
                    value="pf"
                    id="codTipoPessoa"
                  />{" "}
                  <div className="row">
                    <div className="col-md-12">
                      <div className="input-icon margin-top-10">
                        <i className="fa fa-credit-card"></i>
                        <InputCpf
                          /*      id="descCPFCNPJ" */
                          value={cpf}
                          onChange={(event) => setCPF(event.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-6 col-sm-6">
                      <div className="input-icon margin-top-10">
                        <i className="fa fa-user"></i>
                        <input
                          type="text"
                          name="descNome"
                          id="descNome"
                          className="form-control"
                          placeholder="Digite seu nome"
                        />{" "}
                      </div>
                    </div>
                    <div className="col-md-6 col-sm-6">
                      <div className="input-icon margin-top-10">
                        <i className="fa fa-envelope"></i>
                        <input
                          type="text"
                          name="descEmail"
                          id="descEmail"
                          className="form-control"
                          placeholder="Digite seu e-mail"
                        />{" "}
                      </div>
                    </div>
                    <div className="col-md-6 col-sm-6">
                      <div className="input-icon margin-top-10">
                        <i className="fa fa-key"></i>
                        <input
                          type="password"
                          name="senha"
                          id="senha"
                          className="form-control"
                          placeholder="Digite sua senha"
                        />{" "}
                      </div>
                    </div>
                    <div className="col-md-6 col-sm-6">
                      <div className="input-icon margin-top-10">
                        <i className="fa fa-users"></i>
                        <select
                          name="codTipoUsuario"
                          id="codTipoUsuario"
                          className="form-control"
                        >
                          <option value="">
                            - Selecione o tipo de perfil -
                          </option>
                          <option value="4" selected="selected">
                            Anúnciante
                          </option>
                        </select>{" "}
                      </div>
                    </div>
                    <div className="col-md-6 col-sm-6">
                      <div className="input-icon margin-top-10">
                        <i className="fa fa-phone"></i>
                        <input
                          type="text"
                          name="descTelefone"
                          id="descTelefone"
                          className="form-control"
                          placeholder="Digite seu telefone"
                        />{" "}
                      </div>
                    </div>
                    <div className="col-md-6 col-sm-6">
                      <div className="input-icon margin-top-10">
                        <i className="fa fa-map-marker"></i>
                        <input
                          type="text"
                          name="descEndereco"
                          id="descEndereco"
                          className="form-control"
                          placeholder="Digite seu endereço"
                        />{" "}
                      </div>
                    </div>
                    <div className="col-md-6 col-sm-6">
                      <div className="input-icon margin-top-10 cad-uf">
                        <i className="fa fa-compass"></i>
                        <select
                          name="codUf"
                          id="codUf6"
                          className="form-control"
                          onChange={executarSelecao}
                        >
                          <option value="">- UF -</option>

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
                    <div className="col-md-6 col-sm-6">
                      <div className="input-icon margin-top-10">
                        <i className="fa fa-map-marker"></i>
                        <div className="cad-cidade">
                          <select
                            name="codCidade"
                            id="codCidade7"
                            className="form-control"
                          >
                            <option value="">- Cidades -</option>
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
                    <div className="col-md-12 py-3" style={{ overflow: "hidden" }}>
                      <button
                        type="button"
                        className="btn proximo"
                        id="btn-cancel"
                        onClick={ocultarForm}
                      >
                        <i className="fa fa-times"></i> cancelar
                      </button>
                      <button
                        type="button"
                        className="btn cinza pull-right"
                        id="btn-save"
                        onClick={sendObj}
                      >
                        <i className="fa fa-check"></i> confirmar
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentChildForm;
