import React, { useState, useEffect } from 'react';
import { getDailyReport, getWeeklyReport, getMonthlyReport, getStockSummary } from '../api';

function Reports() {
  const [reportType, setReportType] = useState('daily');
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchReport();
  }, [reportType, selectedDate]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      setError('');
      let response;

      switch (reportType) {
        case 'daily':
          response = await getDailyReport(selectedDate);
          setReportData(response.data.transactions || []);
          break;
        case 'weekly':
          response = await getWeeklyReport();
          setReportData(response.data.transactions || []);
          break;
        case 'monthly':
          response = await getMonthlyReport();
          setReportData(response.data.transactions || []);
          break;
        case 'stock':
          response = await getStockSummary();
          setReportData(response.data || []);
          break;
        default:
          break;
      }
    } catch (err) {
      setError('Failed to fetch report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Reports</h1>

          <div className="flex flex-wrap gap-4 mb-6">
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="daily">Daily Report</option>
              <option value="weekly">Weekly Report</option>
              <option value="monthly">Monthly Report</option>
              <option value="stock">Stock Summary</option>
            </select>

            {reportType === 'daily' && (
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}

            <button
              onClick={fetchReport}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Refresh
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {loading ? (
            <p className="text-center text-gray-600">Loading report...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-200">
                  <tr>
                    {reportType === 'stock' ? (
                      <>
                        <th className="px-4 py-2">Code</th>
                        <th className="px-4 py-2">Name</th>
                        <th className="px-4 py-2">Category</th>
                        <th className="px-4 py-2">Quantity</th>
                        <th className="px-4 py-2">Unit Price</th>
                        <th className="px-4 py-2">Total Value</th>
                        <th className="px-4 py-2">Supplier</th>
                      </>
                    ) : (
                      <>
                        <th className="px-4 py-2">Date</th>
                        <th className="px-4 py-2">Product</th>
                        <th className="px-4 py-2">Warehouse</th>
                        <th className="px-4 py-2">Quantity</th>
                        {(reportType === 'weekly' || reportType === 'monthly') && (
                          <>
                            <th className="px-4 py-2">Stock In</th>
                            <th className="px-4 py-2">Stock Out</th>
                          </>
                        )}
                        <th className="px-4 py-2">Type</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {reportData.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-4 py-2 text-center text-gray-600">No data available</td>
                    </tr>
                  ) : (
                    reportData.map((item, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        {reportType === 'stock' ? (
                          <>
                            <td className="px-4 py-2">{item.product_code}</td>
                            <td className="px-4 py-2">{item.product_name}</td>
                            <td className="px-4 py-2">{item.category}</td>
                            <td className="px-4 py-2">{item.quantity_in_stock}</td>
                            <td className="px-4 py-2">${item.unit_price}</td>
                            <td className="px-4 py-2">${item.total_value}</td>
                            <td className="px-4 py-2">{item.supplier_name}</td>
                          </>
                        ) : (
                          <>
                            <td className="px-4 py-2">{item.transaction_date ? new Date(item.transaction_date).toLocaleDateString() : '-'}</td>
                            <td className="px-4 py-2">{item.product_name}</td>
                            <td className="px-4 py-2">{item.warehouse_name}</td>
                            <td className="px-4 py-2">{item.quantity_moved}</td>
                            {(reportType === 'weekly' || reportType === 'monthly') && (
                              <>
                                <td className="px-4 py-2">{item.stock_in || item.total_stock_in || 0}</td>
                                <td className="px-4 py-2">{item.stock_out || item.total_stock_out || 0}</td>
                              </>
                            )}
                            <td className="px-4 py-2">
                              <span className={`px-2 py-1 rounded text-white text-xs ${item.transaction_type === 'Stock In' ? 'bg-green-500' : 'bg-red-500'}`}>
                                {item.transaction_type}
                              </span>
                            </td>
                          </>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Reports;
