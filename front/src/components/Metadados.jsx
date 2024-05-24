import React from 'react';

import '../assets/css/main.css';
import '../assets/css/default.css';
import '../assets/css/metadados.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
/* import 'font-awesome/css/font-awesome.min.css'; */

import Tooltip from './Tooltip';

import { BsShareFill, BsFillSendFill, BsFacebook, BsInstagram, BsTwitter, BsYoutube, BsWhatsapp, BsSkype, BsHeadset } from "react-icons/bs";


function Metadados(props) {
    return (
        <div className="Metadados">
            <div className="container p-0">
                <div className="anuncio-info">
                    <div className="col-md-12">
                        <i className="fa fa-info"></i>
                        <h4></h4>
                    </div>
                    <div className="col-md-12">
                        <i className="fa fa-map-marker"></i>
                        <h4>{props.data.descEndereco}, 211 - {props.data.descCEP}</h4>
                    </div>
                    <div className="col-md-12">
                        <i className="fa fa-phone"></i>
                        <h4>{props.data.descTelefone} / (11) 96762-4930</h4>
                    </div>
                    <div className="col-md-12">
                        <i className="fa fa-globe"></i>
                        <h4>
                            <a href="" data-toggle="tooltip" title="Site">
                            </a>
                        </h4>
                    </div>
                    <div className="col-md-12 link-cinza">
                        <img src="../assets/img/teste/pix-bc.png" className='logo-pix' />
                        <h4>
                        </h4>
                    </div>
                    <div className="col-md-12 link-cinza">
                        <img src="../assets/img/teste/facebook.png" />
                        <h4>
                            <a href="" data-toggle="tooltip" title="Facebook">
                            </a>
                            {props.data.descFacebook}
                        </h4>
                    </div>
                    <div className="col-md-12 link-cinza">
                        <img src="../assets/img/teste/instagram.png" />
                        <h4>
                            <a href="" data-toggle="tooltip" title="Instagram">
                            </a>
                        </h4>
                    </div>
                    <div className="col-md-12 link-cinza">
                        <img src="../assets/img/teste/twitter.png" />
                        <h4>
                            <a href="" data-toggle="tooltip" title="Twitter">
                            </a>
                        </h4>
                    </div>
                    <div className="col-md-12 link-cinza">
                        <img src="../assets/img/teste/linkedin.png" />
                        <h4>
                            <a href="" data-toggle="tooltip" title="Linkedin">
                            </a>
                        </h4>
                    </div>
                    <div className="col-md-12 ">
                        <img src="../assets/img/teste/whatsapp.png" />
                        <h4>
                            <a href="https://api.whatsapp.com/send?1=pt_BR&amp;phone=5511967624930" target="_blank" data-toggle="tooltip" title="WhatsApp">
                                (11) 96762-4930                                    </a>
                        </h4>
                    </div>
                    <div className="col-md-12 link-cinza">
                        <img src="../assets/img/teste/telegram.png" />
                        <h4>
                            <a href="https://telegram.me/55" target="_blank" data-toggle="tooltip" title="Telegram">
                            </a>
                        </h4>
                    </div>
                    <div className="col-md-12 link-cinza">
                        <img src="../assets/img/teste/skype.png" />
                        <h4>
                            <a href="" target="_blank" data-toggle="tooltip" title="Skype">
                            </a>
                        </h4>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Metadados;
