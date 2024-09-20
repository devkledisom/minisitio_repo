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

    const [pinValue, setAtividade] = useState(false);
    const [page, setPage] = useState(1);
    const [showSpinner, setShowSpinner] = useState(false);


    const location = useLocation();


    const getParam = new URLSearchParams(location.search);

    const param = getParam.get('id') ? getParam.get('id') : 1;



    useEffect(() => {

        fetch(`${masterPath.url}/admin/pin/edit/${param}`)
            .then((x) => x.json())
            .then((res) => {
                console.log(res)
                if(!res.success) return; 
                setAtividade(res.data[0]);
                console.log(res);
            })

    }, [page, param]);

    const style = {
        position: "fixed",
        zIndex: "999"
    };

    const navigate = useNavigate();

    function atualizarAtividade() {

        var validation = false;
        setShowSpinner(true);

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
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        };

        if (validation) {
            fetch(`${masterPath.url}/admin/pin/update?id=${param}`, config)
                .then((x) => x.json())
                .then((res) => {
                    if (res.success) {
                        setShowSpinner(false);
                        Swal.fire({
                            title: "success!",
                            text: "Código Pin atualizado!",
                            icon: "success"
                        })
                    } else {
                        Swal.fire({
                            title: "Error!",
                            text: res.message,
                            icon: "error"
                           });
                        setShowSpinner(false);
                    }
                })
        }

    };


    //liberar campo input
    document.querySelectorAll('[name="pwd"]').forEach((item) => {
        item.addEventListener("change", (event) => {
            event.target.style.border = "1px solid gray";
        })
    });

    const handleChange = (event) => {
        const { name, value } = event.target;

        switch (event.target.id) {
            case "in-codigo":
                pinValue.codigo = value;
                break;
            case "in-validade":
                pinValue.validade = value;
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
                    <h2 className="pt-4 px-5 text-center">Atualizar PIN</h2>
                    {/* <h2>Vertical (basic) form</h2> */}
                    <form action="/action_page.php">
                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label for="codigo" className="w-50 px-1">Código:</label>
                            <input type="text"
                             className="form-control h-25 w-50" 
                             id="in-codigo"
                              name="in"
                              value={pinValue ? pinValue.codigo : ''}
                              onChange={handleChange}
                               />
                        </div>
                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label for="validade" className="w-50 px-1">Válido até:</label>
                            <InputMask mask={'99/99/9999'} className="form-control h-25 w-50" 
                             id="in-validade"
                              name="in"
                              value={pinValue ? pinValue.validade : ''}
                              onChange={handleChange}></InputMask>
                           {/*  <input type="text"
                             className="form-control h-25 w-50" 
                             id="in-validade"
                              name="in"
                              value={pinValue ? pinValue.validade : ''}
                              onChange={handleChange}
                               /> */}
                        </div>
                      
                        <div className="text-center py-3">
                            <button type="button"
                                className="btn btn-info custom-button mx-2 text-light"
                                onClick={atualizarAtividade}
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
