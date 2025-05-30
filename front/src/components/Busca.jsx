import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../assets/css/main.css';
import '../assets/css/default.css';
import '../assets/css/busca.css';

import Card from 'react-bootstrap/Card';

import { masterPath } from '../config/config';
import { useBusca } from '../context/BuscaContext';
import { use } from 'react';

function Busca(props) {

    const navigate = useNavigate();
    const [ufSelected, setUf] = useState(0);
    const [uf, setUfs] = useState([]);
    const [caderno, setCaderno] = useState([]);
    const [cadernoUf, setCadernoUf] = useState(null);
    const [cadernoCidade, setCadernoCidade] = useState(null);
    const [codUf, setCodUf] = useState(null);
    const [codCaderno, setCodCaderno] = useState(null);
    const [loading, setLoading] = useState(false);
    const [promocao, setPromocao] = useState([]);

    //contexto
    const { result, setResult } = useBusca();

    //REFS
    const btnPromo = useRef(null);

    const location = useLocation();

    const executarSelecao = (e) => {
        let codigoUf = document.querySelectorAll('#codUf2')[0].value;
        setUf(codigoUf);
        const teste = uf.find(u => u.sigla_uf == codigoUf);
        localStorage.setItem("uf: ", teste.sigla_uf);
        sessionStorage.setItem("uf: ", codigoUf);
        setCadernoUf(teste.id_uf);
        setCodUf(codigoUf)

        buscarListaEstados(e.target.value);

    };


    const definirCaderno = (e) => {

        let codigoCidade = document.querySelectorAll('#codUf3')[0].value;
        // const teste = caderno.find(cad => cad.nomeCaderno == codigoCidade);

        if (codigoCidade != "TODO") {
            // localStorage.setItem("caderno: ", teste.nomeCaderno);
            sessionStorage.setItem("caderno: ", codigoCidade);

            // setCadernoUf(teste.UF);
            // console.log(teste.UF, codigoCidade)

            //setCadernoCidade(teste.nomeCaderno);
            setCodCaderno(codigoCidade);
            verClassificado(codUf, codigoCidade)

        } else {
            localStorage.setItem("caderno: ", "TODO");
            sessionStorage.setItem("caderno: ", codigoCidade);

            //setCodCaderno(codigoCidade);

        }

    };

    useEffect(() => {
        if (props.uf && props.caderno) {
            setUf(props.uf);
            setCodUf(props.uf);
            setCodCaderno(props.caderno);
            verificarPromocao();

            buscarListaEstados(props.uf);


        } else {
            /*   setCodUf(ufSalva);
              setCodCaderno(cadSalvo); */
        }
    }, [props.uf])

    useEffect(() => {


        let ufSalva = sessionStorage.getItem("uf: ");
        let cadSalvo = sessionStorage.getItem("caderno: ");
        let querySalvo = sessionStorage.getItem("querySearch");
        //console.log(ufSalva, cadSalvo)
        if (props.uf && props.caderno) {
            setUf(props.uf);
            setCodUf(props.uf);
            setCodCaderno(props.caderno);
        } else {
            /*   setCodUf(ufSalva);
              setCodCaderno(cadSalvo); */
        }


        if (querySalvo) {
            document.querySelector('#inputBusca').value = querySalvo;
        }

        fetch(`${masterPath.url}/ufs`)
            .then((x) => x.json())
            .then((res) => {
                setUfs(res);
                //setUf(ufSalva);
                if (location.pathname == '/') {
                    getUserLocation();
                    sessionStorage.removeItem("querySearch");
                    document.querySelector('#inputBusca').value = "";
                }
                if (ufSalva != undefined) {
                    //document.querySelectorAll('#codUf2')[0].value = ufSalva;
                }
            })


        verificarPromocao()
    }, []);

    function buscarListaEstados(uf) {
        fetch(`${masterPath.url}/cadernos?uf=${uf}`)
            .then((x) => x.json())
            .then((res) => {

                setCaderno(res);
                if (location.pathname == '/') {
                    ///getUserLocation();
                }
            })
    }


    function verificarPromocao() {
        fetch(`${masterPath.url}/read/promocao/${props.caderno}/${props.uf}`)
            .then(x => x.json())
            .then(res => {
                if (res.success) {
                    if (btnPromo.current) {
                        btnPromo.current.classList.add('pulse-promotion');
                    }

                    setPromocao(res.promocoes);
                }

            })
    }


    const fetchAnuncios = async () => {
        setLoading(true);

        //1º VALIDAÇÂO
        let inputSearch = document.querySelector('#inputBusca').value;
        let regex = /^(?=.*[A-Za-z])[A-Za-z0-9. ]+$/;
        let searchValidator = regex.test(inputSearch);

        /*    if(!searchValidator) {
               alert('Atenção! números não são permitidos no campo de busca');
               setLoading(false);
               document.querySelector('#inputBusca').value = "";
               return;
           }
    */

        let cadernoUf = document.querySelectorAll('#codUf2')[0].value;
        let cadernoCidade = document.querySelectorAll('#codUf3')[0].value;



        if (cadernoUf === "UF") {
            setLoading(false);
            alert("escolha um estado");
            return;
        } else if (cadernoCidade === "CIDADE") {
            setLoading(false);
            alert("escolha uma cidade");
            return;
        }

        try {
            const uf = document.querySelector('#codUf2').value;
            const codigoCaderno = document.querySelector('#codUf3').value;
            const valor_da_busca = document.querySelector('#inputBusca').value;

            if (valor_da_busca.length < 1) {
                alert("por favor preencha o campo de pesquisa");
                setLoading(false);
                return;
            }

            sessionStorage.setItem("querySearch", valor_da_busca);

            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "uf": uf,
                    "cidade": "ALTA FLORESTA D'OESTE",
                    "atividade": valor_da_busca,
                    "name": "mycardcity",
                    "telefone": "(61) 3255-1285",
                    "nu_documento": "23.707.648/0001-99",
                    "codigoCaderno": codigoCaderno
                })
            };

            const request = await fetch(`${masterPath.url}/buscar`, options).then((x) => x.json())
            //setAnuncio(request)
            setResult(request);
            console.log(request);
            setLoading(false);
            navigate(`/buscar/${codigoCaderno}/${uf}`, { state: { paramBusca: valor_da_busca } });

            /*  if (props.paginaAtual === "home" || props.paginaAtual === "caderno") {
                 navigate("/buscar");
             } */

            //console.log(result)

        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
        }
    };

    const verClassificado = (uf, caderno) => {
        setLoading(true);
        let cadernoUf = document.querySelectorAll('#codUf2')[0].value;
        let cadernoCidade = document.querySelectorAll('#codUf3')[0].value;

        console.table([cadernoUf, cadernoCidade, codCaderno, codUf, cadernoCidade])


        if (cadernoUf === "UF") {
            alert("escolha um estado");
        } else if (cadernoCidade === "TODO") {
            alert("escolha uma cidade");
        } else {
            window.location.href = `/caderno-geral/${caderno}/${uf}`;
        }
    };


    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        // Adiciona o listener de evento para 'resize'
        window.addEventListener("resize", handleResize);

        // Remove o listener quando o componente é desmontado
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);



    function getUserLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    checkLocation(latitude, longitude);  // Verificar localização
                },
                (error) => {
                    console.error("Erro ao obter localização:", error);
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            console.error("Permissão negada pelo usuário.");
                            break;
                        case error.POSITION_UNAVAILABLE:
                            console.error("A posição não está disponível.");
                            break;
                        case error.TIMEOUT:
                            console.error("A solicitação expirou antes de obter a localização.");
                            break;
                        default:
                            console.error("Ocorreu um erro desconhecido.");
                            break;
                    }
                }/* ,
                {
                    enableHighAccuracy: true,
                } */
            );
        } else {
            console.error("Geolocalização não é suportada pelo navegador.");
        }
    }

    function checkLocation(latitude, longitude) {
        const apiKey = "AIzaSyBpuxjyShwHApt-FthqurSP4G0xx7nznl0";  // Substitua com sua chave API do Google
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                const addressComponents = data.results[0].address_components;
                let city = '';
                let state = '';

                for (const component of addressComponents) {
                    if (component.types.includes('administrative_area_level_1')) {
                        state = component.short_name;

                        setCodUf(component.short_name);
                        //setUf(component.short_name);

                        localStorage.setItem("uf: ", component.short_name);
                        sessionStorage.setItem("uf: ", component.short_name);

                        buscarListaEstados(component.short_name);
                        console.log("Estado encontrado:", component.short_name);
                    }

                    if (component.types.includes("administrative_area_level_4")) {
                        city = component.short_name.toUpperCase();
                        setCodCaderno(component.short_name);
                        localStorage.setItem("caderno: ", component.short_name.toUpperCase());
                        sessionStorage.setItem("caderno: ", component.short_name.toUpperCase());

                        break; // Interrompe o loop completamente
                    } else if (component.types.includes("administrative_area_level_2")) {
                        city = component.short_name.toUpperCase();
                        setCodCaderno(component.short_name);
                        localStorage.setItem("caderno: ", component.short_name.toUpperCase());
                        sessionStorage.setItem("caderno: ", component.short_name.toUpperCase());
                        setTimeout(() => {
                            verClassificado(state, city);
                        }, 1000);


                    }
                }






                if (city === "Maceió" && state === "Alagoas") {
                    alert("Você está em Maceió, Alagoas!");
                } else {
                    //alert(`Você está em ${city}, ${state}`);


                }
            })
            .catch(error => console.error("Erro na consulta de geocodificação:", error));

    }

    useEffect(() => {
        if (uf.length > 0) {
            //console.log(codCaderno)
            if (codCaderno != null) {
                const ufLoc = caderno.find((item) => item.nomeCaderno == codCaderno.toString().toUpperCase())
                //console.log(ufLoc)
                if (ufLoc) {
                    setCodUf(ufLoc.UF);
                    setUf(ufLoc.UF);
                    setCodCaderno(ufLoc.nomeCaderno);
                }

            };

        }
    }, [uf, codCaderno]);

    function teclaLogin(e) {
        if (e.key === "Enter") {
            e.preventDefault();
            fetchAnuncios()
        }
    };

    function abrirPromocao() {
        let qtdePromocao = promocao.length;

        if (qtdePromocao == 1) {
            navigate(`/perfil/${promocao[0].codAnuncio}?promocao=ativa`);
        } else {
            const uf = document.querySelector('#codUf2').value;
            const codigoCaderno = document.querySelector('#codUf3').value;
            navigate(`/promocoes/${codigoCaderno}/${uf}`);
        }
    }

    return (
        <div className='border-busca container-fluid formulario formulario-home busca-caderno'>
            {loading &&
                <button class="buttonload" style={{ display: "block" }}>
                    <i class="fa fa-spinner fa-spin"></i>Carregando
                </button>
            }

            <div className='container'>
                <div className="row">
                    <div className='col-md-offset-1 col-md-12'>
                        <form id="buscador-home" name="buscador-home" className="d-flex justify-content-center flex-column position-relative" action="" method="post">
                            <div className="row d-flex p-bottom">
                                <div className="col-md-5 col-6 d-flex">
                                    <i className="fa fa-compass icone-form"></i>
                                    <div className="form-group w-100">

                                        <select name="codUf2" id="codUf2" className="form-control form-select" onChange={executarSelecao} value={codUf}>
                                            <option value="UF">UF</option>
                                            {uf.map((item) => (
                                                <option id={item.id_uf} key={item.id_uf} name={item.nome_uf} value={item.sigla_uf}>{item.sigla_uf}</option>
                                            ))}
                                        </select>

                                    </div>
                                </div>
                                <div className="col-lg-5 col-md-5 col-sm-5 col-xs-8 col-6 d-flex">
                                    <i className="fa fa-map-marker icone-form"></i>
                                    <div className="form-group w-100">

                                        <select name="codUf3" id="codUf3" className="form-control form-select" onChange={definirCaderno} value={codCaderno}>
                                            {/*  <option value="TODO">TODO</option> */}
                                            <option value="CIDADE">CIDADE</option>
                                            {caderno.map((item) => (
                                                item.UF == ufSelected &&
                                                <option id={item.codCaderno} key={item.codCaderno} name={item.nomeCaderno} value={item.nomeCaderno}>{item.nomeCaderno}</option>
                                            ))}
                                        </select>

                                    </div>
                                </div>
                                {windowWidth >= 768 ? (
                                    <div className="col-lg-3 col-md-4 col-sm-4 hidden-xs area-promo">
                                        <div className="btn-group" role="group">
                                            <button type="button" className="btn proximo btnGrupo btnPromocao" ref={btnPromo} data-promocao="1" title="Promoção" onClick={() => abrirPromocao()}>
                                                <img src="/assets/img/icone-promo.png" alt="Promoção" className="img-responsive animated infinite flash" />
                                            </button>
                                        </div>
                                    </div>
                                    /*  <div className="col-lg-3 col-md-4 col-sm-4 hidden-xs">
                                         <div className="btn-group" role="group">
                                             <button type="button"
                                                 className="btn proximo btnCaderno btn-3"
                                                 onClick={verClassificado}
                                                 title=" Ver Caderno"><i className="fa fa-file-text"></i> <span>Ver Caderno</span></button>
                                             <button type="button" className="btn proximo btnGrupo btnPromocao" ref={btnPromo} data-promocao="1" title="Promoção" onClick={() => abrirPromocao()}>
                                                 <img src="/assets/img/icone-promo.png" alt="Promoção" className="img-responsive animated infinite flash" />
                                             </button>
                                         </div>
                                     </div> */
                                ) : (
                                    ""
                                )}
                            </div>
                            <div className="row d-flex">

                                <div className='class="col-lg-9 col-md-10 col-sm-8 col-xs-12"'>
                                    <div className="form-group input-icon">
                                        <i className="fa fa-tags"></i>
                                        <input id="inputBusca" name="inputBusca" type="text" className="form-control" placeholder="Digite nome ou atividade" onKeyDown={teclaLogin} />
                                    </div>
                                </div>
                                {/*  <div className="col-lg-3 col-md-4 col-sm-4 col-xs-5">
                                    <button
                                        type="button"
                                        className="btn btn-block cinza btnBuscar target-start-search col-md-10 w-100"
                                        id="btnBuscar"
                                        title="Buscar"
                                        onClick={() => fetchAnuncios()}
                                        >
                                        <i className="fa fa-search"></i>
                                        Buscar
                                    </button>
                                </div> */}
                            </div>
                            <div className="row d-flex justify-content-center">
                                <div className="col-lg-3 col-md-4 col-sm-4 col-xs-5">
                                    <button
                                        type="button"
                                        className="btn btn-block cinza btnBuscar target-start-search col-md-10 w-100"
                                        id="btnBuscar"
                                        title="Buscar"
                                        onClick={() => fetchAnuncios()}
                                    >
                                        <i className="fa fa-search"></i>
                                        Buscar
                                    </button>
                                </div>
                            </div>
                            {windowWidth >= 768 ? (
                                ""
                            ) : (
                                <div className="col-lg-3 col-md-4 col-sm-4 hidden-xs" style={{ paddingTop: "30px" }}>
                                    {/*          <div className="btn-group" role="group">
                                        <button type="button"
                                            className="btn proximo btnCaderno btn-outline-dark rounded"
                                            onClick={verClassificado}
                                            title=" Ver Caderno"><i className="fa fa-file-text"></i> <span>Ver Caderno</span></button>
                                        <button type="button" className="btn proximo btnGrupo btnPromocao" data-promocao="1" title="Promoção">
                                            <img src="/assets/img/icone-promo.png" alt="Promoção" className="img-responsive animated infinite flash" />
                                        </button>
                                    </div> */}
                                    <Card /* bg="warning" */ className='d-flex' style={{ height: '60px', background: '#FFCC29' }}>
                                        <Card.Body className='d-flex align-items-center'>
                                            <img src="/assets/img/icone-promo.png" alt="Promoção" className="img-responsive animated infinite flash" />
                                            <Card.Title className='text-center px-2'>Promoção</Card.Title>
                                        </Card.Body>
                                    </Card>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>



        </div>

    )

};

export default Busca;

