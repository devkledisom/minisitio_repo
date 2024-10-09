import React from "react";

function UserActions(props) {
    return (
        <div class="user-actions row linksUteis margin-top-20 hidden-print my-5">
            <div class="col-md-12">
                <a href="/area-assinante" class="btn btn-default margin-bottom-10">
                    <img src="/assets/img/logo.png" />
                    Atualizar
                </a>
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
                <a href="https://br.minisitio.net/resources/upload/beirute_115858.pdf" class="btn btn-danger margin-bottom-10 hidden-xs" target="_blank">
                    <img src="/assets/img/logo.png" />
                    Cartão Digital
                </a>
           {/*      <a href="https://api.whatsapp.com/send?text=https://br.minisitio.net/resources/upload/beirute_115858.pdf" class="btn btn-danger margin-bottom-10 visible-xs" target="_blank">
                    <img src="/assets/img/logo.png" />
                    Cartão Digital
                </a> */}
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