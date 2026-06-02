// Get daily report
const getDailyReport = async (req, res) => {
  try {
    const { date } = req.query || new Date().toISOString().split('T')[0];
    const connection = await global.pool.getConnection();
    
    const reportDate = date || new Date().toISOString().split('T')[0];

    const [dailyReport] = await connection.query(`
      SELECT 
        DATE(t.transaction_date) as transaction_date,
        p.product_code,
        p.product_name,
        t.quantity_moved,
        t.transaction_type,
        w.warehouse_name
      FROM transactions t
      JOIN products p ON t.product_id = p.product_id
      JOIN warehouses w ON t.warehouse_id = w.warehouse_id
      WHERE DATE(t.transaction_date) = ?
      ORDER BY t.transaction_date DESC
    `, [reportDate]);

    connection.release();
    res.json({ date: reportDate, transactions: dailyReport });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch daily report' });
  }
};

// Get weekly report
const getWeeklyReport = async (req, res) => {
  try {
    const connection = await global.pool.getConnection();

    const [weeklyReport] = await connection.query(`
      SELECT 
        WEEK(t.transaction_date) as week_number,
        YEAR(t.transaction_date) as year,
        p.product_code,
        p.product_name,
        SUM(CASE WHEN t.transaction_type = 'Stock In' THEN t.quantity_moved ELSE 0 END) as stock_in,
        SUM(CASE WHEN t.transaction_type = 'Stock Out' THEN t.quantity_moved ELSE 0 END) as stock_out,
        w.warehouse_name
      FROM transactions t
      JOIN products p ON t.product_id = p.product_id
      JOIN warehouses w ON t.warehouse_id = w.warehouse_id
      WHERE WEEK(t.transaction_date) = WEEK(CURDATE()) AND YEAR(t.transaction_date) = YEAR(CURDATE())
      GROUP BY WEEK(t.transaction_date), p.product_id, w.warehouse_id
      ORDER BY p.product_code
    `);

    connection.release();
    res.json({ week: new Date().toISOString().split('T')[0], transactions: weeklyReport });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch weekly report' });
  }
};

// Get monthly report
const getMonthlyReport = async (req, res) => {
  try {
    const connection = await global.pool.getConnection();

    const [monthlyReport] = await connection.query(`
      SELECT 
        MONTH(t.transaction_date) as month_number,
        YEAR(t.transaction_date) as year,
        p.product_code,
        p.product_name,
        SUM(CASE WHEN t.transaction_type = 'Stock In' THEN t.quantity_moved ELSE 0 END) as total_stock_in,
        SUM(CASE WHEN t.transaction_type = 'Stock Out' THEN t.quantity_moved ELSE 0 END) as total_stock_out,
        w.warehouse_name
      FROM transactions t
      JOIN products p ON t.product_id = p.product_id
      JOIN warehouses w ON t.warehouse_id = w.warehouse_id
      WHERE MONTH(t.transaction_date) = MONTH(CURDATE()) AND YEAR(t.transaction_date) = YEAR(CURDATE())
      GROUP BY MONTH(t.transaction_date), p.product_id, w.warehouse_id
      ORDER BY p.product_code
    `);

    connection.release();
    res.json({ month: new Date().toISOString().split('T')[0], transactions: monthlyReport });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch monthly report' });
  }
};

// Get stock summary
const getStockSummary = async (req, res) => {
  try {
    const connection = await global.pool.getConnection();

    const [stockSummary] = await connection.query(`
      SELECT 
        p.product_code,
        p.product_name,
        p.category,
        p.quantity_in_stock,
        p.unit_price,
        (p.quantity_in_stock * p.unit_price) as total_value,
        p.supplier_name
      FROM products p
      ORDER BY p.product_name
    `);

    connection.release();
    res.json(stockSummary);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch stock summary' });
  }
};

module.exports = { getDailyReport, getWeeklyReport, getMonthlyReport, getStockSummary };
