import React from 'react';

import '../assets/css/navegacao.css'

import { Navbar, Nav, NavDropdown, Container } from 'bootstrap';

function Navegacao() {
    return (
        <div className='Navegacao'>
            <div className='container py-3'>
                <div className="row px-3  style-navegacao">
                    <ul className="bar-navigator col-md-6">
                        <li>
                            <a href="/local/sao-paulo-zona-central_35">
                                <span className="uppercase">SAO PAULO - ZONA CENTRAL - SP</span>
                            </a>
                            <i className="fa fa-angle-right px-2"></i>
                        </li>
                        <li>
                            <a href="/local/sao-paulo-zona-central/chaveiro-sniper_504183">
                                Chaveiro Sniper
                            </a>
                        </li>
                    </ul>
                    <div className='col-md-6 d-flex justify-content-end align-items-center'>
                        <button className='cinza'>
                            <i className="fa fa-arrow-left"></i>
                            Voltar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Navegacao;
