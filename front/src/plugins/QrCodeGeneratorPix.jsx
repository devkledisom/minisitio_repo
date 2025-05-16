// src/components/QrCodeGenerator.jsx
import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

const QrCodeGeneratorPix = (props) => {
    const [text, setText] = useState(props.chave);

    return (
        <div style={{ textAlign: 'center', marginTop: '40px', width: '100%' }}>

            {/*     <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Digite o texto ou URL"
        style={{ padding: '8px', width: '300px' }}
      /> */}
            <div style={{ marginTop: '20px', position: "relative" }}>
                <QRCodeCanvas value={text} size={200} />
                <img
                    src="../assets/img/logo50.png"
                    alt="Logo"
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: 50,
                        height: 50,
                        transform: 'translate(-50%, -50%)',
                        borderRadius: '8px', // opcional: deixa a logo com bordas arredondadas
                        backgroundColor: '#fff', // para maior contraste
                        padding: 4
                    }}
                />
            </div>
            <span style={{fontSize: "25px"}}>Nome: {props.dono}</span>
            <p>Chave: {props.chave}</p>
        </div>
    );
};

export default QrCodeGeneratorPix;
