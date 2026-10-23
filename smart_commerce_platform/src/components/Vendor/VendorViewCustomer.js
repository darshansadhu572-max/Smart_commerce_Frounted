import React from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, } from "lucide-react";

const VendorViewCustomer = ({ customers = [] }) => {
  const { customerId } = useParams();

  const customer = customers.find((c) => c.id === customerId) || {
    id: customerId || "cust-101",
    name: "Aarav Patel",
    email: "aarav.patel@example.com",
    phone: "+91 98765 43210",
    orderCount: 4,
    totalSpent: 29996,
    lastOrderDate: "Aug 10, 2026",
    status: "Active Buyer",
    address: "123 CG Road, Navrangpura, Ahmedabad, Gujarat - 380009",
    recentVendorOrders: [
      { id: "SC-10001", product: "Aster Pro ANC Headphones", amount: 7499, date: "Aug 10, 2026", status: "Processing" },
      { id: "SC-9821", product: "Aster Pro ANC Headphones", amount: 7499, date: "Jun 15, 2026", status: "Delivered" },
    ]
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/vendor/customers"
            className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Customer Details</h1>
            <p className="text-xs text-slate-500">Store Buyer Summary</p>
          </div>
        </div>
      </div>

      {/* Customer Info Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-900 text-white font-bold text-lg flex items-center justify-center">
            {customer.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">{customer.name}</h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
              {customer.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs">
          <div>
            <span className="text-slate-400 font-semibold">Email Address</span>
            <p className="font-bold text-slate-800 mt-0.5">{customer.email}</p>
          </div>
          <div>
            <span className="text-slate-400 font-semibold">Phone Number</span>
            <p className="font-bold text-slate-800 mt-0.5">{customer.phone}</p>
          </div>
          <div>
            <span className="text-slate-400 font-semibold">Total Spent (Your Store)</span>
            <p className="font-bold text-emerald-600 text-sm mt-0.5">₹{customer.totalSpent.toLocaleString('en-IN')}</p>
          </div>
        </div>

        <div className="space-y-2 pt-4 border-t border-slate-100 text-xs">
          <span className="text-slate-400 font-semibold flex items-center gap-1">
            <MapPin size={14} className="text-blue-600" /> Shipping Address
          </span>
          <p className="font-medium text-slate-800">{customer.address}</p>
        </div>
      </div>

      {/* Order History with This Vendor */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-900">Store Order History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase">
              <tr>
                <th className="px-6 py-3">Order ID</th>
                <th className="px-6 py-3">Product</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {customer.recentVendorOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-bold text-slate-900">{order.id}</td>
                  <td className="px-6 py-4 font-medium text-slate-800">{order.product}</td>
                  <td className="px-6 py-4 text-slate-500">{order.date}</td>
                  <td className="px-6 py-4 font-bold text-slate-900">₹{order.amount.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4 text-right font-bold text-slate-700">{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VendorViewCustomer;
