import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/css/main.css';
import '../assets/css/default.css';

import { masterPath } from '../config/config';
import { useBusca } from '../context/BuscaContext';

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

    //contexto
    const { result, setResult } = useBusca();

    const executarSelecao = (e) => {
        let codigoUf = document.querySelectorAll('#codUf2')[0].value;
        setUf(codigoUf);
        const teste = uf.find(u => u.id_uf == codigoUf);
        localStorage.setItem("uf: ", teste.sigla_uf);
        sessionStorage.setItem("uf: ", codigoUf);
        setCadernoUf(teste.id_uf);
        setCodUf(codigoUf)

    };
    const definirCaderno = (e) => {
        let codigoCidade = document.querySelectorAll('#codUf3')[0].value;
        const teste = caderno.find(cad => cad.codCaderno == codigoCidade);

        if (codigoCidade != "TODO") {
            localStorage.setItem("caderno: ", teste.nomeCaderno);
            sessionStorage.setItem("caderno: ", codigoCidade);

            setCadernoUf(teste.codUf);
            //setCadernoCidade(teste.nomeCaderno);
            setCodCaderno(codigoCidade);
        } else {
            localStorage.setItem("caderno: ", "TODO");
            sessionStorage.setItem("caderno: ", codigoCidade);

            setCodCaderno(codigoCidade);
        }

    };

    useEffect(() => {


        let ufSalva = sessionStorage.getItem("uf: ");
        let cadSalvo = sessionStorage.getItem("caderno: ");

        setCodUf(ufSalva);
        setCodCaderno(cadSalvo);

        fetch(`${masterPath.url}/ufs`)
            .then((x) => x.json())
            .then((res) => {
                setUfs(res);
                setUf(ufSalva);
                if (ufSalva != undefined) {
                    //document.querySelectorAll('#codUf2')[0].value = ufSalva;
                }
            })

        fetch(`${masterPath.url}/cadernos`)
            .then((x) => x.json())
            .then((res) => {
                setCaderno(res)
                if (cadSalvo != undefined) {
                    //document.querySelectorAll('#codUf3')[0].value = cadSalvo;
                }
            })


    }, []);

    const fetchAnuncios = async () => {
        setLoading(true);
        try {
            const uf = document.querySelector('#codUf2').value;
            const codigoCaderno = document.querySelector('#codUf3').value;
            const valor_da_busca = document.querySelector('#inputBusca').value;

            if (valor_da_busca.length < 1) {
                alert("por favor preencha o campo de pesquisa");
                setLoading(false);
                return;
            }

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
            //console.log(request);
            setLoading(false);
            navigate("/buscar");

            /*  if (props.paginaAtual === "home" || props.paginaAtual === "caderno") {
                 navigate("/buscar");
             } */

            //console.log(result)

        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
        }
    };

    const verClassificado = () => {
        let cadernoUf = document.querySelectorAll('#codUf2')[0].value;
        let cadernoCidade = document.querySelectorAll('#codUf3')[0].value;

        console.table([cadernoUf, cadernoCidade, codCaderno, codUf, cadernoCidade])

        if (cadernoUf === "UF") {
            alert("escolha um estado");
        } else if (cadernoCidade === "TODO") {
            alert("escolha uma cidade");
        } else {
            fetch(`${masterPath.url}/admin/anuncio/classificado/${codCaderno}/${codUf}`)
                /* fetch(`${masterPath.url}/admin/anuncio/classificado/${cadernoCidade}/${cadernoUf}`) */
                .then(x => x.json())
                .then(res => {
                    console.log(res)
                    if (res.success) {
                        window.location = `/caderno-geral/${codCaderno}/${codUf}`;
                    } else {
                        alert("caderno não localizado")
                    }

                })

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



    /*   console.log(result) */

    return (
        <div className='border-busca container-fluid formulario formulario-home'>
            {loading &&
                <button class="buttonload" style={{ display: "block" }}>
                    <i class="fa fa-spinner fa-spin"></i>Carregando
                </button>
            }
            <div className='container'>
                <div className="row">
                    <div className='col-md-offset-1 col-md-12'>
                        <form id="buscador-home" name="buscador-home" className="d-flex justify-content-center flex-column" action="" method="post">
                            <div className="row d-flex justify-content-center p-bottom">
                                <div className="col-md-3 col-6 d-flex">
                                    <i className="fa fa-compass icone-form"></i>
                                    <div className="form-group w-100">

                                        <select name="codUf2" id="codUf2" className="form-control form-select" onChange={executarSelecao} value={codUf}>
                                            <option value="UF">UF</option>
                                            {uf.map((item) => (
                                                <option id={item.id_uf} key={item.id_uf} name={item.nome_uf} value={item.id_uf}>{item.sigla_uf}</option>
                                            ))}
                                        </select>

                                    </div>
                                </div>
                                <div className="col-lg-5 col-md-5 col-sm-5 col-xs-8 col-6 d-flex">
                                    <i className="fa fa-map-marker icone-form"></i>
                                    <div className="form-group w-100">

                                        <select name="codUf3" id="codUf3" className="form-control form-select" onChange={definirCaderno} value={codCaderno}>
                                            <option value="TODO">TODO</option>
                                            {caderno.map((item) => (
                                                item.codUf == ufSelected &&
                                                <option id={item.codCaderno} key={item.codCaderno} name={item.nomeCaderno} value={item.codCaderno}>{item.nomeCaderno}</option>
                                            ))}
                                        </select>

                                    </div>
                                </div>
                                {windowWidth >= 768 ? (
                                    <div className="col-lg-3 col-md-4 col-sm-4 hidden-xs">
                                        <div className="btn-group" role="group">
                                            <button type="button"
                                                className="btn proximo btnCaderno btn-3"
                                                onClick={verClassificado}
                                                title=" Ver Caderno"><i className="fa fa-file-text"></i> <span>Ver Caderno</span></button>
                                            <button type="button" className="btn proximo btnGrupo btnPromocao" data-promocao="1" title="Promoção">
                                                <img src="/assets/img/icone-promo.png" alt="Promoção" className="img-responsive animated infinite flash" />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    ""
                                )}
                            </div>
                            <div className="row d-flex justify-content-center">

                                <div className='class="col-lg-9 col-md-8 col-sm-8 col-xs-12"'>
                                    <div className="form-group input-icon">
                                        <i className="fa fa-tags"></i>
                                        <input id="inputBusca" name="inputBusca" type="text" className="form-control" placeholder="Digite nome, atividade, telefone ou CNPJ" />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-4 col-sm-4 col-xs-5">
                                    <button
                                        type="button"
                                        className="btn btn-block cinza btnBuscar target-start-search col-md-10 w-100"
                                        id="btnBuscar"
                                        title="Buscar"
                                        onClick={() => fetchAnuncios()}>
                                        <i className="fa fa-search"></i>
                                        Buscar
                                    </button>
                                </div>


                            </div>
                            {windowWidth >= 768 ? (
                                ""
                            ) : (
                                <div className="col-lg-3 col-md-4 col-sm-4 hidden-xs" style={{ paddingTop: "30px" }}>
                                    <div className="btn-group" role="group">
                                        <button type="button"
                                            className="btn proximo btnCaderno btn-outline-dark rounded"
                                            onClick={verClassificado}
                                            title=" Ver Caderno"><i className="fa fa-file-text"></i> <span>Ver Caderno</span></button>
                                        <button type="button" className="btn proximo btnGrupo btnPromocao" data-promocao="1" title="Promoção">
                                            <img src="/assets/img/icone-promo.png" alt="Promoção" className="img-responsive animated infinite flash" />
                                        </button>
                                    </div>
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

