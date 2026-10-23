import React from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Package, User, MapPin, Truck, CheckCircle2, Clock, } from "lucide-react";

const VendorViewOrder = ({ orders = [] }) => {
  const { orderId } = useParams();

  const order = orders.find((o) => o.id === orderId) || {
    id: orderId || "SC-10001",
    customerName: "Aarav Patel",
    customerEmail: "aarav.patel@example.com",
    customerPhone: "+91 98765 43210",
    productName: "Aster Pro ANC Headphones",
    price: 7499,
    quantity: 1,
    totalAmount: 7499,
    paymentStatus: "Paid",
    status: "Processing",
    shippingStatus: "In Transit",
    courier: "Delhivery",
    trackingNumber: "DEL9823145",
    date: "Aug 10, 2026",
    shippingAddress: {
      street: "123 CG Road, Navrangpura",
      city: "Ahmedabad",
      state: "Gujarat",
      pincode: "380009",
      country: "India",
    },
    timeline: [
      { status: "Order Placed", date: "Aug 10, 2026, 10:30 AM", done: true },
      { status: "Payment Confirmed", date: "Aug 10, 2026, 10:31 AM", done: true },
      { status: "Processing by Vendor", date: "Aug 10, 2026, 02:00 PM", done: true },
      { status: "Shipped", date: "Aug 11, 2026, 09:15 AM", done: false },
      { status: "Delivered", date: "Expected Aug 13, 2026", done: false },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Header & Back button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/vendor/orders"
            className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Order Details</h1>
            <p className="text-xs text-slate-500">Order ID: <span className="font-semibold text-slate-800">{order.id}</span></p>
          </div>
        </div>
        <Link
          to={`/vendor/orders/${order.id}/update`}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition"
        >
          Update Order Status
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns - Products & Fulfillment */}
        <div className="lg:col-span-2 space-y-6">
          {/* Products Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Package size={18} className="text-blue-600" />
              Vendor Product Details
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase">
                  <tr>
                    <th className="px-4 py-3">Product Name</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Qty</th>
                    <th className="px-4 py-3 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="px-4 py-3 font-semibold text-slate-900">{order.productName}</td>
                    <td className="px-4 py-3">₹{order.price.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3">{order.quantity}</td>
                    <td className="px-4 py-3 text-right font-bold text-slate-900">
                      ₹{(order.price * order.quantity).toLocaleString('en-IN')}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="border-t border-slate-100 pt-4 flex justify-between items-center text-xs">
              <span className="text-slate-500 font-medium">Vendor Payout Subtotal:</span>
              <span className="text-base font-bold text-slate-900">₹{order.totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Clock size={18} className="text-blue-600" />
              Fulfillment Timeline
            </h2>
            <div className="space-y-4">
              {order.timeline.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className={`p-1 rounded-full ${step.done ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <p className={`text-xs font-semibold ${step.done ? 'text-slate-900' : 'text-slate-400'}`}>{step.status}</p>
                    <p className="text-[10px] text-slate-400">{step.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Column - Customer & Shipping Cards */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <User size={18} className="text-blue-600" />
              Customer Information
            </h2>
            <div className="text-xs space-y-1">
              <p className="font-semibold text-slate-800">{order.customerName}</p>
              <p className="text-slate-500">{order.customerEmail}</p>
              <p className="text-slate-500">{order.customerPhone}</p>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <MapPin size={18} className="text-blue-600" />
              Shipping Address
            </h2>
            <div className="text-xs text-slate-600 space-y-1">
              <p>{order.shippingAddress.street}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
              <p className="font-semibold text-slate-700">{order.shippingAddress.country}</p>
            </div>
          </div>

          {/* Logistics Info */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Truck size={18} className="text-blue-600" />
              Courier & Tracking
            </h2>
            <div className="text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Provider:</span>
                <span className="font-bold text-slate-800">{order.courier}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tracking #:</span>
                <span className="font-mono font-semibold text-blue-600">{order.trackingNumber}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorViewOrder;
