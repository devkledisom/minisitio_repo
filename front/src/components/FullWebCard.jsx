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
import TemplateModalPromo from "../components/Modal/TemplateModalPromo";


function FullWebCard(props) {
    const { result, setResult } = useBusca();

    //params
    const [searchParams] = useSearchParams();
    //const idParam = searchParams.get('id');
    const { nomeAnuncio, codAnuncio } = useParams();

    useEffect(() => {

        async function buscarAnuncio() {
            const request = await fetch(`${masterPath.url}/anuncio/${codAnuncio}`).then((x) => x.json());
            //console.log(request[0]);
            //console.log(result);
            props.setCodCaderno(request[0].codCaderno);
            props.setCodUf(request[0].codUf);
            setResult(request[0]);
            //console.log(request[0])
        }

        buscarAnuncio();

        window.scrollTo(0, 0);

    }, []);

    const fullUrl = window.location.href;

    const promoChange = (param) => {

        if (!param) return false;

        if (param.includes("http")) {
            return true;
        } else {
            return false;
        }
    };

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
                                    {
                                        promoChange(result.linkPromo) && <a href={result.linkPromo}><img src="../assets/img/link_promocao.png" alt="icone" width={60} /></a>
                                    }
                                    {
                                        !promoChange(result.linkPromo) ?
                                            (result.logoPromocao != null && !promoChange(result.linkPromo)) ?
                                                <img src="../assets/img/link_promocao.png" data-bs-toggle="modal"
                                                    data-bs-target="#myModal" alt="icone" width={60} /> :
                                                <img src="../assets/img/link_promocao.png" style={{ filter: "grayscale(1)", webkitFilter: "grayscale(1)" }} alt="icone" width={60} />
                                            : null
                                    }

                                </i>
                            </div>

                        </div>
                        <TemplateModalPromo path={result.logoPromocao} validade={result.promocaoData} />
                        {/* <!-- Trigger the modal with a button --> */}
                        {/*                        <button
                            type="button"
                            class="btn btn-info btn-lg"
                            data-bs-toggle="modal"
                            data-bs-target="#myModal">
                                Open Modal
                        </button> */}

                        {/*  <!-- Modal --> */}
                        <div class="modal fade" id="myModal" role="dialog">
                            <div class="modal-dialog">

                                {/*     <!-- Modal content--> */}
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                                        <h4 class="modal-title">Modal Header</h4>
                                    </div>
                                    <div class="modal-body">
                                        <p>Some text in the modal.</p>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div className='border-cinza mb-4'>
                            <h2 className='titulo-cinza'>
                                CASHBACK
                            </h2>
                            <i className='link-cinza'>
                                <img src="../assets/img/teste/cashback.jpg" style={{ filter: "grayscale(1)", webkitFilter: "grayscale(1)" }} alt="" width={60} />
                            </i>
                        </div>
                        <div className='border-cinza mb-4'>
                            <h2 className='titulo-cinza'>
                                PARCEIRO
                            </h2>
                            <a href={result.descParceiroLink !== "0" ? result.descParceiroLink : ""} target="_blank" data-toggle="tooltip" title="google-meu-negocio" rel="noopener  noreferrer">
                                <i className='link-cinza'>
                                    {result.descParceiro != null ?
                                    <img src={`${masterPath.url}/files/2/${result.descParceiro}`} width={100} height={66} className='rounded my-1' alt="promoção" /> : <img src="../assets/img/teste/aperto-de-mao.png" width={100} height={66} />  
                                    }
                                    
                                </i>
                            </a>
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
                    <SocialShareButtons url={fullUrl} />
                </div>
                <UserActions path={nomeAnuncio} id={codAnuncio} doc={result.descCPFCNPJ} url={fullUrl} data={result} />
            </div>
        </div>
    );
}

export default FullWebCard;
