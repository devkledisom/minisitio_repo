import React, {useState} from 'react';
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
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <ul className='social-share'>
      <li style={{fontSize: "14px"}}><strong>Compartilhar em:</strong></li>
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
       /*  style={{
          padding: '10px 20px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }} */
      >
        <img src="../assets/img/icons/icons8-copiar.gif" alt="copiar"/>
        {/* 📋 Copiar link */}
        Copiar
      </button>
      {copied && <span style={{ marginLeft: '10px', color: 'green' }}>Link copiado!</span>}
      </li>
    </ul>
  );
}

export default SocialShareButtons;
