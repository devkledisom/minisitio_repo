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
    const [descontoId, setDescontoId] = useState('carregando');
    const [hash, setHash] = useState(false);
    const [descImagem, setDescImg] = useState([]);

    const [patrocinio, setPatrocinio] = useState(0);
    const [saldo, setSaldo] = useState();
    const [saldoValue, setSaldoValue] = useState();
    const [links, setLinks] = useState({
        link_1: null,
        link_2: null,
        link_3: null
    });
    const [imgs, setImgs] = useState({
        img_1: null,
        img_2: null,
        img_3: null
    });



    const location = useLocation();

    const navigate = useNavigate();

    const getParam = new URLSearchParams(location.search);

    const param = getParam.get('id') ? getParam.get('id') : 1;

    const style = {
        position: "fixed",
        zIndex: "999"
    }

    const tokenAuth = sessionStorage.getItem('userTokenAccess');

    useEffect(() => {
        setShowSpinner(true);
        fetch(`${masterPath.url}/admin/desconto/edit/${param}`)
            .then((x) => x.json())
            .then((res) => {
                setIds(res);
                setDescricaoId(res[0].descricao);
                setDescontoId(String(`${res[0].desconto},00`));
                setHash(res[0].hash);
                setLinks({
                    link_1: res[0].descLink,
                    link_2: res[0].descLink2,
                    link_3: res[0].descLink3
                });
                setImgs({
                    img_1: res[0].descImagem,
                    img_2: res[0].descImagem2,
                    img_3: res[0].descImagem3
                });
                setPatrocinio(res[0].patrocinador_ativo);
                setSaldoValue(res[0].saldo);
                setSaldo(res[0].utilizar_saldo);

                localStorage.setItem("imgname", res[0].descImagem);
                localStorage.setItem("imgname2", res[0].descImagem2);
                localStorage.setItem("imgname3", res[0].descImagem3);

                if (res[0].descImagem != null) {
                    setDescImg(res[0]);
                    //console.log(res[0].descImagem);
                    //setPatrocinio(1)
                }

                document.getElementById('user').value = res[0].idUsuario;

                /*      fetch(`${masterPath.url}/admin/desconto/usuario/buscar/${res[0].idUsuario}`)
                         .then((x) => x.json())
                         .then((res) => {
                             setUsuarios(res.usuarios);
                             setShowSpinner(false);
                         }).catch((err) => {
                             console.log(err);
                             setShowSpinner(false);
                         }) */


                /*  fetch(`${masterPath.url}/admin/usuario/buscar/master?require=codTipoUsuario`)
                            .then((x) => x.json())
                            .then((res) => {
                                if(res.success) {
                                    console.log(ids[0].idUsuario)
                                    setUsuarios(res.usuarios);
                                    setShowSpinner(false);
                                    document.getElementById('user').value = ids[0].idUsuario;
                                } else {
                                    console.log(res)
                                    setUsuarios([]);
                                    setShowSpinner(false);
                                }
                
                            }).catch((err) => {
                                console.log(err);
                                setShowSpinner(false);
                            }) */


            }).catch((err) => {
                console.log(err)
            })

        fetch(`${masterPath.url}/admin/usuario/buscar/master?require=codTipoUsuario`)
            .then((x) => x.json())
            .then((res) => {
                if (res.success) {
                    //console.log(ids[0].idUsuario)
                    setUsuarios(res.usuarios);
                    setShowSpinner(false);

                } else {
                    //console.log(res)
                    setUsuarios([]);
                    setShowSpinner(false);
                }

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
            "usuario": document.getElementById('user').value,
            "descricao": document.getElementById('descID').value,
            "valorDesconto": document.getElementById('valorDesconto').value,
            "patrocinador": document.getElementById('patrocinador').value,
            "saldoUtilizado": document.getElementById('utilizar-saldo').value,
            "descImagem": imgs.newImg_1 ? imgs.newImg_1 : imgs.img_1,
            "descImagem2": imgs.newImg_2 ? imgs.newImg_2 : imgs.img_2,
            "descImagem3": imgs.newImg_3 ? imgs.newImg_3 : imgs.img_3,
            /* "descImagem": localStorage.getItem("imgname"),
            "descImagem2": localStorage.getItem("imgname2"),
            "descImagem3": localStorage.getItem("imgname3"), */
            "descLink": links.link_1,
            "descLink2": links.link_2,
            "descLink3": links.link_3,
            "utilizarSaldo": saldo,
            "addSaldo": saldoValue, //document.getElementById('add-saldo') ? document.getElementById('add-saldo').value : 0
            "imagens": imgs
        };


        const config = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "authorization": 'Bearer ' + tokenAuth
            },
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
                        }).then(() => {

                            window.location.reload();

                        })
                    } else {
                        //alert(res.message);

                        if (res.message == "Token inválido") {
                            alert("Sessão expirada, faça login para continuar.");
                            navigate('/login')
                        }
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
        //console.log("users", meuParam, usuarios, user)

    }

    const handleInputChange = (e) => {
        let value = e.target.value || descontoId;
        // Remove qualquer caractere que não seja número ou vírgula
        value = value.replace(/[^0-9,]/g, '');

        // Se já existe uma vírgula, impede a digitação de outra
        const parts = value.split(',');

        value = parseFloat(value).toFixed(2);

        if (value.length == 2) {
            //value = `${value},00`; // Mantém apenas 2 dígitos após a vírgula
        }

        // Adiciona o "0," inicial se o campo ficar vazio ou começar com uma vírgula
        if (value == '' || value == ',' || value.length == 3) {
            value = '';
        }

        // Garante duas casas decimais ao final
        /*   if (parts.length == 2) {
              const [integer, decimal] = parts;
              value = `${integer},${decimal.slice(0, 2)}`;
          } */


        setDescontoId(value);
    };

    const formatarReais = (valor) => {
        valor = valor.replace(/\D/g, ""); // remove não números
        valor = (valor / 100).toFixed(2) + "";
        valor = valor.replace(".", ",");
        valor = valor.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        return valor;
    };


    return (
        <div className="users">
            {/*    <header style={style} className='w-100'>
                <Header />
            </header> */}
            <section className='py-5'>
                {showSpinner && <Spinner />}

                <div className="container">
                    <h2 className="pt-4 px-5 text-center">Editar ID</h2>
                    {/* <h2>Vertical (basic) form</h2> */}
                    <form action="/action_page.php">
                        <div className="form-group d-flex flex-column align-items-center py-3">

                            {hash && <span>Código: {hash}</span>}

                            <label htmlFor="user" className="w-50 px-1">Usuário:</label>
                            <select name="user" id="user" className="w-50 py-1 border border-dark rounded">
                                <option value="0">- Carregando -</option>
{console.log("usuarios", usuarios)}
                                {
                                    
                                    usuarios.map((user) => (
                                        <option key={user.codUsuario} value={user.codUsuario}>{/* teste(user.idUsuario) */user.descNome}</option>
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
                        {/*                  <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="valorDesconto" className="w-50 px-1">Valor base:</label>

                          <input type="number"
                                className="form-control h-25 w-50"
                                id="valorDesconto"
                                name="valorDesconto"
                                value={`${parseFloat(descontoId).toFixed(2)}`}
                                onChange={(e) => setDescontoId(`${parseFloat(e.target.value)}`)}
                                placeholder="0,00"
                            /> 

                        </div> */}
                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="valorDesconto" className="w-50 px-1">Valor do desconto:</label>

                            <InputMask
                                type="text"
                                className="form-control h-25 w-50"
                                id="valorDesconto"
                                name="valorDesconto"
                                value={descontoId}
                                onChange={(e) => setDescontoId(formatarReais(e.target.value))}
                                mask={null}
                                placeholder="0,00"
                            />

                            {/*          <InputMask
                                type="text"
                                className="form-control h-25 w-50"
                                id="valorDesconto"
                                name="valorDesconto"
                                value={`${descontoId}`}
                                onChange={(e) => setDescontoId(`${e.target.value}`)}
                                placeholder="0,00"
                                mask={'99,99'}
                            ></InputMask> */}
                            {/* 
                            <input type="number"
                                className="form-control h-25 w-50"
                                id="valorDesconto"
                                name="valorDesconto"
                                value={`${parseFloat(descontoId).toFixed(2)}`}
                                onChange={(e) => setDescontoId(`${parseFloat(e.target.value)}`)}
                                placeholder="0,00"
                            /> */}

                            {/*  <span>Para alterar o valor para negativo, clique no icone ao lado do campo</span> */}
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
                                <FieldsetPatrocinador numeroPatrocinador={1} linkPatrocinio={handleChange} codigoUser={param} links={descImagem.descLink} codImg={descImagem.descImagem} miniPreview={false} valueLink={links.link_1} setImgs={setImgs} />
                                <FieldsetPatrocinador numeroPatrocinador={2} linkPatrocinio={handleChange} codigoUser={param} links={descImagem.descLink2} codImg={descImagem.descImagem2} miniPreview={false} valueLink={links.link_2} setImgs={setImgs} />
                                <FieldsetPatrocinador numeroPatrocinador={3} linkPatrocinio={handleChange} codigoUser={param} links={descImagem.descLink3} codImg={descImagem.descImagem3} miniPreview={false} valueLink={links.link_3} setImgs={setImgs} />
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
