// components/OutroComponente.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../assets/css/users.css';
import 'font-awesome/css/font-awesome.min.css';
import { masterPath } from '../../../config/config';

//LIBS
import InputMask from 'react-input-mask';
import Swal from 'sweetalert2';

//componente
import Header from "../Header";
import Spinner from '../../../components/Spinner';
import FieldsetPatrocinador from './FieldsetPatrocinador';

const FormEdit = () => {


    const [ids, setIds] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [atividadeValue, setAtividade] = useState(false);
    const [page, setPage] = useState(1);
    const [showSpinner, setShowSpinner] = useState(false);
    const [descricaoId, setDescricaoId] = useState(false);
    const [descontoId, setDescontoId] = useState(false);
    const [hash, setHash] = useState(false);
    const [descImagem, setDescImg] = useState();

    const [patrocinio, setPatrocinio] = useState(0);
    const [saldo, setSaldo] = useState();
    const [saldoValue, setSaldoValue] = useState();
    const [links, setLinks] = useState({
        link_1: null,
        link_2: null,
        link_3: null
    });



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
                setLinks({
                    link_1: res[0].descLink,
                    link_2: res[0].descLink2,
                    link_3: res[0].descLink3
                });
                setPatrocinio(res[0].patrocinador_ativo);
                setSaldoValue(res[0].saldo);
                setSaldo(res[0].utilizar_saldo);

                if (res[0].descImagem != null) {
                    setDescImg(res[0]);
                    //console.log(res[0].descImagem);
                    //setPatrocinio(1)
                }


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
console.log(saldo)
        const data = {
            "usuario": usuarios,
            "descricao": document.getElementById('descID').value,
            "valorDesconto": document.getElementById('valorDesconto').value,
            "patrocinador": document.getElementById('patrocinador').value,
            "saldoUtilizado": document.getElementById('utilizar-saldo').value,
            "descImagem": localStorage.getItem("imgname"),
            "descImagem2": localStorage.getItem("imgname2"),
            "descImagem3": localStorage.getItem("imgname3"),
            "descLink": links.link_1,
            "descLink2": links.link_2,
            "descLink3": links.link_3,
            "utilizarSaldo": saldo,
            "addSaldo": saldoValue//document.getElementById('add-saldo') ? document.getElementById('add-saldo').value : 0
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

                        localStorage.setItem("imgname", '');
                        localStorage.setItem("imgname2", '');
                        localStorage.setItem("imgname3", '');

                        Swal.fire({
                            title: 'sucesso!',
                            text: 'ID Atualizado!',
                            icon: 'success',
                            confirmButtonText: 'Confirmar'
                          })
                    } else {
                        //alert(res.message);
                        console.log(res.message);
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLinks({
            ...links,
            [name]: value
        });
        //console.log("------------->", e.target.name, e.target.value);
    };


    function teste(meuParam) {
        let user = usuarios.find(user => user.codUsuario == meuParam);

        if (user != undefined) {
            return user.descNome
        }
        //console.log("users", meuParam, user)

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
                                        <option key={user.idUsuario} value={user.descNome}>{teste(user.idUsuario)}</option>
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
                                value={String(parseFloat(descontoId).toFixed(2)).replace('.', ',')}
                                onChange={(e) => setDescontoId(String(e.target.value))}
                                placeholder="0,00"
                            />
                            <span>Para alterar o valor para negativo, clique no icone ao lado do campo</span>
                        </div>
                                

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="patrocinador" className="w-50 px-1">Habilitar Patrocinador ?</label>
                            <select name="patrocinador" id="patrocinador" className="w-50 py-1"
                                value={patrocinio}
                                onChange={(e) => setPatrocinio(e.target.value)}>
                                <option value="1">Sim</option>
                                <option value="0">Não</option>
                            </select>
                        </div>

                        {patrocinio == 1 &&
                            <div className="form-group d-flex flex-column align-items-center py-3">
                                <FieldsetPatrocinador numeroPatrocinador={1} linkPatrocinio={handleChange} codigoUser={param} links={descImagem.descLink} codImg={descImagem.descImagem} miniPreview={false} valueLink={links.link_1}/>
                                <FieldsetPatrocinador numeroPatrocinador={2} linkPatrocinio={handleChange} codigoUser={param} links={descImagem.descLink2} codImg={descImagem.descImagem2} miniPreview={false} valueLink={links.link_2}/>
                                <FieldsetPatrocinador numeroPatrocinador={3} linkPatrocinio={handleChange} codigoUser={param} links={descImagem.descLink3} codImg={descImagem.descImagem3} miniPreview={false} valueLink={links.link_3}/>
                            </div>

                        }


                        {/*          <div className="form-group d-flex flex-column align-items-center py-3">
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
 */}
                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="utilizar-saldo" className="w-50 px-1">Utilizar Saldo ?</label>
                            <select name="utilizar-saldo" id="utilizar-saldo" className="w-50 py-1" value={saldo} onChange={(e) => setSaldo(e.target.value)}>
                                <option value="0">Não</option>
                                <option value="1">Sim</option>
                            </select>
                        </div>
                        {saldo == 1 &&
                            <div className="form-group d-flex flex-column align-items-center py-3">
                                <div class="control-group w-50" style={{ display: "block" }}><label for="adicionar_saldo" class="control-label optional">Adicionar Saldo:</label>
                                    <div class="controls">
                                        <input type="text" name="adicionar_saldo" id="adicionar_saldo" className="w-100" value={saldoValue} onChange={(e) => setSaldoValue(e.target.value)} />
                                    </div>
                                </div>
                            </div>
                        }



                        <div className="text-center py-3">
                            <button type="button"
                                className="btn btn-info custom-button mx-2 text-light"
                                onClick={editID}
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

export default FormEdit;
