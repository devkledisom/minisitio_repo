// components/OutroComponente.js
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../assets/css/users.css';
import 'font-awesome/css/font-awesome.min.css';
import { masterPath, version } from '../../../config/config';

//LIBS
import Swal from 'sweetalert2';


//componente
import Header from "../Header";
import Pagination from '../../components/Pagination';
import Spinner from '../../../components/Spinner';

const Cadernos = () => {
    const [estados, setEstado] = useState([]);
    const [cidade, setCidade] = useState([]);
    const [cidadeBusca, setCidadeBusca] = useState({});
    const [paginasTotal, setPaginas] = useState();
    const [paginaAtual, setPaginaAtual] = useState();
    const [selectId, setSelectId] = useState();
    const [showSpinner, setShowSpinner] = useState(false);
    const [totalRegistro, setTotalRegistro] = useState();
    const [exportTodos, setExpotTodos] = useState(false);

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
                setPaginas(res.message.totalPaginas);
                setPaginaAtual(res.message.paginaAtual);
                setShowSpinner(false);
                setTotalRegistro(res.message.totalItem);
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
                //console.log("fsdfsdfasd", )
                if (res.success) {
                    setShowSpinner(false);
                    alert("Encontrado " + res.message.registros.length + " registros");
                    setCidade(res.message.registros);
                    setPaginas(1);
                    setCidadeBusca(res.message.registros);
                    setTotalRegistro(res.message.registros.length);
                    setExpotTodos(true);
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
                    Swal.fire({
                        title: 'sucesso!',
                        text: 'Registro apagado!',
                        icon: 'success',
                        confirmButtonText: 'Confirmar'
                      })
                    document.querySelector(".selecionada").remove();
                }

            })
    };


    const style = {
        position: "fixed",
        zIndex: "999"
    }

    function exportExcell() {

        fetch(`${masterPath.url}/admin/export/cadernos?exportAll=${exportTodos}&limit=5000`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(cidadeBusca)
        })
        .then(x => x.json())
        .then(res => {
            if(res.success) {
                console.log(res);
                window.location.href = res.downloadUrl;
            }
        })
    };


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
                            <button type="button" className="btn custom-button" onClick={() => navigator('/admin/cadernos/cadastro')}>Adicionar</button>
                            <button type="button" className="btn btn-info custom-button mx-2 text-light" onClick={() => navigator(`/admin/cadernos/editar?id=${selectId}`)}>Editar</button>
                            <button type="button" className="btn btn-danger custom-button text-light" onClick={apagarCaderno}>Apagar</button>
                            <select title="selecionarLinhas" name="selecionarLinhas" id="selecionarLinhas"
                                className="btn btn-success custom-button text-light mx-2"
                                onChange={slecionarQuantidadeLinhas}>
                                <option value="10">Ver 10 registros</option>
                                <option value="50">Ver 50 registros</option>
                                <option value="100">Ver 100 registros</option>
                                <option value="5630">Ver todos registros</option>
                            </select>
                            <button type="button" className="btn custom-button" onClick={exportExcell}>Exportar</button>
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
                                        <th>MOSAICO</th>
                                        <th>CEP_INICIAL</th>
                                        <th>CEP_FINAL</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {cidade.map((item) => (

                                        <tr onClick={selecaoLinha} key={item.id_uf} id={item.codCaderno}>
                                            <td key={item.id_uf}>{item.UF}</td>
                                            <td key={item.id_uf}>{item.nomeCaderno}</td>
                                            {item.descImagem != '' ? <td key={item.id_uf}>SIM</td> : <td key={item.id_uf}>NÃO</td>}
                                            <td key={item.id_uf}>{item.cep_inicial}</td>
                                            <td key={item.id_uf}>{item.cep_final}</td>
                                            
                                        </tr>
                                    ))}


                                </tbody>
                            </table>
                        </div>

                    </div>
                    <Pagination totalPages={paginasTotal} paginaAtual={paginaAtual} totalItem={totalRegistro} table={"cadernos"} />


                </article>
                <p className='w-100 text-center'>© MINISITIO - {version.version}</p>
            </section>
        </div>
    );
}

export default Cadernos;
