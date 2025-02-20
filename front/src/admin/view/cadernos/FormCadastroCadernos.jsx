// components/OutroComponente.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../assets/css/users.css';
import 'font-awesome/css/font-awesome.min.css';
import { masterPath } from '../../../config/config';

//LIBS
import Swal from 'sweetalert2';

//componente
import Header from "../Header";
import Spinner from '../../../components/Spinner';
import ChooseFile from "../../../components/ChooseFile";

const FormCadastro = () => {

    const [usuarios, setUsuarios] = useState([]);
    const [page, setPage] = useState(1);
    const [ufSelected, setUf] = useState(0);
    const [uf, setUfs] = useState([]);
    const [caderno, setCaderno] = useState([]);
    const [descImg, setDescImg] = useState();

    const [showSpinner, setShowSpinner] = useState(false);

    const location = useLocation();


    const getParam = new URLSearchParams(location.search);

    const param = getParam.get('page') ? getParam.get('page') : 1;

    const tokenAuth = sessionStorage.getItem('userTokenAccess');

    useEffect(() => {
        setShowSpinner(true);
        fetch(`${masterPath.url}/admin/usuario?page=${param}`)
            .then((x) => x.json())
            .then((res) => {
                setUsuarios(res);
                console.log(usuarios);
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
                setShowSpinner(false);
            })
    }, [page, param]);

    const style = {
        position: "fixed",
        zIndex: "999"
    }

    const navigate = useNavigate();

    function cadastrarUsuario() {
        setShowSpinner(true);

        var validation = true;

        /*         document.querySelectorAll('[name="pwd"]').forEach((item) => {
                    if (item.value == "") {
                        item.style.border = "1px solid red";
                        validation = false;
                        return;
                    } else {
                        item.style.border = "1px solid gray";
                        validation = true;
                    };
                });
        
                document.querySelectorAll('select').forEach((item) => {
                    if (item.value == "") {
                        item.style.border = "1px solid red";
                        validation = false;
                        return;
                    } else {
                        item.style.border = "1px solid gray";
                        validation = true;
                    };
                }); */

        const data = {
            codUf: document.querySelector('#coduf').value,
            nomeCaderno: document.querySelector('#nomeCaderno').value,
            nomeCadernoFriendly: document.querySelector('#nomeCaderno').value,
            descImagem: localStorage.getItem("imgname"),
            cep_inicial: document.querySelector('#cepInicial').value,
            cep_final: document.querySelector('#cepFinal').value,
            isCapital: document.querySelector('#isCapital').value
        };

        const config = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "authorization": 'Bearer ' + tokenAuth
            },
            body: JSON.stringify(data)
        };
        //console.log(data);

        if (validation) {
            fetch(`${masterPath.url}/admin/cadernos/create`, config)
                .then((x) => x.json())
                .then((res) => {
                    if (res.success) {
                        setShowSpinner(false);
                        Swal.fire({
                            title: 'sucesso!',
                            text: 'Caderno Cadastrado!',
                            icon: 'success',
                            confirmButtonText: 'Confirmar'
                          })
                    } else {
                        setShowSpinner(false);

                        alert(res.message);
                    }
                })
        }

    };

    const executarSelecao = () => {
        let codigoUf = document.querySelectorAll('#coduf')[0].value;
        setUf(codigoUf);
    };

    const handleChange = (e) => {
        console.log("dabjjskdfnsladnfsjkafnjklsdfn: ", e.target)
        const { name, value } = e.target;
        setDescImg(value);
    };

    //liberar campo select
    document.querySelectorAll('select').forEach((item) => {
        item.addEventListener("change", (event) => {
            event.target.style.border = "1px solid gray";
        })
    });
    //liberar campo input
    document.querySelectorAll('[name="pwd"]').forEach((item) => {
        item.addEventListener("change", (event) => {
            event.target.style.border = "1px solid gray";
        })
    });

    return (
        <div className="users">
            <header style={style} className='w-100'>
                <Header />
            </header>
            <section className='py-5'>

                {showSpinner && <Spinner />}

                <div className="container">
                    <h2 className="pt-4 px-5 text-center">Adicionar Caderno</h2>
                    {/* <h2>Vertical (basic) form</h2> */}
                    <form action="/action_page.php">
                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="coduf" className="w-50 px-1">UF:</label>
                            <select name="coduf" id="coduf" onChange={executarSelecao} className="w-50 py-1">
                                <option value="" selected="selected">- Selecione um estado -</option>
                                {
                                    uf.map((uf) => (
                                        <option value={uf.id_uf}>{uf.sigla_uf}</option>
                                    ))
                                }
                            </select>
                        </div>

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="nomeCaderno" className="w-50 px-1">Nome Caderno:</label>
                            <input type="text" className="form-control h-25 w-50" id="nomeCaderno" placeholder="" name="nomeCaderno" />
                        </div>

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="isCapital" className="w-50 px-1">É Capital:</label>
                            {/*  <input type="password" className="form-control h-25 w-50" id="pwd" placeholder="" name="pwd" /> */}
                            <select name="isCapital" id="isCapital" className="w-50 py-1">
                                <option value="1">Não</option>
                                <option value="0">Sim</option>
                            </select>
                        </div>

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label className="w-50 px-1">Mosaico:</label>
                            <ChooseFile codigoUser={param} largura={"w-50"} preview={false} miniPreview={true} />

                        </div>

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="cepInicial" className="w-50 px-1">Cep Inicial:</label>
                            <input type="text" className="form-control h-25 w-50" id="cepInicial" placeholder="" name="cepInicial" />
                        </div>

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="cepFinal" className="w-50 px-1">Cep Final:</label>
                            <input type="text" className="form-control h-25 w-50" id="cepFinal" placeholder="" name="cepFinal" />
                        </div>


                        <div className="text-center py-3">
                            <button type="button"
                                className="btn btn-info custom-button mx-2 text-light"
                                onClick={cadastrarUsuario}
                            >Salvar</button>
                            <button type="submit" className="btn custom-button" onClick={() => navigate('/admin/cadernos')}>Cancelar</button>
                        </div>
                    </form>
                </div>
            </section >
            <footer className='w-100' style={{ position: "relative", bottom: "0px" }}>
                <p className='w-100 text-center'>© MINISITIO</p>
            </footer>
        </div >
    );
}

export default FormCadastro;
