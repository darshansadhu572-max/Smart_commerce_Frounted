import React from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Wallet, Store, CalendarDays, IndianRupee, CheckCircle, Clock, ArrowUpRight, CreditCard, Hash, AlertCircle, TrendingUp, } from "lucide-react";

const AdminViewPayout = ({ payouts = [] }) => {
    const { payoutId } = useParams();

    const payout = payouts.find(
        (item) => String(item.id) === String(payoutId)
    );

    /* MONEY FORMAT */

    const money = (value) =>
        `₹${Number(value || 0).toLocaleString("en-IN")}`;

    /* STATUS STYLE */

    const getStatusStyle = (status) => {
        switch (status) {
            case "Paid":
                return "bg-emerald-50 text-emerald-700 border-emerald-200";

            case "Partial":
                return "bg-amber-50 text-amber-700 border-amber-200";

            case "Pending":
                return "bg-orange-50 text-orange-700 border-orange-200";

            case "Processing":
                return "bg-blue-50 text-blue-700 border-blue-200";

            case "Failed":
                return "bg-red-50 text-red-700 border-red-200";

            default:
                return "bg-slate-50 text-slate-600 border-slate-200";
        }
    };

    /* NOT FOUND */

    if (!payout) {
        return (
            <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">

                <Wallet
                    size={46}
                    className="mx-auto text-slate-300 mb-4"
                />

                <h2 className="text-xl font-bold text-slate-900">
                    Payout Not Found
                </h2>

                <p className="text-slate-500 mt-2">
                    The payout settlement you are looking for does not exist.
                </p>

                <Link
                    to="/admin/payouts"
                    className="inline-flex items-center gap-2 mt-5 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-medium"
                >
                    <ArrowLeft size={16} />
                    Back to Payouts
                </Link>

            </div>
        );
    }

    /* PAYOUT HISTORY */

    const payoutHistory = payout.payoutHistory || [
        {
            id: "TRX-001",
            date: "Aug 05, 2026",
            amount: 20000,
            method: "Bank Transfer",
            transactionId: "UTR45892341",
            status: "Paid",
            note: "First partial settlement",
        },

        {
            id: "TRX-002",
            date: "Aug 10, 2026",
            amount: 15000,
            method: "UPI",
            transactionId: "UPI982341",
            status: "Paid",
            note: "Second vendor payout",
        },

        {
            id: "TRX-003",
            date: "Aug 14, 2026",
            amount: 15000,
            method: "Bank Transfer",
            transactionId: "UTR45892387",
            status: "Paid",
            note: "Third settlement payment",
        },
    ];

    /* PROGRESS */

    const payable = Number(payout.netPayable || 0);
    const paid = Number(payout.paidAmount || 0);

    const progress =
        payable > 0
            ? Math.min(Math.round((paid / payable) * 100), 100)
            : 0;

    return (
        <div className="space-y-6">

            {/* HEADER */}

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                <div className="flex items-center gap-3">

                    <Link
                        to="/admin/payouts"
                        className="p-2.5 border border-slate-200 rounded-xl hover:bg-slate-100 transition"
                    >
                        <ArrowLeft size={19} />
                    </Link>

                    <div>

                        <div className="flex items-center gap-3">

                            <h1 className="text-2xl font-bold text-slate-900">
                                Payout Settlement
                            </h1>

                            <span
                                className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusStyle(
                                    payout.status
                                )}`}
                            >
                                {payout.status}
                            </span>

                        </div>

                        <p className="text-sm text-slate-500 mt-1">
                            {payout.vendor?.name} · {payout.month}
                        </p>

                    </div>

                </div>


                {/* ACTION */}

                <div className="flex gap-2">

                    {payout.pendingAmount > 0 && (
                        <Link
                            to={`/admin/payouts/${payout.id}/make`}
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800"
                        >
                            <Wallet size={17} />
                            Make Payout
                        </Link>
                    )}

                </div>

            </div>


            {/* SETTLEMENT OVERVIEW */}

            <div className="bg-white border border-slate-200 rounded-2xl p-6">

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                    <div className="flex items-center gap-4">

                        <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-lg font-bold">
                            {payout.vendor?.initials ||
                                payout.vendor?.name?.charAt(0)}
                        </div>

                        <div>

                            <h2 className="text-lg font-semibold text-slate-900">
                                {payout.vendor?.name}
                            </h2>

                            <p className="text-sm text-slate-500">
                                {payout.vendor?.email}
                            </p>

                            <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">

                                <CalendarDays size={14} />

                                Settlement Period:

                                <span className="font-medium text-slate-700">
                                    {payout.month}
                                </span>

                            </div>

                        </div>

                    </div>


                    <div className="text-left lg:text-right">

                        <p className="text-sm text-slate-500">
                            Net Payable
                        </p>

                        <p className="text-3xl font-bold text-slate-900 mt-1">
                            {money(payout.netPayable)}
                        </p>

                    </div>

                </div>


                {/* PROGRESS */}

                <div className="mt-7">

                    <div className="flex justify-between text-sm mb-2">

                        <span className="text-slate-500">
                            Payout Progress
                        </span>

                        <span className="font-semibold text-slate-700">
                            {progress}%
                        </span>

                    </div>

                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">

                        <div
                            className="h-full bg-emerald-500 rounded-full transition-all"
                            style={{
                                width: `${progress}%`,
                            }}
                        />

                    </div>

                    <div className="flex justify-between text-xs text-slate-500 mt-2">

                        <span>
                            Paid: {money(payout.paidAmount)}
                        </span>

                        <span>
                            Remaining: {money(payout.pendingAmount)}
                        </span>

                    </div>

                </div>

            </div>


            {/* FINANCIAL SUMMARY */}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">

                {/* SALES */}

                <div className="bg-white border border-slate-200 rounded-2xl p-5">

                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">

                        <TrendingUp size={19} />

                    </div>

                    <p className="text-sm text-slate-500 mt-4">
                        Gross Sales
                    </p>

                    <p className="text-xl font-bold text-slate-900 mt-1">
                        {money(payout.grossSales)}
                    </p>

                </div>


                {/* COMMISSION */}

                <div className="bg-white border border-slate-200 rounded-2xl p-5">

                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">

                        <IndianRupee size={19} />

                    </div>

                    <p className="text-sm text-slate-500 mt-4">
                        Platform Commission
                    </p>

                    <p className="text-xl font-bold text-purple-600 mt-1">
                        {money(payout.commission)}
                    </p>

                </div>


                {/* NET */}

                <div className="bg-white border border-slate-200 rounded-2xl p-5">

                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">

                        <Wallet size={19} />

                    </div>

                    <p className="text-sm text-slate-500 mt-4">
                        Net Payable
                    </p>

                    <p className="text-xl font-bold text-slate-900 mt-1">
                        {money(payout.netPayable)}
                    </p>

                </div>


                {/* PAID */}

                <div className="bg-white border border-slate-200 rounded-2xl p-5">

                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">

                        <CheckCircle size={19} />

                    </div>

                    <p className="text-sm text-slate-500 mt-4">
                        Total Paid
                    </p>

                    <p className="text-xl font-bold text-emerald-600 mt-1">
                        {money(payout.paidAmount)}
                    </p>

                </div>


                {/* PENDING */}

                <div className="bg-white border border-slate-200 rounded-2xl p-5">

                    <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">

                        <Clock size={19} />

                    </div>

                    <p className="text-sm text-slate-500 mt-4">
                        Pending
                    </p>

                    <p className="text-xl font-bold text-orange-600 mt-1">
                        {money(payout.pendingAmount)}
                    </p>

                </div>

            </div>


            {/* MAIN CONTENT */}

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">


                {/* LEFT - PAYOUT HISTORY */}

                <div className="xl:col-span-2">

                    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">

                        <div className="p-5 border-b border-slate-200">

                            <div className="flex items-center justify-between">

                                <div>

                                    <h2 className="font-semibold text-slate-900">
                                        Payout History
                                    </h2>

                                    <p className="text-sm text-slate-500 mt-1">
                                        Individual payments made to this vendor
                                    </p>

                                </div>

                                <span className="text-sm text-slate-500">
                                    {payoutHistory.length} payments
                                </span>

                            </div>

                        </div>


                        {/* HISTORY */}

                        <div className="divide-y divide-slate-100">

                            {payoutHistory.length > 0 ? (

                                payoutHistory.map((payment) => (

                                    <div
                                        key={payment.id}
                                        className="p-5 hover:bg-slate-50 transition"
                                    >

                                        <div className="flex flex-col md:flex-row md:items-center gap-4">

                                            {/* ICON */}

                                            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">

                                                <CheckCircle size={19} />

                                            </div>


                                            {/* DETAILS */}

                                            <div className="flex-1">

                                                <div className="flex flex-wrap items-center gap-2">

                                                    <p className="font-semibold text-slate-900">
                                                        {money(payment.amount)}
                                                    </p>

                                                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs">
                                                        {payment.status}
                                                    </span>

                                                </div>

                                                <p className="text-sm text-slate-500 mt-1">
                                                    {payment.date} · {payment.method}
                                                </p>

                                                {payment.note && (
                                                    <p className="text-xs text-slate-400 mt-1">
                                                        {payment.note}
                                                    </p>
                                                )}

                                            </div>


                                            {/* TRANSACTION */}

                                            <div className="text-left md:text-right">

                                                <p className="text-xs text-slate-400">
                                                    Transaction / UTR
                                                </p>

                                                <p className="text-sm font-medium text-slate-700 mt-1">
                                                    {payment.transactionId || "-"}
                                                </p>

                                            </div>

                                        </div>

                                    </div>

                                ))

                            ) : (

                                <div className="p-10 text-center">

                                    <Clock
                                        size={35}
                                        className="mx-auto text-slate-300 mb-3"
                                    />

                                    <p className="font-medium text-slate-700">
                                        No payout history
                                    </p>

                                    <p className="text-sm text-slate-500 mt-1">
                                        No payments have been recorded for this settlement.
                                    </p>

                                </div>

                            )}

                        </div>

                    </div>

                </div>


                {/* RIGHT SIDEBAR */}

                <div className="space-y-6">


                    {/* VENDOR */}

                    <div className="bg-white border border-slate-200 rounded-2xl p-5">

                        <div className="flex items-center gap-3 mb-5">

                            <Store size={20} className="text-slate-600" />

                            <h2 className="font-semibold text-slate-900">
                                Vendor Information
                            </h2>

                        </div>


                        <div className="flex items-center gap-3">

                            <div className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center font-semibold">

                                {payout.vendor?.initials ||
                                    payout.vendor?.name?.charAt(0)}

                            </div>

                            <div>

                                <p className="font-medium text-slate-900">
                                    {payout.vendor?.name}
                                </p>

                                <p className="text-sm text-slate-500">
                                    {payout.vendor?.email}
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* SETTLEMENT */}

                    <div className="bg-white border border-slate-200 rounded-2xl p-5">

                        <div className="flex items-center gap-3 mb-5">

                            <Wallet size={20} className="text-slate-600" />

                            <h2 className="font-semibold text-slate-900">
                                Settlement Details
                            </h2>

                        </div>


                        <div className="space-y-4 text-sm">

                            <div className="flex justify-between gap-4">

                                <span className="text-slate-500">
                                    Settlement ID
                                </span>

                                <span className="font-medium text-slate-900">
                                    {payout.id}
                                </span>

                            </div>


                            <div className="flex justify-between gap-4">

                                <span className="text-slate-500">
                                    Period
                                </span>

                                <span className="font-medium text-slate-900">
                                    {payout.month}
                                </span>

                            </div>


                            <div className="flex justify-between gap-4">

                                <span className="text-slate-500">
                                    Gross Sales
                                </span>

                                <span className="font-medium text-slate-900">
                                    {money(payout.grossSales)}
                                </span>

                            </div>


                            <div className="flex justify-between gap-4">

                                <span className="text-slate-500">
                                    Commission
                                </span>

                                <span className="font-medium text-purple-600">
                                    - {money(payout.commission)}
                                </span>

                            </div>


                            <div className="pt-3 border-t border-slate-200 flex justify-between gap-4">

                                <span className="font-semibold text-slate-900">
                                    Net Payable
                                </span>

                                <span className="font-bold text-slate-900">
                                    {money(payout.netPayable)}
                                </span>

                            </div>

                        </div>

                    </div>


                    {/* PAYOUT STATUS */}

                    <div className="bg-white border border-slate-200 rounded-2xl p-5">

                        <h2 className="font-semibold text-slate-900 mb-4">
                            Payout Status
                        </h2>

                        <div className="flex items-center gap-3">

                            {payout.pendingAmount > 0 ? (
                                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                                    <Clock size={19} />
                                </div>
                            ) : (
                                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                    <CheckCircle size={19} />
                                </div>
                            )}

                            <div>

                                <p className="font-medium text-slate-900">
                                    {payout.pendingAmount > 0
                                        ? "Payment Pending"
                                        : "Fully Paid"}
                                </p>

                                <p className="text-sm text-slate-500 mt-0.5">

                                    {payout.pendingAmount > 0
                                        ? `${money(
                                            payout.pendingAmount
                                        )} remaining`
                                        : "No outstanding amount"}

                                </p>

                            </div>

                        </div>

                    </div>


                    {/* ACTION */}

                    {payout.pendingAmount > 0 && (

                        <div className="bg-slate-900 rounded-2xl p-5 text-white">

                            <div className="flex items-center gap-3">

                                <AlertCircle size={20} />

                                <div>

                                    <p className="font-semibold">
                                        Outstanding Payout
                                    </p>

                                    <p className="text-sm text-slate-300 mt-1">
                                        {money(payout.pendingAmount)} is still payable to this vendor.
                                    </p>

                                </div>

                            </div>


                            <Link
                                to={`/admin/payouts/${payout.id}/make`}
                                className="mt-5 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-slate-900 rounded-xl text-sm font-semibold hover:bg-slate-100"
                            >

                                Make Payout

                                <ArrowUpRight size={16} />

                            </Link>

                        </div>

                    )}

                </div>

            </div>

        </div>
    );
};

export default AdminViewPayout;