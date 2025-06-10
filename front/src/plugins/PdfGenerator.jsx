import React, { useRef, useImperativeHandle, forwardRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import '../assets/css/PdfGenerator.css';

// Usa forwardRef para permitir que o pai acesse a função do filho
const PdfGenerator = forwardRef((props, ref) => {
    const contentRef = useRef();

    // Função que será exposta para o componente pai
    useImperativeHandle(ref, () => ({
        generatePdf() {
            const input = contentRef.current;
            console.log(input)

            html2canvas(input).then((canvas) => {
                const imgData = canvas.toDataURL("image/png");
                const pdf = new jsPDF({
                    orientation: "portrait",
                    unit: "mm",
                    format: [200, 110]
                });

                const linkText = "Clique aqui para mais informações";
                const linkX = (pdf.internal.pageSize.getWidth() - pdf.getTextWidth(linkText)) / 2;
                const linkY = 100;

                pdf.text(linkText, linkX, linkY);
                pdf.link(linkX, linkY - pdf.getTextDimensions(linkText).h, pdf.getTextWidth(linkText), pdf.getTextDimensions(linkText).h, { url: 'https://example.com' });

                const imgWidth = 110;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

                const pdfBlob = pdf.output("blob");
                const blobUrl = URL.createObjectURL(pdfBlob);
                window.open(blobUrl);
            });
        }
    }));

    return (
        <div className="pdf-generator p-0" ref={contentRef}>
            {/* Conteúdo do PDF */}
            <div className='container-fluid'>
                <div className='row p-0 cartao'>
                    <div className="apoio">
                        <h2>Nome da empresa</h2>
                    </div>
                    <div className="row pdf-content">
                        <div class="conteudo text-start webcardsimples">
                            <a href="/local/porto-velho/hotel avenida ii_327591">
                                <h2>{"props.data.descAnuncio"}</h2>
                                <p><i className="fa fa-map-marker"></i>{"props.data.descEndereco"}</p>
                                <p><i className="fa fa-phone"></i>{"props.data.descTelefone"}</p>
                            </a>
                        </div>
                    </div>
                    <div className="metadados">
                        <div className="col-md-12">
                            <i className="fa fa-info"></i>
                            <h4>testes</h4>
                        </div>
                        <div className="col-md-12">
                            <i className="fa fa-map-marker"></i>
                            <h4>endereco fake</h4>
                        </div>
                        <div className="col-md-12">
                            <i className="fa fa-phone"></i>
                            <h4>(xx) xxxx-xxxx</h4>
                        </div>
                        <div className="col-md-12">
                            <i className="fa fa-globe"></i>
                            <h4>
                                <a href="" data-toggle="tooltip" title="Site">meu site</a>
                            </h4>
                        </div>
                        <div className="col-md-12 logo-minisistio">
                            <i>
                                <img src="/assets/img/logo.png" alt="" />
                            </i>
                            <h4>
                                <a href="https://example.com" data-toggle="tooltip" title="Site">
                                    https://example.com
                                </a>
                            </h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default PdfGenerator;
