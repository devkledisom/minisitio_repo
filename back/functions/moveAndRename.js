const fs = require('fs');

module.exports = function moveAndRename(caminhoAntigo, novoCaminho) {
     fs.rename(caminhoAntigo, novoCaminho, (err) => {
            if (err) {
                console.error('Erro ao mover/renomear:', err);
                return;
            }
            console.log('Arquivo movido e renomeado com sucesso!');
        });
}