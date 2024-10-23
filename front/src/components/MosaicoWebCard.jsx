import React from 'react';
import { masterPath } from '../config/config';
import '../assets/css/mosaicowebcard.css';

import QrcodeMosaico from '../plugins/QrcodeMosaico';

function MosaicoWebCard(props) {

    const style = {
        boxShadow: props.borda,
        /* backgroundImage: "url(/assets/img/miniwebcard/Alagoas_Maceio.jpg)", */
        backgroundImage: `url(${masterPath.url}/files/${props.mosaicoImg})`,
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
        //backgroundColor: "red"
    }
    //console.log(props.mosaicoImg)

    return (
        <div className='mosaico-webcard'>
            <div className="header hidden-print" style={
                props.mosaicoImg ? style : { boxShadow: props.borda }
            }>
                <div className="container">
                    <div className="container-mosaico">
                        <QrcodeMosaico nmAnuncio={props.nmAnuncio} />
                        {props.logoTop ? <a href="/"><img src="/assets/img/logo.png" className="logo" /></a> : ''}
                        <div className="pull-right faixa-header">
                            <ul className="header-navigation">
                                <li className="assine"><a href="/comprar-anuncio">Assine Agora</a></li>
                                <li className="dropdown dropdown-bandeira">
                                    <a className="dropdown-toggle" data-toggle="dropdown" data-target="#" href="#">
                                        <img src="/assets/img/bandeiras/br.png" style={{ border: "1px solid #edecec" }} />
                                        <span className="caret"></span>
                                    </a>
                                    <ul className="dropdown-menu pull-right">
                                        <li>
                                            <a href="https://cl.minisitio.net">
                                                <img src="/assets/img/bandeiras/cl.png" style={{ border: "1px solid #edecec" }} />
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

};

export default MosaicoWebCard;