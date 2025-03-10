import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import Localidade from "../../components/Localidade";
import { masterPath } from "../../config/config";
import InputMask from 'react-input-mask';

//css
import '../../components/Modal/css/formChild.css';

//Components
import InputCpf from '../../components/InputCpf';
import AlertMsg from "../../components/Alerts/AlertMsg";

const DadosPessoais = (props) => {
  //state
  const [ufSelected, setUf] = useState(0);
  const [uf, setUfs] = useState([]);
  const [legenda, setLegenda] = useState(null);
  const [atividades, setAtividades] = useState();
  //const [cpf, setCPF] = useState('');
  const [alert, setAlert] = useState(false);
  const [user, setUser] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();

  const navigate = useNavigate();

  //ref
  const loadingButton = useRef();

  const { cpf } = useParams();

  const executarSelecao = () => {
    let codigoUf = document.querySelectorAll("#codUf6")[0].value;
    setUf(codigoUf);
  };

  useEffect(() => {
    //loadingButton.current.style.display = "block";

    let uf = document.querySelector("#codUf2").value;
    let caderno = document.querySelector("#codUf3").value;
/*     let uf = props.anuncios[0].codUf;
    let caderno = props.anuncios[0].codCaderno; */

    fetch(`${masterPath.url}/caderno/legenda/${uf}/${caderno}`)
      .then((x) => x.json())
      .then((res) => {
        if(res.length) {
          setLegenda(res[0].legenda);
        }
      });

    /*   const doc = searchParams.get('cpf');
      console.log(doc)
      setCPF(doc); */

/*     fetch(`${masterPath.url}/admin/usuario/buscar/${cpf}`)
      .then((x) => x.json())
      .then((res) => {
        //loadingButton.current.style.display = "none";
        setUser(res.usuarios[0]);
        setUf(res.usuarios[0].codUf);
      }); */



  }, []);


  function sendObj() {
    console.log("clicou", pegarElemento('#descNome'));
    const obj = {
      "TipoPessoa": pegarElemento('#descTipoPessoa-pf').checked ? "pf" : "pj",
      "CPFCNPJ": pegarElemento('#descCPFCNPJ').replace(/[.-]/g, ''),
      "Nome": pegarElemento('#descNome'),
      "Email": pegarElemento('#descEmail'),
      "senha": pegarElemento('#senha'),
      "hashCode": 0,
      "Value": 0,
      "TipoUsuario": pegarElemento('#codTipoUsuario'),
      "Telefone": pegarElemento('#descTelefone'),
      "RepresentanteConvenio": "default",
      "Endereco": pegarElemento('#descEndereco'),
      "Uf": pegarElemento('#codUf6'),
      "Cidade": pegarElemento('#codCidade7'),
      "Cadastro": 31323,
      "usuarioCod": 0,
      "dtCadastro2": "12-12-2012",
      "dtAlteracao": "12-12-2012",
      "ativo": "1"

    };




    //console.log(obj)

    /* fetch(`${masterPath.url}/admin/usuario/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(obj),
    })
      .then((x) => x.json())
      .then((res) => {
        if (res.success) {
          //cadastrarAnuncio(res.message.codUsuario)
          loadingButton.current.style.display = "none";
          setAlert(true);
        } else {
          loadingButton.current.style.display = "none";
          console.log("Esse usuário já está cadastrado!");
        }
        console.log(res);
      }); */



  }

  function pegarElemento(elemento) {
    return document.querySelector(elemento).value;
  };




  function limparCPFouCNPJ(cpfOuCnpj) {
    return cpfOuCnpj.replace(/[.-]/g, '');
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
        ...user,
        [name]: value,
        
    });
  }

  function atualizarLegenda(e) {
  
    const config = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "authorization": 'Bearer ' + masterPath.accessToken
      },
        body: JSON.stringify({legenda: legenda})
    };

    let uf = document.querySelector("#codUf2").value;
    let caderno = document.querySelector("#codUf3").value;

        fetch(`${masterPath.url}/caderno/legenda/${uf}/${caderno}`, config)
            .then((x) => x.json())
            .then((res) => {

              document.getElementById('listar').click();
                
            })

};


  return (
    <div className="content-child-form py-5 d-flex flex-column align-items-center" style={{margin: "auto"}}>
      <p>1 - Nesse campo você pode editar o texto de rodapé da página do caderno.</p>
      <textarea style={{width: '50%', height: '200px'}} value={legenda} onChange={(e) => setLegenda(e.target.value)}></textarea>
      <button className="my-2 px-2 btn btn-secondary" onClick={atualizarLegenda}>Salvar</button>
    </div>
  );
};

export default DadosPessoais;
