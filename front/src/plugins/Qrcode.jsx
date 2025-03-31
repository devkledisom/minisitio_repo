import React, { useEffect, useRef } from 'react';
import {useParams, useSearchParams} from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import '../assets/css/qrcode.css';
import { masterPath } from '../config/config';

function QRCodeGenerator() {
    const qrRef = useRef(null);

    const [searchParams] = useSearchParams();
    const imgParam = searchParams.get('image');
    const idParam = searchParams.get('id');

    // Função para imprimir o QR Code
    const handlePrint = () => {
        const canvas = qrRef.current.querySelector('canvas');
        const image = canvas.toDataURL('image/png');

        const printWindow = window.open('', '_blank');
        printWindow.document.write('<html><head><title>Imprimir QR Code</title></head><body>');
        printWindow.document.write('<div>' + qrRef.current.outerHTML + '</div>');
        printWindow.document.write(`<img src="${image}" alt="QR Code"/>`);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();

        console.log(image)
    };

    // Função para baixar o QR Code como imagem
    const handleDownload = () => {
        const canvas = qrRef.current.querySelector('canvas');
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = 'qrcode.png';
        link.click();
    };

    useEffect(() => {
        //console.log(`local/${encodeURIComponent(imgParam)}?id=${idParam}`)
    }, [])

    return (
        <div className='qrcode-container'>
            <div>
                <h1 className='no-print'>QR Code do Minisitio</h1>

                {/* Renderizar o QR Code com referência ao elemento */}
                <div ref={qrRef}>
                    <QRCodeCanvas value={`${masterPath.domain}/perfil/${idParam}`} size={420} />
                    {/* <QRCodeCanvas value={`${masterPath.domain}/perfil/${encodeURIComponent(imgParam)}?id=${idParam}`} size={420} /> */}
                </div>

                {/* Botões de ação */}
                <div className='no-print' style={{ marginTop: '20px' }}>
                    <button onClick={window.print} style={{ marginRight: '10px' }}>
                        Imprimir QR Code
                    </button>
                    <button onClick={handleDownload}>
                        Baixar QR Code
                    </button>
                </div>
            </div>
        </div>
    );
}

export default QRCodeGenerator;
