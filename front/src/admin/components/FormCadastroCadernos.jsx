// components/OutroComponente.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../assets/css/users.css';
import 'font-awesome/css/font-awesome.min.css';
import { masterPath } from '../../config/config';

//componente
import Header from "../view/Header";
import Pagination from './Pagination';

const FormCadastro = () => {

    const [usuarios, setUsuarios] = useState([]);
    const [page, setPage] = useState(1);
    const [ufSelected, setUf] = useState(0);
    const [uf, setUfs] = useState([]);
    const [caderno, setCaderno] = useState([]);

    const location = useLocation();


    const getParam = new URLSearchParams(location.search);

    const param = getParam.get('page') ? getParam.get('page') : 1;



    useEffect(() => {

        fetch(`${masterPath.url}/admin/usuario?page=${param}`)
            .then((x) => x.json())
            .then((res) => {
                setUsuarios(res);
                console.log(usuarios);
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
            fetch(`${masterPath.url}/admin/usuario/create`, config)
                .then((x) => x.json())
                .then((res) => {
                    if (res.success) {
                        alert("Usuário Cadastrado!");
                    } else {
                        alert(res.message);
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

    return (
        <div className="users">
            <header style={style} className='w-100'>
                <Header />
            </header>
            <section className='py-5'>


                <div className="container">
                    <h2 className="pt-4 px-5 text-center">Adicionar Caderno</h2>
                    {/* <h2>Vertical (basic) form</h2> */}
                    <form action="/action_page.php">
                    <div className="form-group d-flex flex-column align-items-center py-3">
                            <label for="pwd" className="w-50 px-1">UF:</label>
                            <select name="codTipoPessoa" id="coduf" onChange={executarSelecao} className="w-50 py-1">
                                <option value="" selected="selected">- Selecione um estado -</option>
                                {
                                    uf.map((uf) => (
                                        <option value={uf.id_uf}>{uf.sigla_uf}</option>
                                    ))
                                }
                            </select>
                        </div>
                        
                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label for="pwd" className="w-50 px-1">Nome Caderno:</label>
                            <input type="text" className="form-control h-25 w-50" id="telefone" placeholder="" name="pwd" />
                        </div>

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label for="pwd" className="w-50 px-1">É Capital:</label>
                            {/*  <input type="password" className="form-control h-25 w-50" id="pwd" placeholder="" name="pwd" /> */}
                            <select name="codTipoPessoa" id="codTipoPessoa" className="w-50 py-1">
                                <option value="Não">Não</option>
                                <option value="Sim">Sim</option>
                            </select>
                        </div>
                   
                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label for="pwd" className="w-50 px-1">Imagem:</label>
                            <input type="file" className="form-control h-25 w-50" id="endereco" placeholder="" name="pwd" />
                        </div>

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label for="pwd" className="w-50 px-1">Cep Inicial:</label>
                            <input type="text" className="form-control h-25 w-50" id="endereco" placeholder="" name="pwd" />
                        </div>

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label for="pwd" className="w-50 px-1">Cep Final:</label>
                            <input type="text" className="form-control h-25 w-50" id="endereco" placeholder="" name="pwd" />
                        </div>
               
        
                        <div className="text-center py-3">
                            <button type="button"
                                className="btn btn-info custom-button mx-2 text-light"
                                onClick={cadastrarUsuario}
                            >Salvar</button>
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
