// components/OutroComponente.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../assets/css/users.css';
import 'font-awesome/css/font-awesome.min.css';
import { masterPath } from '../../config/config';


//componente
import Header from "./Header";
import Pagination from '../components/Pagination';
import Spinner from '../../components/Spinner';

const Users = () => {

    const [usuarios, setUsuarios] = useState([]);
    const [page, setPage] = useState(1);
    const [selectId, setSelectId] = useState();
    const [showSpinner, setShowSpinner] = useState(false);

    const location = useLocation();


    const getParam = new URLSearchParams(location.search);

    const param = getParam.get('page') ? getParam.get('page') : 1;



    useEffect(() => {
        setShowSpinner(true); 
        fetch(`${masterPath.url}/admin/usuario?page=${param}`)
            .then((x) => x.json())
            .then((res) => {
                setUsuarios(res);
                setShowSpinner(false); 
            })
    }, [page, param]);


    const navigator = useNavigate();


    function selecaoLinha(event) {

        var linhas = document.querySelectorAll('tbody tr');
        // Remove a classe 'selecionada' de todas as linhas
        linhas.forEach(function (outraLinha) {
            outraLinha.classList.remove('selecionada');
        });

        setSelectId(event.currentTarget.id)

        // Adiciona a classe 'selecionada' à linha clicada
        event.currentTarget.classList.add('selecionada');

        return;
    };


    function apagarUser() {
        setShowSpinner(true); 
        fetch(`${masterPath.url}/admin/usuario/delete/${selectId}`, {
            method: "DELETE"
        })
            .then((x) => x.json())
            .then((res) => {
                console.log(res)
                if (res.success) {
                    fetch(`${masterPath.url}/admin/usuario?page=${param}`)
                        .then((x) => x.json())
                        .then((res) => {
                            setUsuarios(res);
                            setShowSpinner(false); 
                        })
                }

            })
    };

    function buscarUserId() {
        setShowSpinner(true); 
        const campoPesquisa = document.getElementById('buscar');

        fetch(`${masterPath.url}/admin/usuario/buscar/${campoPesquisa.value}`)
            .then((x) => x.json())
            .then((res) => {
                if (res.success) {
                    setUsuarios(res);
                    setShowSpinner(false); 
                } else {
                    alert("Usuário não encontrado na base de dados");
                    setShowSpinner(false); 
                }

            })
    };

    const style = {
        position: "fixed",
        zIndex: "999"
    }


    return (
        <div className="users">
                 <header style={style} className='w-100'>
                <Header />
            </header>
            <section className="pt-5">

            {showSpinner && <Spinner />}

                <h1 className="pt-4 px-4">Usuários</h1>
                <div className="container-fluid py-4 px-4">
                    <div className="row margin-bottom-10">
                        <div className="span6 col-md-6">
                            <button type="button" className="btn custom-button" onClick={() => navigator('/usuarios/cadastro')}>Adicionar</button>
                            <button type="button" className="btn btn-info custom-button mx-2 text-light" onClick={() => navigator(`/usuarios/editar?id=${selectId}`)}>Editar</button>
                            <button type="button" className="btn btn-danger custom-button text-light" onClick={apagarUser}>Apagar</button>
                        </div>
                        <div className="span6 col-md-6">
                            <div className="pull-right d-flex justify-content-center align-items-center">
                                <input id="buscar" type="text" placeholder="Buscar" />
                                <button id="btnBuscar" className="" type="button" onClick={buscarUserId}>
                                    <i className="icon-search"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <article>
                    <div className="container-fluid">
                        <div className='row px-4'>
                            <table className="table table-bordered table-striped table-hover">
                                <thead>
                                    <tr>
                                        <th>Nome</th>
                                        <th style={{ "width": "300px" }}>E-mail</th>
                                        <th style={{ "width": "300px" }}>CPF/CNPJ</th>
                                        <th style={{ "width": "200px" }}>Tipo</th>
                                        <th style={{ "width": "150px" }}>Cadastrado em</th>
                                        <th style={{ "width": "100px" }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        usuarios != '' && usuarios.usuarios.map((item) => (

                                            <tr key={item.codUsuario} id={item.codUsuario} onClick={selecaoLinha}>
                                                <td>{item.descNome}</td>
                                                <td>{item.descEmail}</td>
                                                <td>{item.descCPFCNPJ}</td>
                                                <td>Anunciante</td>
                                                <td>{item.dtCadastro}</td>
                                                <td>{item.ativo ? "Ativado" : "Desativado"}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>

                    </div>
                    <Pagination totalPages={usuarios.totalPaginas} table={"users"}/>

                </article>
                <p className='w-100 text-center'>© MINISITIO</p>
            </section>
          {/*   <footer className='w-100' style={{ position: "absolute", bottom: "0px" }}>
                <p className='w-100 text-center'>© MINISITIO</p>
            </footer> */}
        </div>
    );
}

export default Users;
