import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
/* import 'font-awesome/css/font-awesome.min.css'; */
import '../assets/css/caderno.css';
import { masterPath } from '../config/config';

import MosaicoWebCard from '../components/MosaicoWebCard';
import Mosaico from '../components/Mosaico';
import Busca from '../components/Busca';
import MiniWebCard from '../components/MiniWebCard';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import Navegacao from '../components/Navegacao';
import FullWebCard from '../components/FullWebCard';

//LIB
//import { Helmet, HelmetProvider } from "react-helmet-async";
import { useMetaTags } from 'react-metatags-hook';



function WebCard() {
    const [mosaicoImg, setMosaicoImg] = useState([]);
    const [codCaderno, setCodCaderno] = useState(null);
    const [codUf, setCodUf] = useState(null);
    //const [ufs, setUfs] = useState([]);
    //const [cadernos, setCadernos] = useState([]);

    /*     useMetaTags({
            title: 'Meu Título',
            description: 'Minha descrição',
            keywords: 'palavras-chave, exemplo',
            canonical: 'https://www.meusite.com/minha-pagina',
            openGraph: {
                title: 'Page Title',
                image: 'https://minisitio.com.br/api/files/imagem%20para%20GMN%20-%2002.png',
                site_name: 'My Site',
              }
          }); */

    useEffect(() => {
        fetch(`${masterPath.url}/admin/anuncio/classificado/${codCaderno}/${codUf}`)
            .then(x => x.json())
            .then(res => {
                if (res.success) {
                    setMosaicoImg(res.mosaico);
                }

            })
    }, []);

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
                    }
                })
        }
        /* 
                fetch(`${masterPath.url}/ufs`)
                    .then((x) => x.json())
                    .then((res) => {
                        setUfs(res);
                       
                    })
        
                fetch(`${masterPath.url}/cadernos`)
                    .then((x) => x.json())
                    .then((res) => {
                        setCadernos(res)                
                    }) */


    }, [codCaderno, codUf]);

    /*     const ufAtual = () => {
           const ufLocalizada = ufs.find(uf => uf.sigla_uf == codUf);
           //console.log("daskjdafhadlfhdsklfghasdi", ufLocalizada)
           if(ufLocalizada) {
            return ufLocalizada.sigla_uf;
           }
           
        }
        const cadAtual = () => {
           const cadLocalizada = cadernos.find(cad => cad.nomeCaderno == codCaderno);
           //console.log("daskjdafhadlfhdsklfghasdi", cadLocalizada, codCaderno);
           if(cadLocalizada) {
            return cadLocalizada.nomeCaderno;
           }
           
        } */

    return (
        // <HelmetProvider>
        <div className="App">

            {/*       <Helmet>
                    <title>Meu Site - Página Inicial</title>
                    <meta name="description" content="Esta é a descrição da minha página para SEO." />
                    <meta property="og:title" content="Meu Site" />
                    <meta property="og:description" content="Descrição otimizada para redes sociais." />
                    <meta property="og:image" content={`https://minisitio.com.br/api/files/imagem%20para%20GMN%20-%2002.png`} />
                </Helmet> */}

            <header>
                <Mosaico logoTop={true} borda="none" mosaicoImg={true} />
                {/* <MosaicoWebCard logoTop={true} borda="flex" mosaicoImg={mosaicoImg} nmAnuncio={nmAnuncio} /> */}
            </header>
            <main>
                <Busca uf={codUf} caderno={codCaderno} />

                <h1 id="title-caderno" className='py-2'>Caderno {codCaderno} - {codUf}</h1>
                {/*  <h1 id="title-caderno" className='py-2'>Caderno {localStorage.getItem("caderno: ")} - {localStorage.getItem("uf: ")}</h1> */}

                <div className='container text-center my-4 new-mosaico'>
                    <img src={`${masterPath.url}/files/mosaico/${mosaicoImg}`} alt="mosaico" />
                </div>

                <Navegacao />
                <FullWebCard setCodCaderno={setCodCaderno} setCodUf={setCodUf} />
            </main>

            <footer>
                <Nav styleClass="Nav" />
                <Footer />
            </footer>
        </div >
        //</HelmetProvider>
    );
}

export default WebCard;
