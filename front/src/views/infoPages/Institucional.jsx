import { useEffect, useState, useRef } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { masterPath } from '../../config/config';


import '../../assets/css/PainelAdminAnunciante.css';
import '../../assets/css/infoPages/institucional.css';

import Mosaico from '../../components/Mosaico';
import Busca from '../../components/Busca';
import MiniWebCard from '../../components/MiniWebCard';
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';
import MsgProgramada from '../../components/MsgProgramada';
import MiniWebCardSimples from '../../components/MiniWebCardSimples';

//CONTEXT
import { useBusca } from '../../context/BuscaContext';

//COMPONENTS
import Listar from '../painelAnuciante/Listar';
import Editar from '../painelAnuciante/Editar';
import UserNav from '../painelAnuciante/UserNav';
import DadosPessoais from '../painelAnuciante/DadosPessoais';


function Institucional() {

    //contexto
    //const { tema, setTema } = useTema();
    const { result, setResult } = useBusca();

    const [nomeAtividade, setNomeAtividade] = useState([]);
    const [minisitio, setMinisitio] = useState([]);
    const [classificados, setClassificados] = useState([]);
    const [pathImg, setPathImg] = useState([]);
    const [mosaicoImg, setMosaicoImg] = useState([]);
    const [smoot, setSmoot] = useState(false);
    const [showSpinner, setShowSpinner] = useState(false);
    const [anuncios, setAnuncios] = useState([]);
    const [action, setAction] = useState(1);
    const [espacoId, setEspacoId] = useState(null);

    const location = useLocation();

    const pegarParam = new URLSearchParams(location.search);

    const book = pegarParam.get('book');
    const id = pegarParam.get('id');
    const { cpf } = useParams();

    const navigate = useNavigate();

    useEffect(() => {
        /*     async function buscarAtividade() {
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
            } */

        //buscarAtividade();
    }, [book]);


    const teste = useRef(null)

    useEffect(() => {
        console.log("motre", teste.current)
        //buscarAnuncioId();

    }, []);



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
                //navigate("/caderno/maceio_27");
            })
        console.log("very")
    };

    function buscarAnuncioId(e) {
        setShowSpinner(true);
        let nuDocumento = "";

        /*       if (cpf.length == 11) {
                  nuDocumento = cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
              } else {
                  nuDocumento = cpf.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
              } */

        const campoPesquisa = document.getElementById('buscar').value;

        fetch(`${masterPath.url}/admin/anuncio/buscar/?search=${nuDocumento}`)
            .then((x) => x.json())
            .then((res) => {
                console.log(res)
                if (res.success) {
                    setAnuncios(res.message.anuncios);
                    setShowSpinner(false);
                    //console.log("usussss", res.message.anuncios);
                } else {
                    //alert("Anúncio não encontrado na base de dados");
                    setShowSpinner(false);
                }

            })
    };

    function sair() {
        sessionStorage.removeItem('authTokenMN');

    };

    function selectPage(e, page) {
        e.preventDefault();
        setAction(page);
        setEspacoId(e.target.parentNode.parentNode.id);
        console.log("event", e.target, page)
    };


    return (
        <div className="painel-admin institucional">

            {showSpinner && <button class="buttonload">
                <i class="fa fa-spinner fa-spin"></i>Carregando
            </button>}

            <header>
                <Mosaico logoTop={true} borda="flex" mosaicoImg={mosaicoImg} />
            </header>
            <main>
                <Busca paginaAtual={"caderno"} />
                <h1 id="title-caderno" className='py-2 text-center'>Institucional</h1>

                <div class="container my-5">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="bg-cinza margin-bottom-20">
                                <h2 class="px-2"><i class="fa fa-clock-o"></i> A Empresa</h2>
                                <p>A MYCARDCITY foi criada por profissionais experientes das áreas de
                                    Telecomunicações e Publicidade, com o intuito de proporcionar às pequenas e
                                    médias empresas a oportunidade de divulgarem seus produtos, marcas e serviços de
                                    forma eficiente e com baixo custo, contando, para isso, com a estrutura de um MINISITIO
                                    padronizado, especialmente desenvolvido para este fim. Agregamos ainda um
                                    Aplicativo e um programa patenteado com o nome de SEMENTE DIGITAL.</p>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="bg-cinza margin-bottom-20">
                                <h2 class="px-2"><i class="fa fa-clock-o"></i> Objetivo</h2>
                                <p>Ser referência no segmento de Publicidade on-line,
                                    através de um modelo de divulgação inovador,
                                    democrático, com responsabilidade, prático e eficaz para todos.</p>
                            </div>
                        </div>
                    </div>
                    <div class="row py-4">
                        <div class="col-md-6">
                            <div class="bg-cinza margin-bottom-20">
                                <h2 class="px-2"><i class="fa fa-wifi"></i> Nossa visão</h2>
                                <p>Ser referência no segmento de <b>publicidade online</b>, através de um modelo de divulgação justo,
                                    transparente ao assinante e eficaz ao usuário.</p>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="bg-cinza">
                                <h2 class="px-2"><i class="fa fa-globe"></i> Nossa missão</h2>
                                <p>Promover nossos clientes com uma publicidade e comunicação democrática, econômica, padronizada e prática
                                    para todas as cidades brasileiras.</p>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12 margin-bottom-20">
                            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3839.160478293487!2d-47.89486528457415!3d-15.79548998905047!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x935a3aef5b363915%3A0x664043907f15a04d!2sVen%C3%A2ncio+Shopping!5e0!3m2!1spt-BR!2sbr!4v1490820737178" width="100%" height="350" frameborder="0" style={{"border":"0"}} allowfullscreen=""></iframe>
                        </div>
                    </div>
                    <div class="row area-parceiros">
                        <div class="col-md-12">
                            <div class="bg-cinza">
                                <h2><i class="fa fa-users"></i> Parceiros</h2>
                                <div class="row parceiros">
                                    <div class="col-md-3 col-sm-3">
                                        <a href="http://www.5it.com.br" target="_blank" title="5it" class="thumbnail">
                                             <img src="assets/img/parceiros/5it.png" alt="5it" /> 
                                        </a>
                                    </div>
                                    <div class="col-md-3 col-sm-3">
                                        <a href="http://3ltmarcas.com.br/" target="_blank" title="3LT Marcas e Patentes" class="thumbnail">
                                            <img src="assets/img/parceiros/3ltmarcasepatentes.png" alt="3LT Marcas e Patentes" />
                                        </a>
                                    </div>
                                    <div class="col-md-3 col-sm-3">
                                        <a href="http://certamericas.org/" target="_blank" title="Cert Americas" class="thumbnail">
                                             <img src="assets/img/parceiros/certamericas.png" alt="Cert Americas" />
                                        </a>
                                    </div>
                                    <div class="col-md-3 col-sm-3">
                                        <a href="http://omgstudio.cl/" target="_blank" title="OMG Agencia de Deseño" class="thumbnail">
                                             <img src="assets/img/parceiros/omg.png" alt="OMG Agencia de Deseño" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
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

export default Institucional;
