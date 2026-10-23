import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, RotateCcw, CreditCard, User, ShoppingBag, AlertCircle, } from "lucide-react";

const AdminEditRefund = () => {

    /* DEMO DATA */

    const payments = [
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


    /* ROUTER */

    const { paymentId } = useParams();
    const navigate = useNavigate();


    /* FIND PAYMENT */

    const payment = payments.find(
        (item) => String(item.id) === String(paymentId)
    );


    /* EXISTING REFUND */

    const existingRefund = payment?.refund;


    /* FORM DATA */

    const [formData, setFormData] = useState({
        refundAmount:
            existingRefund?.amount ??
            payment?.refundAmount ??
            "",

        refundStatus:
            existingRefund?.status ??
            payment?.status ??
            "Pending",

        refundReason:
            existingRefund?.reason ??
            payment?.reason ??
            "",

        refundMethod:
            existingRefund?.method ??
            payment?.method ??
            "",

        refundTransactionId:
            existingRefund?.transactionId ??
            payment?.refundTransactionId ??
            "",

        adminNote:
            existingRefund?.adminNote ??
            "",
    });


    /* FORM ERRORS */

    const [errors, setErrors] = useState({});


    /* SUCCESS MESSAGE */

    const [successMessage, setSuccessMessage] = useState("");


    /* PAYMENT NOT FOUND */

    if (!payment) {

        return (
            <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">

                <RotateCcw
                    size={45}
                    className="mx-auto text-slate-300 mb-4"
                />

                <h2 className="text-xl font-bold text-slate-900">
                    Payment Not Found
                </h2>

                <p className="text-slate-500 mt-2">
                    The payment associated with this refund does not exist.
                </p>

                <Link
                    to="/admin/refunds"
                    className="inline-flex mt-5 px-4 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800"
                >
                    Back to Refunds
                </Link>

            </div>
        );
    }


    /* HANDLE INPUT */

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((current) => ({
            ...current,
            [name]: value,
        }));


        /* Remove error for current field */

        setErrors((current) => ({
            ...current,
            [name]: "",
        }));


        /* Remove success message */

        setSuccessMessage("");
    };


    /* VALIDATION */

    const validateForm = () => {

        const newErrors = {};


        /* Refund amount */

        const refundAmount = Number(formData.refundAmount);

        const originalAmount = Number(
            payment.originalAmount ?? 0
        );


        if (
            formData.refundAmount === "" ||
            formData.refundAmount === null ||
            formData.refundAmount === undefined
        ) {

            newErrors.refundAmount =
                "Please enter a refund amount.";

        } else if (Number.isNaN(refundAmount)) {

            newErrors.refundAmount =
                "Refund amount must be a valid number.";

        } else if (refundAmount <= 0) {

            newErrors.refundAmount =
                "Refund amount must be greater than 0.";

        } else if (refundAmount > originalAmount) {

            newErrors.refundAmount =
                "Refund amount cannot be greater than the original payment amount.";

        }


        /* Refund reason */

        const refundReason =
            typeof formData.refundReason === "string"
                ? formData.refundReason.trim()
                : "";


        if (!refundReason) {

            newErrors.refundReason =
                "Please provide a refund reason.";

        }


        /* Refund method */

        if (
            typeof formData.refundMethod !== "string" ||
            !formData.refundMethod.trim()
        ) {

            newErrors.refundMethod =
                "Please select a refund method.";

        }


        /* Transaction ID */

        const transactionId =
            typeof formData.refundTransactionId === "string"
                ? formData.refundTransactionId.trim()
                : "";


        if (
            formData.refundStatus === "Completed" &&
            !transactionId
        ) {

            newErrors.refundTransactionId =
                "Refund transaction ID is required when refund is completed.";

        }


        return newErrors;
    };


    /* HANDLE SUBMIT */

    const handleSubmit = (e) => {

        e.preventDefault();


        /* Clear old messages */

        setErrors({});
        setSuccessMessage("");


        /* Validate */

        const validationErrors = validateForm();


        if (Object.keys(validationErrors).length > 0) {

            setErrors(validationErrors);

            console.log(
                "REFUND VALIDATION ERRORS:",
                validationErrors
            );

            return;
        }


        /* CREATE UPDATED REFUND */

        const refundAmount = Number(formData.refundAmount);

        const originalAmount = Number(
            payment.originalAmount ?? 0
        );


        const updatedRefund = {

            amount: refundAmount,

            status:
                formData.refundStatus || "Pending",

            reason:
                typeof formData.refundReason === "string"
                    ? formData.refundReason.trim()
                    : "",

            method:
                formData.refundMethod || null,

            transactionId:
                typeof formData.refundTransactionId === "string" &&
                    formData.refundTransactionId.trim()
                    ? formData.refundTransactionId.trim()
                    : null,

            adminNote:
                typeof formData.adminNote === "string"
                    ? formData.adminNote.trim()
                    : "",

            date:
                formData.refundStatus === "Completed"
                    ? new Date().toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                    })
                    : existingRefund?.date || null,
        };


        /* FINAL UPDATED DATA */

        const updatedPayment = {

            ...payment,

            refundAmount: refundAmount,

            status:
                formData.refundStatus,

            refund: updatedRefund,
        };


        /* CONSOLE LOG */

        console.group("UPDATE REFUND");

        console.log("Payment ID:", payment.paymentId);

        console.log("Refund ID:", payment.id);

        console.log("Order ID:", payment.orderId);

        console.log("Customer:", payment.customer);

        console.log("Vendor:", payment.vendor);

        console.log("Original Amount:", originalAmount);

        console.log("Updated Refund:", updatedRefund);

        console.log("Updated Payment:", updatedPayment);

        console.groupEnd();


        /* SUCCESS */

        setSuccessMessage(
            "Refund updated successfully!"
        );


        /* NAVIGATION */

        setTimeout(() => {

            navigate(`/admin/payments/${payment.id}`);

        }, 1000);
    };


    /* REFUND CALCULATION */

    const originalAmount = Number(
        payment.originalAmount ?? 0
    );

    const currentRefundAmount = Number(
        formData.refundAmount || 0
    );

    const remainingAmount =
        originalAmount - currentRefundAmount;


    /* INPUT ERROR CLASS */

    const inputClass = (field) => {

        return `
            w-full
            px-4
            py-3
            border
            rounded-xl
            outline-none
            focus:ring-2
            focus:ring-slate-200
            ${errors[field]
                ? "border-red-400 bg-red-50/30"
                : "border-slate-200"
            }
        `;
    };


    /* RETURN UI */

    return (
        <div className="max-w-6xl mx-auto space-y-6">

            {/* HEADER */}

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                <div className="flex items-center gap-3">

                    <Link
                        to={`/admin/payments/${payment.id}`}
                        className="p-2.5 border border-slate-200 rounded-xl hover:bg-slate-100 transition"
                    >
                        <ArrowLeft size={19} />
                    </Link>

                    <div>

                        <h1 className="text-2xl font-bold text-slate-900">
                            Edit Refund
                        </h1>

                        <p className="text-sm text-slate-500 mt-1">
                            Refund for payment {payment.id}
                        </p>

                    </div>

                </div>


                <div className="px-4 py-2 bg-amber-50 text-amber-700 rounded-xl text-sm font-medium">
                    Order #{payment.orderId}
                </div>

            </div>


            {/* SUCCESS MESSAGE */}

            {successMessage && (

                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700 font-medium">

                    {successMessage}

                </div>

            )}


            {/* WARNING */}

            <div className="flex gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl">

                <AlertCircle
                    size={20}
                    className="text-amber-600 flex-shrink-0 mt-0.5"
                />

                <div>

                    <p className="font-semibold text-amber-800">
                        Refund Management
                    </p>

                    <p className="text-sm text-amber-700 mt-1">
                        Refund information should be updated carefully.
                        In the production system, the actual refund should
                        be processed through your payment gateway.
                    </p>

                </div>

            </div>


            {/* PAYMENT INFORMATION */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                {/* PAYMENT */}

                <div className="bg-white border border-slate-200 rounded-2xl p-5">

                    <div className="flex items-center gap-3 mb-4">

                        <CreditCard
                            size={20}
                            className="text-slate-600"
                        />

                        <h2 className="font-semibold text-slate-900">
                            Payment
                        </h2>

                    </div>

                    <p className="text-sm text-slate-500">
                        Payment ID
                    </p>

                    <p className="font-semibold text-slate-900 mt-1">
                        {payment.paymentId || payment.id}
                    </p>

                    <p className="text-sm text-slate-500 mt-3">
                        Transaction ID
                    </p>

                    <p className="font-medium text-slate-900 mt-1 break-all">
                        {payment.transactionId || "Not available"}
                    </p>

                </div>


                {/* CUSTOMER */}

                <div className="bg-white border border-slate-200 rounded-2xl p-5">

                    <div className="flex items-center gap-3 mb-4">

                        <User
                            size={20}
                            className="text-slate-600"
                        />

                        <h2 className="font-semibold text-slate-900">
                            Customer
                        </h2>

                    </div>

                    <p className="font-semibold text-slate-900">
                        {payment.customer?.name || "Unknown"}
                    </p>

                    <p className="text-sm text-slate-500 mt-1">
                        {payment.customer?.email || "-"}
                    </p>

                    <p className="text-sm text-slate-500 mt-1">
                        {payment.customer?.phone || "-"}
                    </p>

                </div>


                {/* VENDOR */}

                <div className="bg-white border border-slate-200 rounded-2xl p-5">

                    <div className="flex items-center gap-3 mb-4">

                        <ShoppingBag
                            size={20}
                            className="text-slate-600"
                        />

                        <h2 className="font-semibold text-slate-900">
                            Vendor
                        </h2>

                    </div>

                    <p className="font-semibold text-slate-900">
                        {payment.vendor || "-"}
                    </p>

                    <p className="text-sm text-slate-500 mt-1">
                        Order #{payment.orderId}
                    </p>

                    <p className="text-sm text-slate-500 mt-1">
                        Original Amount: ₹
                        {originalAmount.toLocaleString("en-IN")}
                    </p>

                </div>

            </div>


            {/* FORM */}

            <form
                onSubmit={handleSubmit}
                noValidate
                className="space-y-6"
            >

                {/* REFUND DETAILS */}

                <div className="bg-white border border-slate-200 rounded-2xl p-6">

                    <div className="flex items-center gap-3 mb-6">

                        <div className="p-2 bg-slate-100 rounded-xl">

                            <RotateCcw size={20} />

                        </div>

                        <div>

                            <h2 className="font-semibold text-slate-900">
                                Refund Details
                            </h2>

                            <p className="text-sm text-slate-500">
                                Configure refund amount and status
                            </p>

                        </div>

                    </div>


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        {/* REFUND AMOUNT */}

                        <div>

                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Refund Amount
                            </label>

                            <div className="relative">

                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                                    ₹
                                </span>

                                <input
                                    type="number"
                                    name="refundAmount"
                                    value={formData.refundAmount}
                                    onChange={handleChange}
                                    min="0"
                                    max={originalAmount}
                                    step="0.01"
                                    placeholder="Enter refund amount"
                                    className={`${inputClass("refundAmount")} pl-9`}
                                />

                            </div>

                            <p className="text-xs text-slate-500 mt-2">
                                Maximum refundable amount: ₹
                                {originalAmount.toLocaleString("en-IN")}
                            </p>

                            {errors.refundAmount && (

                                <p className="text-sm text-red-600 mt-2">
                                    {errors.refundAmount}
                                </p>

                            )}

                        </div>


                        {/* STATUS */}

                        <div>

                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Refund Status
                            </label>

                            <select
                                name="refundStatus"
                                value={formData.refundStatus}
                                onChange={handleChange}
                                className={inputClass("refundStatus")}
                            >

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

                            {errors.refundStatus && (

                                <p className="text-sm text-red-600 mt-2">
                                    {errors.refundStatus}
                                </p>

                            )}

                        </div>


                        {/* REFUND METHOD */}

                        <div>

                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Refund Method
                            </label>

                            <select
                                name="refundMethod"
                                value={formData.refundMethod}
                                onChange={handleChange}
                                className={inputClass("refundMethod")}
                            >

                                <option value="">
                                    Select refund method
                                </option>

                                <option value="UPI">
                                    UPI
                                </option>

                                <option value="Credit / Debit Card">
                                    Credit / Debit Card
                                </option>

                                <option value="Net Banking">
                                    Net Banking
                                </option>

                                <option value="Wallet">
                                    Wallet
                                </option>

                                <option value="Cash on Delivery">
                                    Cash on Delivery
                                </option>

                            </select>

                            {errors.refundMethod && (

                                <p className="text-sm text-red-600 mt-2">
                                    {errors.refundMethod}
                                </p>

                            )}

                        </div>


                        {/* REFUND TRANSACTION ID */}

                        <div>

                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Refund Transaction ID
                            </label>

                            <input
                                type="text"
                                name="refundTransactionId"
                                value={formData.refundTransactionId}
                                onChange={handleChange}
                                placeholder="e.g. RFND982341"
                                className={inputClass(
                                    "refundTransactionId"
                                )}
                            />

                            {errors.refundTransactionId && (

                                <p className="text-sm text-red-600 mt-2">
                                    {errors.refundTransactionId}
                                </p>

                            )}

                        </div>

                    </div>

                </div>


                {/* REFUND REASON */}

                <div className="bg-white border border-slate-200 rounded-2xl p-6">

                    <h2 className="font-semibold text-slate-900 mb-2">
                        Refund Reason
                    </h2>

                    <p className="text-sm text-slate-500 mb-5">
                        Record why this refund is being processed.
                    </p>

                    <textarea
                        name="refundReason"
                        value={formData.refundReason}
                        onChange={handleChange}
                        rows="4"
                        placeholder="Example: Customer requested cancellation"
                        className={inputClass("refundReason")}
                    />

                    {errors.refundReason && (

                        <p className="text-sm text-red-600 mt-2">
                            {errors.refundReason}
                        </p>

                    )}

                </div>


                {/* REFUND SUMMARY */}

                <div className="bg-white border border-slate-200 rounded-2xl p-6">

                    <h2 className="font-semibold text-slate-900 mb-5">
                        Refund Summary
                    </h2>

                    <div className="space-y-3 text-sm">

                        <div className="flex justify-between">

                            <span className="text-slate-500">
                                Original Payment
                            </span>

                            <span className="font-medium">
                                ₹
                                {originalAmount.toLocaleString("en-IN")}
                            </span>

                        </div>


                        <div className="flex justify-between">

                            <span className="text-slate-500">
                                Refund Amount
                            </span>

                            <span className="font-medium text-rose-600">
                                - ₹
                                {currentRefundAmount.toLocaleString(
                                    "en-IN"
                                )}
                            </span>

                        </div>


                        <div className="border-t border-slate-200 pt-3 flex justify-between">

                            <span className="font-semibold text-slate-900">
                                Remaining Amount
                            </span>

                            <span className="font-bold text-lg text-slate-900">
                                ₹
                                {Math.max(
                                    remainingAmount,
                                    0
                                ).toLocaleString("en-IN")}
                            </span>

                        </div>

                    </div>

                </div>


                {/* ADMIN NOTE */}

                <div className="bg-white border border-slate-200 rounded-2xl p-6">

                    <h2 className="font-semibold text-slate-900 mb-5">
                        Internal Admin Note
                    </h2>

                    <textarea
                        name="adminNote"
                        value={formData.adminNote}
                        onChange={handleChange}
                        rows="4"
                        placeholder="Add an internal note about this refund..."
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none resize-none focus:ring-2 focus:ring-slate-200"
                    />

                </div>


                {/* ACTIONS */}

                <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">

                    <Link
                        to={`/admin/payments/${payment.id}`}
                        className="px-5 py-3 border border-slate-200 rounded-xl text-sm font-medium text-center hover:bg-slate-50"
                    >
                        Cancel
                    </Link>

                    <button
                        type="submit"
                        className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition"
                    >

                        <Save size={17} />

                        Save Refund

                    </button>

                </div>

            </form>

        </div>
    );
};

export default AdminEditRefund;