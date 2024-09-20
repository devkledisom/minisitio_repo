// components/OutroComponente.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../assets/css/users.css';
import 'font-awesome/css/font-awesome.min.css';
import { masterPath, version } from '../../../config/config';

//LIBS
import Swal from 'sweetalert2';


//componente
import Header from "../Header";
import Spinner from '../../../components/Spinner';

const Espacos = () => {

    const style = {
        position: "fixed",
        zIndex: "999"
    }

    const [ids, setIds] = useState([]);
    const [anuncios, setAnucios] = useState([]);
    const [page, setPage] = useState(1);
    const [selectId, setSelectId] = useState(null);
    const [showSpinner, setShowSpinner] = useState(false);
    const [del, setDel] = useState(false);


    const location = useLocation();


    const getParam = new URLSearchParams(location.search);

    const param = getParam.get('page') ? getParam.get('page') : 1;

    function exportExcell() {
        fetch(`${masterPath.url}/admin/anuncio/export?limit=5000`)
            .then(x => x.json())
            .then(res => {
                if (res.success) {
                    console.log(res);
                    window.location.href = res.downloadUrl;
                }
            })
    };

    return (
        <div className="users">
            <header style={style} className='w-100'>
                <Header />
            </header>
            <section className="pt-5">

                {showSpinner && <Spinner />}

                <h1 className="pt-4 px-4">Importar Anúncio</h1>

                <form action={`${masterPath.url}/admin/anuncio/import`} method="post" enctype="multipart/form-data" style={{"marginTop": "20px", "marginLeft": "50px"}}>
                    Importar Espaços <br />

                    <input type="hidden" name="MAX_FILE_SIZE" value="2097152" id="MAX_FILE_SIZE" />
                    <input type="file" name="uploadedfile" id="uploadedfile" /><br /><br />
                        <button type="submit" className="btn custom-button" style={{"marginRight": "10px"}}>Enviar</button>
                        <a href="https://br.minisitio.net/resources/files/modelo_importacao_anuncios.xlsx">Download modelo</a>
                </form>


                <p className='w-100 text-center'>© MINISITIO - {version.version}</p>
            </section>
            {/*  <footer className='w-100' style={{ position: "absolute", bottom: "0px" }}>
                <p className='w-100 text-center'>© MINISITIO</p>
            </footer> */}
        </div>
    );
}

export default Espacos;

