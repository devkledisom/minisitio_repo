import React, { useRef } from "react";

//GLOBAL FUNCTIONS
import { limparCPFouCNPJ, generatePdf } from "../globalFunctions/functions";
import PdfGenerator from "../plugins/PdfGenerator";
import { masterPath } from '../config/config';

function UserActions(props) {

    // Cria uma referência para o componente filho
    const pdfGeneratorRef = useRef();

    // Função para chamar o generatePdf no filho
    const handleGeneratePdf = () => {
        pdfGeneratorRef.current.generatePdf();
    };

    function gerarCartaoDigital(event) {
        event.preventDefault()
        fetch(`${masterPath.url}/cartao-digital?espaco=${props.url}&id=${props.id}`)
            .then(x => x.json())
            .then(res => {
                if(res.success) {
                    window.open(res.url, '_blank');
                    console.log("resultado",res)
                }
                
            })
    };

    return (
        <div class="user-actions row linksUteis margin-top-20 hidden-print my-5">
            <div class="col-md-12">
                {/*        <a href={`/ver-anuncios/${limparCPFouCNPJ(props.doc)}`} class="btn btn-default margin-bottom-10">
                    <img src="/assets/img/logo.png" />
                    Atualizar
                </a> */}
                <a href="/area-assinante" class="btn btn-default margin-bottom-10">
                    <img src="/assets/img/logo.png" />
                    Renovar
                </a>
                <a href={`/qrcode?image=${props.path}&id=${props.id}`} class="btn btn-default margin-bottom-10" target="_blank">
                    <img src="/assets/img/logo.png" />
                    QR CODE
                </a>
                <a href="/adesivo?image=qrcode_beirute_115858.png" class="btn btn-default margin-bottom-10" target="_blank">
                    <img src="/assets/img/logo.png" />
                    Adesivo
                </a>
                <a href="#" class="btn btn-danger margin-bottom-10 hidden-xs" target="_blank" onClick={gerarCartaoDigital}>
                    <img src="/assets/img/logo.png" />
                    Cartão Digital
                </a>
                <a href="/contato" class="btn btn-default margin-bottom-10">
                    <img src="/assets/img/logo.png" />
                    Denúncia
                </a>
                <a href="javascript:;" class="btn btn-default area-master" title="MARCOS QUIMAS">
                    <div class="master-icone">
                        <span>Master:</span>
                        <img src="/assets/img/logo.png" />
                    </div>
                    <div class="master-descricao">
                        MARCOS QUIMAS
                    </div>
                </a>
            </div>
        </div>
    )
};

export default UserActions;