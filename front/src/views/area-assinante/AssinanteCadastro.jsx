import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Localidade from "../../components/Localidade";
import { masterPath } from "../../config/config";

//css
import '../../components/Modal/css/formChild.css';

//Components
import InputCpf from '../../components/InputCpf';
import AlertMsg from "../../components/Alerts/AlertMsg";
import Mosaico from '../../components/Mosaico';
import Busca from '../../components/Busca';
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';

const AssinanteCadastro = (props) => {
  //state
  const [ufSelected, setUf] = useState(0);
  const [uf, setUfs] = useState([]);
  const [caderno, setCaderno] = useState([]);
  const [atividades, setAtividades] = useState();
  const [cpf, setCPF] = useState('');
  const [alert, setAlert] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const navigate = useNavigate();

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


    const doc = searchParams.get('doc');
    setCPF(doc);

  }, []);

  function verificarCampos() {
    let flag = false;
    
    document.querySelectorAll(".form-cadastro input").forEach((item, i) => {
      if (item.value.trim() == '' && item.name != 'codUsuario') {
        item.style.border = "1px solid red";
        flag = false;
        //console.log(item.value)
      } else {
        item.style.border = "none";
        //console.log(item.value)
        flag = true;
      }
      
      if (document.querySelectorAll(".form-cadastro input").length == i + 1 && flag) {
        console.log("ok");

        loadingButton.current.style.display = "block";

        sendObj();

      }

    })

  };

  function sendObj() {
    console.log("clicou");
    const obj = {
      "TipoPessoa": "pf",
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




    //console.log(obj)

    fetch(`${masterPath.url}/admin/usuario/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(obj),
    })
      .then((x) => x.json())
      .then((res) => {
        if (res.success) {

          sessionStorage.setItem('authTokenMN', true);
          sessionStorage.setItem('userLogged', res.message.descNome);
          //cadastrarAnuncio(res.message.codUsuario)
          loadingButton.current.style.display = "none";
          //setAlert(true);
          window.location.href = `/ver-anuncios/${obj.CPFCNPJ}`;
        } else {
          loadingButton.current.style.display = "none";

          if(res.message.original.errno == 1062) {
            setAlert(true);
          }
        }

        //console.log(res.message.original.errno);
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




  function limparCPFouCNPJ(cpfOuCnpj) {
    return cpfOuCnpj.replace(/[.-]/g, '');
  }



  return (
    <div className="content-child-form">
        <header>
        <Mosaico logoTop={true} borda="none" />
      </header>
      <Busca />
      <div className="header hidden-print d-flex justify-content-center align-items-center">
        <h1>Cadastro de Usuário</h1>
      </div>

      {alert && <AlertMsg message={"O cpf informado já está cadastrado no sistema"}/>}

      <button class="buttonload" style={{ display: "none" }} ref={loadingButton}>
        <i class="fa fa-spinner fa-spin"></i>Carregando
      </button>

      {/* <!-- CADASTRO --> */}
      <div className="interna container my-5">
        <div className="row form-cadastro">
          <div className="col-md-12">
            <div className="bg-cinza text-start p-3">
              <h2 className="p-3">
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
                          <option value="3" selected="selected">
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
                        onClick={verificarCampos}
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
      <footer>
        <Nav styleClass="Nav" />
        <Footer />
      </footer>
    </div>
  );
};

export default AssinanteCadastro;