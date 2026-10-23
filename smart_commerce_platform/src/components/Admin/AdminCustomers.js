import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {handleAuthError} from "../../AuthRouteAdmin";
import {
  Search,
  Users,
  UserCheck,
  UserX,
  ShoppingBag,
  Eye,
  Loader2,
  AlertCircle,
  RefreshCw,
  Power,
  CheckCircle,
} from "lucide-react";

const API_BASE_URL = "http://localhost:5000/api";

const AdminCustomers = () => {
  const token = localStorage.getItem("adminToken");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // FETCH CUSTOMERS FROM BACKEND
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(`${API_BASE_URL}/admin/customers`, {
        headers: {
          "Content-Type": "Application/json",
          Authorization: "Bearer " + token,
        },
      });

      if (response.data && response.data.success) {
        setCustomers(response.data.customers);
      } else {
        setCustomers([]);
      }
    } catch (err) {
      handleAuthError(err);

      console.error("Error fetching customers:", err);
      setError(
        err.response?.data?.message ||
          "Failed to load customers from server. Please check backend connection.",
      );
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // TOGGLE STATUS HANDLER (ACTIVE <-> INACTIVE)
  const handleToggleStatus = async (customerId, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";

    try {
      setUpdatingId(customerId);

      const response = await axios.put(
        `${API_BASE_URL}/admin/customers/${customerId}/status`,
        { status: newStatus }, {
        headers: {
          "Content-Type": "Application/json",
          Authorization: "Bearer " + token,
        },
      });

      if (response.data && response.data.success) {
        // Update local state immediately
        setCustomers((prevCustomers) =>
          prevCustomers.map((cust) =>
            (cust.id || cust._id) === customerId
              ? { ...cust, status: newStatus }
              : cust,
          ),
        );
      }
    } catch (err) {
      handleAuthError(err);
      
      console.error("Error toggling customer status:", err);
      alert(
        err.response?.data?.message ||
          "Unable to update customer status. Please try again.",
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // FILTER LOGIC
  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const name =
        customer.name ||
        `${customer.firstName || ""} ${customer.lastName || ""}`;
      const email = customer.email || "";
      const phone = customer.phone || "";
      const status = customer.status || "Active";

      const matchesSearch =
        name.toLowerCase().includes(search.toLowerCase()) ||
        email.toLowerCase().includes(search.toLowerCase()) ||
        phone.includes(search);

      const matchesStatus = statusFilter === "All" || status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [customers, search, statusFilter]);

  // STAT CALCULATIONS
  const activeCount = useMemo(() => {
    return customers.filter((c) => (c.status || "Active") === "Active").length;
  }, [customers]);

  const inactiveCount = useMemo(() => {
    return customers.filter((c) => (c.status || "Active") !== "Active").length;
  }, [customers]);

  const totalOrders = useMemo(() => {
    return customers.reduce((sum, c) => sum + (Number(c.orders) || 0), 0);
  }, [customers]);

  const totalRevenue = useMemo(() => {
    return customers.reduce((sum, c) => sum + (Number(c.totalSpent) || 0), 0);
  }, [customers]);

  const money = (value) =>
    `₹${new Intl.NumberFormat("en-IN").format(value || 0)}`;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Customers</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage customers, accounts and purchasing activity.
          </p>
        </div>

        <button
          onClick={fetchCustomers}
          disabled={loading}
          className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl text-sm font-medium text-slate-700 transition"
          title="Refresh Data"
        >
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* ERROR NOTICE */}
      {error && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3 text-amber-800 text-sm">
          <AlertCircle size={18} className="shrink-0 text-amber-600" />
          <span>{error}</span>
        </div>
      )}

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* TOTAL CUSTOMERS */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Customers</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {loading ? "..." : customers.length}
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users size={21} />
            </div>
          </div>
        </div>

        {/* ACTIVE CUSTOMERS */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Active Customers</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {loading ? "..." : activeCount}
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserCheck size={21} />
            </div>
          </div>
        </div>

        {/* INACTIVE CUSTOMERS */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Inactive Customers</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {loading ? "..." : inactiveCount}
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <UserX size={21} />
            </div>
          </div>
        </div>

        {/* REVENUE */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Customer Revenue</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {loading ? "..." : money(totalRevenue)}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {totalOrders} total orders
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
              <ShoppingBag size={21} />
            </div>
          </div>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search customers by name, email, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-200 text-sm"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-slate-200 rounded-xl outline-none bg-white text-sm"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-5 py-4 font-semibold text-slate-600">
                  Customer
                </th>
                <th className="text-left px-5 py-4 font-semibold text-slate-600">
                  Contact
                </th>
                <th className="text-center px-5 py-4 font-semibold text-slate-600">
                  Orders
                </th>
                <th className="text-right px-5 py-4 font-semibold text-slate-600">
                  Total Spent
                </th>
                <th className="text-left px-5 py-4 font-semibold text-slate-600">
                  Status
                </th>
                <th className="text-right px-5 py-4 font-semibold text-slate-600">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.map((customer) => {
                const customerId = customer.id || customer._id;
                const customerName =
                  customer.name ||
                  `${customer.firstName || ""} ${customer.lastName || ""}`.trim() ||
                  "Unnamed User";
                const initials =
                  customerName
                    .split(" ")
                    .map((word) => word[0])
                    .filter(Boolean)
                    .join("")
                    .slice(0, 2)
                    .toUpperCase() || "CU";

                const isCustomerActive =
                  (customer.status || "Active").toLowerCase() === "active";
                const currentStatus = isCustomerActive ? "Active" : "Inactive";
                const isThisUpdating = updatingId === customerId;

                return (
                  <tr
                    key={customerId}
                    className="hover:bg-slate-50/70 transition"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-semibold text-xs tracking-wider">
                          {initials}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">
                            {customerName}
                          </p>
                          <p className="text-xs text-slate-500">
                            Joined {customer.joined || "Recent"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-slate-700">{customer.email || "—"}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {customer.phone || "—"}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-center font-medium">
                      {customer.orders ?? 0}
                    </td>

                    <td className="px-5 py-4 text-right font-semibold">
                      {money(customer.totalSpent)}
                    </td>

                    {/* STATUS BADGE */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          isCustomerActive
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                        }`}
                      >
                        <span
                          className={`size-1.5 rounded-full ${
                            isCustomerActive ? "bg-emerald-500" : "bg-red-500"
                          }`}
                        />
                        {currentStatus}
                      </span>
                    </td>

                    {/* ACTIONS: VIEW & TOGGLE ACTIVE/INACTIVE (EDIT REMOVED) */}
                    <td className="px-5 py-4">
                      <div className="flex justify-end items-center gap-2">
                        {/* VIEW CUSTOMER */}
                        <Link
                          to={`/admin/customers/${customerId}`}
                          className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 transition text-slate-600 hover:text-slate-900"
                          title="View Customer Details"
                        >
                          <Eye size={16} />
                        </Link>

                        {/* TOGGLE ACTIVE <-> INACTIVE BUTTON */}
                        <button
                          type="button"
                          disabled={isThisUpdating}
                          onClick={() =>
                            handleToggleStatus(customerId, currentStatus)
                          }
                          className={`p-2 rounded-lg border transition flex items-center justify-center ${
                            isCustomerActive
                              ? "border-red-200 text-red-600 hover:bg-red-50"
                              : "border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                          } disabled:opacity-50`}
                          title={
                            isCustomerActive
                              ? "Change to Inactive"
                              : "Change to Active"
                          }
                        >
                          {isThisUpdating ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : isCustomerActive ? (
                            <Power size={16} />
                          ) : (
                            <CheckCircle size={16} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* LOADING INDICATOR */}
        {loading && (
          <div className="p-12 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
            <Loader2 size={24} className="animate-spin text-slate-400" />
            <p className="text-sm">Loading customer records...</p>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && filteredCustomers.length === 0 && (
          <div className="p-12 text-center text-slate-500">
            <p className="text-base font-medium text-slate-700">
              No customers found
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {search
                ? `No customers match "${search}"`
                : "No registered customers found in the database."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCustomers;
