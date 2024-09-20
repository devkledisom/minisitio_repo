const xl = require('excel4node');
const wb = new xl.Workbook();
const ws = wb.addWorksheet('espacos');
const masterPath = require('../config/config');

module.exports = function expExcel() {
    const data = [
        {
            name: "teste",
            email: "teste@hot.com",
            celular: "736478236"
        },
        {
            name: "person",
            email: "person@hot.com",
            celular: "736478236"
        }
    ];
    
    const headingColumnNames = [
        "nome",
        "email",
        "celular"
    ];
    
    let headingColumnIndex = 1;
    headingColumnNames.forEach(heading => {
        ws.cell(1, headingColumnIndex++).string(heading);
    });
    
    let rowIndex = 2;
    data.forEach(record => {
        let columnIndex = 1;
        Object.keys(record).forEach(columnName => {
            ws.cell(rowIndex, columnIndex++).string(record[columnName]);
        });
        rowIndex++;
    });
    
    wb.write('../public/export/arquivo.xlsx')
}
