const xl = require('excel4node');
const path = require('path');
const masterPath = require('../config/config');

module.exports = function expExcel(dados, res) {
    const wb = new xl.Workbook();
    const ws = wb.addWorksheet('atividades');
    //console.log(dados)

    const headingColumnNames = [
        "id",
        "atividade",
        "atividadeAmigavel",
        "corTitulo"
    ];

    let headingColumnIndex = 1;
    headingColumnNames.forEach(heading => {
        ws.cell(1, headingColumnIndex++).string(heading);
    });

    let rowIndex = 2;
    dados.forEach((record, index) => {
        let columnIndex = 1;
        Object.keys(record).forEach((columnName) => {

            //console.log(typeof(record[columnName]), record[columnName])

            const value = record[columnName];

            if (value === null || value === undefined) {
                ws.cell(rowIndex, columnIndex++).string("0");
            } else if (typeof value === "string") {
                ws.cell(rowIndex, columnIndex++).string(value);
            } else if (typeof value === "number") {
                ws.cell(rowIndex, columnIndex++).number(value);
            } else {
                // Opcional: Se você tiver outros tipos de dados para lidar
                ws.cell(rowIndex, columnIndex++).string(value.toString());
            }

        });
        rowIndex++;

        if (dados.length == index + 1) {
            res.json({ success: true, message: "Exportação Finalizada", downloadUrl: `${masterPath.url}/export/arquivo.xlsx` });
        };
    });

    console.log("gerando")

    wb.write(path.join(__dirname, '../public/export/arquivo.xlsx'));

}
