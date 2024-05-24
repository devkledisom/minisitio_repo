import React from "react";

const AlertMsg = () => {
    return (
        <div className="msg">
            <div class="alert alert-success alert-dismissible fade show alertShow">
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                <strong>Success!</strong> This alert box could indicate a successful or positive action.
            </div>
        </div>
    )
};

export default AlertMsg;