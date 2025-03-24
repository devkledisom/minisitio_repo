import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { masterPath } from '../config/config';

import '../assets/css/navegacao.css'

import { Navbar, Nav, NavDropdown, Container } from 'bootstrap';
import Breadcrumb from '../plugins/Breadcrumb';

function Navegacao({anuncio}) {

    const [migalhas, setMigalhas] = useState([]);
    const [searchParams] = useSearchParams();
    const idParam = searchParams.get('id');
    const { codAnuncio } = useParams();



    async function buscarAnuncio() {
        const request = await fetch(`${masterPath.url}/anuncio/${codAnuncio}`).then((x) => x.json());
        const breadcrumbItems = [
            { label: request[0].nomeCaderno },
            { label: request[0].nomeAtividade, /* url: '/categoria' */ },
            { label: request[0].descAnuncio, /* url: '/categoria/subcategoria' */ },
        ];

        setMigalhas(breadcrumbItems);
        return;
    }

    useEffect(() => {
        buscarAnuncio();
    }, []);




    const navigate = useNavigate();

    const goBack = () => {
        window.history.back();
        //navigate(-1);
    }

    return (
        <div className='Navegacao'>
            <div className='container py-3'>
                <div className="row px-3  style-navegacao">
                   {/*  <ul className="bar-navigator col-md-6">
                        <li>
                            <a href="/local/sao-paulo-zona-central_35">
                            </a>
                            <i className="fa fa-angle-right px-2"></i>
                        </li>
                        <li>
                            <a href="/local/sao-paulo-zona-central/chaveiro-sniper_504183">
                            </a>
                        </li>
                    </ul> */}
                    <Breadcrumb items={migalhas} />
                    <div className='col-md-2 col-3 d-flex justify-content-end align-items-center'>
                        <button className='cinza px-3' onClick={goBack}>
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
