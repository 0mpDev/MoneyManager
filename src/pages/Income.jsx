import { useState, useEffect } from "react";
import { Plus, Trash2, Calendar, DollarSign } from "lucide-react";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndpoints";
import { toast } from "react-hot-toast";
import moment from "moment";
import EmojiPicker from "emoji-picker-react";

const Income = () => {
  const [incomes, setIncomes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    categoryId: "",
    date: moment().format('YYYY-MM-DD'),
    icon: "💰"
  });

  useEffect(() => {
    fetchIncomes();
    fetchCategories();
  }, []);

  const fetchIncomes = async () => {
    try {
      const response = await axiosConfig.get(API_ENDPOINTS.INCOMES);
      setIncomes(response.data);
    } catch (error) {
      toast.error("Failed to fetch incomes");
      console.error("Income fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axiosConfig.get(`${API_ENDPOINTS.CATEGORIES}/income`);
      setCategories(response.data);
    } catch (error) {
      console.error("Categories fetch error:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.amount || !formData.categoryId) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const response = await axiosConfig.post(API_ENDPOINTS.INCOMES, {
        ...formData,
        amount: parseFloat(formData.amount)
      });
      
      setIncomes([response.data, ...incomes]);
      setFormData({
        name: "",
        amount: "",
        categoryId: "",
        date: moment().format('YYYY-MM-DD'),
        icon: "💰"
      });
      setShowForm(false);
      toast.success("Income added successfully");
    } catch (error) {
      toast.error("Failed to add income");
      console.error("Add income error:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this income?")) {
      return;
    }

    try {
      await axiosConfig.delete(`${API_ENDPOINTS.INCOMES}/${id}`);
      setIncomes(incomes.filter(income => income.id !== id));
      toast.success("Income deleted successfully");
    } catch (error) {
      toast.error("Failed to delete income");
      console.error("Delete income error:", error);
    }
  };

  const onEmojiClick = (emojiObject) => {
    setFormData({ ...formData, icon: emojiObject.emoji });
    setShowEmojiPicker(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Income</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Income
        </button>
      </div>

      {/* Add Income Form */}
      {showForm && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Add New Income</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm px-3 py-2 border"
                  placeholder="e.g., Salary, Freelance"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Amount</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="block w-full pl-10 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm px-3 py-2 border"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm px-3 py-2 border"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="block w-full pl-10 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm px-3 py-2 border"
                    required
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Icon</label>
              <div className="mt-1 flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <span className="text-lg mr-2">{formData.icon}</span>
                  Choose Icon
                </button>
                {showEmojiPicker && (
                  <div className="absolute z-10 mt-2">
                    <EmojiPicker onEmojiClick={onEmojiClick} />
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Add Income
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Income List */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            This Month's Income
          </h3>
          {incomes.length > 0 ? (
            <div className="space-y-3">
              {incomes.map((income) => (
                <div key={income.id} className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-lg">
                      {income.icon || '💰'}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {income.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {income.categoryName} • {moment(income.date).format('MMM DD, YYYY')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-lg font-semibold text-green-600">
                      +₹{income.amount?.toLocaleString()}
                    </span>
                    <button
                      onClick={() => handleDelete(income.id)}
                      className="text-red-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Plus className="w-8 h-8 text-green-400" />
              </div>
              <p className="text-gray-500">No income recorded this month</p>
              <p className="text-sm text-gray-400 mt-1">
                Click "Add Income" to get started
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Income;