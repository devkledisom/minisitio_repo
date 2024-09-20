import { useEffect, useState } from 'react';
import { masterPath } from '../../config/config';
import '../../assets/css/letter.css';

function Letter(props) {
    const [legenda, setLegenda] = useState("carregando...");
    const [contador, setContador] = useState(0);

    const arr = [
        "Texto 01 padrão usado pela prefeitura...",
        "Texto 02 padrão usado pela prefeitura...",
        "Texto 03 padrão usado pela prefeitura..."
    ];

    const concatenatedText = arr.join(" | ");

    /*   useEffect(() => {
        const interval = setInterval(() => {
          setLegenda(arr[(contador + 1) % arr.length]);
          setContador((contador + 1) % arr.length);
        }, 9000);
    
        return () => clearInterval(interval); // Limpa o intervalo quando o componente desmonta
      }, [contador, arr]); // Dependências: contador e arr */

    return (
        <div className="letter">
            <div className="letter-div">
                <div className="div-marquee marquee">
                    <span>{arr[0]}</span>
                    <span>{arr[1]}</span>
                </div>
            </div>
        </div>
    );
}

export default Letter;
