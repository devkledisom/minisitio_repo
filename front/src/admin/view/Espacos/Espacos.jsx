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

const Espacos = () => {

    const style = {
        position: "fixed",
        zIndex: "999"
    }

    const [ids, setIds] = useState([]);
    const [anuncios, setAnucios] = useState([]);
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
            fetch(`${masterPath.url}/admin/espacos/read?page=${param}`).then((x) => x.json()),
            fetch(`${masterPath.url}/admin/usuario/buscar/all`).then((x) => x.json())
        ])
            .then(([resAnuncio]) => {
                //console.log(resAnuncio.message.anuncios)
                setAnucios(resAnuncio.message.anuncios);
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
        let user = anuncios.find(user => user.codUsuario == meuParam);

        if (user != undefined) {
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

                <h1 className="pt-4 px-4">Espaços</h1>
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
                                        <th style={{ "width": "200px" }}>Código</th>
                                        <th style={{ "width": "100px" }}>PA</th>
                                        <th style={{ "width": "150px" }}>Duplicado</th>
                                        <th style={{ "width": "250px" }}>CPF/CNPJ</th>
                                        <th style={{ "width": "200px" }}>Anúncio</th>
                                        <th style={{ "width": "100px" }}>Tipo</th>
                                        <th style={{ "width": "150px" }}>Caderno</th>
                                        <th style={{ "width": "100px" }}>UF</th>
                                        <th style={{ "width": "100px" }}>Status</th>
                                        <th style={{ "width": "100px" }}>Pagamento</th>
                                        <th style={{ "width": "100px" }}>Valor</th>
                                        <th style={{ "width": "100px" }}>Cadastrado em</th>
                                        <th style={{ "width": "100px" }}>Data Fim</th>
                                        <th style={{ "width": "100px" }}>ID Desconto</th>
                                        <th style={{ "width": "100px" }}>Usuário</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {


                                        anuncios != '' && anuncios.map((item) => {
                                            console.log("map", anuncios)
                                            console.log("ids", ids)

                                            return (
                                                <tr key={item.idDesconto} id={item.idDesconto} onClick={selecaoLinha}>
                                                    <td>
                                                        <input type="checkbox" className="chkChildren" value="570620" />
                                                        570620
                                                    </td>
                                                    <td>{item.codPA || 0}</td>
                                                    <td>{item.desconto}</td>
                                                    <td>{item.descCPFCNPJ}</td>
                                                    <td>{item.descAnuncio}</td>
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

export default Espacos;
