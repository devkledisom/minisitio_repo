const xl = require('excel4node');
const fs = require('fs');

async function convertTxtToExcel() {
    const filePath = 'dados.txt';
    const wb = new xl.Workbook();
    const ws = wb.addWorksheet('Dados');

    const data = fs.readFileSync(filePath, 'utf8').split('\n');
    data.forEach((line, index) => {
        const values = line.split(';'); // Assume que os dados estão separados por ';'
        values.forEach((value, colIndex) => {
            ws.cell(index + 1, colIndex + 1).string(value.trim());
        });
    });

    wb.write('dados.xlsx', (err) => {
        if (err) console.error('Erro ao gerar Excel:', err);
        else console.log('Excel gerado com sucesso!');
    });
}
