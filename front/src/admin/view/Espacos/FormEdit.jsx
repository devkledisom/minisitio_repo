// components/OutroComponente.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../assets/css/users.css';
import 'font-awesome/css/font-awesome.min.css';
import { masterPath } from '../../../config/config';

//componente
import Header from "../Header";
import Spinner from '../../../components/Spinner';
import ChooseFile from "../../../components/ChooseFile";

const FormEdit = () => {


    const [ids, setIds] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [atividadeValue, setAtividade] = useState(false);
    const [page, setPage] = useState(1);
    const [uf, setUfs] = useState([]);
    const [ufSelected, setUf] = useState(0);
    const [caderno, setCaderno] = useState([]);


    const [showSpinner, setShowSpinner] = useState(false);

    const [nm_usuario, setNmUsuario] = useState(false);
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
        fetch(`${masterPath.url}/admin/anuncio/edit/${param}`)
            .then((x) => x.json())
            .then((res) => {
                setIds(res[0]);
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

        fetch(`${masterPath.url}/cadernos`)
            .then((x) => x.json())
            .then((res) => {
                setCaderno(res)
            })
        fetch(`${masterPath.url}/ufs`)
            .then((x) => x.json())
            .then((res) => {
                setUfs(res);
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


    function teste(meuParam) {
        let user = usuarios.find(user => user.codUsuario == meuParam);

        if (user != undefined) {
            return user.descNome
        }
        console.log("users", meuParam, user)

    }

    const executarSelecao = () => {
        let codigoUf = document.querySelectorAll('#coduf')[0].value;
        setUf(codigoUf);
    };

    // Função para lidar com mudanças nos campos de entrada
    const handleChange = (e) => {
        const { name, value } = e.target;
        setIds({
            ...ids,
            [name]: value
        });

        //console.log("resressedsfasdfsf----------->", name, value)


    };

    const handleSelectChange = (e) => {
        executarSelecao(e);
        handleChange(e);
    };

    return (

        <div className="users">
            {console.log(ids)}
            <header style={style} className='w-100'>
                <Header />
            </header>
            <section className='py-5'>
                {showSpinner && <Spinner />}

                <div className="container">
                    <h2 className="pt-4 px-5 text-center">Editar Anúncio</h2>
                    {/* <h2>Vertical (basic) form</h2> */}
                    <form action="/action_page.php">
                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="codUsuario" className="w-50 px-1">Usuário: (Digite o nome, e-mail ou CPF/CNPJ)</label>
                            <input type="text"
                                className="form-control h-25 w-50"
                                id="nm_usuario"
                                name="codUsuario"
                                value={ids.codUsuario}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="codAtividade" className="w-50 px-1">Atividade: (Digite o nome)</label>
                            <input type="text"
                                className="form-control h-25 w-50"
                                id="descAtividade"
                                name="codAtividade"
                                value={ids.codAtividade}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="codTipoAnuncio" className="w-50 px-1">Tipo de anúncio</label>
                            <select name="codTipoAnuncio" id="descTipoAnuncio" className="w-50 py-1" onChange={handleChange} value={ids.codTipoAnuncio} >
                                <option selected="selected">- Selecione o tipo de anúncio -</option>
                                <option value="1">Básico</option>
                                <option value="2">Simples</option>
                                <option value="3">Completo</option>
                            </select>
                        </div>

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="codUf" className="w-50 px-1">UF:</label>
                            <select name="codUf" id="coduf" onChange={handleSelectChange} className="w-50 py-1" value={ids.codUf || ''}>
                                <option value="" selected="selected">- Selecione um estado -</option>
                                {
                                    uf.map((uf) => (
                                        <option value={uf.id_uf}>{uf.sigla_uf}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="codCaderno" className="w-50 px-1">Caderno:</label>
                            <select name="codCaderno" id="codCaderno" className="w-50 py-1" value={ids.codCaderno || ''}>
                                <option value="" selected="selected">- Selecione uma cidade -</option>
                                {
                                    /* caderno.map((cidades) => (
                                        <option value={cidades.codCaderno}>{cidades.nomeCaderno}</option>
                                    )) */
                                }
                            </select>
                        </div>

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="nm_empresa" className="w-50 px-1">Nome da empresa:</label>
                            <input type="text"
                                className="form-control h-25 w-50"
                                id="nm_empresa"
                                name="nm_empresa"
                                value={ids.descAnuncio || ''}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label className="w-50 px-1">Imagem:</label>
                            <ChooseFile codigoUser={param} largura={"w-50"} codImg={ids.descImagem} preview={false} />
                        </div>

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label className="w-50 px-1">Promoção:</label>
                            <ChooseFile codigoUser={param} largura={"w-50"} codImg={ids.descPromocao} preview={false} />
                        </div>

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label className="w-50 px-1">Validade:</label>
                            <input type="date" name="validade" id="validade" className="form-control h-25 w-50" />
                        </div>

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label className="w-50 px-1">Imagem da Parceria:</label>
                            <ChooseFile codigoUser={param} largura={"w-50"} codImg={ids.descPromocao} preview={false} />
                        </div>

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="urlParceria" className="w-50 px-1">Site da Parceria:</label>
                            <input type="text"
                                className="form-control h-25 w-50"
                                id="urlParceria"
                                name="urlParceria"
                                value={descontoId}
                                onChange={(e) => setDescontoId(e.target.value)}
                            />
                            <span>Inserir URL completa para acesso ao site da parceria</span>
                        </div>

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label className="w-50 px-1">Contrato:</label>
                            <ChooseFile codigoUser={param} largura={"w-50"} codImg={ids.descPromocao} preview={false} />
                        </div>

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="descEndereco" className="w-50 px-1">Endereço:</label>
                            <input type="text"
                                className="form-control h-25 w-50"
                                id="endereco"
                                name="descEndereco"
                                value={ids.descEndereco}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="descCEP" className="w-50 px-1">CEP:</label>
                            <input type="text"
                                className="form-control h-25 w-50"
                                id="cod_postal"
                                name="descCEP"
                                value={ids.descCEP}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="descTelefone" className="w-50 px-1">Telefone:</label>
                            <input type="text"
                                className="form-control h-25 w-50"
                                id="nu_telefone"
                                name="descTelefone"
                                value={ids.descTelefone}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="descCelular" className="w-50 px-1">Celular:</label>
                            <input type="text"
                                className="form-control h-25 w-50"
                                id="nu_celular"
                                name="descCelular"
                                value={ids.descCelular}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="descDescricao" className="w-50 px-1">Descrição do anúncio:</label>
                            <textarea type="text"
                                className="form-control h-25 w-50"
                                id="descAnuncio"
                                name="descDescricao"
                                value={ids.descDescricao}
                                onChange={handleChange}
                            ></textarea>
                        </div>

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="descSite" className="w-50 px-1">Site:</label>
                            <input type="text"
                                className="form-control h-25 w-50"
                                id="urlSite"
                                name="descSite"
                                value={ids.descSite}
                                onChange={handleChange}
                                placeholder='Digite uma url válida'
                            />
                        </div>

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="descSkype" className="w-50 px-1">Skype:</label>
                            <input type="text"
                                className="form-control h-25 w-50"
                                id="urlSkype"
                                name="descSkype"
                                value={ids.descSkype || ''}
                                onChange={handleChange}
                                placeholder='Digite uma url válida'
                            />
                        </div>

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="descVideo" className="w-50 px-1">Youtube:</label>
                            <input type="text"
                                className="form-control h-25 w-50"
                                id="urlYoutube"
                                name="descVideo"
                                value={ids.descVideo}
                                onChange={handleChange}
                                placeholder='Digite uma url válida'
                            />
                        </div>

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="descEmailComercial" className="w-50 px-1">E-mail comercial:</label>
                            <input type="text"
                                className="form-control h-25 w-50"
                                id="emailComercial"
                                name="descEmailComercial"
                                value={ids.descEmailComercial}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="descEmailRetorno" className="w-50 px-1">E-mail alternativo:</label>
                            <input type="text"
                                className="form-control h-25 w-50"
                                id="emailAlternativo"
                                name="descEmailRetorno"
                                value={ids.descEmailRetorno}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="descFacebook" className="w-50 px-1">Facebook:</label>
                            <input type="text"
                                className="form-control h-25 w-50"
                                id="urlFacebook"
                                name="descFacebook"
                                value={ids.descFacebook}
                                onChange={handleChange}
                                placeholder='Digite uma url válida'
                            />
                        </div>

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="descInsta" className="w-50 px-1">Instagram:</label>
                            <input type="text"
                                className="form-control h-25 w-50"
                                id="urlInstagram"
                                name="descInsta"
                                value={ids.descInsta}
                                onChange={handleChange}
                                placeholder='Digite uma url válida'
                            />
                        </div>

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="descTweeter" className="w-50 px-1">Twitter:</label>
                            <input type="text"
                                className="form-control h-25 w-50"
                                id="urlTwitter"
                                name="descTweeter"
                                value={ids.descTweeter}
                                onChange={handleChange}
                                placeholder='Digite uma url válida'
                            />
                        </div>

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="descWhatsApp" className="w-50 px-1">WhatsApp:</label>
                            <input type="text"
                                className="form-control h-25 w-50"
                                id="nu_whatszap"
                                name="descWhatsApp"
                                value={ids.descWhatsApp}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="descAndroid" className="w-50 px-1">Aplicativo Android:</label>
                            <input type="text"
                                className="form-control h-25 w-50"
                                id="urlAndroid"
                                name="descAndroid"
                                value={ids.descAndroid}
                                onChange={handleChange}
                                placeholder='Digite uma url válida'
                            />
                        </div>

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="descApple" className="w-50 px-1">Aplicativo iOS:</label>
                            <input type="text"
                                className="form-control h-25 w-50"
                                id="urlIos"
                                name="descApple"
                                value={ids.descApple}
                                onChange={handleChange}
                                placeholder='Digite uma url válida'
                            />
                        </div>

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="descTipoPessoa" className="w-50 px-1">Tipo de pessoa:</label>
                            <select name="descTipoPessoa" id="descTipoPessoa" className="w-50 py-1" value={ids.descTipoPessoa} onChange={handleChange}>
                                <option selected="selected">- Selecione o tipo de pessoa -</option>
                                <option value="pf">Pessoa Física</option>
                                <option value="pj">Pessoa Jurídica</option>
                            </select>
                        </div>

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="descCPFCNPJ" className="w-50 px-1">CPF/CNPJ:</label>
                            <input type="text"
                                className="form-control h-25 w-50"
                                id="nu_documento"
                                name="descCPFCNPJ"
                                value={ids.descCPFCNPJ}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="descNomeAutorizante" className="w-50 px-1">Nome autorizante:</label>
                            <input type="text"
                                className="form-control h-25 w-50"
                                id="nm_autorizante"
                                name="descNomeAutorizante"
                                value={ids.descNomeAutorizante}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="descEmailAutorizante" className="w-50 px-1">E-mail autorizante:</label>
                            <input type="text"
                                className="form-control h-25 w-50"
                                id="emailAutorizante"
                                name="descEmailAutorizante"
                                value={ids.descEmailAutorizante}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group d-flex flex-column align-items-center py-3">
                            <label htmlFor="chavePix" className="w-50 px-1">Chave Pix:</label>
                            <input type="text"
                                className="form-control h-25 w-50"
                                id="chavePix"
                                name="chavePix"
                                value={ids.descChavePix}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="text-center py-3">
                            <button type="button"
                                className="btn btn-info custom-button mx-2 text-light"
                                onClick={editID} >Salvar</button>
                            <button type="submit" className="btn custom-button" onClick={() => navigate('/espacos')}>Cancelar</button>
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
