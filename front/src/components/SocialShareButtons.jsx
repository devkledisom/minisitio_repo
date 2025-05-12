import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { masterPath } from '../config/config';
import '../assets/css/SocialShareButtons.css';


const socialMap = {
  whatsapp: {
    shareUrl: "https://wa.me/?text=",
    display: "share_whatsapp.svg",
    alter: "Whatsapp"
  },
  facebook: {
    shareUrl: "https://www.facebook.com/sharer/sharer.php?u=",
    display: "share_facebook.svg",
    alter: "Facebook"
  },
  twitter: {
    shareUrl: "https://twitter.com/intent/tweet?text=",
    display: "share_x.svg",
    alter: "Twitter"
  },
  linkedin: {
    shareUrl: "https://www.linkedin.com/shareArticle?mini=true&url=",
    display: "linkedin.png",
    alter: "Linkedin"
  }
}



function SocialShareButtons({ url }) {

  const [copied, setCopied] = useState(false);
  const shareLink = url;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink).then(() => {
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

  function openShareModal() {
    //const link = `${masterPath.url}/files/3/${encodeURIComponent(props.data.cartao_digital)}`;

    const styles = {
      display: "flex",
      flexDirection: "column"
    }

    const link = url;
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
  return (
    
    <ul className='social-share'>
     {/*  <li style={{ fontSize: "14px" }}><strong>Compartilhar em:</strong></li>
      {
        Object.entries(socialMap).map((item, keySocial) => (
          <li key={keySocial}>
            <a href={`${item[1].shareUrl}${encodeURIComponent(url)}`} target="_blank" rel='noopener noreferrer'>{
              <img src={`../assets/img/icon-share/${item[1].display}`} width={40} alt={item[1].alter} />
            }</a>
          </li>
        ))
      }
      <li>
        <button
          onClick={handleCopy}
          style={{
            backgroundColor: 'none',
            background: 'none',
            border: 'none',
          }}
         style={{
           padding: '10px 20px',
           backgroundColor: '#4CAF50',
           color: 'white',
           border: 'none',
           borderRadius: '5px',
           cursor: 'pointer'
         }} 
        >
          <img src="../assets/img/icons/icons8-copiar.gif" alt="copiar" />
          📋 Copiar link 
          Copiar
        </button>
        {copied && <span style={{ marginLeft: '10px', color: 'green' }}>Link copiado!</span>} */}
        <li>
        <button onClick={openShareModal} className='pulse-effect'>
          {/* <img src="../assets/img/icons/share1.png" alt="" width={50} /> */}
          <img src="../assets/img/icons/icons8-compartilhar-48 (1).png" alt="" width={50} /> 
          
        </button>
        

        {/* <span>compartilhar</span> */}
        
      </li>
    </ul>

  );
}

export default SocialShareButtons;
