// components/OutroComponente.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../assets/css/users.css';
import 'font-awesome/css/font-awesome.min.css';
import { masterPath, version } from '../../../config/config';
import { io } from "socket.io-client";

//LIBS
import Swal from 'sweetalert2';


//componente
import Header from "../Header";
import Spinner from '../../../components/Spinner';

const Espacos = () => {

    const [progressValue, setProgressValue] = useState(null);




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
    const [start, setStart] = useState(null);
    const [end, setEnd] = useState(null);

    useEffect(() => {
        
                    const progressImport = setInterval(() => {
                        fetch(`${masterPath.url}/admin/anuncio/progress`)
                            .then(x => x.json())
                            .then(res => {
                                setProgressValue(res.message.progress);
                                setEnd(res.message.fim)
                                console.log(res)
                                if(res.message.endProccess) {
                                    //clearInterval(progressImport);
                                }
                            })
                    }, 1000)    

    }, []);



    const location = useLocation();

    const handleFormSubmit = async (event) => {
        event.preventDefault(); // Evita o recarregamento da página
        setShowSpinner(true);

        const formData = new FormData(event.target); // Captura os dados do formulário

        try {
            const response = await fetch(`${masterPath.url}/admin/anuncio/import`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Erro ao enviar o formulário");
            }

            const data = await response.json(); // Recebe a resposta da API
            setShowSpinner(false);


            const now = new Date();
            const hours = now.getHours(); // Horas (0-23)
            const minutes = now.getMinutes(); // Minutos (0-59)
            const seconds = now.getSeconds(); // Segundos (0-59)

            console.log(`Hora atual: ${hours}:${minutes}:${seconds}`);

            setStart(`${hours}:${minutes}:${seconds}`);

            const progressImport = setInterval(() => {
                fetch(`${masterPath.url}/admin/anuncio/progress`)
                    .then(x => x.json())
                    .then(res => {
                        setProgressValue(res.message.progress);
                        setEnd(res.message.fim)
                        console.log(res)
                        if (res.message.endProccess) {
                            clearInterval(progressImport);
                            Swal.fire("Sucesso!", "Processo de importação finalizado!", "success");
                        }
                    })
            }, 1000)

            //setProgressValue(data.progress || null);

            //Swal.fire("Sucesso!", "Arquivo enviado!", "success");
        } catch (error) {
            setShowSpinner(false);
            console.error(error);
            Swal.fire("Erro", "Ocorreu um erro ao importar os dados.", "error");
        }
    };

    return (
        <div className="users">
            <header style={style} className='w-100'>
                <Header />
            </header>
            <section className="pt-5">

                {showSpinner && <Spinner />}

                <h1 className="pt-4 px-4">Importar Perfil</h1>
                {/*  action={`${masterPath.url}/admin/anuncio/import`} method="post" enctype="multipart/form-data" */}
                <form onSubmit={handleFormSubmit} style={{ "marginTop": "20px", "marginLeft": "50px" }}>
                    Importar Espaços <br />

                    <input type="hidden" name="MAX_FILE_SIZE" value="2097152" id="MAX_FILE_SIZE" />
                    <input type="file" name="uploadedfile" id="uploadedfile" /><br /><br />
                    {progressValue &&
                        <div>
                            <h2>Registros enviados: {progressValue}</h2>
                            <h3>inicio: {start}</h3>
                            <h3>fim: {end}</h3>
                            {/* <h3>tempo: {end - start}</h3> */}
                        </div>

                    }

                    <button type="submit" className="btn custom-button" style={{ "marginRight": "10px" }}>Enviar</button>
                    <a href={`${masterPath.url}/modelo/modelo_importacao_perfil.xlsx`}>Download modelo</a>
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

