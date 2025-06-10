import { masterPath } from "../../config/config";

//LIBS
import Swal from 'sweetalert2';

export function criarAnuncio(tagValue, personType, radioCheck, setShowSpinner, descontoAtivado, setAlert, isAdmin, descValor, isCapa) {


    let validation = true;

    document.querySelectorAll('[required]').forEach((item) => {
        if (item.value.trim() === "") {
            item.style.border = "1px solid red";
            validation = false;
        } else {
            item.style.border = "1px solid gray";
        }
    });

    if (!validation) {
        Swal.fire({
            title: "Atenção",
            text: "Preencha todos os campos obrigatórios!",
            icon: "warning",
            confirmButtonText: "OK"
        });
        return;
    }

    setShowSpinner(true);
    document.querySelector('.form-create').style.filter = 'blur(2px)';

    fetch(`${masterPath.url}/portal/usuario/buscar/${pegarElemento('#descCPFCNPJ').replace(/[.\-\/]/g, '')}`)
        .then((x) => x.json())
        .then((res) => {
            if (res.success) {
                console.log(res)
                setShowSpinner(true);

                cadastrarAnuncio(res.usuario.codUsuario)
            } else {
                setShowSpinner(true);
                criarUsuario();
            };

        })

    function criarUsuario() {
        const obj = {
            "TipoPessoa": pegarElemento('#descTipoPessoa-pf').checked ? "pf" : "pj",
            "CPFCNPJ": pegarElemento('#descCPFCNPJ').replace(/[.\-\/]/g, ''),
            "Nome": pegarElemento('#descNomeAutorizante'),
            "Email": pegarElemento('#descEmailAutorizante'),
            "senha": '12345',
            "hashCode": 0,
            "Value": 0,
            "TipoUsuario": isCapa ? "5" : "3",
            "Telefone": pegarElemento('#descTelefone'),
            "RepresentanteConvenio": "default",
            "Endereco": pegarElemento('#descEndereco'),
            "Uf": pegarElemento('#codUf4'),
            "Cidade": pegarElemento('#codUf5'),
            "Cadastro": 31323,
            "usuarioCod": 0,
            "dtCadastro2": "12-12-2012",
            "dtAlteracao": "12-12-2012",
            "ativo": "1"

        };




        //console.log(obj)

        fetch(`${masterPath.url}/admin/usuario/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(obj),
        })
            .then((x) => x.json())
            .then((res) => {
                if (res.success) {
                    cadastrarAnuncio(res.message.codUsuario)

                } else {
                    console.log("Esse usuário já está cadastrado!");
                }
                //console.log(res);
                //setShowSpinner(false);
            });
    }

    function pegarElemento(elemento) {
        return document.querySelector(elemento).value;
    };

    function cadastrarAnuncio(codUser) {
        const obj = {
            codAnuncio: 37,
            codUsuario: codUser,
            codTipoAnuncio: radioCheck,
            codAtividade: buscarElemento("codAtividade"),
            codPA: null,
            codDuplicado: null,
            tags: JSON.stringify(tagValue),
            codCaderno: buscarElemento("codUf5"),
            codUf: buscarElemento("codUf4"),
            codCidade: buscarElemento("codUf5"),
            descAnuncio: buscarElemento("descAnuncio"),
            descAnuncioFriendly: "oficina-de-tortas",
            descImagem: localStorage.getItem("imgname") != null ? localStorage.getItem("imgname") : 0,
            descEndereco: buscarElemento("descEndereco"),
            descTelefone: buscarElemento("descTelefone"),
            descCelular: buscarElemento("descCelular"),
            descDescricao: "",
            descSite: "www.oficinadetortas.com.br",
            descSkype: null,
            descPromocao: descValor,
            descEmailComercial: buscarElemento("descEmailComercial"),
            descEmailRetorno: buscarElemento("descEmailRetorno"),
            descFacebook: "",
            descTweeter: "",
            descWhatsApp: buscarElemento("descWhatsApp"),
            descCEP: buscarElemento("descCEP"),
            descTipoPessoa: buscarElemento("descTipoPessoa-pf").checked ? "pf" : "pj",
            descCPFCNPJ: buscarElemento("descCPFCNPJ").replace(/[.\-\/]/g, ''),
            descNomeAutorizante: buscarElemento("descNomeAutorizante"),
            descEmailAutorizante: buscarElemento("descEmailAutorizante"),
            codDesconto: buscarElemento("discountHash"),
            descLat: null,
            descLng: null,
            formaPagamento: null,
            promocaoData: null,
            descContrato: null,
            descAndroid: "",
            descApple: "",
            descInsta: null,
            descPatrocinador: null,
            descPatrocinadorLink: null,
            qntVisualizacoes: 813,
            activate: 1,
            dtCadastro: 1356636164,
            dtCadastro2: descontoAtivado ? Date.now() : null,
            dtAlteracao: Date.now(),
            descLinkedin: null,
            descTelegram: null,
            certificado_logo: null,
            certificado_texto: null,
            certificado_imagem: null,
            link_comprar: null,
            cashback_logo: null,
            cashback_link: null,
            certificado_link: null,
            cartao_digital: null,
            descYouTube: buscarElemento("descYouTube")
        };

        function buscarElemento(param) {
            let elementoSelecionado = document.querySelector(`#${param}`);

            if (elementoSelecionado != undefined) {
                return elementoSelecionado.value;
            } else {
                return null;
            }

        }

        if (obj.descCPFCNPJ == "") {
            alert("Preencha todos os campos");
            return;
        }

        //console.log(obj);  /admin/usuario/criar-anuncio
        fetch(`${masterPath.url}/admin/anuncio/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(obj),
        })
            .then((x) => x.json())
            .then((res) => {
                //setShowSpinner(false);
                // Remover um item do localStorage
                localStorage.removeItem("imgname");
                window.scrollTo({ top: 0, behavior: 'smooth' });


                //setAlert(true);
                Swal.fire({
                    title: "Perfil Cadastrado",
                    text: "Você será redirecionado para página de login, para efetuar o login use o seu cnpj e a senha defenida no cadastro. Você também receberá as informações do acesso no email cadastrado.",
                    icon: "success",
                    didOpen: () => { setShowSpinner(false); }
                }).then(result => {
                    //console.log("primeiro dasdfaskhjfsdafhjasdbfnjaksdf", descontoAtivado, radioCheck, res.message.codAnuncio)

                    let idPerfil = res.message.codAnuncio;
                    let codDesconto = res.message.codDesconto;
                    let descontoAprovado = false;

                    /*          fetch(`${masterPath.url}/pagamento/create/${idPerfil}`)
                                 .then((x) => x.json())
                                 .then((response) => {
                                     console.log(response)
                                 }) */


                    if (result.isConfirmed) {
                        if (isAdmin) {
                            console.log("primeiro dasdfaskhjfsdafhjasdbfnjaksdf")
                            if (descontoAtivado && radioCheck == 4) {
                                window.open(`/ver-anuncios/${limparCPFouCNPJ(obj.descCPFCNPJ)}`, '_blank');
                                console.log("1");
                            } else if (radioCheck == 1) {
                                window.open(`/ver-anuncios/${limparCPFouCNPJ(obj.descCPFCNPJ)}`, '_blank');
                                console.log("2");
                            } else {
                                window.open(`https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=712696516-cad9b026-5622-4fe2-921c-3d2d336a6d82`, '_blank');
                                console.log("3");
                            }

                            return;

                        } else {
                            console.log("segundo dasdfaskhjfsdafhjasdbfnjaksdf", descontoAprovado)

                            fetch(`${masterPath.url}/admin/desconto/buscar/${codDesconto}`)
                                .then((x) => x.json())
                                .then((res) => {
                                    console.log(res)
                                    if (res.success) {
                                        if (res.IdsValue[0].desconto > 0) {
                                            descontoAprovado = true
                                        }

                                        let valorBruto = 10 - res.IdsValue[0].desconto;

                                        if (descontoAtivado && radioCheck == 4 && valorBruto <= 0) {
                                            window.location.href = `/ver-anuncios/${limparCPFouCNPJ(obj.descCPFCNPJ)}`;
                                            console.log("1");
                                        } else if (descontoAtivado && radioCheck == 3 && valorBruto <= 0) {
                                            window.location.href = `/ver-anuncios/${limparCPFouCNPJ(obj.descCPFCNPJ)}`;
                                            console.log("1");
                                        } else if (radioCheck == 1 && valorBruto <= 0) {
                                            window.location.href = `/ver-anuncios/${limparCPFouCNPJ(obj.descCPFCNPJ)}`;
                                            console.log("2");
                                        } else {
                                            fetch(`${masterPath.url}/pagamento/create/${idPerfil}`)
                                                .then((x) => x.json())
                                                .then((response) => {
                                                    window.location.href = response.url;

                                                })
                                                .catch(err => console.log(err))
                                            //window.location.href = `https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=712696516-cad9b026-5622-4fe2-921c-3d2d336a6d82`;

                                            console.log("3");
                                        }
                                    } else {
                                        window.location.href = `/ver-anuncios/${limparCPFouCNPJ(obj.descCPFCNPJ)}`;
                                    }
                                })

                        }

                    }

                });
            });
    }




    function limparCPFouCNPJ(cpfOuCnpj) {
        return cpfOuCnpj.replace(/[.\-\/]/g, '');
    }

};