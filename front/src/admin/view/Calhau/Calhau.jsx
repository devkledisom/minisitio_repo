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

const Calhau = () => {

    const [paginasTotal, setPaginas] = useState();
    const [selectId, setSelectId] = useState();
    const [calhaus, setCalhaus] = useState([]);
    const [showSpinner, setShowSpinner] = useState(true);

    const location = useLocation();
    const navigator = useNavigate();


    const getParam = new URLSearchParams(location.search);

    const param = getParam.get('page') ? getParam.get('page') : 1;


    useEffect(() => {
        fetch(`${masterPath.url}/admin/calhau/read?page=${param}`)
            .then((x) => x.json())
            .then((res) => {
                setCalhaus(res.message.frases)
                setPaginas(res.message.totalPaginas)
                setShowSpinner(false);
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
        fetch(`${masterPath.url}/admin/calhau/delete/${selectId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "authorization": 'Bearer ' + sessionStorage.getItem('userTokenAccess')
            },
        })
            .then((x) => x.json())
            .then((res) => {
                setShowSpinner(true);
                if (res.success) {
                    fetch(`${masterPath.url}/admin/calhau/read?page=${param}`)
                        .then((x) => x.json())
                        .then((res) => {
                            setCalhaus(res.message.frases)
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
                    console.log(res)
                    setCalhaus(res.message);
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

    const formatdata = (param) => {
        let data = param.split("T")[0];
        let arrData = data.split("-");
        return `${arrData[2]}/${arrData[1]}/${arrData[0]}`
    }

    return (
        <div className="PIN">
            <header style={style} className='w-100'>
                <Header />
            </header>
            <section className="pt-5">
                {showSpinner && <Spinner />}

                <h1 className="pt-4 px-4">CONFIGURAÇÃO DO CALHAU</h1>
                <div className="container-fluid py-4 px-4">
                    <div className="row margin-bottom-10">
                        <div className="span6 col-md-6">
                            <button type="button" className="btn custom-button" onClick={() => navigator('/admin/calhau/cadastro')}>Adicionar</button>
                          {/*  <button type="button" className="btn btn-info custom-button mx-2 text-light" onClick={() => navigator(`/admin/pin/editar?id=${selectId}`)}>Editar</button> */}
                            <button type="button" className="btn btn-danger custom-button text-light mx-2" onClick={apagarUser}>Apagar</button>
                        </div>
                    </div>
                </div>

                <article>
                    <div className="container-fluid">
                        <div className='row px-4'>
                            <table className="table table-bordered table-striped table-hover">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>FRASE</th>
                                        <th>DATA DE CRIAÇÃO</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        calhaus != '' && calhaus.map((item) => (
                                            <tr key={item.id} id={item.id} onClick={selecaoLinha}>
                                                <td>{item.id}</td>
                                                <td>{item.frase}</td>
                                                <td>{formatdata(item.createdAt)}</td>
                                            </tr>

                                        ))
                                    }

                                </tbody>
                            </table>
                        </div>
                    </div>
                   {/*  <Pagination totalPages={paginasTotal} table={"pin"} /> */}

                </article>
                <p className='w-100 text-center'>© MINISITIO - {version.version}</p>
            </section>
            {/*     <footer className='w-100' style={{ position: "absolute", bottom: "0px" }}>
                <p className='w-100 text-center'>© MINISITIO</p>
            </footer> */}
        </div>
    );
}

export default Calhau;
