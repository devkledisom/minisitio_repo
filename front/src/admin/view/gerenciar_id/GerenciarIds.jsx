// components/OutroComponente.js
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../assets/css/users.css';
import '../../assets/css/gerenciarIds.css';
import 'font-awesome/css/font-awesome.min.css';
import { masterPath, version } from '../../../config/config';


//componente
import Header from "../Header";
import Pagination from '../../components/Pagination';
import Spinner from '../../../components/Spinner';
import BtnActivate from '../../components/BntActivate';

const GerenciarIds = () => {

    const style = {
        position: "fixed",
        zIndex: "999"
    }

    const [ids, setIds] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [page, setPage] = useState(1);
    const [selectId, setSelectId] = useState();
    const [showSpinner, setShowSpinner] = useState(true);
    const [del, setDel] = useState(false);

    const location = useLocation();


    const getParam = new URLSearchParams(location.search);

    const param = getParam.get('page') ? getParam.get('page') : 1;

    const campoBusca = useRef(null);

    useEffect(() => {
        setShowSpinner(true);

        Promise.all([
            fetch(`${masterPath.url}/admin/desconto/read?page=${param}`).then((x) => x.json()),
            //fetch(`${masterPath.url}/admin/usuario/buscar/all`).then((x) => x.json())
        ])
            .then(([resDesconto, resUsuarios]) => {
                setIds(resDesconto.message);
                //setUsuarios(resUsuarios.usuarios);
                setShowSpinner(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setShowSpinner(false);
            });

    }, [param]);




    const navigator = useNavigate();


    function selecaoLinha(event) {

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


    function apagarUser() {
        setShowSpinner(true);
        fetch(`${masterPath.url}/admin/desconto/delete/${selectId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "authorization": 'Bearer ' + masterPath.accessToken
            },
        })
            .then((x) => x.json())
            .then((res) => {

                if (res.success) {
                    setShowSpinner(false);
                    alert(res.message)
                    document.querySelector(".selecionada").remove();
                }

            })
    };

    function buscarUserId() {
        setShowSpinner(true);
        const campoPesquisa = document.getElementById('buscar');

        fetch(`${masterPath.url}/admin/desconto/buscar/${campoPesquisa.value}`)
            .then((x) => x.json())
            .then((res) => {
                
                if (res.success) {
                    alert("encontrado");
                    setIds(res);
                    setShowSpinner(false);
                } else {
                    alert("Id não encontrado na base de dados");
                    setShowSpinner(false);
                }

            })
    };

/*     function teste(meuParam) {
        let user = usuarios.find(user => user.codUsuario == meuParam);

        if (user != undefined) {
            return user.descNome
        }
        //console.log("users",meuParam, user)

    } */

    const formatData = (dataCompleta) => {
        let dataTempo = dataCompleta.split('T');
        let dataOriginal = dataTempo[0].split('-');

        return `${dataOriginal[2]}/${dataOriginal[1]}/${dataOriginal[0]}`
    };


    function exportExcell(e) {
        let tipoExport = e.target.innerText
        let filtroAtivo = campoBusca.current.value
        console.log(filtroAtivo)

        if (filtroAtivo.length >= 1) {
            fetch(`${masterPath.url}/admin/desconto/export?limit=5000&filtro=true`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": 'Bearer ' + masterPath.accessToken
                },
                body: JSON.stringify(ids.IdsValue)
            })
                .then(x => x.json())
                .then(res => {
                    if (res.success) {
                        console.log(res);
                        window.location.href = res.downloadUrl;
                    }
                })
        } else {
            fetch(`${masterPath.url}/admin/desconto/export?limit=5000&filtro=false`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": 'Bearer ' + masterPath.accessToken
                },
                body: JSON.stringify(ids.IdsValue)
            })
                .then(x => x.json())
                .then(res => {
                    if (res.success) {
                        console.log(res);
                        window.location.href = res.downloadUrl;
                    }
                })
        }
       /*  if (tipoExport === "Todos") {
            fetch(`${masterPath.url}/admin/desconto/export?limit=5000&filtro=false`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(ids.IdsValue)
            })
                .then(x => x.json())
                .then(res => {
                    if (res.success) {
                        console.log(res);
                        window.location.href = res.downloadUrl;
                    }
                })
        } else if (tipoExport === "Filtro" && filtroAtivo != '') {

            fetch(`${masterPath.url}/admin/desconto/export?limit=5000&filtro=true`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(ids.IdsValue)
            })
                .then(x => x.json())
                .then(res => {
                    if (res.success) {
                        console.log(res);
                        window.location.href = res.downloadUrl;
                    }
                })
        } else {
            alert("Selecione um filtro para exportar");
        } */

        /*   fetch(`${masterPath.url}/admin/desconto/export?limit=5000`, {
              method: "POST",
              headers: {
                  "Content-Type": "application/json"
              },
              body: JSON.stringify(ids.IdsValue)
          })
              .then(x => x.json())
              .then(res => {
                  if (res.success) {
                      console.log(res);
                      window.location.href = res.downloadUrl;
                  }
              }) */
    };

    return (
        <div className="users">
          {/*   <header style={style} className='w-100'>
                <Header />
            </header> */}
            <section>

                {showSpinner && <Spinner />}

                <h1 className="px-4">Gerenciar IDs</h1>
                <div className="container-fluid py-4 px-4">
                    <div className="row margin-bottom-10">
                        <div className="span6 col-md-6 d-flex">
                            <button type="button" className="btn custom-button" onClick={() => navigator('/admin/desconto/cadastro')}>Adicionar</button>
                            <button type="button" className="btn btn-info custom-button mx-2 text-light" onClick={() => navigator(`/admin/desconto/editar?id=${selectId}`)}>Editar</button>
                            <button type="button" className="btn custom-button" onClick={exportExcell}>Exportar</button>
                            <button type="button" className="btn btn-danger custom-button text-light mx-2" onClick={apagarUser}>Apagar</button>
                           {/*  <div class="dropdown">
                                <button class="btn btn-danger dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                    Exportar
                                    <i class="bi bi-chevron-down px-2"></i>
                                </button>
                                <ul class="dropdown-menu lista-cart" aria-labelledby="dropdownMenuButton1">
                                    <li><button onClick={exportExcell}>Todos</button></li>
                                    <li><button onClick={exportExcell}>Filtro</button></li>
                                </ul>
                            </div> */}
                        </div>
                        <div className="span6 col-md-6">
                            <div className="pull-right d-flex justify-content-center align-items-center">
                                <input id="buscar" type="text" placeholder="Código, usuário"  ref={campoBusca}/>
                                <button id="btnBuscar" className="" type="button" onClick={buscarUserId}>
                                    <i className="icon-search"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <article>
                    <div className="container-fluid">
                        <div className='row px-4 table-responsive'>
                            <table className="table table-bordered table-striped table-hover">
                                <thead>
                                    <tr>
                                        {/* <th>Nome</th> */}
                                        <th style={{ "width": "200px" }}>Usuário</th>
                                        <th style={{ "width": "100px" }}>Desconto</th>
                                        <th style={{ "width": "150px" }}>Código</th>
                                        <th style={{ "width": "250px" }}>Descrição</th>
                                        <th style={{ "width": "200px" }}>Cadastrado em</th>

                                        <th style={{ "width": "150px" }}>Qtde Espaços</th>
                                        <th style={{ "width": "100px" }}>Saldo</th>
                                        <th style={{ "width": "100px" }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        /* usuarios != '' && */
                                        ids != '' && ids.IdsValue.map((item) => {
                                            //console.log("map", usuarios)
                                            //console.log("ids", ids)

                                            return (
                                                <tr key={item.idDesconto} id={item.idDesconto} onClick={selecaoLinha}>

                                                    {/* <td>{teste(item.idUsuario)}</td> */}
                                                    <td>{item.nmUsuario}</td>
                                                    <td>{String(parseFloat(item.desconto).toFixed(2)).replace('.', ',')}</td>
                                                    {/* <td>{parseFloat(item.desconto).toFixed(2)}</td> */}
                                                    <td>{item.hash}</td>
                                                    <td>{item.descricao}</td>
                                                    <td>{formatData(item.dtCadastro)}</td>
                                                    {/*  <td>{item.ativo ? "Ativado" : "Desativado"}</td> */}
                                                    <td>{item.total_registros}</td>
                                                    <td>{item.saldo}</td>
                                                    <td><BtnActivate data={item.ativo} idd={item.idDesconto} modulo={"desconto"} /></td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>

                    </div>
                    <Pagination totalPages={ids.totalPaginas} paginaAtual={ids.paginaAtual} totalItem={ids.totalItem} table={"desconto"} />

                </article>
                <p className='w-100 text-center'>© MINISITIO - {version.version}</p>
            </section>
            {/*  <footer className='w-100' style={{ position: "absolute", bottom: "0px" }}>
                <p className='w-100 text-center'>© MINISITIO</p>
            </footer> */}
        </div>
    );
}

export default GerenciarIds;
