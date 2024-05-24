
import 'bootstrap/dist/css/bootstrap.min.css';
/* import 'font-awesome/css/font-awesome.min.css'; */

import Mosaico from '../components/Mosaico';
import Busca from '../components/Busca';
import Nav from '../components/Nav';
import Footer from '../components/Footer';

function Home() {
  return (
    <div className="App">
      <Mosaico logoTop={false} />
      <div className="d-flex justify-content-center align-items-center" style={{ "marginTop": "5%" }}>
        <a href="/"><img src="../assets/img/logo.png" className="" /></a>
      </div>

      <Busca paginaAtual={"home"} />
      <Nav styleClass="none" />
      <div className="d-flex justify-content-center align-items-center" style={{ height: "500px" }}>
        <a href="/"><img src="../assets/img/logo.png" className="" /></a>
      </div>
      <Footer />
    </div >
  );
}

export default Home;
