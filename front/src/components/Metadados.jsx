import React, { useState, useRef, useEffect } from 'react';
import Swal from 'sweetalert2';
import { masterPath } from '../config/config';

import '../assets/css/main.css';
import '../assets/css/default.css';
import '../assets/css/metadados.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Modal, Button } from 'react-bootstrap';
/* import 'font-awesome/css/font-awesome.min.css'; */

import Tooltip from './Tooltip';

import { BsShareFill, BsFillSendFill, BsFacebook, BsInstagram, BsTwitter, BsYoutube, BsWhatsapp, BsSkype, BsHeadset } from "react-icons/bs";
import QrCodeGeneratorPix from '../plugins/QrCodeGeneratorPix';


function Metadados(props) {
    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false);
        // props.setShowState(false);
    };

    function openModalPix(e) {
        //const link = `${masterPath.url}/files/3/${encodeURIComponent(props.data.cartao_digital)}`;
        e.preventDefault();
        const styles = {
            display: "flex",
            flexDirection: "column"
        }

        const link = props.urlShare;
        Swal.fire({
            title: 'Compartilhe Seu Minisitio',
            html: `
                          <div style="" class="cart-digital-modal py-3">
                              <a href="https://api.whatsapp.com/send?text=${link}" target="_blank" class="mb-2 d-flex flex-column align-items-center" style="gap: 10px;">
                                  <img src="../assets/img/icon-share/share_whatsapp.svg" width="80" alt="whatsapp" />    
                                  Compartilhar no WhatsApp
                              </a>
                              <a href="https://www.facebook.com/sharer/sharer.php?u=${link}" target="_blank" class="mb-2 d-flex flex-column align-items-center" style="gap: 10px;">
                                  <img src="../assets/img/icon-share/share_facebook.svg" width="80" alt="facebook" />
                                  Compartilhar no Facebook
                              </a>
                              <a href="https://twitter.com/intent/tweet?url=${link}" target="_blank" class="mb-2 d-flex flex-column align-items-center" style="gap: 10px;">
                                  <img src="../assets/img/icon-share/share_x.svg" width="80" alt="x" />    
                                  Compartilhar no Twitter
                              </a>
                              <a href="https://www.linkedin.com/shareArticle?url=${link}" target="_blank" class="mb-2 d-flex flex-column align-items-center" style="gap: 10px;">
                                  <img src="../assets/img/icon-share/linkedin.png" width="80" alt="linkedin" style="border-radius: 100%;" />    
                                  Compartilhar no LinkedIn
                              </a>
                              <div class="mb-2 d-flex flex-column align-items-center" style="gap: 6px;">
                                 <button
                                    id="copyBtn"
                                    style="border-radius: 100%; padding: 10px"
                                    >
                                    <img src="../assets/img/icons/icons8-copiar.gif" alt="copiar" width="60" />
                  
                                   </button>
                                    Copiar
                              </div>
                             
                          </div>
                      `,
            width: "50%",
            showCloseButton: true,
            showConfirmButton: false,
            didOpen: () => {
                //document.getElementById('copyBtn')?.addEventListener('click', handleCopy);
            }
        });
    }

    const handleCopyPix = (chavePix) => {
        navigator.clipboard.writeText(chavePix).then(() => {
            Swal.fire({
                toast: true,
                position: "top-end",
                icon: "success",
                title: "Link copiado!",
                showConfirmButton: false,
                timer: 2000
            });
            /*  setCopied(true);
             setTimeout(() => setCopied(false), 2000); */
        });
    };

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
                            {props.data.descCEP !== "0" ? ` ${props.data.descCEP}` : ""}
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
                    {(props.data.descFacebook && props.data.descFacebook !== "teste") &&
                        <div className="col-md-12 link-cinza">
                            <img src="../assets/img/teste/facebook.png" />
                            <h4>
                                <a href={props.data.descFacebook !== "teste" ? props.data.descFacebook : ""} data-toggle="tooltip" title="Facebook" target="_blank" rel="noopener  noreferrer">
                                    {props.data.descFacebook !== "teste" ? props.data.descFacebook : ""}
                                </a>
                            </h4>
                        </div>
                    }

                    {(props.data.descInsta && props.data.descInsta !== "teste") &&
                        <div className="col-md-12 link-cinza">
                            <img src="../assets/img/teste/instagram.png" />
                            <h4>
                                <a href={props.data.descInsta !== "0" ? props.data.descInsta : ""} data-toggle="tooltip" title="Instagram" target="_blank" rel="noopener  noreferrer">
                                    {props.data.descInsta !== "0" ? props.data.descInsta : ""}
                                </a>
                            </h4>
                        </div>
                    }

                    {(props.data.descTweeter && props.data.descTweeter !== "teste") &&
                        <div className="col-md-12 link-cinza">
                            <img src="../assets/img/redes/unnamed.webp" className="rounded" />
                            <h4>
                                <a href={props.data.descTweeter !== "teste" ? props.data.descTweeter : ""} data-toggle="tooltip" title="Twitter" target="_blank" rel="noopener  noreferrer">
                                    {props.data.descTweeter !== "teste" ? props.data.descTweeter : ""}
                                </a>
                            </h4>
                        </div>
                    }

                    {(props.data.descLinkedin && props.data.descLinkedin !== "teste") &&
                        <div className="col-md-12 link-cinza">
                            <img src="../assets/img/teste/linkedin.png" />
                            <h4>
                                <a href={props.data.descLinkedin !== "0" ? props.data.descLinkedin : ""} data-toggle="tooltip" title="Linkedin" target="_blank" rel="noopener  noreferrer">
                                    {props.data.descLinkedin !== "0" ? props.data.descLinkedin : ""}
                                </a>
                            </h4>
                        </div>
                    }

                    {(props.data.descWhatsApp && props.data.descWhatsApp !== "teste") &&
                        <div className="col-md-12 ">
                            <img src="../assets/img/teste/whatsapp.png" />
                            <h4>
                                <a href={`https://api.whatsapp.com/send?phone=55${props.data.descWhatsApp}`} target="_blank" data-toggle="tooltip" title="WhatsApp" rel="noopener  noreferrer">
                                    {props.data.descWhatsApp !== "0" ? props.data.descWhatsApp : "(xx) xxxxx-xxxx"}
                                </a>
                            </h4>
                        </div>
                    }

                    {(props.data.descTelegram && props.data.descTelegram !== "teste") &&
                        <div className="col-md-12 link-cinza">
                            <img src="../assets/img/teste/telegram.png" />
                            <h4>
                                <a href="https://telegram.me/55" target="_blank" data-toggle="tooltip" title="Telegram" rel="noopener  noreferrer">
                                    {props.data.descTelegram !== "0" ? props.data.descTelegram : ""}
                                </a>
                            </h4>
                        </div>
                    }

                    {(props.data.descSkype && props.data.descSkype !== "teste") &&
                        <div className="col-md-12 link-cinza">
                            <img src="../assets/img/teste/icons8-meu-negócio-48.png" />
                            <h4>
                                <a href={props.data.descSkype !== "0" ? props.data.descSkype : ""} target="_blank" data-toggle="tooltip" title="google-meu-negocio" rel="noopener  noreferrer">
                                    {props.data.descSkype !== "0" ? props.data.descSkype : ""}
                                </a>
                            </h4>
                        </div>
                    }

                    <div className="col-md-12 link-cinza justify-content-between align-items-center p-0 area-pix-portal">
                        <img src="../assets/img/teste/pix-bc.png" className='logo-pix' />
                        {(props.data.descChavePix && props.data.descChavePix !== "teste") &&
                            <ul className='desc-pix'>
                                <li>
                                    <span>
                                        Chave: {props.data.descChavePix}
                                    </span>
                                    <img src="../assets/img/icons/icons8-copiar.gif" width={30} alt="copiar" onClick={() => handleCopyPix(props.data.descChavePix)} title="copiar" />
                                </li>
                                <li><span>Nome: {props.data.descDonoPix}</span></li>
                            </ul>
                        }
                        {/*   <h4>
                            {props.data.descChavePix}
                        </h4> */}
                        {props.data.descChavePix &&
                            <button onClick={(e) => setShow(true)} className='btnGerarPix btn-success p-1'>QRCODE</button>
                        }

                    </div>


                    <Modal show={show} onHide={handleClose} size="lg">
                        <Modal.Header closeButton>
                            <Modal.Title>QRcode Gerado!</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="text-center">

                            <div className="modal-body text-center">
                                <div className='title-promo-ms text-center'>
                                    {/*  <img src="../assets/img/logo50.png" className="logo-modal-promo" />
                                    <h4>Promoção com minisitio</h4> */}
                                    <QrCodeGeneratorPix chave={props.data.descChavePix} dono={props.data.descDonoPix} />
                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="danger" onClick={handleClose}>
                                Fechar
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    {(props.data.descAndroid && props.data.descAndroid !== "teste") &&
                        <div className="col-md-12 link-cinza">
                            {(props.data.descAndroid != "0" && props.data.descAndroid != "") &&
                                <a href={props.data.descAndroid !== "0" ? props.data.descAndroid : ""} target="_blank" data-toggle="tooltip" title="android" rel="noopener  noreferrer">
                                    <img src="../assets/img/icons/android.png" width={200} style={{ marginLeft: "-10px" }} />
                                </a>
                            }
                            {(props.data.descAndroid == "0" || props.data.descAndroid == "") &&
                                <a href={props.data.descAndroid !== "0" ? props.data.descAndroid : ""} target="_blank" data-toggle="tooltip" title="android" rel="noopener  noreferrer">
                                    <img src="../assets/img/icons/android.png" width={200} style={{ filter: "grayscale(1)", webkitFilter: "grayscale(1)", marginLeft: "-10px" }} alt='android' />
                                </a>
                            }
                        </div>
                    }
                    {(props.data.descApple && props.data.descApple !== "teste") &&
                        <div className="col-md-12 link-cinza">
                            {console.log(props.data.descApple)}
                            {(props.data.descApple != "0" && props.data.descApple != "") &&
                                <a href={props.data.descApple !== "0" ? props.data.descApple : ""} target="_blank" data-toggle="tooltip" title="android" rel="noopener  noreferrer">
                                    <img src="../assets/img/icons/ios.png" width={180} height={60} />
                                </a>
                            }
                            {(props.data.descApple == "0" || props.data.descApple == "") &&
                                <a href={props.data.descApple !== "0" ? props.data.descApple : ""} target="_blank" data-toggle="tooltip" title="apple">
                                    <img src="../assets/img/icons/ios.png" width={180} height={60} style={{ filter: "grayscale(1)", webkitFilter: "grayscale(1)" }} alt='android' />
                                </a>
                            }
                        </div>

                    }

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
