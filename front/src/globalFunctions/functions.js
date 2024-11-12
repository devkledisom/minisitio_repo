import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import '../assets/css/PdfGenerator.css';

export function limparCPFouCNPJ(cpfOuCnpj) {
    if(cpfOuCnpj) {
        return cpfOuCnpj.replace(/[.\-\/]/g, '');
    }
   
}

export const generatePdf = () => {
    // Criar um elemento temporário para capturar o conteúdo
    const contentDiv = document.createElement("div");
    contentDiv.innerHTML ='';

    document.body.appendChild(contentDiv);

    html2canvas(contentDiv).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: [200, 110]
        });

        const linkText = "Clique aqui para mais informações";
        const linkX = (pdf.internal.pageSize.getWidth() - pdf.getTextWidth(linkText)) / 2; // Centraliza o link
        const linkY = 100; // Ajusta a posição Y conforme necessário

        pdf.text(linkText, linkX, linkY);
        pdf.link(linkX, linkY - pdf.getTextDimensions(linkText).h, pdf.getTextWidth(linkText), pdf.getTextDimensions(linkText).h, { url: 'https://example.com' });

        const imgWidth = 110;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

        // Gera o PDF como um blob para pré-visualização
        const pdfBlob = pdf.output("blob");
        const blobUrl = URL.createObjectURL(pdfBlob);
        window.open(blobUrl); // Abre em uma nova aba para pré-visualização

        // Remove o elemento temporário
        document.body.removeChild(contentDiv);
    });
};

export const generatePdfold = (props) => {
    // Criar um elemento temporário para capturar o conteúdo
    const contentDiv = document.createElement("div");
    contentDiv.innerHTML = `
    <style>
        .pdf-generator {
            display: flex;
            flex-direction: column;
            z-index: 0;
        }

        .pdf-generator>.container-fluid {
            /* width: 80%; */
        }

        .pdf-generator>.container-fluid>.cartao {
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .pdf-generator>.container-fluid>.cartao>.apoio {
            display: flex;
            justify-content: center;
            background-color: #303030;
            color: #FFFFFF;
            width: 100%;
            height: 100px;
        }

        .pdf-generator>.container-fluid>.cartao>.apoio>h2 {
            font-size: 80px;
            color: #FFFFFF;
        }

        .pdf-generator>.container-fluid>.cartao>.pdf-content {
            display: flex;
            align-items: center;
            height: 300px;
        }

        .pdf-generator>.container-fluid>.cartao>.pdf-content a {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        .pdf-generator>.container-fluid>.cartao>.pdf-content h2 {
            font-size: 50px;
        }

        .pdf-generator>.container-fluid>.cartao>.pdf-content i {
            font-size: 60px;
            color: #000;
        }

        .pdf-generator>.container-fluid>.cartao>.pdf-content p {
            display: flex;
            align-items: center;
            font-size: 35px;
        }

        .pdf-generator>.container-fluid>.cartao>.metadados {
            background-color: #ffcc29;
            padding: 10px;
            overflow: hidden;
            height: 2000px;
        }

        .pdf-generator>.container-fluid>.cartao>.metadados>div {
            border-bottom: 1px solid #000;
            padding: 10px;
            display: flex;
            align-items: center;
        }

        .pdf-generator>.container-fluid>.cartao>.metadados>div>i,
        .pdf-generator>.container-fluid>.cartao>.metadados>div>img {
            color: #0c0c0c;
            font-size: 60px;
            width: 60px;
            height: 60px;
        }

        .pdf-generator>.container-fluid>.cartao>.metadados>div>i {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-left: 0;
        }

        .pdf-generator>.container-fluid>.cartao>.metadados>.logo-minisistio>i>img {
            display: flex;
            width: 100%;
        }

        .pdf-generator>.container-fluid>.cartao>.metadados h4 {
            color: #000000;
            font-weight: 500;
            font-size: 40px;
        }

        .logo-pix {
            width: 100px !important;
        }
    </style>
    <div class="pdf-generator p-0">
        <div class="container-fluid">
            <div class="row p-0 cartao">
                <div class="apoio">
                    <h2>Nome da empresa</h2>
                </div>
                <div class="row pdf-content">
                    <div class="conteudo text-start webcardsimples">
                        <a href="/local/porto-velho/hotel avenida ii_327591">
                            <h2>${"props.data.descAnuncio"}</h2>
                            <p><i class="fa fa-map-marker"></i> ${"props.data.descEndereco"}</p>
                            <p><i class="fa fa-phone"></i> ${"props.data.descTelefone"}</p>
                        </a>
                    </div>
                </div>
                <div class="metadados">
                    <div class="col-md-12">
                        <i class="fa fa-info"></i>
                        <h4>Testes</h4>
                    </div>
                    <div class="col-md-12">
                        <i class="fa fa-map-marker"></i>
                        <h4>Endereço fake</h4>
                    </div>
                    <div class="col-md-12">
                        <i class="fa fa-phone"></i>
                        <h4>(xx) xxxx-xxxx</h4>
                    </div>
                    <div class="col-md-12">
                        <i class="fa fa-globe"></i>
                        <h4>
                            <a href="https://example.com" data-toggle="tooltip" title="Site">
                                https://example.com
                            </a>
                        </h4>
                    </div>
                    <div class="col-md-12 logo-minisistio">
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
    `;

    document.body.appendChild(contentDiv);

    html2canvas(contentDiv).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: [200, 110]
        });

        const linkText = "Clique aqui para mais informações";
        const linkX = (pdf.internal.pageSize.getWidth() - pdf.getTextWidth(linkText)) / 2; // Centraliza o link
        const linkY = 100; // Ajusta a posição Y conforme necessário

        pdf.text(linkText, linkX, linkY);
        pdf.link(linkX, linkY - pdf.getTextDimensions(linkText).h, pdf.getTextWidth(linkText), pdf.getTextDimensions(linkText).h, { url: 'https://example.com' });

        const imgWidth = 110;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

        // Gera o PDF como um blob para pré-visualização
        const pdfBlob = pdf.output("blob");
        const blobUrl = URL.createObjectURL(pdfBlob);
        window.open(blobUrl); // Abre em uma nova aba para pré-visualização

        // Remove o elemento temporário
        document.body.removeChild(contentDiv);
    });
};
