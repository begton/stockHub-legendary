import React from 'react';

function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to StockHub!
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Hello, <strong>{user.username}</strong>. This is the Stock Management System dashboard.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
              <h3 className="text-lg font-bold text-blue-900">Products</h3>
              <p className="text-gray-600 mt-2">Manage your product inventory</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
              <h3 className="text-lg font-bold text-green-900">Warehouses</h3>
              <p className="text-gray-600 mt-2">Manage warehouse locations</p>
            </div>
            <div className="bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-500">
              <h3 className="text-lg font-bold text-yellow-900">Transactions</h3>
              <p className="text-gray-600 mt-2">Track stock movements</p>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg border-l-4 border-purple-500">
              <h3 className="text-lg font-bold text-purple-900">Reports</h3>
              <p className="text-gray-600 mt-2">Generate stock reports</p>
            </div>
          </div>

          <div className="mt-12 p-6 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-4">About StockHub</h2>
            <p className="text-gray-600">
              StockHub Ltd is a company located in Kigali City, Rwanda. This application helps manage 
              stock movement and inventory records efficiently using a digital system instead of manual, 
              paper-based processes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
