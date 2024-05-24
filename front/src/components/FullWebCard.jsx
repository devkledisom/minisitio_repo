import React from 'react';

import '../assets/css/main.css';
import '../assets/css/default.css';
import '../assets/css/caderno.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
/* import 'font-awesome/css/font-awesome.min.css'; */

import { useBusca } from '../context/BuscaContext';

import Tooltip from './Tooltip';

import { BsShareFill, BsFillSendFill, BsFacebook, BsInstagram, BsTwitter, BsYoutube, BsWhatsapp, BsSkype, BsHeadset } from "react-icons/bs";
import WebcardThumb from './WebcardThumb';
import Metadados from './Metadados';
import ContactForm from './ContactForm';
import MapContainer from './MapContainer';
import UserActions from './UserActions';

function FullWebCard() {
    const { result, setResult } = useBusca();


    //console.log(result)

    return (
        <div className="FullWebCard">
            <div className="container">

                {/* teste row */}
                <div className="row p-3">
                    <section className="col-md-6">
                        <h2 className='titulo-cinza'>
                            {result.descAnuncio}
                        </h2>
                        <div>
                            <WebcardThumb codImg={result.descImagem}/>
                        </div>
                        <div>
                            <Metadados data={result} />
                        </div>
                        <div className="mt-3">
                            <MapContainer />
                        </div>
                    </section>
                    <section className="col-md-6">
                        <div className='border-cinza mb-4'>
                            <h2 className='titulo-cinza'>
                                <i className="fa fa-certificate mx-2"></i>
                                Certificado Profissional
                            </h2>
                            <div className='container'>
                                <div className="row">
                                    <div className='col-md-4'>Logo</div>
                                    <div className='col-md-4'>Texto</div>
                                    <div className='col-md-4'>
                                        <i className=' link-cinza'>
                                            <img src="../assets/img/teste/diploma.png" alt="" height={64} />
                                        </i>
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
                                <a href="javacript:;" className="btn proximo link-cinza d-flex justify-content-center align-items-center w-50">Compre agora</a>
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
                        </div>
                        <div>

                        </div>


                    </section>

                </div>

                <div className="row">
                    <UserActions />
                </div>
            </div>
        </div>
    );
}

export default FullWebCard;
