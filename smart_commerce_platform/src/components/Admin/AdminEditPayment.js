import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, CreditCard, RotateCcw, } from "lucide-react";

const AdminEditPayment = ({ payments = [] }) => {

    const { paymentId } = useParams();
    const navigate = useNavigate();

    const payment = payments.find(
        (item) => String(item.id) === String(paymentId)
    );

    const [formData, setFormData] = useState(
        payment || {
            status: "Pending",
            method: "UPI",
            gateway: "",
            transactionId: "",
            adminNote: "",
            refundAmount: "",
            refundReason: "",
        }
    );

    const [errors, setErrors] = useState({});

    /* PAYMENT NOT FOUND */

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
                    The payment transaction does not exist.
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


    /* HANDLE CHANGE */

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((current) => ({
            ...current,
            [name]: value,
        }));

        // Remove error when user starts correcting field
        setErrors((current) => ({
            ...current,
            [name]: "",
        }));
    };


    /* VALIDATION */

    const validateForm = () => {

        const newErrors = {};

        // Payment status
        if (!formData.status) {
            newErrors.status = "Payment status is required.";
        }

        // Payment method
        if (!formData.method) {
            newErrors.method = "Payment method is required.";
        }

        // Gateway
        if (!formData.gateway.trim()) {
            newErrors.gateway = "Payment gateway is required.";
        }

        // Transaction ID
        if (!formData.transactionId.trim()) {
            newErrors.transactionId =
                "Transaction ID is required.";
        }

        // Refund amount
        if (formData.refundAmount !== "") {

            const refundAmount =
                Number(formData.refundAmount);

            if (isNaN(refundAmount)) {
                newErrors.refundAmount =
                    "Refund amount must be a valid number.";
            }

            if (refundAmount < 0) {
                newErrors.refundAmount =
                    "Refund amount cannot be negative.";
            }
        }

        // Refund reason required when refund amount exists
        if (
            formData.refundAmount !== "" &&
            Number(formData.refundAmount) > 0 &&
            !formData.refundReason
        ) {
            newErrors.refundReason =
                "Refund reason is required when refund amount is entered.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };


    /* SUBMIT */

    const handleSubmit = (e) => {

        e.preventDefault();

        console.log(
            "PAYMENT FORM SUBMISSION STARTED"
        );

        // Validate form
        const isValid = validateForm();

        if (!isValid) {

            console.log(
                "PAYMENT FORM VALIDATION FAILED:",
                errors
            );

            return;
        }

        try {

            const updatedPayment = {
                ...payment,
                ...formData,

                paymentId: payment.id,

                refundAmount:
                    formData.refundAmount === ""
                        ? 0
                        : Number(formData.refundAmount),
            };


            /* SUCCESS CONSOLE LOG */

            console.log(
                "UPDATED PAYMENT DATA:"
            );

            console.log(updatedPayment);

            alert(
                "Payment updated successfully!"
            );

            navigate(
                `/admin/payments/${payment.id}`
            );

        } catch (error) {

            console.error(
                "ERROR UPDATING PAYMENT:",
                error
            );

            alert(
                "Something went wrong while updating payment."
            );
        }
    };


    return (
        <div className="max-w-5xl mx-auto space-y-6">

            {/* HEADER */}

            <div className="flex items-center gap-3">

                <Link
                    to={`/admin/payments/${payment.id}`}
                    className="p-2 border border-slate-200 rounded-xl hover:bg-slate-100"
                >
                    <ArrowLeft size={19} />
                </Link>

                <div>

                    <h1 className="text-2xl font-bold text-slate-900">
                        Update Payment
                    </h1>

                    <p className="text-sm text-slate-500 mt-1">
                        Payment {payment.id}
                    </p>

                </div>

            </div>


            <form
                onSubmit={handleSubmit}
                className="space-y-6"
            >

                {/* PAYMENT STATUS */}

                <div className="bg-white border border-slate-200 rounded-2xl p-6">

                    <div className="flex items-center gap-3 mb-5">

                        <CreditCard size={20} />

                        <h2 className="font-semibold">
                            Payment Status
                        </h2>

                    </div>


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        {/* STATUS */}

                        <div>

                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Status
                            </label>

                            <select
                                name="status"
                                value={formData.status || ""}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 border rounded-xl outline-none ${errors.status
                                        ? "border-red-400 bg-red-50"
                                        : "border-slate-200"
                                    }`}
                            >

                                <option value="">
                                    Select Status
                                </option>

                                <option value="Pending">
                                    Pending
                                </option>

                                <option value="Paid">
                                    Paid
                                </option>

                                <option value="Failed">
                                    Failed
                                </option>

                                <option value="Refunded">
                                    Refunded
                                </option>

                                <option value="PartiallyRefunded">
                                    Partially Refunded
                                </option>

                            </select>

                            {errors.status && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.status}
                                </p>
                            )}

                        </div>


                        {/* METHOD */}

                        <div>

                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Payment Method
                            </label>

                            <select
                                name="method"
                                value={formData.method || ""}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 border rounded-xl outline-none ${errors.method
                                        ? "border-red-400 bg-red-50"
                                        : "border-slate-200"
                                    }`}
                            >

                                <option value="">
                                    Select Method
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

                            {errors.method && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.method}
                                </p>
                            )}

                        </div>

                    </div>

                </div>


                {/* TRANSACTION */}

                <div className="bg-white border border-slate-200 rounded-2xl p-6">

                    <h2 className="font-semibold text-slate-900 mb-5">
                        Transaction Information
                    </h2>


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        {/* GATEWAY */}

                        <div>

                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Payment Gateway
                            </label>

                            <input
                                type="text"
                                name="gateway"
                                value={formData.gateway || ""}
                                onChange={handleChange}
                                placeholder="e.g. Razorpay"
                                className={`w-full px-4 py-3 border rounded-xl outline-none ${errors.gateway
                                        ? "border-red-400 bg-red-50"
                                        : "border-slate-200"
                                    }`}
                            />

                            {errors.gateway && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.gateway}
                                </p>
                            )}

                        </div>


                        {/* TRANSACTION ID */}

                        <div>

                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Transaction ID
                            </label>

                            <input
                                type="text"
                                name="transactionId"
                                value={formData.transactionId || ""}
                                onChange={handleChange}
                                placeholder="Transaction ID"
                                className={`w-full px-4 py-3 border rounded-xl outline-none ${errors.transactionId
                                        ? "border-red-400 bg-red-50"
                                        : "border-slate-200"
                                    }`}
                            />

                            {errors.transactionId && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.transactionId}
                                </p>
                            )}

                        </div>

                    </div>

                </div>


                {/* REFUND */}

                <div className="bg-white border border-slate-200 rounded-2xl p-6">

                    <div className="flex items-center gap-3 mb-5">

                        <RotateCcw size={20} />

                        <h2 className="font-semibold">
                            Refund Information
                        </h2>

                    </div>


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        {/* REFUND AMOUNT */}

                        <div>

                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Refund Amount
                            </label>

                            <input
                                type="number"
                                name="refundAmount"
                                value={formData.refundAmount || ""}
                                onChange={handleChange}
                                placeholder="Enter refund amount"
                                min="0"
                                step="0.01"
                                className={`w-full px-4 py-3 border rounded-xl outline-none ${errors.refundAmount
                                        ? "border-red-400 bg-red-50"
                                        : "border-slate-200"
                                    }`}
                            />

                            {errors.refundAmount && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.refundAmount}
                                </p>
                            )}

                        </div>


                        {/* REFUND REASON */}

                        <div>

                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Refund Reason
                            </label>

                            <input
                                type="text"
                                name="refundReason"
                                value={formData.refundReason || ""}
                                onChange={handleChange}
                                placeholder="Customer requested cancellation"
                                className={`w-full px-4 py-3 border rounded-xl outline-none ${errors.refundReason
                                        ? "border-red-400 bg-red-50"
                                        : "border-slate-200"
                                    }`}
                            />

                            {errors.refundReason && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.refundReason}
                                </p>
                            )}

                        </div>

                    </div>

                </div>


                {/* ADMIN NOTE */}

                <div className="bg-white border border-slate-200 rounded-2xl p-6">

                    <h2 className="font-semibold text-slate-900 mb-5">
                        Admin Note
                    </h2>

                    <textarea
                        name="adminNote"
                        value={formData.adminNote || ""}
                        onChange={handleChange}
                        rows="5"
                        placeholder="Add internal payment note..."
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none resize-none"
                    />

                </div>


                {/* ACTIONS */}

                <div className="flex justify-end gap-3">

                    <Link
                        to={`/admin/payments/${payment.id}`}
                        className="px-5 py-3 border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50"
                    >
                        Cancel
                    </Link>


                    <button
                        type="submit"
                        className="inline-flex items-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800"
                    >

                        <Save size={17} />

                        Save Changes

                    </button>

                </div>

            </form>

        </div>
    );
};

export default AdminEditPayment;