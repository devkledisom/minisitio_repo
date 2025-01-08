const xl = require('excel4node');
const fs = require('fs').promises;
const path = require('path');
const masterPath = require('../config/config');

module.exports = async function expExcel(dados, res, counts) {
    const wb = new xl.Workbook();
    const ws = wb.addWorksheet('cadernos');

    let newDados = dados.map((registro, i) => {

        const obj1 = counts.find(itemBasico => itemBasico.codCaderno == registro.nomeCaderno);
        const obj2 = counts.find(itemCompleto => itemCompleto.codCaderno == registro.nomeCaderno);

         registro.basico = obj1 ? obj1.basico : 0;
        registro.completo = obj2 ? obj2.completo : 0; 
        return registro;
    }); 

console.log(newDados);

    const headingColumnNames = [
            "codCaderno",
            "codUf",
            "UF",
            "nomeCaderno",
            "nomeCadernoFriendly",
            "descImagem",
            "cep_inicial",
            "cep_final",
            "isCapital",
            "basicos",
            "completos"
    ];

    let headingColumnIndex = 1;
    headingColumnNames.forEach(heading => {
        ws.cell(1, headingColumnIndex++).string(heading);
    });

    let rowIndex = 2;
    newDados.forEach(record => {
        let columnIndex = 1;
        Object.keys(record).forEach(columnName => {
            const value = record[columnName];
            if (value === null || value === undefined) {
                ws.cell(rowIndex, columnIndex++).string("0");
            } else if (typeof value === "string") {
                ws.cell(rowIndex, columnIndex++).string(value);
            } else if (typeof value === "number") {
                ws.cell(rowIndex, columnIndex++).number(value);
            } else {
                ws.cell(rowIndex, columnIndex++).string(value.toString());
            }
        });
        rowIndex++;
    });

    console.log("Gerando");

    const directoryPath = path.join(__dirname, `../public/export`);

    try {
        // Lê os arquivos existentes no diretório
        const files = await fs.readdir(directoryPath);
        console.log("Arquivos encontrados:", files);

        // Exclui o primeiro arquivo da lista, se existir
        if (files.length > 0) {
            const filePathToDelete = path.join(directoryPath, files[0]);
            await fs.unlink(filePathToDelete);
            console.log("Arquivo apagado:", filePathToDelete);
        }
    } catch (err) {
        console.error("Erro ao manipular arquivos:", err);
        return res.status(500).json({ success: false, message: "Erro ao processar a exportação." });
    }

    // Escreve o novo arquivo Excel
    const newFilePath = path.join(__dirname, `../public/export/arquivo.xlsx`);
    wb.write(newFilePath, function(err, stats) {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: "Erro ao gerar o arquivo." });
        } else {
            console.log("Arquivo gerado:", stats);
            return res.json({ success: true, message: "Exportação Finalizada", downloadUrl: `${masterPath.url}/export/arquivo.xlsx` });
        }
    });

}
