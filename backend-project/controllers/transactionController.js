// Get all transactions
const getAllTransactions = async (req, res) => {
  try {
    const connection = await global.pool.getConnection();
    const [transactions] = await connection.query(`
      SELECT t.*, p.product_name, p.product_code, w.warehouse_name 
      FROM transactions t
      JOIN products p ON t.product_id = p.product_id
      JOIN warehouses w ON t.warehouse_id = w.warehouse_id
      ORDER BY t.transaction_date DESC
    `);
    connection.release();
    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};

// Add new transaction
const addTransaction = async (req, res) => {
  try {
    const { product_id, warehouse_id, transaction_date, quantity_moved, transaction_type } = req.body;

    if (!product_id || !warehouse_id || !transaction_date || !quantity_moved || !transaction_type) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const connection = await global.pool.getConnection();

    // Update product quantity based on transaction type
    const [product] = await connection.query('SELECT quantity_in_stock FROM products WHERE product_id = ?', [product_id]);
    
    if (product.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Product not found' });
    }

    const currentQuantity = product[0].quantity_in_stock;
    let newQuantity = currentQuantity;

    if (transaction_type === 'Stock In') {
      newQuantity = currentQuantity + parseInt(quantity_moved);
    } else if (transaction_type === 'Stock Out') {
      if (currentQuantity < parseInt(quantity_moved)) {
        connection.release();
        return res.status(400).json({ error: 'Insufficient stock' });
      }
      newQuantity = currentQuantity - parseInt(quantity_moved);
    }

    // Update product quantity
    await connection.query('UPDATE products SET quantity_in_stock = ? WHERE product_id = ?', [newQuantity, product_id]);

    // Insert transaction
    const [result] = await connection.query(
      'INSERT INTO transactions (product_id, warehouse_id, transaction_date, quantity_moved, transaction_type) VALUES (?, ?, ?, ?, ?)',
      [product_id, warehouse_id, transaction_date, quantity_moved, transaction_type]
    );
    connection.release();

    res.status(201).json({ message: 'Transaction added successfully', id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add transaction' });
  }
};

// Get transaction by ID
const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await global.pool.getConnection();
    const [transactions] = await connection.query(`
      SELECT t.*, p.product_name, p.product_code, w.warehouse_name 
      FROM transactions t
      JOIN products p ON t.product_id = p.product_id
      JOIN warehouses w ON t.warehouse_id = w.warehouse_id
      WHERE t.transaction_id = ?
    `, [id]);
    connection.release();

    if (transactions.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json(transactions[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch transaction' });
  }
};

// Update transaction
const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { product_id, warehouse_id, transaction_date, quantity_moved, transaction_type } = req.body;

    const connection = await global.pool.getConnection();

    // Get the old transaction
    const [oldTx] = await connection.query('SELECT * FROM transactions WHERE transaction_id = ?', [id]);
    if (oldTx.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Transaction not found' });
    }

    const oldTransaction = oldTx[0];

    // Reverse the old transaction effect
    const [product] = await connection.query('SELECT quantity_in_stock FROM products WHERE product_id = ?', [oldTransaction.product_id]);
    let currentQuantity = product[0].quantity_in_stock;

    if (oldTransaction.transaction_type === 'Stock In') {
      currentQuantity -= oldTransaction.quantity_moved;
    } else {
      currentQuantity += oldTransaction.quantity_moved;
    }

    // Apply new transaction effect
    if (transaction_type === 'Stock In') {
      currentQuantity += quantity_moved;
    } else {
      currentQuantity -= quantity_moved;
    }

    if (currentQuantity < 0) {
      connection.release();
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    // Update product quantity and transaction
    await connection.query('UPDATE products SET quantity_in_stock = ? WHERE product_id = ?', [currentQuantity, product_id]);
    await connection.query(
      'UPDATE transactions SET product_id = ?, warehouse_id = ?, transaction_date = ?, quantity_moved = ?, transaction_type = ? WHERE transaction_id = ?',
      [product_id, warehouse_id, transaction_date, quantity_moved, transaction_type, id]
    );
    connection.release();

    res.json({ message: 'Transaction updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update transaction' });
  }
};

// Delete transaction
const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await global.pool.getConnection();

    // Get the transaction
    const [transactions] = await connection.query('SELECT * FROM transactions WHERE transaction_id = ?', [id]);
    if (transactions.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Transaction not found' });
    }

    const transaction = transactions[0];

    // Reverse the transaction effect
    const [product] = await connection.query('SELECT quantity_in_stock FROM products WHERE product_id = ?', [transaction.product_id]);
    let newQuantity = product[0].quantity_in_stock;

    if (transaction.transaction_type === 'Stock In') {
      newQuantity -= transaction.quantity_moved;
    } else {
      newQuantity += transaction.quantity_moved;
    }

    // Update product quantity and delete transaction
    await connection.query('UPDATE products SET quantity_in_stock = ? WHERE product_id = ?', [newQuantity, transaction.product_id]);
    await connection.query('DELETE FROM transactions WHERE transaction_id = ?', [id]);
    connection.release();

    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
};

module.exports = { getAllTransactions, addTransaction, getTransactionById, updateTransaction, deleteTransaction };
