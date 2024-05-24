import React from 'react';

import '../assets/css/main.css';
import '../assets/css/default.css';
import '../assets/css/contactform.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
/* import 'font-awesome/css/font-awesome.min.css'; */

import Tooltip from './Tooltip';

import { BsShareFill, BsFillSendFill, BsFacebook, BsInstagram, BsTwitter, BsYoutube, BsWhatsapp, BsSkype, BsHeadset } from "react-icons/bs";


function ContactForm() {
    return (
        <div className="ContactForm bg-cinza">
            <form action="/action_page.php">
                <div className="d-flex p-3">
                    <img id="contact-logo" src="../assets/img/teste/falecomodono.png" alt="" />
                    <span className='w-100 p-2'>

                        <div className="contact-radios">
                            <h6 className='text-start px-4'><strong>Assunto</strong></h6>
                            <input type="radio" id="visita" name="opcao" value="visita" />
                            <label htmlFor="visita">Visita</label>

                            <input type="radio" id="orcamento" name="opcao" value="orcamento" />
                            <label htmlFor="orcamento">Orçamento</label>

                            <input type="radio" id="reserva" name="opcao" value="reserva" />
                            <label htmlFor="reserva">Reserva</label>

                            <input type="radio" id="contato" name="opcao" value="contato" />
                            <label htmlFor="contato">Contato</label>
                        </div>

                    </span>
                </div>
                <div className="col-md-12 px-3">
                    <div className="input-icon mt-3">
                        <i className="fa fa-user"></i>
                        <input type="text" name="nome" id="nome" className="form-control" placeholder="Digite seu nome" />
                    </div>
                </div>

                <div className="col-md-12 px-3">
                    <div className="input-icon mt-3">
                        <i className="fa fa-envelope"></i>

                        <input type="text" name="email" id="email" className="form-control" placeholder="Digite seu email" />
                    </div>
                </div>

                <div className="col-md-12 px-3">
                    <div className="input-icon mt-3">
                        <i className="fa fa-envelope"></i>

                        <input type="text" name="email_copia" id="email_copia" className="form-control" placeholder="Digite seu email de cópia" />
                    </div>
                </div>

                <div className="col-md-12 px-3">
                    <div className="input-icon mt-3">
                        <i className="fa fa-phone"></i>

                        <input type="text" name="telefone" id="telefone" className="form-control" placeholder="Digite seu telefone" />
                    </div>
                </div>

                <div className="col-md-12 px-3">
                    <div className="input-icon mt-3">
                        <i className="fa fa-envelope"></i>

                        <textarea name="mensagem" id="mensagem" className="form-control" placeholder="Mensagem" style={{ height: "130px" }} rows="7" cols="80"></textarea>
                    </div>
                </div>

                <div className="col-md-12 px-3">
                    <div className="input-icon mt-3">
                        <i className="fa fa-paperclip"></i>

                        <input type="hidden" name="MAX_FILE_SIZE" value="2097152" id="MAX_FILE_SIZE" />
                        <input type="file" name="anexo" id="anexo" className="form-control" />
                    </div>
                </div>

                <div className="col-md-12 px-3 py-3 text-end">
                    <button type="submit" className="btn cinza btn-sendmessage"><i className="fa fa-arrow-right"></i> enviar</button>
                </div>

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
