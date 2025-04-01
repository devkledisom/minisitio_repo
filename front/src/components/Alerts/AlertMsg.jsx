import React from "react";

const AlertMsg = ({message, setAlert}) => {
    return (
        <div className="msg">
            <div class="alert alert-success alert-dismissible fade show alertShow" style={{ "width": "676px" }}>
                <button type="button" class="btn-close" onClick={() => {setAlert(false)}}></button>
                <strong>Sucesso!</strong> {message}
            </div>
        </div>
    )
};

export default AlertMsg;

//<button type="button" class="btn-close" data-bs-dismiss="alert"></button>