import React from 'react';
import { masterPath } from '../config/config';

import QrcodeMosaico from '../plugins/QrcodeMosaico';

function Mosaico(props) {

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
        <div>
            <div className="header hidden-print" style={
                props.mosaicoImg ? style : { boxShadow: props.borda }
            }>
                <div className="container">
                    <div className="row">
                    {/* <QrcodeMosaico /> */}
                        <div className="col-md-12 col-sm-12 pull-right faixa-header">
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
                        {props.logoTop ? <a href="/"><img src="/assets/img/logo.png" className="logo" /></a> : ''}
                    </div>
                </div>
            </div>
        </div>
    )

};

export default Mosaico;