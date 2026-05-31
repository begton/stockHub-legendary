const express = require('express');
const reportController = require('../controllers/reportController');

const router = express.Router();

router.get('/daily', reportController.getDailyReport);
router.get('/weekly', reportController.getWeeklyReport);
router.get('/monthly', reportController.getMonthlyReport);
router.get('/stock-summary', reportController.getStockSummary);

module.exports = router;
