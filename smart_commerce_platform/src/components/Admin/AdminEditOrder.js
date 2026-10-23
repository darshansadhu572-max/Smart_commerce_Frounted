import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams, } from "react-router-dom";
import { ArrowLeft, Save, Package, User, CreditCard, MapPin, FileText, } from "lucide-react";

const AdminEditOrder = ({ orders = [] }) => {
    const { orderId } = useParams();
    const navigate = useNavigate();

    const order = orders.find(
        (item) => String(item.id) === String(orderId)
    );

    const [formData, setFormData] = useState(null);
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState("");

    useEffect(() => {
        if (order) {
            setFormData({
                status: order.status || "Pending",

                customerName: order.customer?.name || "",
                customerEmail: order.customer?.email || "",
                customerPhone: order.customer?.phone || "",

                paymentMethod:
                    order.payment?.method || "Cash on Delivery",

                paymentStatus:
                    order.payment?.status || "Pending",

                transactionId:
                    order.payment?.transactionId || "",

                address:
                    order.shippingAddress?.address || "",

                city:
                    order.shippingAddress?.city || "",

                state:
                    order.shippingAddress?.state || "",

                pincode:
                    order.shippingAddress?.pincode || "",

                country:
                    order.shippingAddress?.country || "India",

                shipping: order.shipping || 0,
                discount: order.discount || 0,
                tax: order.tax || 0,

                shippingProvider:
                    order.shippingProvider || "",

                trackingNumber:
                    order.trackingNumber || "",

                adminNote:
                    order.adminNote || "",
            });
        }
    }, [order]);


    /* ORDER NOT FOUND */

    if (!order) {
        return (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">

                <Package
                    size={48}
                    className="mx-auto mb-4 text-slate-300"
                />

                <h2 className="text-xl font-bold text-slate-900">
                    Order Not Found
                </h2>

                <p className="mt-2 text-slate-500">
                    The order you are trying to edit does not exist.
                </p>

                <Link
                    to="/admin/orders"
                    className="mt-5 inline-flex rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white"
                >
                    Back to Orders
                </Link>

            </div>
        );
    }


    if (!formData) {
        return null;
    }


    /* HANDLE INPUT */

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((current) => ({
            ...current,
            [name]: value,
        }));

        // Clear field error
        setErrors((current) => ({
            ...current,
            [name]: "",
        }));

        // Clear general error
        if (submitError) {
            setSubmitError("");
        }
    };


    /* VALIDATION */

    const validateForm = () => {
        const newErrors = {};

        const customerName =
            formData.customerName.trim();

        const customerEmail =
            formData.customerEmail.trim();

        const customerPhone =
            formData.customerPhone.trim();

        const address =
            formData.address.trim();

        const city =
            formData.city.trim();

        const state =
            formData.state.trim();

        const pincode =
            formData.pincode.trim();

        const country =
            formData.country.trim();

        const transactionId =
            formData.transactionId.trim();

        /* CUSTOMER NAME */

        if (!customerName) {
            newErrors.customerName =
                "Customer name is required.";
        } else if (customerName.length < 2) {
            newErrors.customerName =
                "Customer name must contain at least 2 characters.";
        }


        /* EMAIL */

        if (!customerEmail) {
            newErrors.customerEmail =
                "Customer email is required.";
        } else {
            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailPattern.test(customerEmail)) {
                newErrors.customerEmail =
                    "Please enter a valid email address.";
            }
        }


        /* PHONE */

        if (!customerPhone) {
            newErrors.customerPhone =
                "Customer phone number is required.";
        } else {
            const phoneDigits =
                customerPhone.replace(/\D/g, "");

            if (phoneDigits.length !== 10) {
                newErrors.customerPhone =
                    "Phone number must contain 10 digits.";
            }
        }


        /* ADDRESS */

        if (!address) {
            newErrors.address =
                "Shipping address is required.";
        } else if (address.length < 5) {
            newErrors.address =
                "Please enter a complete shipping address.";
        }


        /* CITY */

        if (!city) {
            newErrors.city =
                "City is required.";
        }


        /* STATE */

        if (!state) {
            newErrors.state =
                "State is required.";
        }


        /* PIN CODE */

        if (!pincode) {
            newErrors.pincode =
                "PIN code is required.";
        } else if (!/^\d{6}$/.test(pincode)) {
            newErrors.pincode =
                "PIN code must contain exactly 6 digits.";
        }


        /* COUNTRY */

        if (!country) {
            newErrors.country =
                "Country is required.";
        }


        /* TRANSACTION ID */

        if (
            formData.paymentMethod !==
            "Cash on Delivery" &&
            formData.paymentStatus === "Paid" &&
            !transactionId
        ) {
            newErrors.transactionId =
                "Transaction ID is required for paid online orders.";
        }


        /* SHIPPING */

        const shipping =
            Number(formData.shipping);

        if (
            formData.shipping === "" ||
            Number.isNaN(shipping)
        ) {
            newErrors.shipping =
                "Shipping amount is required.";
        } else if (shipping < 0) {
            newErrors.shipping =
                "Shipping amount cannot be negative.";
        }


        /* DISCOUNT */

        const discount =
            Number(formData.discount);

        if (
            formData.discount === "" ||
            Number.isNaN(discount)
        ) {
            newErrors.discount =
                "Discount amount is required.";
        } else if (discount < 0) {
            newErrors.discount =
                "Discount amount cannot be negative.";
        }


        /* TAX */

        const tax =
            Number(formData.tax);

        if (
            formData.tax === "" ||
            Number.isNaN(tax)
        ) {
            newErrors.tax =
                "Tax amount is required.";
        } else if (tax < 0) {
            newErrors.tax =
                "Tax amount cannot be negative.";
        }


        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };


    /* SUBMIT */

    const handleSubmit = (e) => {
        e.preventDefault();

        setSubmitError("");

        const isValid = validateForm();

        if (!isValid) {
            setSubmitError(
                "Please fix the highlighted fields before saving the order."
            );

            return;
        }

        try {
            const updatedOrder = {
                ...order,

                status: formData.status,

                customer: {
                    name: formData.customerName.trim(),
                    email: formData.customerEmail.trim(),
                    phone: formData.customerPhone.trim(),
                },

                payment: {
                    method: formData.paymentMethod,
                    status: formData.paymentStatus,
                    transactionId:
                        formData.transactionId.trim() || null,
                },

                shippingAddress: {
                    name: formData.customerName.trim(),
                    address: formData.address.trim(),
                    city: formData.city.trim(),
                    state: formData.state.trim(),
                    pincode: formData.pincode.trim(),
                    country: formData.country.trim(),
                },

                shipping:
                    Number(formData.shipping),

                discount:
                    Number(formData.discount),

                tax:
                    Number(formData.tax),

                shippingProvider:
                    formData.shippingProvider.trim(),

                trackingNumber:
                    formData.trackingNumber.trim(),

                adminNote:
                    formData.adminNote.trim(),
            };


            /*
             * Temporary frontend testing.
             *
             * Later this will be replaced with
             * an API request to your MERN backend.
             */

            console.log(
                "EDIT ORDER FORM DATA:",
                updatedOrder
            );


            navigate(
                `/admin/orders/${order.id}`
            );

        } catch (error) {
            console.error(
                "EDIT ORDER ERROR:",
                error
            );

            setSubmitError(
                "Something went wrong while updating the order. Please try again."
            );
        }
    };


    return (
        <div className="mx-auto max-w-6xl space-y-6">

            {/* HEADER */}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex items-center gap-3">

                    <Link
                        to={`/admin/orders/${order.id}`}
                        className="rounded-xl border border-slate-200 p-2.5 transition hover:bg-slate-100"
                    >
                        <ArrowLeft size={19} />
                    </Link>

                    <div>

                        <h1 className="text-2xl font-bold text-slate-900">
                            Update Order
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            Order #{order.id}
                        </p>

                    </div>

                </div>

            </div>


            <form
                onSubmit={handleSubmit}
                noValidate
                className="space-y-6"
            >

                {/* GENERAL ERROR */}

                {submitError && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                        {submitError}
                    </div>
                )}


                {/* ORDER STATUS */}

                <div className="rounded-2xl border border-slate-200 bg-white p-6">

                    <div className="mb-6 flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                            <Package
                                size={19}
                                className="text-blue-600"
                            />
                        </div>

                        <div>

                            <h2 className="font-semibold text-slate-900">
                                Order Status
                            </h2>

                            <p className="text-sm text-slate-500">
                                Manage the current order stage
                            </p>

                        </div>

                    </div>


                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                        <div>

                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Order Status
                            </label>

                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-200"
                            >

                                <option value="Pending">
                                    Pending
                                </option>

                                <option value="Processing">
                                    Processing
                                </option>

                                <option value="Shipped">
                                    Shipped
                                </option>

                                <option value="Delivered">
                                    Delivered
                                </option>

                                <option value="Cancelled">
                                    Cancelled
                                </option>

                                <option value="Returned">
                                    Returned
                                </option>

                            </select>

                        </div>


                        <div>

                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Payment Status
                            </label>

                            <select
                                name="paymentStatus"
                                value={formData.paymentStatus}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-200"
                            >

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

                            </select>

                        </div>

                    </div>

                </div>


                {/* CUSTOMER */}

                <div className="rounded-2xl border border-slate-200 bg-white p-6">

                    <div className="mb-6 flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                            <User size={19} />
                        </div>

                        <div>

                            <h2 className="font-semibold text-slate-900">
                                Customer Information
                            </h2>

                            <p className="text-sm text-slate-500">
                                Update customer details
                            </p>

                        </div>

                    </div>


                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                        {/* CUSTOMER NAME */}

                        <FormInput
                            label="Customer Name"
                            name="customerName"
                            value={formData.customerName}
                            onChange={handleChange}
                            error={errors.customerName}
                        />


                        {/* EMAIL */}

                        <FormInput
                            label="Email"
                            name="customerEmail"
                            type="email"
                            value={formData.customerEmail}
                            onChange={handleChange}
                            error={errors.customerEmail}
                        />


                        {/* PHONE */}

                        <FormInput
                            label="Phone"
                            name="customerPhone"
                            value={formData.customerPhone}
                            onChange={handleChange}
                            error={errors.customerPhone}
                        />

                    </div>

                </div>


                {/* PAYMENT */}

                <div className="rounded-2xl border border-slate-200 bg-white p-6">

                    <div className="mb-6 flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                            <CreditCard
                                size={19}
                                className="text-emerald-600"
                            />
                        </div>

                        <div>

                            <h2 className="font-semibold text-slate-900">
                                Payment Information
                            </h2>

                            <p className="text-sm text-slate-500">
                                Manage payment details
                            </p>

                        </div>

                    </div>


                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                        <div>

                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Payment Method
                            </label>

                            <select
                                name="paymentMethod"
                                value={formData.paymentMethod}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none"
                            >

                                <option>
                                    Cash on Delivery
                                </option>

                                <option>
                                    UPI
                                </option>

                                <option>
                                    Credit / Debit Card
                                </option>

                                <option>
                                    Net Banking
                                </option>

                                <option>
                                    Wallet
                                </option>

                            </select>

                        </div>


                        <FormInput
                            label="Transaction ID"
                            name="transactionId"
                            value={formData.transactionId}
                            onChange={handleChange}
                            placeholder="Transaction ID"
                            error={errors.transactionId}
                        />

                    </div>

                </div>


                {/* SHIPPING ADDRESS */}

                <div className="rounded-2xl border border-slate-200 bg-white p-6">

                    <div className="mb-6 flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                            <MapPin
                                size={19}
                                className="text-blue-600"
                            />
                        </div>

                        <div>

                            <h2 className="font-semibold text-slate-900">
                                Shipping Address
                            </h2>

                            <p className="text-sm text-slate-500">
                                Update delivery destination
                            </p>

                        </div>

                    </div>


                    <div className="space-y-5">

                        {/* ADDRESS */}

                        <FormTextarea
                            label="Address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            rows="3"
                            error={errors.address}
                        />


                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                            <FormInput
                                label="City"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                error={errors.city}
                            />


                            <FormInput
                                label="State"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                error={errors.state}
                            />


                            <FormInput
                                label="PIN Code"
                                name="pincode"
                                value={formData.pincode}
                                onChange={handleChange}
                                error={errors.pincode}
                            />


                            <FormInput
                                label="Country"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                error={errors.country}
                            />

                        </div>

                    </div>

                </div>


                {/* ORDER AMOUNT */}

                <div className="rounded-2xl border border-slate-200 bg-white p-6">

                    <div className="mb-6 flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
                            <FileText
                                size={19}
                                className="text-amber-600"
                            />
                        </div>

                        <div>

                            <h2 className="font-semibold text-slate-900">
                                Order Amount
                            </h2>

                            <p className="text-sm text-slate-500">
                                Update shipping, discount and tax
                            </p>

                        </div>

                    </div>


                    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

                        <FormInput
                            label="Shipping"
                            name="shipping"
                            type="number"
                            min="0"
                            value={formData.shipping}
                            onChange={handleChange}
                            error={errors.shipping}
                        />


                        <FormInput
                            label="Discount"
                            name="discount"
                            type="number"
                            min="0"
                            value={formData.discount}
                            onChange={handleChange}
                            error={errors.discount}
                        />


                        <FormInput
                            label="Tax"
                            name="tax"
                            type="number"
                            min="0"
                            value={formData.tax}
                            onChange={handleChange}
                            error={errors.tax}
                        />

                    </div>

                </div>


                {/* ADMIN NOTE */}

                <div className="rounded-2xl border border-slate-200 bg-white p-6">

                    <h2 className="mb-2 font-semibold text-slate-900">
                        Admin Note
                    </h2>

                    <p className="mb-4 text-sm text-slate-500">
                        Internal note for administrators.
                        Customers will not see this.
                    </p>

                    <textarea
                        name="adminNote"
                        value={formData.adminNote}
                        onChange={handleChange}
                        rows="4"
                        placeholder="Add an internal note..."
                        className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none"
                    />

                </div>


                {/* ACTIONS */}

                <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">

                    <Link
                        to={`/admin/orders/${order.id}`}
                        className="rounded-xl border border-slate-200 px-5 py-3 text-center text-sm font-medium hover:bg-slate-50"
                    >
                        Cancel
                    </Link>


                    <button
                        type="submit"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800"
                    >

                        <Save size={17} />

                        Save Changes

                    </button>

                </div>

            </form>

        </div>
    );
};


/* =========================================
   REUSABLE INPUT
========================================= */

const FormInput = ({
    label,
    name,
    type = "text",
    value,
    onChange,
    placeholder = "",
    error,
    min,
}) => {
    return (
        <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
                {label}
            </label>

            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                min={min}
                className={`w-full rounded-xl border px-4 py-3 outline-none transition ${error
                    ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
                    : "border-slate-200 focus:border-slate-400"
                    }`}
            />

            {error && (
                <p className="mt-1.5 text-xs font-medium text-red-600">
                    {error}
                </p>
            )}

        </div>
    );
};


/* =========================================
   REUSABLE TEXTAREA
========================================= */

const FormTextarea = ({
    label,
    name,
    value,
    onChange,
    rows = 3,
    error,
}) => {
    return (
        <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
                {label}
            </label>

            <textarea
                name={name}
                value={value}
                onChange={onChange}
                rows={rows}
                className={`w-full resize-none rounded-xl border px-4 py-3 outline-none transition ${error
                    ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
                    : "border-slate-200 focus:border-slate-400"
                    }`}
            />

            {error && (
                <p className="mt-1.5 text-xs font-medium text-red-600">
                    {error}
                </p>
            )}

        </div>
    );
};

export default AdminEditOrder;