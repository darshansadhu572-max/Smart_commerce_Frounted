import React from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Package, User, MapPin, CreditCard, Truck, Clock, CheckCircle, XCircle, CalendarDays, Hash, Store, IndianRupee, RotateCcw, } from "lucide-react";

const AdminViewOrder = ({ orders = [] }) => {
    const { orderId } = useParams();

    const order = orders.find(
        (item) => String(item.id) === String(orderId)
    );

    if (!order) {
        return (
            <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">
                <Package
                    size={48}
                    className="mx-auto text-slate-300 mb-4"
                />

                <h2 className="text-xl font-bold text-slate-900">
                    Order Not Found
                </h2>

                <p className="text-slate-500 mt-2">
                    The order you are looking for does not exist.
                </p>

                <Link
                    to="/admin/orders"
                    className="inline-flex mt-5 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-medium"
                >
                    Back to Orders
                </Link>
            </div>
        );
    }

    const isCancelled = order.status === "Cancelled";
    const isDelivered = order.status === "Delivered";
    const isRefunded = order.payment?.status === "Refunded";

    const getStatusStyle = (status) => {
        switch (status) {
            case "Delivered":
                return "bg-emerald-100 text-emerald-700";

            case "Processing":
                return "bg-blue-100 text-blue-700";

            case "Shipped":
                return "bg-purple-100 text-purple-700";

            case "Pending":
                return "bg-amber-100 text-amber-700";

            case "Cancelled":
                return "bg-red-100 text-red-700";

            default:
                return "bg-slate-100 text-slate-700";
        }
    };

    const getPaymentStyle = (status) => {
        switch (status) {
            case "Paid":
                return "bg-emerald-100 text-emerald-700";

            case "Pending":
                return "bg-amber-100 text-amber-700";

            case "Refunded":
                return "bg-purple-100 text-purple-700";

            case "Failed":
                return "bg-red-100 text-red-700";

            default:
                return "bg-slate-100 text-slate-700";
        }
    };

    return (
        <div className="space-y-6">

            {/* HEADER */}

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                <div className="flex items-center gap-3">

                    <Link
                        to="/admin/orders"
                        className="p-2.5 border border-slate-200 rounded-xl hover:bg-slate-100 transition"
                    >
                        <ArrowLeft size={19} />
                    </Link>

                    <div>
                        <div className="flex items-center gap-3 flex-wrap">

                            <h1 className="text-2xl font-bold text-slate-900">
                                Order #{order.id}
                            </h1>

                            <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                                    order.status
                                )}`}
                            >
                                {order.status}
                            </span>

                        </div>

                        <p className="text-sm text-slate-500 mt-1">
                            Order placed on {order.date}
                        </p>
                    </div>

                </div>

                <div className="flex gap-2">

                    <Link
                        to={`/admin/orders/${order.id}/edit`}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800"
                    >
                        Update Order
                    </Link>

                </div>

            </div>


            {/* QUICK INFORMATION */}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

                {/* Order ID */}

                <div className="bg-white border border-slate-200 rounded-2xl p-5">

                    <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                            <Hash size={19} className="text-slate-600" />
                        </div>

                        <div>
                            <p className="text-xs text-slate-500">
                                Order ID
                            </p>

                            <p className="font-semibold text-slate-900">
                                {order.id}
                            </p>
                        </div>

                    </div>

                </div>


                {/* Date */}

                <div className="bg-white border border-slate-200 rounded-2xl p-5">

                    <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                            <CalendarDays
                                size={19}
                                className="text-blue-600"
                            />
                        </div>

                        <div>
                            <p className="text-xs text-slate-500">
                                Order Date
                            </p>

                            <p className="font-semibold text-slate-900">
                                {order.date}
                            </p>
                        </div>

                    </div>

                </div>


                {/* Payment */}

                <div className="bg-white border border-slate-200 rounded-2xl p-5">

                    <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                            <CreditCard
                                size={19}
                                className="text-emerald-600"
                            />
                        </div>

                        <div>
                            <p className="text-xs text-slate-500">
                                Payment
                            </p>

                            <p className="font-semibold text-slate-900">
                                {order.payment?.method}
                            </p>
                        </div>

                    </div>

                </div>


                {/* Total */}

                <div className="bg-white border border-slate-200 rounded-2xl p-5">

                    <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                            <IndianRupee
                                size={19}
                                className="text-purple-600"
                            />
                        </div>

                        <div>
                            <p className="text-xs text-slate-500">
                                Order Total
                            </p>

                            <p className="font-semibold text-slate-900">
                                ₹{Number(order.total).toLocaleString("en-IN")}
                            </p>
                        </div>

                    </div>

                </div>

            </div>


            {/* ORDER TIMELINE */}

            <div className="bg-white border border-slate-200 rounded-2xl p-6">

                <div className="flex items-center justify-between mb-6">

                    <div>
                        <h2 className="font-semibold text-slate-900">
                            Order Timeline
                        </h2>

                        <p className="text-sm text-slate-500 mt-1">
                            Track the complete order progress
                        </p>
                    </div>

                    {isCancelled && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                            <XCircle size={14} />
                            Cancelled
                        </span>
                    )}

                    {isRefunded && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                            <RotateCcw size={14} />
                            Refunded
                        </span>
                    )}

                </div>


                <div className="space-y-5">

                    {order.timeline?.map((event, index) => (

                        <div
                            key={index}
                            className="flex gap-4"
                        >

                            <div className="flex flex-col items-center">

                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center ${event.completed
                                            ? "bg-emerald-100 text-emerald-600"
                                            : "bg-slate-100 text-slate-400"
                                        }`}
                                >
                                    {event.completed ? (
                                        <CheckCircle size={19} />
                                    ) : (
                                        <Clock size={19} />
                                    )}
                                </div>

                                {index !== order.timeline.length - 1 && (
                                    <div className="w-px h-full bg-slate-200 mt-2" />
                                )}

                            </div>


                            <div className="pb-4">

                                <p
                                    className={`font-medium ${event.completed
                                            ? "text-slate-900"
                                            : "text-slate-400"
                                        }`}
                                >
                                    {event.status}
                                </p>

                                <p className="text-sm text-slate-500 mt-1">
                                    {event.date || "Waiting"}
                                </p>

                            </div>

                        </div>

                    ))}

                </div>

            </div>


            {/* MAIN CONTENT */}

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                {/* LEFT */}

                <div className="xl:col-span-2 space-y-6">

                    {/* PRODUCTS */}

                    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">

                        <div className="p-5 border-b border-slate-200">

                            <div className="flex items-center justify-between">

                                <div>
                                    <h2 className="font-semibold text-slate-900">
                                        Ordered Products
                                    </h2>

                                    <p className="text-sm text-slate-500 mt-1">
                                        {order.items?.length || 0} product
                                        {(order.items?.length || 0) !== 1 ? "s" : ""}
                                    </p>
                                </div>

                                <Package
                                    size={20}
                                    className="text-slate-400"
                                />

                            </div>

                        </div>


                        <div className="divide-y divide-slate-100">

                            {order.items?.map((item, index) => {

                                const itemTotal =
                                    Number(item.price || 0) *
                                    Number(item.quantity || 1);

                                return (
                                    <div
                                        key={index}
                                        className="p-5 flex flex-col sm:flex-row sm:items-center gap-4"
                                    >

                                        {/* IMAGE */}

                                        <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center text-xl font-bold text-slate-500 shrink-0">
                                            {item.name?.charAt(0)}
                                        </div>


                                        {/* PRODUCT */}

                                        <div className="flex-1">

                                            <h3 className="font-medium text-slate-900">
                                                {item.name}
                                            </h3>

                                            <div className="flex flex-wrap items-center gap-3 mt-2">

                                                <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                                                    <Store size={13} />
                                                    {item.vendor}
                                                </span>

                                                <span className="text-xs text-slate-500">
                                                    Quantity: {item.quantity}
                                                </span>

                                            </div>

                                        </div>


                                        {/* PRICE */}

                                        <div className="text-right">

                                            <p className="text-sm text-slate-500">
                                                ₹{Number(item.price).toLocaleString("en-IN")} ×{" "}
                                                {item.quantity}
                                            </p>

                                            <p className="font-semibold text-slate-900 mt-1">
                                                ₹{itemTotal.toLocaleString("en-IN")}
                                            </p>

                                        </div>

                                    </div>
                                );
                            })}

                        </div>

                    </div>


                    {/* SHIPPING ADDRESS */}

                    <div className="bg-white border border-slate-200 rounded-2xl p-6">

                        <div className="flex items-center gap-3 mb-5">

                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
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
                                    Delivery destination
                                </p>
                            </div>

                        </div>


                        <div className="bg-slate-50 rounded-xl p-4 text-sm leading-6">

                            <p className="font-semibold text-slate-900">
                                {order.shippingAddress?.name}
                            </p>

                            <p className="text-slate-600">
                                Address: {order.shippingAddress?.address}
                            </p>

                            <p className="text-slate-600">
                                City: {order.shippingAddress?.city},{" "}
                                State: {order.shippingAddress?.state}
                            </p>

                            <p className="text-slate-600">
                                Pincode: {order.shippingAddress?.pincode}
                            </p>

                            <p className="text-slate-600">
                                Country: {order.shippingAddress?.country}
                            </p>

                        </div>

                    </div>

                </div>


                {/* RIGHT */}

                <div className="space-y-6">

                    {/* CUSTOMER */}

                    <div className="bg-white border border-slate-200 rounded-2xl p-5">

                        <div className="flex items-center gap-3 mb-5">

                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                                <User size={19} />
                            </div>

                            <div>
                                <h2 className="font-semibold text-slate-900">
                                    Customer
                                </h2>

                                <p className="text-xs text-slate-500">
                                    Customer information
                                </p>
                            </div>

                        </div>


                        <div className="space-y-3">

                            <div>
                                <p className="text-xs text-slate-500">
                                    Name
                                </p>

                                <p className="font-medium text-slate-900">
                                    {order.customer?.name}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-slate-500">
                                    Email
                                </p>

                                <p className="text-sm text-slate-700 break-all">
                                    {order.customer?.email}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-slate-500">
                                    Phone
                                </p>

                                <p className="text-sm text-slate-700">
                                    {order.customer?.phone}
                                </p>
                            </div>

                        </div>

                    </div>


                    {/* PAYMENT */}

                    <div className="bg-white border border-slate-200 rounded-2xl p-5">

                        <div className="flex items-center gap-3 mb-5">

                            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                                <CreditCard
                                    size={19}
                                    className="text-emerald-600"
                                />
                            </div>

                            <div>
                                <h2 className="font-semibold text-slate-900">
                                    Payment
                                </h2>

                                <p className="text-xs text-slate-500">
                                    Payment information
                                </p>
                            </div>

                        </div>


                        <div className="space-y-4 text-sm">

                            <div className="flex justify-between gap-4">

                                <span className="text-slate-500">
                                    Method
                                </span>

                                <span className="font-medium text-slate-900 text-right">
                                    {order.payment?.method}
                                </span>

                            </div>


                            <div className="flex justify-between items-center gap-4">

                                <span className="text-slate-500">
                                    Status
                                </span>

                                <span
                                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getPaymentStyle(
                                        order.payment?.status
                                    )}`}
                                >
                                    {order.payment?.status}
                                </span>

                            </div>


                            <div>

                                <p className="text-slate-500 mb-1">
                                    Transaction ID
                                </p>

                                <p className="font-medium text-slate-900 break-all">
                                    {order.payment?.transactionId || "Not available"}
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* ORDER SUMMARY */}

                    <div className="bg-white border border-slate-200 rounded-2xl p-5">

                        <h2 className="font-semibold text-slate-900 mb-5">
                            Order Summary
                        </h2>


                        <div className="space-y-3 text-sm">

                            <div className="flex justify-between">
                                <span className="text-slate-500">
                                    Subtotal
                                </span>

                                <span>
                                    ₹{Number(order.subtotal).toLocaleString("en-IN")}
                                </span>
                            </div>


                            <div className="flex justify-between">
                                <span className="text-slate-500">
                                    Shipping
                                </span>

                                <span>
                                    ₹{Number(order.shipping).toLocaleString("en-IN")}
                                </span>
                            </div>


                            <div className="flex justify-between">
                                <span className="text-slate-500">
                                    Discount
                                </span>

                                <span className="text-emerald-600">
                                    -₹{Number(order.discount).toLocaleString("en-IN")}
                                </span>
                            </div>


                            <div className="flex justify-between">
                                <span className="text-slate-500">
                                    Tax
                                </span>

                                <span>
                                    ₹{Number(order.tax).toLocaleString("en-IN")}
                                </span>
                            </div>


                            <div className="pt-3 border-t border-slate-200 flex justify-between">

                                <span className="font-semibold text-slate-900">
                                    Total
                                </span>

                                <span className="font-bold text-lg text-slate-900">
                                    ₹{Number(order.total).toLocaleString("en-IN")}
                                </span>

                            </div>

                        </div>

                    </div>


                    {/* SHIPPING */}

                    <div className="bg-white border border-slate-200 rounded-2xl p-5">

                        <div className="flex items-center gap-3 mb-4">

                            <Truck
                                size={19}
                                className="text-slate-600"
                            />

                            <h2 className="font-semibold text-slate-900">
                                Delivery
                            </h2>

                        </div>

                        <p className="text-sm text-slate-500">
                            Current status
                        </p>

                        <p className="font-medium text-slate-900 mt-1">
                            {order.status}
                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default AdminViewOrder;