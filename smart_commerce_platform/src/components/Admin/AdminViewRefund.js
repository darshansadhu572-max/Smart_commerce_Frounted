import React from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, RotateCcw, CheckCircle, Clock, XCircle, RefreshCcw, User, Store, CreditCard, ShoppingBag, CalendarDays, Receipt, AlertCircle, IndianRupee, } from "lucide-react";

const AdminViewRefund = ({ refunds = [] }) => {
    const { refundId } = useParams();

    /* DEMO DATA */

    const defaultRefunds = [
        {
            id: "REF-10001",
            paymentId: "PAY-10005",
            orderId: "SC-10005",

            customer: {
                name: "Nisha Shah",
                email: "nisha@gmail.com",
                phone: "+91 9876501234",
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

            timeline: [
                {
                    title: "Refund Requested",
                    description: "Customer refund request was created.",
                    date: "Aug 04, 2026",
                    completed: true,
                },
                {
                    title: "Refund Approved",
                    description: "Refund request was approved by admin.",
                    date: "Aug 04, 2026",
                    completed: true,
                },
                {
                    title: "Refund Processing",
                    description: "Refund was sent to the payment gateway.",
                    date: "Aug 05, 2026",
                    completed: true,
                },
                {
                    title: "Refund Completed",
                    description: "Refund was successfully completed.",
                    date: "Aug 05, 2026",
                    completed: true,
                },
            ],
        },

        {
            id: "REF-10002",
            paymentId: "PAY-10003",
            orderId: "SC-10003",

            customer: {
                name: "Riya Desai",
                email: "riya@gmail.com",
                phone: "+91 9898989898",
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

            timeline: [
                {
                    title: "Refund Requested",
                    description: "Refund request created by admin.",
                    date: "Aug 09, 2026",
                    completed: true,
                },
                {
                    title: "Refund Approved",
                    description: "Waiting for admin approval.",
                    date: "",
                    completed: false,
                },
                {
                    title: "Refund Processing",
                    description: "Refund will be processed after approval.",
                    date: "",
                    completed: false,
                },
                {
                    title: "Refund Completed",
                    description: "Refund will be completed after processing.",
                    date: "",
                    completed: false,
                },
            ],
        },

        {
            id: "REF-10003",
            paymentId: "PAY-10002",
            orderId: "SC-10002",

            customer: {
                name: "Meera Shah",
                email: "meera@gmail.com",
                phone: "+91 9825012345",
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

            timeline: [
                {
                    title: "Refund Requested",
                    description: "Partial refund request was created.",
                    date: "Aug 10, 2026",
                    completed: true,
                },
                {
                    title: "Refund Approved",
                    description: "Refund request approved.",
                    date: "Aug 10, 2026",
                    completed: true,
                },
                {
                    title: "Refund Processing",
                    description: "Refund is currently being processed.",
                    date: "Aug 10, 2026",
                    completed: true,
                },
                {
                    title: "Refund Completed",
                    description: "Waiting for gateway confirmation.",
                    date: "",
                    completed: false,
                },
            ],
        },

        {
            id: "REF-10004",
            paymentId: "PAY-10001",
            orderId: "SC-10001",

            customer: {
                name: "Aarav Patel",
                email: "aarav@gmail.com",
                phone: "+91 9876543210",
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

            timeline: [
                {
                    title: "Refund Requested",
                    description: "Price adjustment refund requested.",
                    date: "Aug 08, 2026",
                    completed: true,
                },
                {
                    title: "Refund Approved",
                    description: "Refund approved.",
                    date: "Aug 08, 2026",
                    completed: true,
                },
                {
                    title: "Refund Processing",
                    description: "Refund sent to gateway.",
                    date: "Aug 09, 2026",
                    completed: true,
                },
                {
                    title: "Refund Completed",
                    description: "Refund successfully completed.",
                    date: "Aug 09, 2026",
                    completed: true,
                },
            ],
        },

        {
            id: "REF-10005",
            paymentId: "PAY-10004",
            orderId: "SC-10004",

            customer: {
                name: "Kabir Joshi",
                email: "kabir@gmail.com",
                phone: "+91 9911223344",
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

            timeline: [
                {
                    title: "Refund Requested",
                    description: "Refund request was created.",
                    date: "Aug 07, 2026",
                    completed: true,
                },
                {
                    title: "Refund Approved",
                    description: "Refund approved by admin.",
                    date: "Aug 07, 2026",
                    completed: true,
                },
                {
                    title: "Refund Processing",
                    description: "Gateway attempted to process refund.",
                    date: "Aug 08, 2026",
                    completed: true,
                },
                {
                    title: "Refund Failed",
                    description: "Payment gateway rejected the refund.",
                    date: "Aug 08, 2026",
                    completed: true,
                },
            ],
        },
    ];

    const data = refunds.length > 0 ? refunds : defaultRefunds;

    /* FIND REFUND */

    const refund = data.find(
        (item) => String(item.id) === String(refundId)
    );

    /* FORMAT MONEY */

    const money = (value) =>
        `₹${Number(value || 0).toLocaleString("en-IN")}`;

    /* STATUS STYLE */

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
                return <CheckCircle size={15} />;

            case "Processing":
                return <RefreshCcw size={15} />;

            case "Pending":
                return <Clock size={15} />;

            case "Failed":
                return <XCircle size={15} />;

            default:
                return <Clock size={15} />;
        }
    };

    /* NOT FOUND */

    if (!refund) {
        return (
            <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">

                <RotateCcw
                    size={45}
                    className="mx-auto text-slate-300 mb-4"
                />

                <h2 className="text-xl font-bold text-slate-900">
                    Refund Not Found
                </h2>

                <p className="text-sm text-slate-500 mt-2">
                    The refund transaction you are looking for does not exist.
                </p>

                <Link
                    to="/admin/refunds"
                    className="inline-flex mt-5 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-medium"
                >
                    Back to Refunds
                </Link>

            </div>
        );
    }

    const isCompleted = refund.status === "Completed";
    const isFailed = refund.status === "Failed";
    const isPending =
        refund.status === "Pending" ||
        refund.status === "Processing";

    return (
        <div className="space-y-6">

            {/* HEADER */}

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                <div className="flex items-center gap-3">

                    <Link
                        to="/admin/refunds"
                        className="p-2.5 border border-slate-200 rounded-xl hover:bg-slate-50"
                    >
                        <ArrowLeft size={19} />
                    </Link>

                    <div>

                        <div className="flex items-center gap-3">

                            <h1 className="text-2xl font-bold text-slate-900">
                                Refund {refund.id}
                            </h1>

                            <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${getStatusStyle(
                                    refund.status
                                )}`}
                            >
                                {getStatusIcon(refund.status)}
                                {refund.status}
                            </span>

                        </div>

                        <p className="text-sm text-slate-500 mt-1">
                            Requested on {refund.requestedDate}
                        </p>

                    </div>

                </div>


                <div className="flex gap-2">

                    <Link
                        to={`/admin/refunds/${refund.id}/edit`}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800"
                    >
                        <RotateCcw size={16} />
                        Manage Refund
                    </Link>

                </div>

            </div>


            {/* REFUND ALERT */}

            {isPending && (

                <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl">

                    <AlertCircle
                        size={20}
                        className="text-amber-600 mt-0.5"
                    />

                    <div>

                        <p className="font-semibold text-amber-800">
                            Refund requires attention
                        </p>

                        <p className="text-sm text-amber-700 mt-1">
                            This refund has not been completed yet.
                            Review the transaction and process the refund.
                        </p>

                    </div>

                </div>

            )}


            {isFailed && (

                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl">

                    <XCircle
                        size={20}
                        className="text-red-600 mt-0.5"
                    />

                    <div>

                        <p className="font-semibold text-red-800">
                            Refund failed
                        </p>

                        <p className="text-sm text-red-700 mt-1">
                            The payment gateway could not complete this refund.
                            Review the transaction and retry if appropriate.
                        </p>

                    </div>

                </div>

            )}


            {/* REFUND SUMMARY */}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

                {/* REFUND */}

                <div className="bg-white border border-slate-200 rounded-2xl p-5">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-sm text-slate-500">
                                Refund Amount
                            </p>

                            <p className="text-2xl font-bold text-slate-900 mt-1">
                                {money(refund.refundAmount)}
                            </p>

                        </div>

                        <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">

                            <IndianRupee
                                size={21}
                                className="text-blue-600"
                            />

                        </div>

                    </div>

                </div>


                {/* ORIGINAL */}

                <div className="bg-white border border-slate-200 rounded-2xl p-5">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-sm text-slate-500">
                                Original Payment
                            </p>

                            <p className="text-2xl font-bold text-slate-900 mt-1">
                                {money(refund.originalAmount)}
                            </p>

                        </div>

                        <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center">

                            <CreditCard
                                size={21}
                                className="text-slate-600"
                            />

                        </div>

                    </div>

                </div>


                {/* REMAINING */}

                <div className="bg-white border border-slate-200 rounded-2xl p-5">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-sm text-slate-500">
                                Remaining Amount
                            </p>

                            <p className="text-2xl font-bold text-slate-900 mt-1">
                                {money(
                                    Number(refund.originalAmount || 0) -
                                    Number(refund.refundAmount || 0)
                                )}
                            </p>

                        </div>

                        <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">

                            <Receipt
                                size={21}
                                className="text-emerald-600"
                            />

                        </div>

                    </div>

                </div>


                {/* STATUS */}

                <div className="bg-white border border-slate-200 rounded-2xl p-5">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-sm text-slate-500">
                                Refund Status
                            </p>

                            <p className="text-lg font-bold text-slate-900 mt-2">
                                {refund.status}
                            </p>

                        </div>

                        <div
                            className={`w-11 h-11 rounded-xl flex items-center justify-center ${isCompleted
                                    ? "bg-emerald-50"
                                    : isFailed
                                        ? "bg-red-50"
                                        : "bg-amber-50"
                                }`}
                        >

                            {getStatusIcon(refund.status)}

                        </div>

                    </div>

                </div>

            </div>


            {/* MAIN CONTENT */}

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                {/* LEFT */}

                <div className="xl:col-span-2 space-y-6">

                    {/* REFUND DETAILS */}

                    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">

                        <div className="p-5 border-b border-slate-200">

                            <div className="flex items-center gap-3">

                                <RotateCcw
                                    size={20}
                                    className="text-slate-600"
                                />

                                <h2 className="font-semibold text-slate-900">
                                    Refund Details
                                </h2>

                            </div>

                        </div>


                        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">

                            <div>

                                <p className="text-xs text-slate-400 uppercase font-semibold">
                                    Refund ID
                                </p>

                                <p className="font-semibold text-slate-900 mt-1">
                                    {refund.id}
                                </p>

                            </div>


                            <div>

                                <p className="text-xs text-slate-400 uppercase font-semibold">
                                    Payment ID
                                </p>

                                <Link
                                    to={`/admin/payments/${refund.paymentId}`}
                                    className="font-semibold text-blue-600 hover:underline mt-1 inline-block"
                                >
                                    {refund.paymentId}
                                </Link>

                            </div>


                            <div>

                                <p className="text-xs text-slate-400 uppercase font-semibold">
                                    Order ID
                                </p>

                                <Link
                                    to={`/admin/orders/${refund.orderId}`}
                                    className="font-semibold text-blue-600 hover:underline mt-1 inline-block"
                                >
                                    {refund.orderId}
                                </Link>

                            </div>


                            <div>

                                <p className="text-xs text-slate-400 uppercase font-semibold">
                                    Refund Method
                                </p>

                                <p className="font-medium text-slate-900 mt-1">
                                    {refund.method}
                                </p>

                            </div>


                            <div>

                                <p className="text-xs text-slate-400 uppercase font-semibold">
                                    Gateway
                                </p>

                                <p className="font-medium text-slate-900 mt-1">
                                    {refund.gateway}
                                </p>

                            </div>


                            <div>

                                <p className="text-xs text-slate-400 uppercase font-semibold">
                                    Requested Date
                                </p>

                                <p className="font-medium text-slate-900 mt-1">
                                    {refund.requestedDate}
                                </p>

                            </div>


                            <div>

                                <p className="text-xs text-slate-400 uppercase font-semibold">
                                    Processed Date
                                </p>

                                <p className="font-medium text-slate-900 mt-1">
                                    {refund.processedDate || "Not processed"}
                                </p>

                            </div>


                            <div>

                                <p className="text-xs text-slate-400 uppercase font-semibold">
                                    Refund Transaction ID
                                </p>

                                <p className="font-medium text-slate-900 mt-1 break-all">
                                    {refund.refundTransactionId || "Not available"}
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* REFUND CALCULATION */}

                    <div className="bg-white border border-slate-200 rounded-2xl p-5">

                        <h2 className="font-semibold text-slate-900 mb-5">
                            Refund Calculation
                        </h2>

                        <div className="space-y-4">

                            <div className="flex justify-between text-sm">

                                <span className="text-slate-500">
                                    Original Payment
                                </span>

                                <span className="font-medium text-slate-900">
                                    {money(refund.originalAmount)}
                                </span>

                            </div>


                            <div className="flex justify-between text-sm">

                                <span className="text-slate-500">
                                    Refund Requested
                                </span>

                                <span className="font-medium text-red-600">
                                    - {money(refund.refundAmount)}
                                </span>

                            </div>


                            <div className="pt-4 border-t border-slate-200 flex justify-between">

                                <span className="font-semibold text-slate-900">
                                    Remaining Payment
                                </span>

                                <span className="text-lg font-bold text-slate-900">
                                    {money(
                                        Number(refund.originalAmount || 0) -
                                        Number(refund.refundAmount || 0)
                                    )}
                                </span>

                            </div>

                        </div>

                    </div>


                    {/* REASON */}

                    <div className="bg-white border border-slate-200 rounded-2xl p-5">

                        <div className="flex items-center gap-3 mb-4">

                            <AlertCircle
                                size={20}
                                className="text-slate-600"
                            />

                            <h2 className="font-semibold text-slate-900">
                                Refund Reason
                            </h2>

                        </div>

                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">

                            <p className="text-sm text-slate-700">
                                {refund.reason}
                            </p>

                        </div>

                    </div>


                    {/* TIMELINE */}

                    <div className="bg-white border border-slate-200 rounded-2xl p-5">

                        <div className="flex items-center gap-3 mb-6">

                            <Clock
                                size={20}
                                className="text-slate-600"
                            />

                            <h2 className="font-semibold text-slate-900">
                                Refund Timeline
                            </h2>

                        </div>


                        <div className="space-y-6">

                            {refund.timeline?.map((event, index) => (

                                <div
                                    key={index}
                                    className="flex gap-4"
                                >

                                    <div className="flex flex-col items-center">

                                        <div
                                            className={`w-9 h-9 rounded-full flex items-center justify-center ${event.completed
                                                    ? "bg-emerald-100 text-emerald-600"
                                                    : "bg-slate-100 text-slate-400"
                                                }`}
                                        >

                                            {event.completed ? (
                                                <CheckCircle size={18} />
                                            ) : (
                                                <Clock size={18} />
                                            )}

                                        </div>

                                        {index <
                                            refund.timeline.length - 1 && (
                                                <div className="w-px h-full min-h-8 bg-slate-200 mt-2" />
                                            )}

                                    </div>


                                    <div className="pb-2">

                                        <p
                                            className={`font-medium ${event.completed
                                                    ? "text-slate-900"
                                                    : "text-slate-400"
                                                }`}
                                        >
                                            {event.title}
                                        </p>

                                        <p className="text-sm text-slate-500 mt-1">
                                            {event.description}
                                        </p>

                                        {event.date && (
                                            <p className="text-xs text-slate-400 mt-2">
                                                {event.date}
                                            </p>
                                        )}

                                    </div>

                                </div>

                            ))}

                        </div>

                    </div>

                </div>


                {/* RIGHT */}

                <div className="space-y-6">

                    {/* CUSTOMER */}

                    <div className="bg-white border border-slate-200 rounded-2xl p-5">

                        <div className="flex items-center gap-3 mb-5">

                            <User
                                size={20}
                                className="text-slate-600"
                            />

                            <h2 className="font-semibold text-slate-900">
                                Customer
                            </h2>

                        </div>

                        <p className="font-semibold text-slate-900">
                            {refund.customer.name}
                        </p>

                        <p className="text-sm text-slate-500 mt-1">
                            {refund.customer.email}
                        </p>

                        <p className="text-sm text-slate-500 mt-1">
                            {refund.customer.phone || "-"}
                        </p>

                    </div>


                    {/* VENDOR */}

                    <div className="bg-white border border-slate-200 rounded-2xl p-5">

                        <div className="flex items-center gap-3 mb-5">

                            <Store
                                size={20}
                                className="text-slate-600"
                            />

                            <h2 className="font-semibold text-slate-900">
                                Vendor
                            </h2>

                        </div>

                        <p className="font-semibold text-slate-900">
                            {refund.vendor}
                        </p>

                        <p className="text-sm text-slate-500 mt-1">
                            Vendor associated with this refund
                        </p>

                    </div>


                    {/* PAYMENT */}

                    <div className="bg-white border border-slate-200 rounded-2xl p-5">

                        <div className="flex items-center gap-3 mb-5">

                            <CreditCard
                                size={20}
                                className="text-slate-600"
                            />

                            <h2 className="font-semibold text-slate-900">
                                Original Payment
                            </h2>

                        </div>

                        <div className="space-y-4">

                            <div className="flex justify-between gap-4">

                                <span className="text-sm text-slate-500">
                                    Method
                                </span>

                                <span className="text-sm font-medium text-right">
                                    {refund.method}
                                </span>

                            </div>


                            <div className="flex justify-between gap-4">

                                <span className="text-sm text-slate-500">
                                    Gateway
                                </span>

                                <span className="text-sm font-medium text-right">
                                    {refund.gateway}
                                </span>

                            </div>


                            <div>

                                <p className="text-xs text-slate-400">
                                    Transaction ID
                                </p>

                                <p className="text-sm font-medium mt-1 break-all">
                                    {refund.transactionId || "Not available"}
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* ORDER */}

                    <div className="bg-white border border-slate-200 rounded-2xl p-5">

                        <div className="flex items-center gap-3 mb-5">

                            <ShoppingBag
                                size={20}
                                className="text-slate-600"
                            />

                            <h2 className="font-semibold text-slate-900">
                                Related Order
                            </h2>

                        </div>

                        <Link
                            to={`/admin/orders/${refund.orderId}`}
                            className="block p-4 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100"
                        >

                            <p className="font-semibold text-blue-600">
                                {refund.orderId}
                            </p>

                            <p className="text-xs text-slate-500 mt-1">
                                View complete order details
                            </p>

                        </Link>

                    </div>


                    {/* DATES */}

                    <div className="bg-white border border-slate-200 rounded-2xl p-5">

                        <div className="flex items-center gap-3 mb-5">

                            <CalendarDays
                                size={20}
                                className="text-slate-600"
                            />

                            <h2 className="font-semibold text-slate-900">
                                Important Dates
                            </h2>

                        </div>

                        <div className="space-y-4">

                            <div className="flex justify-between">

                                <span className="text-sm text-slate-500">
                                    Requested
                                </span>

                                <span className="text-sm font-medium">
                                    {refund.requestedDate}
                                </span>

                            </div>


                            <div className="flex justify-between">

                                <span className="text-sm text-slate-500">
                                    Processed
                                </span>

                                <span className="text-sm font-medium">
                                    {refund.processedDate || "-"}
                                </span>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default AdminViewRefund;