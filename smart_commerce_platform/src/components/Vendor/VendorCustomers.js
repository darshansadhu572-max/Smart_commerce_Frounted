import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Users, Eye, Mail, Phone, ShoppingBag } from "lucide-react";

const VendorCustomers = ({ customers = [] }) => {
  const defaultCustomers = [
    {
      id: "cust-101",
      name: "Aarav Patel",
      email: "aarav.patel@example.com",
      phone: "+91 98765 43210",
      orderCount: 4,
      totalSpent: 29996,
      lastOrderDate: "Aug 10, 2026",
      status: "Active Buyer",
    },
    {
      id: "cust-102",
      name: "Meera Shah",
      email: "meera.shah@example.com",
      phone: "+91 98123 45678",
      orderCount: 2,
      totalSpent: 8760,
      lastOrderDate: "Aug 09, 2026",
      status: "Active Buyer",
    },
    {
      id: "cust-103",
      name: "Kabir Joshi",
      email: "kabir.j@example.com",
      phone: "+91 97654 32109",
      orderCount: 1,
      totalSpent: 3199,
      lastOrderDate: "Aug 05, 2026",
      status: "Active Buyer",
    },
  ];

  const list = customers.length > 0 ? customers : defaultCustomers;
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCustomers = list.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Vendor Customers</h1>
          <p className="text-xs text-slate-500 mt-1">Buyers who purchased products from your store</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search customer by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Customer Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Vendor Orders</th>
                <th className="px-6 py-4">Total Spent</th>
                <th className="px-6 py-4">Last Order</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 font-bold text-slate-900">{cust.name}</td>
                    <td className="px-6 py-4 text-slate-500">{cust.email}</td>
                    <td className="px-6 py-4 text-slate-500">{cust.phone}</td>
                    <td className="px-6 py-4 font-bold text-slate-900">{cust.orderCount} order(s)</td>
                    <td className="px-6 py-4 font-bold text-emerald-600">₹{cust.totalSpent.toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4 text-slate-400">{cust.lastOrderDate}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                        {cust.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/vendor/customers/${cust.id}`}
                        className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold text-[11px] inline-flex items-center gap-1 transition"
                      >
                        <Eye size={14} /> View Details
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-10 text-center text-slate-400">
                    No customers found.
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

export default VendorCustomers;
