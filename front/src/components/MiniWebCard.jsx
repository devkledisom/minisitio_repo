import React, { useState, useEffect } from 'react';
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
    const [imgDefault, setImgDefault] = useState(null);
    const [loading, setLoading] = useState(false);
    const [parceiros, setParceiros] = useState(null);

    async function buscarAnuncio() {
        setLoading(true);
        qntVisualizacoes()
        const request = await fetch(`${masterPath.url}/anuncio/${props.id}`).then((x) => x.json());
        request.kledisom = "1q12314234"
        setResult(request[0]);
        navigate(`/local/${props.empresa}?id=${props.id}&ids=${props.ids}`);
    }

    useEffect(() => {
        setParceiros(props.ids)
        props.data.anuncios.map(item => setImg(item.descImagem))


        if (props.codImg == 0 || props.codImg == "teste" || props.codImg == null) {
            setImgDefault(false);
        } else {
            setImgDefault(`files/${props.codImg}`);
        }

        // console.log(props.codDesconto)
    }, [props]);


    function qntVisualizacoes() {
        fetch(`${masterPath.url}/admin/anuncio/visualizacoes?id=${props.id}`)
            .then((x) => x.json())
            .then((res) => {
                //console.log(res)
            })
    };

    const isValid = (value) => value !== 'null' && value !== '';


    return (
        <div className="MiniWebCard" key={props.key} id={`item_${props.id}`}>

            {loading &&
                <button class="buttonload" style={{ display: "block" }}>
                    <i class="fa fa-spinner fa-spin"></i>Carregando
                </button>
            }
            <div className='container cartao my-2 p-0' key={props.key}>

                {parceiros && (
                        (isValid(props.ids.descImagem) ||
                        isValid(props.ids.descImagem2) ||
                        isValid(props.ids.descImagem3)) && (
                        <div className="apoio kledisom">
                            <div>
                                {[{ img: props.ids.descImagem, link: props.ids.descLink },
                                { img: props.ids.descImagem2, link: props.ids.descLink2 },
                                { img: props.ids.descImagem3, link: props.ids.descLink3 }]
                                    .filter(item => item.img) // Filtra itens com imagem válida
                                    .map((item, index) => (
                                        <a
                                            key={index}
                                            href={item.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <img src={`${masterPath.url}/files/${item.img}`} alt={`Parceiro ${index + 1}`} />
                                        </a>
                                    ))}
                            </div>
                        </div>
                    ))
                }


                {/*   {(props.ids.descImagem != "" || props.ids.descImagem2 != "" || props.ids.descImagem3 != "") &&
                    <div className="apoio kledisom">
                        <div>
                            <a href={props.ids.descLink} target="_blank" rel="noopener noreferrer">
                                <img src={`${masterPath.url}/files/${props.ids.descImagem}`} alt="" />
                            </a>
                            {props.ids.descImagem2 != "" &&
                                <a href={props.ids.descLink2} target="_blank" rel="noopener noreferrer">
                                    <img src={`${masterPath.url}/files/${props.ids.descImagem2}`} alt="" />
                                </a>
                            }
                            {props.ids.descImagem3 != "" &&
                                <a href={props.ids.descLink3} target="_blank" rel="noopener noreferrer">
                                    <img src={`${masterPath.url}/files/${props.ids.descImagem3}`} alt="" />
                                </a>
                            }

                        </div>
                    </div> 
                } */}
                {/* <div>
                         <a href={props.ids.descLink} target="_blank" rel="noopener noreferrer">
                            <img src={`${masterPath.url}/files/${props.ids.descImagem}`} alt="" />
                        </a>
                        <a href={props.ids.descLink2} target="_blank" rel="noopener noreferrer">
                            <img src={`${masterPath.url}/files/${props.ids.descImagem2}`} alt="" />
                        </a>
                        <a href={props.ids.descLink3} target="_blank" rel="noopener noreferrer">
                            <img src={`${masterPath.url}/files/${props.ids.descImagem3}`} alt="" />
                        </a> 
                    </div>*/}


                <div className='row display-flex justify-content-center' key={props.key} onClick={buscarAnuncio}>

                    {imgDefault != false && <img src={`${masterPath.url}/${imgDefault}`} alt="" width={435} height={205} />}

                    {imgDefault == false &&
                        <div className="conteudo semImagem" style={{ width: "415px" }}>
                            <h2 className="nome-empresa text-start">{props.empresa}</h2>
                            <h4
                                className="slogan webcard text-start"
                                style={{ display: "block" }}
                            >
                                Frase/slogan da empresa
                            </h4>
                            <p className="text-start">
                                <i className="fa fa-map-marker"></i>
                                <span className="sim-end">{props.endereco !== "atualizar" ? props.endereco : "Endereço da empresa"}</span>
                            </p>
                            <p className="text-start">
                                <i className="fa fa-phone"></i>
                                <span className="sim-tel">{props.telefone !== "0" ? props.telefone : "(xx) xxxx-xxxx"}</span>
                            </p>
                            <p
                                className="webcard text-start"
                                style={{ display: "block" }}
                            >
                                <i className="fa fa-phone"></i>
                                <span className="cel">{props.celular !== "0" ? props.celular : "(xx) xxxxx-xxxx"}</span>
                            </p>
                        </div>
                    }


                    <div className="row">
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
                                    <img src="../assets/img/link_mapa.png" alt="" height={30} />
                                </i>
                            </Tooltip>

                            <Tooltip text={"Site"}>
                                <i>
                                    <img src="../assets/img/link_site.png" alt="" height={30} />
                                </i>
                            </Tooltip>
                            <Tooltip text={"Promoção"}>
                                <i>
                                    <img src="../assets/img/link_promocao.png" alt="" height={30} />
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
                        <div className='col-md-6 px-2 d-flex justify-content-end align-items-center'>
                            <button id="btn-detalhes" onClick={buscarAnuncio}>Ver Detalhes</button>
                        </div>

                    </div>
                </div>


            </div>
        </div>
    );
}

export default MiniWebCard;
