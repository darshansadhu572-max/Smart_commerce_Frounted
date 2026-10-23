import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Edit, } from "lucide-react";

const VendorShipping = ({ shippingList = [] }) => {
  const defaultList = [
    {
      id: "SC-10021",
      customerName: "Aarav Patel",
      courier: "Delhivery",
      trackingNumber: "DEL98231",
      status: "Shipped",
      shippingDate: "Aug 10, 2026",
      expectedDelivery: "Aug 13, 2026",
    },
    {
      id: "SC-10022",
      customerName: "Meera Shah",
      courier: "BlueDart",
      trackingNumber: "BD88231",
      status: "Delivered",
      shippingDate: "Aug 08, 2026",
      expectedDelivery: "Aug 11, 2026",
    },
    {
      id: "SC-10023",
      customerName: "Kabir Joshi",
      courier: "DTDC",
      trackingNumber: "DT98124",
      status: "Ready to Ship",
      shippingDate: "Aug 11, 2026",
      expectedDelivery: "Aug 14, 2026",
    },
  ];

  const list = shippingList.length > 0 ? shippingList : defaultList;
  const [searchTerm, setSearchTerm] = useState("");

  const filteredList = list.filter(
    (item) =>
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Shipping & Logistics</h1>
          <p className="text-xs text-slate-500 mt-1">Track courier assignments, dispatch dates, and delivery status</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Order ID, Customer, or Tracking Number..."
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
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Courier Provider</th>
                <th className="px-6 py-4">Tracking #</th>
                <th className="px-6 py-4">Ship Date</th>
                <th className="px-6 py-4">Expected Delivery</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredList.map((ship) => (
                <tr key={ship.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4 font-bold text-slate-900">{ship.id}</td>
                  <td className="px-6 py-4 font-semibold text-slate-800">{ship.customerName}</td>
                  <td className="px-6 py-4 font-medium text-slate-800">{ship.courier}</td>
                  <td className="px-6 py-4 font-mono font-bold text-blue-600">{ship.trackingNumber}</td>
                  <td className="px-6 py-4 text-slate-500">{ship.shippingDate}</td>
                  <td className="px-6 py-4 text-slate-500">{ship.expectedDelivery}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${ship.status === "Delivered"
                        ? "bg-emerald-50 text-emerald-700"
                        : ship.status === "Shipped"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-amber-50 text-amber-700"
                      }`}>
                      {ship.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      to={`/vendor/shipping/${ship.id}`}
                      className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold text-[11px] inline-flex items-center gap-1 transition"
                    >
                      <Edit size={14} /> Update Shipping
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VendorShipping;
