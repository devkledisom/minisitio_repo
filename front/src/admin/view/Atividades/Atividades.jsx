// components/OutroComponente.js
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../assets/css/users.css';
import 'font-awesome/css/font-awesome.min.css';
import { masterPath, version } from '../../../config/config';


//componente
import Header from "../Header";
import Pagination from '../../components/Pagination';
import Spinner from '../../../components/Spinner';

const Atividades = () => {

    const [paginasTotal, setPaginas] = useState();
    const [paginaAtual, setPaginaAtual] = useState();
    const [totalRegistro, setPaginaItem] = useState();

    const [selectId, setSelectId] = useState();
    const [atividades, setAtividades] = useState([]);
    const [showSpinner, setShowSpinner] = useState(true);

    const location = useLocation();
    const navigator = useNavigate();


    const getParam = new URLSearchParams(location.search);

    const param = getParam.get('page') ? getParam.get('page') : 1;

    const tokenAuth = sessionStorage.getItem('userTokenAccess');

    useEffect(() => {
        fetch(`${masterPath.url}/admin/atividades/read?page=${param}`)
            .then((x) => x.json())
            .then((res) => {
                //setCidade(res.message.anuncios);
                setAtividades(res.message.atividades);
                setPaginas(res.message.totalPaginas);
                setPaginaAtual(res.message.paginaAtual);
                setPaginaItem(res.message.totalItem);
                setShowSpinner(false);
                //console.log(res.message);
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
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "authorization": 'Bearer ' + tokenAuth
            },
        })
            .then((x) => x.json())
            .then((res) => {
                setShowSpinner(true);
                if (res.success) {
                    fetch(`${masterPath.url}/admin/atividades/read?page=${param}`)
                        .then((x) => x.json())
                        .then((res) => {
                            //setCidade(res.message.anuncios);
                            setAtividades(res.message.atividades)
                            setPaginas(res.message.totalPaginas)
                            setShowSpinner(false);
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
                    setAtividades(res.message);
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

    function exportExcell() {
        setShowSpinner(true);
        fetch(`${masterPath.url}/admin/export/atividades`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(atividades)
        })
            .then(x => x.json())
            .then(res => {
                if (res.success) {
                    setTimeout(() => {
                        window.location.href = res.downloadUrl;
                        setShowSpinner(false);
                    }, 2000)

                }
            })
    };

    return (
        <div className="Atividades">
            <header style={style} className='w-100'>
                <Header />
            </header>
            <section className="pt-5">
                {showSpinner && <Spinner />}

                <h1 className="pt-4 px-4">Atividades</h1>
                <div className="container-fluid py-4 px-4">
                    <div className="row margin-bottom-10">
                        <div className="span6 col-md-6">
                            <button type="button" className="btn custom-button" onClick={() => navigator('/admin/atividades/cadastro')}>Adicionar</button>
                            <button type="button" className="btn btn-info custom-button mx-2 text-light" onClick={() => navigator(`/admin/atividades/editar?id=${selectId}`)}>Editar</button>
                            <button type="button" className="btn custom-button" onClick={exportExcell}>Exportar</button>
                            <button type="button" className="btn btn-danger custom-button text-light mx-2" onClick={apagarUser}>Apagar</button>
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
                                        <th>Ativadade-CNAE</th>
                                        <th>Atividade</th>
                                        <th>Tipo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        atividades != '' && atividades.map((item) => (
                                            <tr key={item.id} id={item.id} onClick={selecaoLinha}>
                                                <td>{item.atividade}</td>
                                                <td>{item.nomeAmigavel}</td>
                                                <td>{item.corTitulo}</td>
                                            </tr>

                                        ))
                                    }

                                </tbody>
                            </table>
                        </div>
                    </div>
                    <Pagination totalPages={paginasTotal} paginaAtual={paginaAtual} totalItem={totalRegistro} table={"atividades"} />

                </article>
                <p className='w-100 text-center'>© MINISITIO - {version.version}</p>
            </section>
            {/*     <footer className='w-100' style={{ position: "absolute", bottom: "0px" }}>
                <p className='w-100 text-center'>© MINISITIO</p>
            </footer> */}
        </div>
    );
}

export default Atividades;
