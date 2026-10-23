import React, { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Wallet, IndianRupee, Building2, CreditCard, CalendarDays, FileText, Save, AlertCircle, CheckCircle, } from "lucide-react";

const AdminMakePayout = ({ payouts = [], vendors = [] }) => {
    const { payoutId, vendorId } = useParams();
    const navigate = useNavigate();

    const selectedPayout = payouts.find(
        (item) =>
            String(item.id) === String(payoutId) ||
            String(item.vendorId) === String(vendorId)
    );

    const selectedVendor =
        vendors.find(
            (vendor) =>
                String(vendor.id) ===
                String(selectedPayout?.vendorId || vendorId)
        ) ||
        selectedPayout?.vendor ||
        null;

    const settlement = selectedPayout || {
        id: payoutId || "SET-10001",
        vendorId: vendorId || "1",
        vendorName:
            typeof selectedVendor === "string"
                ? selectedVendor
                : selectedVendor?.name || "ElectroCore",

        month: "August 2026",

        totalSales: 18420,
        refunds: 500,
        commission: 1842,
        shippingFees: 0,
        adjustments: 0,

        totalPayable: 16078,
        amountPaid: 8000,
        remainingAmount: 8078,
    };

    const vendorName =
        typeof selectedVendor === "string"
            ? selectedVendor
            : selectedVendor?.name || settlement.vendorName || "Vendor";

    const calculatedRemaining = Math.max(
        Number(settlement.totalPayable || 0) -
        Number(settlement.amountPaid || 0),
        0
    );

    const [formData, setFormData] = useState({
        amount: calculatedRemaining,
        paymentMethod: "Bank Transfer",
        transactionId: "",
        payoutDate: new Date().toISOString().split("T")[0],
        accountName:
            typeof selectedVendor === "object"
                ? selectedVendor?.owner || ""
                : "",
        accountNumber: "",
        ifscCode: "",
        upiId: "",
        note: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const remainingAmount = useMemo(() => {
        return Math.max(
            Number(settlement.totalPayable || 0) -
            Number(settlement.amountPaid || 0),
            0
        );
    }, [settlement]);

    const payoutAmount = Number(formData.amount || 0);

    const balanceAfterPayout = Math.max(
        remainingAmount - payoutAmount,
        0
    );

    const handleChange = (e) => {
        const { name, value } = e.target;

        setError("");

        setFormData((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleAmountChange = (e) => {
        let value = Number(e.target.value);

        if (value < 0) {
            value = 0;
        }

        setError("");

        setFormData((current) => ({
            ...current,
            amount: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        setError("");

        /*
         * Validation
         */

        if (payoutAmount <= 0) {
            setError("Please enter a valid payout amount.");
            return;
        }

        if (payoutAmount > remainingAmount) {
            setError(
                `Payout amount cannot exceed the remaining amount of ₹${remainingAmount.toLocaleString(
                    "en-IN"
                )}.`
            );
            return;
        }

        if (!formData.paymentMethod) {
            setError("Please select a payment method.");
            return;
        }

        if (!formData.payoutDate) {
            setError("Please select a payout date.");
            return;
        }

        if (
            (formData.paymentMethod === "Bank Transfer" ||
                formData.paymentMethod === "NEFT" ||
                formData.paymentMethod === "IMPS") &&
            !formData.transactionId
        ) {
            setError(
                "Transaction/reference ID is required for bank payments."
            );
            return;
        }

        if (
            formData.paymentMethod === "UPI" &&
            !formData.transactionId
        ) {
            setError(
                "UPI transaction/reference ID is required."
            );
            return;
        }

        const payoutData = {
            settlementId: settlement.id,

            vendorId:
                settlement.vendorId ||
                selectedVendor?.id ||
                vendorId,

            vendorName,

            month: settlement.month,

            amount: payoutAmount,

            previousPaidAmount: settlement.amountPaid || 0,

            remainingBeforePayout: remainingAmount,

            remainingAfterPayout: balanceAfterPayout,

            paymentMethod: formData.paymentMethod,

            transactionId: formData.transactionId,

            payoutDate: formData.payoutDate,

            accountName: formData.accountName,

            accountNumber: formData.accountNumber,

            ifscCode: formData.ifscCode,

            upiId: formData.upiId,

            note: formData.note,

            status:
                balanceAfterPayout === 0
                    ? "Paid"
                    : "Partially Paid",

            createdAt: new Date().toISOString(),
        };

        console.log("VENDOR PAYOUT CREATED:");
        console.log(payoutData);

        setSuccess(true);

        setTimeout(() => {
            navigate("/admin/payouts");
        }, 1500);
    };

    if (!settlement) {
        return (
            <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">

                <Wallet
                    size={48}
                    className="mx-auto text-slate-300 mb-4"
                />

                <h2 className="text-xl font-bold text-slate-900">
                    Settlement Not Found
                </h2>

                <p className="text-slate-500 mt-2">
                    The vendor settlement could not be found.
                </p>

                <Link
                    to="/admin/payouts"
                    className="inline-flex mt-5 px-5 py-2.5 bg-slate-900 text-white rounded-xl"
                >
                    Back to Payouts
                </Link>

            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6">

            {/* HEADER */}

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                <div className="flex items-center gap-3">

                    <Link
                        to={`/admin/payouts/${settlement.id}`}
                        className="p-2.5 border border-slate-200 rounded-xl hover:bg-slate-100 transition"
                    >
                        <ArrowLeft size={19} />
                    </Link>

                    <div>

                        <h1 className="text-2xl font-bold text-slate-900">
                            Make Vendor Payout
                        </h1>

                        <p className="text-sm text-slate-500 mt-1">
                            Record payment for {vendorName}
                        </p>

                    </div>

                </div>

                <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 text-amber-700 rounded-xl text-sm font-medium">

                    <CalendarDays size={17} />

                    {settlement.month}

                </div>

            </div>


            {/* SUCCESS */}

            {success && (
                <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl px-5 py-4">

                    <CheckCircle size={20} />

                    <div>

                        <p className="font-semibold">
                            Payout recorded successfully
                        </p>

                        <p className="text-sm mt-0.5">
                            Redirecting to payouts...
                        </p>

                    </div>

                </div>
            )}


            {/* ERROR */}

            {error && (
                <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl px-5 py-4">

                    <AlertCircle
                        size={20}
                        className="mt-0.5 shrink-0"
                    />

                    <p className="text-sm font-medium">
                        {error}
                    </p>

                </div>
            )}


            {/* SUMMARY */}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

                <div className="bg-white border border-slate-200 rounded-2xl p-5">

                    <p className="text-sm text-slate-500">
                        Total Settlement
                    </p>

                    <p className="text-2xl font-bold text-slate-900 mt-2">
                        ₹{Number(settlement.totalPayable || 0).toLocaleString("en-IN")}
                    </p>

                </div>


                <div className="bg-white border border-slate-200 rounded-2xl p-5">

                    <p className="text-sm text-slate-500">
                        Already Paid
                    </p>

                    <p className="text-2xl font-bold text-emerald-600 mt-2">
                        ₹{Number(settlement.amountPaid || 0).toLocaleString("en-IN")}
                    </p>

                </div>


                <div className="bg-white border border-slate-200 rounded-2xl p-5">

                    <p className="text-sm text-slate-500">
                        Remaining
                    </p>

                    <p className="text-2xl font-bold text-orange-600 mt-2">
                        ₹{remainingAmount.toLocaleString("en-IN")}
                    </p>

                </div>


                <div className="bg-slate-900 text-white rounded-2xl p-5">

                    <p className="text-sm text-slate-300">
                        This Payout
                    </p>

                    <p className="text-2xl font-bold mt-2">
                        ₹{payoutAmount.toLocaleString("en-IN")}
                    </p>

                </div>

            </div>


            {/* FORM */}

            <form
                onSubmit={handleSubmit}
                className="space-y-6"
            >

                {/* VENDOR */}

                <div className="bg-white border border-slate-200 rounded-2xl p-6">

                    <div className="flex items-center gap-3 mb-6">

                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">

                            <Building2
                                size={20}
                                className="text-slate-700"
                            />

                        </div>

                        <div>

                            <h2 className="font-semibold text-slate-900">
                                Vendor Information
                            </h2>

                            <p className="text-sm text-slate-500">
                                Settlement recipient
                            </p>

                        </div>

                    </div>


                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                        <div>

                            <p className="text-xs text-slate-500 mb-1">
                                Vendor
                            </p>

                            <p className="font-semibold text-slate-900">
                                {vendorName}
                            </p>

                        </div>

                        <div>

                            <p className="text-xs text-slate-500 mb-1">
                                Settlement ID
                            </p>

                            <p className="font-medium text-slate-900">
                                {settlement.id}
                            </p>

                        </div>

                        <div>

                            <p className="text-xs text-slate-500 mb-1">
                                Settlement Period
                            </p>

                            <p className="font-medium text-slate-900">
                                {settlement.month}
                            </p>

                        </div>

                    </div>

                </div>


                {/* PAYOUT AMOUNT */}

                <div className="bg-white border border-slate-200 rounded-2xl p-6">

                    <div className="flex items-center gap-3 mb-6">

                        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">

                            <IndianRupee
                                size={20}
                                className="text-emerald-600"
                            />

                        </div>

                        <div>

                            <h2 className="font-semibold text-slate-900">
                                Payout Amount
                            </h2>

                            <p className="text-sm text-slate-500">
                                Enter the amount paid to the vendor
                            </p>

                        </div>

                    </div>


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        <div>

                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Amount to Pay
                            </label>

                            <div className="relative">

                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">
                                    ₹
                                </span>

                                <input
                                    type="number"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleAmountChange}
                                    min="0"
                                    max={remainingAmount}
                                    step="0.01"
                                    className="w-full pl-9 pr-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-200"
                                />

                            </div>

                            <p className="text-xs text-slate-500 mt-2">
                                Maximum payable amount: ₹
                                {remainingAmount.toLocaleString("en-IN")}
                            </p>

                        </div>


                        <div className="bg-slate-50 rounded-xl p-4">

                            <p className="text-sm text-slate-500">
                                Balance After Payout
                            </p>

                            <p
                                className={`text-xl font-bold mt-2 ${balanceAfterPayout === 0
                                        ? "text-emerald-600"
                                        : "text-orange-600"
                                    }`}
                            >
                                ₹{balanceAfterPayout.toLocaleString("en-IN")}
                            </p>

                            <p className="text-xs text-slate-500 mt-1">
                                {balanceAfterPayout === 0
                                    ? "Settlement will be fully paid."
                                    : "Remaining amount will be paid later."}
                            </p>

                        </div>

                    </div>

                </div>


                {/* PAYMENT DETAILS */}

                <div className="bg-white border border-slate-200 rounded-2xl p-6">

                    <div className="flex items-center gap-3 mb-6">

                        <CreditCard size={20} />

                        <div>

                            <h2 className="font-semibold text-slate-900">
                                Payment Details
                            </h2>

                            <p className="text-sm text-slate-500">
                                Record how the vendor was paid
                            </p>

                        </div>

                    </div>


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        {/* METHOD */}

                        <div>

                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Payment Method
                            </label>

                            <select
                                name="paymentMethod"
                                value={formData.paymentMethod}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-200"
                            >

                                <option>Bank Transfer</option>
                                <option>NEFT</option>
                                <option>IMPS</option>
                                <option>UPI</option>
                                <option>Cheque</option>

                            </select>

                        </div>


                        {/* DATE */}

                        <div>

                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Payout Date
                            </label>

                            <input
                                type="date"
                                name="payoutDate"
                                value={formData.payoutDate}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-200"
                            />

                        </div>


                        {/* TRANSACTION */}

                        <div>

                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Transaction / Reference ID
                            </label>

                            <input
                                type="text"
                                name="transactionId"
                                value={formData.transactionId}
                                onChange={handleChange}
                                placeholder="e.g. NEFT982341"
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-200"
                            />

                        </div>


                        {/* ACCOUNT NAME */}

                        <div>

                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Account Holder Name
                            </label>

                            <input
                                type="text"
                                name="accountName"
                                value={formData.accountName}
                                onChange={handleChange}
                                placeholder="Vendor account holder"
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-200"
                            />

                        </div>


                        {/* ACCOUNT NUMBER */}

                        <div>

                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Account Number
                            </label>

                            <input
                                type="text"
                                name="accountNumber"
                                value={formData.accountNumber}
                                onChange={handleChange}
                                placeholder="Bank account number"
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-200"
                            />

                        </div>


                        {/* IFSC */}

                        <div>

                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                IFSC Code
                            </label>

                            <input
                                type="text"
                                name="ifscCode"
                                value={formData.ifscCode}
                                onChange={handleChange}
                                placeholder="e.g. HDFC0001234"
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-200 uppercase"
                            />

                        </div>


                        {/* UPI */}

                        <div className="md:col-span-2">

                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                UPI ID
                            </label>

                            <input
                                type="text"
                                name="upiId"
                                value={formData.upiId}
                                onChange={handleChange}
                                placeholder="vendor@upi"
                                className="w-full md:w-1/2 px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-200"
                            />

                        </div>

                    </div>

                </div>


                {/* SETTLEMENT BREAKDOWN */}

                <div className="bg-white border border-slate-200 rounded-2xl p-6">

                    <div className="flex items-center gap-3 mb-5">

                        <FileText size={20} />

                        <h2 className="font-semibold text-slate-900">
                            Settlement Breakdown
                        </h2>

                    </div>

                    <div className="space-y-3 text-sm">

                        <div className="flex justify-between">

                            <span className="text-slate-500">
                                Total Sales
                            </span>

                            <span className="font-medium">
                                ₹{Number(settlement.totalSales || 0).toLocaleString("en-IN")}
                            </span>

                        </div>

                        <div className="flex justify-between">

                            <span className="text-slate-500">
                                Refunds
                            </span>

                            <span className="font-medium text-red-600">
                                - ₹{Number(settlement.refunds || 0).toLocaleString("en-IN")}
                            </span>

                        </div>

                        <div className="flex justify-between">

                            <span className="text-slate-500">
                                Commission
                            </span>

                            <span className="font-medium text-red-600">
                                - ₹{Number(settlement.commission || 0).toLocaleString("en-IN")}
                            </span>

                        </div>

                        <div className="flex justify-between">

                            <span className="text-slate-500">
                                Shipping Fees
                            </span>

                            <span>
                                ₹{Number(settlement.shippingFees || 0).toLocaleString("en-IN")}
                            </span>

                        </div>

                        <div className="flex justify-between">

                            <span className="text-slate-500">
                                Adjustments
                            </span>

                            <span>
                                ₹{Number(settlement.adjustments || 0).toLocaleString("en-IN")}
                            </span>

                        </div>

                        <div className="border-t border-slate-200 pt-4 flex justify-between">

                            <span className="font-semibold">
                                Net Payable
                            </span>

                            <span className="font-bold text-lg">
                                ₹{Number(settlement.totalPayable || 0).toLocaleString("en-IN")}
                            </span>

                        </div>

                    </div>

                </div>


                {/* ADMIN NOTE */}

                <div className="bg-white border border-slate-200 rounded-2xl p-6">

                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-900 mb-3">

                        <FileText size={18} />

                        Admin Note

                    </label>

                    <textarea
                        name="note"
                        value={formData.note}
                        onChange={handleChange}
                        rows="4"
                        placeholder="Add internal note about this vendor payout..."
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none resize-none focus:ring-2 focus:ring-slate-200"
                    />

                </div>


                {/* ACTIONS */}

                <div className="flex flex-col sm:flex-row justify-end gap-3">

                    <Link
                        to={`/admin/payouts/${settlement.id}`}
                        className="px-5 py-3 border border-slate-200 rounded-xl text-sm font-medium text-center hover:bg-slate-50"
                    >
                        Cancel
                    </Link>

                    <button
                        type="submit"
                        disabled={success || remainingAmount <= 0}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >

                        <Save size={17} />

                        {remainingAmount <= 0
                            ? "Settlement Fully Paid"
                            : "Record Payout"}

                    </button>

                </div>

            </form>

        </div>
    );
};

export default AdminMakePayout;