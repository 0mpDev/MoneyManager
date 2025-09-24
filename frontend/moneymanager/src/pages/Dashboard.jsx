// import { useState, useEffect } from "react";
// import { TrendingUp, TrendingDown, Wallet, Plus } from "lucide-react";
// import axiosConfig from "../util/axiosConfig";
// import { API_ENDPOINTS } from "../util/apiEndpoints";
// import { toast } from "react-hot-toast";
// import moment from "moment";

// const Dashboard = () => {
//   const [dashboardData, setDashboardData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     try {
//       const response = await axiosConfig.get(API_ENDPOINTS.DASHBOARD);
//       setDashboardData(response.data);
//     } catch (error) {
//       toast.error("Failed to fetch dashboard data");
//       console.error("Dashboard error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
//       </div>
//     );
//   }

//   const stats = [
//     {
//       name: 'Total Balance',
//       value: `₹${dashboardData?.totalBalance?.toLocaleString() || '0'}`,
//       icon: Wallet,
//       color: 'bg-blue-500',
//       textColor: 'text-blue-600',
//       bgColor: 'bg-blue-50'
//     },
//     {
//       name: 'Total Income',
//       value: `₹${dashboardData?.totalIncome?.toLocaleString() || '0'}`,
//       icon: TrendingUp,
//       color: 'bg-green-500',
//       textColor: 'text-green-600',
//       bgColor: 'bg-green-50'
//     },
//     {
//       name: 'Total Expense',
//       value: `₹${dashboardData?.totalExpense?.toLocaleString() || '0'}`,
//       icon: TrendingDown,
//       color: 'bg-red-500',
//       textColor: 'text-red-600',
//       bgColor: 'bg-red-50'
//     },
//   ];

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
//         <div className="text-sm text-gray-500">
//           {moment().format('MMMM DD, YYYY')}
//         </div>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
//         {stats.map((stat) => {
//           const Icon = stat.icon;
//           return (
//             <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
//               <div className="p-5">
//                 <div className="flex items-center">
//                   <div className="flex-shrink-0">
//                     <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
//                       <Icon className={`w-6 h-6 ${stat.textColor}`} />
//                     </div>
//                   </div>
//                   <div className="ml-5 w-0 flex-1">
//                     <dl>
//                       <dt className="text-sm font-medium text-gray-500 truncate">
//                         {stat.name}
//                       </dt>
//                       <dd className="text-lg font-semibold text-gray-900">
//                         {stat.value}
//                       </dd>
//                     </dl>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* Recent Transactions */}
//       <div className="bg-white shadow rounded-lg">
//         <div className="px-4 py-5 sm:p-6">
//           <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
//             Recent Transactions
//           </h3>
//           {dashboardData?.recentTransactions?.length > 0 ? (
//             <div className="space-y-3">
//               {dashboardData.recentTransactions.slice(0, 10).map((transaction) => (
//                 <div key={`${transaction.type}-${transaction.id}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                   <div className="flex items-center space-x-3">
//                     <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
//                       transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
//                     }`}>
//                       {transaction.icon || (transaction.type === 'income' ? '💰' : '💸')}
//                     </div>
//                     <div>
//                       <p className="text-sm font-medium text-gray-900">
//                         {transaction.name}
//                       </p>
//                       <p className="text-xs text-gray-500">
//                         {moment(transaction.date).format('MMM DD, YYYY')}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <p className={`text-sm font-semibold ${
//                       transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
//                     }`}>
//                       {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount?.toLocaleString()}
//                     </p>
//                     <p className="text-xs text-gray-500 capitalize">
//                       {transaction.type}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="text-center py-8">
//               <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
//                 <Plus className="w-8 h-8 text-gray-400" />
//               </div>
//               <p className="text-gray-500">No transactions yet</p>
//               <p className="text-sm text-gray-400 mt-1">
//                 Start by adding your first income or expense
//               </p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Quick Actions */}
//       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//         <div className="bg-white shadow rounded-lg p-6">
//           <h3 className="text-lg font-medium text-gray-900 mb-4">This Month's Income</h3>
//           {dashboardData?.recent5Incomes?.length > 0 ? (
//             <div className="space-y-2">
//               {dashboardData.recent5Incomes.slice(0, 3).map((income) => (
//                 <div key={income.id} className="flex items-center justify-between">
//                   <div className="flex items-center space-x-2">
//                     <span className="text-sm">{income.icon || '💰'}</span>
//                     <span className="text-sm text-gray-600">{income.name}</span>
//                   </div>
//                   <span className="text-sm font-medium text-green-600">
//                     +₹{income.amount?.toLocaleString()}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <p className="text-gray-500 text-sm">No income recorded this month</p>
//           )}
//         </div>

//         <div className="bg-white shadow rounded-lg p-6">
//           <h3 className="text-lg font-medium text-gray-900 mb-4">This Month's Expenses</h3>
//           {dashboardData?.recent5Expenses?.length > 0 ? (
//             <div className="space-y-2">
//               {dashboardData.recent5Expenses.slice(0, 3).map((expense) => (
//                 <div key={expense.id} className="flex items-center justify-between">
//                   <div className="flex items-center space-x-2">
//                     <span className="text-sm">{expense.icon || '💸'}</span>
//                     <span className="text-sm text-gray-600">{expense.name}</span>
//                   </div>
//                   <span className="text-sm font-medium text-red-600">
//                     -₹{expense.amount?.toLocaleString()}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <p className="text-gray-500 text-sm">No expenses recorded this month</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;