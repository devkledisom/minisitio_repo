import React, { useEffect, useState } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';

import '../assets/css/main.css';
import '../assets/css/default.css';
import '../assets/css/caderno.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { masterPath } from '../config/config';

import { useBusca } from '../context/BuscaContext';

import Tooltip from './Tooltip';

import { BsShareFill, BsFillSendFill, BsFacebook, BsInstagram, BsTwitter, BsYoutube, BsWhatsapp, BsSkype, BsHeadset } from "react-icons/bs";

//COMPONENTS
import Video from '../components/Video';
import WebcardThumb from './WebcardThumb';
import Metadados from './Metadados';
import ContactForm from './ContactForm';
import MapContainer from './MapContainer';
import UserActions from './UserActions';
import Socialmidia from './Socialmidia';
import SocialShareButtons from './SocialShareButtons';


function FullWebCard(props) {
    const { result, setResult } = useBusca();

    //params
    const [searchParams] = useSearchParams();
    const idParam = searchParams.get('id');
    const { nomeAnuncio } = useParams();

    useEffect(() => {

        async function buscarAnuncio() {
            const request = await fetch(`${masterPath.url}/anuncio/${idParam}`).then((x) => x.json());
            //console.log(request[0]);
            //console.log(result);
            props.setCodCaderno(request[0].codCaderno);
            props.setCodUf(request[0].codUf);
            props.setNmAnuncio(nomeAnuncio);
            setResult(request[0]);
        }

        buscarAnuncio();

        window.scrollTo(0, 0);

    }, []);

    const fullUrl = window.location.href;

    return (
        <div className="FullWebCard">
            <div className="container">
                {/* teste row */}
                <h1>PERFIL no espaço MINISITIO</h1>
                <div className="row p-3 full-title">
                    <section className="col-md-6 coluna-1">
                        <h2 className='titulo-cinza'>
                            {result.descAnuncio}
                        </h2>
                        <div>
                            <WebcardThumb codImg={result.descImagem} data={result} />
                        </div>
                        <div>
                            <Metadados data={result} />
                        </div>
                        <div className="mt-3">
                            <MapContainer cep={result.descCEP} address={result.descEndereco} />
                        </div>
                    </section>
                    <section className="col-md-6 coluna-2">
                        <div className='border-cinza mb-4'>
                            <h2 className='titulo-cinza'>
                                <i className="fa fa-certificate mx-2"></i>
                                Certificado Profissional
                            </h2>
                            <div className='container'>
                                <div className="row">
                                    <div className='col-md-4'>
                                        {(result.certificado_logo != null && result.certificado_logo != "") &&
                                            <img src={`${masterPath.url}/files/2/${result.certificado_logo}`} className='rounded' height="50" alt="logo" />
                                        }
                                        {(result.certificado_logo == "" || result.certificado_logo == null) &&
                                            <p>LOGO</p>
                                        }

                                    </div>
                                    <div className='col-md-4'>{result.certificado_texto ? result.certificado_texto : "TEXTO"}</div>
                                    <div className='col-md-4'>
                                        {result.certificado_link && (
                                            <a href={result.certificado_link} target="_blank" rel="noopener noreferrer">
                                                <i className="link-cinza">
                                                    <img
                                                        src={
                                                            result.certificado_imagem
                                                                ? `${masterPath.url}/files/2/${result.certificado_imagem}`
                                                                : "../assets/img/teste/diploma.png"
                                                        }
                                                        alt="Certificado"
                                                        height={64}
                                                        className='rounded'
                                                    />
                                                </i>
                                            </a>
                                        )}

                                        {!result.certificado_link && result.certificado_imagem && (
                                            <i className="link-cinza">
                                                <img
                                                    src={`${masterPath.url}/files/2/${result.certificado_imagem}`}
                                                    alt="Certificado"
                                                    height={64}
                                                    className='rounded'
                                                />
                                            </i>
                                        )}

                                        {!result.certificado_link && !result.certificado_imagem && (
                                            <i className="link-cinza">
                                                <img
                                                    src="../assets/img/teste/diploma.png"
                                                    alt="Sem certificado"
                                                    height={64}
                                                />
                                            </i>
                                        )}


                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className='border-cinza mb-4'>
                            <h2 className='titulo-cinza'>
                                <i className="fa fa-shopping-cart mx-2"></i>
                                COMPRAR
                            </h2>
                            <div className="text-center btn-comprar">
                                {result.link_comprar != "" &&
                                    <a href={result.link_comprar}
                                        className="btn proximo link-cinza d-flex justify-content-center align-items-center w-50"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >Compre agora</a>
                                }
                                {result.link_comprar == "" &&
                                    <a href="#" className="btn proximo link-cinza d-flex justify-content-center align-items-center w-50">Compre agora</a>
                                }

                            </div>
                        </div>
                        <div className='border-cinza mb-4'>
                            <h2 className='titulo-cinza'>
                                PROMOÇÃO
                            </h2>
                            <div className='py-3'>
                                <i className='link-cinza'>
                                    <img src="../assets/img/link_promocao.png" alt="" width={60} />
                                </i>
                            </div>

                        </div>
                        <div className='border-cinza mb-4'>
                            <h2 className='titulo-cinza'>
                                CASHBACK
                            </h2>
                            <i className='link-cinza'>
                                <img src="../assets/img/teste/cashback.jpg" alt="" width={60} />
                            </i>
                        </div>
                        <div className='mb-4'>
                            <h2 className='titulo-cinza'>
                                <i className="fa fa-envelope mx-2"></i>
                                Fale com o dono
                            </h2>
                            <ContactForm />
                            <Video link={result.descYouTube} />
                        </div>
                        <div>

                        </div>
                    </section>
                </div>

                <div className="row">
                   {/*  <Socialmidia /> */}
                    <SocialShareButtons url={window.location.href} />
                </div>
                <UserActions path={nomeAnuncio} id={idParam} doc={result.descCPFCNPJ} url={fullUrl} data={result} />
            </div>
        </div>
    );
}

export default FullWebCard;
