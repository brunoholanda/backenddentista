const express = require('express');
const router = express.Router();
const controller = require('../../controllers/agendamentos/controller');

router.post('/', controller.createAgendamento);
router.get('/', controller.getAgendamentosByDate);
router.get('/todos', controller.getAllAgendamentos);
router.put('/:id', controller.updateAgendamento);

module.exports = router;
