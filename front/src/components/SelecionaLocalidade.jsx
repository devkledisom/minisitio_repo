import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/css/main.css';
import '../assets/css/default.css';

import { masterPath } from '../config/config';
import { useBusca } from '../context/BuscaContext';

function SelecionaLocalidade(props) {

    const navigate = useNavigate();
    const [ufSelected, setUf] = useState(0);
    const [uf, setUfs] = useState([]);
    const [caderno, setCaderno] = useState([]);
  
    const { result, setResult } = useBusca();

    const executarSelecao = () => {
        let codigoUf = document.querySelectorAll('#codUf2')[0].value;
        setUf(codigoUf);
    };

    useEffect(() => {
        fetch(`${masterPath.url}/cadernos`)
            .then((x) => x.json())
            .then((res) => {
                setCaderno(res)
                //console.log(res)
            })
        fetch(`${masterPath.url}/ufs`)
            .then((x) => x.json())
            .then((res) => {
                setUfs(res);
                //console.log(res)
            })

    }, []);

    const fetchAnuncios = async () => {
        try {
            const uf = document.querySelector('#codUf2').value;
            const codigoCaderno = document.querySelector('#codUf3').value;
            const valor_da_busca = document.querySelector('#inputBusca').value;

            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "uf": "11",
                    "cidade": "ALTA FLORESTA D'OESTE",
                    "atividade": valor_da_busca,
                    "name": "mycardcity",
                    "telefone": "(61) 3255-1285",
                    "nu_documento": "23.707.648/0001-99",
                    "codigoCaderno": codigoCaderno
                })
            };

            const request = await fetch(`${masterPath.url}/buscar`, options).then((x) => x.json())
            //setAnuncio(request)
            setResult(request)

            if (props.paginaAtual === "home" || props.paginaAtual === "caderno") {
                navigate("/buscar");
            }

            console.log(result)

        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
        }
    };



    return (
        <div>
{uf.map((item) => (
                                                <option id={item.id_uf} key={item.id_uf} value={item.id_uf}>{item.sigla_uf}</option>
                                            ))}
        </div>
 
                                            
                      

    )

};

export default SelecionaLocalidade;

