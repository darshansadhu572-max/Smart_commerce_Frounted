import React from "react";
import { IndianRupee, ShoppingBag, Package, Clock, TrendingUp, ArrowUpRight, ArrowDownRight, AlertTriangle, Eye, Wallet, CreditCard, } from "lucide-react";

const VendorDashboard = () => {
  /* DASHBOARD DATA */

  const stats = [
    {
      title: "Total Sales",
      value: "₹1,84,250",
      change: "+12.5%",
      description: "vs last month",
      icon: IndianRupee,
      positive: true,
    },
    {
      title: "Total Orders",
      value: "284",
      change: "+8.2%",
      description: "vs last month",
      icon: ShoppingBag,
      positive: true,
    },
    {
      title: "Total Products",
      value: "126",
      change: "+6",
      description: "this month",
      icon: Package,
      positive: true,
    },
    {
      title: "Pending Orders",
      value: "18",
      change: "Needs attention",
      description: "",
      icon: Clock,
      positive: false,
    },
  ];

  const recentOrders = [
    {
      id: "SC-10001",
      customer: "Aarav Patel",
      product: "Aster Pro ANC Headphones",
      amount: 7499,
      status: "Processing",
      date: "Aug 10, 2026",
    },
    {
      id: "SC-10002",
      customer: "Meera Shah",
      product: "Mitti Hand-thrown Dinner Set",
      amount: 4380,
      status: "Shipped",
      date: "Aug 09, 2026",
    },
    {
      id: "SC-10004",
      customer: "Kabir Joshi",
      product: "Drift Running Shoes",
      amount: 3199,
      status: "Delivered",
      date: "Aug 05, 2026",
    },
    {
      id: "SC-10006",
      customer: "Riya Desai",
      product: "Wireless Earbuds",
      amount: 2499,
      status: "Pending",
      date: "Aug 04, 2026",
    },
  ];

  const topProducts = [
    {
      name: "Aster Pro ANC Headphones",
      sold: 84,
      revenue: "₹62,991",
    },
    {
      name: "Wireless Earbuds Pro",
      sold: 61,
      revenue: "₹30,439",
    },
    {
      name: "Bluetooth Speaker",
      sold: 48,
      revenue: "₹24,960",
    },
    {
      name: "Smart Watch",
      sold: 37,
      revenue: "₹22,163",
    },
  ];

  const lowStockProducts = [
    {
      name: "Aster Pro ANC Headphones",
      stock: 4,
    },
    {
      name: "Wireless Earbuds Pro",
      stock: 7,
    },
    {
      name: "Bluetooth Speaker",
      stock: 9,
    },
  ];

  const payouts = [
    {
      id: "PO-10004",
      date: "Aug 08, 2026",
      amount: "₹28,450",
      status: "Paid",
    },
    {
      id: "PO-10003",
      date: "Aug 01, 2026",
      amount: "₹24,180",
      status: "Paid",
    },
    {
      id: "PO-10002",
      date: "Jul 25, 2026",
      amount: "₹21,760",
      status: "Paid",
    },
  ];

  /* HELPERS */

  const getStatusStyle = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-50 text-emerald-700";

      case "Shipped":
        return "bg-blue-50 text-blue-700";

      case "Processing":
        return "bg-amber-50 text-amber-700";

      case "Pending":
        return "bg-slate-100 text-slate-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="space-y-6">

      {/* PAGE HEADER */}

      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Dashboard
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          Welcome back! Here's what's happening with your store.
        </p>
      </div>


      {/* STAT CARDS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

        {stats.map((stat) => {

          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-sm transition"
            >

              <div className="flex items-center justify-between">

                <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center">
                  <Icon
                    size={21}
                    className="text-slate-700"
                  />
                </div>

                {stat.positive ? (
                  <ArrowUpRight
                    size={19}
                    className="text-emerald-600"
                  />
                ) : (
                  <Clock
                    size={19}
                    className="text-amber-500"
                  />
                )}

              </div>

              <p className="text-sm text-slate-500 mt-4">
                {stat.title}
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mt-1">
                {stat.value}
              </h2>

              <div className="flex items-center gap-1 mt-2">

                {stat.positive && (
                  <span className="text-xs font-semibold text-emerald-600">
                    {stat.change}
                  </span>
                )}

                {!stat.positive && (
                  <span className="text-xs font-semibold text-amber-600">
                    {stat.change}
                  </span>
                )}

                <span className="text-xs text-slate-400">
                  {stat.description}
                </span>

              </div>

            </div>
          );
        })}

      </div>


      {/* FINANCIAL SUMMARY */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* AVAILABLE BALANCE */}

        <div className="bg-slate-900 text-white rounded-2xl p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-300">
                Available Balance
              </p>

              <h2 className="text-3xl font-bold mt-2">
                ₹42,680
              </h2>

            </div>

            <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
              <Wallet size={21} />
            </div>

          </div>

          <div className="mt-6 pt-4 border-t border-white/10">

            <div className="flex justify-between text-sm">

              <span className="text-slate-300">
                Next payout
              </span>

              <span>
                Aug 15, 2026
              </span>

            </div>

          </div>

        </div>


        {/* PENDING PAYOUT */}

        <div className="bg-white border border-slate-200 rounded-2xl p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-500">
                Pending Payout
              </p>

              <h2 className="text-3xl font-bold text-slate-900 mt-2">
                ₹18,240
              </h2>

            </div>

            <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center">
              <CreditCard
                size={21}
                className="text-amber-600"
              />
            </div>

          </div>

          <p className="text-xs text-slate-500 mt-5">
            Earnings waiting for settlement
          </p>

        </div>


        {/* MONTHLY GROWTH */}

        <div className="bg-white border border-slate-200 rounded-2xl p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-500">
                Monthly Growth
              </p>

              <h2 className="text-3xl font-bold text-slate-900 mt-2">
                +12.5%
              </h2>

            </div>

            <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">
              <TrendingUp
                size={21}
                className="text-emerald-600"
              />
            </div>

          </div>

          <p className="text-xs text-emerald-600 mt-5">
            Sales increased compared with July
          </p>

        </div>

      </div>


      {/* SALES OVERVIEW */}

      <div className="bg-white border border-slate-200 rounded-2xl p-6">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

          <div>

            <h2 className="font-semibold text-slate-900">
              Sales Overview
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Your sales performance for the current month
            </p>

          </div>

          <select className="px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last 6 Months</option>
            <option>This Year</option>
          </select>

        </div>


        {/* SIMPLE CHART */}

        <div className="mt-8">

          <div className="flex items-end justify-between gap-3 h-56">

            {[45, 65, 40, 75, 58, 88, 72, 95, 68, 82, 76, 100].map(
              (height, index) => (

                <div
                  key={index}
                  className="flex-1 h-full flex items-end"
                >

                  <div
                    className="w-full bg-slate-900 rounded-t-lg hover:bg-slate-700 transition"
                    style={{
                      height: `${height}%`,
                    }}
                  />

                </div>

              )
            )}

          </div>


          <div className="flex justify-between mt-3 text-xs text-slate-400">

            <span>Aug 01</span>
            <span>Aug 03</span>
            <span>Aug 05</span>
            <span>Aug 07</span>
            <span>Aug 09</span>
            <span>Aug 10</span>

          </div>

        </div>

      </div>


      {/* RECENT ORDERS + TOP PRODUCTS */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* RECENT ORDERS */}

        <div className="bg-white border border-slate-200 rounded-2xl">

          <div className="p-5 border-b border-slate-200 flex items-center justify-between">

            <div>

              <h2 className="font-semibold text-slate-900">
                Recent Orders
              </h2>

              <p className="text-xs text-slate-500 mt-1">
                Latest orders from your store
              </p>

            </div>

            <a
              href="/vendor/orders"
              className="text-sm font-medium text-slate-900 hover:underline"
            >
              View All
            </a>

          </div>


          <div className="divide-y divide-slate-100">

            {recentOrders.map((order) => (

              <div
                key={order.id}
                className="p-5 flex items-center gap-4"
              >

                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                  <ShoppingBag size={18} className="text-slate-600" />
                </div>

                <div className="flex-1 min-w-0">

                  <p className="font-medium text-sm text-slate-900">
                    #{order.id}
                  </p>

                  <p className="text-xs text-slate-500 truncate mt-1">
                    {order.customer}
                  </p>

                  <p className="text-xs text-slate-400 truncate mt-1">
                    {order.product}
                  </p>

                </div>

                <div className="text-right">

                  <p className="font-semibold text-sm text-slate-900">
                    ₹{order.amount.toLocaleString("en-IN")}
                  </p>

                  <span
                    className={`inline-flex mt-1 px-2 py-1 rounded-lg text-[11px] font-medium ${getStatusStyle(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>

                </div>

              </div>

            ))}

          </div>

        </div>


        {/* TOP PRODUCTS */}

        <div className="bg-white border border-slate-200 rounded-2xl">

          <div className="p-5 border-b border-slate-200">

            <h2 className="font-semibold text-slate-900">
              Top Selling Products
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              Your best performing products
            </p>

          </div>


          <div className="divide-y divide-slate-100">

            {topProducts.map((product, index) => (

              <div
                key={product.name}
                className="p-5 flex items-center gap-4"
              >

                <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center font-semibold text-sm">
                  {index + 1}
                </div>

                <div className="flex-1 min-w-0">

                  <p className="text-sm font-medium text-slate-900 truncate">
                    {product.name}
                  </p>

                  <p className="text-xs text-slate-500 mt-1">
                    {product.sold} units sold
                  </p>

                </div>

                <p className="text-sm font-semibold text-slate-900">
                  {product.revenue}
                </p>

              </div>

            ))}

          </div>

        </div>

      </div>


      {/* LOW STOCK + PAYOUTS */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* LOW STOCK */}

        <div className="bg-white border border-slate-200 rounded-2xl">

          <div className="p-5 border-b border-slate-200 flex items-center gap-3">

            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">

              <AlertTriangle
                size={18}
                className="text-amber-600"
              />

            </div>

            <div>

              <h2 className="font-semibold text-slate-900">
                Low Stock Alert
              </h2>

              <p className="text-xs text-slate-500 mt-1">
                Products that need restocking
              </p>

            </div>

          </div>


          <div className="divide-y divide-slate-100">

            {lowStockProducts.map((product) => (

              <div
                key={product.name}
                className="p-5 flex items-center justify-between"
              >

                <div>

                  <p className="text-sm font-medium text-slate-900">
                    {product.name}
                  </p>

                  <p className="text-xs text-slate-500 mt-1">
                    Only {product.stock} units remaining
                  </p>

                </div>

                <a
                  href="/vendor/inventory"
                  className="inline-flex items-center gap-1 text-sm font-medium text-slate-900 hover:underline"
                >
                  Restock
                  <ArrowUpRight size={14} />
                </a>

              </div>

            ))}

          </div>

        </div>


        {/* PAYOUTS */}

        <div className="bg-white border border-slate-200 rounded-2xl">

          <div className="p-5 border-b border-slate-200 flex items-center justify-between">

            <div>

              <h2 className="font-semibold text-slate-900">
                Recent Payouts
              </h2>

              <p className="text-xs text-slate-500 mt-1">
                Recent payments received
              </p>

            </div>

            <a
              href="/vendor/payouts"
              className="text-sm font-medium text-slate-900 hover:underline"
            >
              View All
            </a>

          </div>


          <div className="divide-y divide-slate-100">

            {payouts.map((payout) => (

              <div
                key={payout.id}
                className="p-5 flex items-center gap-4"
              >

                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">

                  <Wallet
                    size={18}
                    className="text-emerald-600"
                  />

                </div>

                <div className="flex-1">

                  <p className="text-sm font-medium text-slate-900">
                    {payout.id}
                  </p>

                  <p className="text-xs text-slate-500 mt-1">
                    {payout.date}
                  </p>

                </div>

                <div className="text-right">

                  <p className="text-sm font-semibold text-slate-900">
                    {payout.amount}
                  </p>

                  <span className="text-[11px] text-emerald-600 font-medium">
                    {payout.status}
                  </span>

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>


      {/* QUICK ACTIONS */}

      <div className="bg-white border border-slate-200 rounded-2xl p-6">

        <h2 className="font-semibold text-slate-900">
          Quick Actions
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          Frequently used vendor actions
        </p>


        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">

          <a
            href="/vendor/products/add"
            className="flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50 transition"
          >
            <Package size={17} />
            Add Product
          </a>

          <a
            href="/vendor/orders"
            className="flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50 transition"
          >
            <ShoppingBag size={17} />
            View Orders
          </a>

          <a
            href="/vendor/inventory"
            className="flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50 transition"
          >
            <AlertTriangle size={17} />
            Inventory
          </a>

          <a
            href="/vendor/payouts"
            className="flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50 transition"
          >
            <Wallet size={17} />
            Payouts
          </a>

        </div>

      </div>

    </div>
  );
};

export default VendorDashboard;