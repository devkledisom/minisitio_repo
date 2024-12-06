// components/OutroComponente.js
import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../assets/css/users.css';
import 'font-awesome/css/font-awesome.min.css';
import { masterPath, version } from '../../../config/config';

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
    const [del, setDel] = useState(false);


    const location = useLocation();


    const getParam = new URLSearchParams(location.search);

    const param = getParam.get('page') ? getParam.get('page') : 1;

    const campoBusca = useRef();
    const codOriginFather = useRef();

    useEffect(() => {
        setShowSpinner(true);

        if (campoBusca.current.value != '') {
            Promise.all([
                fetch(`${masterPath.url}/admin/anuncio/buscar?search=${campoBusca.current.value}&page=${param}`).then((x) => x.json()),
                fetch(`${masterPath.url}/admin/usuario/buscar/all`).then((x) => x.json())
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
        } else {
            Promise.all([
                fetch(`${masterPath.url}/admin/espacos/read?page=${param}`).then((x) => x.json()),
                fetch(`${masterPath.url}/admin/usuario/buscar/all`).then((x) => x.json())
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
            method: "DELETE"
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
                    method: "DELETE"
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
            method: "DELETE"
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
        const campoPesquisa = document.getElementById('buscar').value;

        fetch(`${masterPath.url}/admin/anuncio/buscar/?search=${campoPesquisa}`)
            .then((x) => x.json())
            .then((res) => {
                console.log(res)
                if (res.success) {
                    //alert("encontrado");
                    setAnucios(res);
                    setShowSpinner(false);
                    console.log("usussss", res);
                } else {
                    alert("Anúncio não encontrado na base de dados");
                    setShowSpinner(false);
                }

            })
        /* 
                fetch(`${masterPath.url}/admin/anuncio/buscar/?search=${campoPesquisa}`)
                    .then(response => {
                        const reader = response.body.getReader();
                        const decoder = new TextDecoder('utf-8');
                        let jsonBuffer = '';
        
                        reader.read().then(function processChunk({ done, value }) {
                            if (done) {
                                console.log('Todos os registros foram recebidos.');
                                return;
                            }
        
                            jsonBuffer += decoder.decode(value); // Decodifica os dados recebidos
                            const records = JSON.parse(decoder.decode(value)); // Transforma em JSON
                            console.log('Registros recebidos:', records);
        
                            return reader.read().then(processChunk); // Continua lendo
                        });
                    })
                    .catch(error => console.error('Erro ao receber registros:', error)); */

    };

    const formatData = (dataCompleta) => {
        let dataTempo = dataCompleta.split('T');
        let dataOriginal = dataTempo[0].split('-');

        return `${dataOriginal[2]}/${dataOriginal[1]}/${dataOriginal[0]}`;
    };

    const dataExpiracao = (dataCompleta) => {

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
            default:
                return "Tipo desconhecido";
        }
    };

    function exportExcell() {
        fetch(`${masterPath.url}/admin/anuncio/export?limit=5000`, {
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
                    window.location.href = res.downloadUrl;
                }
            })
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

    return (
        <div className="users">
            <header style={style} className='w-100'>
                <Header />
            </header>
            <section className="pt-5">

                {showSpinner && <Spinner />}

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
                            {campoBusca.current.value != '' &&
                                <button type="button" className="btn btn-danger custom-button text-light mx-2" onClick={apagarDup}>Apagar Duplicação</button>
                            }
                            <button type="button" className="btn btn-info custom-button text-light" onClick={editRow}>Editar</button>
                        </div>
                        <div className="span6 col-md-6">
                            <div className="pull-right d-flex justify-content-center align-items-center">
                                <input id="buscar" type="text" placeholder="Código, CPF/CNPJ, ID ou UF" onKeyDown={(e) => e.key == "Enter" ? buscarAnuncioId() : ''} ref={campoBusca} />
                                <button id="btnBuscar" className="" type="button" onClick={buscarAnuncioId} >
                                    <i className="icon-search"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <article>
                    <div className="container-fluid">
                        <div className='row px-4'>
                            <table className="table table-bordered table-striped table-hover">
                                <thead>
                                    <tr>
                                        {/* <th>Nome</th> */}
                                        <th style={{ "width": "auto" }}>Código</th>
                                        <th style={{ "width": "100px" }}>CodOrigem</th>
                                        <th style={{ "width": "auto" }}>Duplicado</th>
                                        <th style={{ "width": "auto" }}>CPF/CNPJ</th>
                                        <th style={{ "width": "auto" }}>Nome</th>
                                        <th style={{ "width": "auto" }}>Tipo</th>
                                        <th style={{ "width": "auto" }}>Caderno</th>
                                        <th style={{ "width": "auto" }}>UF</th>
                                        <th style={{ "width": "auto" }}>Status</th>
                                        <th style={{ "width": "auto" }}>Pagamento</th>
                                        <th style={{ "width": "auto" }}>Valor</th>
                                        <th style={{ "width": "auto" }}>Cadastrado em</th>
                                        <th style={{ "width": "auto" }}>Data Fim</th>
                                        <th style={{ "width": "auto" }}>ID Desconto</th>
                                        <th style={{ "width": "auto" }}>Usuário</th>
                                        <th style={{ "width": "auto" }}>Login</th>
                                        <th style={{ "width": "auto" }}>Senha</th>
                                        <th style={{ "width": "auto" }}>Email</th>
                                        <th style={{ "width": "auto" }}>Contato</th>
                                        <th style={{ "width": "auto" }}>Atividade Principal</th>

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
                                                    <td>Isento</td>
                                                    <td>{item.descPromocao}</td>
                                                    <td>{formatData(item.createdAt)}</td>
                                                    <td>{dataExpiracao(item.dueDate)}</td>
                                                    <td>{item.codPA}</td>
                                                    <td>{item.codUsuario}</td>
                                                    <td>{item.loginUser}</td>
                                                    <td>{item.loginPass}</td>
                                                    <td>{item.loginEmail}</td>
                                                    <td>{item.loginContato}</td>
                                                    <td>{item.mainAtividade}</td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>

                    </div>
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
