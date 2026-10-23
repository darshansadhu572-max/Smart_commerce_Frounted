import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Eye, CreditCard, CheckCircle, Clock, RotateCcw, XCircle, IndianRupee, Filter, } from "lucide-react";

const AdminPayments = ({ payments = [] }) => {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [methodFilter, setMethodFilter] = useState("All");

    const filteredPayments = useMemo(() => {
        return payments.filter((payment) => {
            const searchText = search.toLowerCase();

            const matchesSearch =
                payment.id?.toLowerCase().includes(searchText) ||
                payment.orderId?.toLowerCase().includes(searchText) ||
                payment.customer?.name?.toLowerCase().includes(searchText) ||
                payment.customer?.email?.toLowerCase().includes(searchText) ||
                payment.transactionId?.toLowerCase().includes(searchText);

            const matchesStatus =
                statusFilter === "All" ||
                payment.status === statusFilter;

            const matchesMethod =
                methodFilter === "All" ||
                payment.method === methodFilter;

            return (
                matchesSearch &&
                matchesStatus &&
                matchesMethod
            );
        });
    }, [payments, search, statusFilter, methodFilter]);

    const totalAmount = payments.reduce(
        (sum, payment) => sum + Number(payment.amount || 0),
        0
    );

    const paidAmount = payments
        .filter((payment) => payment.status === "Paid")
        .reduce(
            (sum, payment) => sum + Number(payment.amount || 0),
            0
        );

    const pendingAmount = payments
        .filter((payment) => payment.status === "Pending")
        .reduce(
            (sum, payment) => sum + Number(payment.amount || 0),
            0
        );

    const refundedAmount = payments
        .filter((payment) => payment.status === "Refunded")
        .reduce(
            (sum, payment) => sum + Number(payment.amount || 0),
            0
        );

    const money = (value) =>
        `₹${Number(value || 0).toLocaleString("en-IN")}`;

    const statusStyle = {
        Paid: "bg-emerald-50 text-emerald-700",
        Pending: "bg-amber-50 text-amber-700",
        Failed: "bg-red-50 text-red-700",
        Refunded: "bg-purple-50 text-purple-700",
        PartiallyRefunded: "bg-blue-50 text-blue-700",
    };

    return (
        <div className="space-y-6">

            {/* HEADER */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900">
                    Payments
                </h1>

                <p className="text-sm text-slate-500 mt-1">
                    Monitor customer payments, transactions and refunds.
                </p>
            </div>


            {/* SUMMARY CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

                {/* TOTAL */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5">

                    <div className="flex items-center justify-between">

                        <div>
                            <p className="text-sm text-slate-500">
                                Total Payments
                            </p>

                            <h2 className="text-2xl font-bold text-slate-900 mt-2">
                                {money(totalAmount)}
                            </h2>

                            <p className="text-xs text-slate-400 mt-1">
                                {payments.length} transactions
                            </p>
                        </div>

                        <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center">
                            <IndianRupee
                                size={21}
                                className="text-slate-700"
                            />
                        </div>

                    </div>

                </div>


                {/* PAID */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5">

                    <div className="flex items-center justify-between">

                        <div>
                            <p className="text-sm text-slate-500">
                                Successful
                            </p>

                            <h2 className="text-2xl font-bold text-emerald-600 mt-2">
                                {money(paidAmount)}
                            </h2>

                            <p className="text-xs text-slate-400 mt-1">
                                Completed payments
                            </p>
                        </div>

                        <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">
                            <CheckCircle
                                size={21}
                                className="text-emerald-600"
                            />
                        </div>

                    </div>

                </div>


                {/* PENDING */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5">

                    <div className="flex items-center justify-between">

                        <div>
                            <p className="text-sm text-slate-500">
                                Pending
                            </p>

                            <h2 className="text-2xl font-bold text-amber-600 mt-2">
                                {money(pendingAmount)}
                            </h2>

                            <p className="text-xs text-slate-400 mt-1">
                                Awaiting confirmation
                            </p>
                        </div>

                        <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center">
                            <Clock
                                size={21}
                                className="text-amber-600"
                            />
                        </div>

                    </div>

                </div>


                {/* REFUNDED */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5">

                    <div className="flex items-center justify-between">

                        <div>
                            <p className="text-sm text-slate-500">
                                Refunded
                            </p>

                            <h2 className="text-2xl font-bold text-purple-600 mt-2">
                                {money(refundedAmount)}
                            </h2>

                            <p className="text-xs text-slate-400 mt-1">
                                Refund transactions
                            </p>
                        </div>

                        <div className="w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center">
                            <RotateCcw
                                size={21}
                                className="text-purple-600"
                            />
                        </div>

                    </div>

                </div>

            </div>


            {/* FILTERS */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4">

                <div className="flex flex-col lg:flex-row gap-3">

                    {/* SEARCH */}
                    <div className="relative flex-1">

                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            type="text"
                            placeholder="Search payment, order, customer or transaction..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-slate-400"
                        />

                    </div>


                    {/* STATUS */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-3 border border-slate-200 rounded-xl outline-none bg-white"
                    >
                        <option>All</option>
                        <option>Paid</option>
                        <option>Pending</option>
                        <option>Failed</option>
                        <option>Refunded</option>
                        <option>PartiallyRefunded</option>
                    </select>


                    {/* METHOD */}
                    <select
                        value={methodFilter}
                        onChange={(e) => setMethodFilter(e.target.value)}
                        className="px-4 py-3 border border-slate-200 rounded-xl outline-none bg-white"
                    >
                        <option>All</option>
                        <option>UPI</option>
                        <option>Credit / Debit Card</option>
                        <option>Net Banking</option>
                        <option>Wallet</option>
                        <option>Cash on Delivery</option>
                    </select>

                </div>

            </div>


            {/* TABLE */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">

                <div className="p-5 border-b border-slate-200 flex items-center gap-2">

                    <Filter size={18} className="text-slate-500" />

                    <h2 className="font-semibold text-slate-900">
                        Payment Transactions
                    </h2>

                    <span className="text-sm text-slate-400">
                        ({filteredPayments.length})
                    </span>

                </div>


                <div className="overflow-x-auto">

                    <table className="w-full text-sm">

                        <thead className="bg-slate-50 border-b border-slate-200">

                            <tr>

                                <th className="text-left px-5 py-4 font-semibold text-slate-600">
                                    Payment
                                </th>

                                <th className="text-left px-5 py-4 font-semibold text-slate-600">
                                    Customer
                                </th>

                                <th className="text-left px-5 py-4 font-semibold text-slate-600">
                                    Vendor
                                </th>

                                <th className="text-left px-5 py-4 font-semibold text-slate-600">
                                    Method
                                </th>

                                <th className="text-left px-5 py-4 font-semibold text-slate-600">
                                    Amount
                                </th>

                                <th className="text-left px-5 py-4 font-semibold text-slate-600">
                                    Status
                                </th>

                                <th className="text-left px-5 py-4 font-semibold text-slate-600">
                                    Date
                                </th>

                                <th className="text-right px-5 py-4 font-semibold text-slate-600">
                                    Action
                                </th>

                            </tr>

                        </thead>


                        <tbody className="divide-y divide-slate-100">

                            {filteredPayments.length > 0 ? (

                                filteredPayments.map((payment) => (

                                    <tr
                                        key={payment.id}
                                        className="hover:bg-slate-50"
                                    >

                                        <td className="px-5 py-4">

                                            <div className="flex items-center gap-3">

                                                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                                                    <CreditCard
                                                        size={18}
                                                        className="text-slate-600"
                                                    />
                                                </div>

                                                <div>

                                                    <p className="font-semibold text-slate-900">
                                                        {payment.id}
                                                    </p>

                                                    <p className="text-xs text-slate-400">
                                                        Order #{payment.orderId}
                                                    </p>

                                                </div>

                                            </div>

                                        </td>


                                        <td className="px-5 py-4">

                                            <p className="font-medium text-slate-900">
                                                {payment.customer?.name}
                                            </p>

                                            <p className="text-xs text-slate-400">
                                                {payment.customer?.email}
                                            </p>

                                        </td>


                                        <td className="px-5 py-4 text-slate-600">
                                            {payment.vendor || "Multiple Vendors"}
                                        </td>


                                        <td className="px-5 py-4 text-slate-600">
                                            {payment.method}
                                        </td>


                                        <td className="px-5 py-4">

                                            <span className="font-semibold text-slate-900">
                                                {money(payment.amount)}
                                            </span>

                                        </td>


                                        <td className="px-5 py-4">

                                            <span
                                                className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle[payment.status] ||
                                                    "bg-slate-100 text-slate-600"
                                                    }`}
                                            >
                                                {payment.status}
                                            </span>

                                        </td>


                                        <td className="px-5 py-4 text-slate-500">
                                            {payment.date}
                                        </td>


                                        <td className="px-5 py-4 text-right">

                                            <Link
                                                to={`/admin/payments/${payment.id}`}
                                                className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 hover:bg-slate-100"
                                            >
                                                <Eye size={17} />
                                            </Link>

                                        </td>

                                    </tr>

                                ))

                            ) : (

                                <tr>

                                    <td
                                        colSpan="8"
                                        className="px-5 py-12 text-center"
                                    >

                                        <CreditCard
                                            size={40}
                                            className="mx-auto text-slate-300"
                                        />

                                        <p className="mt-3 font-medium text-slate-700">
                                            No payments found
                                        </p>

                                        <p className="text-sm text-slate-400 mt-1">
                                            Try changing your search or filters.
                                        </p>

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

export default AdminPayments;