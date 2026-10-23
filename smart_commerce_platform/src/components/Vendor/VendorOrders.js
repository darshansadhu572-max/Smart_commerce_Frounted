import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Eye, Edit, ShoppingBag, Clock, CheckCircle, Truck, XCircle } from "lucide-react";

const VendorOrders = ({ orders = [], setOrders }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === "Pending").length;
  const processingOrders = orders.filter((o) => o.status === "Processing").length;
  const shippedOrders = orders.filter((o) => o.status === "Shipped").length;
  const deliveredOrders = orders.filter((o) => o.status === "Delivered").length;
  const cancelledOrders = orders.filter((o) => o.status === "Cancelled").length;

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.productName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || order.status === statusFilter;
    const matchesPayment = paymentFilter === "All" || order.paymentStatus === paymentFilter;
    const matchesDate = !dateFilter || order.date.includes(dateFilter);
    return matchesSearch && matchesStatus && matchesPayment && matchesDate;
  });

  const getBadgeClass = (status) => {
    switch (status) {
      case "Delivered": return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Shipped": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Processing": return "bg-amber-100 text-amber-800 border-amber-200";
      case "Pending": return "bg-purple-100 text-purple-800 border-purple-200";
      case "Cancelled": return "bg-rose-100 text-rose-800 border-rose-200";
      default: return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Vendor Orders</h1>
          <p className="text-xs text-slate-500 mt-1">Manage and update customer orders for your store products</p>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500">Total Orders</p>
          <p className="text-xl font-bold text-slate-900 mt-1">{totalOrders}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-purple-600">Pending</p>
          <p className="text-xl font-bold text-slate-900 mt-1">{pendingOrders}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-amber-600">Processing</p>
          <p className="text-xl font-bold text-slate-900 mt-1">{processingOrders}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-blue-600">Shipped</p>
          <p className="text-xl font-bold text-slate-900 mt-1">{shippedOrders}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-emerald-600">Delivered</p>
          <p className="text-xl font-bold text-slate-900 mt-1">{deliveredOrders}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-rose-600">Cancelled</p>
          <p className="text-xl font-bold text-slate-900 mt-1">{cancelledOrders}</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center gap-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search Order ID, Customer, Product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-700"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-700"
          >
            <option value="All">All Payments</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
          </select>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-700"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Product / Items</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Total Amount</th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 font-bold text-slate-900">{order.id}</td>
                    <td className="px-6 py-4 text-slate-800 font-semibold">{order.customerName}</td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900">{order.productName}</p>
                      <p className="text-[10px] text-slate-400">{order.itemCount} item(s)</p>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{order.date}</td>
                    <td className="px-6 py-4 font-bold text-slate-900">₹{order.totalAmount.toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${order.paymentStatus === 'Paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getBadgeClass(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/vendor/orders/${order.id}`} className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900" title="View Order">
                          <Eye size={16} />
                        </Link>
                        <Link to={`/vendor/orders/${order.id}/update`} className="p-2 rounded-xl text-blue-600 hover:bg-blue-50" title="Update Status">
                          <Edit size={16} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-10 text-center text-slate-400">
                    No vendor orders found matching search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VendorOrders;
