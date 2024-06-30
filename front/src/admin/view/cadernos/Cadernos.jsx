// components/OutroComponente.js
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../assets/css/users.css';
import 'font-awesome/css/font-awesome.min.css';
import { masterPath } from '../../../config/config';


//componente
import Header from "../Header";
import Pagination from '../../components/Pagination';
import Spinner from '../../../components/Spinner';

const Cadernos = () => {
    const [estados, setEstado] = useState([]);
    const [cidade, setCidade] = useState([]);
    const [paginasTotal, setPaginas] = useState();
    const [selectId, setSelectId] = useState();
    const [showSpinner, setShowSpinner] = useState(false);
    const [totalRegistro, setTotalRegistro] = useState();

    const location = useLocation();
    const navigator = useNavigate();


    const getParam = new URLSearchParams(location.search);

    const param = getParam.get('page') ? getParam.get('page') : 1;


    useEffect(() => {
        setShowSpinner(true);
        fetch(`${masterPath.url}/admin/cadernos?page=${param}`)
            .then((x) => x.json())
            .then((res) => {
                setEstado(res.data.estados);
                setCidade(res.message.anuncios);
                setPaginas(res.message.totalPaginas)
                setShowSpinner(false);
                setTotalRegistro(res.message.anuncios.length);
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
        console.log(event.currentTarget.id)

        return;
    };

    function slecionarQuantidadeLinhas(e) {

        setShowSpinner(true);
        fetch(`${masterPath.url}/admin/cadernos?page=${param}&rows=${e.target.value}`)
            .then((x) => x.json())
            .then((res) => {
                //setEstado(res.data.estados);
                setCidade(res.message.anuncios);
                setPaginas(res.message.totalPaginas)
                setShowSpinner(false);
                setTotalRegistro(res.message.anuncios.length);

                console.log(res.message.anuncios.length);
                //console.log(res.message);
            })
    };

    function buscarRegistro() {
        setShowSpinner(true);
        const campoPesquisa = document.getElementById('buscar').value;
        fetch(`${masterPath.url}/admin/cadernos/buscar/?search=${campoPesquisa}`)
            .then((x) => x.json())
            .then((res) => {
                if (res.success) {
                    setShowSpinner(false);
                    alert("Encontrado " + res.message.registros.length + " registros");
                    setCidade(res.message.registros);
                    setPaginas(res.message.totalPaginas);
                } else {
                    setShowSpinner(false);
                    alert("registro não encontrado na base de dados");
                }

            })
    };

    function apagarCaderno() {
        setShowSpinner(true);
        fetch(`${masterPath.url}/admin/cadernos/delete/${selectId}`, {
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


    const style = {
        position: "fixed",
        zIndex: "999"
    }


    return (
        <div className="Cadernos">
            <header style={style} className='w-100'>
                <Header />
            </header>
            <section className="pt-5">

                {showSpinner && <Spinner />}

                <h1 className="pt-4 px-4">Cadernos</h1>
                <div className="container-fluid py-4 px-4">
                    <div className="row margin-bottom-10">
                        <div className="span6 col-md-6">
                            <button type="button" className="btn custom-button" onClick={() => navigator('/cadernos/cadastro')}>Adicionar</button>
                            <button type="button" className="btn btn-info custom-button mx-2 text-light" onClick={() => navigator(`/cadernos/editar?id=${selectId}`)}>Editar</button>
                            <button type="button" className="btn btn-danger custom-button text-light" onClick={apagarCaderno}>Apagar</button>
                            <select title="selecionarLinhas" name="selecionarLinhas" id="selecionarLinhas"
                                className="btn btn-success custom-button text-light mx-2"
                                onChange={slecionarQuantidadeLinhas}>
                                <option value="10">Ver 10 registros</option>
                                <option value="50">Ver 50 registros</option>
                                <option value="100">Ver 100 registros</option>
                                <option value="5630">Ver todos registros</option>
                            </select>
                        </div>
                        <div className="span6 col-md-6">
                            <div className="pull-right d-flex justify-content-center align-items-center">
                                <input id="buscar" type="text" placeholder="Buscar por UF ou Caderno" />
                                <button id="btnBuscar" className="" type="button" onClick={buscarRegistro}>
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
                                        <th>UF</th>
                                        <th>CADERNO</th>

                                    </tr>
                                </thead>
                                <tbody>

                                    {cidade.map((item) => (

                                        <tr onClick={selecaoLinha} key={item.id_uf} id={item.codCaderno}>
                                            <td key={item.id_uf}>{item.UF}</td>
                                            <td key={item.id_uf}>{item.nomeCaderno}</td>
                                        </tr>
                                    ))}


                                </tbody>
                            </table>
                        </div>

                    </div>
                    <Pagination totalPages={paginasTotal} table={"cadernos"} />


                </article>
                <p className='w-100 text-center'>© MINISITIO</p>
            </section>
        </div>
    );
}

export default Cadernos;
