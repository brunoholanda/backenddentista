const express = require('express');
const router = express.Router();
const controller = require('../../controllers/dias-semanais/controller');

router.post('/', controller.createDiaSemanal);
router.get('/', controller.getAllDiasSemanais);
router.put('/:id', controller.updateDiaSemanalById);

module.exports = router;
