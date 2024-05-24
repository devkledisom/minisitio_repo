import React from "react";


const Spinner = () => {
    return (
        <div className="spinner-main">
            <button className="" style={style} >{/* ref={loadingButton} */}
                <i className="fa fa-spinner fa-spin"></i>Carregando
            </button>
        </div>

    );
};

const style = {
    display: "block",
        color: "#000",
        fontSize: "23px",
        position: "absolute",
        top: "50%",
        zIndex: "999",
        width: "40%",
        left: "33%"
}


export default Spinner;