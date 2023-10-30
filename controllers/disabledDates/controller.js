const DisabledDate = require('../../models/DisabledDate');

const disabledDatesController = {};

disabledDatesController.addDisabledDate = async (req, res) => {
    try {
        const disabledDate = await DisabledDate.create(req.body);
        res.status(201).json(disabledDate);
    } catch (err) {
        console.error("Erro ao adicionar data desabilitada:", err);
        res.status(500).json({ error: 'Erro ao adicionar a data desabilitada.' });
    }
};

disabledDatesController.getAllDisabledDates = async (req, res) => {
    try {
        const disabledDates = await DisabledDate.findAll();
        res.status(200).json(disabledDates);
    } catch (err) {
        console.error("Erro ao buscar todas as datas desabilitadas:", err);
        res.status(500).json({ error: 'Erro ao buscar as datas desabilitadas.' });
    }
};

disabledDatesController.removeDisabledDate = async (req, res) => {
    try {
        const destroyedCount = await DisabledDate.destroy({ where: { date: req.params.date } });
        
        if (destroyedCount === 0) {
            res.status(404).json({ message: 'Data desabilitada não encontrada' });
            return;
        }

        res.status(200).json({ message: 'Data desabilitada removida com sucesso.' });
    } catch (err) {
        console.error("Erro ao remover data desabilitada:", err);
        res.status(500).json({ error: 'Erro ao remover a data desabilitada.' });
    }
};

disabledDatesController.updateDisabledDateById = async (req, res) => {
    try {
        const [updated] = await DisabledDate.update({ date: req.body.date }, { where: { id: req.params.id } });

        if (updated === 0) {
            res.status(404).json({ message: 'Data desabilitada não encontrada' });
            return;
        }

        const updatedDisabledDate = await DisabledDate.findOne({ where: { id: req.params.id } });
        res.status(200).json(updatedDisabledDate);
    } catch (err) {
        console.error("Erro ao atualizar data desabilitada:", err);
        res.status(500).json({ error: 'Erro ao atualizar a data desabilitada.' });
    }
};

module.exports = disabledDatesController;
