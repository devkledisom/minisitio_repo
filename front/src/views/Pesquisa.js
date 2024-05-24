
import 'bootstrap/dist/css/bootstrap.min.css';
/* import 'font-awesome/css/font-awesome.min.css'; */

import Mosaico from '../components/Mosaico';
import Busca from '../components/Busca';
import Resultados from '../components/Resultados';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import { useEffect } from 'react';

function Pesquisa() {





  return (
    <div className="App">
      <header>
        <Mosaico logoTop={true} borda="none" />
      </header>
      <main>
        <Busca />
        <Resultados />
      </main>

      <footer>
        <Nav styleClass="Nav" />
        <Footer />
      </footer>



    </div >
  );
}

export default Pesquisa;
