import React, { useRef, useState, useEffect } from "react";
import Swal from 'sweetalert2';

import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';

//FUNCTIONS
import useIsMobile from '../admin/functions/useIsMobile';

//GLOBAL FUNCTIONS
import { limparCPFouCNPJ, generatePdf } from "../globalFunctions/functions";
import PdfGenerator from "../plugins/PdfGenerator";
import { masterPath } from '../config/config';
import 'bootstrap/dist/css/bootstrap.min.css';
import ShareButton from "./ShareButton";

function UserActions(props) {
    const [docState, setDocState] = useState(props.doc);
    const [master, setMaster] = useState(null);
    const [suportWebShare, setSuportWebShare] = useState(false);

    useEffect(() => {
        setDocState(props.doc);

        fetch(`${masterPath.url}/admin/desconto/edit/${props.data.codDesconto}`)
            .then((x) => x.json())
            .then((res) => {
                if (props.data.codDesconto > 0) {
                    fetch(`${masterPath.url}/admin/usuario/edit/${res[0].idUsuario}`)
                        .then((x) => x.json())
                        .then((res) => {
                            setMaster(res.descNome);
                        }).catch((err) => {
                            console.log(err);
                        })
                }
            }).catch((err) => {
                console.log(err)
            })

        if (navigator.share) {
            // Suportado
            setSuportWebShare(true)
        }

    })

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
                if (res.success) {
                    window.open(res.url, '_blank');
                }

            })
    };

    function openShareModal() {
        const link = `${masterPath.url}/files/3/${encodeURIComponent(props.data.cartao_digital)}`;
        Swal.fire({
            title: 'Compartilhar Cartão Digital',
            html: `
                <div style="display: flex; flex-direction: row; align-items: center; justify-content: center; gap: 30px;" class="cart-digital-modal">
                    <a href="https://api.whatsapp.com/send?text=${link}" target="_blank" class="mb-2 d-flex flex-column align-items-center" style="gap: 10px;">
                        <img src="../assets/img/icon-share/share_whatsapp.svg" width="80" alt="whatsapp" />    
                        Compartilhar no WhatsApp
                    </a>
                    <a href="https://www.facebook.com/sharer/sharer.php?u=${link}" target="_blank" class="mb-2 d-flex flex-column align-items-center" style="gap: 10px;">
                        <img src="../assets/img/icon-share/share_facebook.svg" width="80" alt="facebook" />
                        Compartilhar no Facebook
                    </a>
                    <a href="https://twitter.com/intent/tweet?url=${link}" target="_blank" class="mb-2 d-flex flex-column align-items-center" style="gap: 10px;">
                        <img src="../assets/img/icon-share/share_x.svg" width="80" alt="x" />    
                        Compartilhar no Twitter
                    </a>
                    <a href="https://www.linkedin.com/shareArticle?url=${link}" target="_blank" class="mb-2 d-flex flex-column align-items-center" style="gap: 10px;">
                        <img src="../assets/img/icon-share/linkedin.png" width="80" alt="linkedin" style="border-radius: 100%;" />    
                        Compartilhar no LinkedIn
                    </a>
                </div>
            `,
            width: "50%",
            showCloseButton: true,
            showConfirmButton: false,
        });
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(props.urlShare).then(() => {
            Swal.fire({
                toast: true,
                position: "top-end",
                icon: "success",
                title: "Link copiado!",
                showConfirmButton: false,
                timer: 2000
            });
            /*  setCopied(true);
             setTimeout(() => setCopied(false), 2000); */
        });
    };

    function openShareModalPerfil(e) {
        //const link = `${masterPath.url}/files/3/${encodeURIComponent(props.data.cartao_digital)}`;
        e.preventDefault();
        const styles = {
            display: "flex",
            flexDirection: "column"
        }

        const link = props.urlShare;
        Swal.fire({
            title: 'Compartilhe Seu Minisitio',
            html: `
                      <div style="" class="cart-digital-modal py-3">
                          <a href="https://api.whatsapp.com/send?text=${link}" target="_blank" class="mb-2 d-flex flex-column align-items-center" style="gap: 10px;">
                              <img src="../assets/img/icon-share/share_whatsapp.svg" width="80" alt="whatsapp" />    
                              Compartilhar no WhatsApp
                          </a>
                          <a href="https://www.facebook.com/sharer/sharer.php?u=${link}" target="_blank" class="mb-2 d-flex flex-column align-items-center" style="gap: 10px;">
                              <img src="../assets/img/icon-share/share_facebook.svg" width="80" alt="facebook" />
                              Compartilhar no Facebook
                          </a>
                          <a href="https://twitter.com/intent/tweet?url=${link}" target="_blank" class="mb-2 d-flex flex-column align-items-center" style="gap: 10px;">
                              <img src="../assets/img/icon-share/share_x.svg" width="80" alt="x" />    
                              Compartilhar no Twitter
                          </a>
                          <a href="https://www.linkedin.com/shareArticle?url=${link}" target="_blank" class="mb-2 d-flex flex-column align-items-center" style="gap: 10px;">
                              <img src="../assets/img/icon-share/linkedin.png" width="80" alt="linkedin" style="border-radius: 100%;" />    
                              Compartilhar no LinkedIn
                          </a>
                          <div class="mb-2 d-flex flex-column align-items-center" style="gap: 6px;">
                             <button
                                id="copyBtn"
                                style="border-radius: 100%; padding: 10px"
                                >
                                <img src="../assets/img/icons/icons8-copiar.gif" alt="copiar" width="60" />
              
                               </button>
                                Copiar
                          </div>
                         
                      </div>
                  `,
            width: "50%",
            showCloseButton: true,
            showConfirmButton: false,
            didOpen: () => {
                document.getElementById('copyBtn')?.addEventListener('click', handleCopy);
            }
        });
    }


    const handleShare = async (e) => {
        const shareData = {
            title: 'Compartilhe seu Minisitio',
            text: 'Mostre a todos o seu perfil digital',
            url: props.urlShare
        };
        // Fallback para WebView Android via bridge nativa
/*         if (window.AndroidShare && typeof window.AndroidShare.share === 'function') {
            window.AndroidShare.share(shareData.text, shareData.title, shareData.url);
            return { ok: true, via: 'android' };
        }


        if (Capacitor.isNativePlatform()) {
            // Rodando dentro do app (Capacitor)
            await Share.share({
                ...shareData,
                dialogTitle: 'Compartilhar'
            });
        } */


        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Compartilhe seu Minisitio',
                    text: 'Mostre a todos o seu perfil digital',
                    url: props.urlShare,
                });
                //alert('Conteúdo compartilhado com sucesso!');
            } catch (error) {
                console.error('Erro ao compartilhar:', error);
            }
        } else {
            e.preventDefault();
            const styles = {
                display: "flex",
                flexDirection: "column"
            }

            const link = props.urlShare;
            Swal.fire({
                title: 'Compartilhe Seu Minisitio',
                html: `
                      <div style="" class="cart-digital-modal py-3">
                          <a href="https://api.whatsapp.com/send?text=${link}" target="_blank" class="mb-2 d-flex flex-column align-items-center" style="gap: 10px;">
                              <img src="../assets/img/icon-share/share_whatsapp.svg" width="80" alt="whatsapp" />    
                              WhatsApp
                          </a>
                          <a href="https://www.facebook.com/sharer/sharer.php?u=${link}" target="_blank" class="mb-2 d-flex flex-column align-items-center" style="gap: 10px;">
                              <img src="../assets/img/icon-share/share_facebook.svg" width="80" alt="facebook" />
                              Facebook
                          </a>
                          <a href="https://twitter.com/intent/tweet?url=${link}" target="_blank" class="mb-2 d-flex flex-column align-items-center" style="gap: 10px;">
                              <img src="../assets/img/icon-share/share_x.svg" width="80" alt="x" />    
                              Twitter
                          </a>
                          <a href="https://www.linkedin.com/shareArticle?url=${link}" target="_blank" class="mb-2 d-flex flex-column align-items-center" style="gap: 10px;">
                              <img src="../assets/img/icon-share/linkedin.png" width="80" alt="linkedin" style="border-radius: 100%;" />    
                              LinkedIn
                          </a>
                          <div class="mb-2 d-flex flex-column align-items-center" style="gap: 10px;">
                             <button
                                id="copyBtn"
                                style="border-radius: 100%"
                                >
                                <img src="../assets/img/icons/icons8-copiar.gif" alt="copiar" style="height: 60px; width: 60px; background-color: gold;
    border-radius: inherit;
    padding: 6px;" />

                               </button>
                                Copiar
                          </div>
                         
                      </div>
                  `,
                width: "50%",
                showCloseButton: true,
                showConfirmButton: false,
                didOpen: () => {
                    document.getElementById('copyBtn')?.addEventListener('click', handleCopy);
                }
            });
        }
    };


    return (
        <div class="user-actions row linksUteis margin-top-20 hidden-print my-5">
            <div class="col-md-12">
                <a href={`/ver-anuncios/${limparCPFouCNPJ(docState)}`} class="btn btn-default margin-bottom-10">
                    <img src="/assets/img/logo.png" />
                    Atualizar
                </a>
                <a href={`/renovar/perfil/${props.id}`} class="btn btn-default margin-bottom-10">
                    <img src="/assets/img/logo.png" />
                    Renovar
                </a>
                {/* console.log(useIsMobile()) */}
                {useIsMobile() &&
                    <a href="#" class="btn btn-default margin-bottom-10" onClick={(e) => handleShare(e)}>
                        <img src="/assets/img/logo.png" />
                        Compartilhar
                    </a>
                }
                {!useIsMobile() &&
                    <a href="#" class="btn btn-default margin-bottom-10" onClick={(e) => openShareModalPerfil(e)}>
                        <img src="/assets/img/logo.png" />
                        Compartilhar
                    </a>
                }
                <a href={`/qrcode?id=${props.id}`} class="btn btn-default margin-bottom-10" target="_blank">
                    <img src="/assets/img/logo.png" />
                    QR CODE
                </a>
                {/*     <a href={`/qrcode?image=${props.path}&id=${props.id}`} class="btn btn-default margin-bottom-10" target="_blank">
                    <img src="/assets/img/logo.png" />
                    QR CODE
                </a> */}
                <a href={`/adesivo?image=${props.data.descAnuncio}&id=${props.data.codAnuncio}`} class="btn btn-default margin-bottom-10" target="_blank">
                    <img src="/assets/img/logo.png" />
                    Adesivo
                </a>
                {(props.data.cartao_digital != "" || props.data.cartao_digital != 0) &&
                    /*       <a href={`${masterPath.url}/files/3/${props.data.cartao_digital}`} class="btn btn-danger margin-bottom-10 hidden-xs" target="_blank">
                              <img src="/assets/img/logo.png" />
                              Cartão Digital
                          </a> */
                    <div class="dropdown">
                        <button class="btn btn-danger dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                            <img src="/assets/img/logo.png" />
                            Cartão Digital
                            <i class="bi bi-chevron-down"></i>
                        </button>
                        <ul class="dropdown-menu lista-cart" aria-labelledby="dropdownMenuButton1">
                            <li><a class="dropdown-item" href={`${masterPath.url}/files/3/${props.data.cartao_digital}`} target="_blank" rel="noopener noreferrer">Visualizar</a></li>
                            {/*  <li><ShareButton showBtn={false} url={`${masterPath.url}/files/3/`} name={encodeURIComponent(props.data.cartao_digital)} /></li> */}
                            <li><button class="dropdown-item" onClick={openShareModal}>Compartilhar</button></li>
                        </ul>
                    </div>

                }

                {(props.data.cartao_digital == "" || props.data.cartao_digital == 0) &&
                    <a href="#" class="btn btn-danger margin-bottom-10 hidden-xs">
                        <img src="/assets/img/logo.png" />
                        Cartão Digital
                    </a>

                }



                <a href="/contato" class="btn btn-default margin-bottom-10">
                    <img src="/assets/img/logo.png" />
                    Denúncia
                </a>
                <a href="javascript:;" class="btn btn-default area-master">
                    <div class="master-icone">
                        <span>Master:</span>
                        <img src="/assets/img/logo.png" />
                    </div>
                    <div class="master-descricao">
                        {master}
                    </div>
                </a>
            </div>
        </div>
    )
};

export default UserActions;