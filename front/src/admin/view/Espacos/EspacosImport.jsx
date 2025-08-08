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
import { Input } from "../../../components/ui/input.tsx";
import { Label } from "../../../components/ui/label.tsx"




//const socket = io(masterPath.ioUrl);
/* const socket = io('https://minisitio.com.br', {
    path: '/socket.io',
    transports: ["websocket"],
}); */
/*  const socket = io(masterPath.ioUrl, {
    path: '/socket.io'
});  */
const socket = io(masterPath.ioUrl, {
    path: '/socket.io',
    transports: ['websocket'],
    withCredentials: true
});



/* const socket = io("https://minisitio.com.br", {
  path: "/socket.io",
  transports: ["websocket"],
  rejectUnauthorized: false, // necessário se o cert for self-signed
}); */

/*  socket.on("connect", () => {
  console.log("✅ Conectado:", socket.id);
  socket.emit("start-download");
});

socket.on("download-progress", (data) => {
  console.log("📶 Progresso:", data.progress);
});

socket.on("download-complete", () => {
  console.log("✅ Download finalizado");
});

socket.on("connect_error", (err) => {
  console.error("❌ Erro de conexão:", err.message);
});  */

const Espacos = () => {
    const [progressValue, setProgressValue] = useState(null);

    const navigate = useNavigate();

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



    /*     const [progress, setProgress] = useState(0);
    
        useEffect(() => {
            socket.on('download-progress', (data) => {
                setProgress(data.progress);
            });
    
            socket.on('download-complete', () => {
                alert('✅ Download concluído!');
            });
    
            // Limpar eventos ao desmontar
            return () => {
                socket.off('download-progress');
                socket.off('download-complete');
            };
        }, []);
    
        const handleStart = () => {
            socket.emit('start-download');
            console.log("dsdasd")
        }; */

    const [progress, setProgress] = useState(0);
    /*     useEffect(() => {
            if (!socket) return;
    
            console.log("conectando ao socket", socket);
    
            const handleProgress = (data) => {
                console.log("progresso recuperado");
                setProgress(data.progress);
            };
    
            const handleComplete = () => {
                alert('✅ Download concluído!');
                setProgress(100);
                document.querySelector('.espacos')?.click();
            };
    
            socket.on('download-progress', handleProgress);
            socket.on('download-complete', handleComplete);
    
            return () => {
                socket.off('download-progress', handleProgress);
                socket.off('download-complete', handleComplete);
            };
        }, [socket]);  */// <- importante: inclua `socket` nas dependências


    /*     useEffect(() => {
            console.log("conectando ao socket", socket)
            socket.on('download-progress', (data) => {
                console.log("progresso recuperado")
                setProgress(data.progress);
            });
    
            socket.on('download-complete', () => {
                alert('✅ Download concluído!');
                setProgress(100);
    
                document.querySelector('.espacos').click();
    
            });
    
            return () => {
                socket.off('download-progress');
                socket.off('download-complete');
            };
    
        }, []); */

    const handleStart = () => {
        // Faz a chamada para sua rota que inicia o processo, passando o socket.id
        console.log("Iniciando download com socket ID:", socket.id);
        fetch(`http://localhost:3032/start-download/${socket.id}`)
            .then(res => res.text())
            .then(text => console.log(text))
            .catch(err => console.error(err));
    };

    const location = useLocation();

    const handleFormSubmit = async (event) => {
        event.preventDefault(); // Evita o recarregamento da página
        setShowSpinner(true);

        const formData = new FormData(event.target); // Captura os dados do formulário

        try {
            const response = await fetch(`${masterPath.url}/admin/anuncio/import/${socket.id}`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Erro ao enviar o formulário");
            }

            const data = await response.json(); // Recebe a resposta da API
            setShowSpinner(false);
            document.querySelector('#btn-import').disabled = true;


            const now = new Date();
            const hours = now.getHours(); // Horas (0-23)
            const minutes = now.getMinutes(); // Minutos (0-59)
            const seconds = now.getSeconds(); // Segundos (0-59)

            //console.log(`Hora atual: ${hours}:${minutes}:${seconds}`);
            /*    Swal.fire("Sucesso!", "Arquivo enviado!", "success")
                   .then((resposta) => {
                       if (resposta.isConfirmed) {
                           document.querySelector('.espacos').click()
                       }
                   }); */



            setStart(`${hours}:${minutes}:${seconds}`);

            /*        const progressImport = setInterval(() => {
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
                   }, 1000) */

            //setProgressValue(data.progress || null);

        } catch (error) {
            setShowSpinner(false);
            console.error(error);
            Swal.fire("Erro", "Ocorreu um erro ao importar os dados.", "error");
        }
    };

    function handleDownload() {
        // Faz a chamada para sua rota que inicia o download
        fetch(`${masterPath.url}/admin/import/stage/finalizar`)
             .then(x => x.json())
            .then(text => {
                console.log(text)

            })
            .catch(err => console.error(err));
    }

    useEffect(() => {
        setShowSpinner(true)
        const progressImport = setInterval(() => {
            fetch(`${masterPath.url}/admin/import/stage`)
                .then(x => x.json())
                .then(res => {
                    let index = res.data.length

                    setShowSpinner(false)

                    const progressCount = Math.round((index / res.totalImport) * 100);

                    if (progressCount) {
                        setProgress(progressCount);
                    }

                    if (progressCount === 100) {
                        clearInterval(progressImport);
                        Swal.fire({
                            title: "Atenção!",
                            text: "Você deseja concluir o processo de importação?",
                            showDenyButton: true,
                            confirmButtonText: "Sim",
                            denyButtonText: `Não`
                        })
                            .then((resposta) => {
                                if (resposta.isConfirmed) {
                                    handleDownload()
                                    //navigate('/admin/espacos');
                                }
                            });
                    }
                })
        }, 5000)
    }, []);

    return (
        <div className="users">
            <header style={style} className='w-100'>
                <Header />
            </header>
            <section className="pt-5">

                {showSpinner && <Spinner />}

                <h1 className="pt-4 px-4">Importar Perfil</h1>
                {/*  action={`${masterPath.url}/admin/anuncio/import`} method="post" enctype="multipart/form-data" */}
                <form onSubmit={handleFormSubmit} className='px-4' style={{ "marginTop": "20px", }}>
                    Importar Espaços <br />

                    <input type="hidden" name="MAX_FILE_SIZE" value="2097152" id="MAX_FILE_SIZE" />
                    {/* <input type="file" name="uploadedfile" id="uploadedfile" /><br /><br />
 */}
                    <Label htmlFor="picture"></Label>
                    <Input id="uploadedfile" name="uploadedfile" type="file" style={{ cursor: "pointer" }} />

                    <button type="submit" id="btn-import" className="btn custom-button mt-2" >Enviar</button>
                    <a href={`${masterPath.url}/modelo/modelo_importacao_perfil.xlsx`} className='mx-2'>Download modelo</a>
                </form>


                <div className='px-4 my-5'>
                    <h2>Progresso do Download: {progress}%</h2>
                    <progress value={progress} max="100" style={{ width: '100%' }}></progress>
                </div>


                <p className='w-100 text-center'>© MINISITIO - {version.version}</p>
            </section>

            {/* <button onClick={handleStart}>Iniciar Download</button> */}
        </div>
    );
}

export default Espacos;

