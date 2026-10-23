import React from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Wallet, CheckCircle, ShieldCheck, Download, CreditCard } from "lucide-react";

const VendorPayoutDetail = ({ payouts = [] }) => {
  const { payoutId } = useParams();

  const payout = payouts.find((p) => p.id === payoutId) || {
    id: payoutId || "PO-10024",
    period: "01 Aug – 31 Aug 2026",
    grossSales: 85000,
    commission: 8500,
    refunds: 2000,
    adjustments: 500,
    netAmount: 74000,
    status: "Paid",
    payoutDate: "31 Aug 2026",
    transactionId: "PAYTXN98231",
    bankName: "HDFC Bank Ltd",
    accountNumber: "•••• •••• 4921",
    ifscCode: "HDFC0001234",
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back & Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/vendor/payouts"
            className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Payout Settlement Details</h1>
            <p className="text-xs text-slate-500">Payout Record #{payout.id}</p>
          </div>
        </div>
        <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition inline-flex items-center gap-2">
          <Download size={15} /> Download PDF Receipt
        </button>
      </div>

      {/* Main Settlement Box */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
        
        {/* Header Status */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck size={26} />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold">Settlement Status</p>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 mt-1">
                <CheckCircle size={14} /> {payout.status}
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400 font-semibold">Settlement Period</p>
            <p className="text-sm font-bold text-slate-900 mt-0.5">{payout.period}</p>
          </div>
        </div>

        {/* Itemized Calculation */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Itemized Calculation Breakdown</h2>
          
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-600 font-medium">Gross Store Sales</span>
              <span className="font-bold text-slate-900">₹{payout.grossSales.toLocaleString('en-IN')}</span>
            </div>

            <div className="flex justify-between py-2 border-b border-slate-100 text-rose-600">
              <span className="font-medium">Platform Commission (10%)</span>
              <span className="font-bold">-₹{payout.commission.toLocaleString('en-IN')}</span>
            </div>

            <div className="flex justify-between py-2 border-b border-slate-100 text-rose-600">
              <span className="font-medium">Customer Refunds Deduction</span>
              <span className="font-bold">-₹{payout.refunds.toLocaleString('en-IN')}</span>
            </div>

            <div className="flex justify-between py-2 border-b border-slate-100 text-slate-600">
              <span className="font-medium">Platform Adjustments / Charges</span>
              <span className="font-bold">-₹{payout.adjustments.toLocaleString('en-IN')}</span>
            </div>

            <div className="flex justify-between py-3 text-base font-black text-blue-900 bg-blue-50/60 px-4 rounded-xl">
              <span>Net Payout Amount</span>
              <span>₹{payout.netAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Bank & Transaction Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs">
          <div className="bg-slate-50 p-4 rounded-xl space-y-1">
            <span className="text-slate-400 font-semibold">Bank Account</span>
            <p className="font-bold text-slate-900">{payout.bankName}</p>
            <p className="text-slate-500">{payout.accountNumber} ({payout.ifscCode})</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl space-y-1">
            <span className="text-slate-400 font-semibold">Transaction Reference</span>
            <p className="font-mono font-bold text-blue-600">{payout.transactionId}</p>
            <p className="text-slate-500">Paid Date: {payout.payoutDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorPayoutDetail;
