import { masterPath } from "../../config/config";

export function criarAnuncio(tagValue, personType, radioCheck, setShowSpinner, descontoAtivado, setAlert) {
    setShowSpinner(true);


    var validation = false;
    document.querySelectorAll('[required]').forEach((item) => {
        if (item.value == "") {
            item.style.border = "1px solid red";
            validation = false;
            //setValidation(false);
            return;
        } else {
            item.style.border = "1px solid gray";
            validation = true;
            //setValidation(true);
        };
    });

    if (!validation) {
        return;
    };

    fetch(`${masterPath.url}/admin/usuario/buscar/${pegarElemento('#descCPFCNPJ').replace(/[.\-\/]/g, '')}`)
        .then((x) => x.json())
        .then((res) => {
            if (res.success) {
                setShowSpinner(true);
                cadastrarAnuncio(res.usuarios[0].codUsuario)
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
            "TipoUsuario": "3",
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
                console.log(res);
                setShowSpinner(false);
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
            descPromocao: "",
            descEmailComercial: buscarElemento("descEmailComercial"),
            descEmailRetorno: buscarElemento("descEmailRetorno"),
            descFacebook: "",
            descTweeter: "",
            descWhatsApp: buscarElemento("descWhatsApp"),
            descCEP: buscarElemento("descCEP"),
            descTipoPessoa: buscarElemento("descTipoPessoa-pf").checked ? "pf" : "pj",
            descCPFCNPJ: buscarElemento("descCPFCNPJ"),
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
            dtCadastro2: "2012-12-27T16:22:44.000Z",
            dtAlteracao: "2020-11-30T23:59:59.000Z",
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
                setShowSpinner(false);
                // Remover um item do localStorage
                localStorage.removeItem("imgname");
                //console.log(res)
                window.scrollTo({ top: 0, behavior: 'smooth' });


                setAlert(true);

                setTimeout(() => {
                    if (descontoAtivado && radioCheck == 3) {
                        window.location.href = `/ver-anuncios/${limparCPFouCNPJ(obj.descCPFCNPJ)}`;
                        console.log("1");
                    } else if (radioCheck == 1) {
                        window.location.href = `/ver-anuncios/${limparCPFouCNPJ(obj.descCPFCNPJ)}`;
                        console.log("2");
                    } else {
                        window.location.href = `https://mpago.la/1pWzL7A`;
                        console.log("3");
                    }
                }, 5000);

            });
    }




    function limparCPFouCNPJ(cpfOuCnpj) {
        return cpfOuCnpj.replace(/[.\-\/]/g, '');
    }

};