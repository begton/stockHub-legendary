const express = require('express');
const transactionController = require('../controllers/transactionController');

const router = express.Router();

router.get('/', transactionController.getAllTransactions);
router.post('/', transactionController.addTransaction);
router.get('/:id', transactionController.getTransactionById);
router.put('/:id', transactionController.updateTransaction);
router.delete('/:id', transactionController.deleteTransaction);

module.exports = router;
