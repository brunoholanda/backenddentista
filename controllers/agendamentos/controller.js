const Agendamento = require('../../models/agendamento');

const agendamentoController = {};

agendamentoController.createAgendamento = async (req, res) => {
    try {
        const agendamento = await Agendamento.create(req.body);
        res.status(200).json(agendamento);
    } catch (err) {
        console.error("Erro ao criar agendamento:", err);
        res.status(500).json({ error: 'Erro ao inserir agendamento no banco de dados.' });
    }
};

agendamentoController.getAgendamentosByDate = async (req, res) => {
    try {
        const agendamentos = await Agendamento.findAll({ where: { data: req.query.data } });
        res.status(200).json(agendamentos);
    } catch (err) {
        console.error("Erro ao buscar agendamentos por data:", err);
        res.status(500).json({ error: 'Erro ao buscar os horários agendados.' });
    }
};

agendamentoController.getAllAgendamentos = async (req, res) => {
    try {
        const agendamentos = await Agendamento.findAll();
        res.status(200).json(agendamentos);
    } catch (err) {
        console.error("Erro ao buscar todos os agendamentos:", err);
        res.status(500).json({ error: 'Erro ao buscar todos os agendamentos.' });
    }
};

agendamentoController.updateAgendamento = async (req, res) => {
    const { id } = req.params;

    try {
        const [updated] = await Agendamento.update(req.body, { where: { id } });

        if (updated === 0) {
            res.status(404).json({ success: false, message: 'Agendamento não encontrado' });
            return;
        }

        const updatedAgendamento = await Agendamento.findOne({ where: { id } });
        res.status(200).json({ success: true, data: updatedAgendamento });
    } catch (err) {
        console.error("Erro ao atualizar agendamento:", err);
        res.status(500).json({ success: false, message: 'Erro ao atualizar o agendamento' });
    }
};

module.exports = agendamentoController;
