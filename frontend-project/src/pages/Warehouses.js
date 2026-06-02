import React, { useState, useEffect } from 'react';
import { getWarehouses, addWarehouse } from '../api';

function Warehouses() {
  const [warehouses, setWarehouses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    warehouse_code: '',
    warehouse_name: '',
    warehouse_location: ''
  });

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      setLoading(true);
      const response = await getWarehouses();
      setWarehouses(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch warehouses');
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
      await addWarehouse(formData);
      setFormData({
        warehouse_code: '',
        warehouse_name: '',
        warehouse_location: ''
      });
      setShowForm(false);
      fetchWarehouses();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add warehouse');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Warehouses</h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              {showForm ? 'Cancel' : 'Add Warehouse'}
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {showForm && (
            <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  name="warehouse_code"
                  placeholder="Warehouse Code"
                  value={formData.warehouse_code}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="text"
                  name="warehouse_name"
                  placeholder="Warehouse Name"
                  value={formData.warehouse_name}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="text"
                  name="warehouse_location"
                  placeholder="Warehouse Location"
                  value={formData.warehouse_location}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
              >
                Save Warehouse
              </button>
            </form>
          )}

          {loading ? (
            <p className="text-center text-gray-600">Loading warehouses...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-2">Code</th>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Location</th>
                  </tr>
                </thead>
                <tbody>
                  {warehouses.map((warehouse) => (
                    <tr key={warehouse.warehouse_id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2">{warehouse.warehouse_code}</td>
                      <td className="px-4 py-2">{warehouse.warehouse_name}</td>
                      <td className="px-4 py-2">{warehouse.warehouse_location}</td>
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

export default Warehouses;
