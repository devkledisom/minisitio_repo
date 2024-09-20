// components/OutroComponente.js
import React, { useState, useEffect } from 'react';
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
import BtnActivate from '../../components/BntActivate';
import MsgConfirm from '../../components/MsgConfirm';

const Users = () => {

    const [usuarios, setUsuarios] = useState([]);
    const [page, setPage] = useState(1);
    const [selectId, setSelectId] = useState();
    const [showSpinner, setShowSpinner] = useState(false);
    const [showMsgBox, setShowMsgBox] = useState(false);
    const [uf, setUfs] = useState([]);
    const [caderno, setCaderno] = useState([]);
    const [exportTodos, setExpotTodos] = useState(false);

    const location = useLocation();


    const getParam = new URLSearchParams(location.search);

    const param = getParam.get('page') ? getParam.get('page') : 1;



    useEffect(() => {
        setShowSpinner(true);
        fetch(`${masterPath.url}/admin/usuario?page=${param}`)
            .then((x) => x.json())
            .then((res) => {
                setUsuarios(res);
                setShowSpinner(false);
            })
        fetch(`${masterPath.url}/cadernos`)
            .then((x) => x.json())
            .then((res) => {
                setCaderno(res)
            })
        fetch(`${masterPath.url}/ufs`)
            .then((x) => x.json())
            .then((res) => {
                setUfs(res);
            })
    }, [page, param]);


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
        //setShowSpinner(true);
        fetch(`${masterPath.url}/admin/usuario/delete/${selectId}`, {
            method: "DELETE"
        })
            .then((x) => x.json())
            .then((res) => {
                //console.log(res)
                if (res.success) {
                    fetch(`${masterPath.url}/admin/usuario?page=${param}`)
                        .then((x) => x.json())
                        .then((res) => {
                            setUsuarios(res);
                            setShowMsgBox(false);
                            Swal.fire({
                                position: "top-end",
                                icon: "success",
                                title: "Registro apagado do caderno",
                                showConfirmButton: false,
                                timer: 1500
                            });
                        })
                }

            })
    };

    function buscarUserId() {
        setShowSpinner(true);
        const campoPesquisa = document.getElementById('buscar');

        fetch(`${masterPath.url}/admin/usuario/buscar/${campoPesquisa.value}`)
            .then((x) => x.json())
            .then((res) => {
                if (res.success) {
                    setUsuarios(res);
                    setExpotTodos(true);
                    setShowSpinner(false);
                } else {
                    alert("Usuário não encontrado na base de dados");
                    setShowSpinner(false);
                }

            })
    };

    const formatData = (dataCompleta) => {
        let dataTempo = dataCompleta.split('T');
        let dataOriginal = dataTempo[0].split('-');

        return `${dataOriginal[2]}/${dataOriginal[1]}/${dataOriginal[0]}`
    };

    const style = {
        position: "fixed",
        zIndex: "999"
    }

    function exportExcell() {
        console.log(exportTodos)
        fetch(`${masterPath.url}/admin/usuario/export?exportAll=${exportTodos}&limit=5000`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(usuarios)
        })
        .then(x => x.json())
        .then(res => {
            if(res.success) {
                console.log(res);
                //window.location.href = res.downloadUrl;
                setTimeout(() => {
                    window.location.href = res.downloadUrl;
                    setShowSpinner(false);
                }, 2000)
            }
        })
    };


    return (
        <div className="users">
            <header style={style} className='w-100'>
                <Header />
            </header>
            <section className="pt-5">

                {showSpinner && <Spinner />}


                {showMsgBox && <MsgConfirm
                    msg={"Apagar permanentemente esse usúario?"}
                    btnTitle={"Apagar"}
                    funAction={apagarUser} />}

                <h1 className="pt-4 px-4">Usuários</h1>
                <div className="container-fluid py-4 px-4">
                    <div className="row margin-bottom-10">
                        <div className="span6 col-md-6">
                            <button type="button" className="btn custom-button" onClick={() => navigator('/admin/usuarios/cadastro')}>Adicionar</button>
                            <button type="button" className="btn btn-info custom-button mx-2 text-light" onClick={() => navigator(`/admin/usuarios/editar?id=${selectId}`)}>Editar</button>
                            <button type="button" className="btn custom-button" onClick={exportExcell}>Exportar</button>
                            <button type="button" className="btn btn-danger custom-button text-light mx-2" onClick={() => setShowMsgBox(true)}>Apagar</button>
                        </div>
                        <div className="span6 col-md-6">
                            <div className="pull-right d-flex justify-content-center align-items-center">
                                <input id="buscar" type="text" style={{"width": "250px"}} placeholder="Nome, Email, CPF/CNPJ, UF ou Cidade" />
                                <button id="btnBuscar" className="" type="button" onClick={buscarUserId}>
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
                                        <th>NOME</th>
                                        <th>E-MAIL</th>
                                        <th>CPF/CNPJ</th>
                                        <th>SENHA</th>
                                        <th>TIPO</th>
                                        <th>UF</th>
                                        <th>CIDADE</th>
                                        <th>Cadastrado em</th>
                                        <th style={{ width: "100px" }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {console.log(usuarios)}
                                    {
                                        
                                        usuarios != '' && usuarios.usuarios.map((item) => (

                                            <tr key={item.codUsuario} id={item.codUsuario} onClick={selecaoLinha}>
                                                <td>{item.descNome}</td>
                                                <td>{item.descEmail}</td>
                                                <td>{item.descCPFCNPJ}</td>
                                                <td>{item.senha}</td>
                                                {item.codTipoUsuario == 1 ? <td>SUPER ADMIN</td> : ''}
                                                {item.codTipoUsuario == 2 ? <td>MASTER</td> : ''}
                                                {item.codTipoUsuario == 3 ? <td>ANUNCIANTE</td> : ''}
                                                {uf.map((estado) => (
                                                    estado.id_uf == item.codUf &&
                                                    <td>{estado.sigla_uf}</td>
                                                ))}
                                                {caderno.map((cidade) => (
                                                   
                                                    cidade.codCaderno == item.codCidade &&
                                                    <td>{cidade.nomeCaderno}</td>

                                                ))}
                                                {item.codUf == 0 && <td>atualizar</td>}
                                                {item.codCidade == 0 && <td>atualizar</td>}
                                                <td>{formatData(item.dtCadastro)}</td>
                                                <td><BtnActivate data={item.ativo} idd={item.codUsuario} modulo={"usuario"}/></td>
                                                {/* <td>{item.ativo ? "Ativado" : "Desativado"}</td> */}
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>

                    </div>
                    <Pagination totalPages={usuarios.totalPaginas} paginaAtual={usuarios.paginaAtual} totalItem={usuarios.totalItem} table={"users"} />

                </article>
                <p className='w-100 text-center'>© MINISITIO - {version.version}</p>
            </section>
            {/*   <footer className='w-100' style={{ position: "absolute", bottom: "0px" }}>
                <p className='w-100 text-center'>© MINISITIO</p>
            </footer> */}
        </div>
    );
}

export default Users;
