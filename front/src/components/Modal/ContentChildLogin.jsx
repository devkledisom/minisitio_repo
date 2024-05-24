import React from "react";

/* import '../../assets/css/main.css';//assets/css/main.css
import '../../admin/assets/css/login.css';//assets/css/login.css
 */

import './css/modal.css';

const ContentChildLogin = (props) => {

  const ocultarForm = () => {
    props.onContinue(true);
  };


  return (
    <div className="content-child-login">
      <div className="header hidden-print d-flex justify-content-center align-items-center">
        <h1>Área do assinante</h1>
      </div>

      <div className="container container-login d-flex align-items-center">
        <div className="row">
          <div className="col-md-6 col-sm-6">
            <div className="bg-cinza margin-bottom-20 rounded">
              <h2>
                <i className="fa fa-user"></i> Já tenho cadastro
              </h2>
              <form
                name="frm-login"
                id="frm-login"
                method="post"
                enctype="application/x-www-form-urlencoded"
              >
                <div className="row">
                  <div className="col-md-12 py-3">
                    <div className="input-icon margin-top-10">
                      <i className="fa fa-user"></i>
                      <input
                        type="text"
                        className="form-control assinante"
                        placeholder="Digite seu CPF ou CNPJ"
                        id="descCPFCNPJ"
                      />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="input-icon margin-top-10 py-3">
                      <i className="fa fa-key"></i>
                      <input
                        type="password"
                        className="form-control assinante"
                        placeholder="Digite sua senha"
                        id="senha"
                      />
                    </div>
                  </div>
                  <div className="col-md-6 col-sm-5 senha">
                    <a href="#" className="btn-forget-password">
                      Esqueci minha senha
                    </a>
                  </div>
                  <div className="col-md-6 col-sm-7 continuar">
                    <button
                      type="button"
                      className="btn cinza btn-logar"
                      
                    >
                      <i className="fa fa-arrow-right px-2"></i>CONTINUAR
                    </button>
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
                      >
                        <option>
                          Selecione pessoa jurídica ou pessoa física
                        </option>
                        <option>Pessoa Física</option>
                        <option>Pessoa Jurídica</option>
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
