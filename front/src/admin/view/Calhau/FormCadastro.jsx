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

    function criarFrase() {

        setShowSpinner(true);

        const data = {
            "frase": document.getElementById('frase').value,
        };

        const config = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "authorization": 'Bearer ' + sessionStorage.getItem('userTokenAccess')
            },
            body: JSON.stringify(data)
        };

            fetch(`${masterPath.url}/admin/calhau/create`, config)
                .then((x) => x.json())
                .then((res) => {
                    if (res.success) {
                        setShowSpinner(false);
                       Swal.fire({
                        title: "Success!",
                        text: "Nova frase registrada!",
                        icon: "success"
                       });
                       navigate('/admin/calhau');
                    } else {
                        Swal.fire({
                            title: "Error!",
                            text: res.err,
                            icon: "error"
                           });
                        setShowSpinner(false);
                    }
                })
        

    };



    //liberar campo input
    document.querySelectorAll('[name="in"]').forEach((item) => {
        item.addEventListener("change", (event) => {
            event.target.style.border = "1px solid gray";
        })
    });

    const handleChange = (event) => {
        const { name, value } = event.target;

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
                    <h2 className="pt-4 px-5 text-center">Adicionar Frase de Calhau</h2>
                    {/* <h2>Vertical (basic) form</h2> */}
                    <form action="/action_page.php">
                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="in-codigo" className="w-50 px-1">Digite aqui uma Frase:</label>
                            <textarea name="frase" id='frase' className="form-control h-25 w-50" height={100} placeholder="Frase com até 145 caracteres" maxLength={145}></textarea>
                        </div>                                          
                        <div className="text-center py-3">
                            <button type="button"
                                className="btn btn-info custom-button mx-2 text-light"
                                onClick={criarFrase}
                            >Salvar</button>
                            <button type="submit" className="btn custom-button" onClick={() => navigate('/admin/calhau')}>Cancelar</button>
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
