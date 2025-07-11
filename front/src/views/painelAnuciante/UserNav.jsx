import { useEffect, useState, useRef } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { masterPath } from '../../config/config';


import '../../assets/css/PainelAdminAnunciante.css';

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
import Listar from './Listar';
import Editar from './Editar';


function PainelAdmin() {

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

    const location = useLocation();

    const pegarParam = new URLSearchParams(location.search);

    const book = pegarParam.get('book');
    const id = pegarParam.get('id');
    const { cpf } = useParams();

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
        console.log("motre", teste.current)

        /*     fetch(`${masterPath.url}/admin/anuncio/classificado/${caderno}/${estado}`)
              .then(x => x.json())
              .then(res => {
                if (res.success) {
                  setClassificados(res.data);
                  setPathImg(res.teste.rows);
                  setMosaicoImg(res.mosaico);
                  console.log(res)
                } else {
        
                }
        
              }) */
        buscarAnuncioId();

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

    function buscarAnuncioId(e) {
        setShowSpinner(true);
        let nuDocumento = "";

        if (cpf.length == 11) {
            nuDocumento = cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
        } else {
            nuDocumento = cpf.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
        }

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


    return (
        <div className="painel-admin">
            <main>
                <div className='container'>
                    <div className='col-md-12'>
                        <div className='row'>
                            <div className="col-md-12 col-xs-12 text-center">
                                <div class="col-md-12">
                                    <ul class="list-inline pull-right">
                                        <li><a href="/12178481426/cadastro" class="btn cinza btnMenu">Dados pessoais</a></li>
                                        <li><a href="/12178481426/criar-anuncio" class="btn cinza btnMenu">Criar anúncio</a></li>
                                        <li><a href="/12178481426/ver-anuncios" class="btn cinza btnMenu">Listar Espaços</a></li>
                                        <li><a href="/resources/img/galeria-area-do-assinante.zip" class="btn cinza btnMenu">Galeria de imagens</a></li>
                                        <li><a href="/login" class="btn cinza btnMenu" onClick={sair}>Sair</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div >
    );
}

export default PainelAdmin;
