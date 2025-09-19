import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { masterPath } from '../config/config';

import '../assets/css/main.css';
import '../assets/css/default.css';
import '../assets/css/miniwebcard.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
/* import 'font-awesome/css/font-awesome.min.css'; */

import Tooltip from './Tooltip';

import { BsShareFill, BsFillSendFill, BsFacebook, BsInstagram, BsTwitter, BsYoutube, BsWhatsapp, BsSkype, BsHeadset } from "react-icons/bs";

function WebcardThumb(props) {
    const [imgPath, setImg] = useState();
    const [imgDefault, setImgDefault] = useState(null);
    const [listaIds, setListaIds] = useState([]);
    //const [dataCriacao, setDataCriacao] = useState(null);



    useEffect(() => {
        if (props.codImg == 0 || props.codImg == "teste" || props.codImg == null) {
            setImgDefault(false);
        } else {
            setImgDefault(`files/${props.codImg}`);
        };

        function buscarUserId() {
            fetch(`${masterPath.url}/admin/desconto/buscar/${props.data.hash}`)
                .then((x) => x.json())
                .then((res) => {
                    //console.log(res, props.data)
                    if (res.success) {
                        setListaIds(res.IdsValue[0]);
                    } else {
                        console.error("encontrado na base de dados");
                    }

                })
        };

        buscarUserId();

    }, [props]);

    useEffect(() => {

        function buscarUserId() {
            fetch(`${masterPath.url}/admin/desconto/buscar/${props.data.codDesconto}`)
                .then((x) => x.json())
                .then((res) => {
                    if (res.success) {
                        setListaIds(res.IdsValue[0]);
                        //console.log(res);
                    } else {
                        console.error("encontrado na base de dados");
                    }

                })
        };

        buscarUserId();

    }, []);

    const formatData = (dataCompleta) => {
        if (dataCompleta != undefined) {
            const date = new Date(dataCompleta); // Z indica UTC
            const formatted = date.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
            let dataTempo = formatted.split('T');
            let dataPart1 = dataTempo[0].split('-');
            let dataPart2 = dataPart1[0].split(',');
            let dataOriginal = dataPart2[0].split('/');

            return `${dataOriginal[0]}/${dataOriginal[1]}/${dataOriginal[2]}`;
        }
    };

    const dataExpiracao = (dataCompleta) => {
        /*  let dataTempo = dataCompleta.split('T');
         let dataOriginal = dataTempo[0];
 
         const expirationDate = moment(dataOriginal).add(1, 'year').format('DD/MM/YYYY');
         console.log("data", dataOriginal)
 
         return expirationDate; */
    };

    var thumb = (img) => {
        if (img != false && img != 'files/null' && img != 'files/undefined') {
            return true;
        } else {
            return false;
        }
    }
    var partner = (img) => {
        if (img != false && img != 'null' && img != 'undefined') {
            return true;
        } else {
            return false;
        }
    }

    return (
        <div className="WebcardThumb">
            {/* {console.log(listaIds.descricao, listaIds.descImagem, listaIds.descImagem)}  */}
            <div className='container my-2 p-0' >
                <div className='cartao'>
                    {listaIds.descricao != "valor padrao" && listaIds.descImagem != "" && listaIds.descImagem != "null" && listaIds.descImagem != null &&
                        <div className="apoio">
                            <div>
                                {partner(listaIds.descImagem) &&
                                    <a href={listaIds.descLink} target="_blank" rel="noopener noreferrer">
                                        <img src={`${masterPath.url}/files/${listaIds.descImagem}`} alt="" />
                                    </a>
                                }
                                {partner(listaIds.descImagem2) != "" &&
                                    <a href={listaIds.descLink2} target="_blank" rel="noopener noreferrer">
                                        <img src={`${masterPath.url}/files/${listaIds.descImagem2}`} alt="" />
                                    </a>
                                }
                                {partner(listaIds.descImagem3) != "" &&
                                    <a href={listaIds.descLink3} target="_blank" rel="noopener noreferrer">
                                        <img src={`${masterPath.url}/files/${listaIds.descImagem3}`} alt="" />
                                    </a>
                                }
                            </div>
                        </div>
                    }


                    {/* {( listaIds.descImagem != "" && listaIds.length > 0 || listaIds.descImagem2 != "" && listaIds.length > 0 || listaIds.descImagem3 != "" && listaIds.length > 0) &&
                    <div className="apoio kledisom">
                        <div>
                            <a href={listaIds.descLink} target="_blank" rel="noopener noreferrer">
                                <img src={`${masterPath.url}/files/${listaIds.descImagem}`} alt="" />
                            </a>
                            {listaIds.descImagem2 != "" &&
                                <a href={listaIds.descLink2} target="_blank" rel="noopener noreferrer">
                                    <img src={`${masterPath.url}/files/${listaIds.descImagem2}`} alt="" />
                                </a>
                            }
                            {listaIds.descImagem3 != "" &&
                                <a href={listaIds.descLink3} target="_blank" rel="noopener noreferrer">
                                    <img src={`${masterPath.url}/files/${listaIds.descImagem3}`} alt="" />
                                </a>
                            }

                        </div>
                    </div>
                } */}
                    <div className='row p-2'>

                        {/*  <img src={`${masterPath.url}/files/${props.codImg}`} alt="" width={150} height={200} /> */}
                        {thumb(imgDefault) && <img src={`${masterPath.url}/${imgDefault}`} alt="" width={150} style={{ height: "300px" }} />}
                    </div>

                    {!thumb(imgDefault) &&
                        <div className="conteudo semImagem">
                            <h2 className="nome-empresa text-start">{props.data.descAnuncio}</h2>
                            <h4
                                className="slogan webcard text-start"
                                style={{ display: "block" }}
                            >
                                Frase/slogan da empresa
                            </h4>
                            <p className="text-start">
                                <i className="fa fa-map-marker"></i>{" "}
                                <span className="sim-end">{props.data.descEndereco !== "atualizar" ? props.data.descEndereco : "Endereço da empresa"}</span>
                            </p>
                            <p className="text-start">
                                <i className="fa fa-phone"></i>{" "}
                                <span className="sim-tel">{props.data.descTelefone !== "atualizar" ? props.data.descTelefone : "(xx) xxxx-xxxx"}</span>
                            </p>
                            <p
                                className="webcard text-start"
                                style={{ display: "block" }}
                            >
                                <i className="fa fa-phone"></i>{" "}
                                <span className="cel">{props.data.descCelular !== "0" ? props.data.descCelular : "(xx) xxxxx-xxxx"}</span>
                            </p>
                        </div>
                    }
                    <div className="row py-0 px-2 card-metadados">
                        <div className="container">
                            <div className="row">
                                <div className="col-md-6 col-6">
                                    <p className='text-start'>
                                        Anúncio visualizado: {props.data.qntVisualizacoes} vezes <br />
                                        Última atualização: {formatData(props.data.dtAlteracao)}<br />
                                        Código: {props.data.codAnuncio}
                                    </p>
                                </div>
                                <div className="col-md-6 col-6">
                                    <p className='text-end'>
                                        Desde: {formatData(props.data.createdAt)}<br />
                                        {props.data.dtCadastro2 ?
                                            <span>
                                                Renovado em: {formatData(props.data.dtCadastro2)}<br />
                                            </span>
                                            :
                                            <span>
                                                Renovado em: <br />
                                            </span>
                                        }
                                        {props.data.dtCadastro2 ?
                                            <span>
                                                Até: {formatData(props.data.dueDate)}
                                            </span>
                                            :
                                            <span>
                                                Até: {formatData(props.data.dueDate)}
                                            </span>

                                        }
                                    </p>
                                </div>
                            </div>
                        </div>



                    </div>
                </div>




            </div>
        </div>
    );
}

export default WebcardThumb;

