const archiver = require('archiver');
const fs = require('fs');
const path = require('path');

module.exports = function archiverCompactor() {
    const output = fs.createWriteStream(path.join(__dirname, '../public/export/arquivo.zip'));//'arquivo.zip'
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
        console.log(`Arquivo ZIP criado com ${archive.pointer()} bytes`);
    });

    archive.on('error', err => {
        throw err;
    });

    archive.pipe(output);

    // Adicionando arquivos
    //archive.file('arquivo.txt', { name: 'arquivo.txt' });
    archive.directory(path.join(__dirname, '../public/export/caderno'), false); // Compacta todos os arquivos do diretório
    archive.finalize();
}