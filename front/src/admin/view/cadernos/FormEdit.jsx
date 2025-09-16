// components/OutroComponente.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../assets/css/users.css';
import 'font-awesome/css/font-awesome.min.css';
import { masterPath } from '../../../config/config';

//componente
import Header from "../Header";
import Spinner from '../../../components/Spinner';
import ChooseFile from "./ChooseFile";

const FormCadastro = () => {

    const [page, setPage] = useState(1);
    const [uf, setUfs] = useState([]);
    const [ufSelect, setUf] = useState();
    const [caderno, setCaderno] = useState('');

    const [showSpinner, setShowSpinner] = useState(false);

    const location = useLocation();


    const getParam = new URLSearchParams(location.search);

    const param = getParam.get('id') ? getParam.get('id') : 1;

    const tokenAuth = sessionStorage.getItem('userTokenAccess');

    useEffect(() => {
        setShowSpinner(true);
        fetch(`${masterPath.url}/admin/cadernos/edit/${param}`)
            .then((x) => x.json())
            .then((res) => {
                setShowSpinner(false);
                setCaderno(res[0])

            }).catch((err) => {
                console.log(err)
            })
        fetch(`${masterPath.url}/ufs`)
            .then((x) => x.json())
            .then((res) => {
                setUfs(res);
            })
    }, [page, param]);

    const style = {
        position: "fixed",
        zIndex: "999"
    }

    const navigate = useNavigate();


    function editCaderno() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        var validation = true;
        setShowSpinner(true);

        const config = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "authorization": 'Bearer ' + tokenAuth
            },
            body: JSON.stringify(caderno)
        };

        if (validation) {
            fetch(`${masterPath.url}/admin/cadernos/update?id=${param}`, config)
                .then((x) => x.json())
                .then((res) => {
                    if (res.success) {
                        setShowSpinner(false);
                        setTimeout(() => { alert("Caderno Atualizado!") }, 1000)

                    } else {
                        setShowSpinner(false);
                        setTimeout(() => { alert(res.message) }, 1000)
                    }
                })
        }

    };

    const executarSelecao = () => {
        let codigoUf = document.querySelectorAll('#coduf')[0].value;
        setUf(codigoUf);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setCaderno(prevState => ({
            ...prevState,
            [name]: value
        }));

    }

    const handleChange2 = (data) => {
        //console.log("taklsfkjlksdfjlfg: ", data.name)
        setCaderno(prevState => ({
            ...prevState,
            ["descImagem"]: data.name
        }));

    }

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
                    <h2 className="pt-4 px-5 text-center">Editar Caderno</h2>
                    {/* <h2>Vertical (basic) form</h2> */}
                    <form action="/action_page.php">
                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="codUf" className="w-50 px-1">UF:</label>
                            <select name="codUf" id="codUf" className="w-50 py-1" onChange={handleChange} value={caderno.codUf} >
                                <option>- Selecione um estado -</option>
                                {
                                    uf.map((uf) => (
                                        <option key={uf.id_uf} value={uf.id_uf}>{uf.sigla_uf}</option>
                                    ))
                                }
                            </select>
                        </div>

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="nomeCaderno" className="w-50 px-1">Nome Caderno:</label>
                            <input type="text" className="form-control h-25 w-50" id="nomeCaderno"
                                name="nomeCaderno"
                                value={caderno.nomeCaderno}
                                onChange={handleChange} />

                        </div>

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="isCapital" className="w-50 px-1">É Capital:</label>
                            {/*  <input type="password" className="form-control h-25 w-50" id="pwd" placeholder="" name="pwd" /> */}
                            <select name="isCapital" id="isCapital" className="w-50 py-1" value={caderno.isCapital} onChange={handleChange} >
                                <option value="1">Não</option>
                                <option value="0">Sim</option>
                            </select>
                        </div>

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            {/*    <label htmlFor="pwd" className="w-50 px-1">Imagem:</label>
                            <input type="file" className="form-control h-25 w-50" id="endereco" placeholder="" name="pwd" /> */}
                            {caderno.descImagem == 0 && <ChooseFile codigoUser={param} largura={"w-50"} preview={false} teste={handleChange2} miniPreview={true} local={'mosaico'} />}
                            {caderno.descImagem != 0 && <ChooseFile codigoUser={param} largura={"w-50"}
                                codImg={caderno.descImagem}
                                preview={false}
                                teste={handleChange2}
                                miniPreview={false} local={'mosaico'} />}

                        </div>

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="cep_inicial" className="w-50 px-1">Cep Inicial:</label>
                            <input type="text" className="form-control h-25 w-50" id="cepInicial" value={caderno.cep_inicial} name="cep_inicial" onChange={handleChange} />
                        </div>

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="cep_final" className="w-50 px-1">Cep Final:</label>
                            <input type="text" className="form-control h-25 w-50" id="cepFinal" value={caderno.cep_final} name="cep_final" onChange={handleChange} />
                        </div>


                        <div className="text-center py-3">
                            <button type="button"
                                className="btn btn-info custom-button mx-2 text-light"
                                onClick={editCaderno}
                            >Atualizar</button>
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
