
const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/itensController');


router
  .route('/')
  .get(ctrl.getItens)
  .post(ctrl.createItem);


router
  .route('/:id')
  .put(ctrl.updateItem)
  .delete(ctrl.deleteItem);

module.exports = router;
