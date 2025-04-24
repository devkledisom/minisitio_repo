import React, { useEffect, useState } from 'react';
import '../assets/css/main.css';
import { masterPath } from '../config/config';

function Nav(props) {
    const [pin, setPin] = useState();

    useEffect(() => {
        fetch(`${masterPath.url}/portal/pin/`)
            .then(x => x.json())
            .then(res => {
                if (res.success) {
                    setPin(res.pin.codigo)
                }

            });
    }, []);

    return (
        <div className={`${props.styleclassName} menu d-flex align-items-center`}>
            <div className="container">
                <ul className="nav justify-content-center">
                    <li className="nav-item">
                        <a className="nav-link" href="/">INÍCIO</a>
                    </li>
                    {/*   <li className="nav-item">
                        <a className="nav-link" href="/login">ÁREA DO ASSINANTE</a>
                    </li> */}
                    <li className="nav-item">
                        <a className="nav-link" href="/institucional">INSTITUCIONAL</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="http://vendas.minisitio.com.br" target='_blank' rel='noopener noreferrer' >TRABALHE CONOSCO</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="/contato">CONTATO</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link disabled" href="#">MYCARDCITY PIN: {pin}</a>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default Nav;
