import React, { useState, useEffect } from 'react';
import { getProducts, addProduct } from '../api';

function Products() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    product_code: '',
    product_name: '',
    category: '',
    quantity_in_stock: '',
    unit_price: '',
    supplier_name: '',
    date_received: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getProducts();
      setProducts(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addProduct(formData);
      setFormData({
        product_code: '',
        product_name: '',
        category: '',
        quantity_in_stock: '',
        unit_price: '',
        supplier_name: '',
        date_received: ''
      });
      setShowForm(false);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add product');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Products</h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              {showForm ? 'Cancel' : 'Add Product'}
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {showForm && (
            <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="product_code"
                  placeholder="Product Code"
                  value={formData.product_code}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="text"
                  name="product_name"
                  placeholder="Product Name"
                  value={formData.product_name}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="text"
                  name="category"
                  placeholder="Category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="number"
                  name="quantity_in_stock"
                  placeholder="Quantity in Stock"
                  value={formData.quantity_in_stock}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  step="0.01"
                  name="unit_price"
                  placeholder="Unit Price"
                  value={formData.unit_price}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="text"
                  name="supplier_name"
                  placeholder="Supplier Name"
                  value={formData.supplier_name}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="date"
                  name="date_received"
                  value={formData.date_received}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
              >
                Save Product
              </button>
            </form>
          )}

          {loading ? (
            <p className="text-center text-gray-600">Loading products...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-2">Code</th>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Category</th>
                    <th className="px-4 py-2">Quantity</th>
                    <th className="px-4 py-2">Unit Price</th>
                    <th className="px-4 py-2">Supplier</th>
                    <th className="px-4 py-2">Date Received</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.product_id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2">{product.product_code}</td>
                      <td className="px-4 py-2">{product.product_name}</td>
                      <td className="px-4 py-2">{product.category}</td>
                      <td className="px-4 py-2">{product.quantity_in_stock}</td>
                      <td className="px-4 py-2">${product.unit_price}</td>
                      <td className="px-4 py-2">{product.supplier_name}</td>
                      <td className="px-4 py-2">{new Date(product.date_received).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Products;
