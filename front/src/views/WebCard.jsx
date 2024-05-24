
import 'bootstrap/dist/css/bootstrap.min.css';
/* import 'font-awesome/css/font-awesome.min.css'; */
import '../assets/css/caderno.css';

import Mosaico from '../components/Mosaico';
import Busca from '../components/Busca';
import MiniWebCard from '../components/MiniWebCard';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import Navegacao from '../components/Navegacao';
import FullWebCard from '../components/FullWebCard';



function WebCard() {



    return (
        <div className="App">
            <header>
                <Mosaico logoTop={true} borda="none" mosaicoImg={true} />
            </header>
            <main>
                <Busca />
                <h1 id="title-caderno" className='py-2'>Caderno SAO PAULO - ZONA CENTRAL - SP</h1>
                <Navegacao />
                <FullWebCard />
            </main>

            <footer>
                <Nav styleClass="Nav" />
                <Footer />
            </footer>
        </div >
    );
}

export default WebCard;
