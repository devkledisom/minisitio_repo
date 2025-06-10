import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { masterPath } from '../../../../config/config';
import Swal from 'sweetalert2';


import '../../../../assets/css/PainelAdminAnunciante.css';
import '../../../../assets/css/infoPages/institucional.css';
import '../../../assets/css/configuracoesPortal/institucional/institucional.css';

//componente
import Header from "../../Header";
import Nav from '../../../../components/Nav';
import Footer from '../../../../components/Footer';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';


function Institucional() {

    const [data, setData] = useState({});
    const [showSpinner, setShowSpinner] = useState(false);
    const [Spinner2, setSpinner2] = useState(false);

    useEffect(() => {
        buscarAlteracao();
    }, []);

    const navigate = useNavigate();


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

    function salvarAlteracao() {
        setSpinner2(true);

        fetch(`${masterPath.url}/admin/institucional/config`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then((x) => x.json())
            .then((res) => {
                if (res.success) {
                    setSpinner2(false);

                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: "Alterações salvas com sucesso!",
                        showConfirmButton: false,
                        timer: 1500
                    });
                } else {
                    setSpinner2(false);
                }

            })
    };

    const assetDefault = {
        empresa: `A MYCARDCITY foi criada por profissionais experientes das áreas de
                                    Telecomunicações e Publicidade, com o intuito de proporcionar às pequenas e
                                    médias empresas a oportunidade de divulgarem seus produtos, marcas e serviços de
                                    forma eficiente e com baixo custo, contando, para isso, com a estrutura de um MINISITIO
                                    padronizado, especialmente desenvolvido para este fim. Agregamos ainda um
                                    Aplicativo e um programa patenteado com o nome de SEMENTE DIGITAL.`,
        objetivo: "Ser referência no segmento de Publicidade on-line, através de um modelo de divulgação inovador, democrático, com responsabilidade, prático e eficaz para todos.",
        visao: "Ser referência no segmento de <b>publicidade online</b>, através de um modelo de divulgação justo, transparente ao assinante e eficaz ao usuário.",
        missao: "Promover nossos clientes com uma publicidade e comunicação democrática, econômica, padronizada e prática para todas as cidades brasileiras.",
        img1: "../assets/img/parceiros/5it.png"
    }

    const handleSelectChange = (e) => {
        setData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    };

    return (
        <div className="painel-admin institucional admin-inst">

            {showSpinner && <button class="buttonload">
                <i class="fa fa-spinner fa-spin"></i>Carregando
            </button>}

            <header>
                <Header />
            </header>
            <main>
                <h1 id="title-caderno" className='py-2 text-center position-relative'>
                    {/*           <Button as="button" variant="link" type="button" size='lg' className='position-absolute start-0' onClick={() => salvarAlteracao()}>
                            Voltar
                        </Button> */}
                    Institucional</h1>
                <div class="container my-3">
                    <div className='my-3'>
                        <Button as="button" variant="none" type="button" size='lg' className='border' onClick={() => navigate('/admin/configuracoes')}>
                            <img src="/assets/img/icons/seta-esquerda.png" alt="voltar" width={20}/>
                            <span className='px-2'>Voltar</span>
                        </Button>
                    </div>
                    <div class="row">
                        <div class="col-md-6">
                            <div class="bg-cinza margin-bottom-20 rounded">
                                <h2 class="px-2"><i class="fa fa-clock-o"></i> A Empresa</h2>
                                <textarea name="inst_empresa" value={data.inst_empresa} onChange={handleSelectChange}></textarea>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="bg-cinza margin-bottom-20 rounded">
                                <h2 class="px-2"><i class="fa fa-clock-o"></i> Objetivo</h2>
                                <textarea name="inst_objetivo" value={data.inst_objetivo} onChange={handleSelectChange}></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="row py-4">
                        <div class="col-md-6">
                            <div class="bg-cinza margin-bottom-20 rounded">
                                <h2 class="px-2"><i class="fa fa-wifi"></i> Nossa visão</h2>
                                <textarea name="inst_visao" value={data.inst_visao} onChange={handleSelectChange}></textarea>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="bg-cinza rounded">
                                <h2 class="px-2"><i class="fa fa-globe"></i> Nossa missão</h2>
                                <textarea name="inst_missao" value={data.inst_missao} onChange={handleSelectChange}></textarea>
                            </div>
                        </div>
                    </div>
                    {/*       <div class="row">
                        <div class="col-md-12 margin-bottom-20">
                            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3839.160478293487!2d-47.89486528457415!3d-15.79548998905047!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x935a3aef5b363915%3A0x664043907f15a04d!2sVen%C3%A2ncio+Shopping!5e0!3m2!1spt-BR!2sbr!4v1490820737178" width="100%" height="350" frameborder="0" style={{ "border": "0" }} allowfullscreen=""></iframe>
                        </div>
                    </div> */}
                    <div className='text-center py-3'>
                        <Button as="button" type="button" value="Salvar alterações" size='lg' className='my-2' onClick={() => salvarAlteracao()}>
                            {Spinner2 && <Spinner animation="border" role="status" size='sm' />}
                            <span className='px-2'>Salvar alterações</span>
                        </Button>
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
