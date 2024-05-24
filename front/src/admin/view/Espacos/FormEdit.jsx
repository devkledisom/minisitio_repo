// components/OutroComponente.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../assets/css/users.css';
import 'font-awesome/css/font-awesome.min.css';
import { masterPath } from '../../../config/config';

//componente
import Header from "../Header";
import Spinner from '../../../components/Spinner';

const FormEdit = () => {


    const [ids, setIds] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [atividadeValue, setAtividade] = useState(false);
    const [page, setPage] = useState(1);
    const [showSpinner, setShowSpinner] = useState(false);
    const [descricaoId, setDescricaoId] = useState(false);
    const [descontoId, setDescontoId] = useState(false);
    const [hash, setHash] = useState(false);



    const location = useLocation();

    const navigate = useNavigate();

    const getParam = new URLSearchParams(location.search);

    const param = getParam.get('id') ? getParam.get('id') : 1;

    const style = {
        position: "fixed",
        zIndex: "999"
    }

    useEffect(() => {
        setShowSpinner(true); 
        fetch(`${masterPath.url}/admin/desconto/edit/${param}`)
        .then((x) => x.json())
        .then((res) => {
            setIds(res);
            setDescricaoId(res[0].descricao);
            setDescontoId(res[0].desconto);
            setHash(res[0].hash);
          
        }).catch((err) => {
            console.log(err)
        })
        fetch(`${masterPath.url}/admin/usuario/buscar/all`)
        .then((x) => x.json())
        .then((res) => {
            setUsuarios(res.usuarios);
            setShowSpinner(false); 
        }).catch((err) => {
            console.log(err);
            setShowSpinner(false); 
        })
    }, []);
  

    function editID() {

        var validation = false;
        setShowSpinner(true);

        document.querySelectorAll('[name="pwd"]').forEach((item) => {
            if (item.value == "") {
                item.style.border = "1px solid red";
                validation = false;
                return;
            } else {
                item.style.border = "1px solid gray";
                validation = true;
            };
        });

        document.querySelectorAll('select').forEach((item) => {
            if (item.value == "") {
                item.style.border = "1px solid red";
                validation = false;
                return;
            } else {
                item.style.border = "1px solid gray";
                validation = true;
            };
        });

        const data = {
            "usuario": usuarios,
            "descricao": document.getElementById('descID').value,
            "valorDesconto": document.getElementById('valorDesconto').value,
            "patrocinador": document.getElementById('patrocinador').value,
            "saldoUtilizado": document.getElementById('utilizar-saldo').value,
            "addSaldo": document.getElementById('add-saldo').value || 0
        };

        const config = {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        };

        if (validation) {
            fetch(`${masterPath.url}/admin/desconto/update?id=${param}`, config)
                .then((x) => x.json())
                .then((res) => {
                    if (res.success) {
                        setShowSpinner(false);
                        alert("Usuário Atualizado!");
                    } else {
                        alert(res.message);
                    }
                })
        }

    };


    //liberar campo select
    document.querySelectorAll('select').forEach((item) => {
        item.addEventListener("change", (event) => {
            event.target.style.border = "1px solid gray";
        })
    });
    //liberar campo input
    document.querySelectorAll('[name="pwd"]').forEach((item) => {
        item.addEventListener("change", (event) => {
            event.target.style.border = "1px solid gray";
        })
    });

    const handleChange = (event) => {
        const { name, value } = event.target;

        switch (event.target.id) {
            case "atividade":
                atividadeValue.atividade = value;
                break;
            case "corTitulo":
                atividadeValue.corTitulo = value;
                break;
            default:
                console.log("não encontrou");
                break;
        }


        setAtividade(prevState => ({
            ...prevState,
            [name]: value
        }));


    };

    function teste(meuParam) {
        let user = usuarios.find(user => user.codUsuario == meuParam);

        if(user != undefined) {
            return user.descNome
        }
        console.log("users",meuParam, user)
       
    }

    return (
        <div className="users">
            <header style={style} className='w-100'>
                <Header />
            </header>
            <section className='py-5'>
            {showSpinner && <Spinner />}

                <div className="container">
                    <h2 className="pt-4 px-5 text-center">Editar ID</h2>
                    {/* <h2>Vertical (basic) form</h2> */}
                    <form action="/action_page.php">
                        <div className="form-group d-flex flex-column align-items-center py-3">

                        {hash && <span>Código: {hash}</span>} 

                            <label htmlFor="user" className="w-50 px-1">Usuário:</label>
                            <select name="user" id="user" className="w-50 py-1">
                                {
                                    ids.map((user) => (
                                        <option value={user.descNome}>{teste(user.idUsuario)}</option>
                                    ))
                                }
                            </select>
                        </div>

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="descID" className="w-50 px-1">Descrição do ID:</label>
                            <input type="text"
                             className="form-control h-25 w-50"
                              id="descID" 
                               name="descID"
                                value={descricaoId}
                                onChange={(e) => setDescricaoId(e.target.value)}
                                />
                        </div>
                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="valorDesconto" className="w-50 px-1">Valor do desconto:</label>
                            <input type="text" 
                            className="form-control h-25 w-50" 
                            id="valorDesconto" 
                             name="valorDesconto" 
                             value={descontoId}
                             onChange={(e) => setDescontoId(e.target.value)}
                             />
                            <span>Para alterar o valor para negativo, clique no icone ao lado do campo</span>
                        </div>


                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="patrocinador" className="w-50 px-1">Habilitar Patrocinador ?</label>
                            <select name="patrocinador" id="patrocinador" className="w-50 py-1">
                                <option value="1">Sim</option>
                                <option value="0">Não</option>
                            </select>
                        </div>
                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="utilizar-saldo" className="w-50 px-1">Utilizar Saldo ?</label>
                            <select name="utilizar-saldo" id="utilizar-saldo" className="w-50 py-1">
                                <option value="1">Sim</option>
                                <option value="0">Não</option>
                            </select>
                        </div>

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="add-saldo" className="w-50 px-1">Adicionar Saldo:</label>
                            <input type="text"
                             className="form-control h-25 w-50"
                              id="add-saldo" 
                               name="add-saldo"
                                />
                        </div>

                      
                        <div className="text-center py-3">
                            <button type="button"
                                className="btn btn-info custom-button mx-2 text-light"
                                onClick={editID}
                            >Salvar</button>
                            <button type="submit" className="btn custom-button" onClick={() => navigate('/desconto')}>Cancelar</button>
                        </div>
                    </form>
                </div>
            </section >
            <footer className='w-100' style={{ position: "relative", bottom: "0px" }}>
                <p className='w-100 text-center'>© MINISITIO</p>
            </footer>
        </div >
    );
}

export default FormEdit;
