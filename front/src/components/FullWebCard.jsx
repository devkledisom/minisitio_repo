import React, { useEffect, useState } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';

import '../assets/css/main.css';
import '../assets/css/default.css';
import '../assets/css/caderno.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import { masterPath } from '../config/config';

import { useBusca } from '../context/BuscaContext';
import Loading from './Loading';

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
    const [resultLocal, setResultLocal] = useState([]);
    const [showState, setShowState] = useState(false);
    const [pageLoad, setPageLoad] = useState(false);
    const [apiReady, setApiReady] = useState(false);
    const [apiProgress, setApiProgress] = useState(0);

    //params
    const [searchParams] = useSearchParams();
    const promocaoAtiva = searchParams.get('promocao');
    const { nomeAnuncio, codAnuncio } = useParams();

    useEffect(() => {

        async function buscarAnuncio() {
            setPageLoad(true);
            const request = await fetch(`${masterPath.url}/anuncio/${codAnuncio}`).then((x) => x.json());
            //console.log(request[0]);
            //console.log(result);
            props.setCodCaderno(request[0].codCaderno);
            props.setCodUf(request[0].codUf);
            //setResult(request[0]);
            setResultLocal(request[0]);

            //console.log(request[0])
            setApiReady(true);
            setApiProgress(100);
            setPageLoad(false);

            if (promocaoAtiva === "ativa") {
                // document.querySelector('.promoModal').click();
                setShowState(true)

                /*      const modalElement = document.getElementById('myModal');
                     const modalInstance = new Modal(modalElement);
                     modalInstance.show(); */

            }

        }



        buscarAnuncio();

        //window.scrollTo(0, 0);

    }, []);

    const fullUrl = window.location.href;

    const promoChange = (param) => {

        if (!param.linkPromo) return false;

        if (!param.promoc) return false;

        if (param.linkPromo.includes("http")) {
            return true;
        } else {
            return false;
        }
    };

    function cashbackCondicoes(logo, link) {
        if (!logo && !link) {
            return "condicao1";
        }

        if (logo && link) {
            return "condicao2";
        }

        if (!logo && link) {
            return "condicao3";
        }
    };

    const verificarLogoPromo = (param) => {
        if (!param.promoc) return false;


        if (param.promoc.banner != null && param.promoc.banner != "" && param.promoc.banner != "0") {
            return true;
        }

    };


    return (
        <div className="FullWebCard">
            {pageLoad && <Loading apiReady={apiReady} apiProgress={apiProgress} />}
            {!pageLoad &&
                <div className="container">
                    {/* teste row */}

                    <h1>PERFIL no espaço MINISITIO</h1>
                    <div className="row p-3 full-title">
                        <section className="col-md-6 coluna-1">
                            <h2 className='titulo-cinza'>
                                {resultLocal.descAnuncio}
                            </h2>
                            <div>
                                <WebcardThumb codImg={resultLocal.descImagem} data={resultLocal} />
                            </div>
                            <div>
                                <Metadados data={resultLocal} />
                            </div>
                            <div className="mt-3">
                                <MapContainer cep={resultLocal.descCEP} address={resultLocal.descEndereco} />
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
                                            {(resultLocal.certificado_logo != null && resultLocal.certificado_logo != "") &&
                                                <img src={`${masterPath.url}/files/logoCertificado/${resultLocal.certificado_logo}`} className='rounded' height="50" alt="logo" />
                                            }
                                            {(resultLocal.certificado_logo == "" || resultLocal.certificado_logo == null) &&
                                                <p>LOGO</p>
                                            }

                                        </div>
                                        {/* resultLocal.certificado_link */}
                                        {/* console.log(resultLocal.certificado_link, resultLocal.certificado_imagem) */}
                                        <div className='col-md-4'>{resultLocal.certificado_texto ? resultLocal.certificado_texto : "TEXTO"}</div>
                                        <div className='col-md-4'>
                                            {(resultLocal.certificado_link || resultLocal.certificado_imagem) && (
                                                <a href={resultLocal.certificado_imagem != '' ? `${masterPath.url}/files/imgCertificado/${resultLocal.certificado_imagem}` : resultLocal.certificado_link} target="_blank" rel="noopener noreferrer">
                                                    <i className="link-cinza flex justify-center">
                                                        <img
                                                            src={
                                                                resultLocal.certificado_imagem
                                                                    ? `${masterPath.url}/files/imgCertificado/${resultLocal.certificado_imagem}`
                                                                    : "../assets/img/teste/diploma.png"
                                                            }
                                                            alt="Certificado"
                                                            style={{ height: "64px" }}
                                                            className='rounded'
                                                        />
                                                    </i>
                                                </a>
                                            )}

                                            {/*  {(!resultLocal.certificado_link && resultLocal.certificado_imagem) && (
                                            <a href={`${masterPath.url}/files/2/${resultLocal.certificado_imagem}`} target="_blank" rel="noopener noreferrer">
                                                <i className="link-cinza">
                                                    <img
                                                        src={
                                                            resultLocal.certificado_imagem
                                                                ? `${masterPath.url}/files/2/${resultLocal.certificado_imagem}`
                                                                : "../assets/img/teste/diploma.png"
                                                        }
                                                        alt="Certificado"
                                                        height={64}
                                                        className='rounded'
                                                    />
                                                </i>
                                            </a>
                                        )} */}

                                            {!resultLocal.certificado_link && resultLocal.certificado_imagem && (
                                                <i className="link-cinza">
                                                    <img
                                                        src={`${masterPath.url}/files/imgCertificado/${resultLocal.certificado_imagem}`}
                                                        alt="Certificado"
                                                        height={64}
                                                        className='rounded'
                                                    />
                                                </i>
                                            )}

                                            {!resultLocal.certificado_link && !resultLocal.certificado_imagem && (
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
                                    {resultLocal.link_comprar != "" &&
                                        <a href={resultLocal.link_comprar}
                                            className="btn proximo link-cinza d-flex justify-content-center align-items-center w-50"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >Compre agora</a>
                                    }
                                    {resultLocal.link_comprar == "" &&
                                        <a href="#" className="btn proximo link-cinza d-flex justify-content-center align-items-center w-50" style={{ filter: "grayscale(1)", webkitFilter: "grayscale(1)" }}>Compre agora</a>
                                    }

                                </div>
                            </div>
                            <div className='border-cinza mb-4'>
                                <h2 className='titulo-cinza'>
                                    PROMOÇÃO
                                </h2>
                                <div className='py-3'>
                                    <i className='link-cinza flex justify-center'>
                                        {
                                            promoChange(resultLocal) && <a href={resultLocal.linkPromo}><img src="../assets/img/link_promocao.png" alt="icone" width={60} /></a>
                                        }
                                        {
                                            !promoChange(resultLocal) ?
                                                (verificarLogoPromo(resultLocal) && !promoChange(resultLocal)) ?
                                                    <img src="../assets/img/link_promocao.png" className="promoModal"
                                                        alt="icone" width={60} onClick={() => setShowState(true)} /> :
                                                    <img src="../assets/img/link_promocao.png" className="promoModal" style={{ filter: "grayscale(1)", webkitFilter: "grayscale(1)" }} alt="icone" width={60} />
                                                : null
                                        }
                                        {/*    <img src="../assets/img/link_promocao.png" className="promoModal" data-bs-toggle="modal"
                                                    data-bs-target="#myModal" alt="icone" width={60} onClick={() => setShowState(true)} /> */}
                                    </i>
                                </div>

                            </div>
                            <TemplateModalPromo showState={showState} setShowState={setShowState} path={resultLocal.logoPromocao} validade={resultLocal.promocaoData} />
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

                                {cashbackCondicoes(resultLocal.cashback_logo, resultLocal.cashback_link) === "condicao1" &&
                                    <i className='link-cinza flex justify-center'>
                                        <img src="../assets/img/teste/cashback.jpg" style={{ filter: "grayscale(1)", webkitFilter: "grayscale(1)" }} className='my-1' alt="cashback" width={80} />
                                    </i>
                                }

                                {cashbackCondicoes(resultLocal.cashback_logo, resultLocal.cashback_link) === "condicao2" &&
                                    <a href={resultLocal.cashback_link} target="_blank" rel="noopener  noreferrer">
                                        <i className='link-cinza flex justify-center'>
                                            <img src={`${masterPath.url}/files/logoCashBack/${resultLocal.cashback_logo}`} className='rounded my-1' alt="cashback" />
                                        </i>
                                    </a>

                                }

                                {cashbackCondicoes(resultLocal.cashback_logo, resultLocal.cashback_link) === "condicao3" &&
                                    <a href={resultLocal.cashback_link} target="_blank" rel="noopener  noreferrer">
                                        <i className='link-cinza flex justify-center'>
                                            <img src="../assets/img/teste/cashback.jpg" className='my-1' alt="cashback" width={80} />
                                        </i>
                                    </a>
                                }

                            </div>
                            <div className='border-cinza mb-4'>
                                <h2 className='titulo-cinza'>
                                    PARCEIRO
                                </h2>
                                <a href={resultLocal.descParceiroLink !== "0" ? resultLocal.descParceiroLink : ""} target="_blank" data-toggle="tooltip" title="parceiro" rel="noopener  noreferrer">
                                    <i className='link-cinza flex justify-center'>
                                        {resultLocal.descParceiro != null ?
                                            <img src={`${masterPath.url}/files/logoParceiro/${resultLocal.descParceiro}`} width={150} height={58} className='rounded my-1' alt="parceiro" /> : <img src="../assets/img/teste/aperto-de-mao.png" width={100} height={66} />
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
                                <Video link={resultLocal.descYouTube} />
                            </div>
                            <div>

                            </div>
                        </section>
                    </div>

                    <div className="row">
                        {/*  <Socialmidia /> */}
                        {/* <SocialShareButtons url={fullUrl} /> */}
                        {/* <SocialShareButtons url={`${masterPath.url}/portal/share/${codAnuncio}`} /> */}
                    </div>
                    <UserActions path={nomeAnuncio} id={codAnuncio} doc={resultLocal.descCPFCNPJ} url={fullUrl} urlShare={`${masterPath.url}/portal/share/${codAnuncio}`} data={resultLocal} />
                </div>
            }
        </div>
    );
}

export default FullWebCard;
