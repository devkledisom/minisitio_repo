import React, {useState, useEffect} from 'react';
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

    /* useEffect(() => {
        props.data.anuncios.map(item => setImg(item.descImagem))
        console.log(imgPath)
    }, []); */
    return (
        <div className="WebcardThumb">

            <div className='container my-2 p-0' >
                <div className='cartao'>
                    <div className='row p-2'>
                        <img src={`${masterPath.url}/files/${props.codImg}`}  alt="" width={150} height={200} />
                    </div>
                    <div className="row py-3 px-2">
                        <div className="container">
                            <div className="row">
                                <div className="col-md-6">
                                    <p className='text-start'>
                                        Anúncio visualizado: 33 vezes <br />
                                        Última atualização: 17/03/2023<br />
                                        Código: 504183
                                    </p>
                                </div>
                                <div className="col-md-6">
                                    <p className='text-end'>
                                        Desde: 17/03/2023<br />
                                        Renovado em: 17/03/2023<br />
                                        Até: 17/03/2024
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

