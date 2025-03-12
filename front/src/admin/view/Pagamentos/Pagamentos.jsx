// components/OutroComponente.js
import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
//import '../assets/css/users.css';
import 'font-awesome/css/font-awesome.min.css';
import { masterPath } from '../../../config/config';


//componente
import Header from "../Header";
import Pagination from '../../components/Pagination';
import Spinner from '../../../components/Spinner';

const Pagamentos = () => {

    const [paginas, setPaginas] = useState({});
    const [selectId, setSelectId] = useState();
    const [pagamentos, setPagamentos] = useState([]);
    const [showSpinner, setShowSpinner] = useState(true);

    const location = useLocation();
    const navigator = useNavigate();

    //REFS
    const statusColor = useRef(null);


    const getParam = new URLSearchParams(location.search);

    const param = getParam.get('page') ? getParam.get('page') : 1;


    useEffect(() => {
        fetch(`${masterPath.url}/admin/pagamentos/read?page=${param}`)
            .then((x) => x.json())
            .then((res) => {
                //setCidade(res.message.anuncios);
                setPagamentos(res.data)
                setPaginas(res)
                setShowSpinner(false);

                /*  const statusColorsMap = res.data.forEach(item => {
                     console.log(item)
                     if(item.status === "cancelled") {
                         document.getElementById(item.id).childNodes[3].style.backgroundColor = "red"
                     }
                 })  */

            })


    }, [param]);

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
        fetch(`${masterPath.url}/admin/atividade/delete/${selectId}`, {
            method: "DELETE"
        })
            .then((x) => x.json())
            .then((res) => {
                setShowSpinner(true);
                if (res.success) {
                    fetch(`${masterPath.url}/admin/atividades/read?page=${param}`)
                        .then((x) => x.json())
                        .then((res) => {
                            //setCidade(res.message.anuncios);
                            /*     setPagamentos(res.message.atividades)
                                setPaginas(res.message.totalPaginas)
                                setShowSpinner(false); */
                            //console.log(res.message);
                        })
                }

            })
    };

    function buscarUserId() {
        setShowSpinner(true);
        const campoPesquisa = document.getElementById('buscar');

        fetch(`${masterPath.url}/admin/atividade?nome=${campoPesquisa.value}`)
            .then((x) => x.json())
            .then((res) => {
                if (res.success) {
                    setPagamentos(res.message);
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

    const selecionarCor = (status) => {
        switch (status) {
            case "cancelled":
                return "red";
            case "approved":
                return "lime";
            case "pending":
                return "gold";
        }
    }


    return (
        <div className="Atividades">
            <header style={style} className='w-100'>
                <Header />
            </header>
            <section className="pt-5">
                {showSpinner && <Spinner />}

                <h1 className="pt-4 px-4">Pagamentos</h1>
                <div className="container-fluid py-4 px-4">
                    {/*  <div className="row margin-bottom-10">
                        <div className="span6 col-md-6">
                            <button type="button" className="btn custom-button" onClick={() => navigator('/atividades/cadastro')}>Adicionar</button>
                            <button type="button" className="btn btn-info custom-button mx-2 text-light" onClick={() => navigator(`/atividades/editar?id=${selectId}`)}>Editar</button>
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
                    </div> */}
                </div>

                <article>
                    <div className="container-fluid">
                        <div className='row px-4'>
                            <table className="table table-bordered table-striped table-hover">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>CLIENTE</th>
                                        <th>VALOR</th>
                                        <th>STATUS</th>
                                        <th>DATA</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        pagamentos != '' && pagamentos.map((item) => (
                                            <tr key={item.id} id={item.id} onClick={selecaoLinha}>
                                                <td>{item.id_mp}</td>
                                                <td>{item.cliente}</td>
                                                <td>{item.valor}</td>
                                                <td style={{ backgroundColor: selecionarCor(item.status) }}>{item.status}</td>
                                                <td>{item.data.split("T")[0]}</td>
                                            </tr>

                                        ))
                                    }

                                </tbody>
                            </table>
                        </div>
                    </div>
                    <Pagination totalPages={paginas.totalPaginas} paginaAtual={paginas.paginaAtual} totalItem={paginas.totalItem} table={"pagamentos"} />

                </article>
                <p className='w-100 text-center'>© MINISITIO</p>
            </section>
            {/*     <footer className='w-100' style={{ position: "absolute", bottom: "0px" }}>
                <p className='w-100 text-center'>© MINISITIO</p>
            </footer> */}
        </div>
    );
}

export default Pagamentos;
