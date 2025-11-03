import React, { useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { masterPath } from '../../config/config';

import { AuthContext } from "../../context/AuthContext";

import '../../assets/css/main.css';
import '../assets/css/login.css';
import 'bootstrap/dist/css/bootstrap.min.css';

//Componentes
import Spinner from '../../components/Spinner';
import { limparCPFouCNPJ } from '../../globalFunctions/functions';

function Login() {

    const [showSpinner, setShowSpinner] = useState(false);

    const loginValue = useRef(null);
    const passValue = useRef(null);
    const navigate = useNavigate();
    const { user, login } = useContext(AuthContext);

    function teclaLogin(e) {
        if (e.key === "Enter") {
            entrar();
        }
    };

    async function entrar() {

        setShowSpinner(true);

        let loggin = await login(limparCPFouCNPJ(loginValue.current.value), passValue.current.value);

        if (!loggin) return;

        if (loggin.success) {
            if (loggin.codTipoUsuario == 1) {
                navigate("/admin");
            } else {
                navigate(`/ver-anuncios/${loggin.descCPFCNPJ.replace(/[.-]/g, '')}`);
            }
        } else {
            alert("Login ou senha incorreto");
            setShowSpinner(false);
        }




        return;

        setShowSpinner(true);
        fetch(`${masterPath.url}/entrar`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                api_key: "keytesteProd",
                secret_key: "secrettesteProd"
            },
            body: JSON.stringify({
                "descCPFCNPJ": limparCPFouCNPJ(loginValue.current.value),
                "senha": passValue.current.value
            })
        })
            .then((x) => x.json())
            .then((res) => {
                setShowSpinner(false);
                console.log(res)
                if (res.success) {
                    if (res.type == 1) {
                        sessionStorage.setItem('authTokenMN', true);
                        sessionStorage.setItem('userLogged', "ADMIN");
                        sessionStorage.setItem('userTokenAccess', res.accessToken);

                        navigate("/admin");
                    }

                    let tipoUsuario = res.data.codTipoUsuario;
                    let nuDocumento = res.data.descCPFCNPJ;
                    console.log(tipoUsuario)

                    if (tipoUsuario == 2 || tipoUsuario == 3 || tipoUsuario == 5) {
                        sessionStorage.setItem('authTokenMN', true);
                        //sessionStorage.setItem('userLogged', res.data);
                        //sessionStorage.setItem('userLogged', res.type);
                        sessionStorage.setItem('userTokenAccess', res.accessToken);

                        navigate(`/ver-anuncios/${nuDocumento.replace(/[.-]/g, '')}`);
                    }
                } else {
                    console.log(res);
                    alert(res.message);
                }


            })
    };

    return (
        <div className="component-login">
            <div className="header hidden-print d-flex justify-content-center align-items-center">
                <h2>Área do assinante</h2>
            </div>

            {showSpinner && <Spinner />}

            <div className="container container-login d-flex align-items-center">
                <div className="row">
                    <div className="col-md-6 col-sm-6">
                        <div className="bg-cinza margin-bottom-20 rounded">
                            <h2><i className="fa fa-user"></i> Já tenho cadastro</h2>
                            <form name="frm-login" id="frm-login" method="post" enctype="application/x-www-form-urlencoded">
                                <div className="row">
                                    <div className="col-md-12 py-3">
                                        <div className="input-icon margin-top-10">
                                            <i className="fa fa-user"></i>
                                            <input type="text" className="form-control assinante" placeholder="Digite seu CPF ou CNPJ" id="descCPFCNPJ" ref={loginValue} onKeyDown={teclaLogin} />
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="input-icon margin-top-10 py-3">
                                            <i className="fa fa-key"></i>
                                            <input type="password" className="form-control assinante" placeholder="Digite sua senha" id="senha" ref={passValue} onKeyDown={teclaLogin} />
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-sm-5 senha">
                                        <a href="/forgot-password" className="btn-forget-password">Esqueci minha senha</a>
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
                            <h2><i className="fa fa-star-o"></i> Criar meu cadastro</h2>
                            <form id="frmCreateRegister" name="frmCreateRegister" method="post" enctype="application/x-www-form-urlencoded">
                                <div className="row">
                                    <div className="col-md-12 py-3">
                                        <i className="fa fa-user icone-form"></i>
                                        <div className="form-group">
                                            <select className="form-control cadastro-form py-3" id="PjPf">
                                                <option>Selecione pessoa jurídica ou pessoa física</option>
                                                <option>Pessoa Física</option>
                                                <option>Pessoa Jurídica</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="input-icon margin-top-10 py-3">
                                            <i className="fa fa-tags"></i>
                                            <input type="text" className="form-control" placeholder="Digite seu CPF ou CNPJ" name="rdescCPFCNPJ" id="rdescCPFCNPJ" />
                                        </div>
                                    </div>
                                    <div className="col-md-12 continuar">
                                        <button type="button" className="btn cinza btn-step-one" onClick={() => navigate('/criar-cadastro')}><i className="fa fa-arrow-right"></i>criar cadastro</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="col-md-12 py-4">
                        <div className="vantagens margin-bottom-20">
                            <a href="/anuncie"><i className="fa fa-thumbs-up"></i> <b>Clique aqui</b> e saiba as <b>vantagens</b> de <b>anunciar conosco</b></a>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Login;