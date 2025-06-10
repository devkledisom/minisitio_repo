const xl = require('excel4node');
const fs = require('fs').promises;
const path = require('path');
const masterPath = require('../config/config');

module.exports = async function expExcel(dados, res) {

    const wb = new xl.Workbook();
    const ws = wb.addWorksheet('IDS');

    console.log(dados)

    // Adiciona estilos personalizados
    const headerStyle = wb.createStyle({
        font: {
            bold: true,
            color: '#FFFFFF',
            size: 12,
        },
        fill: {
            type: 'pattern',
            patternType: 'solid',
            fgColor: '#4CAF50',
        },
        alignment: {
            horizontal: 'center',
            vertical: 'center',
        },
    });

    /*     const headingColumnNames = [
            "atividade",
            "ativo",
            "borda",
            "borda2",
            "descImagem",
            "descImagem2",
            "descImagem3",
            "descLink",
            "descLink2",
            "descLink3",
            "descPromocao",
            "desconto",
            "descricao",
            "dtCadastro",
            "hash",
            "idDesconto",
            "idUsuario",
            "patrocinador_ativo",
            "saldo",
            "userType",
            "utilizar_saldo",
        ]; */
    const headingColumnNames = [
        "nmUsuario",
        "desconto",
        "hash",
        "descricao",
        "dtCadastro",
        "saldo",
        "qtdaGeral"
    ];

    let headingColumnIndex = 1;
    headingColumnNames.forEach(heading => {
        ws.cell(1, headingColumnIndex++).string(heading).style(headerStyle);
    });

    // Ajusta a largura das colunas
    ws.column(1).setWidth(40); // Coluna A
    ws.column(2).setWidth(10); // Coluna B
    ws.column(3).setWidth(40); // Coluna C
    ws.column(4).setWidth(30); // Coluna C
    ws.column(5).setWidth(30); // Coluna C

    let rowIndex = 2;
    dados.forEach((record, index) => {
        let columnIndex = 1;
        Object.keys(record).forEach((columnName) => {

            //console.log(typeof(record[columnName]), record[columnName])

            const value = record[columnName];

            if (headingColumnNames.includes(columnName)) {
                //console.log(value)
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

            }

            /*           if (typeof (record[columnName]) == "string") {
                          //console.log(typeof(record[columnName]))
                          ws.cell(rowIndex, columnIndex++).string(record[columnName]);
                      } else {
                          ws.cell(rowIndex, columnIndex++).number(record[columnName]);
                      };
          
                      if (typeof (record[columnName]) == null) {
                          console.log(typeof(record[columnName]), record[columnName])
                          ws.cell(rowIndex, columnIndex++).string("0");
                      }  */



        });
        rowIndex++;

        /* if (dados.length == index + 1) {
            res.json({ success: true, message: "Exportação Finalizada", downloadUrl: `${masterPath.url}/export/arquivo.xlsx` });
        }; */
    });

    console.log("gerando")

    //wb.write(path.join(__dirname, '../public/export/arquivo.xlsx'));

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
