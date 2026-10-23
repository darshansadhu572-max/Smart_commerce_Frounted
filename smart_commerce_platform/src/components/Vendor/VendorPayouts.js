import React from "react";
import { Link } from "react-router-dom";
import { Wallet, Eye, Download, CheckCircle, Clock, AlertCircle } from "lucide-react";

const VendorPayouts = ({ payouts = [] }) => {
  const defaultPayouts = [
    {
      id: "PO-10024",
      period: "01 Aug – 31 Aug 2026",
      grossSales: 85000,
      commission: 8500,
      refunds: 2000,
      adjustments: 500,
      netAmount: 74000,
      payoutDate: "31 Aug 2026",
      paymentMethod: "Bank Transfer (HDFC)",
      status: "Paid",
    },
    {
      id: "PO-10023",
      period: "01 Jul – 31 Jul 2026",
      grossSales: 110000,
      commission: 11000,
      refunds: 3000,
      adjustments: 0,
      netAmount: 96000,
      payoutDate: "31 Jul 2026",
      paymentMethod: "Bank Transfer (HDFC)",
      status: "Paid",
    },
    {
      id: "PO-10022",
      period: "01 Jun – 30 Jun 2026",
      grossSales: 50000,
      commission: 5000,
      refunds: 0,
      adjustments: 0,
      netAmount: 45000,
      payoutDate: "30 Jun 2026",
      paymentMethod: "UPI (vendor@upi)",
      status: "Paid",
    },
  ];

  const list = payouts.length > 0 ? payouts : defaultPayouts;

  const getStatusBadge = (status) => {
    switch (status) {
      case "Paid": return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Processing": return "bg-blue-50 text-blue-700 border-blue-200";
      case "Pending": return "bg-amber-50 text-amber-700 border-amber-200";
      case "Failed": return "bg-rose-50 text-rose-700 border-rose-200";
      default: return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Payout Settlements</h1>
          <p className="text-xs text-slate-500 mt-1">History of platform payout transfers and bank settlements</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Payout ID</th>
                <th className="px-6 py-4">Period</th>
                <th className="px-6 py-4">Gross Sales</th>
                <th className="px-6 py-4">Commission</th>
                <th className="px-6 py-4">Refunds</th>
                <th className="px-6 py-4">Net Payout</th>
                <th className="px-6 py-4">Payout Date</th>
                <th className="px-6 py-4">Payment Method</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {list.map((payout) => (
                <tr key={payout.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4 font-mono font-bold text-slate-900">{payout.id}</td>
                  <td className="px-6 py-4 text-slate-700 font-medium">{payout.period}</td>
                  <td className="px-6 py-4 font-medium text-slate-800">₹{payout.grossSales.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4 text-rose-600 font-medium">-₹{payout.commission.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4 text-rose-600 font-medium">-₹{payout.refunds.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4 font-black text-emerald-600 text-sm">₹{payout.netAmount.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4 text-slate-500">{payout.payoutDate}</td>
                  <td className="px-6 py-4 text-slate-600">{payout.paymentMethod}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusBadge(payout.status)}`}>
                      {payout.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      to={`/vendor/payouts/${payout.id}`}
                      className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold text-[11px] inline-flex items-center gap-1 transition"
                    >
                      <Eye size={14} /> View Details
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

export default VendorPayouts;
