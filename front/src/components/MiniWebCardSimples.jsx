import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { masterPath } from '../config/config';

import '../assets/css/main.css';
import '../assets/css/default.css';
import '../assets/css/miniwebcardsimples.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
/* import 'font-awesome/css/font-awesome.min.css'; */

import Tooltip from './Tooltip';
import { useBusca } from '../context/BuscaContext';

import { BsShareFill, BsFillSendFill, BsFacebook, BsInstagram, BsTwitter, BsYoutube, BsWhatsapp, BsSkype, BsHeadset } from "react-icons/bs";

function MiniWebCardSimples(props) {
    const { result, setResult } = useBusca();
    const navigate = useNavigate();
    const [imgPath, setImg] = useState();

    async function buscarAnuncio() {
        qntVisualizacoes();
        const request = await fetch(`${masterPath.url}/anuncio/${props.id}`).then((x) => x.json());
        setResult(request[0]);
        navigate(`/local/${props.data.descAnuncio}?id=${props.id}`);

        //navigate("/local");
    }

    /*   useEffect(() => {
          props.data.anuncios.map(item => setImg(item.descImagem))
          console.log(imgPath)
      }, []); */

    useEffect(() => {
        /* props.data.anuncios.map(item => setImg(item.descImagem)) */
        console.log("simples", props.data)
    }, []);

    function qntVisualizacoes() {
        fetch(`${masterPath.url}/admin/anuncio/visualizacoes?id=${props.id}`)
            .then((x) => x.json())
            .then((res) => {
                //console.log(res)
            })
    };


    return (
        <div className="MiniWebCardSimples" key={props.key} id={`item_${props.id}`}>

            {/* <div className='container my-2' > */}
                <div className='row p-0 cartao'>
                    <div className="apoio">
                        <div style={{ float: "right" }}>
                            <a href="/login">
                                <button type="button" class="btn2 bgbt" data-toggle="modal" data-target="#05562970000102">
                                    INCLUIR <br />IMAGEM CARTÃO
                                </button>
                            </a>
                        </div>
                    </div>
                    <div className="row">
                        <div id="05562970000102" class="modal fade" role="dialog">
                            <div class="modal-dialog">
                                Modal content
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <button type="button" className="close" data-dismiss="modal">×</button>
                                        <h3 className="modal-title">Incluir imagem do cartão</h3>
                                    </div>
                                    <div className="modal-body">
                                        <p className="text-center danger"></p><h2>Você é o proprietário?</h2><p></p>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn proximo" data-dismiss="modal">Não</button>
                                        <a href="/wslogin?descCPFCNPJ=05562970000102&amp;senha=7c4a8d09ca3762af61e59520943dc26494f8941b&amp;codAnuncio=327591">
                                            <button type="submit" className="btn cinza">Sim</button>
                                        </a>

                                    </div>
                                </div>

                            </div>
                        </div>


                        <div className="conteudo text-start webcardsimples">
                            <a href="/local/porto-velho/hotel avenida ii_327591">


                                <h2>{props.data.descAnuncio}</h2>
                                <p><i className="fa fa-map-marker"></i>{props.data.descEndereco}</p>
                                <p><i className="fa fa-phone"></i>{props.data.descTelefone}</p>
                            </a>

                        </div>

                        <div className='col-md-12 px-2 d-flex justify-content-end align-items-center'>
                            <button id="btn-detalhes" onClick={buscarAnuncio}>Ver Detalhes</button>
                        </div>

                    </div>
                </div>


           {/*  </div> */}


            {/* 
            <li class="cartao cartao-simples ">
              
            </li> */}
        </div>
    );
}

export default MiniWebCardSimples;
