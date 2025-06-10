import React from 'react';

//LIBS
import Swal from 'sweetalert2';

const MsgConfirm = (props) => {
    Swal.fire({
        title: props.title,
        html: `<p style="font-size: 20px">${props.msg}</p>`,
        width: "500px",
        showCancelButton: true,
        icon: "info",
        confirmButtonColor: "#DD6B55",
        confirmButtonText: props.btnTitle,
        cancelButtonText: "Cancelar"
      }).then((result) => {
        if (result.isConfirmed) {
            props.funAction();
        } else {
          props.setShowMsgBox(false);
        }
        
        if (result.isDenied) {
          Swal.fire("Changes are not saved", "", "info");
        }
      });
};

export default MsgConfirm;