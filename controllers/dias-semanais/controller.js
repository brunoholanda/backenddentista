const DiaSemanal = require('../../models/DiasSemanais');  // Modifique este caminho para apontar para o modelo que você acabou de criar

const diasSemanaisController = {};

diasSemanaisController.createDiaSemanal = async (req, res) => {
    const { dia, ativo } = req.body;
    try {
        const diaSemanal = await DiaSemanal.create({ dia, ativo });
        res.status(201).json(diaSemanal);
    } catch (err) {
        console.error("Erro ao criar dia da semana:", err);
        res.status(500).json({ error: 'Erro ao adicionar dia da semana.' });
    }
};

diasSemanaisController.getAllDiasSemanais = async (req, res) => {
    try {
        const dias = await DiaSemanal.findAll();
        res.status(200).json(dias);
    } catch (err) {
        console.error("Erro ao buscar dias da semana:", err);
        res.status(500).json({ error: 'Erro ao buscar os dias da semana.' });
    }
};

diasSemanaisController.updateDiaSemanalById = async (req, res) => {
    const { id } = req.params;
    const { ativo } = req.body;
    try {
        const [updated] = await DiaSemanal.update({ ativo }, {
            where: { id }
        });
        
        if (updated === 0) {
            res.status(404).json({ message: 'Dia da semana não encontrado' });
            return;
        }

        const updatedDiaSemanal = await DiaSemanal.findOne({ where: { id } });
        res.status(200).json({ message: 'Dia da semana atualizado com sucesso.', data: updatedDiaSemanal });
    } catch (err) {
        console.error("Erro ao atualizar dia da semana:", err);
        res.status(500).json({ error: 'Erro ao atualizar o dia da semana.' });
    }
};

module.exports = diasSemanaisController;
