const instConfig = require('../../../models/table_inst_config');

module.exports = {
    atualizarRegistro: async (req, res) => {
        const existing = await instConfig.findOne();
        if (existing) {
            // Atualizar ao invés de criar
            await existing.update(req.body);

            res.status(200).json({ success: true, message: "Registro atualizado com sucesso!" });

        } else {
            await instConfig.create(req.body);
        }

    },
    lerRegistro: async (req, res) => {
        try {
            const registro = await instConfig.findOne();
            if (!registro) {
                return res.status(404).json({ success: false, message: "Registro não encontrado" });
            }
            res.status(200).json({ success: true, message: registro });
        } catch (error) {
            console.error("Erro ao ler registro:", error);
            res.status(500).json({ success: false, message: "Erro interno do servidor" });
        }
    }
}