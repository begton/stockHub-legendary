// User Login - Simple password check (no JWT)
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const connection = await global.pool.getConnection();
    const [users] = await connection.query('SELECT * FROM users WHERE username = ?', [username]);
    connection.release();

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const user = users[0];
    // Simple password comparison (for demo purposes)
    if (password !== user.password) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    res.json({ 
      message: 'Login successful',
      user: { id: user.user_id, username: user.username, email: user.email } 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
};

// User Registration - Simple storage (no password hashing)
const register = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Store password as-is (for demo purposes)

    const connection = await global.pool.getConnection();
    await connection.query(
      'INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
      [username, password, email]
    );
    connection.release();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Username already exists' });
    }
    res.status(500).json({ error: 'Registration failed' });
  }
};

module.exports = { login, register };
