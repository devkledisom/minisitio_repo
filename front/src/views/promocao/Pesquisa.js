
import 'bootstrap/dist/css/bootstrap.min.css';
/* import 'font-awesome/css/font-awesome.min.css'; */

import Mosaico from '../../components/Mosaico';
import Busca from '../../components/Busca';
import Resultados from '../../components/promocao/Resultados';
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

function Pesquisa() {

  const { caderno, estado } = useParams();

  return (
    <div className="App">
      <header>
        <Mosaico logoTop={true} borda="none" />
      </header>
      <main>
        <Busca uf={estado} caderno={caderno} />
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
