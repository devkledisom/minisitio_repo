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
import UserNav from './UserNav';


function Listar(props) {

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
    const [dadoPaginacao, setDadoPaginacao] = useState({});
    const [userType, setUserType] = useState(null);
    

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
        buscarAnuncioId();
        setUserType(sessionStorage.getItem('userLogged'))
    }, []);

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
                if (res.success) {
                    setAnuncios(res.message.anuncios);
                    props.setAnunciosPainel(res.message)
                    setShowSpinner(false);
                    setDadoPaginacao(res.message)
                } else {
                    props.setAnunciosPainel(res.message)
                    setShowSpinner(false);
                    //sair();
                }

            })
    };

    function apagarAnuncio(e) {
        setShowSpinner(true);
        e.target.parentNode.parentNode.remove();

        fetch(`${masterPath.url}/admin/anuncio/delete/${e.target.title}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "authorization": 'Bearer ' + sessionStorage.getItem('userTokenAccess')
            },
        })
            .then((x) => x.json())
            .then((res) => {
                console.log(res)
                if (res.success) {
                    setShowSpinner(false);
                    alert("perfil apagado");
                    sair()
                    //document.querySelector(".selecionada").remove();
                }

            })
    };

    function sair() {
        sessionStorage.removeItem('authTokenMN');

    };


    return (
        <div className="painel-admin">

            {showSpinner && <button class="buttonload">
                <i class="fa fa-spinner fa-spin"></i>Carregando
            </button>}

            {/*  <header>
                <Mosaico logoTop={true} borda="flex" mosaicoImg={mosaicoImg} />
            </header> */}
            <main>
                {/*   <Busca paginaAtual={"caderno"} /> */}
                {/*  <h1 id="title-caderno" className='py-2 text-center'>Todos os meus espaços</h1> */}

                <div className='container'>
                    <div className='col-md-12'>
                        {/*  <UserNav /> */}
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
                                            <div id="paginacao">
                                                <table class="table table-bordered table-striped table-hover">
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
                                                            <th>Ver perfil</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {anuncios.map((item) => (
                                                            <tr id={item.codAnuncio}>
                                                                <td>
                                                                    <a class="btn btn-xs btn-success" title="Editar" href="/12178481426/criar-anuncio/582210" onClick={(e) => props.btnEdit(e, 2)}>
                                                                        Editar
                                                                    </a>
                                                                    <a class="btn btn-xs btn-danger" title={item.codAnuncio} code={item.codAnuncio} href="#" onClick={(e) => apagarAnuncio(e)}>
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
                                                                <td className='text-center ver-perfil'>
                                                                    <a
                                                                        href={`/perfil/${item.codAnuncio}`}
                                                                        className='text-decoration-none'
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                    >
                                                                        <i class="fa fa-eye"></i>
                                                                        Ver
                                                                    </a>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                                <div class="row">
                                                    <div class="col-md-6">
                                                        <p>Página {dadoPaginacao.paginaAtual}/{dadoPaginacao.totalPaginas} (Total: {dadoPaginacao.totalItem})</p>
                                                    </div>
                                                    {/*  <div class="col-md-6">
                                                        <nav aria-label="Page navigation" class="pull-right">
                                                            <ul class="pagination">
                                                                <li class="disabled">
                                                                    <a href="javascript:;" onclick="return false;">Primeira</a>
                                                                </li>
                                                                <li class="disabled">
                                                                    <a href="javascript:;" onclick="return false;">Anterior</a>
                                                                </li>
                                                                <li class="disabled">
                                                                    <a href="javascript:;" onclick="return false;">Próxima</a>
                                                                </li>
                                                                <li class="disabled">
                                                                    <a href="javascript:;" onclick="return false;">Última</a>
                                                                </li>
                                                            </ul>
                                                        </nav>
                                                    </div> */}
                                                </div>

                                                {/*                 <style>
                                                    .pagination {
                                                        margin: 0;
    }
                                                </style>
                                                <script>
                                                    function apagar(url) {
        if (!confirm("Você tem certeza que deseja apagar esse registro?")) {
            return false;
        }

                                                    window.location = url;
    }
                                                </script> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>



            </main>

            <footer>
                {/*     <Nav styleclassName="Nav" />
                <Footer /> */}
            </footer>
        </div >
    );
}

export default Listar;
