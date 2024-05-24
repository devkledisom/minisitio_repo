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
        const request = await fetch(`${masterPath.url}/anuncio/${props.id}`).then((x) => x.json());
        setResult(request[0]);
        navigate("/local");
    }

    /*   useEffect(() => {
          props.data.anuncios.map(item => setImg(item.descImagem))
          console.log(imgPath)
      }, []); */


    return (
        <div className="MiniWebCardSimples">

            <div className='container my-2' >
                <div className='row p-0 cartao'>
                <div class="apoio">
                            <div style={{ float: "right" }}>

                                <a href="/comprar-anuncio?type=2">
                                    <button type="button" class="btn2 bgbt" data-toggle="modal" data-target="#05562970000102">
                                        INCLUIR <br />IMAGEM CARTÃO
                                    </button>
                                </a>
                            </div>
                        </div>
                    <div className="row py-3 px-0">

      



                        <div id="05562970000102" class="modal fade" role="dialog">
                            <div class="modal-dialog">

                                Modal content
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <button type="button" class="close" data-dismiss="modal">×</button>
                                        <h3 class="modal-title">Incluir imagem do cartão</h3>
                                    </div>
                                    <div class="modal-body">
                                        <p class="text-center danger"></p><h2>Você é o proprietário?</h2><p></p>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn proximo" data-dismiss="modal">Não</button>
                                        <a href="/wslogin?descCPFCNPJ=05562970000102&amp;senha=7c4a8d09ca3762af61e59520943dc26494f8941b&amp;codAnuncio=327591">
                                            <button type="submit" class="btn cinza">Sim</button>
                                        </a>

                                    </div>
                                </div>

                            </div>
                        </div>


                        <div class="conteudo text-start webcardsimples">
                            <a href="/local/porto-velho/hotel avenida ii_327591">


                                <h2>HOTEL AVENIDA II</h2>
                                <p><i class="fa fa-map-marker"></i> R JOAQUIM NABUCO - 1981 - CENTRO</p>
                                <p><i class="fa fa-phone"></i> (69) 3222-4366</p>
                            </a>

                        </div>

                        <div className='col-md-12 px-0 d-flex justify-content-end align-items-center'>
                            <button id="btn-detalhes" onClick={buscarAnuncio}>Ver Detalhes</button>
                        </div>

                    </div>
                </div>


            </div>


            {/* 
            <li class="cartao cartao-simples ">
              
            </li> */}
        </div>
    );
}

export default MiniWebCardSimples;
