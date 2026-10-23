import React from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CreditCard, User, ShoppingBag, Store, CheckCircle, Clock, XCircle, RotateCcw, Receipt, } from "lucide-react";

const AdminViewPayment = ({ payments = [] }) => {

    const { paymentId } = useParams();

    const payment = payments.find(
        (item) => String(item.id) === String(paymentId)
    );

    if (!payment) {
        return (
            <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">

                <CreditCard
                    size={45}
                    className="mx-auto text-slate-300 mb-4"
                />

                <h2 className="text-xl font-bold text-slate-900">
                    Payment Not Found
                </h2>

                <p className="text-slate-500 mt-2">
                    The payment transaction you are looking for does not exist.
                </p>

                <Link
                    to="/admin/payments"
                    className="inline-flex mt-5 px-4 py-2.5 bg-slate-900 text-white rounded-xl"
                >
                    Back to Payments
                </Link>

            </div>
        );
    }

    const money = (value) =>
        `₹${Number(value || 0).toLocaleString("en-IN")}`;

    const statusIcon = {
        Paid: <CheckCircle size={18} />,
        Pending: <Clock size={18} />,
        Failed: <XCircle size={18} />,
        Refunded: <RotateCcw size={18} />,
    };

    const statusColor = {
        Paid: "bg-emerald-50 text-emerald-700",
        Pending: "bg-amber-50 text-amber-700",
        Failed: "bg-red-50 text-red-700",
        Refunded: "bg-purple-50 text-purple-700",
    };

    return (
        <div className="space-y-6">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                <div className="flex items-center gap-3">

                    <Link
                        to="/admin/payments"
                        className="p-2 border border-slate-200 rounded-xl hover:bg-slate-100"
                    >
                        <ArrowLeft size={19} />
                    </Link>

                    <div>

                        <h1 className="text-2xl font-bold text-slate-900">
                            Payment {payment.id}
                        </h1>

                        <p className="text-sm text-slate-500 mt-1">
                            Transaction for Order #{payment.orderId}
                        </p>

                    </div>

                </div>


                <Link
                    to={`/admin/payments/${payment.id}/edit`}
                    className="px-4 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-medium"
                >
                    Update Payment
                </Link>

            </div>


            {/* STATUS */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6">

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                    <div>

                        <p className="text-sm text-slate-500">
                            Payment Status
                        </p>

                        <div className="flex items-center gap-2 mt-2">

                            <span
                                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${statusColor[payment.status] ||
                                    "bg-slate-100 text-slate-600"
                                    }`}
                            >

                                {statusIcon[payment.status]}

                                {payment.status}

                            </span>

                        </div>

                    </div>


                    <div className="text-left md:text-right">

                        <p className="text-sm text-slate-500">
                            Payment Amount
                        </p>

                        <p className="text-3xl font-bold text-slate-900 mt-1">
                            {money(payment.amount)}
                        </p>

                    </div>

                </div>

            </div>


            {/* MAIN */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                {/* LEFT */}
                <div className="xl:col-span-2 space-y-6">

                    {/* PAYMENT DETAILS */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6">

                        <div className="flex items-center gap-3 mb-5">

                            <CreditCard size={20} />

                            <h2 className="font-semibold text-slate-900">
                                Payment Information
                            </h2>

                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                            <div>
                                <p className="text-xs text-slate-400">
                                    Payment ID
                                </p>

                                <p className="font-medium mt-1">
                                    {payment.id}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-slate-400">
                                    Transaction ID
                                </p>

                                <p className="font-medium mt-1">
                                    {payment.transactionId || "-"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-slate-400">
                                    Payment Method
                                </p>

                                <p className="font-medium mt-1">
                                    {payment.method}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-slate-400">
                                    Payment Gateway
                                </p>

                                <p className="font-medium mt-1">
                                    {payment.gateway || "-"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-slate-400">
                                    Date
                                </p>

                                <p className="font-medium mt-1">
                                    {payment.date}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-slate-400">
                                    Currency
                                </p>

                                <p className="font-medium mt-1">
                                    {payment.currency || "INR"}
                                </p>
                            </div>

                        </div>

                    </div>


                    {/* AMOUNT BREAKDOWN */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6">

                        <div className="flex items-center gap-3 mb-5">

                            <Receipt size={20} />

                            <h2 className="font-semibold text-slate-900">
                                Amount Breakdown
                            </h2>

                        </div>

                        <div className="space-y-3 text-sm">

                            <div className="flex justify-between">
                                <span className="text-slate-500">
                                    Order Subtotal
                                </span>

                                <span>
                                    {money(payment.subtotal)}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-slate-500">
                                    Shipping
                                </span>

                                <span>
                                    {money(payment.shipping)}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-slate-500">
                                    Tax
                                </span>

                                <span>
                                    {money(payment.tax)}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-slate-500">
                                    Discount
                                </span>

                                <span className="text-red-500">
                                    -{money(payment.discount)}
                                </span>
                            </div>

                            <div className="border-t border-slate-200 pt-4 flex justify-between">

                                <span className="font-semibold">
                                    Paid Amount
                                </span>

                                <span className="font-bold text-lg">
                                    {money(payment.amount)}
                                </span>

                            </div>

                        </div>

                    </div>


                    {/* SETTLEMENT */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6">

                        <div className="flex items-center gap-3 mb-5">

                            <Store size={20} />

                            <h2 className="font-semibold text-slate-900">
                                Vendor Settlement
                            </h2>

                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                            <div>
                                <p className="text-xs text-slate-400">
                                    Vendor
                                </p>

                                <p className="font-medium mt-1">
                                    {payment.vendor || "Multiple Vendors"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-slate-400">
                                    Platform Commission
                                </p>

                                <p className="font-medium mt-1">
                                    {money(payment.commission)}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-slate-400">
                                    Vendor Payable
                                </p>

                                <p className="font-bold mt-1 text-emerald-600">
                                    {money(payment.vendorPayout)}
                                </p>
                            </div>

                        </div>

                    </div>

                </div>


                {/* RIGHT */}
                <div className="space-y-6">

                    {/* CUSTOMER */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-5">

                        <div className="flex items-center gap-3 mb-5">

                            <User size={20} />

                            <h2 className="font-semibold">
                                Customer
                            </h2>

                        </div>

                        <p className="font-semibold text-slate-900">
                            {payment.customer?.name}
                        </p>

                        <p className="text-sm text-slate-500 mt-1">
                            {payment.customer?.email}
                        </p>

                        <p className="text-sm text-slate-500 mt-1">
                            {payment.customer?.phone}
                        </p>

                    </div>


                    {/* ORDER */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-5">

                        <div className="flex items-center gap-3 mb-5">

                            <ShoppingBag size={20} />

                            <h2 className="font-semibold">
                                Order
                            </h2>

                        </div>

                        <p className="text-sm text-slate-500">
                            Order ID
                        </p>

                        <Link
                            to={`/admin/orders/${payment.orderId}`}
                            className="font-semibold text-slate-900 hover:underline"
                        >
                            #{payment.orderId}
                        </Link>

                    </div>


                    {/* REFUND */}
                    {payment.refund && (
                        <div className="bg-white border border-slate-200 rounded-2xl p-5">

                            <div className="flex items-center gap-3 mb-5">

                                <RotateCcw size={20} />

                                <h2 className="font-semibold">
                                    Refund
                                </h2>

                            </div>

                            <div className="space-y-3 text-sm">

                                <div className="flex justify-between">
                                    <span className="text-slate-500">
                                        Amount
                                    </span>

                                    <span className="font-semibold">
                                        {money(payment.refund.amount)}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-slate-500">
                                        Status
                                    </span>

                                    <span className="text-purple-600 font-medium">
                                        {payment.refund.status}
                                    </span>
                                </div>

                                <div>
                                    <span className="text-slate-500">
                                        Reason
                                    </span>

                                    <p className="mt-1">
                                        {payment.refund.reason}
                                    </p>
                                </div>

                            </div>

                        </div>
                    )}

                </div>

            </div>

        </div>
    );
};

export default AdminViewPayment;