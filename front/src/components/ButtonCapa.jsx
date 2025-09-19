import { useEffect, useState, useRef, useContext } from 'react';
import { masterPath } from '../config/config';


import { QrCode } from "lucide-react";
import { Modal, Button } from 'react-bootstrap';
import QrcodeMosaico from '../plugins/QrcodeMosaico';


const ButtonCapa = (props) => {
    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false);
        //props.setShowState(false);
    };
    return (
        <div className="col-md-12 col-xs-12 text-center d-flex justify-content-center area-btns-classificado mt-4">
            {/* <button onClick={buscarTodosClassificado}>Ver caderno classificado</button> */}
            {props.buscarTodosClassificado &&
                <a href={`/cadernos/${props.caderno}_${props.estado}?caderno=${props.caderno}&estado=${props.estado}`} className="btn proximo btn-class" onClick={props.buscarTodosClassificado}>
                    <i className="fa fa-file-text mx-0"></i> Ver caderno classificado</a>
            }


            <button className='btn btn-success mx-2 btn-qrcode' onClick={() => setShow(true)}><QrCode /><span className='mx-2'>Gerar qrcode</span></button>

            <Modal show={show} onHide={handleClose} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Capa do Caderno {props.caderno} - {props.estado}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    <div className="area-qrcode-caderno">
                        <QrcodeMosaico nmAnuncio={`${masterPath.domain}/caderno-geral/${props.caderno}/${props.estado}`} />
                        <img src="/assets/img/logo.png" alt="" />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal>


        </div>
    );
};

export default ButtonCapa;
