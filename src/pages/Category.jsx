import { useState, useEffect } from "react";
import { Plus, Edit2, Tag } from "lucide-react";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndpoints";
import { toast } from "react-hot-toast";
import EmojiPicker from "emoji-picker-react";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "expense",
    icon: "📁"
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axiosConfig.get(API_ENDPOINTS.CATEGORIES);
      setCategories(response.data);
    } catch (error) {
      toast.error("Failed to fetch categories");
      console.error("Categories fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    try {
      if (editingCategory) {
        // Update existing category
        const response = await axiosConfig.put(`${API_ENDPOINTS.CATEGORIES}/${editingCategory.id}`, formData);
        setCategories(categories.map(cat => 
          cat.id === editingCategory.id ? response.data : cat
        ));
        toast.success("Category updated successfully");
      } else {
        // Create new category
        const response = await axiosConfig.post(API_ENDPOINTS.CATEGORIES, formData);
        setCategories([response.data, ...categories]);
        toast.success("Category created successfully");
      }
      
      resetForm();
    } catch (error) {
      toast.error(editingCategory ? "Failed to update category" : "Failed to create category");
      console.error("Category operation error:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      type: "expense",
      icon: "📁"
    });
    setShowForm(false);
    setEditingCategory(null);
    setShowEmojiPicker(false);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      type: category.type,
      icon: category.icon
    });
    setShowForm(true);
  };

  const onEmojiClick = (emojiObject) => {
    setFormData({ ...formData, icon: emojiObject.emoji });
    setShowEmojiPicker(false);
  };

  const incomeCategories = categories.filter(cat => cat.type === 'income');
  const expenseCategories = categories.filter(cat => cat.type === 'expense');

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
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </button>
      </div>

      {/* Add/Edit Category Form */}
      {showForm && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            {editingCategory ? 'Edit Category' : 'Add New Category'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm px-3 py-2 border"
                  placeholder="e.g., Food, Transportation"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm px-3 py-2 border"
                  required
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Icon</label>
              <div className="mt-1 flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
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
                onClick={resetForm}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                {editingCategory ? 'Update Category' : 'Add Category'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income Categories */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-green-600 mb-4 flex items-center">
              <Tag className="w-5 h-5 mr-2" />
              Income Categories
            </h3>
            {incomeCategories.length > 0 ? (
              <div className="space-y-3">
                {incomeCategories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-lg">
                        {category.icon}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {category.name}
                        </p>
                        <p className="text-xs text-green-600 capitalize">
                          {category.type}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleEdit(category)}
                      className="text-green-400 hover:text-green-600 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Tag className="w-8 h-8 text-green-400" />
                </div>
                <p className="text-gray-500">No income categories yet</p>
                <p className="text-sm text-gray-400 mt-1">
                  Create categories to organize your income
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Expense Categories */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-red-600 mb-4 flex items-center">
              <Tag className="w-5 h-5 mr-2" />
              Expense Categories
            </h3>
            {expenseCategories.length > 0 ? (
              <div className="space-y-3">
                {expenseCategories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-lg">
                        {category.icon}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {category.name}
                        </p>
                        <p className="text-xs text-red-600 capitalize">
                          {category.type}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleEdit(category)}
                      className="text-red-400 hover:text-red-600 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <Tag className="w-8 h-8 text-red-400" />
                </div>
                <p className="text-gray-500">No expense categories yet</p>
                <p className="text-sm text-gray-400 mt-1">
                  Create categories to organize your expenses
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Category;