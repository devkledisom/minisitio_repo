import React, {useEffect, useState} from "react";
import { masterPath } from '../../config/config';

//global functions
import { contadorVisualizacoes } from "../../globalFunctions/functions";

function CardClassificado(props) {
    //prefeitura_maceio_20180302_143719.jpg
    const [listaIds, setListaIds] = useState([]);
    const [parceiros, setParceiros] = useState([]);

    useEffect(() => {

   
            fetch(`${masterPath.url}/admin/desconto/read/all`)
                .then((x) => x.json())
                .then((res) => {
                    if (res.success) {
                        setListaIds(res.data);

                    } else {
                        console.error("encontrado na base de dados")
                    }

                })
  
        

                function buscarId() {
                    if(!props.data) return;
                    console.log(props.data.codDesconto)
                  let id = props.data.codDesconto
                const idEncontrado = listaIds.find(item => item.hash == id);
                console.log("kleidsom", id, idEncontrado)
                setParceiros(idEncontrado)
                return idEncontrado; 
              };

              buscarId()

    }, [props])


    const isValid = (value) => value !== 'null' && value !== '';
    const isValidPatrocinio = (value) => {
        if (value) {
            if (value.patrocinador_ativo === '1') {
                return true;
            }
        }
    };


    return (
        <>
            <li className="titulo titulo-cinza">
                <h2>{props.title}</h2>
            </li>
 
       

            {props.data != null && props.data.descImagem != null && props.data.descImagem != "teste" && props.data.descImagem != 0 ? (
                <li className="cartao">
                         {parceiros && isValidPatrocinio(parceiros) && (
                (isValid(parceiros.descImagem) ||
                    isValid(parceiros.descImagem2) ||
                    isValid(parceiros.descImagem3)) && (
                    <div className="apoio kledisom">
                        <div>
                            {[{ img: parceiros.descImagem, link: parceiros.descLink },
                            { img: parceiros.descImagem2, link: parceiros.descLink2 },
                            { img: parceiros.descImagem3, link: parceiros.descLink3 }]
                                .filter(item => item.img) // Filtra itens com imagem válida
                                .map((item, index) => (
                                    <a
                                        key={index}
                                        href={item.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <img src={`${masterPath.url}/files/${item.img}`} alt={`Parceiro ${index + 1}`} />
                                    </a>
                                ))}
                        </div>
                    </div>
                ))
            } 
                    <div className="conteudo" onClick={() => contadorVisualizacoes(masterPath.url, props.data.codAnuncio)}>
                        <a href={`${masterPath.domain}/perfil/${props.data.codAnuncio}`}>
                            <img src={`${masterPath.url}/files/${props.data.descImagem}`} alt={props.data.descAnuncio} />
                        </a>
                    </div>

                    <div className="links">
                        <ul className="list-inline">
                            <li className="pull-left">
                                <a href={`${masterPath.domain}/perfil/${props.data.codAnuncio}`} data-toggle="tooltip" title="Detalhes" >
                                    <img src="/assets/img/miniwebcard/link_detalhe.png" />
                                </a>
                            </li>
                            <li className="pull-right">
                                <a href="#" data-toggle="tooltip" title="SAC - Fale Comigo">
                                    <img src="/assets/img/miniwebcard/link_email.png" />
                                </a>
                            </li>
                        </ul>
                    </div>


                </li>
            ) : (
                <li className="cartao d-flex justify-content-center align-items-center">

                    <span>NÃO INFORMADO</span>


                </li>
            )}



            <li>

            </li>
        </>
    );
};

export default CardClassificado;