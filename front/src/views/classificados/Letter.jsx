import { useEffect, useState } from 'react';
import { masterPath } from '../../config/config';
import '../../assets/css/letter.css';
import Marquee from "react-fast-marquee";

function Letter(props) {
    const [legenda, setLegenda] = useState("carregando...");
    const [contador, setContador] = useState(0);

    const arr = [
        "Texto 01 padrão usado pela prefeitura...",
        "Texto 02 padrão usado pela prefeitura...",
        "Texto 03 padrão usado pela prefeitura..."
    ];

    const concatenatedText = arr.join(" | ");

    useEffect(() => {
        let uf = document.querySelector("#codUf2").value;
        let caderno = document.querySelector("#codUf3").value;
        /*     let uf = props.anuncios[0].codUf;
            let caderno = props.anuncios[0].codCaderno; */

        fetch(`${masterPath.url}/caderno/legenda/${props.estado}/${props.caderno}`)
            .then((x) => x.json())
            .then((res) => {
                setLegenda(res[0].legenda);
            });
    }, [])

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
                <Marquee speed={60}>
                    {legenda}
                </Marquee>
                <div className="div-marquee marquee">
                    {/*     <span>{arr[0]}</span>
                    <span>{arr[1]}</span> */}
                    {/*   <span>{legenda}</span>
                    <span>{legenda}</span> */}
                    {/* <span>{arr[1]}</span> */}

                </div>
            </div>
        </div>
    );
}

export default Letter;
