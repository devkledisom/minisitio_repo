import React from 'react';
import { masterPath } from '../config/config';

import '../assets/css/mosaico.css';

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

    const logoHeader = {
        margin: "none !important",
        height: "100px"
    }
    const assineAgora = {
        background: "#ffcc29",
        padding: "10px",
        borderRadius: "5px",
    }

    const frase = {
        fontSize: "24px",
    }

    return (
        <div>
            <div className="header hidden-print" style={
                props.mosaicoImg ? style : { boxShadow: props.borda }
            }>
                <div className="container header-new-mosaico" /* style={{ paddingTop: "45px" }} */>
                    <div className="row logo-new-mosaico" style={{ height: "110px" }}>
                        {/* <QrcodeMosaico /> */}
                        <div className="col-4 col-md-3 col-sm-12 pull-right faixa-header d-flex justify-content-start align-items-center">
                            {props.logoTop ? <a href="/" className='h-100'><img src="/assets/img/logo.png" style={logoHeader} /></a> : ''}
                        </div>
                        <div className="col-4 col-md-6 col-sm-12 pull-right faixa-header d-flex justify-content-center align-items-center fraseHeader" style={frase}>
                            <span className='px-3'>Apoiando o pequeno negócio</span>
                        </div>
                        <div className="col-4 col-md-3 col-sm-12 pull-right faixa-header d-flex justify-content-end align-items-center">
                            <ul className="header-navigation p-0 h-100 d-flex justify-content-center align-items-center">
                                <li /* className="assine" */><a href="/comprar-espaco-minisitio" style={assineAgora}>Assine Agora</a></li>
                                <li className="dropdown dropdown-bandeira ml-3">
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

export default Mosaico;