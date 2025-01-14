const xl = require('excel4node');
const fs = require('fs').promises;
const path = require('path');
const masterPath = require('../config/config');

module.exports = async function expExcel(dados, res) {
    //const wb = new xl.Workbook();
    const wb = new xl.Workbook();
    //const ws = wb.addWorksheet('espacos');

    let rowIndex = 2; // Início da contagem das linhas (assumindo 1 é o cabeçalho)
    let sheetIndex = 1; // Contador de abas
    let ws = wb.addWorksheet(`Sheet${sheetIndex}`); // Criando a primeira aba

    //console.log(dados)


    const headingColumnNames = [
        "COD",
        "COD_OR",
        "DUPLI",
        "CNPJ",
        "NOME",
        "TIPO",
        "CADERNO",
        "UF",
        "STATUS",
        /* "PAGAMENTO", */
        "DATA_PAG",
        "VALOR",
        "DESCONTO",
        "CAD. PARA CONF.",
        "CONFIRMADO",
        "DATA_FIM",
        "TEMP. VALE PR. TIPO",
        "ID",
        "USUARIO/DECISOR",
        "LOGIN",
        "SENHA",
        "EMAIL",
        "CONTATO",
        "LINK_PERFIL",
        "ATIVIDADE PRINCIPAL"
        
    ];

    const headerStyle = wb.createStyle({
        font: {
            bold: true,
            color: '#000000',
            size: 12,
        },
        fill: {
            type: 'pattern',
            patternType: 'solid',
            fgColor: 'ffff00',
        },
        alignment: {
            horizontal: 'center',
            vertical: 'center',
        },
    });

    let headingColumnIndex = 1;
    headingColumnNames.forEach(heading => {
        ws.cell(1, headingColumnIndex++).string(heading).style(headerStyle);
    });

    // Ajusta a largura das colunas
    ws.column(1).setWidth(10); // Coluna A
    ws.column(2).setWidth(10); // Coluna B
    ws.column(3).setWidth(10); // Coluna C
    ws.column(4).setWidth(15); // Coluna D
    ws.column(5).setWidth(30); // Coluna E
    ws.column(6).setWidth(10); // Coluna F
    ws.column(7).setWidth(15); // Coluna G
    ws.column(8).setWidth(15); // Coluna H
    ws.column(9).setWidth(15); // Coluna I
    ws.column(10).setWidth(20); // Coluna J
    ws.column(11).setWidth(30); // Coluna K
    ws.column(12).setWidth(30); // Coluna L
    ws.column(13).setWidth(15); // Coluna M
    ws.column(14).setWidth(45); // Coluna N
    ws.column(15).setWidth(30); // Coluna O
    ws.column(16).setWidth(30); // Coluna P

    //let rowIndex = 2;
    /*     dados.forEach(record => {
            console.log(record.dataValues)
            let columnIndex = 1;
            Object.keys(record.dataValues).forEach(columnName => {
                const value = record.dataValues[columnName];
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
        }); */




    dados.forEach((record, index) => {
        // Verifica se é necessário criar uma nova aba
        if ((index + 1) % 5000 === 0) {
            sheetIndex++;
            ws = wb.addWorksheet(`Sheet${sheetIndex}`); // Cria uma nova aba
            rowIndex = 2; // Reseta a contagem de linhas para a nova aba
        }

        ///console.log(record);

        /*       for (let key in record.dataValues) {
                  //console.log("key", key)
                  //newObj[key] = obj[key];
                  if (key === 'activate') {
                    //newObj['newProperty'] = 42; // Adiciona a nova propriedade após 'a'
                    console.log('adicionado', key)
                    record.dataValues.kledisom = '123'
                  }
                } */


        // Inserir uma nova propriedade após a propriedade 'a'
        let newObj = {};
        for (let key in record) {
            newObj[key] = record[key];
            if (key === 'activate') {
                newObj['dataPagamento'] = "Isento"; // Adiciona a nova propriedade após 'a'
                newObj['valor'] = "Isento";
            }
            if (key === 'descPromocao') {
                newObj['cad'] = record.createdAt;
            }
            if (key === 'dueDate') {
                newObj['tempValePrTipo'] = '';
            }
        }


        let columnIndex = 1;

        // Itera sobre os valores do registro e preenche as células
        Object.keys(newObj).forEach(columnName => {
            const value = newObj[columnName];

            //console.log(newObj)
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
/*         Object.keys(record.dataValues).forEach(columnName => {
            const value = record.dataValues[columnName];

            console.log(newObj)
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
 */
        rowIndex++; // Incrementa o índice da linha
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
    wb.write(newFilePath, function (err, stats) {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: "Erro ao gerar o arquivo." });
        } else {
            console.log("Arquivo gerado:", stats);
            return res.json({ success: true, message: "Exportação Finalizada", downloadUrl: `${masterPath.url}/export/arquivo.xlsx` });
        }
    });

}
