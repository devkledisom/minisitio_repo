import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { masterPath } from '../config/config';

import '../assets/css/main.css';
import '../assets/css/default.css';
import '../assets/css/miniwebcard.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
/* import 'font-awesome/css/font-awesome.min.css'; */

import Tooltip from './Tooltip';
import { useBusca } from '../context/BuscaContext';

import { BsShareFill, BsFillSendFill, BsFacebook, BsInstagram, BsTwitter, BsYoutube, BsWhatsapp, BsSkype, BsHeadset } from "react-icons/bs";

function MiniWebCard(props) {
    const { result, setResult } = useBusca();
    const navigate = useNavigate();
    const [imgPath, setImg] = useState();

    async function buscarAnuncio() {
        const request = await fetch(`${masterPath.url}/anuncio/${props.id}`).then((x) => x.json());
        setResult(request[0]);
        navigate("/local");
    }

    useEffect(() => {
        props.data.anuncios.map(item => setImg(item.descImagem))
        console.log(imgPath)
    }, []);


    return (
        <div className="MiniWebCard" key={props.key} id={`item_${props.id}`}>

            <div className='container my-2'>
                <div className='row p-2 cartao'>
                    <img src={`${masterPath.url}/files/${props.codImg}`} alt="" width={150} height={200} />
                    <div className="row py-3 px-0">
                        <div id="area-icons-actions" className='col-md-6'>
                            <Tooltip text={"Mídias"}>
                                <div className="dropdown">
                                    <button id="dropdown" className="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown">
                                        <i><BsShareFill /></i>
                                    </button>
                                    <ul id="dropdown-redes" className="dropdown-menu">
                                        <a href="#" className="dropdown-item"><BsFacebook /> Facebook</a>
                                        <a href="#" className="dropdown-item"><BsInstagram /> Instagram</a>
                                        <a href="#" className="dropdown-item"><BsTwitter /> Tweet</a>
                                        <a href="#" className="dropdown-item"><BsYoutube className='redes' /> Youtube</a>
                                        <a href="#" className="dropdown-item"><BsWhatsapp /> Whatsapp</a>
                                        <a href="#" className="dropdown-item"><BsSkype /> Skype</a>
                                        <a href="#" className="dropdown-item"><BsHeadset /> Sac-Fale Comigo</a>
                                    </ul>
                                </div>
                            </Tooltip>
                            <Tooltip text={"Mapa"}>
                                <i>
                                    <img src="../assets/img/link_mapa.png" alt="" height={40} />
                                </i>
                            </Tooltip>

                            <Tooltip text={"Site"}>
                                <i>
                                    <img src="../assets/img/link_site.png" alt="" height={40} />
                                </i>
                            </Tooltip>
                            <Tooltip text={"Promoção"}>
                                <i>
                                    <img src="../assets/img/link_promocao.png" alt="" height={40} />
                                </i>
                            </Tooltip>

                            <Tooltip text={"Compartilhar"}>
                                <div className="dropdown">
                                    <button id="dropdown" className="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown">
                                        <i><BsFillSendFill /></i>
                                    </button>
                                    <ul id="dropdown-redes" className="dropdown-menu">
                                        <a href="#" className="dropdown-item"><BsFacebook /> Facebook</a>
                                        <a href="#" className="dropdown-item"><BsInstagram /> Instagram</a>
                                        <a href="#" className="dropdown-item"><BsTwitter /> Tweet</a>
                                        <a href="#" className="dropdown-item"><BsYoutube /> Youtube</a>
                                        <a href="#" className="dropdown-item"><BsWhatsapp /> Whatsapp</a>
                                    </ul>
                                </div>
                            </Tooltip>
                            
                        </div>
                        <div className='col-md-6 px-0 d-flex justify-content-end align-items-center'>
                            <button id="btn-detalhes" onClick={buscarAnuncio}>Ver Detalhes</button>
                        </div>

                    </div>
                </div>


            </div>
        </div>
    );
}

export default MiniWebCard;
