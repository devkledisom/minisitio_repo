import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import Localidade from "../../components/Localidade";
import { masterPath } from "../../config/config";
import InputMask from 'react-input-mask';

//css
import '../../components/Modal/css/formChild.css';

//Components
import InputCpf from '../../components/InputCpf';
import AlertMsg from "../../components/Alerts/AlertMsg";

const DadosPessoais = (props) => {
  //state
  const [ufSelected, setUf] = useState(0);
  const [uf, setUfs] = useState([]);
  const [caderno, setCaderno] = useState([]);
  const [atividades, setAtividades] = useState();
  //const [cpf, setCPF] = useState('');
  const [alert, setAlert] = useState(false);
  const [user, setUser] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();

  const navigate = useNavigate();

  //ref
  const loadingButton = useRef();

  const { cpf } = useParams();

  const executarSelecao = () => {
    let codigoUf = document.querySelectorAll("#codUf6")[0].value;
    setUf(codigoUf);
  };

  useEffect(() => {
    loadingButton.current.style.display = "block";
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

    /*   const doc = searchParams.get('cpf');
      console.log(doc)
      setCPF(doc); */

    fetch(`${masterPath.url}/admin/usuario/buscar/${cpf}`)
      .then((x) => x.json())
      .then((res) => {
        loadingButton.current.style.display = "none";
        setUser(res.usuarios[0]);
        setUf(res.usuarios[0].codUf);
      });


 

  }, []);

  function verificarCampos() {
    let flag = false;

    document.querySelectorAll(".modal-content input").forEach((item, i) => {
      if (item.value.trim() == '' && item.name != 'codUsuario') {
        item.style.border = "1px solid red";
        flag = false;
      } else {
        item.style.border = "none";
        flag = true;
      }

      if (document.querySelectorAll(".modal-content input").length == i + 1 && flag) {
        console.log("ok");

        loadingButton.current.style.display = "block";

        sendObj();

      }




    })

  };

  function sendObj() {
    console.log("clicou", pegarElemento('#descNome'));
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




    //console.log(obj)

    fetch(`${masterPath.url}/admin/usuario/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(obj),
    })
      .then((x) => x.json())
      .then((res) => {
        if (res.success) {
          //cadastrarAnuncio(res.message.codUsuario)
          loadingButton.current.style.display = "none";
          setAlert(true);
        } else {
          loadingButton.current.style.display = "none";
          console.log("Esse usuário já está cadastrado!");
        }
        console.log(res);
      });



  }

  function pegarElemento(elemento) {
    return document.querySelector(elemento).value;
  };




  function limparCPFouCNPJ(cpfOuCnpj) {
    return cpfOuCnpj.replace(/[.-]/g, '');
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
        ...user,
        [name]: value,
        
    });
  }

  function atualizarUsuario(e) {
    loadingButton.current.style.display = "block";
    var validation = true;

    console.log("clicou", user);

    const config = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
    };

    if (validation) {
        fetch(`${masterPath.url}/admin/usuario/update/${cpf}`, config)
            .then((x) => x.json())
            .then((res) => {
                //setShowSpinner(false);
                loadingButton.current.style.display = "none";
                if (res.success) {
                  setAlert(true);

                    setTimeout(() => {
                    props.selectPage(e, 1);
                    }, 5000)
                    //alert("Dados Atualizados!");

                } else {
                    //alert(res.message);
                    console.log(res.message)
                }
            })
    }

};


  return (
    <div className="content-child-form py-5">
 {/*      <div className="header hidden-print d-flex justify-content-center align-items-center">
        <h1>Cadastro de Usuário</h1>
      </div> */}

      {alert && <AlertMsg message={"Atualização Realizada"}/>}

      <button class="buttonload" style={{ display: "none" }} ref={loadingButton}>
        <i class="fa fa-spinner fa-spin"></i>Carregando
      </button>

      {/* <!-- CADASTRO --> */}
      <div className="interna" style={{ marginTop: "65px" }}>
        <div className="row">
          <div className="col-md-12">
            <div className="bg-cinza text-start">
              <h2 className=" p-3">
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
                          //onChange={(event) => setCPF(event.target.value)}
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
                          value={user.descNome}
                          onChange={handleChange}
                          className="form-control"
                          placeholder="Digite seu nome"
                        />{" "}
                      </div>
                    </div>
                    <div className="col-md-6 col-sm-6">
                      <div className="input-icon margin-top-10">
                        <i className="fa fa-envelope"></i>
                        <input
                          type="email"
                          name="descEmail"
                          id="descEmail"
                          className="form-control"
                          value={user.descEmail}
                          onChange={handleChange}
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
                          value={user.senha}
                          onChange={handleChange}
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
                     {/*    <input
                          type="text"
                          name="descTelefone"
                          id="descTelefone"
                          className="form-control"
                          placeholder="Digite seu telefone"
                        /> */}
                        <InputMask
                    type="text"
                    name="descTelefone"
                    id="descTelefone"
                    className="form-control"
                    placeholder="(99) 99999-9999"
                    value={user.descTelefone}
                    onChange={handleChange}
                    required
                    mask={'(99) 9999-9999'}></InputMask>
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
                          value={user.descEndereco}
                          onChange={handleChange}
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
                          onChange={(e) => {executarSelecao(e); handleChange(e) }}
                          value={user.codUf}
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
                            value={user.codCidade}
                            onChange={handleChange}
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
                        onClick={(e) => props.selectPage(e, 1)}
                      >
                        <i className="fa fa-times"></i> cancelar
                      </button>
                      <button
                        type="button"
                        className="btn cinza pull-right"
                        id="btn-save"
                        onClick={(e) => atualizarUsuario(e)}
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

export default DadosPessoais;
