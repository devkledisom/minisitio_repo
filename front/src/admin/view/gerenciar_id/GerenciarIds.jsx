// components/OutroComponente.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../assets/css/users.css';
import 'font-awesome/css/font-awesome.min.css';
import { masterPath } from '../../../config/config';


//componente
import Header from "../Header";
import Pagination from '../../components/Pagination';
import Spinner from '../../../components/Spinner';

const GerenciarIds = () => {

    const style = {
        position: "fixed",
        zIndex: "999"
    }

    const [ids, setIds] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [page, setPage] = useState(1);
    const [selectId, setSelectId] = useState();
    const [showSpinner, setShowSpinner] = useState(true);
    const [del, setDel] = useState(false);

    const location = useLocation();


    const getParam = new URLSearchParams(location.search);

    const param = getParam.get('page') ? getParam.get('page') : 1;


    useEffect(() => {
        setShowSpinner(true); 
    
        Promise.all([
            fetch(`${masterPath.url}/admin/desconto/read?page=${param}`).then((x) => x.json()),
            fetch(`${masterPath.url}/admin/usuario/buscar/all`).then((x) => x.json())
        ])
        .then(([resDesconto, resUsuarios]) => {
            setIds(resDesconto.message);
            setUsuarios(resUsuarios.usuarios);
            setShowSpinner(false);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            setShowSpinner(false); 
        });
    
    }, [param]);
    



    const navigator = useNavigate();


    function selecaoLinha(event) {
        console.log(event.currentTarget)

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
        fetch(`${masterPath.url}/admin/desconto/delete/${selectId}`, {
            method: "DELETE"
        })
            .then((x) => x.json())
            .then((res) => {
                
                if (res.success) {
                    setShowSpinner(false); 
                    alert(res.message)
                    document.querySelector(".selecionada").remove();
                }

            })
    };

    function buscarUserId() {
        setShowSpinner(true); 
        const campoPesquisa = document.getElementById('buscar');

        fetch(`${masterPath.url}/admin/desconto/buscar/${campoPesquisa.value}`)
            .then((x) => x.json())
            .then((res) => {
                if (res.success) {
                    alert("encontrado");
                    setIds(res);
                    setShowSpinner(false);
                    console.log(res.usuarios);
                } else {
                    alert("Usuário não encontrado na base de dados");
                }

            })
    };

    function teste(meuParam) {
        let user = usuarios.find(user => user.codUsuario == meuParam);

        if(user != undefined) {
            return user.descNome
        }
        //console.log("users",meuParam, user)
       
    }

    return (
        <div className="users">
             <header style={style} className='w-100'>
                <Header />
            </header>
            <section className="pt-5">

            {showSpinner && <Spinner />}

                <h1 className="pt-4 px-4">Gerenciar IDs</h1>
                <div className="container-fluid py-4 px-4">
                    <div className="row margin-bottom-10">
                        <div className="span6 col-md-6">
                            <button type="button" className="btn custom-button" onClick={() => navigator('/desconto/cadastro')}>Adicionar</button>
                            <button type="button" className="btn btn-info custom-button mx-2 text-light" onClick={() => navigator(`/desconto/editar?id=${selectId}`)}>Editar</button>
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
                                        {/* <th>Nome</th> */}
                                        <th style={{ "width": "200px" }}>Usuário</th>
                                        <th style={{ "width": "100px" }}>Desconto</th>
                                        <th style={{ "width": "150px" }}>Código</th>
                                        <th style={{ "width": "250px" }}>Descrição</th>
                                        <th style={{ "width": "200px" }}>Cadastrado em</th>
                                        <th style={{ "width": "100px" }}>Status</th>
                                        <th style={{ "width": "150px" }}>Qtde Espaços</th>
                                        <th style={{ "width": "100px" }}>Saldo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        usuarios != '' &&
                                        ids != '' && ids.IdsValue.map((item) => {
                                            console.log("map", usuarios)
                                            console.log("ids", ids)
                                          
                                            return (
                                                <tr key={item.idDesconto} id={item.idDesconto} onClick={selecaoLinha}>

                                                    <td>{teste(item.idUsuario)}</td>
                                                    <td>{item.desconto}</td>
                                                    <td>{item.hash}</td>
                                                    <td>{item.descricao}</td>
                                                    <td>{item.dtCadastro}</td>
                                                    <td>{item.ativo ? "Ativado" : "Desativado"}</td>
                                                    <td>{item.utilizar_saldo}</td>
                                                    <td>{item.saldo}</td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>

                    </div>
                    <Pagination totalPages={ids.totalPaginas} table={"desconto"} />

                </article>
                <p className='w-100 text-center'>© MINISITIO</p>
            </section>
            {/*  <footer className='w-100' style={{ position: "absolute", bottom: "0px" }}>
                <p className='w-100 text-center'>© MINISITIO</p>
            </footer> */}
        </div>
    );
}

export default GerenciarIds;
