import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { getStoredVendor } from "../../utils/vendorAuth";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Boxes,
  Wallet,
  IndianRupee,
  Users,
  Store,
  Truck,
  UserCircle,
  Settings,
  X,
  ChevronRight,
} from "lucide-react";

// Helper function to extract initials from store name
const getInitials = (name) => {
  if (!name) return "VN";
  const words = name.trim().split(" ");
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

const VendorSidebar = ({ sidebarOpen, onClose }) => {
  const [vendor, setVendor] = useState(null);

  // Load dynamic vendor data from stored auth session
  useEffect(() => {
    const currentVendor = getStoredVendor();
    if (currentVendor) {
      setVendor(currentVendor);
    }
  }, []);

  // Compute store status details
  const storeName =
    vendor?.storeName || vendor?.businessName || vendor?.name || "My Store";
  const initials = getInitials(storeName);

  const approvalStatus = (
    vendor?.approvalStatus ||
    vendor?.status ||
    "approved"
  ).toLowerCase();
  const isActive = vendor?.isActive !== false;

  const isLive = approvalStatus === "approved" && isActive;
  const isPending = approvalStatus === "pending";

  const menuGroups = [
    {
      title: "MAIN",
      items: [
        {
          name: "Dashboard",
          path: "/vendor",
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: "CATALOG",
      items: [
        {
          name: "Products",
          path: "/vendor/products",
          icon: Package,
        },
        {
          name: "Inventory",
          path: "/vendor/inventory",
          icon: Boxes,
        },
      ],
    },
    {
      title: "SALES",
      items: [
        {
          name: "Orders",
          path: "/vendor/orders",
          icon: ShoppingBag,
        },
        {
          name: "Customers",
          path: "/vendor/customers",
          icon: Users,
        },
      ],
    },
    {
      title: "FINANCE",
      items: [
        {
          name: "Earnings",
          path: "/vendor/earnings",
          icon: IndianRupee,
        },
        {
          name: "Payouts",
          path: "/vendor/payouts",
          icon: Wallet,
        },
      ],
    },
    {
      title: "STORE",
      items: [
        {
          name: "Store Management",
          path: "/vendor/store",
          icon: Store,
        },
        // {
        //   name: "Shipping",
        //   path: "/vendor/shipping",
        //   icon: Truck,
        // },
      ],
    },
    {
      title: "ACCOUNT",
      items: [
        {
          name: "Profile",
          path: "/vendor/profile",
          icon: UserCircle,
        },
        {
          name: "Settings",
          path: "/vendor/settings",
          icon: Settings,
        },
      ],
    },
  ];

  return (
    <>
      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden"
        />
      )}

      {/* SIDEBAR CONTAINER */}
      <aside
        className={`
          fixed left-0 top-0 z-50
          flex h-screen w-64
          flex-col bg-slate-950 text-white
          transition-transform duration-300
          ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        {/* BRAND */}
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
          <div className="flex items-center gap-3">
            <div>
              <p className="font-bold tracking-tight text-white">
                SmartCommerce
              </p>
              <p className="text-[10px] font-semibold tracking-wider text-slate-400">
                VENDOR PANEL
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 hover:bg-white/10 lg:hidden"
          >
            <X size={19} />
          </button>
        </div>

        {/* DYNAMIC VENDOR MINI PROFILE */}
        <div className="p-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-teal-700 font-bold uppercase text-white shadow-xs">
                {initials}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">
                  {storeName}
                </p>
                <p className="truncate text-xs text-slate-400">
                  {isLive
                    ? "Active Vendor"
                    : isPending
                      ? "Pending Approval"
                      : "Inactive Vendor"}
                </p>
              </div>

              <span
                className={`size-2.5 rounded-full ${
                  isLive
                    ? "bg-emerald-400 shadow-xs shadow-emerald-400/50"
                    : isPending
                      ? "bg-amber-400"
                      : "bg-red-400"
                }`}
              />
            </div>
          </div>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="flex-1 overflow-y-auto px-3 pb-5">
          {menuGroups.map((group) => (
            <div key={group.title} className="mb-6">
              <p className="mb-2 px-3 text-[10px] font-bold tracking-widest text-slate-500">
                {group.title}
              </p>

              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `
                        group flex items-center gap-3
                        rounded-xl px-3 py-2.5
                        text-sm font-medium
                        transition-all duration-150
                        ${
                          isActive
                            ? "bg-white text-slate-900 shadow-sm"
                            : "text-slate-300 hover:bg-white/10 hover:text-white"
                        }
                        `
                      }
                    >
                      <Icon size={18} />

                      <span className="flex-1">{item.name}</span>

                      <ChevronRight
                        size={15}
                        className="opacity-0 transition-opacity group-hover:opacity-50"
                      />
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* DYNAMIC STORE STATUS AT BOTTOM */}
        <div className="border-t border-white/10 p-3">
          <div
            className={`rounded-xl border p-3 ${
              isLive
                ? "border-teal-500/20 bg-teal-500/10"
                : isPending
                  ? "border-amber-500/20 bg-amber-500/10"
                  : "border-red-500/20 bg-red-500/10"
            }`}
          >
            <p
              className={`text-xs font-semibold ${
                isLive
                  ? "text-teal-300"
                  : isPending
                    ? "text-amber-300"
                    : "text-red-300"
              }`}
            >
              Store Status
            </p>

            <div className="mt-2 flex items-center gap-2">
              <span
                className={`size-2 rounded-full ${
                  isLive
                    ? "bg-emerald-400"
                    : isPending
                      ? "bg-amber-400"
                      : "bg-red-400"
                }`}
              />

              <span className="text-xs text-slate-300">
                {isLive
                  ? "Your store is live"
                  : isPending
                    ? "Store under review"
                    : "Store offline"}
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default VendorSidebar;
