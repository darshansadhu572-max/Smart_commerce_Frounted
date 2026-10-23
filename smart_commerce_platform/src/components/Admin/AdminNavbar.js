import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Menu,
    Search,
    ChevronDown,
    User,
    LogOut,
    ShieldCheck
} from "lucide-react";

const AdminNavbar = ({ onToggleSidebar }) => {
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    const [showProfile, setShowProfile] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [adminUser, setAdminUser] = useState(null);

    // Sync Admin User data from LocalStorage on mount
    useEffect(() => {
        const savedUser = localStorage.getItem("adminUser");
        if (savedUser) {
            try {
                setAdminUser(JSON.parse(savedUser));
            } catch (e) {
                console.error("Error parsing stored adminUser:", e);
            }
        }
    }, []);

    // Close profile dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowProfile(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Admin Logout Handler
    const handleLogout = () => {
        localStorage.removeItem("adminUser");
        localStorage.removeItem("smartcommerce-admin");
        localStorage.removeItem("adminToken");
        setShowProfile(false);
        navigate("/admin/login");
    };

    // Search Submit Handler
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/admin/vendors?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    // Generate Initials from Admin Name
    const getInitials = (firstName, lastName) => {
        const f = firstName ? firstName[0] : "A";
        const l = lastName ? lastName[0] : "";
        return (f + l).toUpperCase();
    };

    // Dynamic Display Names
    const adminFirstName = adminUser?.firstName || "Admin";
    const adminLastName = adminUser?.lastName || "Admin";
    const adminFullName = `${adminFirstName} ${adminLastName}`;
    const adminEmail = adminUser?.email || "Admin@smartcommerce.in";
    const adminInitials = getInitials(adminFirstName, adminLastName);

    return (
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 md:px-6">

            {/* LEFT */}
            <div className="flex items-center gap-3">

                {/* Mobile Menu Button */}
                <button
                    type="button"
                    onClick={onToggleSidebar}
                    className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 lg:hidden"
                    aria-label="Toggle Sidebar"
                >
                    <Menu size={21} />
                </button>

                {/* Mobile Logo */}
                <div className="flex items-center gap-2 lg:hidden">
                    <span className="font-extrabold text-slate-900">
                        Smart<span className="text-[#287b6d]">Commerce</span>
                    </span>
                </div>

                {/* Desktop Page Context */}
                <div className="hidden lg:block">
                    <p className="text-sm font-bold text-slate-800">
                        Admin Console
                    </p>

                    <p className="text-[11px] text-slate-400">
                        Manage your marketplace
                    </p>
                </div>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-2 md:gap-4">

                {/* Search Bar */}
                <form onSubmit={handleSearchSubmit} className="relative hidden md:block">
                    <Search
                        size={17}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search vendors, products..."
                        className="w-52 rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs outline-none transition focus:border-[#287b6d] focus:bg-white focus:ring-4 focus:ring-[#287b6d]/10"
                    />
                </form>

                {/* Divider */}
                <div className="hidden h-8 w-px bg-slate-200 sm:block" />

                {/* Profile Dropdown Container */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        type="button"
                        onClick={() => setShowProfile(!showProfile)}
                        className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-slate-100"
                    >
                        {/* Dynamic Avatar Initials */}
                        <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#18343b] text-xs font-bold text-white shadow-xs">
                            {adminInitials}
                        </div>

                        <div className="hidden text-left sm:block">
                            <p className="max-w-[120px] truncate text-xs font-bold text-slate-800">
                                {adminFullName}
                            </p>

                            <p className="text-[10px] text-slate-400">
                                Super Admin
                            </p>
                        </div>

                        <ChevronDown
                            size={15}
                            className={`hidden text-slate-400 transition-transform sm:block ${showProfile ? "rotate-180" : ""}`}
                        />
                    </button>

                    {/* Dropdown Menu */}
                    {showProfile && (
                        <div className="absolute right-0 top-12 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xl animate-in fade-in slide-in-from-top-2 duration-150">

                            <div className="border-b border-slate-100 px-3 py-3 bg-slate-50/50 rounded-xl mb-1">
                                <p className="truncate text-xs font-bold text-slate-800">
                                    {adminFullName}
                                </p>

                                <p className="mt-0.5 truncate text-[10px] text-slate-400">
                                    {adminEmail}
                                </p>
                            </div>

                            <Link
                                to="/admin/profile"
                                onClick={() => setShowProfile(false)}
                                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
                            >
                                <User size={15} className="text-slate-400" />
                                My Profile
                            </Link>

                            <button
                                type="button"
                                onClick={handleLogout}
                                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                            >
                                <LogOut size={15} />
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default AdminNavbar;