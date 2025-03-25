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
  const [qtdaPerfil, setQtdaPerfil] = useState(0);

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
          setQtdaPerfil(res.totalRegistros);
          //setLoading(false);
          //document.querySelector('.caderno').style.filter = "none";
        }

      }) 
      
    /* fetch(`${masterPath.url}/admin/anuncio/classificado/${caderno}/${estado}`)
      .then(x => x.json())
      .then(res => {
        //console.log(res)
        if (res.success) {
          //setClassificados(res.data);
          setPathImg(res.teste.rows);
          setMosaicoImg(res.mosaico);
          //setLoading(false);
          //document.querySelector('.caderno').style.filter = "none";
        }

      })  */



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
      setClassificados(res.data);
      setLoading(false);
      document.querySelector('.caderno').style.filter = "none";
    })  
    //fetchDataInBatches(`${masterPath.url}/admin/lista/test/${caderno}/${estado}`)
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


    async function fetchDataInBatches(url) {
      const response = await fetch(url);
  
      if (!response.ok) {
          console.error("Erro ao buscar os dados:", response.status);
          return;
      }
  
      const reader = response.body.getReader(); // Ler os dados como stream
      const decoder = new TextDecoder(); // Decodificar os chunks para texto
      let receivedText = ''; // Armazenar o texto recebido
      let isFirst = true;
  
      console.log("Iniciando recepção de dados...");
  
      while (true) {
          const { value, done } = await reader.read(); // Lê o próximo chunk
  
          if (done) {
              console.log("Fim da transmissão.");
              break; // Interrompe quando não há mais dados
          }
  
          receivedText += decoder.decode(value, { stream: true }); // Decodifica o chunk
  
          // Processa os lotes individualmente para exibir ou manipular no front
          if (receivedText.includes(',')) {
              const parts = receivedText.split(','); // Divide os objetos por vírgula
              receivedText = parts.pop(); // Armazena o último pedaço que pode estar incompleto
  
              parts.forEach((item, index) => {
                  const obj = JSON.parse(isFirst && index === 0 ? item.slice(1) : item); // Remove o `[` do primeiro item
                  console.log(obj); // Faça o que for necessário com o objeto
                  isFirst = false;
              });
          }
      }
  
      // Trata o último pedaço se for necessário
      if (receivedText) {
          const lastObj = JSON.parse(receivedText.slice(0, -1)); // Remove o `]` do último item
          console.log(lastObj);
      }
  }

  const selectCapa = (capa) => {
    let result = pathImg.find((item) => item.codAtividade == capa);

    if(!result) return null;

    return result;
  }
  

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
                <a href={`/cadernos/${caderno}_${estado}?caderno=${caderno}&estado=${estado}`} className="btn proximo btn-class" onClick={buscarTodosClassificado}><i className="fa fa-file-text"></i> Ver caderno classificado</a>
              </div>

            </div>


            <div className="row lista">
              <ul className="col-md-6 col-sm-6 col-xs-12 list-unstyled sumario">
                <li className="titulo">
                  <h2>Sumário do classificado</h2>
                  <span>({qtdaPerfil} Perfis / Espaços)</span>
                </li>
                <li className="classificado">
                  <ul className="list-unstyled">
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
                        <a href={`/caderno/${item.descAnuncio}_${item.codAnuncio}_${item.codUf}?page=1&book=${item.codCaderno}&id=${item.codAnuncio}&index=${item.page}&caderno=${item.codCaderno}&estado=${item.codUf}`} onClick={definePage}>
                          <div>{item.codAtividade}</div>
                           <span>{item.quantidade} resultado</span>
                        </a>
                      </li>
                      
                    ))}
                  </ul>
                </li>
                 <CardClassificado title={"UTILIDADE PÚBLICA"} pathImg={capa06} data={selectCapa("UTILIDADE PÚBLICA")} />
                <CardClassificado title={"CÂMARA DE VEREADORES/CÂMARA DISTRITAL"} pathImg={capa07} data={selectCapa("CÂMARA DE VEREADORES - CÂMARA DISTRITAL")} />
                <CardClassificado title={"INFORMAÇÕES"} pathImg={capa08} data={selectCapa("INFORMAÇÕES")} />
              </ul>
              <ul className="col-md-6 col-sm-6 col-xs-12 list-unstyled teste">
                <CardClassificado title={"ADMINISTRAÇÃO REGIONAL / PREFEITURA"} pathImg={capa01} data={selectCapa("ADMINISTRAÇÃO REGIONAL / PREFEITURA")} />
                <CardClassificado title={"EMERGÊNCIA"} pathImg={capa02} data={selectCapa("EMERGÊNCIA")} />
                <CardClassificado title={"HOSPITAIS PÚBLICOS"} pathImg={capa03} data={selectCapa("HOSPITAIS PÚBLICOS")} />
                <CardClassificado title={"SECRETARIA DE TURISMO"} pathImg={capa04} data={selectCapa("SECRETARIA DE TURISMO")} />
                <CardClassificado title={"EVENTOS NA CIDADE"} pathImg={capa05} data={selectCapa("EVENTOS NA CIDADE")} /> 
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
