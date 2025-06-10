import React, { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { masterPath } from '../config/config';

import '../assets/css/main.css';
import '../assets/css/default.css';
import '../assets/css/contactform.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
/* import 'font-awesome/css/font-awesome.min.css'; */

import Tooltip from './Tooltip';

import { BsShareFill, BsFillSendFill, BsFacebook, BsInstagram, BsTwitter, BsYoutube, BsWhatsapp, BsSkype, BsHeadset } from "react-icons/bs";

//COMPONENTS
import AlertMsg from "./Alerts/AlertMsg";


function ContactForm() {
    const [alert, setAlert] = useState(false);
    const [loading, setLoading] = useState(false);
    const location = useLocation();

    const pegarParam = new URLSearchParams(location.search);

    const id = pegarParam.get('id');
    const { idPerfil } = useParams();


    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    /*     const onSubmit = (data) => {
            console.log(data);
            const formData = new FormData();
            formData.append("anexo", data.image[0]);
    
            fetch(`${masterPath.url}/fale-com-dono`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(x => x.json())
                .then(res => {
                    console.log(res)
                })
        }
     */

    const onSubmit = (data) => {
        setLoading(true);
        const formData = new FormData();

        //formData.append("anexo", data.anexo[0]); // Adiciona o arquivo ao FormData

        // Adiciona outros campos do formulário ao FormData
        formData.append("option", data.option);
        formData.append("nome", data.nome);
        formData.append("email", data.email);
        formData.append("email_copia", data.email_copia);
        formData.append("telefone", data.telefone);
        formData.append("mensagem", data.mensagem);
        formData.append("id", data.id);

        fetch(`${masterPath.url}/fale-com-dono`, {
            method: 'POST',
            body: formData // Envia o FormData diretamente
        })
            .then(response => response.json())
            .then(res => {
                if (res.success) {
                    setLoading(false);
                    setAlert(true);
                    window.scrollTo(0, 0);
                    reset();
                    //setTimeout(() => { setAlert(false) }, 3000)
                }

            })
            .catch(error => {
                setLoading(false);
                console.error("Erro:", error)
            });
    }



    return (
        <div className="ContactForm bg-cinza">
            {loading &&
                <button className="buttonload" style={{ display: "block" }}>
                    <i class="fa fa-spinner fa-spin"></i>Carregando
                </button>
            }
            {alert && <AlertMsg message={"AGRADECEMOS PELO CONTATO! SUA  MENSAGEM FOI ENVIADA, AGUARDE CONTATO PELO DONO DO PERFIL"} setAlert={setAlert}/>}
            <form onSubmit={handleSubmit(onSubmit)} encType='multipart/form-data' >
                <div className="d-flex p-3">
                    <img id="contact-logo" src="../assets/img/teste/falecomodono.png" alt="" />
                    <span className='w-100 p-2'>

                        <div className="contact-radios my-1">
                            <h6 className='text-start px-4'><strong>Assunto</strong></h6>
                            <input type="radio" {...register('option', { required: true })} id="visita" value="visita"/>
                            <label htmlFor="visita">Visita</label>

                            <input type="radio" {...register('option')} id="orcamento" value="orcamento" />
                            <label htmlFor="orcamento">Orçamento</label>

                            <input type="radio" {...register('option')} id="reserva" value="reserva" />
                            <label htmlFor="reserva">Reserva</label>

                            <input type="radio" {...register('option')} id="contato" value="contato" />
                            <label htmlFor="contato">Contato</label>
                        </div>
                        {errors.option && <span className='bg-danger text-light p-1 rounded'>*campo obrigatório</span>}

                    </span>
                </div>
                <div className="col-md-12 px-3">
                    <div className="input-icon mt-3">
                        <i className="fa fa-user"></i>
                        <input type="text" {...register('nome')} id="nome" className="form-control" placeholder="Digite seu nome" />
                    </div>
                </div>

                <div className="col-md-12 px-3">
                    <div className="input-icon mt-3">
                        <i className="fa fa-envelope"></i>

                        <input type="text" {...register('email', { required: true })} id="email" className="form-control" placeholder="Digite seu email" />
                        {errors.email && <span className='text-danger'>*campo obrigatório</span>}
                    </div>
                </div>

                <div className="col-md-12 px-3">
                    <div className="input-icon mt-3">
                        <i className="fa fa-envelope"></i>

                        <input type="text" {...register('email_copia')} id="email_copia" className="form-control" placeholder="Digite seu email de cópia" />
                    </div>
                </div>

                <div className="col-md-12 px-3">
                    <div className="input-icon mt-3">
                        <i className="fa fa-phone"></i>

                        <input type="text" {...register('telefone')} id="telefone" className="form-control" placeholder="Digite seu telefone" />
                    </div>
                </div>

                <div className="col-md-12 px-3">
                    <div className="input-icon mt-3">
                        <i className="fa fa-envelope"></i>

                        <textarea {...register('mensagem')} id="mensagem" className="form-control" placeholder="Mensagem" style={{ height: "130px" }} rows="7" cols="80"></textarea>
                    </div>
                </div>

            {/*     <div className="col-md-12 px-3">
                    <div className="input-icon mt-3">
                        <i className="fa fa-paperclip"></i>

                        <input type="hidden" name="MAX_FILE_SIZE" value="2097152" id="MAX_FILE_SIZE" />
                        <input type="file" {...register("anexo")} accept="image/*" id="anexo" className="form-control" />
                    </div>
                </div> */}

                <div className="col-md-12 px-3 py-3 text-end">
                    <button type="submit" className="btn cinza btn-sendmessage"><i className="fa fa-arrow-right m-0"></i> enviar</button>
                </div>
                <input type="hidden" {...register('id')} value={idPerfil} />
                {/*  <div className="form-group d-flex">
                    <i class="fa fa-user"></i>
                    <input type="email" className="form-control" id="email" />
                </div>
                <div className="form-group">
                    <label htmlFor="pwd">Password:</label>
                    <input type="password" className="form-control" id="pwd" />
                </div> 
                <div className="checkbox">
                    <label><input type="checkbox" /> Remember me</label>
                </div>
                <button type="submit" className="btn btn-default">Submit</button>*/}
            </form>
        </div>
    );
}

export default ContactForm;
