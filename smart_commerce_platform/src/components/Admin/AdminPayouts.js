import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, Wallet, IndianRupee, Clock, CheckCircle, ArrowUpRight, CalendarDays, Store, CircleDollarSign, AlertCircle, } from "lucide-react";

const AdminPayouts = ({ payouts = [] }) => {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [monthFilter, setMonthFilter] = useState("All");

    /* FILTER PAYOUTS */

    const filteredPayouts = useMemo(() => {
        return payouts.filter((payout) => {
            const matchesSearch =
                payout.vendor?.name
                    ?.toLowerCase()
                    .includes(search.toLowerCase()) ||
                payout.vendor?.email
                    ?.toLowerCase()
                    .includes(search.toLowerCase());

            const matchesStatus =
                statusFilter === "All" ||
                payout.status === statusFilter;

            const matchesMonth =
                monthFilter === "All" ||
                payout.month === monthFilter;

            return (
                matchesSearch &&
                matchesStatus &&
                matchesMonth
            );
        });
    }, [payouts, search, statusFilter, monthFilter]);

    /* SUMMARY */

    const summary = useMemo(() => {
        return filteredPayouts.reduce(
            (acc, payout) => {
                acc.sales += Number(payout.grossSales || 0);
                acc.commission += Number(payout.commission || 0);
                acc.payable += Number(payout.netPayable || 0);
                acc.paid += Number(payout.paidAmount || 0);
                acc.pending += Number(payout.pendingAmount || 0);

                return acc;
            },
            {
                sales: 0,
                commission: 0,
                payable: 0,
                paid: 0,
                pending: 0,
            }
        );
    }, [filteredPayouts]);

    /* MONEY */

    const money = (value) =>
        `₹${Number(value || 0).toLocaleString("en-IN")}`;

    /* STATUS */

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

    return (
        <div className="space-y-6">

            {/* PAGE HEADER */}

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                <div>

                    <div className="flex items-center gap-2">

                        <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                            <Wallet size={20} />
                        </div>

                        <div>

                            <h1 className="text-2xl font-bold text-slate-900">
                                Vendor Payouts
                            </h1>

                            <p className="text-sm text-slate-500 mt-1">
                                Manage vendor earnings, settlements and payouts.
                            </p>

                        </div>

                    </div>

                </div>

            </div>


            {/* SUMMARY CARDS */}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">

                {/* SALES */}

                <div className="bg-white border border-slate-200 rounded-2xl p-5">

                    <div className="flex items-center justify-between">

                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <IndianRupee size={19} />
                        </div>

                        <span className="text-xs text-slate-400">
                            Sales
                        </span>

                    </div>

                    <p className="text-sm text-slate-500 mt-4">
                        Gross Sales
                    </p>

                    <p className="text-xl font-bold text-slate-900 mt-1">
                        {money(summary.sales)}
                    </p>

                </div>


                {/* COMMISSION */}

                <div className="bg-white border border-slate-200 rounded-2xl p-5">

                    <div className="flex items-center justify-between">

                        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                            <CircleDollarSign size={19} />
                        </div>

                        <span className="text-xs text-slate-400">
                            Platform
                        </span>

                    </div>

                    <p className="text-sm text-slate-500 mt-4">
                        Commission
                    </p>

                    <p className="text-xl font-bold text-slate-900 mt-1">
                        {money(summary.commission)}
                    </p>

                </div>


                {/* PAYABLE */}

                <div className="bg-white border border-slate-200 rounded-2xl p-5">

                    <div className="flex items-center justify-between">

                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                            <Wallet size={19} />
                        </div>

                        <span className="text-xs text-slate-400">
                            Settlement
                        </span>

                    </div>

                    <p className="text-sm text-slate-500 mt-4">
                        Net Payable
                    </p>

                    <p className="text-xl font-bold text-slate-900 mt-1">
                        {money(summary.payable)}
                    </p>

                </div>


                {/* PAID */}

                <div className="bg-white border border-slate-200 rounded-2xl p-5">

                    <div className="flex items-center justify-between">

                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <CheckCircle size={19} />
                        </div>

                        <span className="text-xs text-slate-400">
                            Completed
                        </span>

                    </div>

                    <p className="text-sm text-slate-500 mt-4">
                        Paid to Vendors
                    </p>

                    <p className="text-xl font-bold text-slate-900 mt-1">
                        {money(summary.paid)}
                    </p>

                </div>


                {/* PENDING */}

                <div className="bg-white border border-slate-200 rounded-2xl p-5">

                    <div className="flex items-center justify-between">

                        <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                            <Clock size={19} />
                        </div>

                        <span className="text-xs text-slate-400">
                            Outstanding
                        </span>

                    </div>

                    <p className="text-sm text-slate-500 mt-4">
                        Pending Payout
                    </p>

                    <p className="text-xl font-bold text-slate-900 mt-1">
                        {money(summary.pending)}
                    </p>

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
                            placeholder="Search vendor..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-slate-400 text-sm"
                        />

                    </div>


                    {/* MONTH */}

                    <div className="relative">

                        <CalendarDays
                            size={17}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <select
                            value={monthFilter}
                            onChange={(e) =>
                                setMonthFilter(e.target.value)
                            }
                            className="pl-10 pr-8 py-2.5 border border-slate-200 rounded-xl outline-none text-sm bg-white"
                        >

                            <option value="All">
                                All Months
                            </option>

                            <option value="August 2026">
                                August 2026
                            </option>

                            <option value="July 2026">
                                July 2026
                            </option>

                            <option value="June 2026">
                                June 2026
                            </option>

                        </select>

                    </div>


                    {/* STATUS */}

                    <div className="relative">

                        <Filter
                            size={17}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <select
                            value={statusFilter}
                            onChange={(e) =>
                                setStatusFilter(e.target.value)
                            }
                            className="pl-10 pr-8 py-2.5 border border-slate-200 rounded-xl outline-none text-sm bg-white"
                        >

                            <option value="All">
                                All Status
                            </option>

                            <option value="Paid">
                                Paid
                            </option>

                            <option value="Partial">
                                Partial
                            </option>

                            <option value="Pending">
                                Pending
                            </option>

                            <option value="Processing">
                                Processing
                            </option>

                            <option value="Failed">
                                Failed
                            </option>

                        </select>

                    </div>

                </div>

            </div>


            {/* PAYOUT TABLE */}

            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">

                <div className="p-5 border-b border-slate-200 flex items-center justify-between">

                    <div>

                        <h2 className="font-semibold text-slate-900">
                            Vendor Settlements
                        </h2>

                        <p className="text-sm text-slate-500 mt-1">
                            Monthly earnings and payout status
                        </p>

                    </div>

                    <span className="text-sm text-slate-500">
                        {filteredPayouts.length} vendors
                    </span>

                </div>


                {/* DESKTOP TABLE */}

                <div className="hidden xl:block overflow-x-auto">

                    <table className="w-full">

                        <thead className="bg-slate-50 border-b border-slate-200">

                            <tr>

                                <th className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase">
                                    Vendor
                                </th>

                                <th className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase">
                                    Period
                                </th>

                                <th className="text-right px-5 py-4 text-xs font-semibold text-slate-500 uppercase">
                                    Sales
                                </th>

                                <th className="text-right px-5 py-4 text-xs font-semibold text-slate-500 uppercase">
                                    Commission
                                </th>

                                <th className="text-right px-5 py-4 text-xs font-semibold text-slate-500 uppercase">
                                    Payable
                                </th>

                                <th className="text-right px-5 py-4 text-xs font-semibold text-slate-500 uppercase">
                                    Paid
                                </th>

                                <th className="text-right px-5 py-4 text-xs font-semibold text-slate-500 uppercase">
                                    Pending
                                </th>

                                <th className="text-center px-5 py-4 text-xs font-semibold text-slate-500 uppercase">
                                    Status
                                </th>

                                <th className="text-right px-5 py-4 text-xs font-semibold text-slate-500 uppercase">
                                    Action
                                </th>

                            </tr>

                        </thead>


                        <tbody className="divide-y divide-slate-100">

                            {filteredPayouts.length > 0 ? (

                                filteredPayouts.map((payout) => (

                                    <tr
                                        key={payout.id}
                                        className="hover:bg-slate-50 transition"
                                    >

                                        {/* VENDOR */}

                                        <td className="px-5 py-4">

                                            <div className="flex items-center gap-3">

                                                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-semibold text-sm">
                                                    {payout.vendor?.initials ||
                                                        payout.vendor?.name?.charAt(0)}
                                                </div>

                                                <div>

                                                    <p className="font-medium text-slate-900">
                                                        {payout.vendor?.name}
                                                    </p>

                                                    <p className="text-xs text-slate-500">
                                                        {payout.vendor?.email}
                                                    </p>

                                                </div>

                                            </div>

                                        </td>


                                        {/* PERIOD */}

                                        <td className="px-5 py-4">

                                            <div className="flex items-center gap-2 text-sm text-slate-700">

                                                <CalendarDays size={15} />

                                                {payout.month}

                                            </div>

                                        </td>


                                        {/* SALES */}

                                        <td className="px-5 py-4 text-right font-medium text-slate-900">
                                            {money(payout.grossSales)}
                                        </td>


                                        {/* COMMISSION */}

                                        <td className="px-5 py-4 text-right text-purple-600 font-medium">
                                            {money(payout.commission)}
                                        </td>


                                        {/* PAYABLE */}

                                        <td className="px-5 py-4 text-right font-semibold text-slate-900">
                                            {money(payout.netPayable)}
                                        </td>


                                        {/* PAID */}

                                        <td className="px-5 py-4 text-right text-emerald-600 font-medium">
                                            {money(payout.paidAmount)}
                                        </td>


                                        {/* PENDING */}

                                        <td className="px-5 py-4 text-right text-orange-600 font-medium">
                                            {money(payout.pendingAmount)}
                                        </td>


                                        {/* STATUS */}

                                        <td className="px-5 py-4 text-center">

                                            <span
                                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusStyle(
                                                    payout.status
                                                )}`}
                                            >
                                                {payout.status}
                                            </span>

                                        </td>


                                        {/* ACTION */}

                                        <td className="px-5 py-4 text-right">

                                            <Link
                                                to={`/admin/payouts/${payout.id}`}
                                                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-100"
                                            >

                                                View

                                                <ArrowUpRight size={15} />

                                            </Link>

                                        </td>

                                    </tr>

                                ))

                            ) : (

                                <tr>

                                    <td
                                        colSpan="9"
                                        className="py-14 text-center"
                                    >

                                        <AlertCircle
                                            size={35}
                                            className="mx-auto text-slate-300 mb-3"
                                        />

                                        <p className="font-medium text-slate-700">
                                            No payouts found
                                        </p>

                                        <p className="text-sm text-slate-500 mt-1">
                                            Try changing your search or filters.
                                        </p>

                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>


                {/* MOBILE / TABLET CARDS */}

                <div className="xl:hidden divide-y divide-slate-100">

                    {filteredPayouts.length > 0 ? (

                        filteredPayouts.map((payout) => (

                            <div
                                key={payout.id}
                                className="p-5 space-y-4"
                            >

                                <div className="flex items-start justify-between gap-3">

                                    <div className="flex items-center gap-3">

                                        <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-semibold text-sm">
                                            {payout.vendor?.initials ||
                                                payout.vendor?.name?.charAt(0)}
                                        </div>

                                        <div>

                                            <p className="font-semibold text-slate-900">
                                                {payout.vendor?.name}
                                            </p>

                                            <p className="text-xs text-slate-500">
                                                {payout.month}
                                            </p>

                                        </div>

                                    </div>


                                    <span
                                        className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusStyle(
                                            payout.status
                                        )}`}
                                    >
                                        {payout.status}
                                    </span>

                                </div>


                                <div className="grid grid-cols-2 gap-3">

                                    <div className="bg-slate-50 rounded-xl p-3">

                                        <p className="text-xs text-slate-500">
                                            Sales
                                        </p>

                                        <p className="font-semibold mt-1">
                                            {money(payout.grossSales)}
                                        </p>

                                    </div>

                                    <div className="bg-slate-50 rounded-xl p-3">

                                        <p className="text-xs text-slate-500">
                                            Commission
                                        </p>

                                        <p className="font-semibold mt-1 text-purple-600">
                                            {money(payout.commission)}
                                        </p>

                                    </div>

                                    <div className="bg-slate-50 rounded-xl p-3">

                                        <p className="text-xs text-slate-500">
                                            Paid
                                        </p>

                                        <p className="font-semibold mt-1 text-emerald-600">
                                            {money(payout.paidAmount)}
                                        </p>

                                    </div>

                                    <div className="bg-slate-50 rounded-xl p-3">

                                        <p className="text-xs text-slate-500">
                                            Pending
                                        </p>

                                        <p className="font-semibold mt-1 text-orange-600">
                                            {money(payout.pendingAmount)}
                                        </p>

                                    </div>

                                </div>


                                <Link
                                    to={`/admin/payouts/${payout.id}`}
                                    className="w-full inline-flex justify-center items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-medium"
                                >

                                    View Settlement

                                    <ArrowUpRight size={16} />

                                </Link>

                            </div>

                        ))

                    ) : (

                        <div className="py-14 text-center">

                            <AlertCircle
                                size={35}
                                className="mx-auto text-slate-300 mb-3"
                            />

                            <p className="font-medium text-slate-700">
                                No payouts found
                            </p>

                        </div>

                    )}

                </div>

            </div>

        </div>
    );
};

export default AdminPayouts;