import React, { useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import '../assets/css/adesivo.css';
import { masterPath } from '../config/config';
import html2canvas from 'html2canvas';

function Adesivo() {
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

    /*     // Função para baixar o QR Code como imagem
        const handleDownload = () => {
            const canvas = qrRef.current.querySelector('canvas');
            const image = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = image;
            link.download = 'qrcode.png';
            link.click();
        }; */

    // Função para baixar a imagem
    const handleDownload = async () => {
        const element = qrRef.current;

        // Usando html2canvas para capturar o elemento
        const canvas = await html2canvas(element);

        // Converte o canvas para uma imagem em formato de URL
        const dataUrl = canvas.toDataURL('image/png');

        // Cria um link temporário para baixar a imagem
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'qr_code_image.png'; // Nome do arquivo a ser baixado
        link.click();
    };

    useEffect(() => {
        console.log(`local/${encodeURIComponent(imgParam)}?id=${idParam}`)
    }, [])

    return (
        <div className='adesivo-container'>
            <div>
                <h1 className='no-print'>Gerar Adesivo</h1>

                {/* Renderizar o QR Code com referência ao elemento */}
                <div className="qr-code" ref={qrRef}>
                    <QRCodeCanvas value={`${masterPath.domain}/local/${idParam}`} size={175} />
                    {/* <QRCodeCanvas value={`${masterPath.domain}/local/${encodeURIComponent(imgParam)}?id=${idParam}`} size={175} /> */}
                    <img src="/assets/img/adesivo.jpg" width="650" alt="adesivo" />
                </div>

                {/* Botões de ação */}
                <div className='no-print' style={{ marginTop: '20px' }}>
                    <button onClick={window.print} style={{ marginRight: '10px' }}>
                        Imprimir Adesivo
                    </button>
                    <button onClick={handleDownload}>
                        Baixar Adesivo
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Adesivo;
