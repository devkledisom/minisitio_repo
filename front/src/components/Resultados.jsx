import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


import '../assets/css/main.css';
import '../assets/css/default.css';
import '../assets/css/card.css';

import 'bootstrap/dist/css/bootstrap.min.css';
/* import 'font-awesome/css/font-awesome.min.css'; */
import { useBusca } from '../context/BuscaContext';
import Cardlist from './Cardlist';

function Resultados() {

    const [anuncio, setAnuncio] = useState([]);
    const { result, setResult } = useBusca();

    const navigate = useNavigate();

    useEffect(() => {
        //console.log(result)
        let cadernoUf = sessionStorage.getItem("uf: ");
        let cadernoCidade = sessionStorage.getItem("caderno: ");
        console.log(result.length)
        if(result.length == 1) {
            navigate(`/caderno/${result[0].descAnuncio}?page=1&book=${result[0].codCaderno}&id=${result[0].codAnuncio}&caderno=${cadernoCidade}&estado=${cadernoUf}
`);
        }

    }, [])

    var cidade = document.querySelector('#codUf3');
    return (
        <div className="resultados">
            <div className="container p-5">
                <div className='row text-start'>

                    <h4>Exibindo resultados para:</h4>
                    <h6>Foram encontrados {result.length} registros</h6>
                </div>
                <div className='row text-start mb-4'>
                    {result.map((item) => (
                        <Cardlist anuncio={item} key={item.codAnuncio} caderno={cidade} codImg={item.descImagem} codCity={item.codCidade} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Resultados;
