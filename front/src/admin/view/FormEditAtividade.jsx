// components/OutroComponente.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../assets/css/users.css';
import 'font-awesome/css/font-awesome.min.css';
import { masterPath } from '../../config/config';

//componente
import Header from "./Header";
import Spinner from '../../components/Spinner';

const FormCadastro = () => {

    const [atividadeValue, setAtividade] = useState(false);
    const [page, setPage] = useState(1);
    const [showSpinner, setShowSpinner] = useState(false);


    const location = useLocation();


    const getParam = new URLSearchParams(location.search);

    const param = getParam.get('page') ? getParam.get('page') : 1;



    useEffect(() => {

        fetch(`${masterPath.url}/admin/atividade?id=${param}`)
            .then((x) => x.json())
            .then((res) => {
                if(!res.success) return; 
                setAtividade(res.message[0]);
                console.log(res);
            })

    }, [page, param]);

    const style = {
        position: "fixed",
        zIndex: "999"
    }

    const navigate = useNavigate();

    function atualizarAtividade() {

        var validation = false;
        setShowSpinner(true);

        document.querySelectorAll('[name="pwd"]').forEach((item) => {
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
        });

        const data = {
            "atividade": document.getElementById('in_atividade').value,
            "corTitulo": document.getElementById('corTitulo').value,
        };

        const config = {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        };

        if (validation) {
            fetch(`${masterPath.url}/admin/atividade/update?id=${param}`, config)
                .then((x) => x.json())
                .then((res) => {
                    if (res.success) {
                        setShowSpinner(false);
                        alert("Usuário Cadastrado!");
                    } else {
                        alert(res.message);
                    }
                })
        }

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

    const handleChange = (event) => {
        const { name, value } = event.target;

        switch (event.target.id) {
            case "atividade":
                atividadeValue.atividade = value;
                break;
            case "corTitulo":
                atividadeValue.corTitulo = value;
                break;
            default:
                console.log("não encontrou");
                break;
        }


        setAtividade(prevState => ({
            ...prevState,
            [name]: value
        }));


    };

    return (
        <div className="users">
            <header style={style} className='w-100'>
                <Header />
            </header>
            <section className='py-5'>
            {showSpinner && <Spinner />}

                <div className="container">
                    <h2 className="pt-4 px-5 text-center">Adicionar Atividade</h2>
                    {/* <h2>Vertical (basic) form</h2> */}
                    <form action="/action_page.php">
                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label for="atividade" className="w-50 px-1">Atividade:</label>
                            <input type="atividade"
                             className="form-control h-25 w-50" 
                             id="in_atividade"
                              name="atividade"
                              value={atividadeValue ? atividadeValue.atividade : ''}
                              onChange={handleChange}
                               />
                        </div>
                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label for="corTitulo" className="w-50 px-1">Tipo Titulo:</label>
                            <select name="corTitulo"
                             id="corTitulo" 
                             className="w-50 py-1"
                             value={atividadeValue.corTitulo} onChange={handleChange} >
                                <option value="">- Selecione o tipo de Titulo -</option>
                                <option value="normal">Normal</option>
                                <option value="principal">Principal</option>
                                <option value="capa">Capa</option>
                            </select>
                        </div>

                      
                        <div className="text-center py-3">
                            <button type="button"
                                className="btn btn-info custom-button mx-2 text-light"
                                onClick={atualizarAtividade}
                            >Atualizar Dados</button>
                            <button type="submit" className="btn custom-button" onClick={() => navigate('/atividades')}>Cancelar</button>
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
