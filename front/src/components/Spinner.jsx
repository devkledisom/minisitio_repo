import React from "react";


const Spinner = (props) => {
    return (
        <div className="spinner-main">

            {props.progress == 0 &&
                <button className="" style={style} >{/* ref={loadingButton} */}
                    <i className="fa fa-spinner fa-spin"></i>Carregando
                </button>
            }

            {props.progress > 0 &&
                <button className="" style={style} >{/* ref={loadingButton} */}
                    <i className="fa fa-spinner fa-spin"></i>Carregando <span>{props.progress}%</span>
                </button>
            }

            {props.progress == undefined &&
                <button className="" style={style} >{/* ref={loadingButton} */}
                    <i className="fa fa-spinner fa-spin"></i>Carregando
                </button>
            }


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