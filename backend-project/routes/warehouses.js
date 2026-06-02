const express = require('express');
const warehouseController = require('../controllers/warehouseController');

const router = express.Router();

router.get('/', warehouseController.getAllWarehouses);
router.post('/', warehouseController.addWarehouse);
router.get('/:id', warehouseController.getWarehouseById);

module.exports = router;
