import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/header.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';

function Header() {
    return (
        <div className='header header-bg navbar navbar-fixed-top'>
            <div className="container-fluid header-main">
                {/* <a className="brand" href="#">MINISITIO</a> */}
                <div className="row col-md-12">
                    <Link className="nav-link brand col-md-1" to="/admin" >MINISITIO</Link>
                    <ul className="nav col-md-10 d-flex justify-content-center">
                        <li className="nav-item">
                            {/* <a className="nav-link" href="#">Usuários</a> */}
                            <Link className="nav-link" to="/users" >Usuários</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/cadernos">Cadernos</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/info/cadernos">Informações de Cadernos</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/atividades">Atividades</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/espacos">Espaços</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/desconto">Gerenciar IDs</Link>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Pagamentos</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Relatórios Funil</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">PINs</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/">Sair</a>
                        </li>
                    </ul>
                    <div className="btn-group-header pull-right col-md-1">
                        <a href="#" data-toggle="dropdown" className="btn-quit dropdown-toggle">
                            <i className="icon-user"></i> -------- <span className="caret"></span>
                        </a>
                        <ul className="dropdown-menu">
                            <li><a href="/mdluser/auth/logout">Sair</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )

};

export default Header;