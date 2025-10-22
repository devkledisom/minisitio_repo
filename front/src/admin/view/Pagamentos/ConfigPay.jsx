// components/OutroComponente.js
import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
//import '../assets/css/users.css';
import 'font-awesome/css/font-awesome.min.css';
import { masterPath } from '../../../config/config';


//componente
import Header from "../Header";
import Pagination from '../../components/Pagination';
import Spinner from '../../../components/Spinner';
import FormConfig from './_components/formConfig';

const ConfigPay = () => {

    const [paginas, setPaginas] = useState({});
    const [selectId, setSelectId] = useState();
    const [pagamentos, setPagamentos] = useState([]);
    const [showSpinner, setShowSpinner] = useState(true);

    const location = useLocation();
    const navigator = useNavigate();

    //REFS
    const statusColor = useRef(null);


    const getParam = new URLSearchParams(location.search);

    const param = getParam.get('page') ? getParam.get('page') : 1;


    useEffect(() => {
        fetch(`${masterPath.url}/admin/pagamentos/read?page=${param}`)
            .then((x) => x.json())
            .then((res) => {
                //setCidade(res.message.anuncios);
                setPagamentos(res.data)
                setPaginas(res)
                setShowSpinner(false);

            })


    }, [param]);








    const style = {
        position: "fixed",
        zIndex: "999"
    }

    const selecionarCor = (status) => {
        switch (status) {
            case "Cancelado":
                return "red";
            case "Aprovado":
                return "lime";
            case "Pendente":
                return "gold";
        }
    }


    return (
        <div className="Atividades">
            {/*    <header style={style} className='w-100'>
                <Header />
            </header> */}
            <section>
                {showSpinner && <Spinner />}

                <h1 className="px-4">Configuração de pagamento</h1>
                <div className="container-fluid py-4 px-4">
                    <div className="row margin-bottom-10">
                        <div className="span6 col-md-6">
                          {/*   <button type="button" className="btn custom-button" onClick={() => navigator('/pagamento/config')}>Adicionar</button> */}
                            {/*         <button type="button" className="btn btn-info custom-button mx-2 text-light" onClick={() => navigator(`/atividades/editar?id=${selectId}`)}>Editar</button>
                            <button type="button" className="btn btn-danger custom-button text-light" onClick={apagarUser}>Apagar</button> */}
                        </div>
                        {/*     <div className="span6 col-md-6">
                            <div className="pull-right d-flex justify-content-center align-items-center">
                                <input id="buscar" type="text" placeholder="Buscar" />
                                <button id="btnBuscar" className="" type="button" onClick={buscarUserId}>
                                    <i className="icon-search"></i>
                                </button>
                            </div>
                        </div>*/}
                    </div>
                </div>
                <article>
                    <div className="container-fluid">
                        <div className='row px-4'>
                            <FormConfig setShowSpinner={setShowSpinner} />
                        </div>
                    </div>
                </article>
                <p className='w-100 text-center pt-5'>© MINISITIO</p>
            </section>
            {/*     <footer className='w-100' style={{ position: "absolute", bottom: "0px" }}>
                <p className='w-100 text-center'>© MINISITIO</p>
            </footer> */}
        </div>
    );
}

export default ConfigPay;
