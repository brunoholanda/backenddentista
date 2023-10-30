const express = require('express');
const router = express.Router();
const controller = require('../../controllers/disabledDates/controller');

router.post('/', controller.addDisabledDate);
router.get('/', controller.getAllDisabledDates);
router.put('/:id', controller.updateDisabledDateById);
router.delete('/:id', controller.removeDisabledDate);

module.exports = router;
