const contatoConfig = require('../../../models/table_contato_config');

module.exports = {
    atualizarContato: async (req, res) => {

        // Atualizar ao invés de criar
        try {
            const existing = await contatoConfig.findOne();
            if (existing) {
                await existing.update(req.body);

                res.status(200).json({ success: true, message: "Registro atualizado com sucesso!" });
            } else {
                await contatoConfig.create(req.body);
            }

        } catch (error) {
            console.error("Erro ao atualizar registro:", error);
            return res.status(400).json({ success: false, message: "Digite um email válido" });
        }



    },
    lerContato: async (req, res) => {
        try {
            const registro = await contatoConfig.findOne();
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