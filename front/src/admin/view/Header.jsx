import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../assets/css/header.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import { AuthContext } from '../../context/AuthContext';

function Header() {

    const { user } = useContext(AuthContext);

    function sair() {
        sessionStorage.removeItem('authTokenMN');
        sessionStorage.removeItem('userLogged');
        sessionStorage.removeItem('userTokenAccess');
    };

    let usuarioLogado = sessionStorage.getItem('userLogged');


    const navigate = useNavigate();
    const location = useLocation();

    const handleClick = (e) => {

        const caminhoCompleto = e.target.href;
        // Cria um objeto URL para analisar a URL
        const url = new URL(caminhoCompleto);

        // Obtém o pathname
        const pathname = url.pathname;

        if (location.pathname === pathname) {
            // Evita o comportamento padrão do Link
            e.preventDefault();

            // Redireciona para outra rota e depois retorna
            navigate('/temp-route');
            setTimeout(() => navigate(pathname), 0);
        }
    };

    return (
        <div className='header header-bg navbar navbar-fixed-top'>
            <div className="container-fluid header-main">
                {/* <a className="brand" href="#">MINISITIO</a> */}
                <div className="row col-md-12">
                    <Link className="nav-link brand col-md-1" to="/admin" >
                        <a href="/"><img src="../../assets/img/logo.png" alt="MINISITIO" width="50" /></a>
                    </Link>
                    <ul className="nav col-md-10 d-flex justify-content-center" style={{
                        fontSize: '15px'
                    }}>
                        <li className="nav-item">
                            {/* <a className="nav-link" href="#">Usuários</a> */}
                            <Link className="nav-link" to="/admin/users" onClick={handleClick}>Usuários</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/admin/cadernos" onClick={handleClick}>Cadernos</Link>
                        </li>
                        {/*desativado*/}
                        {/*     <li className="nav-item">
                            <Link className="nav-link" to="/info/cadernos">Informações de Cadernos</Link>
                        </li> */}
                        <li className="nav-item">
                            <Link className="nav-link" to="/admin/atividades" onClick={handleClick}>Atividades</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/admin/espacos" onClick={handleClick}>Espaços</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/admin/desconto" onClick={handleClick}>Gerenciar IDs</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/admin/pagamentos" onClick={handleClick}>Pagamentos</Link>
                        </li>
                        {/*       <li className="nav-item">
                            <a className="nav-link" href="#">Relatórios Funil</a>
                        </li> */}
                        <li className="nav-item">
                            <Link className="nav-link" to="/admin/pin" onClick={handleClick}>PINs</Link>
                            {/* <a className="nav-link" href="#">PINs</a> */}
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/" onClick={sair}>Sair</a>
                        </li>
                    </ul>
                    <div className="btn-group-header pull-right col-md-1">
                        <a href="#" data-toggle="dropdown" className="btn-quit dropdown-toggle">
                            <i className="icon-user"></i> {user.descNome} <span className="caret"></span>
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