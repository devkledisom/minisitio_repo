import React from 'react';
import '../assets/css/helptip.css'; // Assumindo que o CSS esteja em um arquivo separado

function HelpTip() {
  return (
    <div>     
      {/* O span com o "?" e a descrição */}
      <span className="helptip">?
        <span className="helptiptext">Digite seu nome completo aqui.</span>
      </span>
    </div>
  );
}

export default HelpTip;
