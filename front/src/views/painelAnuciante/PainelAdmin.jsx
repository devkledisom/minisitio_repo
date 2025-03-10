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
import UserNav from './UserNav';
import DadosPessoais from './DadosPessoais';
import Legenda from './Legenda';

//FUNCTIONS
import useIsMobile from '../../admin/functions/useIsMobile';


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
    const [anunciosPainel, setAnunciosPainel] = useState([]);
    const [action, setAction] = useState(1);
    const [espacoId, setEspacoId] = useState(null);
    const [userType, setUserType] = useState(null);
    const [role, setRole] = useState(null);

    const location = useLocation();

    const pegarParam = new URLSearchParams(location.search);

    const book = pegarParam.get('book');
    const id = pegarParam.get('id');
    const { cpf } = useParams();

    const navigate = useNavigate();

    const isMobile = useIsMobile();

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

        setUserType(sessionStorage.getItem('userLogged'));

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
        let nuDocumento = (cpf) => {
            console.log("---------------------------=: ", cpf)
            if (cpf.length == 11) {
                return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
            } else {
                return cpf.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
            }
        };

        const campoPesquisa = document.getElementById('buscar').value;

        fetch(`${masterPath.url}/admin/anuncio/public/?search=${cpf}`)
            .then((x) => x.json())
            .then((res) => {
                console.log(res)
                if (res.success) {
                    //setAnuncios(res.message.anuncios);
                    setShowSpinner(false);
                    //console.log("usussss", res.message.anuncios[0].codUf);
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
    };

    const verifyRole = () => {
        //console.log(anunciosPainel.role[0].codTipoUsuario)
        if(Object.keys(anunciosPainel).length > 0) {
            setRole(anunciosPainel.role[0].codTipoUsuario);
        } else {
            return null;
        }
    }

    useEffect(() => {
        verifyRole();
    }, [anunciosPainel]);

    return (
        <div className="painel-admin">

            {showSpinner && <button class="buttonload">
                <i class="fa fa-spinner fa-spin"></i>Carregando
            </button>}

            <header>
                <Mosaico logoTop={true} borda="flex" mosaicoImg={mosaicoImg} />
            </header>
            <main>
                <Busca paginaAtual={"caderno"} />
                <h1 id="title-caderno" className='py-2 text-center'>Todos os meus espaços</h1>

                <div className='container'>
                    <div className='col-md-12'>

                        <div className='row'>
                            <div className="col-md-12 col-xs-12 text-center">
                                <div class="col-md-12">
                                    {isMobile &&
                                        <ul class="list-inline pull-right">

                                            <li>
                                                <a href="#" class="btn cinza btnMenu" onClick={(e) => selectPage(e, 3)}>
                                                    <i class="fa fa-user" aria-hidden="true"></i>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="/comprar-espaco-minisitio" class="btn cinza btnMenu">
                                                    <i class="fa fa-address-card" aria-hidden="true"></i>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="/12178481426/ver-anuncios" class="btn cinza btnMenu" onClick={(e) => selectPage(e, 1)}>
                                                    <i class="fa fa-th-list" aria-hidden="true"></i>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="/login" class="btn cinza btnMenu" onClick={sair}>
                                                    <i class="fa fa-sign-out" aria-hidden="true"></i>
                                                </a>
                                            </li>
                                        </ul>
                                    }
                                    {!isMobile &&
                                        <ul class="list-inline pull-right">
                                            {role == 5 &&
                                                <li><a href="#" class="btn cinza btnMenu" onClick={(e) => selectPage(e, 5)}>Legenda</a></li>
                                            }
                                            <li><a href="#" class="btn cinza btnMenu" onClick={(e) => selectPage(e, 3)}>Dados pessoais</a></li>
                                            <li><a href="/comprar-espaco-minisitio" class="btn cinza btnMenu">Criar anúncio</a></li>
                                            <li><a href="/12178481426/ver-anuncios" id="listar" class="btn cinza btnMenu" onClick={(e) => selectPage(e, 1)}>Listar Espaços</a></li>
                                            {/*   <li><a href="/resources/img/galeria-area-do-assinante.zip" class="btn cinza btnMenu">Galeria de imagens</a></li> */}
                                            <li><a href="/login" class="btn cinza btnMenu" onClick={sair}>Sair</a></li>
                                        </ul>
                                    }

                                </div>
                            </div>
                        </div>
                        {/* 
                        <div className="row lista">
                            <div class="col-md-12">
                                <div class="bg-cinza" style={{ "padding-top": "10px" }}>
                                    <div class="row">
                                        <div class="col-md-6">

                                        </div>
                                        <div class="col-md-6 text-right">
                                            <input id="buscar" class="pull-right margin-bottom-0" type="text" placeholder="Buscar" />
                                        </div>
                                        <div class="col-md-12" style={{ "padding-top": "10px" }}>
                                            <div id="paginacao"><table class="table table-bordered table-striped table-hover">
                                                <thead>
                                                    <tr>
                                                        <th style={{ "width": "132px" }}>--</th>
                                                        <th>Anúncio</th>
                                                        <th>COD</th>
                                                        <th>Pagamento</th>
                                                        <th>Cadastrado em</th>
                                                        <th>Atualizado em</th>
                                                        <th>Válido até</th>
                                                        <th>Valor Pago</th>
                                                        <th>Forma Pagamento</th>
                                                        <th>Data Pagamento</th>
                                                        <th>Cidade/UF</th>
                                                        <th>ID Desconto</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {anuncios.map((item) => (
                                                        <tr data-id="582210">
                                                            <td>
                                                                <a class="btn btn-xs btn-success" title="Editar" href="/12178481426/criar-anuncio/582210">
                                                                    Editar
                                                                </a>
                                                                <a class="btn btn-xs btn-danger" title="Apagar" href="javascript:apagar('/12178481426/apagar-anuncio/582210');">
                                                                    Apagar
                                                                </a>
                                                            </td>
                                                            <td>{item.descAnuncio}</td>
                                                            <td>{item.codAnuncio}</td>
                                                            <td>
                                                                <a class="btn btn-xs btn-success" href="javascript:;">Isento</a>
                                                            </td>
                                                            <td>{item.createdAt.split("T")[0]}</td>
                                                            <td>{item.updatedAt.split("T")[0]}</td>
                                                            <td>{item.dueDate.split("T")[0]}</td>
                                                            <td>0,00</td>
                                                            <td>isento</td>
                                                            <td>06/09/2024</td>
                                                            <td>{`${item.codCaderno}/${item.codUf}`}</td>
                                                            <td></td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                                <div class="row">
                                                    <div class="col-md-6">
                                                        <p>Página 1/1 (Total: 1)</p>
                                                    </div>
                                        
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                        {action === 1 &&
                            <Listar btnEdit={selectPage} setAnunciosPainel={setAnunciosPainel} />
                        }
                        {action === 2 &&
                            <Editar espacoId={espacoId} selectPage={selectPage} />
                        }
                        {action === 3 &&
                            <DadosPessoais espacoId={espacoId} selectPage={selectPage} />
                        }
                        {action === 5 &&
                        role == 5 &&
                            <Legenda espacoId={espacoId} selectPage={selectPage} anuncios={anunciosPainel} />                        
                        }


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

export default PainelAdmin;
