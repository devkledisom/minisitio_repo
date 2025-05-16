import React, { useState, useRef, useEffect } from 'react';
import moment from 'moment';
import ReactToPrint, { useReactToPrint } from 'react-to-print';
import { Modal, Button } from 'react-bootstrap';

//CSS
import '../../assets/css/templateModalPromo.css';

//Components
import ContentChildLogin from './ContentChildLogin';
import ContentChildForm from './ContentChildForm';
import { masterPath } from '../../config/config';

const TemplateModalPromo = (props) => {

  const [elemento, setValue] = useState(true);
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(props.showState)
  }, [props.showState])

  const contentPromo = useRef(null);
  const ReactToPrintFn = useReactToPrint({
    contentRef: contentPromo,
    documentTitle: 'meu-relatorio'
  })

  const mostrarElemento = (param) => {
    setValue(param)
  }

  const handleClose = () => {
    setShow(false);
    props.setShowState(false);
  };

  return (
    <div className='template-modal-promo'>
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Promoção Ativa</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
         
          <div className="modal-body" ref={contentPromo}>
          <div className='title-promo-ms'>
            <img src="../assets/img/logo50.png" className="logo-modal-promo" />
            <h4>Promoção com minisitio</h4>
          </div>
            <img src={`${masterPath.url}/files/2/${props.path}`} className='w-100' alt="promoção" />
          </div>
          <span>Validade da promoção: {moment(props.validade).format("DD/MM/YYYY")}</span>
        </Modal.Body>
        <Modal.Footer>
          <button type="button" className="btn btn-primary" onClick={() => ReactToPrintFn()}>Imprimir</button>
          <a href={`${masterPath.url}/files/2/download/${props.path}`}
            download={`promocao_${props.anuncioId || 'img'}.jpg`}
            className='btn btn-secondary'
          >
            Baixar
          </a>
          <Button variant="danger" onClick={handleClose}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* <!-- The Modal --> */}
      {/* <div className="modal fade" id="myModal">
  <div className="modal-dialog modal-xl">
    <div className="modal-content">

   
      <div className="modal-body" ref={contentPromo}>
        <img src={`${masterPath.url}/files/2/${props.path}`} className='w-100' alt="promoção" />       
      </div>
      <span>Validade da promoção: {moment(props.validade).format("DD/MM/YYYY")}</span>

      
      <div className="modal-footer">
        <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={() => ReactToPrintFn()}>Imprimir</button>
          <a href={`${masterPath.url}/files/2/download/${props.path}`}
              download={`promocao_${props.anuncioId || 'img'}.jpg`}
              className='btn btn-secondary'
          >
          Baixar
          </a>
        <button type="button" className="btn btn-danger" data-bs-dismiss="modal" aria-label="Close">fechar</button>
      </div>

    </div>
  </div>
</div> */}
    </div>
  )
};

export default TemplateModalPromo;