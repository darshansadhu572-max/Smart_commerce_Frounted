import React from "react";
import { Link } from "react-router-dom";
import { IndianRupee, TrendingUp, Wallet, ArrowUpRight, ArrowDownRight, CreditCard, ShieldCheck } from "lucide-react";

const VendorEarnings = ({ earnings = {} }) => {
  const defaultEarnings = {
    grossSales: 245000,
    platformCommission: 24500,
    refunds: 5000,
    netEarnings: 215500,
    paidOut: 180000,
    pendingPayout: 35500,
    availableBalance: 35500,
    monthlyChart: [
      { month: "Jan", sales: 18000 },
      { month: "Feb", sales: 25000 },
      { month: "Mar", sales: 32000 },
      { month: "Apr", sales: 41000 },
      { month: "May", sales: 38000 },
      { month: "Jun", sales: 52000 },
      { month: "Jul", sales: 65000 },
    ],
    recentTransactions: [
      { id: "TXN-901", date: "Aug 10, 2026", type: "Sale Credit", orderId: "SC-10001", amount: 7499, status: "Completed" },
      { id: "TXN-902", date: "Aug 09, 2026", type: "Commission Deduction", orderId: "SC-10001", amount: -750, status: "Completed" },
      { id: "TXN-903", date: "Aug 08, 2026", type: "Payout Settlement", orderId: "PO-10024", amount: -74000, status: "Paid Out" },
    ]
  };

  const data = { ...defaultEarnings, ...earnings };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Vendor Earnings</h1>
          <p className="text-xs text-slate-500 mt-1">Multi-vendor revenue, commission calculations, and balance overview</p>
        </div>
        <Link
          to="/vendor/payouts"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition inline-flex items-center gap-2"
        >
          <Wallet size={16} /> View Payout History
        </Link>
      </div>

      {/* Main Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-400">Gross Sales</span>
          <p className="text-2xl font-black text-slate-900">₹{data.grossSales.toLocaleString('en-IN')}</p>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
            <ArrowUpRight size={14} /> +14.2% vs last month
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold text-rose-500">Platform Commission (10%)</span>
          <p className="text-2xl font-black text-slate-900">₹{data.platformCommission.toLocaleString('en-IN')}</p>
          <p className="text-[10px] text-slate-400">Deducted automatically by platform</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold text-amber-600">Refunds Deduction</span>
          <p className="text-2xl font-black text-slate-900">₹{data.refunds.toLocaleString('en-IN')}</p>
          <p className="text-[10px] text-slate-400">Customer returns & cancellations</p>
        </div>

        <div className="bg-blue-900 text-white p-5 rounded-2xl shadow-md space-y-2">
          <span className="text-xs font-bold text-blue-200">Net Earnings</span>
          <p className="text-2xl font-black text-white">₹{data.netEarnings.toLocaleString('en-IN')}</p>
          <div className="flex items-center justify-between text-[10px] text-blue-200 pt-1 border-t border-blue-800">
            <span>Paid Out: ₹{data.paidOut.toLocaleString('en-IN')}</span>
            <span className="font-bold text-emerald-400">Pending: ₹{data.pendingPayout.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Sales Chart Representation & Balance Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Sales Chart Bar */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp size={18} className="text-blue-600" />
              Monthly Revenue Performance
            </h2>
            <span className="text-xs text-slate-400 font-semibold">2026 Financial Year</span>
          </div>
          <div className="h-44 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-slate-100">
            {data.monthlyChart.map((item, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <div
                  style={{ height: `${(item.sales / 70000) * 100}%` }}
                  className="w-full bg-blue-600 hover:bg-blue-700 rounded-t-lg transition-all"
                  title={`₹${item.sales}`}
                />
                <span className="text-[10px] font-bold text-slate-500">{item.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Payout & Settlement Box */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck size={18} className="text-emerald-600" />
              Payout Balance
            </h2>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Available Payout Balance</span>
              <p className="text-2xl font-black text-slate-900">₹{data.availableBalance.toLocaleString('en-IN')}</p>
              <p className="text-[11px] text-slate-500">Next settlement date: <span className="font-semibold text-slate-800">Aug 31, 2026</span></p>
            </div>
          </div>
          <Link
            to="/vendor/payouts"
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold text-center block transition"
          >
            Check Payout History
          </Link>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">Recent Revenue Transactions</h2>
          <span className="text-xs text-slate-400">Automatic Audit Log</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase">
              <tr>
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Reference</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.recentTransactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-mono font-semibold text-slate-900">{txn.id}</td>
                  <td className="px-6 py-4 text-slate-500">{txn.date}</td>
                  <td className="px-6 py-4 font-medium text-slate-800">{txn.type}</td>
                  <td className="px-6 py-4 text-slate-500">{txn.orderId}</td>
                  <td className={`px-6 py-4 font-bold ${txn.amount > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {txn.amount > 0 ? `+₹${txn.amount.toLocaleString('en-IN')}` : `-₹${Math.abs(txn.amount).toLocaleString('en-IN')}`}
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-slate-700">{txn.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VendorEarnings;
