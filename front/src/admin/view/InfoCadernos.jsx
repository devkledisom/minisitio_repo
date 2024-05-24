// components/OutroComponente.js
import React from 'react';
import '../assets/css/users.css';
import 'font-awesome/css/font-awesome.min.css';


//componente
import Header from "./Header"

const InfoCadernos = () => {
    return (
        <div className="InfoCadernos">
            <header>
                <Header />
            </header>
            <section>

                <h1 className="pt-4 px-4">Usuários</h1>
                <div className="container-fluid py-4 px-4">
                    <div className="row margin-bottom-10">
                        <div className="span6 col-md-6">
                            {/*  <button type="button" className="btn custom-button">Adicionar</button> */}
                            <button type="button" className="btn btn-info custom-button mx-2 text-light">Gerenciar</button>
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
                                        <th>Caderno</th>
                                        <th>Tipo</th>
                                        <th>Cadastrado em</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Distrito Federal</td>
                                        <td>ÁGUAS CLARAS</td>
                                        <td>Administração Regional/Prefeitura</td>
                                        <td>20/06/2013</td>
                                    </tr>

                                </tbody>
                            </table>
                        </div>

                    </div>
                    <div className='container-fluid'>
                        <div className="row px-4">
                            <ul className="pagination p-0 d-flex justify-content-end">
                                <li className="page-item"><a className="page-link" href="#">Previous</a></li>
                                <li className="page-item"><a className="page-link" href="#">1</a></li>
                                <li className="page-item"><a className="page-link" href="#">2</a></li>
                                <li className="page-item"><a className="page-link" href="#">3</a></li>
                                <li className="page-item"><a className="page-link" href="#">Next</a></li>
                            </ul>
                        </div>
                    </div>

                </article>

            </section>
            <footer className='w-100' style={{ position: "absolute", bottom: "0px" }}>
                <p className='w-100 text-center'>© MINISITIO</p>
            </footer>
        </div>
    );
}

export default InfoCadernos;
