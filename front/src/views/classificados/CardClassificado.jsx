import React from "react";
import { masterPath } from '../../config/config';

function CardClassificado(props) {
    //prefeitura_maceio_20180302_143719.jpg
    //console.log("dasd", props.pathImg)
    return (
        <>
            <li className="titulo titulo-cinza">
                <h2>{props.title}</h2>
            </li>


            {props.pathImg != null && props.pathImg != "teste" && props.pathImg != 0 ? (
                <li className="cartao">
                    <div className="conteudo">
                        <a href="/local/maceio/prefeitura_190278">
                        {}
                            <img src={`${masterPath.url}/files/${props.pathImg}`} alt="Prefeitura" />
                        </a>
                    </div>

                    <div className="links">
                        <ul className="list-inline">
                            <li className="pull-left">
                                <a href="/local/maceio/prefeitura_190278" data-toggle="tooltip" title="Detalhes">
                                    <img src="/assets/img/miniwebcard/link_detalhe.png" />
                                </a>
                            </li>
                            <li className="pull-right">
                                <a href="/local/maceio/prefeitura_190278" data-toggle="tooltip" title="SAC - Fale Comigo">
                                    <img src="/assets/img/miniwebcard/link_email.png" />
                                </a>
                            </li>
                        </ul>
                    </div>


                </li>
            ) : (
                <li className="cartao d-flex justify-content-center align-items-center">

                    <span>NÃO INFORMADO</span>


                </li>
            )}



            <li>

            </li>
        </>
    );
};

export default CardClassificado;