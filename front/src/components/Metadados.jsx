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
                        <h4>
                        {props.data.descDescricao ? props.data.descDescricao : ""}
                        </h4>
                    </div>
                    <div className="col-md-12">
                        <i className="fa fa-map-marker"></i>
                        <h4>
                            {props.data.descEndereco !== "atualizar" ? props.data.descEndereco : "Endereço da empresa"}, S/N
                            {props.data.descCEP !== "0" ? ` ${props.data.descCEP }`: ""}
                        </h4>
                    </div>
                    <div className="col-md-12">
                        <i className="fa fa-phone"></i>
                        <h4>{props.data.descTelefone !== "atualizar" ? props.data.descTelefone : "(xx) xxxx-xxxx"} / {props.data.descCelular !== "0" ? props.data.descCelular : "(xx) xxxxx-xxxx"}</h4>
                    </div>
                    <div className="col-md-12">
                        <i className="fa fa-globe"></i>
                        <h4>
                            <a href={props.data.descSite !== "0" ? props.data.descSite : ""} data-toggle="tooltip" title="Site" target="_blank" rel="noopener  noreferrer">
                            {props.data.descSite !== "0" ? props.data.descSite : ""}
                            </a>
                        </h4>
                    </div>
                    <div className="col-md-12 link-cinza">
                        <img src="../assets/img/teste/facebook.png" />
                        <h4>
                            <a href={props.data.descFacebook !== "teste" ? props.data.descFacebook : ""} data-toggle="tooltip" title="Facebook" target="_blank" rel="noopener  noreferrer">
                            {props.data.descFacebook !== "teste" ? props.data.descFacebook : ""}
                            </a>
                        </h4>
                    </div>
                    <div className="col-md-12 link-cinza">
                        <img src="../assets/img/teste/instagram.png" />
                        <h4>
                            <a href={props.data.descInsta !== "0" ? props.data.descInsta : ""} data-toggle="tooltip" title="Instagram" target="_blank" rel="noopener  noreferrer">
                            {props.data.descInsta !== "0" ? props.data.descInsta : ""}
                            </a>
                        </h4>
                    </div>
                    <div className="col-md-12 link-cinza">
                        <img src="../assets/img/redes/unnamed.webp" className="rounded" />
                        <h4>
                            <a href={props.data.descTweeter !== "teste" ? props.data.descTweeter : ""} data-toggle="tooltip" title="Twitter" target="_blank" rel="noopener  noreferrer">
                            {props.data.descTweeter !== "teste" ? props.data.descTweeter : ""}
                            </a>
                        </h4>
                    </div>
                    <div className="col-md-12 link-cinza">
                        <img src="../assets/img/teste/linkedin.png" />
                        <h4>
                            <a href= {props.data.descLinkedin !== "0" ? props.data.descLinkedin : ""} data-toggle="tooltip" title="Linkedin" target="_blank" rel="noopener  noreferrer">
                            {props.data.descLinkedin !== "0" ? props.data.descLinkedin : ""}
                            </a>
                        </h4>
                    </div>
                    <div className="col-md-12 ">
                        <img src="../assets/img/teste/whatsapp.png" />
                        <h4>
                            <a href={`https://api.whatsapp.com/send?phone=55${props.data.descWhatsApp}`} target="_blank" data-toggle="tooltip" title="WhatsApp" rel="noopener  noreferrer">
                                {props.data.descWhatsApp !== "0" ? props.data.descWhatsApp : "(xx) xxxxx-xxxx"}
                            </a>
                        </h4>
                    </div>
                    <div className="col-md-12 link-cinza">
                        <img src="../assets/img/teste/telegram.png" />
                        <h4>
                            <a href="https://telegram.me/55" target="_blank" data-toggle="tooltip" title="Telegram" rel="noopener  noreferrer">
                            {props.data.descTelegram !== "0" ? props.data.descTelegram : ""}
                            </a>
                        </h4>
                    </div>
                    <div className="col-md-12 link-cinza">
                        <img src="../assets/img/teste/icons8-meu-negócio-48.png" />
                        <h4>
                            <a href={props.data.descSkype !== "0" ? props.data.descSkype : ""} target="_blank" data-toggle="tooltip" title="google-meu-negocio" rel="noopener  noreferrer">
                            {props.data.descSkype !== "0" ? props.data.descSkype : ""}
                            </a>
                        </h4>
                    </div>
                    <div className="col-md-12 link-cinza">
                        <img src="../assets/img/teste/pix-bc.png" className='logo-pix' />
                        <h4>
                        {props.data.descChavePix}
                        </h4>
                    </div>
                    <div className="col-md-12 link-cinza">
                        {console.log(props.data.descAndroid)}
                        {(props.data.descAndroid != "0" && props.data.descAndroid != "") &&
                        <a href={props.data.descAndroid !== "0" ? props.data.descAndroid : ""} target="_blank" data-toggle="tooltip" title="android" rel="noopener  noreferrer">
                             <img src="../assets/img/icons/android.png" width={200} style={{ marginLeft: "-10px" }} />
                        </a>
                        }
                        {(props.data.descAndroid == "0" || props.data.descAndroid == "") &&
                        <a href={props.data.descAndroid !== "0" ? props.data.descAndroid : ""} target="_blank" data-toggle="tooltip" title="android" rel="noopener  noreferrer">
                             <img src="../assets/img/icons/android.png" width={200} style={{ filter: "grayscale(1)", webkitFilter: "grayscale(1)", marginLeft: "-10px" }} alt='android'/>
                        </a>
                        }
                    </div>
                    <div className="col-md-12 link-cinza">
                        {console.log(props.data.descApple)}
                        {(props.data.descApple != "0" && props.data.descApple != "") &&
                        <a href={props.data.descApple !== "0" ? props.data.descApple : ""} target="_blank" data-toggle="tooltip" title="android" rel="noopener  noreferrer">
                             <img src="../assets/img/icons/ios.png" width={180} height={60}/>
                        </a>
                        }
                        {(props.data.descApple == "0" || props.data.descApple == "") &&
                        <a href={props.data.descApple !== "0" ? props.data.descApple : ""} target="_blank" data-toggle="tooltip" title="android" rel="noopener  noreferrer">
                             <img src="../assets/img/icons/ios.png" width={180} height={60} style={{ filter: "grayscale(1)", webkitFilter: "grayscale(1)" }} alt='android'/>
                        </a>
                        }
                    </div>

                    {/* <div className="col-md-12 link-cinza">
                        <img src="../assets/img/teste/aperto-de-mao.png" />
                        <h4>
                        <a href={props.data.descParceiroLink !== "0" ? props.data.descParceiroLink : ""} target="_blank" data-toggle="tooltip" title="google-meu-negocio" rel="noopener  noreferrer">
                            {props.data.descParceiroLink !== "0" ? props.data.descParceiroLink : ""}
                            </a>
                        </h4>
                    </div> */}
                </div>
            </div>
        </div>
    );
}

export default Metadados;
