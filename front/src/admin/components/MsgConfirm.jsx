import React from 'react';

//LIBS
import Swal from 'sweetalert2';

const MsgConfirm = (props) => {
    Swal.fire({
        title: props.msg,
        width: "300px",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: props.btnTitle,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            props.funAction();
          
        } else if (result.isDenied) {
          Swal.fire("Changes are not saved", "", "info");
        }
      });
};

export default MsgConfirm;