import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { masterPath } from '../config/config';

//lib
import Masonry from 'react-masonry-css';


import 'bootstrap/dist/css/bootstrap.min.css';
/* import 'font-awesome/css/font-awesome.min.css'; */
import '../assets/css/caderno.css';

import Mosaico from '../components/Mosaico';
import Busca from '../components/Busca';
import MiniWebCard from '../components/MiniWebCard';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import MsgProgramada from '../components/MsgProgramada';
import MiniWebCardSimples from '../components/MiniWebCardSimples';

function Caderno() {

  const [nomeAtividade, setNomeAtividade] = useState([]);
  const [minisitio, setMinisitio] = useState([]);
  const [smoot, setSmoot] = useState(false);

  const location = useLocation();

  const pegarParam = new URLSearchParams(location.search);

  const book = pegarParam.get('book');
  const id = pegarParam.get('id');

  useEffect(() => {
    async function buscarAtividade() {
      try {
        const res = await fetch(`${masterPath.url}/anuncios/${book}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          }
        });

        const minisitio = await res.json();
      
        console.log(minisitio.anuncios.length)
       
        setMinisitio(minisitio);

        const codigosAtividades = minisitio.anuncios.map((item) => item.codAtividade);
        const valores = [...new Set(codigosAtividades)];

        const codigosTable = await fetch(`${masterPath.url}/atividade/6`).then(response => response.json());
        const atividadesEncontradas = codigosTable.filter((item) => valores.includes(item.id));

        setNomeAtividade(atividadesEncontradas);
        
        console.log("Final", atividadesEncontradas, nomeAtividade);
      } catch (error) {
        console.error('Erro ao buscar atividades:', error);
      }
    }

    buscarAtividade();
  }, [book]);


 const teste = useRef(null)

   useEffect(() => {
    console.log("motre", teste.current)
    //console.log(document.querySelector(`#item_${id}`))
    
 
    const interID = setInterval(() => {
      if(document.querySelector(`#item_${id}`)) {
        console.log(document.querySelector(`#item_${id}`))
        document.querySelector(`#item_${id}`).classList = "pulsating-border"
     
        document.querySelector(`#item_${id}`).scrollIntoView({ behavior: 'smooth' })
        clearInterval(interID);
      }
    }, 1000)
      
    
    
  }, []) 

/*   if(smoot) {
    alert()
    
  } */

  return (
    <div className="App">

      <header>
        <Mosaico logoTop={true} borda="none" />
      </header>
      <main>
        <Busca paginaAtual={"caderno"} />
        <h1 id="title-caderno" className='py-2'>Caderno SAO PAULO - ZONA CENTRAL - SP</h1>
        <h2 className='py-4'>Existem {minisitio.totalPaginas} páginas no Caderno SAO PAULO - ZONA CENTRAL - SP. Você está vendo a página {minisitio.paginaAtual}.</h2>
        <div className="container">
          <div className="row p-3">
            <div className="col-md-6 text-end">
              <button id="btn-prev">
                <i className="fa fa-arrow-left mx-2"></i>
                Anterior
              </button>
            </div>
            <div className="col-md-6 text-start">
              <button id="btn-next">
                Próximo
                <i className="fa fa-arrow-right mx-2"></i>
              </button>
            </div>
          </div>
          {/* teste row */}
          <div className="row p-3">

            <div className="col-md-6 w-100 secao-anuncios">

              <div
                className="masonry-layout"
              >
                {nomeAtividade.length > 0 && nomeAtividade.map((item, index) => (

                  /* ((index + 1) % 5 === 0) ? <MsgProgramada /> : "" */


                  (item != undefined || item.length > 0)
                    ?
                    <div id={item.id} key={item.id} className="atividade-title px-2" >
                      <h2 className='bg-yellow'>
                        {item.atividade}
                      </h2>
                      {
                        
                        minisitio.anuncios.map((anuncio) => {
                          //console.log(anuncio)

                          if(anuncio.codTipoAnuncio == 1) {
                            return <MiniWebCardSimples />
                          } else {
                            if (anuncio.codAtividade == item.id) {
                              return <MiniWebCard key={anuncio.codAnuncio} id={anuncio.codAnuncio} data={minisitio} codImg={anuncio.descImagem} ref={teste}/>
                            } <MsgProgramada />
                            //return <MiniWebCard key={anuncio.codAnuncio} id={anuncio.codAnuncio} data={minisitio} />
                          }
                          //console.log("compr", i)
                      /*     if(i == 9){
                            setSmoot(true)
                          } */
                         

                          return null; 
                        })
                      }
                             {
                    // Verifica se não é o último card e se não há anúncio associado à próxima atividade
                    index !== nomeAtividade.length - 1 && minisitio.anuncios.every(anuncio => anuncio.codAtividade !== nomeAtividade[index + 1].id) && 
                    <MsgProgramada />
                }
                    </div>
                    :
                    <h1>erro</h1>  
                    ))}
              </div>


            </div>
          </div>
        </div>
      </main>

      <footer>
        <Nav styleClass="Nav" />
        <Footer />
      </footer>
    </div >
  );
}

export default Caderno;
