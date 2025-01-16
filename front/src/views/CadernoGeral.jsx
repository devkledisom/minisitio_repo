import { useEffect, useState, useRef } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { masterPath } from '../config/config';



//import 'bootstrap/dist/css/bootstrap.min.css';
/* import 'font-awesome/css/font-awesome.min.css'; */
import '../assets/css/cadernoClassificado.css';

import MosaicoWebCard from '../components/MosaicoWebCard';
import Busca from '../components/Busca';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import CardClassificado from './classificados/CardClassificado';
import Letter from './classificados/Letter';

//CONTEXT
import { useBusca } from '../context/BuscaContext';


function Caderno(props) {

  //contexto
  //const { tema, setTema } = useTema();
  const { result, setResult } = useBusca();

  const [nomeAtividade, setNomeAtividade] = useState([]);
  const [minisitio, setMinisitio] = useState([]);
  const [classificados, setClassificados] = useState([]);
  const [pathImg, setPathImg] = useState([]);
  const [mosaicoImg, setMosaicoImg] = useState([]);
  const [smoot, setSmoot] = useState(false);
  const [loading, setLoading] = useState(false);
  const [nmAnuncio, setNmAnuncio] = useState(null);

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
    setLoading(true);
    document.querySelector('.caderno').style.filter = "blur(3px)";

    fetch(`${masterPath.url}/admin/anuncio/classificado/${caderno}/${estado}`)
      .then(x => x.json())
      .then(res => {
        //console.log(res)
        if (res.success) {
          //setClassificados(res.data);
          setPathImg(res.teste.rows);
          setMosaicoImg(res.mosaico);
          console.log("caderno geral", res);
          setLoading(false);
          document.querySelector('.caderno').style.filter = "none";
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

  function definePage(param) {
    const itemIndex = param;
    const itemsPerPage = 10;

    const pageNumber = Math.ceil(itemIndex / itemsPerPage);

    //console.log(pageNumber);
    return pageNumber;
  }

  useEffect(() => {
    fetch(`${masterPath.url}/admin/lista/test/${caderno}/${estado}`)
    .then((x) => x.json())
    .then((res) => {
      console.log(res);
      setClassificados(res);
      setLoading(false);
      document.querySelector('.caderno').style.filter = "none";
   /*    setResult(res.anuncios);
      navigate("/caderno/maceio_27"); */
    })
  }, [])

  const capas = [
    "ADMINISTRAÇÃO REGIONAL / PREFEITURA",
    "EMERGÊNCIA",
    "UTILIDADE PÚBLICA",
    "HOSPITAIS PÚBLICOS",
    "CÂMARA DE VEREADORES - CÂMARA DISTRITAL",
    "SECRETARIA DE TURISMO",
    "INFORMAÇÕES",
    "EVENTOS NA CIDADE"
    ]

  return (
    <div className="App caderno-geral">

      {loading &&
        <button class="buttonload" style={{ display: "block" }}>
          <i class="fa fa-spinner fa-spin"></i>Carregando
        </button>
      }


      <header>
        {/* <Mosaico logoTop={true} borda="flex" mosaicoImg={mosaicoImg} /> */}
        <MosaicoWebCard logoTop={true} borda="flex" mosaicoImg={mosaicoImg} nmAnuncio={window.location.href} />
      </header>
      <main>
        <Busca paginaAtual={"caderno"} />
        <h1 id="title-caderno" className='py-2 title-caderno'>Caderno {localStorage.getItem("caderno: ")} - {localStorage.getItem("uf: ")}</h1>
        {/*         <h2 className='py-4'>Existem {minisitio.totalPaginas} páginas no Caderno {localStorage.getItem("caderno: ")} - {localStorage.getItem("uf: ")}. Você está vendo a página {minisitio.paginaAtual}.</h2>
 */}
        <div className='container caderno'>
          <div className='col-md-12'>

            <div className='row py-3'>
              <div className="col-md-12 col-xs-12 text-center">
                {/* <button onClick={buscarTodosClassificado}>Ver caderno classificado</button> */}
                <a href={`/caderno/${caderno}_${estado}?caderno=${caderno}&estado=${estado}`} className="btn proximo btn-class" onClick={buscarTodosClassificado}><i className="fa fa-file-text"></i> Ver caderno classificado</a>
              </div>

            </div>


            <div className="row lista">
              <ul className="col-md-6 col-sm-6 col-xs-12 list-unstyled">
                <li className="titulo">
                  <h2>Sumário do classificado</h2>
                </li>
                <li className="classificado">
                  <ul className="list-unstyled">
                    {/* {console.log(classificados)} */}
                    {classificados.map(item => (
                      /* "/caderno/maceio/ziiz_569885_27" */
                      capas.includes(item.codAtividade) ?
                      <li key={item.id}>
                        <a href="#">
                        <div>{item.codAtividade}</div>
                        <span>{item.quantidade} resultado</span>
                        </a>
                      </li>
                      :
                      <li key={item.id}>
                        <a href={`/caderno/${item.descAnuncio}_${item.codAnuncio}_${item.codUf}?page=1&book=${item.codCaderno}&id=${item.codAnuncio}&caderno=${item.codCaderno}&estado=${item.codUf}`} onClick={definePage}>
                          <div>{item.codAtividade}</div>
                           <span>{item.quantidade} resultado</span>
                        </a>
                      </li>
                      
                    ))}
                  </ul>
                </li>
                <CardClassificado title={"UTILIDADE PÚBLICA"} pathImg={capa06} data={pathImg[5]} />
                <CardClassificado title={"CÂMARA DE VEREADORES/CÂMARA DISTRITAL"} pathImg={capa07} data={pathImg[6]} />
                <CardClassificado title={"INFORMAÇÕES"} pathImg={capa08} data={pathImg[7]} />
              </ul>
              <ul className="col-md-6 col-sm-6 col-xs-12 list-unstyled teste">
                <CardClassificado title={"ADMINISTRAÇÃO REGIONAL / PREFEITURA"} pathImg={capa01} data={pathImg[0]} />
                <CardClassificado title={"EMERGÊNCIA"} pathImg={capa02} data={pathImg[1]} />
                <CardClassificado title={"HOSPITAIS PÚBLICOS"} pathImg={capa03} data={pathImg[2]} />
                <CardClassificado title={"SECRETARIA DE TURISMO"} pathImg={capa04} data={pathImg[3]} />
                <CardClassificado title={"EVENTOS NA CIDADE"} pathImg={capa05} data={pathImg[4]} />
              </ul>

            </div>
            <Letter estado={estado} caderno={caderno}/>
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
