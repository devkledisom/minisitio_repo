import { useEffect, useState, useRef } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { masterPath } from '../config/config';



//import 'bootstrap/dist/css/bootstrap.min.css';
/* import 'font-awesome/css/font-awesome.min.css'; */
import '../assets/css/cadernoClassificado.css';

import Mosaico from '../components/Mosaico';
import Busca from '../components/Busca';
import MiniWebCard from '../components/MiniWebCard';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import MsgProgramada from '../components/MsgProgramada';
import MiniWebCardSimples from '../components/MiniWebCardSimples';
import CardClassificado from './classificados/CardClassificado';
import Letter from './classificados/Letter';

//CONTEXT
import { useBusca } from '../context/BuscaContext';


function Caderno() {

  //contexto
  //const { tema, setTema } = useTema();
  const { result, setResult } = useBusca();

  const [nomeAtividade, setNomeAtividade] = useState([]);
  const [minisitio, setMinisitio] = useState([]);
  const [classificados, setClassificados] = useState([]);
  const [pathImg, setPathImg] = useState([]);
  const [mosaicoImg, setMosaicoImg] = useState([]);
  const [smoot, setSmoot] = useState(false);

  const location = useLocation();

  const pegarParam = new URLSearchParams(location.search);

  const book = pegarParam.get('book');
  const id = pegarParam.get('id');

  const { caderno, estado } = useParams();
  const navigate = useNavigate();

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

    //buscarAtividade();
  }, [book]);


  const teste = useRef(null)

  useEffect(() => {
    //console.log("motre", teste.current)

    fetch(`${masterPath.url}/admin/anuncio/classificado/${caderno}/${estado}`)
      .then(x => x.json())
      .then(res => {
        if (res.success) {
          setClassificados(res.data);
          setPathImg(res.teste.rows);
          setMosaicoImg(res.mosaico);
          console.log("caderno geral", res);
        } else {

        }

      })

  }, []);

  /*
  * capa01 = ADMINISTRAÇÃO REGIONAL / PREFEITURA
  * capa02 = EMERGÊNCIA
  * capa03 = HOSPITAIS PÚBLICOS
  * capa04 = SECRETARIA DE TURISMO
  * capa05 = EVENTOS NA CIDADE
  * capa06 = UTILIDADE PÚBLICA
  * capa07 = CÂMARA DE VEREADORES/CÂMARA DISTRITAL
  * capa08 = INFORMAÇÕES
  */

  let capa01 = pathImg[0] ? pathImg[0].descImagem : null;
  let capa02 = pathImg[1] ? pathImg[1].descImagem : null;
  let capa03 = pathImg[2] ? pathImg[2].descImagem : null;
  let capa04 = pathImg[3] ? pathImg[3].descImagem : null;
  let capa05 = pathImg[4] ? pathImg[4].descImagem : null;
  let capa06 = pathImg[5] ? pathImg[5].descImagem : null;
  let capa07 = pathImg[6] ? pathImg[6].descImagem : null;
  let capa08 = pathImg[7] ? pathImg[7].descImagem : null;

  function buscarTodosClassificado() {
    fetch(`${masterPath.url}/admin/espacos/read?page=${1}`)
      .then((x) => x.json())
      .then((res) => {
        console.log(res);
        setResult(res.anuncios);
        navigate("/caderno/maceio_27");
      })
    console.log("very")
  };


  return (
    <div className="App">

      <header>
        <Mosaico logoTop={true} borda="flex" mosaicoImg={mosaicoImg} />
      </header>
      <main>
        <Busca paginaAtual={"caderno"} />
        <h1 id="title-caderno" className='py-2'>Caderno {localStorage.getItem("caderno: ")} - {localStorage.getItem("uf: ")}</h1>
        <h2 className='py-4'>Existem {minisitio.totalPaginas} páginas no Caderno {localStorage.getItem("caderno: ")} - {localStorage.getItem("uf: ")}. Você está vendo a página {minisitio.paginaAtual}.</h2>

        <div className='container caderno'>
          <div className='col-md-12'>

            <div className='row'>
              <div className="col-md-12 col-xs-12 text-center">
                {/* <button onClick={buscarTodosClassificado}>Ver caderno classificado</button> */}
                <a href={`/caderno/${caderno}_${estado}?caderno=${caderno}&estado=${estado}`} className="btn proximo" onClick={buscarTodosClassificado}><i className="fa fa-file-text"></i> Ver caderno classificado</a>
              </div>

            </div>


            <div className="row lista">
              <ul className="col-md-6 col-sm-6 col-xs-12 list-unstyled">
                <li className="titulo">
                  <h2>Sumário do classificado</h2>
                </li>
                <li className="classificado">
                  <ul className="list-unstyled">
                    {classificados.map(item => (
                      /* "/caderno/maceio/ziiz_569885_27" */
                      <li key={item.id}>
                        <a href={`/caderno/${item.nomeAnuncio}_${item.codigoAnuncio}_${item.estado}?page=1&book=${item.caderno}&id=${item.codigoAnuncio}`}>

                          {item.nomeAtividade} <span>{item.qtdAtividade} resultado</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
                <CardClassificado title={"UTILIDADE PÚBLICA"} pathImg={capa06} />
                <CardClassificado title={"CÂMARA DE VEREADORES/CÂMARA DISTRITAL"} pathImg={capa07} />
                <CardClassificado title={"INFORMAÇÕES"} pathImg={capa08} />
              </ul>
              <ul className="col-md-6 col-sm-6 col-xs-12 list-unstyled teste">
                <CardClassificado title={"ADMINISTRAÇÃO REGIONAL / PREFEITURA"} pathImg={capa01} />
                <CardClassificado title={"EMERGÊNCIA"} pathImg={capa02} />
                <CardClassificado title={"HOSPITAIS PÚBLICOS"} pathImg={capa03} />
                <CardClassificado title={"SECRETARIA DE TURISMO"} pathImg={capa04} />
                <CardClassificado title={"EVENTOS NA CIDADE"} pathImg={capa05} />
              </ul>

            </div>
            <Letter />
          </div>
        </div>



      </main>

      <footer>
        <Nav styleclassName="Nav" />
        <Footer />
      </footer>
    </div >
  );
}

export default Caderno;
