import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Eye, Package, Truck, CheckCircle, Clock, XCircle, CreditCard, IndianRupee, Filter, } from "lucide-react";

const AdminOrders = ({ orders = [] }) => {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [paymentFilter, setPaymentFilter] = useState("All");

    const filteredOrders = useMemo(() => {
        return orders.filter((order) => {
            const searchText = search.toLowerCase();

            const matchesSearch =
                order.id?.toLowerCase().includes(searchText) ||
                order.customer?.name?.toLowerCase().includes(searchText) ||
                order.customer?.email?.toLowerCase().includes(searchText) ||
                order.items?.some((item) =>
                    item.name?.toLowerCase().includes(searchText)
                );

            const matchesStatus =
                statusFilter === "All" || order.status === statusFilter;

            const matchesPayment =
                paymentFilter === "All" || order.payment?.status === paymentFilter;

            return matchesSearch && matchesStatus && matchesPayment;
        });
    }, [orders, search, statusFilter, paymentFilter]);

    const totalOrders = orders.length;

    const pendingOrders = orders.filter(
        (order) => order.status === "Processing"
    ).length;

    const shippedOrders = orders.filter(
        (order) => order.status === "Shipped"
    ).length;

    const deliveredOrders = orders.filter(
        (order) => order.status === "Delivered"
    ).length;

    const cancelledOrders = orders.filter(
        (order) => order.status === "Cancelled"
    ).length;

    const totalRevenue = orders
        .filter((order) => order.status !== "Cancelled")
        .reduce((total, order) => total + Number(order.total || 0), 0);

    const getStatusClass = (status) => {
        switch (status) {
            case "Delivered":
                return "bg-emerald-50 text-emerald-700";

            case "Shipped":
                return "bg-blue-50 text-blue-700";

            case "Processing":
                return "bg-amber-50 text-amber-700";

            case "Pending":
                return "bg-purple-50 text-purple-700";

            case "Cancelled":
                return "bg-red-50 text-red-700";

            case "Returned":
                return "bg-orange-50 text-orange-700";

            default:
                return "bg-slate-100 text-slate-700";
        }
    };

    const getPaymentClass = (status) => {
        switch (status) {
            case "Paid":
                return "text-emerald-600";

            case "Pending":
                return "text-amber-600";

            case "Failed":
                return "text-red-600";

            case "Refunded":
                return "text-purple-600";

            default:
                return "text-slate-500";
        }
    };

    return (
        <div className="space-y-6">

            {/* HEADER */}

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        Orders
                    </h1>

                    <p className="text-sm text-slate-500 mt-1">
                        Manage and monitor all customer orders
                    </p>
                </div>

            </div>


            {/* STAT CARDS */}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">

                <div className="bg-white border border-slate-200 rounded-2xl p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500">
                                Total Orders
                            </p>

                            <h2 className="text-2xl font-bold text-slate-900 mt-2">
                                {totalOrders}
                            </h2>
                        </div>

                        <div className="p-3 bg-slate-100 rounded-xl">
                            <Package size={21} />
                        </div>
                    </div>
                </div>


                <div className="bg-white border border-slate-200 rounded-2xl p-5">
                    <p className="text-sm text-slate-500">
                        Processing
                    </p>

                    <h2 className="text-2xl font-bold text-amber-600 mt-2">
                        {pendingOrders}
                    </h2>
                </div>


                <div className="bg-white border border-slate-200 rounded-2xl p-5">
                    <p className="text-sm text-slate-500">
                        Shipped
                    </p>

                    <h2 className="text-2xl font-bold text-blue-600 mt-2">
                        {shippedOrders}
                    </h2>
                </div>


                <div className="bg-white border border-slate-200 rounded-2xl p-5">
                    <p className="text-sm text-slate-500">
                        Delivered
                    </p>

                    <h2 className="text-2xl font-bold text-emerald-600 mt-2">
                        {deliveredOrders}
                    </h2>
                </div>


                <div className="bg-white border border-slate-200 rounded-2xl p-5">
                    <p className="text-sm text-slate-500">
                        Revenue
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 mt-2">
                        ₹{totalRevenue.toLocaleString("en-IN")}
                    </h2>
                </div>

            </div>


            {/* FILTER BAR */}

            <div className="bg-white border border-slate-200 rounded-2xl p-4">

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">

                    {/* SEARCH */}

                    <div className="relative md:col-span-2">

                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            type="text"
                            placeholder="Search order, customer or product..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500"
                        />

                    </div>


                    {/* STATUS */}

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2.5 border border-slate-200 rounded-xl outline-none"
                    >
                        <option value="All">All Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Returned">Returned</option>
                    </select>


                    {/* PAYMENT */}

                    <select
                        value={paymentFilter}
                        onChange={(e) => setPaymentFilter(e.target.value)}
                        className="px-4 py-2.5 border border-slate-200 rounded-xl outline-none"
                    >
                        <option value="All">All Payments</option>
                        <option value="Paid">Paid</option>
                        <option value="Pending">Pending</option>
                        <option value="Failed">Failed</option>
                        <option value="Refunded">Refunded</option>
                    </select>

                </div>

            </div>


            {/* ORDERS TABLE */}

            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">

                <div className="px-5 py-4 border-b border-slate-200 flex items-center gap-2">

                    <Filter size={18} className="text-slate-500" />

                    <h2 className="font-semibold text-slate-900">
                        All Orders
                    </h2>

                    <span className="text-sm text-slate-500">
                        ({filteredOrders.length})
                    </span>

                </div>


                <div className="overflow-x-auto">

                    <table className="w-full min-w-[1100px]">

                        <thead className="bg-slate-50">

                            <tr className="text-left text-xs uppercase tracking-wide text-slate-500">

                                <th className="px-5 py-4">
                                    Order
                                </th>

                                <th className="px-5 py-4">
                                    Customer
                                </th>

                                <th className="px-5 py-4">
                                    Items
                                </th>

                                <th className="px-5 py-4">
                                    Total
                                </th>

                                <th className="px-5 py-4">
                                    Payment
                                </th>

                                <th className="px-5 py-4">
                                    Status
                                </th>

                                <th className="px-5 py-4">
                                    Date
                                </th>

                                <th className="px-5 py-4 text-right">
                                    Action
                                </th>

                            </tr>

                        </thead>


                        <tbody className="divide-y divide-slate-100">

                            {filteredOrders.length > 0 ? (

                                filteredOrders.map((order) => (

                                    <tr
                                        key={order.id}
                                        className="hover:bg-slate-50 transition"
                                    >

                                        {/* ORDER */}

                                        <td className="px-5 py-4">

                                            <div className="font-semibold text-slate-900">
                                                #{order.id}
                                            </div>

                                            <div className="text-xs text-slate-500 mt-1">
                                                {order.items?.length || 0} product(s)
                                            </div>

                                        </td>


                                        {/* CUSTOMER */}

                                        <td className="px-5 py-4">

                                            <div className="font-medium text-slate-900">
                                                {order.customer?.name}
                                            </div>

                                            <div className="text-xs text-slate-500">
                                                {order.customer?.email}
                                            </div>

                                        </td>


                                        {/* ITEMS */}

                                        <td className="px-5 py-4">

                                            <div className="space-y-1">

                                                {order.items?.slice(0, 2).map((item) => (

                                                    <div
                                                        key={item.id}
                                                        className="text-sm text-slate-700"
                                                    >
                                                        {item.name} × {item.quantity}
                                                    </div>

                                                ))}

                                                {order.items?.length > 2 && (
                                                    <div className="text-xs text-slate-400">
                                                        +{order.items.length - 2} more
                                                    </div>
                                                )}

                                            </div>

                                        </td>


                                        {/* TOTAL */}

                                        <td className="px-5 py-4">

                                            <div className="font-semibold text-slate-900 flex items-center">
                                                <IndianRupee size={14} />
                                                {Number(order.total).toLocaleString("en-IN")}
                                            </div>

                                        </td>


                                        {/* PAYMENT */}

                                        <td className="px-5 py-4">

                                            <div className="text-sm text-slate-700">
                                                {order.payment?.method}
                                            </div>

                                            <div
                                                className={`text-xs font-medium mt-1 ${getPaymentClass(
                                                    order.payment?.status
                                                )}`}
                                            >
                                                {order.payment?.status}
                                            </div>

                                        </td>


                                        {/* STATUS */}

                                        <td className="px-5 py-4">

                                            <span
                                                className={`inline-flex px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusClass(
                                                    order.status
                                                )}`}
                                            >
                                                {order.status}
                                            </span>

                                        </td>


                                        {/* DATE */}

                                        <td className="px-5 py-4">

                                            <div className="text-sm text-slate-700">
                                                {order.date}
                                            </div>

                                        </td>


                                        {/* ACTION */}

                                        <td className="px-5 py-4 text-right">

                                            <Link
                                                to={`/admin/orders/${order.id}`}
                                                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-sm font-medium"
                                            >
                                                <Eye size={16} />
                                                View
                                            </Link>

                                        </td>

                                    </tr>

                                ))

                            ) : (

                                <tr>

                                    <td
                                        colSpan="8"
                                        className="px-5 py-16 text-center"
                                    >

                                        <Package
                                            size={40}
                                            className="mx-auto text-slate-300"
                                        />

                                        <h3 className="mt-3 font-semibold text-slate-700">
                                            No orders found
                                        </h3>

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

export default AdminOrders;