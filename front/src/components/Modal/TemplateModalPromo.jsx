import React, { useState } from 'react';
import moment from 'moment';


//Components
import ContentChildLogin from './ContentChildLogin';
import ContentChildForm from './ContentChildForm';
import { masterPath } from '../../config/config';

const TemplateModalPromo = (props) => {

  const [elemento, setValue] = useState(true);

  const mostrarElemento = (param) => {
    setValue(param)
  }

    return (
        <div className='template-modal'>
{/*             <div className="container mt-3">
  <h3>Extra Large Modal Example</h3>
  <p>Click on the button to open the modal.</p>
  
  <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#myModal">
    Open modal
  </button>
</div>
 */}
{/* <!-- The Modal --> */}
<div className="modal fade" id="myModal">
  <div className="modal-dialog modal-xl">
    <div className="modal-content">


     {/*  <!-- Modal body --> */}
      <div className="modal-body">
        <img src={`${masterPath.url}/files/2/${props.path}`} className='w-100' alt="promoção" />       
      </div>
      <span>Validade da promoção: {moment(props.validade).format("DD/MM/YYYY")}</span>

      {/* <!-- Modal footer --> */}
      <div className="modal-footer">
        <button type="button" className="btn btn-danger" data-bs-dismiss="modal">fechar</button>
      </div>

    </div>
  </div>
</div>
        </div>
    )
};

export default TemplateModalPromo;