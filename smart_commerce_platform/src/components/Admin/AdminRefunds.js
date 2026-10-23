import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, Eye, RotateCcw, CheckCircle, Clock, XCircle, RefreshCcw, DollarSign, CalendarDays, ChevronDown, } from "lucide-react";

const AdminRefunds = ({ refunds = [] }) => {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [vendorFilter, setVendorFilter] = useState("All");
    const [showFilters, setShowFilters] = useState(false);

    /* SAMPLE DATA Used only if refunds prop is not provided. */

    const defaultRefunds = [
        {
            id: "REF-10001",
            paymentId: "PAY-10005",
            orderId: "SC-10005",

            customer: {
                name: "Nisha Shah",
                email: "nisha@gmail.com",
            },

            vendor: "BookWorld",

            originalAmount: 1014,
            refundAmount: 1014,

            reason: "Customer requested cancellation",

            method: "Credit / Debit Card",
            gateway: "Razorpay",

            status: "Completed",

            requestedDate: "Aug 04, 2026",
            processedDate: "Aug 05, 2026",

            transactionId: "TXN982345",
            refundTransactionId: "RFN782341",
        },

        {
            id: "REF-10002",
            paymentId: "PAY-10003",
            orderId: "SC-10003",

            customer: {
                name: "Riya Desai",
                email: "riya@gmail.com",
            },

            vendor: "FashionHub",

            originalAmount: 2321,
            refundAmount: 2321,

            reason: "Order cancelled by customer",

            method: "Cash on Delivery",
            gateway: "COD",

            status: "Pending",

            requestedDate: "Aug 09, 2026",
            processedDate: null,

            transactionId: null,
            refundTransactionId: null,
        },

        {
            id: "REF-10003",
            paymentId: "PAY-10002",
            orderId: "SC-10002",

            customer: {
                name: "Meera Shah",
                email: "meera@gmail.com",
            },

            vendor: "HomeNest",

            originalAmount: 8815,
            refundAmount: 1500,

            reason: "Partial refund for damaged product",

            method: "Credit / Debit Card",
            gateway: "Razorpay",

            status: "Processing",

            requestedDate: "Aug 10, 2026",
            processedDate: null,

            transactionId: "TXN982342",
            refundTransactionId: null,
        },

        {
            id: "REF-10004",
            paymentId: "PAY-10001",
            orderId: "SC-10001",

            customer: {
                name: "Aarav Patel",
                email: "aarav@gmail.com",
            },

            vendor: "ElectroCore",

            originalAmount: 8259,
            refundAmount: 500,

            reason: "Price adjustment",

            method: "UPI",
            gateway: "Razorpay",

            status: "Completed",

            requestedDate: "Aug 08, 2026",
            processedDate: "Aug 09, 2026",

            transactionId: "TXN982341",
            refundTransactionId: "RFN782344",
        },

        {
            id: "REF-10005",
            paymentId: "PAY-10004",
            orderId: "SC-10004",

            customer: {
                name: "Kabir Joshi",
                email: "kabir@gmail.com",
            },

            vendor: "SportsZone",

            originalAmount: 3539,
            refundAmount: 3539,

            reason: "Product unavailable",

            method: "UPI",
            gateway: "Razorpay",

            status: "Failed",

            requestedDate: "Aug 07, 2026",
            processedDate: null,

            transactionId: "TXN982344",
            refundTransactionId: null,
        },
    ];

    const data = refunds.length > 0 ? refunds : defaultRefunds;

    /* HELPERS */

    const formatMoney = (value) => {
        return `₹${Number(value || 0).toLocaleString("en-IN")}`;
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case "Completed":
                return "bg-emerald-50 text-emerald-700 border-emerald-200";

            case "Processing":
                return "bg-blue-50 text-blue-700 border-blue-200";

            case "Pending":
                return "bg-amber-50 text-amber-700 border-amber-200";

            case "Failed":
                return "bg-red-50 text-red-700 border-red-200";

            default:
                return "bg-slate-50 text-slate-700 border-slate-200";
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "Completed":
                return <CheckCircle size={14} />;

            case "Processing":
                return <RefreshCcw size={14} />;

            case "Pending":
                return <Clock size={14} />;

            case "Failed":
                return <XCircle size={14} />;

            default:
                return <Clock size={14} />;
        }
    };

    /* VENDORS */

    const vendors = useMemo(() => {
        return ["All", ...new Set(data.map((refund) => refund.vendor))];
    }, [data]);

    /* FILTER */

    const filteredRefunds = useMemo(() => {
        return data.filter((refund) => {
            const searchText = search.toLowerCase();

            const matchesSearch =
                refund.id.toLowerCase().includes(searchText) ||
                refund.paymentId.toLowerCase().includes(searchText) ||
                refund.orderId.toLowerCase().includes(searchText) ||
                refund.customer.name.toLowerCase().includes(searchText) ||
                refund.customer.email.toLowerCase().includes(searchText) ||
                refund.vendor.toLowerCase().includes(searchText);

            const matchesStatus =
                statusFilter === "All" ||
                refund.status === statusFilter;

            const matchesVendor =
                vendorFilter === "All" ||
                refund.vendor === vendorFilter;

            return (
                matchesSearch &&
                matchesStatus &&
                matchesVendor
            );
        });
    }, [data, search, statusFilter, vendorFilter]);

    /* SUMMARY */

    const totalRefundAmount = data.reduce(
        (sum, refund) => sum + Number(refund.refundAmount || 0),
        0
    );

    const completedAmount = data
        .filter((refund) => refund.status === "Completed")
        .reduce(
            (sum, refund) => sum + Number(refund.refundAmount || 0),
            0
        );

    const pendingAmount = data
        .filter(
            (refund) =>
                refund.status === "Pending" ||
                refund.status === "Processing"
        )
        .reduce(
            (sum, refund) => sum + Number(refund.refundAmount || 0),
            0
        );

    const failedCount = data.filter(
        (refund) => refund.status === "Failed"
    ).length;

    return (
        <div className="space-y-6">

            {/* HEADER */}

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        Refunds
                    </h1>

                    <p className="text-sm text-slate-500 mt-1">
                        Manage customer refunds and refund transactions.
                    </p>
                </div>

                <div className="flex items-center gap-2">

                    <button
                        onClick={() => {
                            setSearch("");
                            setStatusFilter("All");
                            setVendorFilter("All");
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                        <RefreshCcw size={16} />
                        Reset
                    </button>

                </div>

            </div>


            {/* SUMMARY CARDS */}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

                {/* TOTAL */}

                <div className="bg-white border border-slate-200 rounded-2xl p-5">

                    <div className="flex items-center justify-between">

                        <div>
                            <p className="text-sm text-slate-500">
                                Total Refunds
                            </p>

                            <p className="text-2xl font-bold text-slate-900 mt-1">
                                {data.length}
                            </p>
                        </div>

                        <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center">
                            <RotateCcw
                                size={21}
                                className="text-slate-700"
                            />
                        </div>

                    </div>

                    <p className="text-xs text-slate-500 mt-3">
                        {formatMoney(totalRefundAmount)} refund value
                    </p>

                </div>


                {/* COMPLETED */}

                <div className="bg-white border border-slate-200 rounded-2xl p-5">

                    <div className="flex items-center justify-between">

                        <div>
                            <p className="text-sm text-slate-500">
                                Completed
                            </p>

                            <p className="text-2xl font-bold text-emerald-600 mt-1">
                                {formatMoney(completedAmount)}
                            </p>
                        </div>

                        <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">
                            <CheckCircle
                                size={21}
                                className="text-emerald-600"
                            />
                        </div>

                    </div>

                    <p className="text-xs text-slate-500 mt-3">
                        Successfully refunded
                    </p>

                </div>


                {/* PENDING */}

                <div className="bg-white border border-slate-200 rounded-2xl p-5">

                    <div className="flex items-center justify-between">

                        <div>
                            <p className="text-sm text-slate-500">
                                Pending / Processing
                            </p>

                            <p className="text-2xl font-bold text-amber-600 mt-1">
                                {formatMoney(pendingAmount)}
                            </p>
                        </div>

                        <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center">
                            <Clock
                                size={21}
                                className="text-amber-600"
                            />
                        </div>

                    </div>

                    <p className="text-xs text-slate-500 mt-3">
                        Requires attention
                    </p>

                </div>


                {/* FAILED */}

                <div className="bg-white border border-slate-200 rounded-2xl p-5">

                    <div className="flex items-center justify-between">

                        <div>
                            <p className="text-sm text-slate-500">
                                Failed Refunds
                            </p>

                            <p className="text-2xl font-bold text-red-600 mt-1">
                                {failedCount}
                            </p>
                        </div>

                        <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center">
                            <XCircle
                                size={21}
                                className="text-red-600"
                            />
                        </div>

                    </div>

                    <p className="text-xs text-slate-500 mt-3">
                        Need review
                    </p>

                </div>

            </div>


            {/* FILTER BAR */}

            <div className="bg-white border border-slate-200 rounded-2xl p-4">

                <div className="flex flex-col xl:flex-row gap-3">

                    {/* SEARCH */}

                    <div className="relative flex-1">

                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search refund, order, customer or vendor..."
                            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-slate-400"
                        />

                    </div>


                    {/* FILTER BUTTON */}

                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="inline-flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50"
                    >
                        <Filter size={17} />

                        Filters

                        <ChevronDown
                            size={16}
                            className={`transition-transform ${showFilters ? "rotate-180" : ""
                                }`}
                        />

                    </button>

                </div>


                {/* ADVANCED FILTERS */}

                {showFilters && (

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-100">

                        {/* STATUS */}

                        <div>

                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Refund Status
                            </label>

                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none"
                            >

                                <option value="All">
                                    All Statuses
                                </option>

                                <option value="Pending">
                                    Pending
                                </option>

                                <option value="Processing">
                                    Processing
                                </option>

                                <option value="Completed">
                                    Completed
                                </option>

                                <option value="Failed">
                                    Failed
                                </option>

                            </select>

                        </div>


                        {/* VENDOR */}

                        <div>

                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Vendor
                            </label>

                            <select
                                value={vendorFilter}
                                onChange={(e) => setVendorFilter(e.target.value)}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none"
                            >

                                {vendors.map((vendor) => (
                                    <option
                                        key={vendor}
                                        value={vendor}
                                    >
                                        {vendor}
                                    </option>
                                ))}

                            </select>

                        </div>

                    </div>

                )}

            </div>


            {/* TABLE */}

            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">

                {/* TABLE HEADER */}

                <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">

                    <div>

                        <h2 className="font-semibold text-slate-900">
                            Refund Transactions
                        </h2>

                        <p className="text-xs text-slate-500 mt-1">
                            Showing {filteredRefunds.length} of {data.length} refunds
                        </p>

                    </div>

                    <div className="text-sm text-slate-500">
                        Total:{" "}
                        <span className="font-semibold text-slate-900">
                            {formatMoney(
                                filteredRefunds.reduce(
                                    (sum, refund) =>
                                        sum + Number(refund.refundAmount || 0),
                                    0
                                )
                            )}
                        </span>
                    </div>

                </div>


                {/* DESKTOP TABLE */}

                <div className="hidden lg:block overflow-x-auto">

                    <table className="w-full">

                        <thead className="bg-slate-50 border-b border-slate-200">

                            <tr>

                                <th className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase">
                                    Refund
                                </th>

                                <th className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase">
                                    Customer
                                </th>

                                <th className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase">
                                    Vendor
                                </th>

                                <th className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase">
                                    Amount
                                </th>

                                <th className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase">
                                    Reason
                                </th>

                                <th className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase">
                                    Status
                                </th>

                                <th className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase">
                                    Date
                                </th>

                                <th className="text-right px-5 py-4 text-xs font-semibold text-slate-500 uppercase">
                                    Action
                                </th>

                            </tr>

                        </thead>


                        <tbody className="divide-y divide-slate-100">

                            {filteredRefunds.map((refund) => (

                                <tr
                                    key={refund.id}
                                    className="hover:bg-slate-50/70"
                                >

                                    {/* REFUND */}

                                    <td className="px-5 py-4">

                                        <div>

                                            <p className="font-semibold text-sm text-slate-900">
                                                {refund.id}
                                            </p>

                                            <p className="text-xs text-slate-500 mt-1">
                                                {refund.paymentId}
                                            </p>

                                            <p className="text-xs text-slate-400">
                                                {refund.orderId}
                                            </p>

                                        </div>

                                    </td>


                                    {/* CUSTOMER */}

                                    <td className="px-5 py-4">

                                        <p className="text-sm font-medium text-slate-900">
                                            {refund.customer.name}
                                        </p>

                                        <p className="text-xs text-slate-500 mt-1">
                                            {refund.customer.email}
                                        </p>

                                    </td>


                                    {/* VENDOR */}

                                    <td className="px-5 py-4">

                                        <span className="text-sm font-medium text-slate-700">
                                            {refund.vendor}
                                        </span>

                                    </td>


                                    {/* AMOUNT */}

                                    <td className="px-5 py-4">

                                        <p className="font-semibold text-slate-900">
                                            {formatMoney(refund.refundAmount)}
                                        </p>

                                        <p className="text-xs text-slate-500 mt-1">
                                            of {formatMoney(refund.originalAmount)}
                                        </p>

                                    </td>


                                    {/* REASON */}

                                    <td className="px-5 py-4 max-w-[220px]">

                                        <p className="text-sm text-slate-600 truncate">
                                            {refund.reason}
                                        </p>

                                    </td>


                                    {/* STATUS */}

                                    <td className="px-5 py-4">

                                        <span
                                            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-xs font-medium ${getStatusStyle(
                                                refund.status
                                            )}`}
                                        >
                                            {getStatusIcon(refund.status)}
                                            {refund.status}
                                        </span>

                                    </td>


                                    {/* DATE */}

                                    <td className="px-5 py-4">

                                        <div className="flex items-center gap-2 text-sm text-slate-600">

                                            <CalendarDays size={15} />

                                            {refund.requestedDate}

                                        </div>

                                    </td>


                                    {/* ACTION */}

                                    <td className="px-5 py-4 text-right">

                                        <Link
                                            to={`/admin/refunds/${refund.id}`}
                                            className="inline-flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-100"
                                        >
                                            <Eye size={16} />
                                            View
                                        </Link>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>


                {/* MOBILE CARDS */}

                <div className="lg:hidden divide-y divide-slate-100">

                    {filteredRefunds.map((refund) => (

                        <div
                            key={refund.id}
                            className="p-5 space-y-4"
                        >

                            <div className="flex items-start justify-between gap-3">

                                <div>

                                    <p className="font-semibold text-slate-900">
                                        {refund.id}
                                    </p>

                                    <p className="text-xs text-slate-500 mt-1">
                                        {refund.orderId}
                                    </p>

                                </div>

                                <span
                                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-medium ${getStatusStyle(
                                        refund.status
                                    )}`}
                                >
                                    {getStatusIcon(refund.status)}
                                    {refund.status}
                                </span>

                            </div>


                            <div className="grid grid-cols-2 gap-4">

                                <div>

                                    <p className="text-xs text-slate-400">
                                        Customer
                                    </p>

                                    <p className="text-sm font-medium text-slate-900 mt-1">
                                        {refund.customer.name}
                                    </p>

                                </div>


                                <div>

                                    <p className="text-xs text-slate-400">
                                        Vendor
                                    </p>

                                    <p className="text-sm font-medium text-slate-900 mt-1">
                                        {refund.vendor}
                                    </p>

                                </div>


                                <div>

                                    <p className="text-xs text-slate-400">
                                        Refund Amount
                                    </p>

                                    <p className="text-sm font-semibold text-slate-900 mt-1">
                                        {formatMoney(refund.refundAmount)}
                                    </p>

                                </div>


                                <div>

                                    <p className="text-xs text-slate-400">
                                        Requested
                                    </p>

                                    <p className="text-sm text-slate-700 mt-1">
                                        {refund.requestedDate}
                                    </p>

                                </div>

                            </div>


                            <div>

                                <p className="text-xs text-slate-400">
                                    Reason
                                </p>

                                <p className="text-sm text-slate-600 mt-1">
                                    {refund.reason}
                                </p>

                            </div>


                            <Link
                                to={`/admin/refunds/${refund.id}`}
                                className="w-full inline-flex justify-center items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50"
                            >
                                <Eye size={16} />
                                View Refund
                            </Link>

                        </div>

                    ))}

                </div>


                {/* EMPTY STATE */}

                {filteredRefunds.length === 0 && (

                    <div className="p-12 text-center">

                        <RotateCcw
                            size={42}
                            className="mx-auto text-slate-300 mb-4"
                        />

                        <h3 className="text-lg font-semibold text-slate-900">
                            No refunds found
                        </h3>

                        <p className="text-sm text-slate-500 mt-1">
                            Try changing your search or filters.
                        </p>

                    </div>

                )}

            </div>

        </div>
    );
};

export default AdminRefunds;