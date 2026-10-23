import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import {handleAuthError} from "../../AuthRouteAdmin";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  Calendar,
  Edit,
  CreditCard,
  Loader2,
} from "lucide-react";

const API_BASE_URL = "http://localhost:5000/api";

const AdminViewCustomer = () => {
  const token = localStorage.getItem("adminToken");
  const { customerId } = useParams();

  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // FETCH CUSTOMER BY ID
  useEffect(() => {
    const fetchCustomerDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          `${API_BASE_URL}/admin/customers/${customerId}`, {
            headers: {
              "Content-Type": "Application/json",
              Authorization: "Bearer " + token,
            },
          });

        if (response.data && response.data.success) {
          setCustomer(response.data.customer);
        } else {
          setCustomer(null);
        }
      } catch (err) {
        handleAuthError(err);
        
        console.error("Error fetching customer details:", err);
        setError(
          err.response?.data?.message ||
            "Unable to find the requested customer.",
        );
        setCustomer(null);
      } finally {
        setLoading(false);
      }
    };

    if (customerId) {
      fetchCustomerDetails();
    }
  }, [customerId]);

  const money = (value) =>
    `₹${new Intl.NumberFormat("en-IN").format(value || 0)}`;

  // LOADING STATE
  if (loading) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center flex flex-col items-center justify-center">
        <Loader2 size={36} className="animate-spin text-slate-400 mb-3" />
        <p className="text-slate-600 font-medium">
          Loading customer profile...
        </p>
        <p className="text-xs text-slate-400 mt-1">Please wait a moment</p>
      </div>
    );
  }

  // NOT FOUND / ERROR STATE
  if (!customer || error) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">
        <User size={45} className="mx-auto text-slate-300 mb-4" />

        <h2 className="text-xl font-bold text-slate-900">Customer Not Found</h2>

        <p className="text-slate-500 mt-2">
          {error || "The customer you are looking for does not exist."}
        </p>

        <Link
          to="/admin/customers"
          className="inline-flex mt-5 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition"
        >
          Back to Customers
        </Link>
      </div>
    );
  }

  const customerName =
    customer.name ||
    `${customer.firstName || ""} ${customer.lastName || ""}`.trim() ||
    "Customer";

  const initials =
    customerName
      .split(" ")
      .map((word) => word[0])
      .filter(Boolean)
      .join("")
      .slice(0, 2)
      .toUpperCase() || "CU";

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/customers"
            className="p-2 border border-slate-200 rounded-xl hover:bg-slate-100 transition"
          >
            <ArrowLeft size={19} />
          </Link>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Customer Details
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Customer ID: {customer.id || customer._id}
            </p>
          </div>
        </div>

        {/* <Link
          to={`/admin/customers/${customer.id || customer._id}/edit`}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition"
        >
          <Edit size={17} />
          Edit Customer
        </Link> */}
      </div>

      {/* PROFILE */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-2xl font-bold tracking-wider">
            {initials}
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl font-bold text-slate-900">
                {customerName}
              </h2>

              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  customer.status === "Active"
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {customer.status}
              </span>
            </div>

            <div className="flex flex-wrap gap-4 mt-3 text-sm text-slate-500">
              <span className="flex items-center gap-2">
                <Mail size={15} />
                {customer.email || "—"}
              </span>

              <span className="flex items-center gap-2">
                <Phone size={15} />
                {customer.phone || "—"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* STATISTICS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* TOTAL ORDERS */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingBag size={19} />
            </div>

            <div>
              <p className="text-xs text-slate-500">Total Orders</p>
              <p className="text-xl font-bold text-slate-900 mt-0.5">
                {customer.orders ?? 0}
              </p>
            </div>
          </div>
        </div>

        {/* TOTAL SPENT */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CreditCard size={19} />
            </div>

            <div>
              <p className="text-xs text-slate-500">Total Spent</p>
              <p className="text-xl font-bold text-slate-900 mt-0.5">
                {money(customer.totalSpent)}
              </p>
            </div>
          </div>
        </div>

        {/* JOINED DATE */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
              <Calendar size={19} />
            </div>

            <div>
              <p className="text-xs text-slate-500">Joined</p>
              <p className="font-bold text-slate-900 mt-0.5">
                {customer.joined || "Recently"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* LEFT COLUMN */}
        <div className="xl:col-span-2 space-y-6">
          {/* RECENT ORDERS */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-200">
              <h2 className="font-semibold text-slate-900">Recent Orders</h2>
            </div>

            <div className="divide-y divide-slate-100">
              {customer.recentOrders && customer.recentOrders.length > 0 ? (
                customer.recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-slate-50/60 transition"
                  >
                    <div>
                      <Link
                        to={`/admin/orders/${order.id}`}
                        className="font-medium text-slate-900 hover:underline"
                      >
                        #{order.id}
                      </Link>

                      <p className="text-sm text-slate-500 mt-1">
                        {order.date}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          order.status === "Delivered"
                            ? "bg-emerald-50 text-emerald-700"
                            : order.status === "Cancelled"
                              ? "bg-red-50 text-red-700"
                              : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {order.status}
                      </span>

                      <span className="font-semibold text-slate-900">
                        {money(order.total)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-sm text-slate-400">
                  No orders placed yet.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          {/* CONTACT INFO */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <h2 className="font-semibold text-slate-900 mb-5">
              Contact Information
            </h2>

            <div className="space-y-4 text-sm">
              <div className="flex gap-3">
                <Mail size={18} className="text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-400">Email</p>
                  <p className="text-slate-700 font-medium">
                    {customer.email || "—"}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Phone size={18} className="text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-400">Phone</p>
                  <p className="text-slate-700 font-medium">
                    {customer.phone || "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ADDRESSES SECTION */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <MapPin size={19} className="text-slate-500" />
                <h2 className="font-semibold text-slate-900">
                  Saved Addresses
                </h2>
              </div>
              {Array.isArray(customer.addresses) &&
                customer.addresses.length > 0 && (
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                    {customer.addresses.length}{" "}
                    {customer.addresses.length === 1 ? "Address" : "Addresses"}
                  </span>
                )}
            </div>
            {/* ADDRESSES LIST */}
            {Array.isArray(customer.addresses) &&
            customer.addresses.length > 0 ? (
              <div className="space-y-4">
                {customer.addresses.map((addr, index) => {
                  const fullAddrLine = [addr.addressLine1, addr.addressLine2]
                    .filter(Boolean)
                    .join(", ");
                  return (
                    <div
                      key={addr._id || index}
                      className={`p-4 rounded-xl border transition ${
                        addr.isDefault
                          ? "border-emerald-200 bg-emerald-50/30"
                          : "border-slate-100 bg-slate-50"
                      }`}
                    >
                      {/* Header / Badges */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-800 capitalize">
                            {addr.fullName || customer.name || "Recipient"}
                          </span>
                          {addr.addressType && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-slate-600">
                              {addr.addressType}
                            </span>
                          )}
                        </div>
                        {addr.isDefault && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                            Default Address
                          </span>
                        )}
                      </div>
                      {/* Address Lines */}
                      <div className="text-xs text-slate-600 leading-relaxed space-y-0.5">
                        <p className="font-medium text-slate-700">
                          {fullAddrLine}
                        </p>
                        <p>
                          {addr.city}, {addr.state} -{" "}
                          <span className="font-semibold">{addr.pincode}</span>
                        </p>
                        <p className="text-slate-500">
                          {addr.country || "India"}
                        </p>
                        {addr.phone && (
                          <p className="mt-1.5 font-medium text-slate-700">
                            Phone:{" "}
                            <span className="font-mono text-slate-800">
                              {addr.phone}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : customer.address && typeof customer.address === "object" ? (
              /* Fallback for single address object */
              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 text-xs text-slate-600 leading-relaxed">
                <p className="font-medium text-slate-800">
                  {customer.address.addressLine1 ||
                    customer.address.address ||
                    ""}
                  {customer.address.addressLine2
                    ? `, ${customer.address.addressLine2}`
                    : ""}
                </p>
                <p>
                  {customer.address.city}, {customer.address.state}{" "}
                  {customer.address.pincode
                    ? `- ${customer.address.pincode}`
                    : ""}
                </p>
                <p>{customer.address.country || "India"}</p>
              </div>
            ) : (
              /* Empty State */
              <div className="py-6 text-center">
                <p className="text-xs text-slate-400 italic">
                  No saved address found in database.
                </p>
              </div>
            )}
          </div>

          {/* ACCOUNT INFO */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <h2 className="font-semibold text-slate-900 mb-5">
              Account Information
            </h2>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Account Status</span>
                <span
                  className={`font-medium ${
                    customer.status === "Active"
                      ? "text-emerald-600"
                      : "text-red-600"
                  }`}
                >
                  {customer.status}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500">Joined</span>
                <span className="text-slate-800 font-medium">
                  {customer.joined}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500">Last Order</span>
                <span className="text-slate-800 font-medium">
                  {customer.lastOrder || "No orders yet"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminViewCustomer;
