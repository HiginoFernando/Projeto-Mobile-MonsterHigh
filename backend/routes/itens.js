const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/itensController');

router.get('/itens', ctrl.getItens);
router.post('/itens', ctrl.createItem);
router.put('/itens/:id', ctrl.updateItem);
router.delete('/itens/:id', ctrl.deleteItem);

module.exports = router;
