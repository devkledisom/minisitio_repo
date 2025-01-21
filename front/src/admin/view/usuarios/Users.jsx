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
    const [searchOptioncheck, setSearchOptioncheck] = useState(false);
     const [progressExport, setProgressExport] = useState(0);

    const location = useLocation();
    const navigate = useNavigate();

    const getParam = new URLSearchParams(location.search);

    const param = getParam.get('page') ? getParam.get('page') : 1;

    const tokenAuth = sessionStorage.getItem('userTokenAccess');

    useEffect(() => {
        setShowSpinner(true);
        const campoPesquisa = document.getElementById('buscar');

        if (campoPesquisa.value != '') {
            Promise.all([
                fetch(`${masterPath.url}/admin/usuario/buscar/${campoPesquisa.value}?require=${searchOptioncheck}&page=${param}`).then((x) => x.json()),
                //fetch(`${masterPath.url}/admin/usuario/buscar/all`).then((x) => x.json())
            ])
                .then(([res]) => {
                    setUsuarios(res);
                    setExpotTodos(true);
                    setShowSpinner(false);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                    setShowSpinner(false);
                });
        } else {
            fetch(`${masterPath.url}/admin/usuario?page=${param}`)
                .then((x) => x.json())
                .then((res) => {
                    setUsuarios(res);
                    setShowSpinner(false);
                })
        }


        /*         fetch(`${masterPath.url}/cadernos`)
                    .then((x) => x.json())
                    .then((res) => {
                        setCaderno(res)
                    })
                fetch(`${masterPath.url}/ufs`)
                    .then((x) => x.json())
                    .then((res) => {
                        setUfs(res);
                    }) */
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
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "authorization": 'Bearer ' + tokenAuth
            }
        })
            .then((x) => {
                if (x.status == 401) {
                    alert("Sessão expirada, faça login para continuar.");
                    navigate('/login');
                    window.location.reload();
                    return Promise.reject('Sessão expirada');
                }
                return x.json();
            })
            .then((res) => {
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

            }).catch((error) => {
                if (error === 'Sessão expirada') {
                    console.log("Sessão expirada, redirecionamento já realizado.");
                    // Aqui você pode evitar que o erro seja mostrado globalmente
                } else {
                    // Trate outros erros aqui, se necessário
                    console.error('Erro na requisição:', error);
                }
            });
    };

    function buscarUserId() {
        setShowSpinner(true);
        const campoPesquisa = document.getElementById('buscar');

        if (!searchOptioncheck) {
            alert('Selecione um critério para a pesquisa');
            setShowSpinner(false);
            return;
        }

        fetch(`${masterPath.url}/admin/usuario/buscar/${campoPesquisa.value}?require=${searchOptioncheck}`)
            .then((x) => {
                if (x.status == 401) {
                    alert("Sessão expirada, faça login para continuar.");
                    navigate('/login');
                    window.location.reload();
                    return Promise.reject('Sessão expirada');
                }
                return x.json();
            })
            .then((res) => {
                if (res.success) {
                    setUsuarios(res);
                    setExpotTodos(true);
                    setShowSpinner(false);
                } else {
                    alert("Usuário não encontrado na base de dados");
                    setShowSpinner(false);
                }

            }).catch((error) => {
                if (error === 'Sessão expirada') {
                    console.log("Sessão expirada, redirecionamento já realizado.");
                    // Aqui você pode evitar que o erro seja mostrado globalmente
                } else {
                    // Trate outros erros aqui, se necessário
                    console.error('Erro na requisição:', error);
                }
            });
    };

    const formatData = (dataCompleta) => {
        if (!dataCompleta) return;
        let dataTempo = dataCompleta.split('T');
        let dataOriginal = dataTempo[0].split('-');

        return `${dataOriginal[2]}/${dataOriginal[1]}/${dataOriginal[0]}`
    };

    const style = {
        position: "fixed",
        zIndex: "999"
    }

    function exportExcell() {
        const campoPesquisa = document.getElementById('buscar');
        setShowSpinner(true);

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
        
                       // console.log(`Progresso: ${percent.toFixed(2)}%`);
                        setProgressExport(percent.toFixed(2));
                       
        
                        // Para quando alcançar o valor máximo
                        if (currentTime >= maxTime) {
                            clearInterval(intervalId);
                            console.log("Requisição concluída.");
                        }
                    }, interval);

        fetch(`${masterPath.url}/admin/usuario/export?exportAll=${exportTodos}&limit=5000&require=${searchOptioncheck}&id=${campoPesquisa.value}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "authorization": 'Bearer ' + tokenAuth
            },
            body: JSON.stringify(usuarios)
        })
            .then((x) => {
                if (x.status == 401) {
                    alert("Sessão expirada, faça login para continuar.");
                    navigate('/login');
                    window.location.reload();
                    return Promise.reject('Sessão expirada');
                }
                return x.json();
            })
            .then(res => {
                setProgressExport(0);
                if (res.success) {
                    console.log(res);
                    //window.location.href = res.downloadUrl;
                    setProgressExport(0);
                    setTimeout(() => {
                        window.location.href = res.downloadUrl;
                        setShowSpinner(false);
                    }, 2000)
                }
            }).catch((error) => {
                if (error === 'Sessão expirada') {
                    console.log("Sessão expirada, redirecionamento já realizado.");
                    // Aqui você pode evitar que o erro seja mostrado globalmente
                } else {
                    // Trate outros erros aqui, se necessário
                    console.error('Erro na requisição:', error);
                }
            });
    };


    return (
        <div className="users app-users">
            <header style={style} className='w-100'>
                <Header />
            </header>
            <section className="pt-5">

                {/* {showSpinner && <Spinner progress={0} />} */}

                {showSpinner && <Spinner progress={progressExport}/>}

                {showMsgBox && <MsgConfirm
                    title={"Atenção!"}
                    msg={"Ao apagar esse usuário todos o espaços ligados a ele serão deletados."}
                    btnTitle={"Apagar"}
                    funAction={apagarUser}
                    setShowMsgBox={setShowMsgBox} />}

                <h1 className="pt-4 px-4">Usuários</h1>
                <div className="container-fluid py-4 px-4">
                    <div className="row margin-bottom-10">
                        <div className="span6 col-md-6">
                            <button type="button" className="btn custom-button" onClick={() => navigator('/admin/usuarios/cadastro')}>Adicionar</button>
                            <button type="button" className="btn btn-info custom-button mx-2 text-light" onClick={() => navigator(`/admin/usuarios/editar?id=${selectId}`)}>Editar</button>
                            <button type="button" className="btn custom-button" onClick={exportExcell}>Exportar</button>
                            <button type="button" className="btn btn-danger custom-button text-light mx-2" onClick={() => setShowMsgBox(true)}>Apagar</button>
                        </div>
                        <div className="span6 col-md-6 d-flex flex-column align-items-end">
                            <div className='d-flex flex-column'>
                                <div className="pull-right d-flex justify-content-center align-items-center">
                                    <input id="buscar" type="text" style={{ "width": "300px" }} placeholder="Nome, Email, CPF/CNPJ, UF, Cidade ou Tipo" />
                                    <button id="btnBuscar" className="" type="button" onClick={buscarUserId}>
                                        <i className="icon-search"></i>
                                    </button>
                                </div>
                                <div className='SearchOption'>
                                    <label htmlFor="nome" onClick={() => setSearchOptioncheck('descNome')}>
                                        <input type='radio' name="option" id="nome" onClick={() => setSearchOptioncheck('descNome')} />
                                        NOME
                                    </label>

                                    <label htmlFor="email" onClick={() => setSearchOptioncheck('descEmail')}>
                                        <input type='radio' name="option" id="email" onClick={() => setSearchOptioncheck('descEmail')} />
                                        EMAIL
                                    </label>
                                    <label htmlFor="cnpj" onClick={() => setSearchOptioncheck('descCPFCNPJ')}>
                                        <input type='radio' name="option" id="cnpj" onClick={() => setSearchOptioncheck('descCPFCNPJ')} />
                                        CNPJ
                                    </label>
                                    <label htmlFor="uf" onClick={() => setSearchOptioncheck('codUf')}>
                                        <input type='radio' name="option" id="uf" onClick={() => setSearchOptioncheck('codUf')} />
                                        UF
                                    </label>
                                    <label htmlFor="caderno" onClick={() => setSearchOptioncheck('codCidade')}>
                                        <input type='radio' name="option" id="caderno" onClick={() => setSearchOptioncheck('codCidade')} />
                                        CADERNO
                                    </label>
                                    <label htmlFor="tipo" onClick={() => setSearchOptioncheck('codDesconto')}>
                                        <input type='radio' name="option" id="tipo" onClick={() => setSearchOptioncheck('codDesconto')} />
                                        TIPO
                                    </label>
                                </div>
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
                                                {item.codTipoUsuario == 4 ? <td>MASTER / ANUNC</td> : ''}
                                                {item.codTipoUsuario == 5 ? <td>PREFEITURA</td> : ''}
                                                {/*  {uf.map((estado) => (
                                                    estado.id_uf == item.codUf &&
                                                    <td>{estado.sigla_uf}</td>
                                                ))}
                                                {caderno.map((cidade) => (
                                                   
                                                    cidade.codCaderno == item.codCidade &&
                                                    <td>{cidade.nomeCaderno}</td>

                                                ))} */}
                                                <td>{item.codUf}</td>
                                                <td>{item.codCidade}</td>
                                                {item.codUf == 0 && <td>atualizar</td>}
                                                {item.codCidade == 0 && <td>atualizar</td>}
                                                <td>{formatData(item.dtCadastro)}</td>
                                                <td><BtnActivate data={item.ativo} idd={item.codUsuario} modulo={"usuario"} /></td>
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
