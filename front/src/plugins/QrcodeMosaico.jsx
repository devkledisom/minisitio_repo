import React, { useEffect, useRef } from 'react';
import {useParams, useSearchParams} from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import '../assets/css/qrcodemosaico.css';
import { masterPath } from '../config/config';

function QrcodeMosaico(props) {
    const qrRef = useRef(null);

    const [searchParams] = useSearchParams();
    const imgParam = searchParams.get('image');
    const {nomeAnuncio} = useParams();
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
        //console.log(`local/${encodeURIComponent(nomeAnuncio)}?id=${idParam}`, nomeAnuncio)
    }, [])

    return (
        <div className='qrcode-container-mosaico'>
            <div>
                {/* <h1 className='no-print'>Gerar QR Code</h1> */}

                {/* Renderizar o QR Code com referência ao elemento */}
                <div ref={qrRef} className='d-flex py-2'>
                    <QRCodeCanvas value={props.nmAnuncio} size={114} />
                    {/* <QRCodeCanvas value={`https://minisitio.online/perfil/${encodeURIComponent(nomeAnuncio)}?id=${idParam}`} size={114} /> */}
                </div>

                {/* Botões de ação */}
                {/* <div className='no-print' style={{ marginTop: '20px' }}>
                    <button onClick={window.print} style={{ marginRight: '10px' }}>
                        Imprimir QR Code
                    </button>
                    <button onClick={handleDownload}>
                        Baixar QR Code
                    </button>
                </div> */}
            </div>
        </div>
    );
}

export default QrcodeMosaico;
