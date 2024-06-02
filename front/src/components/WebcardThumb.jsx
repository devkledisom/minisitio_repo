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
    console.log(props.codImg)

    useEffect(() => {
        //props.data.anuncios.map(item => setImg(item.descImagem))
        console.log(props.data)
    }, []);

    const formatData = (dataCompleta) => {
        let dataTempo = dataCompleta.split('T');
        let dataOriginal = dataTempo[0].split('-');

        return `${dataOriginal[2]}/${dataOriginal[1]}/${dataOriginal[0]}`
    };

    const dataExpiracao = (dataCompleta) => {
        let dataTempo = dataCompleta.split('T');
        let dataOriginal = dataTempo[0];

        const expirationDate = moment(dataOriginal).add(1, 'year').format('DD/MM/YYYY');
        console.log("data", dataOriginal)

        return expirationDate;
    };

    return (
        <div className="WebcardThumb">

            <div className='container my-2 p-0' >
                <div className='cartao'>
                    <div className='row p-2'>
                        <img src={`${masterPath.url}/files/${props.codImg}`} alt="" width={150} height={200} />
                    </div>
                    <div className="row py-3 px-2">
                        <div className="container">
                            <div className="row">
                                <div className="col-md-6">
                                    <p className='text-start'>
                                        Anúncio visualizado: {props.data.qntVisualizacoes} vezes <br />
                                        Última atualização: {formatData(props.data.dtAlteracao)}<br />
                                        Código: {props.data.codAnuncio}
                                    </p>
                                </div>
                                <div className="col-md-6">
                                    <p className='text-end'>
                                        Desde: {formatData(props.data.dtCadastro)}<br />
                                        Renovado em: {formatData(props.data.dtCadastro2)}<br />
                                        Até: {dataExpiracao(props.data.dtCadastro2)}
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

