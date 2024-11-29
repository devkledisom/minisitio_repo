import React from 'react';
import { masterPath } from '../config/config';

function ShareButton(props) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Cartão Digital',
          text: 'Descrição do conteúdo para compartilhar.',
          url: `${masterPath.url}/files/3/${props.name}`,
        });
        //alert('Conteúdo compartilhado com sucesso!');
      } catch (error) {
        console.error('Erro ao compartilhar:', error);
      }
    } else {
      alert('A API de compartilhamento não é suportada neste dispositivo.');
    }
  };

  return (
    <div className='share'>
      {props.showBtn &&
        <button onClick={handleShare} className="btn btn-primary">
          Compartilhar
        </button>
      }
      {!props.showBtn &&
        <a class="dropdown-item" href="#" onClick={handleShare} style={{textDecoration: "none"}} >Compartilhar</a>
      }

    </div>


  );
}

export default ShareButton;
