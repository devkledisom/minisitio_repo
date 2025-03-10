import React from 'react';
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
    </ul>
  );
}

export default SocialShareButtons;
