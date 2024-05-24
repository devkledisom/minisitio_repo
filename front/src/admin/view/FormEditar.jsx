// components/OutroComponente.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../assets/css/users.css';
import 'font-awesome/css/font-awesome.min.css';
import { masterPath } from '../../config/config';

//componente
import Header from "./Header";
import Pagination from '../components/Pagination';

const FormCadastro = () => {

    const [usuarios, setUsuarios] = useState([]);
    const [page, setPage] = useState(1);
    const [ufSelected, setUf] = useState(0);
    const [uf, setUfs] = useState([]);
    const [caderno, setCaderno] = useState([]);

    const location = useLocation();


    const getParam = new URLSearchParams(location.search);

    const param = getParam.get('id') ? getParam.get('id') : 1;

    useEffect(() => {

        fetch(`${masterPath.url}/admin/usuario/edit/${param}`)
            .then((x) => x.json())
            .then((res) => {
                setUsuarios(res);
                setUf(res.codUf);
                console.log(res);
            })

        fetch(`${masterPath.url}/cadernos`)
            .then((x) => x.json())
            .then((res) => {
                setCaderno(res)
            })
        fetch(`${masterPath.url}/ufs`)
            .then((x) => x.json())
            .then((res) => {
                setUfs(res);
            })
    }, [page, param]);

    const style = {
        position: "fixed",
        zIndex: "999"
    }

    const navigate = useNavigate();

    function cadastrarUsuario() {

        var validation = false;

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

        const data = {
            "TipoPessoa": document.getElementById('codTipoPessoa').value,
            "CPFCNPJ": document.getElementById('nu_doc').value,
            "Nome": document.getElementById('nome').value,
            "Email": document.getElementById('email').value,
            "senha": document.getElementById('senha').value,
            "hashCode": 0,
            "Value": 0,
            "TipoUsuario": document.getElementById('codTipoPerfil').value,
            "Telefone": document.getElementById('telefone').value,
            "RepresentanteConvenio": "default",
            "Endereco": document.getElementById('endereco').value,
            "Uf": document.getElementById('coduf').value,
            "Cidade": document.getElementById('codcidade').value,
            "Cadastro": 31323,
            "usuarioCod": 0,
            "dtCadastro2": "",
            "dtAlteracao": "",
        };

        const config = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        };

        if (validation) {
            fetch(`${masterPath.url}/admin/usuario/update/${param}`, config)
                .then((x) => x.json())
                .then((res) => {
                    console.log(res)
                    if (res.success) {
                        alert("Dados Atualizados!");
                    } else {
                        alert(res.message);
                        console.log(res.message)
                    }
                })
        }

    };

    const executarSelecao = () => {
        let codigoUf = document.querySelectorAll('#coduf')[0].value;
        setUf(codigoUf);
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


    const [valorInput, setValorInput] = useState({

    });

    const handleChange = (event) => {

        const { name, value } = event.target;

        console.log(name)

        switch (event.target.id) {
            case "codTipoPessoa":
                usuarios.codTipoPessoa = value;
                break;
            case "nu_doc":
                usuarios.descCPFCNPJ = value;
                break;
            case "nome":
                usuarios.descNome = value;
                break;
            case "email":
                usuarios.descEmail = value;
                break;
            case "senha":
                usuarios.senha = value;
                break;
            case "codTipoPerfil":
                usuarios.codTipoUsuario = value;
                break;
            case "telefone":
                usuarios.descTelefone = value;
                break;
            case "endereco":
                usuarios.descEndereco = value;
                break;
            case "coduf":
                usuarios.codUf = value;
                break;
            case "codcidade":
                usuarios.codCidade = value;
                break;
            default:
                console.log("não encontrou");
                break;
        }








        /*         
                usuarios.codUf = value;
                usuarios.codCidade = value; */

        setUsuarios(prevState => ({
            ...prevState,
            [name]: value
        }));


        //setValorInput(event.target.value);
    };




    return (
        <div className="users">
            <header style={style} className='w-100'>
                <Header />
            </header>
            <section className='py-5'>


                <div className="container">
                    <h2 className="pt-4 px-5 text-center">Editar Usuário</h2>
                    {/* <h2>Vertical (basic) form</h2> */}
                    <form action="/action_page.php">
                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label for="email" className="w-50 px-1">Indicado por: (Digite o nome, e-mail ou CPF/CNPJ):</label>
                            <input type="email" className="form-control h-25 w-50" id="in_email" placeholder="" name="email" />
                        </div>
                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label for="pwd" className="w-50 px-1">Tipo pessoa:</label>
                            {/*  <input type="password" className="form-control h-25 w-50" id="pwd" placeholder="" name="pwd" /> */}
                            <select name="codTipoPessoa" id="codTipoPessoa" className="w-50 py-1" value={usuarios.codTipoPessoa} onChange={handleChange}>
                                <option value="" selected="selected">- Selecione o tipo de pessoa -</option>
                                <option value="pf">Fisica</option>
                                <option value="pj">Jurídica</option>
                            </select>
                        </div>
                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label for="pwd" className="w-50 px-1">CPF ou CNPJ:</label>
                            <input type="text"
                                className="form-control h-25 w-50"
                                id="nu_doc"
                                placeholder=""
                                name="pwd"
                                value={usuarios.descCPFCNPJ}
                                onChange={handleChange} />
                        </div>
                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label for="pwd" className="w-50 px-1">Nome:</label>
                            <input type="text"
                                className="form-control h-25 w-50"
                                id="nome"
                                placeholder=""
                                name="pwd"
                                value={usuarios.descNome}
                                onChange={handleChange} />
                        </div>
                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label for="pwd" className="w-50 px-1">Email:</label>
                            <input type="text"
                                className="form-control h-25 w-50"
                                id="email"
                                placeholder=""
                                name="pwd"
                                value={usuarios.descEmail}
                                onChange={handleChange} />
                        </div>
                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label for="pwd" className="w-50 px-1">Senha:</label>
                            <input type="password"
                                className="form-control h-25 w-50"
                                id="senha"
                                placeholder=""
                                name="pwd"
                                value={usuarios.senha}
                                onChange={handleChange} />
                        </div>
                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label for="pwd" className="w-50 px-1">Tipo usuário:</label>
                            <select name="codTipoPessoa" id="codTipoPerfil" className="w-50 py-1" value={usuarios.codTipoUsuario} onChange={handleChange}>
                                <option value="" selected="selected">- Selecione o tipo de perfil -</option>
                                <option value="1">Administrador</option>
                                <option value="2">Associado</option>
                                <option value="3">Licenciado</option>
                                <option value="4">Anunciante</option>
                                <option value="5">Super Administrador</option>
                                <option value="6">Master</option>
                            </select>
                        </div>
                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label for="pwd" className="w-50 px-1">Telefone:</label>
                            <input type="text"
                                className="form-control h-25 w-50"
                                id="telefone"
                                placeholder=""
                                name="pwd"
                                value={usuarios.descTelefone}
                                onChange={handleChange} />
                        </div>
                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label for="pwd" className="w-50 px-1">Endereço:</label>
                            <input type="text"
                                className="form-control h-25 w-50"
                                id="endereco"
                                placeholder=""
                                name="pwd"
                                value={usuarios.descEndereco}
                                onChange={handleChange} />
                        </div>
                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label for="pwd" className="w-50 px-1">UF:</label>
                            <select name="uf" id="coduf" className="w-50 py-1" value={usuarios.codUf} onChange={handleChange}>
                                <option value="" selected="selected">
                                    - Selecione um estado -
                                </option>
                                {
                                    uf.map((uf) => (
                                        <option value={uf.id_uf}>{uf.sigla_uf}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label for="pwd" className="w-50 px-1">Cidade:</label>
                            <select name="cidade" id="codcidade" className="w-50 py-1" value={usuarios.codCidade} onChange={handleChange}>
                                <option value="" selected="selected">- Selecione uma cidade -</option>
                                {
                                    caderno.map((cidades) => (
                                        cidades.codUf == ufSelected &&
                                        <option value={cidades.codCaderno}>{cidades.nomeCaderno}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <div className="text-center py-3">
                            <button type="button"
                                className="btn btn-info custom-button mx-2 text-light"
                                onClick={cadastrarUsuario}
                            >Atualizar</button>
                            <button type="submit" className="btn custom-button" onClick={() => navigate('/users')}>Cancelar</button>
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

export default FormCadastro;
