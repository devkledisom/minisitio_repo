// components/OutroComponente.js
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../assets/css/users.css';
import 'font-awesome/css/font-awesome.min.css';
import { masterPath } from '../../config/config';


//componente
import Header from "./Header";
import Pagination from '../components/Pagination';
import Spinner from '../../components/Spinner';

const Cadernos = () => {
    const [estados, setEstado] = useState([]);
    const [cidade, setCidade] = useState([]);
    const [paginasTotal, setPaginas] = useState();
    const [selectId, setSelectId] = useState();
    const [showSpinner, setShowSpinner] = useState(false);

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
            //console.log(res.message);
        })
    },[param]);    

    function codEstado(cod) {
        let teste = estados.find((uf) => uf.id_uf == cod);
        return teste;
    }; 

    
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
                            <button type="button" className="btn btn-info custom-button mx-2 text-light">Editar</button>
                            <button type="button" className="btn btn-danger custom-button text-light">Apagar</button>
                        </div>
                        <div className="span6 col-md-6">
                            <div className="pull-right d-flex justify-content-center align-items-center">
                                <input id="buscar" type="text" placeholder="Buscar" />
                                <button id="btnBuscar" className="" type="button">
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
                                            
                                             <tr onClick={selecaoLinha}>
                                                   <td key={item.id_uf}>{codEstado(item.codUf).sigla_uf}</td>
                                                   <td key={item.id_uf}>{item.nomeCaderno}</td>
                                               </tr>
                                        ))}
                                 

                                </tbody>
                            </table>
                        </div>

                    </div>
                    <Pagination totalPages={paginasTotal} table={"cadernos"}/>
                    

                </article>
                <p className='w-100 text-center'>© MINISITIO</p>
            </section>
         {/*    <footer className='w-100' style={{ position: "absolute", bottom: "0px" }}>
                <p className='w-100 text-center'>© MINISITIO</p>
            </footer> */}
        </div>
    );
}

export default Cadernos;
