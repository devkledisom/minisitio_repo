import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';



import '../assets/css/main.css';
import '../assets/css/default.css';
import '../assets/css/card.css';

import 'bootstrap/dist/css/bootstrap.min.css';
/* import 'font-awesome/css/font-awesome.min.css'; */
import { useBusca } from '../context/BuscaContext';
import Cardlist from './Cardlist';
import Pagination from './Pagination';

function Resultados() {

    const [anuncio, setAnuncio] = useState([]);
    const [ qtdaResult, setQtdaResult] = useState(0);
    const { result, setResult } = useBusca([]);


    const location = useLocation();
    const navigate = useNavigate();
    const paramBusca = location.state?.paramBusca

    useEffect(() => {
        //console.log(result)
        let cadernoUf = sessionStorage.getItem("uf: ");
        let cadernoCidade = sessionStorage.getItem("caderno: ");

        const capas = [
        "ADMINISTRAÇÃO REGIONAL / PREFEITURA",
        "EMERGÊNCIA",
        "UTILIDADE PÚBLICA",
        "HOSPITAIS PÚBLICOS",
        "CÂMARA DE VEREADORES - CÂMARA DISTRITAL",
        "SECRETARIA DE TURISMO",
        "INFORMAÇÕES",
        "EVENTOS NA CIDADE"
        ]

        if(result.length < 1) return;

        if(result.data.length < 1) return;

        setQtdaResult(result.totalItem);

        if(result.data.length == 1) {

            if(capas.includes(result.data[0].codAtividade)) {
                navigate(`/caderno-geral/${encodeURIComponent(result.data[0].codCaderno)}/${cadernoUf}`);
            } else {
                navigate(`/caderno/${result.data[0].descAnuncio}?page=1&book=${result.data[0].codCaderno}&id=${result.data[0].codAnuncio}&index=${result.data[0].page}&caderno=${result.data[0].codCaderno}&estado=${cadernoUf}`);
            }


        }

        if(capas.includes(result.data[0].codAtividade)) {
            navigate(`/caderno-geral/${encodeURIComponent(result.data[0].codCaderno)}/${cadernoUf}`);
        } 


    }, [result])

    var cidade = document.querySelector('#codUf3');

    


    return (
        <div className="resultados">
            <div className="container p-5">
                <div className='row text-start'>

                    <h4>Exibindo resultados para: {paramBusca}</h4>
                    <h6>Foram encontrados {qtdaResult} registros</h6>
                </div>
                <div className='row text-start mb-4'>
                    {result.data &&
                    result.data.map((item) => (
                        <Cardlist anuncio={item} key={item.codAnuncio} caderno={cidade} codImg={item.descImagem} codCity={item.codCidade} />
                    ))}
                </div>
                {qtdaResult > 0 &&
                    <Pagination totalPages={result.totalPaginas} paginaAtual={result.paginaAtual} totalItem={result.totalItem} table={"results"} />

                }
            </div>
           
        </div>
    );
}

export default Resultados;
