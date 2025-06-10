import React, { useState, useEffect } from 'react';
import { masterPath } from '../../config/config';

//styles
import '../assets/css/btnActivate.css';

const BtnActivate = (props) => {
    //#States
    const [status, setStatus] = useState();

    const tokenAuth = sessionStorage.getItem('userTokenAccess');

    useEffect(() => {
        //console.log(props.data)
        if (props.data == 1) {
            setStatus('Ativado');
        } else {
            setStatus('Desativado');
        }

    }, []);

    function alterStatus() {

        let data = {
            ativo: status
        }

        const config = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "authorization": 'Bearer ' + tokenAuth
            },
            body: JSON.stringify(data)
        };

        setStatus('Aguarde');

        fetch(`${masterPath.url}/admin/${props.modulo}/status/${props.idd}`, config)
            .then((x) => x.json())
            .then((res) => {
                //setShowSpinner(false);
                if (res.success) {
                    if (status == "Ativado") {
                        setStatus('Desativado');
                    } else {
                        setStatus('Ativado');
                    }

                } else {
                    alert(res.message);
                    console.log(res.message)
                }
            })

    };

    return (
        <div className='BtnActive'>
            {status === "Ativado" && <button className="ativo" onClick={alterStatus}>{status}</button>}
            {status === "Desativado" && <button className="desativo" onClick={alterStatus}>{status}</button>}
            {status === "Aguarde" && <button className="desativo" style={{ backgroundColor: "gold", color: "#000" }}>{status}</button>}
        </div>
    )

};

export default BtnActivate;