import { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { masterPath } from '../../config/config';


import '../../assets/css/PainelAdminAnunciante.css';
import '../../assets/css/infoPages/contato.css';

import Mosaico from '../../components/Mosaico';
import Busca from '../../components/Busca';
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';

//COMPONENTS
import AlertMsg from "../../components/Alerts/AlertMsg";



function Contato() {

    const [mosaicoImg, setMosaicoImg] = useState([]);
     const [data, setData] = useState({});
    const [showSpinner, setShowSpinner] = useState(false);
    const [alert, setAlert] = useState(false);

        useEffect(() => {
        buscarAlteracao();
    }, []);

    const navigate = useNavigate();


    function buscarAlteracao() {
        setShowSpinner(true);

        fetch(`${masterPath.url}/admin/contato/read`)
            .then((x) => x.json())
            .then((res) => {
                if (res.success) {
                    setShowSpinner(false);
                    setData(res.message);
                } else {
                    setShowSpinner(false);
                }
            })
    };

    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = (data) => {
        console.log(data);
    
        fetch(`${masterPath.url}/contato`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data) // Envia o FormData diretamente
        })
        .then(response => response.json())
        .then(res => {
            if(res.success) {
                setAlert(true);
                window.scrollTo(0, 0);
                setTimeout(() => {setAlert(false)}, 5000)
            }

        })
        .catch(error => console.error("Erro:", error));
    }


    return (
        <div className="painel-admin area-contato">

{alert && <AlertMsg message={"Email Enviado"}/>}

            {showSpinner && <button className="buttonload">
                <i className="fa fa-spinner fa-spin"></i>Carregando
            </button>}

            <header>
                <Mosaico logoTop={true} borda="flex" mosaicoImg={mosaicoImg} />
            </header>
            <main>
                <Busca paginaAtual={"caderno"} />
                <h1 id="title-caderno" className='py-2 text-center'>Contato</h1>

                <div className="container py-5">
                    <div className="row">
                        <div className="col-md-6 col-sm-6">
                            <div className="bg-cinza form-envelope">
                                <h2 className="py-3"><i className="fa fa-envelope"></i> Preencha o formulário</h2>

                                <form id="form-contato" onSubmit={handleSubmit(onSubmit)} encType='multipart/form-data'>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="input-icon margin-top-10">
                                                <i className="fa fa-credit-card"></i>

                                                <input type="text" {...register('nome')} id="nome" className="form-control" placeholder="Digite seu nome" />
                                            </div>
                                        </div>
                                        <div className="col-md-6 py-3">
                                            <div className="input-icon margin-top-10">
                                                <i className="fa fa-envelope"></i>

                                                <input type="text" {...register('email')} id="email" className="form-control" placeholder="Digite seu email" />
                                            </div>
                                        </div>
                                        <div className="col-md-6 py-3">
                                            <div className="input-icon margin-top-10">
                                                <i className="fa fa-phone"></i>

                                                <input type="text" {...register('telefone')} id="telefone" className="form-control" placeholder="Digite seu telefone" />
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <div className="input-icon margin-top-10">
                                                <i className="fa fa-envelope"></i>

                                                <textarea {...register('mensagem')} id="mensagem" rows="5" className="form-control msg" placeholder="Mensagem" cols="80"></textarea>
                                            </div>
                                        </div>
                                        <div className="col-md-12 continuar py-2">
                                            <button type="submit" className="btn cinza" id="btnSubmit"><i className="fa fa-arrow-right"></i> ENVIAR</button>
                                        </div>
                                    </div>
                                </form>

                            </div>
                        </div>
                        <div className="col-md-6 col-sm-6">
                            <div className="contato-bg" style={{ "overflow": "hidden" }}>
                                <h2><i className="fa fa-star-o"></i> Fale conosco</h2>
                                <div className="col-md-12 contato">
                                    <i className="fa fa-phone"></i> <h4 className="contato-font"> <br /> {data.telefone}</h4>
                                </div>
                                <div className="col-md-12 contato">
                                    <i className="fa fa-envelope"></i> <h4 className="contato-font"> <br /> {data.email}</h4>
                                </div>
                                <div className="col-md-12 contato">
                                    <i className="fa fa-map-marker"></i> <h4 className="contato-font"> <br /> {data.endereco}</h4>
                                </div>
                                <div className="col-md-12 contato">
                                    <i className="fa fa-facebook"></i> <h4 className="contato-font"> <br /> {data.facebook}</h4>
                                </div>
                                <div className="col-md-12 contato">
                                    <i className="fa fa-instagram"></i> <h4 className="contato-font"> <br /> {data.instagram}</h4>
                                </div>
                            </div>
                            <div className="vantagens margin-bottom-20">&nbsp;</div>
                        </div>
                    </div>
                </div>

            </main>

            <footer>
                <Nav styleclassName="Nav" />
                <Footer />
            </footer>
        </div >
    );
}

export default Contato;
