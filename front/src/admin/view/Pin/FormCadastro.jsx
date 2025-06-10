// components/OutroComponente.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../assets/css/users.css';
import 'font-awesome/css/font-awesome.min.css';
import { masterPath } from '../../../config/config';

//componente
import Header from "../Header";
import Spinner from '../../../components/Spinner';

//LIBS
import Swal from 'sweetalert2';
import InputMask from 'react-input-mask';

const FormCadastro = () => {

  
    const [atividadeValue, setAtividade] = useState(false);
    const [page, setPage] = useState(1);
    const [showSpinner, setShowSpinner] = useState(false);


    const location = useLocation();

    const navigate = useNavigate();

    const getParam = new URLSearchParams(location.search);

    const param = getParam.get('page') ? getParam.get('page') : 1;

    const style = {
        position: "fixed",
        zIndex: "999"
    };

    function criarPin() {

        var validation = false;
        setShowSpinner(true);

        const tokenAuth = sessionStorage.getItem('userTokenAccess');

        document.querySelectorAll('[name="in"]').forEach((item) => {
            if (item.value == "") {
                item.style.border = "1px solid red";
                validation = false;
                setShowSpinner(false);
                return;
            } else {
                item.style.border = "1px solid gray";
                validation = true;
            };
        });

        const data = {
            "codigo": document.getElementById('in-codigo').value,
            "validade": document.getElementById('in-validade').value,
        };

        const config = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "authorization": 'Bearer ' + tokenAuth
            },
            body: JSON.stringify(data)
        };

        if (validation) {
            fetch(`${masterPath.url}/admin/pin/create`, config)
                .then((x) => x.json())
                .then((res) => {
                    if (res.success) {
                        setShowSpinner(false);
                       Swal.fire({
                        title: "Success!",
                        text: "Novo Pin registrado!",
                        icon: "success"
                       });
                    } else {
                        Swal.fire({
                            title: "Error!",
                            text: res.err,
                            icon: "error"
                           });
                        setShowSpinner(false);
                    }
                })
        }

    };


    //liberar campo select
/*     document.querySelectorAll('select').forEach((item) => {
        item.addEventListener("change", (event) => {
            event.target.style.border = "1px solid gray";
        })
    }); */
    //liberar campo input
    document.querySelectorAll('[name="in"]').forEach((item) => {
        item.addEventListener("change", (event) => {
            event.target.style.border = "1px solid gray";
        })
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
/* 
        switch (event.target.id) {
            case "in-codigo":
                atividadeValue.atividade = value;
                break;
            case "in-validade":
                atividadeValue.corTitulo = value;
                break;
            default:
                console.log("não encontrou");
                break;
        } */


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
                    <h2 className="pt-4 px-5 text-center">Adicionar PIN</h2>
                    {/* <h2>Vertical (basic) form</h2> */}
                    <form action="/action_page.php">
                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label for="in-codigo" className="w-50 px-1">Código:</label>
                            <input type="text" className="form-control h-25 w-50" id="in-codigo" placeholder="codigo pin promocional" name="in" />
                        </div>
                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label for="in-validade" className="w-50 px-1">Válido até:</label>
                            <InputMask mask={'99/99/9999'} type="text" className="form-control h-25 w-50" id="in-validade" placeholder="Data de validade do codigo" name="in"></InputMask>
                           {/*  <input type="text" className="form-control h-25 w-50" id="in-validade" placeholder="" name="in" /> */}
                        </div>
                                          
                        <div className="text-center py-3">
                            <button type="button"
                                className="btn btn-info custom-button mx-2 text-light"
                                onClick={criarPin}
                            >Salvar</button>
                            <button type="submit" className="btn custom-button" onClick={() => navigate('/admin/pin')}>Cancelar</button>
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
