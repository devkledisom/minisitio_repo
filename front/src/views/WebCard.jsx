import React, { useEffect, useState } from 'react';
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
    const [ufs, setUfs] = useState([]);
    const [cadernos, setCadernos] = useState([]);

    useEffect(() => {
        //document.querySelector('.caderno').style.filter = "blur(3px)";

        let caderno = codCaderno;
        let estado = codUf;

        if (caderno != null && estado != null) {
            fetch(`${masterPath.url}/admin/anuncio/classificado/${caderno}/${estado}`)
                .then(x => x.json())
                .then(res => {
                    if (res.success) {

                        setMosaicoImg(res.mosaico);
                        //console.log("caderno geral", res);

                    } else {

                    }

                })
        }

        fetch(`${masterPath.url}/ufs`)
            .then((x) => x.json())
            .then((res) => {
                setUfs(res);
               
            })

        fetch(`${masterPath.url}/cadernos`)
            .then((x) => x.json())
            .then((res) => {
                setCadernos(res)
                console.log(res)
                
            })


    }, [codCaderno, codUf]);

    const ufAtual = () => {
       const ufLocalizada = ufs.find(uf => uf.id_uf == codUf);
       //console.log("daskjdafhadlfhdsklfghasdi", ufLocalizada)
       if(ufLocalizada) {
        return ufLocalizada.sigla_uf;
       }
       
    }
    const cadAtual = () => {
       const cadLocalizada = cadernos.find(cad => cad.codCaderno == codCaderno);
       //console.log("daskjdafhadlfhdsklfghasdi", cadLocalizada, codCaderno);
       if(cadLocalizada) {
        return cadLocalizada.nomeCaderno;
       }
       
    }

    return (
        <div className="App">
            <header>
                {/* <Mosaico logoTop={true} borda="none" mosaicoImg={true} /> */}
                <MosaicoWebCard logoTop={true} borda="flex" mosaicoImg={mosaicoImg} nmAnuncio={nmAnuncio} />
            </header>
            <main>
                <Busca />
                <h1 id="title-caderno" className='py-2'>Caderno {cadAtual()} - {ufAtual()}</h1>
               {/*  <h1 id="title-caderno" className='py-2'>Caderno {localStorage.getItem("caderno: ")} - {localStorage.getItem("uf: ")}</h1> */}
                <Navegacao />
                <FullWebCard setCodCaderno={setCodCaderno} setCodUf={setCodUf} setNmAnuncio={setNmAnuncio} />
                {console.log(codUf, codCaderno, nmAnuncio)}
            </main>

            <footer>
                <Nav styleClass="Nav" />
                <Footer />
            </footer>
        </div >
    );
}

export default WebCard;
