import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';

import Mosaico from '../components/Mosaico';
import Busca from '../components/Busca';
import ComponentLogin from '../admin/components/ComponentLogin';
import Resultados from '../components/Resultados';
import Nav from '../components/Nav';
import Footer from '../components/Footer';

function login() {
    return (
        <div className="login">
            <header>
                <Mosaico logoTop={true} borda="none" />
            </header>
            <main>
                <Busca />
                <ComponentLogin />
            </main>

            <footer>
                <Nav styleClass="Nav" />
                <Footer />
            </footer>

        </div>
    )
}

export default login;