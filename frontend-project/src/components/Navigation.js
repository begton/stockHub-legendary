import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Navigation({ onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path ? 'bg-blue-700' : '';

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold mr-8">StockHub</h1>
            <div className="hidden md:flex space-x-4">
              <button
                onClick={() => navigate('/')}
                className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition ${isActive('/')}`}
              >
                Dashboard
              </button>
              <button
                onClick={() => navigate('/products')}
                className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition ${isActive('/products')}`}
              >
                Products
              </button>
              <button
                onClick={() => navigate('/warehouses')}
                className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition ${isActive('/warehouses')}`}
              >
                Warehouses
              </button>
              <button
                onClick={() => navigate('/transactions')}
                className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition ${isActive('/transactions')}`}
              >
                Transactions
              </button>
              <button
                onClick={() => navigate('/reports')}
                className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition ${isActive('/reports')}`}
              >
                Reports
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm">Welcome, {user.username}</span>
            <button
              onClick={handleLogout}
              className="px-3 py-2 rounded-md text-sm font-medium bg-red-600 hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden pb-4 space-y-2">
          <button
            onClick={() => navigate('/')}
            className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition ${isActive('/')}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => navigate('/products')}
            className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition ${isActive('/products')}`}
          >
            Products
          </button>
          <button
            onClick={() => navigate('/warehouses')}
            className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition ${isActive('/warehouses')}`}
          >
            Warehouses
          </button>
          <button
            onClick={() => navigate('/transactions')}
            className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition ${isActive('/transactions')}`}
          >
            Transactions
          </button>
          <button
            onClick={() => navigate('/reports')}
            className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition ${isActive('/reports')}`}
          >
            Reports
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
