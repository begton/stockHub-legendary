// Get all products
const getAllProducts = async (req, res) => {
  try {
    const connection = await global.pool.getConnection();
    const [products] = await connection.query('SELECT * FROM products ORDER BY product_name');
    connection.release();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

// Add new product
const addProduct = async (req, res) => {
  try {
    const { product_code, product_name, category, quantity_in_stock, unit_price, supplier_name, date_received } = req.body;

    if (!product_code || !product_name || !category || !unit_price || !supplier_name || !date_received) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const connection = await global.pool.getConnection();
    const [result] = await connection.query(
      'INSERT INTO products (product_code, product_name, category, quantity_in_stock, unit_price, supplier_name, date_received) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [product_code, product_name, category, quantity_in_stock || 0, unit_price, supplier_name, date_received]
    );
    connection.release();

    res.status(201).json({ message: 'Product added successfully', id: result.insertId });
  } catch (error) {
    console.error(error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Product code already exists' });
    }
    res.status(500).json({ error: 'Failed to add product' });
  }
};

// Get product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await global.pool.getConnection();
    const [products] = await connection.query('SELECT * FROM products WHERE product_id = ?', [id]);
    connection.release();

    if (products.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(products[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

module.exports = { getAllProducts, addProduct, getProductById };
