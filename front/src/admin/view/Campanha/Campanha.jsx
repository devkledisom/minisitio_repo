// components/OutroComponente.js
import React, { useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../assets/css/users.css';
import '../../assets/css/campanha.css';
import 'font-awesome/css/font-awesome.min.css';
import { masterPath, version } from '../../../config/config';
import { Link } from 'react-router-dom';


import '../../../styles/globals.css';



//componente
import Header from "../Header";
import Pagination from '../../components/Pagination';
import Spinner from '../../../components/Spinner';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import FormCampanha from './_componentes/formCampanha';
import TableListCampanha from './_componentes/TableListCampanha';

import { Modal } from 'react-bootstrap';

const Campanha = () => {

    const [paginasTotal, setPaginas] = useState();
    const [selectId, setSelectId] = useState();
    const [calhaus, setCalhaus] = useState([]);
    const [showSpinner, setShowSpinner] = useState(true);
    const [show, setShow] = useState(false);


    const location = useLocation();
    const navigator = useNavigate();


    const getParam = new URLSearchParams(location.search);

    const param = getParam.get('page') ? getParam.get('page') : 1;


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
        fetch(`${masterPath.url}/admin/calhau/delete/${selectId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "authorization": 'Bearer ' + sessionStorage.getItem('userTokenAccess')
            },
        })
            .then((x) => x.json())
            .then((res) => {
                setShowSpinner(true);
                if (res.success) {
                    fetch(`${masterPath.url}/admin/calhau/read?page=${param}`)
                        .then((x) => x.json())
                        .then((res) => {
                            setCalhaus(res.message.frases)
                            setPaginas(res.message.totalPaginas)
                            setShowSpinner(false);
                            //console.log(res.message);
                        })
                }

            })
    };

    function buscarUserId() {
        setShowSpinner(true);
        const campoPesquisa = document.getElementById('buscar');

        fetch(`${masterPath.url}/admin/atividade?nome=${campoPesquisa.value}`)
            .then((x) => x.json())
            .then((res) => {
                if (res.success) {
                    console.log(res)
                    setCalhaus(res.message);
                    setShowSpinner(false);
                } else {
                    alert("Usuário não encontrado na base de dados");
                    setShowSpinner(false);
                }

            })
    };

    const style = {
        position: "fixed",
        zIndex: "999"
    }

    const formatdata = (param) => {
        let data = param.split("T")[0];
        let arrData = data.split("-");
        return `${arrData[2]}/${arrData[1]}/${arrData[0]}`
    }


    const handleClose = () => {
        setShow(false);
        //props.setShowState(false);
    };

    const [campanhas, setCampanhas] = useState([]);

    function fetchCampanhas() {
        fetch(`${masterPath.url}/admin/campanha/read`)
            .then((x) => x.json())
            .then((res) => {
                if (res.success) {
                    setCampanhas(res.data);
                    setShowSpinner(false);

                    return;
                }

                setShowSpinner(false);

                //setIdsList(res.message.IdsValue)
            })
    }

    useEffect(() => {
        fetchCampanhas();

    }, []);

    return (
        <div className="config-portal">


            <div className='container-fluid'>
                <section>
                    {showSpinner && <Spinner />}
                    <div className="row">
                        <div className="col-md-6 px-4">
                            <h1><strong>Campanha</strong></h1>
                            <span>Gerencie suas campanhas de email marketing</span>
                        </div>

                        <div className="col-md-6 d-flex justify-content-end align-items-center pt-4 px-4" style={{ marginTop: "20px" }}>
                            <Button className="" onClick={() => setShow(true)}>Gerar Nova Campanha</Button>
                        </div>

                    </div>

                    <hr />

                    <Modal show={show} onHide={handleClose} size="lg" centered>
                        <Modal.Header closeButton>
                            <Modal.Title>Detalhes da campanha</Modal.Title>
                        </Modal.Header>

                        <Modal.Body className="form-campanha">
                            <FormCampanha fetchCampanhas={fetchCampanhas} setShowSpinner={setShowSpinner} setShow={setShow} />
                        </Modal.Body>

                        <Modal.Footer>
                            {/* Caso queira botões extras, como "Cancelar" */}
                        </Modal.Footer>
                    </Modal>



                    <article className="pt-5">
                        <div className="container-fluid">
                            <TableListCampanha campanhas={campanhas} setShowSpinner={setShowSpinner} fetchCampanhas={fetchCampanhas} />
                        </div>
                        {/*  <Pagination totalPages={paginasTotal} table={"pin"} /> */}


                    </article>
                    {/*   <p className='w-100 text-center'>© MINISITIO - {version.version}</p> */}
                </section>
                <footer className='w-100' style={{ position: "absolute", bottom: "0px" }}>
                    <p className='w-100 text-center'>© MINISITIO - {version.version}</p>
                </footer>
            </div>

        </div>
    );
}

export default Campanha;
