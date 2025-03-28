// components/OutroComponente.js
import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import { useLocation, useNavigate } from 'react-router-dom';
import 'font-awesome/css/font-awesome.min.css';
import { masterPath, version } from '../../../config/config';

//CSS
import '../../assets/css/users.css';
import '../../assets/css/espacos/espacos.css';

//LIBS
import Swal from 'sweetalert2';


//componente
import Header from "../Header";
import Pagination from '../../components/Pagination';
import Spinner from '../../../components/Spinner';
import Duplicate from './Duplicate';
import BtnActivate from '../../components/BntActivate';
import EspacosImport from './EspacosImport';

const Espacos = () => {

    const style = {
        position: "fixed",
        zIndex: "999"
    }

    const [ids, setIds] = useState([]);
    const [anuncios, setAnucios] = useState([]);
    const [page, setPage] = useState(1);
    const [selectId, setSelectId] = useState(null);
    const [showSpinner, setShowSpinner] = useState(true);
    const [progressExport, setProgressExport] = useState(0);
    const [del, setDel] = useState(false);
    const [busca, setBusca] = useState(false);
    const [searchOptioncheck, setSearchOptioncheck] = useState(false);

    const [estadoSelecionado, setEstadoSelecionado] = useState(null);
    const [cadernoSelecionado, setCadernoSelecionado] = useState(null);
    const [uf, setUfs] = useState([]);
    const [caderno, setCaderno] = useState([]);
    const [mostrarInputBusca, setMostrarInputBusca] = useState(true);


    const location = useLocation();


    const getParam = new URLSearchParams(location.search);

    const param = getParam.get('page') ? getParam.get('page') : 1;

    const campoBusca = useRef(null);
    const codOriginFather = useRef(null);

    const tokenAuth = sessionStorage.getItem('userTokenAccess');

    useEffect(() => {
        setShowSpinner(true);


        if (campoBusca.current.value != '') {
            Promise.all([
                fetch(`${masterPath.url}/admin/anuncio/buscar?search=${campoBusca.current.value}&page=${param}&require=${searchOptioncheck}&uf=${estadoSelecionado}&caderno=${cadernoSelecionado}`).then((x) => x.json()),
                //fetch(`${masterPath.url}/admin/usuario/buscar/all`).then((x) => x.json())
            ])
                .then(([resAnuncio]) => {
                    //console.log(resAnuncio)
                    setAnucios(resAnuncio);
                    setShowSpinner(false);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                    setShowSpinner(false);
                });
        } else {
            Promise.all([
                fetch(`${masterPath.url}/admin/espacos/read?page=${param}`).then((x) => x.json()),
                //fetch(`${masterPath.url}/admin/usuario/buscar/all`).then((x) => x.json())
            ])
                .then(([resAnuncio]) => {
                    //console.log(resAnuncio.message.anuncios)
                    setAnucios(resAnuncio);
                    setShowSpinner(false);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                    setShowSpinner(false);
                });
        }



    }, [param]);

    useEffect(() => {
        fetch(`${masterPath.url}/ufs`)
            .then((x) => x.json())
            .then((res) => {
                setUfs(res);
            })

        fetch(`${masterPath.url}/cadernos`)
            .then((x) => x.json())
            .then((res) => {
                setCaderno(res);
            })
    }, []);



    const navigator = useNavigate();


    function selecaoLinha(event) {
        //console.log(event.currentTarget)

        var linhas = document.querySelectorAll('tbody tr');
        // Remove a classe 'selecionada' de todas as linhas
        linhas.forEach(function (outraLinha) {
            outraLinha.classList.remove('selecionada');
        });

        setSelectId(event.currentTarget.id)

        // Adiciona a classe 'selecionada' à linha clicada
        event.currentTarget.classList.add('selecionada');

        return;
    };


    function apagarAnuncio() {
        setShowSpinner(true);
        fetch(`${masterPath.url}/admin/anuncio/delete/${selectId}`, {
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
                    alert("anuncio apagado")
                    document.querySelector(".selecionada").remove();
                }

            })
    };

    function apagarMultiplosAnucios() {
        let checkboxs = document.querySelectorAll('.chkChildren');

        checkboxs.forEach((line) => {
            if (line.checked) {
                setShowSpinner(true);
                fetch(`${masterPath.url}/admin/anuncio/delete/${line.id}`, {
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
                            line.closest('tr').remove();
                        }

                    })
            }
        });
    };

    function apagarDup() {
        setShowSpinner(true);
        let codigoDeOrigem = codOriginFather.current.innerText;
        fetch(`${masterPath.url}/admin/anuncio/delete/${codigoDeOrigem}?type=dup`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "authorization": 'Bearer ' + masterPath.accessToken
            },
        })
            .then((x) => x.json())
            .then((res) => {
                console.log(res)
                if (res.success) {
                    setShowSpinner(false);
                    //alert("anuncio apagado")
                    //document.querySelector(".selecionada").remove();
                }

            })
    };

    function buscarAnuncioId(e) {
        setShowSpinner(true);
        setBusca(true);
        const campoPesquisa = document.getElementById('buscar').value;

        if (!searchOptioncheck) {
            alert('Selecione um critério para a pesquisa');
            setShowSpinner(false);
            return;
        }

        fetch(`${masterPath.url}/admin/anuncio/buscar/?search=${campoPesquisa}&require=${searchOptioncheck}&uf=${estadoSelecionado}&caderno=${cadernoSelecionado}`)
            .then((x) => x.json())
            .then((res) => {
                if (res.success) {
                    //alert("encontrado");
                    setAnucios(res);
                    setShowSpinner(false);
                    //console.log("usussss", res)
                } else {
                    alert("Perfil não encontrado na base de dados");
                    setShowSpinner(false);
                }

            })
    };

    const formatData = (dataCompleta) => {
        if (!dataCompleta) return;
        let dataTempo = dataCompleta.split('T');
        let dataOriginal = dataTempo[0].split('-');

        return `${dataOriginal[2]}/${dataOriginal[1]}/${dataOriginal[0]}`;
    };

    const dataExpiracao = (dataCompleta) => {
        if (!dataCompleta) return;

        let dataTempo = dataCompleta.split('T');
        let dataOriginal = dataTempo[0];

        //const expirationDate = moment(dataOriginal).add(1, 'year').format('DD/MM/YYYY');
        const expirationDate = moment(dataOriginal).format('DD/MM/YYYY');

        //console.log("data", dataOriginal)

        return expirationDate;
    };

    const definirTipoAnuncio = (tipo) => {
        //console.log(tipo)
        switch (tipo) {
            case "1":
                return "Básico";
            case "2":
                return "Simples";
            case "3":
                return "Completo";
            case "4":
                return "Prefeitura";
            default:
                return "Tipo desconhecido";
        }
    };

    function exportExcell() {
        setShowSpinner(true);

        let totalItens = anuncios.message.totalItem;
        if (totalItens > 50000) {
            alert("Atenção, esse caderno atingiu o limite de 50.000 registros. O limite de exportação é de 50.000 registros");
        }

        /*
        Para 1000 linhas: 3125ms
Para 10000 linhas: 31250ms
Para 20000 linhas: 62500ms
Para 30000 linhas: 93750ms
Para 40000 linhas: 125000ms
Para 50000 linhas: 156250ms
Para 60000 linhas: 187500ms
Para 70000 linhas: 218750ms
Para 80000 linhas: 250000ms
Para 90000 linhas: 281250ms
Para 100000 linhas: 312500ms
        */

        if (campoBusca.current.value != '') {

            // Valor máximo em milissegundos
            const maxTime = 312500;

            // Atualiza o progresso a cada 10 ms (ajuste conforme necessário)
            const interval = 10;
            let currentTime = 0;

            // Função para calcular e exibir o percentual
            const intervalId = setInterval(() => {
                currentTime += interval;

                // Calcula o percentual
                const percent = Math.min((currentTime / maxTime) * 100, 100); // Garante que não ultrapasse 100%

                console.log(`Progresso: ${percent.toFixed(2)}%`);
                setProgressExport(percent.toFixed(2));

                // Para quando alcançar o valor máximo
                if (currentTime >= maxTime) {
                    clearInterval(intervalId);
                    console.log("Requisição concluída.");
                }
            }, interval);



            fetch(`${masterPath.url}/admin/anuncio/export?page=${param}&limit=${anuncios.message.totalItem}&export=full&caderno=${campoBusca.current.value}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(anuncios.message.anuncios)
            })
                .then(x => x.blob())
                .then(res => {
                    const url = window.URL.createObjectURL(res);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "planilha.xlsx"; // Define o nome do arquivo
                    document.body.appendChild(a);
                    a.click(); // Força o clique para baixar
                    document.body.removeChild(a); // Remove o elemento depois do clique
                    window.URL.revokeObjectURL(url); // Libera memória

                    setShowSpinner(false);
                    setProgressExport(0);
                    clearInterval(intervalId);

                    if (res.success) {
                        //console.log(res);
                        setShowSpinner(false);
                        setProgressExport(0);
                        clearInterval(intervalId);
                        window.location.href = res.downloadUrl;
                    }
                })
        } else {
            fetch(`${masterPath.url}/admin/anuncio/export?page=${param}&limit=5000`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(anuncios.message.anuncios)
            })
                .then(x => x.json())
                .then(res => {
                    if (res.success) {
                        //console.log(res);
                        setShowSpinner(false);
                        window.location.href = res.downloadUrl;
                    }
                })
        }

    };

    function editRow() {
        if (selectId != null) {
            navigator(`/admin/anuncio/editar?id=${selectId}`);
        } else {
            Swal.fire({
                title: "Error!",
                text: "Seleciona um anúncio para editar",
                icon: "error"
            });
        }

    };

    function definirCriterioBusca(criterio) {
        setSearchOptioncheck(criterio)

        if(criterio === 'codCaderno' || criterio === 'codUF') {
             document.getElementById('buscar').value = ''
        }

        /*  switch(criterio) {
            case 'codAnuncio':
                setMostrarInputBusca(true);
                break;
            case 'descAnuncio':
                setMostrarInputBusca(true);
                break;
            case 'codCaderno':
                setMostrarInputBusca(false);
                document.getElementById('buscar').style.visibility = 'hidden';
                break;
            case 'descCPFCNPJ':
                setMostrarInputBusca(true);
                break;
            case 'codDesconto':
                setMostrarInputBusca(true);
                break;
            case 'codUF':
                setMostrarInputBusca(true);
                break;
            
        }  */

    };

    function limparFiltro(param) {
        if(param === 'todos') {
            setCadernoSelecionado("todos")
        }
    }

    return (
        <div className="users app-espacos">
            <header style={style} className='w-100'>
                <Header />
            </header>
            <section className="pt-5">

                {showSpinner && <Spinner progress={progressExport} />}
                <h1 className="pt-4 px-4">Espaços</h1>
                <div className="container-fluid py-4 px-4">
                    <div className="row margin-bottom-10">
                        <div className="span6 col-md-6">
                            <button type="button" className="btn custom-button" onClick={() => navigator('/admin/anuncio/cadastro')}>Adicionar</button>
                            {/* <button type="button" className="btn custom-button mx-2">Duplicar</button> */}
                            <Duplicate className="btn custom-button mx-2" selectId={selectId} />
                            <button type="button" className="btn custom-button" onClick={exportExcell}>Exportar</button>
                            <button type="button" className="btn custom-button mx-2" onClick={() => navigator('/admin/anuncio/import')}>Importar</button>
                            <button type="button" className="btn btn-danger custom-button text-light" onClick={apagarAnuncio}>Apagar</button>
                            <button type="button" className="btn btn-danger custom-button text-light mx-2" onClick={apagarMultiplosAnucios}>Apagar Todos</button>
                            {(campoBusca.current != null && campoBusca.current.value != '') &&
                                <button type="button" className="btn btn-danger custom-button text-light mx-2" onClick={apagarDup}>Apagar Duplicação</button>
                            }
                            <button type="button" className="btn btn-info custom-button text-light" onClick={editRow}>Editar</button>
                        </div>
                        <div className="span6 col-md-6 d-flex flex-column align-items-end">
                            <div className='d-flex flex-column'>
                                <div className="pull-right d-flex align-items-center">

                                    <select name="" id="uf" style={{ "width": "50px", "height": "30px" }} onChange={(e) => { setEstadoSelecionado(e.target.value); limparFiltro(e.target.value) }}>
                                        <option value="todos">UF</option>
                                        {uf.map(item => (
                                            <option value={item.sigla_uf}>{item.sigla_uf}</option>
                                        ))}
                                    </select>
                                    <select name="" id="caderno" style={{ "width": "100px", "height": "30px" }} onChange={(e) => setCadernoSelecionado(e.target.value)}>
                                        <option value="todos">CADERNO</option>

                                        {caderno.map(item => (
                                            item.UF == estadoSelecionado &&
                                            <option value={item.nomeCaderno}>{item.nomeCaderno}</option>
                                        ))}
                                    </select>
                                    <input id="buscar" type="text" placeholder="Código, Nome, Caderno, CPF/CNPJ, ID ou UF" onKeyDown={(e) => e.key == "Enter" ? buscarAnuncioId() : ''} ref={campoBusca} />

                                  {/*   {mostrarInputBusca &&
                                        <input id="buscar" type="text" placeholder="Código, Nome, Caderno, CPF/CNPJ, ID ou UF" onKeyDown={(e) => e.key == "Enter" ? buscarAnuncioId() : ''} ref={campoBusca} />
                                    } */}
                                    <button id="btnBuscar" className="" type="button" onClick={buscarAnuncioId} >
                                        <i className="icon-search"></i>
                                    </button>
                                </div>
                                <div className='SearchOption'>

                                    <label htmlFor="codigo" onClick={() => definirCriterioBusca('codAnuncio')}>
                                        <input type='radio' name="option" id="codigo" onClick={() => definirCriterioBusca('codAnuncio')} />
                                        Código
                                    </label>
                                    <label htmlFor="nome" onClick={() => definirCriterioBusca('descAnuncio')}>
                                        <input type='radio' name="option" id="nome" onClick={() => definirCriterioBusca('descAnuncio')} />
                                        Nome
                                    </label>
                                    <label htmlFor="ufCriterio" onClick={() => definirCriterioBusca('codUf')}>
                                        <input type='radio' name="option" id="ufCriterio" onClick={() => definirCriterioBusca('codUf')} />
                                        UF
                                    </label>
                                    <label htmlFor="cadernoCriterio" onClick={() => definirCriterioBusca('codCaderno')}>
                                        <input type='radio' name="option" id="cadernoCriterio" onClick={() => definirCriterioBusca('codCaderno')} />
                                        Caderno
                                    </label>
                                    <label htmlFor="cnpj" onClick={() => definirCriterioBusca('descCPFCNPJ')}>
                                        <input type='radio' name="option" id="cnpj" onClick={() => definirCriterioBusca('descCPFCNPJ')} />
                                        CNPJ
                                    </label>
                                    <label htmlFor="id" onClick={() => definirCriterioBusca('codDesconto')}>
                                        <input type='radio' name="option" id="id" onClick={() => definirCriterioBusca('codDesconto')} />
                                        ID
                                    </label>
                                    <label htmlFor="atividade" onClick={() => definirCriterioBusca('codAtividade')}>
                                        <input type='radio' name="option" id="atividade" onClick={() => definirCriterioBusca('codAtividade')} />
                                        Atividade
                                    </label>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <article>
                    <div className="container-fluid">
                        <div className='row px-4 table-perfil'>
                            <table className="table table-bordered table-striped table-hover" style={{ tableLayout: 'fixed', width: '100%' }}>
                                <thead>
                                    <tr>
                                        <th>COD</th>
                                        <th>COD_OR</th>
                                        <th>DUPLI</th>
                                        <th>CNPJ</th>
                                        <th>NOME</th>
                                        <th>TIPO</th>
                                        <th>CADERNO</th>
                                        <th>UF</th>
                                        <th>STATUS</th>
                                        <th>PAG.</th>
                                        <th>DATA_PAG</th>
                                        <th>VALOR</th>
                                        <th>DESCONTO</th>
                                        <th>CAD. PARA CONF.</th>
                                        <th>CONFIRMADO</th>
                                        <th>DATA_FIM</th>
                                        <th>TEMP. VALE PR. TIPO</th>
                                        <th>ID</th>
                                        <th>USUARIO/DECISOR</th>
                                        <th>LOGIN</th>
                                        <th>SENHA</th>
                                        <th>EMAIL</th>
                                        <th>CONTATO</th>
                                        <th>ATIVIDADE PRINCIPAL</th>
                                        <th>LINK_PERFIL</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {


                                        anuncios != '' && anuncios.message.anuncios.map((item) => {
                                            return (
                                                <tr key={item.codAnuncio} id={item.codAnuncio} onClick={selecaoLinha}>
                                                    <td className=''>
                                                        <input type="checkbox" id={item.codAnuncio} className="chkChildren" />
                                                        <span className='mx-2'>{item.codAnuncio}</span>
                                                    </td>
                                                    <td ref={codOriginFather}>{item.codOrigem}</td>
                                                    <td>{item.codDuplicado}</td>
                                                    <td>{item.descCPFCNPJ}</td>
                                                    <td>{item.descAnuncio}</td>
                                                    <td>{definirTipoAnuncio(item.codTipoAnuncio)}</td>
                                                    <td>{item.codCaderno}</td>
                                                    <td>{item.codUf}</td>
                                                    {/*  <td>{item.activate ? "Ativado" : "Desativado"}</td> */}
                                                    <td><BtnActivate data={item.activate} idd={item.codAnuncio} modulo={"anuncio"} /></td>
                                                    <td>{item.pagamentos.length > 0 ? item.pagamentos[0].status : "Isento"}</td>
                                                    <td>{item.pagamentos.length > 0 ? formatData(item.pagamentos[0].data) : "Isento"}</td>
                                                    <td>{item.pagamentos.length > 0 ? item.pagamentos[0].valor : "Isento"}</td>

                                                    <td>R$ {item.descPromocao},00</td>
                                                    <td>{formatData(item.createdAt)}</td>
                                                    <td>{item.pagamentos.length > 0 ? formatData(item.pagamentos[0].data) : "-"}</td>
                                                    <td>{dataExpiracao(item.dueDate)}</td>
                                                    <td>{item.periodo}</td>
                                                    <td>{item.codDesconto}</td>
                                                    <td>{item.codUsuario}</td>
                                                    <td>{item.loginUser}</td>
                                                    <td>{item.loginPass}</td>
                                                    <td>{item.loginEmail}</td>
                                                    <td>{item.loginContato}</td>
                                                    <td>{item.codAtividade}</td>
                                                    <td>
                                                        <a
                                                            href={`/local/${item.descAnuncio}?id=${item.codAnuncio}`}
                                                            className='text-decoration-none'
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            {`${masterPath.domain}/local/${item.codAnuncio}`}
                                                            {/*   <i class="fa fa-eye"></i>
                                                            Ver */}
                                                        </a>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>

                    </div>
                    {/*          {busca &&
                        <Pagination totalPages={anuncios.message.totalPaginas} paginaAtual={anuncios.message.paginaAtual} totalItem={anuncios.message.totalItem} table={"espacos"} />
                    } */}


                    {anuncios != '' &&
                        <Pagination totalPages={anuncios.message.totalPaginas} paginaAtual={anuncios.message.paginaAtual} totalItem={anuncios.message.totalItem} table={"espacos"} />
                    }


                </article>
                <p className='w-100 text-center'>© MINISITIO - {version.version}</p>
            </section>
            {/*  <footer className='w-100' style={{ position: "absolute", bottom: "0px" }}>
                <p className='w-100 text-center'>© MINISITIO</p>
            </footer> */}
        </div>
    );
}

export default Espacos;
