const express = require('express');
const productController = require('../controllers/productController');

const router = express.Router();

router.get('/', productController.getAllProducts);
router.post('/', productController.addProduct);
router.get('/:id', productController.getProductById);

module.exports = router;
