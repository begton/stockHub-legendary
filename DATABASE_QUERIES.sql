-- StockHub Management System - MySQL Database Schema and Queries
-- Copy and paste these queries in your XAMPP MySQL interface (phpMyAdmin)

-- ==========================================
-- 1. CREATE DATABASE
-- ==========================================
CREATE DATABASE IF NOT EXISTS stockhub_db;
USE stockhub_db;

-- ==========================================
-- 2. CREATE TABLES
-- ==========================================

-- Users Table (for authentication)
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products Table
CREATE TABLE products (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    product_code VARCHAR(50) UNIQUE NOT NULL,
    product_name VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL,
    quantity_in_stock INT NOT NULL DEFAULT 0,
    unit_price DECIMAL(10, 2) NOT NULL,
    supplier_name VARCHAR(100) NOT NULL,
    date_received DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Warehouses Table
CREATE TABLE warehouses (
    warehouse_id INT PRIMARY KEY AUTO_INCREMENT,
    warehouse_code VARCHAR(50) UNIQUE NOT NULL,
    warehouse_name VARCHAR(150) NOT NULL,
    warehouse_location VARCHAR(200) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions Table
CREATE TABLE transactions (
    transaction_id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    warehouse_id INT NOT NULL,
    transaction_date DATE NOT NULL,
    quantity_moved INT NOT NULL,
    transaction_type ENUM('Stock In', 'Stock Out') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(warehouse_id) ON DELETE CASCADE
);

-- ==========================================
-- 3. INSERT SAMPLE DATA
-- ==========================================

-- Insert sample user
INSERT INTO users (username, password, email) VALUES ('admin', 'admin123', 'admin@stockhub.com');

-- Insert sample products
INSERT INTO products (product_code, product_name, category, quantity_in_stock, unit_price, supplier_name, date_received) VALUES
('P001', 'Laptop', 'Electronics', 50, 800.00, 'Tech Supplies Ltd', '2024-01-15'),
('P002', 'Desk Chair', 'Furniture', 100, 150.00, 'Furniture Plus', '2024-01-16'),
('P003', 'Monitor', 'Electronics', 75, 300.00, 'Tech Supplies Ltd', '2024-01-17'),
('P004', 'Keyboard', 'Electronics', 200, 50.00, 'Office Supplies Inc', '2024-01-18'),
('P005', 'Desk Lamp', 'Furniture', 60, 35.00, 'Furniture Plus', '2024-01-19');

-- Insert sample warehouses
INSERT INTO warehouses (warehouse_code, warehouse_name, warehouse_location) VALUES
('W001', 'Kigali Main Warehouse', 'Kimironko, Kigali'),
('W002', 'Nyarugenge Storage', 'Nyarugenge, Kigali'),
('W003', 'Gasabo Distribution Center', 'Gasabo, Kigali');

-- Insert sample transactions
INSERT INTO transactions (product_id, warehouse_id, transaction_date, quantity_moved, transaction_type) VALUES
(1, 1, CURDATE(), 10, 'Stock In'),
(2, 1, CURDATE(), 5, 'Stock Out'),
(3, 2, CURDATE(), 15, 'Stock In'),
(4, 3, CURDATE(), 20, 'Stock Out'),
(5, 1, CURDATE(), 8, 'Stock In');

-- ==========================================
-- 4. USEFUL QUERIES FOR REPORTS
-- ==========================================

-- Total Stock Count by Product
SELECT 
    p.product_code,
    p.product_name,
    p.category,
    p.quantity_in_stock,
    p.unit_price,
    (p.quantity_in_stock * p.unit_price) as total_value
FROM products p
ORDER BY p.product_name;

-- Daily Stock Movements
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
WHERE DATE(t.transaction_date) = CURDATE()
ORDER BY t.transaction_date DESC;

-- Weekly Stock Movements
SELECT 
    WEEK(t.transaction_date) as week_number,
    p.product_code,
    p.product_name,
    SUM(CASE WHEN t.transaction_type = 'Stock In' THEN t.quantity_moved ELSE 0 END) as stock_in,
    SUM(CASE WHEN t.transaction_type = 'Stock Out' THEN t.quantity_moved ELSE 0 END) as stock_out,
    w.warehouse_name
FROM transactions t
JOIN products p ON t.product_id = p.product_id
JOIN warehouses w ON t.warehouse_id = w.warehouse_id
WHERE WEEK(t.transaction_date) = WEEK(CURDATE())
GROUP BY WEEK(t.transaction_date), p.product_id, w.warehouse_id
ORDER BY p.product_code;

-- Monthly Stock Movements
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
ORDER BY p.product_code;

-- Warehouse Stock Summary
SELECT 
    w.warehouse_code,
    w.warehouse_name,
    w.warehouse_location,
    COUNT(DISTINCT p.product_id) as total_products,
    SUM(p.quantity_in_stock) as total_quantity
FROM warehouses w
LEFT JOIN products p ON 1=1
GROUP BY w.warehouse_id, w.warehouse_code, w.warehouse_name, w.warehouse_location;

-- Stock Availability Report (Products with Low Stock)
SELECT 
    p.product_code,
    p.product_name,
    p.category,
    p.quantity_in_stock,
    p.supplier_name
FROM products p
WHERE p.quantity_in_stock < 20
ORDER BY p.quantity_in_stock ASC;

-- ==========================================
-- 5. CREATE INDEXES FOR BETTER PERFORMANCE
-- ==========================================
CREATE INDEX idx_product_code ON products(product_code);
CREATE INDEX idx_product_category ON products(category);
CREATE INDEX idx_warehouse_code ON warehouses(warehouse_code);
CREATE INDEX idx_transaction_date ON transactions(transaction_date);
CREATE INDEX idx_transaction_type ON transactions(transaction_type);
