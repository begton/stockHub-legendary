import React, { useState, useEffect } from 'react';
import { getTransactions, getProducts, getWarehouses, addTransaction, updateTransaction, deleteTransaction } from '../api';

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    product_id: '',
    warehouse_id: '',
    transaction_date: '',
    quantity_moved: '',
    transaction_type: 'Stock In'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [txResponse, prodResponse, whResponse] = await Promise.all([
        getTransactions(),
        getProducts(),
        getWarehouses()
      ]);
      setTransactions(txResponse.data);
      setProducts(prodResponse.data);
      setWarehouses(whResponse.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch data');
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
      if (editingId) {
        await updateTransaction(editingId, formData);
      } else {
        await addTransaction(formData);
      }
      setFormData({
        product_id: '',
        warehouse_id: '',
        transaction_date: '',
        quantity_moved: '',
        transaction_type: 'Stock In'
      });
      setShowForm(false);
      setEditingId(null);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save transaction');
    }
  };

  const handleEdit = (transaction) => {
    setFormData({
      product_id: transaction.product_id,
      warehouse_id: transaction.warehouse_id,
      transaction_date: transaction.transaction_date.split('T')[0],
      quantity_moved: transaction.quantity_moved,
      transaction_type: transaction.transaction_type
    });
    setEditingId(transaction.transaction_id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await deleteTransaction(id);
        fetchData();
      } catch (err) {
        setError('Failed to delete transaction');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
            <button
              onClick={() => {
                setShowForm(!showForm);
                setEditingId(null);
                if (showForm) {
                  setFormData({
                    product_id: '',
                    warehouse_id: '',
                    transaction_date: '',
                    quantity_moved: '',
                    transaction_type: 'Stock In'
                  });
                }
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              {showForm ? 'Cancel' : 'Add Transaction'}
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
                <select
                  name="product_id"
                  value={formData.product_id}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Product</option>
                  {products.map(p => (
                    <option key={p.product_id} value={p.product_id}>{p.product_name}</option>
                  ))}
                </select>
                <select
                  name="warehouse_id"
                  value={formData.warehouse_id}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Warehouse</option>
                  {warehouses.map(w => (
                    <option key={w.warehouse_id} value={w.warehouse_id}>{w.warehouse_name}</option>
                  ))}
                </select>
                <input
                  type="date"
                  name="transaction_date"
                  value={formData.transaction_date}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="number"
                  name="quantity_moved"
                  placeholder="Quantity Moved"
                  value={formData.quantity_moved}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <select
                  name="transaction_type"
                  value={formData.transaction_type}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="Stock In">Stock In</option>
                  <option value="Stock Out">Stock Out</option>
                </select>
              </div>
              <button
                type="submit"
                className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
              >
                {editingId ? 'Update Transaction' : 'Save Transaction'}
              </button>
            </form>
          )}

          {loading ? (
            <p className="text-center text-gray-600">Loading transactions...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">Product</th>
                    <th className="px-4 py-2">Warehouse</th>
                    <th className="px-4 py-2">Quantity</th>
                    <th className="px-4 py-2">Type</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.transaction_id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2">{new Date(tx.transaction_date).toLocaleDateString()}</td>
                      <td className="px-4 py-2">{tx.product_name}</td>
                      <td className="px-4 py-2">{tx.warehouse_name}</td>
                      <td className="px-4 py-2">{tx.quantity_moved}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded text-white ${tx.transaction_type === 'Stock In' ? 'bg-green-500' : 'bg-red-500'}`}>
                          {tx.transaction_type}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => handleEdit(tx)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-2 rounded mr-2 text-xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(tx.transaction_id)}
                          className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded text-xs"
                        >
                          Delete
                        </button>
                      </td>
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

export default Transactions;
