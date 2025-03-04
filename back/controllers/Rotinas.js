const database = require('../config/db');
const Sequelize = require('sequelize');


module.exports = {
    paginacaoDosCadernos: async () => {
        try {
            const query = `UPDATE anuncio
                            JOIN (
                                SELECT
                                    a.codAnuncio,
                                    CEIL(ROW_NUMBER() OVER (PARTITION BY a.codUf, a.codCaderno ORDER BY a.codAtividade ASC, a.createdAt DESC) / 10) AS page_number
                                FROM anuncio a
                                JOIN caderno c ON CAST(a.codUf AS CHAR) = c.UF AND a.codCaderno = c.nomeCaderno
                            ) AS temp ON anuncio.codAnuncio = temp.codAnuncio
                            SET anuncio.page = temp.page_number;
            `;

            const result = await database.query(query, {
                type: Sequelize.QueryTypes.UPDATE,
            });

            console.log(`Reorganização concluída para o estado:`, result);
        } catch (error) {
            console.error("Erro ao executar a reorganização:", error);
        }

    }
}
