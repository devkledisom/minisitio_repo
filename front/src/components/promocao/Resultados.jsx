import { useEffect, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { masterPath } from "../../config/config";


import '../../assets/css/main.css';
import '../../assets/css/default.css';
import '../../assets/css/card.css';

import 'bootstrap/dist/css/bootstrap.min.css';
/* import 'font-awesome/css/font-awesome.min.css'; */
import { useBusca } from '../../context/BuscaContext';
import Cardlist from './Cardlist';

function Resultados() {

    const [anuncio, setAnuncio] = useState([]);
    const { result, setResult } = useBusca([]);
    const [promocoes, setPromocoes] = useState([]);

    const location = useLocation();
    const navigate = useNavigate();
    const paramBusca = location.state?.paramBusca
    const {caderno, estado} = useParams();

    useEffect(() => {

          fetch(`${masterPath.url}/read/promocao/${caderno}/${estado}`)
                  .then(x => x.json())
                  .then(res => {
                    if (res.success) {
                        console.log(res.promocoes)
                        setPromocoes(res.promocoes)
                    }
            
                  })
    }, [])

    var cidade = document.querySelector('#codUf3');
    return (
        <div className="resultados">
            <div className="container p-5">
                <div className='row text-start'>

                    <h4>Exibindo resultados que possui Promoção</h4>
                    <h6>Foram encontrados {promocoes.length} registros</h6>
                </div>
                <div className='row text-start mb-4'>
                    {promocoes.map((item) => (
                        <Cardlist promo={item} key={item.codAnuncio} caderno={item.caderno} codImg={item.banner} codCity={item.caderno} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Resultados;
