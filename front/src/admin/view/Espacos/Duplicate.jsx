import React, { useState } from 'react';
import ReactDOMServer from 'react-dom/server';

//LIBS
import Swal from 'sweetalert2';


//COMPONENTS
import Modal from './Modal';
import DuplicateForm from './DuplicateForm';

const Duplicate = (props) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [option, setOption] = useState(null);
  
    const openModal = () => {
      let lineSelect = props.selectId;

      if(lineSelect !== null) {
        setModalOpen(true);
      } else {
        Swal.fire({
          title: 'error!',
          text: "Por favor selecione um anúncio",
          icon: 'error',
          confirmButtonText: 'Entendi'
        })
      }
     
    };
  
    const closeModal = () => {
      setModalOpen(false);
    };
  

    return (
        <>
          <button className={props.className} onClick={openModal}>Duplicar</button>
         {/*  {console.log(option)} */}
          <Modal isOpen={isModalOpen} onClose={closeModal}>
            <DuplicateForm option={option} setOption={setOption} onClose={closeModal} selectId={props.selectId} setAnuncios={props.setAnuncios} />
          </Modal>
        </>
      );

   
};


export default Duplicate;