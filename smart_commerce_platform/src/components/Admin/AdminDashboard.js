import React from "react";
import { DollarSign, ShoppingCart, Users, Store, TrendingUp, TrendingDown, ArrowUpRight, Package, Clock3, CheckCircle2, } from "lucide-react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {

    const stats = [
        {
            title: "Total Revenue",
            value: "$84,250",
            change: "+12.5%",
            positive: true,
            icon: DollarSign,
            description: "vs last month",
        },
        {
            title: "Total Orders",
            value: "2,845",
            change: "+8.2%",
            positive: true,
            icon: ShoppingCart,
            description: "vs last month",
        },
        {
            title: "Customers",
            value: "12,540",
            change: "+14.6%",
            positive: true,
            icon: Users,
            description: "vs last month",
        },
        {
            title: "Active Vendors",
            value: "384",
            change: "-2.4%",
            positive: false,
            icon: Store,
            description: "vs last month",
        },
    ];

    const recentOrders = [
        {
            id: "#SC-10482",
            customer: "Aarav Shah",
            vendor: "ElectroCore",
            amount: "$249.00",
            status: "Delivered",
        },
        {
            id: "#SC-10481",
            customer: "Riya Patel",
            vendor: "HomeNest",
            amount: "$89.00",
            status: "Processing",
        },
        {
            id: "#SC-10480",
            customer: "Dev Mehta",
            vendor: "FashionHub",
            amount: "$145.00",
            status: "Shipped",
        },
        {
            id: "#SC-10479",
            customer: "Anaya Desai",
            vendor: "ElectroCore",
            amount: "$399.00",
            status: "Delivered",
        },
        {
            id: "#SC-10478",
            customer: "Kabir Joshi",
            vendor: "SportsZone",
            amount: "$74.00",
            status: "Pending",
        },
    ];

    const topVendors = [
        {
            name: "ElectroCore",
            category: "Electronics",
            sales: "$18,420",
            orders: 284,
        },
        {
            name: "HomeNest",
            category: "Home & Living",
            sales: "$14,850",
            orders: 241,
        },
        {
            name: "FashionHub",
            category: "Fashion",
            sales: "$12,640",
            orders: 198,
        },
        {
            name: "SportsZone",
            category: "Sports",
            sales: "$9,840",
            orders: 154,
        },
    ];

    return (
        <div className="space-y-6">

            {/* PAGE HEADER */}

            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

                <div>

                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#287b6d]">
                        Overview
                    </p>

                    <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">
                        Good morning, Kavya 👋
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        Here's what's happening across your marketplace today.
                    </p>

                </div>

            </div>


            {/* STAT CARDS */}

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                {stats.map((stat) => {

                    const Icon = stat.icon;

                    return (
                        <div
                            key={stat.title}
                            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                        >

                            <div className="flex items-start justify-between">

                                <div>

                                    <p className="text-xs font-semibold text-slate-500">
                                        {stat.title}
                                    </p>

                                    <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
                                        {stat.value}
                                    </h3>

                                </div>

                                <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#287b6d]/10 text-[#287b6d]">
                                    <Icon size={20} />
                                </div>

                            </div>

                            <div className="mt-4 flex items-center gap-2">

                                <span
                                    className={`flex items-center gap-1 text-xs font-bold ${stat.positive
                                            ? "text-emerald-600"
                                            : "text-red-500"
                                        }`}
                                >

                                    {stat.positive ? (
                                        <TrendingUp size={14} />
                                    ) : (
                                        <TrendingDown size={14} />
                                    )}

                                    {stat.change}

                                </span>

                                <span className="text-[11px] text-slate-400">
                                    {stat.description}
                                </span>

                            </div>

                        </div>
                    );
                })}

            </div>


            {/* MIDDLE SECTION */}

            <div className="grid gap-6 xl:grid-cols-3">

                {/* SALES OVERVIEW */}

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">

                    <div className="flex items-center justify-between">

                        <div>

                            <h2 className="text-base font-bold text-slate-900">
                                Revenue Overview
                            </h2>

                            <p className="mt-1 text-xs text-slate-400">
                                Monthly revenue performance
                            </p>

                        </div>

                        <select className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 outline-none">
                            <option>Last 7 months</option>
                            <option>Last 30 days</option>
                            <option>This year</option>
                        </select>

                    </div>

                    {/* SIMPLE CHART */}

                    <div className="mt-8 flex h-64 items-end gap-3">

                        {[
                            42,
                            58,
                            48,
                            72,
                            64,
                            86,
                            96,
                        ].map((height, index) => (

                            <div
                                key={index}
                                className="group flex h-full flex-1 flex-col justify-end"
                            >

                                <div
                                    style={{
                                        height: `${height}%`,
                                    }}
                                    className="relative rounded-t-lg bg-[#287b6d]/20 transition group-hover:bg-[#287b6d]"
                                >

                                    <div className="absolute -top-7 left-1/2 hidden -translate-x-1/2 rounded-md bg-slate-900 px-2 py-1 text-[9px] font-bold text-white group-hover:block">
                                        ${(height * 900).toLocaleString()}
                                    </div>

                                </div>

                                <span className="mt-2 text-center text-[10px] text-slate-400">
                                    {
                                        [
                                            "Feb",
                                            "Mar",
                                            "Apr",
                                            "May",
                                            "Jun",
                                            "Jul",
                                            "Aug",
                                        ][index]
                                    }
                                </span>

                            </div>

                        ))}

                    </div>

                </div>


                {/* ORDER STATUS */}

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                    <h2 className="text-base font-bold text-slate-900">
                        Order Status
                    </h2>

                    <p className="mt-1 text-xs text-slate-400">
                        Current order distribution
                    </p>

                    <div className="mt-7 space-y-5">

                        {[
                            {
                                label: "Delivered",
                                value: 68,
                                count: "1,934",
                                icon: CheckCircle2,
                                color: "bg-emerald-500",
                            },
                            {
                                label: "Processing",
                                value: 18,
                                count: "512",
                                icon: Package,
                                color: "bg-blue-500",
                            },
                            {
                                label: "Shipped",
                                value: 10,
                                count: "285",
                                icon: ShoppingCart,
                                color: "bg-amber-500",
                            },
                            {
                                label: "Pending",
                                value: 4,
                                count: "114",
                                icon: Clock3,
                                color: "bg-red-500",
                            },
                        ].map((item) => {

                            const Icon = item.icon;

                            return (
                                <div key={item.label}>

                                    <div className="mb-2 flex items-center justify-between">

                                        <div className="flex items-center gap-2">

                                            <Icon
                                                size={15}
                                                className="text-slate-400"
                                            />

                                            <span className="text-xs font-semibold text-slate-600">
                                                {item.label}
                                            </span>

                                        </div>

                                        <span className="text-xs font-bold text-slate-800">
                                            {item.count}
                                        </span>

                                    </div>

                                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">

                                        <div
                                            style={{
                                                width: `${item.value}%`,
                                            }}
                                            className={`h-full rounded-full ${item.color}`}
                                        />

                                    </div>

                                </div>
                            );
                        })}

                    </div>

                </div>

            </div>


            {/* BOTTOM SECTION */}

            <div className="grid gap-6 xl:grid-cols-3">

                {/* RECENT ORDERS */}

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm xl:col-span-2">

                    <div className="flex items-center justify-between border-b border-slate-100 p-5">

                        <div>

                            <h2 className="text-base font-bold text-slate-900">
                                Recent Orders
                            </h2>

                            <p className="mt-1 text-xs text-slate-400">
                                Latest marketplace transactions
                            </p>

                        </div>

                        <Link to="/admin/orders" className="text-xs font-bold text-[#287b6d] hover:underline">
                            View all
                        </Link>

                    </div>

                    <div className="overflow-x-auto">

                        <table className="w-full text-left">

                            <thead>

                                <tr className="border-b border-slate-100 bg-slate-50">

                                    <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                        Order
                                    </th>

                                    <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                        Customer
                                    </th>

                                    <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                        Vendor
                                    </th>

                                    <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                        Amount
                                    </th>

                                    <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                        Status
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {recentOrders.map((order) => (

                                    <tr
                                        key={order.id}
                                        className="border-b border-slate-50 transition hover:bg-slate-50"
                                    >

                                        <td className="px-5 py-4 text-xs font-bold text-slate-800">
                                            {order.id}
                                        </td>

                                        <td className="px-5 py-4 text-xs text-slate-600">
                                            {order.customer}
                                        </td>

                                        <td className="px-5 py-4 text-xs text-slate-600">
                                            {order.vendor}
                                        </td>

                                        <td className="px-5 py-4 text-xs font-bold text-slate-800">
                                            {order.amount}
                                        </td>

                                        <td className="px-5 py-4">

                                            <span
                                                className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${order.status === "Delivered"
                                                        ? "bg-emerald-50 text-emerald-600"
                                                        : order.status === "Processing"
                                                            ? "bg-blue-50 text-blue-600"
                                                            : order.status === "Shipped"
                                                                ? "bg-amber-50 text-amber-600"
                                                                : "bg-red-50 text-red-600"
                                                    }`}
                                            >
                                                {order.status}
                                            </span>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                </div>


                {/* TOP VENDORS */}

                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

                    <div className="flex items-center justify-between border-b border-slate-100 p-5">

                        <div>

                            <h2 className="text-base font-bold text-slate-900">
                                Top Vendors
                            </h2>

                            <p className="mt-1 text-xs text-slate-400">
                                Best performing vendors
                            </p>

                        </div>

                        <Link to="/admin/vendors" className="text-xs font-bold text-[#287b6d] hover:underline">
                            View all
                        </Link>

                    </div>

                    <div className="divide-y divide-slate-100">

                        {topVendors.map((vendor, index) => (

                            <div
                                key={vendor.name}
                                className="flex items-center gap-3 p-4"
                            >

                                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#287b6d]/10 text-xs font-bold text-[#287b6d]">
                                    {index + 1}
                                </div>

                                <div className="min-w-0 flex-1">

                                    <p className="truncate text-xs font-bold text-slate-800">
                                        {vendor.name}
                                    </p>

                                    <p className="mt-0.5 text-[10px] text-slate-400">
                                        {vendor.category} · {vendor.orders} orders
                                    </p>

                                </div>

                                <p className="text-xs font-bold text-slate-800">
                                    {vendor.sales}
                                </p>

                            </div>

                        ))}

                    </div>

                </div>

            </div>

        </div>
    );
};

export default AdminDashboard;