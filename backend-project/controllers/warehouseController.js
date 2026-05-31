// Get all warehouses
const getAllWarehouses = async (req, res) => {
  try {
    const connection = await global.pool.getConnection();
    const [warehouses] = await connection.query('SELECT * FROM warehouses ORDER BY warehouse_name');
    connection.release();
    res.json(warehouses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch warehouses' });
  }
};

// Add new warehouse
const addWarehouse = async (req, res) => {
  try {
    const { warehouse_code, warehouse_name, warehouse_location } = req.body;

    if (!warehouse_code || !warehouse_name || !warehouse_location) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const connection = await global.pool.getConnection();
    const [result] = await connection.query(
      'INSERT INTO warehouses (warehouse_code, warehouse_name, warehouse_location) VALUES (?, ?, ?)',
      [warehouse_code, warehouse_name, warehouse_location]
    );
    connection.release();

    res.status(201).json({ message: 'Warehouse added successfully', id: result.insertId });
  } catch (error) {
    console.error(error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Warehouse code already exists' });
    }
    res.status(500).json({ error: 'Failed to add warehouse' });
  }
};

// Get warehouse by ID
const getWarehouseById = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await global.pool.getConnection();
    const [warehouses] = await connection.query('SELECT * FROM warehouses WHERE warehouse_id = ?', [id]);
    connection.release();

    if (warehouses.length === 0) {
      return res.status(404).json({ error: 'Warehouse not found' });
    }

    res.json(warehouses[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch warehouse' });
  }
};

module.exports = { getAllWarehouses, addWarehouse, getWarehouseById };
