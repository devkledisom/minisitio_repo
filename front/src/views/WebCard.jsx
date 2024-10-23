import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
/* import 'font-awesome/css/font-awesome.min.css'; */
import '../assets/css/caderno.css';
import { masterPath } from '../config/config';

import MosaicoWebCard from '../components/MosaicoWebCard';
import Busca from '../components/Busca';
import MiniWebCard from '../components/MiniWebCard';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import Navegacao from '../components/Navegacao';
import FullWebCard from '../components/FullWebCard';



function WebCard() {
    const [mosaicoImg, setMosaicoImg] = useState([]);
    const [codCaderno, setCodCaderno] = useState(null);
    const [codUf, setCodUf] = useState(null);
    const [nmAnuncio, setNmAnuncio] = useState(null);

     useEffect(() => {
        //document.querySelector('.caderno').style.filter = "blur(3px)";

        let caderno = codCaderno;
        let estado = codUf;

        if(caderno != null && estado != null) {
            fetch(`${masterPath.url}/admin/anuncio/classificado/${caderno}/${estado}`)
            .then(x => x.json())
            .then(res => {
              if (res.success) {
   
                setMosaicoImg(res.mosaico);
                console.log("caderno geral", res);
    
              } else {
      
              }
      
            }) 
        }
       
    
      }, [codCaderno, codUf]); 

    return (
        <div className="App">
            <header>
                {/* <Mosaico logoTop={true} borda="none" mosaicoImg={true} /> */}
                <MosaicoWebCard logoTop={true} borda="flex" mosaicoImg={mosaicoImg} nmAnuncio={nmAnuncio} />
            </header>
            <main>
                <Busca />
                <h1 id="title-caderno" className='py-2'>Caderno {localStorage.getItem("caderno: ")} - {localStorage.getItem("uf: ")}</h1>
                <Navegacao />
                <FullWebCard setCodCaderno={setCodCaderno} setCodUf={setCodUf} setNmAnuncio={setNmAnuncio} />
            </main>

            <footer>
                <Nav styleClass="Nav" />
                <Footer />
            </footer>
        </div >
    );
}

export default WebCard;
