// components/OutroComponente.js
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../assets/css/users.css';
import '../../assets/css/configuracoesPortal.css';
import 'font-awesome/css/font-awesome.min.css';
import { masterPath, version } from '../../../config/config';
import { Link } from 'react-router-dom';


//componente
import Header from "../Header";
import Pagination from '../../components/Pagination';
import Spinner from '../../../components/Spinner';
import Card from 'react-bootstrap/Card';

const ConfiguracoesPortal = () => {

    const [paginasTotal, setPaginas] = useState();
    const [selectId, setSelectId] = useState();
    const [calhaus, setCalhaus] = useState([]);
    const [showSpinner, setShowSpinner] = useState(true);

    const location = useLocation();
    const navigator = useNavigate();


    const getParam = new URLSearchParams(location.search);

    const param = getParam.get('page') ? getParam.get('page') : 1;


    useEffect(() => {
        fetch(`${masterPath.url}/admin/calhau/read?page=${param}`)
            .then((x) => x.json())
            .then((res) => {
                setCalhaus(res.message.frases)
                setPaginas(res.message.totalPaginas)
                setShowSpinner(false);
            })


    }, [param]);

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

    return (
        <div className="config-portal">
            {/* <header style={style} className='w-100'>
                <Header />
            </header> */}
            <section>
                {showSpinner && <Spinner />}

                <h2 className="px-4" style={{ marginTop: "20px" }}>CONFIGURAÇÃO DO PORTAL</h2>
                <hr />

                <article className="pt-5">
                    <div className="container-fluid">
                        <div className='row px-4 area-cards'>
                            <Card style={{ width: '18rem', fontSize: '12px' }}>
                                <Link to="/admin/institucional">
                                    <Card.Body>
                                        <Card.Title>
                                            Institucional
                                        </Card.Title>
                                        <Card.Text>
                                            Alterações da página Institucional do portal
                                        </Card.Text>
                                    </Card.Body>
                                </Link>
                            </Card>

                            <Card style={{ width: '18rem', fontSize: '12px' }} >
                                <Link to="/admin/contato">
                                    <Card.Body>
                                        <Card.Title>
                                            Contato
                                        </Card.Title>
                                        <Card.Text>
                                            Alterações da página Contato
                                        </Card.Text>
                                    </Card.Body>
                                </Link>
                            </Card>

                            <Card style={{ width: '18rem', fontSize: '12px' }} >
                                <Link to="/admin/calhau">
                                    <Card.Body>
                                        <Card.Title>
                                            Calhau
                                        </Card.Title>
                                        <Card.Text>
                                            Configurações do Calhau
                                        </Card.Text>
                                    </Card.Body>
                                </Link>
                            </Card>
                        </div>
                    </div>
                    {/*  <Pagination totalPages={paginasTotal} table={"pin"} /> */}


                </article>
                {/*   <p className='w-100 text-center'>© MINISITIO - {version.version}</p> */}
            </section>
            <footer className='w-100' style={{ position: "absolute", bottom: "0px" }}>
                <p className='w-100 text-center'>© MINISITIO - {version.version}</p>
            </footer>
        </div>
    );
}

export default ConfiguracoesPortal;
