import { useState, useEffect } from "react";
import { Search, Calendar, ArrowUpDown, TrendingUp, TrendingDown } from "lucide-react";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndpoints";
import { toast } from "react-hot-toast";
import moment from "moment";

const Filter = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    type: "expense",
    startDate: moment().startOf('month').format('YYYY-MM-DD'),
    endDate: moment().endOf('month').format('YYYY-MM-DD'),
    keyword: "",
    sortField: "date",
    sortOrder: "desc"
  });

  useEffect(() => {
    handleFilter();
  }, []);

  const handleFilter = async () => {
    setLoading(true);
    try {
      const response = await axiosConfig.post(API_ENDPOINTS.FILTER, filters);
      setTransactions(response.data);
    } catch (error) {
      toast.error("Failed to filter transactions");
      console.error("Filter error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      type: "expense",
      startDate: moment().startOf('month').format('YYYY-MM-DD'),
      endDate: moment().endOf('month').format('YYYY-MM-DD'),
      keyword: "",
      sortField: "date",
      sortOrder: "desc"
    });
  };

  const totalAmount = transactions.reduce((sum, transaction) => sum + (transaction.amount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Filter Transactions</h1>
      </div>

      {/* Filter Form */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Search & Filter</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select
              value={filters.type}
              onChange={(e) => handleInputChange('type', e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm px-3 py-2 border"
            >
              <option value="expense">Expenses</option>
              <option value="income">Income</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                className="block w-full pl-10 border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm px-3 py-2 border"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                className="block w-full pl-10 border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm px-3 py-2 border"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Search</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={filters.keyword}
                onChange={(e) => handleInputChange('keyword', e.target.value)}
                className="block w-full pl-10 border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm px-3 py-2 border"
                placeholder="Search by name..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Sort By</label>
            <select
              value={filters.sortField}
              onChange={(e) => handleInputChange('sortField', e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm px-3 py-2 border"
            >
              <option value="date">Date</option>
              <option value="amount">Amount</option>
              <option value="name">Name</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Order</label>
            <select
              value={filters.sortOrder}
              onChange={(e) => handleInputChange('sortOrder', e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm px-3 py-2 border"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={resetFilters}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Reset
          </button>
          <button
            onClick={handleFilter}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Filtering...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Filter
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
              {filters.type === 'income' ? (
                <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
              ) : (
                <TrendingDown className="w-5 h-5 mr-2 text-red-500" />
              )}
              {filters.type === 'income' ? 'Income' : 'Expense'} Results
            </h3>
            {transactions.length > 0 && (
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Found</p>
                <p className={`text-lg font-semibold ${
                  filters.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {filters.type === 'income' ? '+' : '-'}₹{totalAmount.toLocaleString()}
                </p>
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          ) : transactions.length > 0 ? (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div key={transaction.id} className={`flex items-center justify-between p-4 rounded-lg border ${
                  filters.type === 'income' 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg ${
                      filters.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {transaction.icon || (filters.type === 'income' ? '💰' : '💸')}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {transaction.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {transaction.categoryName} • {moment(transaction.date).format('MMM DD, YYYY')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-lg font-semibold ${
                      filters.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {filters.type === 'income' ? '+' : '-'}₹{transaction.amount?.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
                filters.type === 'income' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {filters.type === 'income' ? (
                  <TrendingUp className="w-8 h-8 text-green-400" />
                ) : (
                  <TrendingDown className="w-8 h-8 text-red-400" />
                )}
              </div>
              <p className="text-gray-500">No transactions found</p>
              <p className="text-sm text-gray-400 mt-1">
                Try adjusting your filters or date range
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Filter;