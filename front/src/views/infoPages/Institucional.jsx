import { useEffect, useState, useRef } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { masterPath } from '../../config/config';


import '../../assets/css/PainelAdminAnunciante.css';
import '../../assets/css/infoPages/institucional.css';

import Mosaico from '../../components/Mosaico';
import Busca from '../../components/Busca';
import MiniWebCard from '../../components/MiniWebCard';
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';
import MsgProgramada from '../../components/MsgProgramada';
import MiniWebCardSimples from '../../components/MiniWebCardSimples';

//CONTEXT
import { useBusca } from '../../context/BuscaContext';

//COMPONENTS
import Listar from '../painelAnuciante/Listar';
import Editar from '../painelAnuciante/Editar';
import UserNav from '../painelAnuciante/UserNav';
import DadosPessoais from '../painelAnuciante/DadosPessoais';


function Institucional() {

    //contexto
    //const { tema, setTema } = useTema();
    const { result, setResult } = useBusca();

    const [mosaicoImg, setMosaicoImg] = useState([]);
    const [showSpinner, setShowSpinner] = useState(false);
    const [data, setData] = useState({});


    const location = useLocation();

    const pegarParam = new URLSearchParams(location.search);

    const book = pegarParam.get('book');
    const id = pegarParam.get('id');
    const { cpf } = useParams();

    const navigate = useNavigate();



    useEffect(() => {
        buscarAlteracao();
    }, []);

    function buscarAlteracao() {
        setShowSpinner(true);

        fetch(`${masterPath.url}/admin/institucional/read`)
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



    return (
        <div className="painel-admin institucional">

            {showSpinner && <button class="buttonload">
                <i class="fa fa-spinner fa-spin"></i>Carregando
            </button>}

            <header>
                <Mosaico logoTop={true} borda="flex" mosaicoImg={mosaicoImg} />
            </header>
            <main>
                <Busca paginaAtual={"caderno"} />
                <h1 id="title-caderno" className='py-2 text-center'>Institucional</h1>

                <div class="container my-5">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="bg-cinza margin-bottom-20">
                                <h2 class="px-2"><i class="fa fa-clock-o"></i> A Empresa</h2>
                                <p>{data.inst_empresa}</p>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="bg-cinza margin-bottom-20">
                                <h2 class="px-2"><i class="fa fa-clock-o"></i> Objetivo</h2>
                                <p>{data.inst_objetivo}</p>
                            </div>
                        </div>
                    </div>
                    <div class="row py-4">
                        <div class="col-md-6">
                            <div class="bg-cinza margin-bottom-20">
                                <h2 class="px-2"><i class="fa fa-wifi"></i> Nossa visão</h2>
                                <p>{data.inst_visao}</p>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="bg-cinza">
                                <h2 class="px-2"><i class="fa fa-globe"></i> Nossa missão</h2>
                                <p>{data.inst_missao}</p>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12 margin-bottom-20">
                            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3839.160478293487!2d-47.89486528457415!3d-15.79548998905047!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x935a3aef5b363915%3A0x664043907f15a04d!2sVen%C3%A2ncio+Shopping!5e0!3m2!1spt-BR!2sbr!4v1490820737178" width="100%" height="350" frameborder="0" style={{ "border": "0" }} allowfullscreen=""></iframe>
                        </div>
                    </div>
                    <div class="row area-parceiros">
                        <div class="col-md-12">
                            <div class="bg-cinza">
                                <h2><i class="fa fa-users"></i> Parceiros</h2>
                                <div class="row parceiros">
                                    <div class="col-md-3 col-sm-3">
                                        <a href={data.inst_link1} target="_blank" title="5it" class="thumbnail">
                                            <img src={`${masterPath.url}/files/institucional/${data.inst_img1}`} alt={data.inst_img1} />
                                        </a>
                                    </div>
                                    <div class="col-md-3 col-sm-3">
                                        <a href={data.inst_link2} target="_blank" title="3LT Marcas e Patentes" class="thumbnail">
                                            <img src={`${masterPath.url}/files/institucional/${data.inst_img2}`} alt={data.inst_img2} />
                                        </a>
                                    </div>
                                    <div class="col-md-3 col-sm-3">
                                        <a href={data.inst_link3} target="_blank" title="Cert Americas" class="thumbnail">
                                            <img src={`${masterPath.url}/files/institucional/${data.inst_img3}`} alt={data.inst_img3} />
                                        </a>
                                    </div>
                                    <div class="col-md-3 col-sm-3">
                                        <a href={data.inst_link4} target="_blank" title="OMG Agencia de Deseño" class="thumbnail">
                                            <img src={`${masterPath.url}/files/institucional/${data.inst_img4}`} alt={data.inst_img4} />
                                        </a>
                                    </div>
                                </div>
                            </div>
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

export default Institucional;
