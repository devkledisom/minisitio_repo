// components/OutroComponente.js
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../assets/css/users.css';
import 'font-awesome/css/font-awesome.min.css';
import { masterPath } from '../../../config/config';
import Swal from 'sweetalert2';

//componente
import Header from "../Header";
import Spinner from '../../../components/Spinner';
import FieldsetPatrocinador from './FieldsetPatrocinador';
import ChooseFile from "../../../components/ChooseFile";

const FormCadastro = () => {


    const [usuarios, setUsuarios] = useState([]);
    const [atividadeValue, setAtividade] = useState(false);
    const [page, setPage] = useState(1);
    const [showSpinner, setShowSpinner] = useState(false);
    const [hash, setHash] = useState(false);
    const [patrocinio, setPatrocinio] = useState(0);
    const [saldo, setSaldo] = useState(0);
    const [links, setLinks] = useState({
        link_1: null,
        link_2: null,
        link_3: null
    });
    const [value, setValue] = useState('');

    //REFS
    const isCapa = useRef(null);


    const location = useLocation();

    const navigate = useNavigate();

    const getParam = new URLSearchParams(location.search);

    const param = getParam.get('page') ? getParam.get('page') : 1;

    const style = {
        position: "fixed",
        zIndex: "999"
    }

    const tokenAuth = sessionStorage.getItem('userTokenAccess');


    useEffect(() => {
        setShowSpinner(true);
        fetch(`${masterPath.url}/admin/usuario/buscar/master?require=codTipoUsuario`)
            .then((x) => x.json())
            .then((res) => {
                if (res.success) {
                    setUsuarios(res.usuarios);
                    setShowSpinner(false);
                } else {
                    console.log(res)
                    setUsuarios([]);
                    setShowSpinner(false);
                }

            }).catch((err) => {
                console.log(err);
                setShowSpinner(false);
            })
    }, []);

    function gerarIdMaster(e) {
        setShowSpinner(true);
        let codigoDoMaster = e.target.value;
        usuarios.find((item) => {
            if (item.codUsuario == codigoDoMaster) {
                fetch(`${masterPath.url}/admin/desconto/ddd/${item.codUf}`)
                    .then((x) => x.json())
                    .then((res) => {
                        //console.log(res.data.ddd, String(item.codUsuario).padStart(3, "0"), String(res.qtdeIds).padStart(4, "0"))
                        setHash(`${res.data.ddd}.${String(res.masters).padStart(3, "0")}.${String(res.qtdeIds).padStart(4, "0")}`);
                        setShowSpinner(false);
                    })
            }
        }

        )
    };


    function gerarNumeroAleatorio() {
        // Gerar números aleatórios entre 0 e 999 para cada parte
        const parte1 = Math.floor(Math.random() * 1000);
        const parte2 = Math.floor(Math.random() * 1000);
        const parte3 = Math.floor(Math.random() * 1000);

        // Formatando os números com zeros à esquerda para garantir três dígitos
        const numeroFormatado = [
            ('000' + parte1).slice(-2), // Adiciona zeros à esquerda e pega os últimos três dígitos
            ('000' + parte2).slice(-3),
            ('000' + parte3).slice(-3)
        ].join('.'); // Une as partes com o separador '.'

        setHash(numeroFormatado);
    }


    function criarID() {

        var validation = true;
        setShowSpinner(true);

        let valorDescontoString = value.replace(",", ".");
        let valorDescontoNumber = parseFloat(valorDescontoString).toFixed(2);

        const data = {
            "usuario": document.getElementById('user').value,
            "descricao": document.getElementById('descID').value,
            "valorDesconto": parseFloat(valorDescontoString).toFixed(2),//valorDescontoNumber, //document.getElementById('valorDesconto').value,
            "patrocinador": document.getElementById('patrocinador').value,
            "saldoUtilizado": document.getElementById('utilizar-saldo').value,
            "hash": hash,
            "descImagem": localStorage.getItem("imgname"),
            "descImagem2": localStorage.getItem("imgname2"),
            "descImagem3": localStorage.getItem("imgname3"),
            "descLink": links.link_1,
            "descLink2": links.link_2,
            "descLink3": links.link_3,
            "saldo": document.getElementById('adicionar_saldo') ? document.getElementById('adicionar_saldo').value : 0,
            "is_capa": isCapa.current.value
        };

        const config = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "authorization": 'Bearer ' + tokenAuth
            },
            body: JSON.stringify(data)
        };

        if (validation) {
            fetch(`${masterPath.url}/admin/desconto/create`, config)
                .then((x) => x.json())
                .then((res) => {
                    console.log(res)
                    if (res.success) {
                        setShowSpinner(false);
                        //alert("Usuário Cadastrado!"); 

                        localStorage.setItem("imgname", '');
                        localStorage.setItem("imgname2", '');
                        localStorage.setItem("imgname3", '');

                        Swal.fire({
                            title: 'sucesso!',
                            text: 'ID cadastrado!',
                            icon: 'success',
                            confirmButtonText: 'Confirmar'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                window.location.reload();
                            }
                        })
                    } else {
                        setShowSpinner(false);
                        //if(res.message.original.code == 'ER_DUP_ENTRY') {
                        Swal.fire({
                            title: 'falha!',
                            text: res.message.errors[0].message,
                            icon: 'error',
                            confirmButtonText: 'Entendi'
                        })
                        //}
                        //console.log(res.message);
                    }
                }).catch((err) => {
                    // console.log(err);
                    setShowSpinner(false);
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLinks({
            ...links,
            [name]: value
        });
    };

    const handleInputChange = (e) => {
        let inputValue = e.target.value;

        setValue(inputValue);

    };

    return (
        <div className="users">
            <header style={style} className='w-100'>
                <Header />
            </header>
            <section className='py-5'>
                {showSpinner && <Spinner />}

                <div className="container">
                    <h2 className="pt-4 px-5 text-center">Adicionar ID</h2>
                    {/* <h2>Vertical (basic) form</h2> */}
                    <form action="/action_page.php">
                        <div className="form-group d-flex flex-column align-items-center py-3">
                            {hash && <span className='codigoId'>Código: {hash}</span>}
                            <label htmlFor="user" className="w-50 px-1">Usuário:</label>
                            <select name="user" id="user" className="w-50 py-1" onChange={gerarIdMaster}>
                                <option>- Selecionar Usuário -</option>
                                {
                                    usuarios.map((user) => (

                                        <option value={user.codUsuario}>{user.descNome}</option>
                                    ))
                                }
                            </select>
                        </div>

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="descID" className="w-50 px-1">Descrição do ID:</label>
                            <input type="text" className="form-control h-25 w-50" id="descID" placeholder="" name="descID" />
                        </div>
                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="valorDesconto" className="w-50 px-1">Valor do desconto:</label>
                            <input type="text" className="form-control h-25 w-50" id="valorDesconto" name="valorDesconto"
                                value={value}
                                onChange={handleInputChange}
                                placeholder="0,00"
                            />
                            <span>Para alterar o valor para negativo, clique no icone ao lado do campo</span>
                        </div>


                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="patrocinador" className="w-50 px-1">Habilitar Patrocinador ?</label>
                            <select name="patrocinador" id="patrocinador" className="w-50 py-1" onChange={(e) => setPatrocinio(e.target.value)}>
                                <option value="0">Não</option>
                                <option value="1">Sim</option>
                            </select>
                        </div>
                        {patrocinio == 1 &&
                            <div className="form-group d-flex flex-column align-items-center py-3">
                                <FieldsetPatrocinador numeroPatrocinador={1} linkPatrocinio={handleChange} miniPreview={true} />
                                <FieldsetPatrocinador numeroPatrocinador={2} linkPatrocinio={handleChange} miniPreview={true} />
                                <FieldsetPatrocinador numeroPatrocinador={3} linkPatrocinio={handleChange} miniPreview={true} />
                                {/*  <label className="w-50 px-1">Imagem:</label> */}
                                {/*  <ChooseFile codigoUser={param} largura={"w-50"} preview={true} /> */}
                            </div>

                        }




                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="utilizar-saldo" className="w-50 px-1">Utilizar Saldo ?</label>
                            <select name="utilizar-saldo" id="utilizar-saldo" className="w-50 py-1" onChange={(e) => setSaldo(e.target.value)}>
                                <option value="0">Não</option>
                                <option value="1">Sim</option>
                            </select>
                        </div>
                        {saldo == 1 &&
                            <div className="form-group d-flex flex-column align-items-center py-3">
                                <div class="control-group w-50" style={{ display: "block" }}><label for="adicionar_saldo" class="control-label optional">Adicionar Saldo:</label>
                                    <div class="controls">
                                        <input type="text" name="adicionar_saldo" id="adicionar_saldo" className="w-100" />
                                    </div>
                                </div>
                            </div>
                        }

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="utilizar-saldo" className="w-50 px-1">Habilitar ID para Capa ?</label>
                            <select name="utilizar-saldo" id="utilizar-saldo" className="w-50 py-1" ref={isCapa}>
                                <option value={false}>Não</option>
                                <option value={true}>Sim</option>
                            </select>
                        </div>


                        <div className="text-center py-3">
                            <button type="button"
                                className="btn btn-info custom-button mx-2 text-light"
                                onClick={criarID}
                            >Salvar</button>
                            <button type="submit" className="btn custom-button" onClick={() => navigate('/admin/desconto')}>Cancelar</button>
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

export default FormCadastro;
