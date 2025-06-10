import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { masterPath, version } from '../../../../config/config';
import Swal from 'sweetalert2';


import '../../../../assets/css/PainelAdminAnunciante.css';
import '../../../assets/css/configuracoesPortal/contato/contato.css';

//componente
import Header from "../../Header";
import Nav from '../../../../components/Nav';
import Footer from '../../../../components/Footer';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';


function Contato() {

    const [data, setData] = useState({});
    const [showSpinner, setShowSpinner] = useState(false);
    const [Spinner2, setSpinner2] = useState(false);

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

    function salvarAlteracao() {
        setSpinner2(true);

        fetch(`${masterPath.url}/admin/contato/config`, {
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
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: res.message,
                        customClass: {
                            popup: 'my-custom-popup'
                        }
                    });
                }

            })
    };


    const handleSelectChange = (e) => {
        setData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    };

    const editarLabel = (label) => {
        const input = document.getElementById(label);
        input.focus();

    }

    const style = {
        position: "fixed",
        zIndex: "999"
    }

    return (
        <div className="painel-admin admin-contato">

            {showSpinner && <button class="buttonload">
                <i class="fa fa-spinner fa-spin"></i>Carregando
            </button>}
            <header style={style} className='w-100'>
                <Header />
            </header>
            <main className="pt-5">
                <h1 id="title-caderno" className='py-3 text-center position-relative'>
                    {/*           <Button as="button" variant="link" type="button" size='lg' className='position-absolute start-0' onClick={() => salvarAlteracao()}>
                            Voltar
                        </Button> */}
                    Página de Contato</h1>
                <div class="container my-3">
                    <div className='my-3'>
                        <Button as="button" variant="none" type="button" size='lg' className='border' onClick={() => navigate('/admin/configuracoes')}>
                            <img src="/assets/img/icons/seta-esquerda.png" alt="voltar" width={20} />
                            <span className='px-2'>Voltar</span>
                        </Button>
                    </div>
                    <div className="col-md-6 col-sm-6 row w-100">
                        <div className="contato-bg" style={{ "overflow": "hidden", position: "relative" }}>
                            <h2><i className="fa fa-star-o"></i> Fale conosco</h2>
                            <div className="col-md-12 contato">
                                <i className="fa fa-phone"></i>
                                <h4 className="contato-font"> <br />
                                    <input type='text' id="edit-contato" name="telefone" value={data.telefone} onChange={handleSelectChange} />
                                </h4>
                                <i className="fa fa-edit mx-2" style={{ fontSize: '30px', cursor: 'pointer', position: 'absolute', right: '0' }} onClick={(e) => editarLabel('edit-contato')}></i>
                            </div>
                            <div className="col-md-12 contato">
                                <i className="fa fa-envelope"></i> <h4 className="contato-font"> <br />
                                    <input type='text' id="edit-email" name="email" value={data.email} onChange={handleSelectChange} />
                                </h4>
                                <i className="fa fa-edit mx-2" style={{ fontSize: '30px', cursor: 'pointer', position: 'absolute', right: '0' }} onClick={(e) => editarLabel('edit-email')}></i>
                            </div>
                            <div className="col-md-12 contato">
                                <i className="fa fa-map-marker"></i> <h4 className="contato-font"> <br />
                                    <input type='text' id="edit-address" name="endereco" value={data.endereco} onChange={handleSelectChange} />
                                </h4>
                                <i className="fa fa-edit mx-2" style={{ fontSize: '30px', cursor: 'pointer', position: 'absolute', right: '0' }} onClick={(e) => editarLabel('edit-address')}></i>
                            </div>
                            <div className="col-md-12 contato">
                                <i className="fa fa-facebook"></i> <h4 className="contato-font"> <br />
                                    <input type='text' id="edit-facebook" name="facebook" value={data.facebook} onChange={handleSelectChange} />
                                </h4>
                                <i className="fa fa-edit mx-2" style={{ fontSize: '30px', cursor: 'pointer', position: 'absolute', right: '0' }} onClick={(e) => editarLabel('edit-facebook')}></i>
                            </div>
                            <div className="col-md-12 contato">
                                <i className="fa fa-instagram"></i> <h4 className="contato-font"> <br />
                                    <input type='text' id="edit-instagram" name="instagram" value={data.instagram} onChange={handleSelectChange} />
                                </h4>
                                <i className="fa fa-edit mx-2" style={{ fontSize: '30px', cursor: 'pointer', position: 'absolute', right: '0' }} onClick={(e) => editarLabel('edit-instagram')}></i>

                            </div>
                        </div>
                        <div className="vantagens margin-bottom-20">&nbsp;</div>
                    </div>
                    <div className='text-center py-3'>
                        <Button as="button" type="button" value="Salvar alterações" size='lg' className='my-2' onClick={() => salvarAlteracao()}>
                            {Spinner2 && <Spinner animation="border" role="status" size='sm' />}
                            <span className='px-2'>Salvar alterações</span>
                        </Button>
                    </div>
                </div>
            </main>

            <footer style={{ "backgroundColor": "#FFCC29" }} className='py-3'>
                <p className='w-100 text-center'>© MINISITIO - {version.version}</p>
            </footer>
        </div >
    );
}

export default Contato;
