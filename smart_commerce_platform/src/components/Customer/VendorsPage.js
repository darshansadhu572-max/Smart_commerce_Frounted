import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ShieldCheck, ArrowRight, Loader2, AlertCircle } from "lucide-react";

const API_BASE_URL = "http://localhost:5000/api/customer";

const getInitials = (name) => {
  if (!name) return "SC";
  const words = name.trim().split(/\s+/);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
};

const VendorCard = ({ vendor }) => {
  const vId = vendor._id || vendor.id;
  const storeName =
    vendor.storeName || vendor.businessName || "Independent Store";
  const initials = vendor.initials || getInitials(storeName);
  const city = vendor.city || "India";
  const description =
    vendor.storeDescription ||
    vendor.description ||
    "Trusted independent vendor on SmartCommerce.";
  const productCount = vendor.productCount ?? 0;
  const bgColor = vendor.color || "bg-primary";

  return (
    <Link
      to={`/vendor/${vId}`}
      className={`
        group block rounded-2xl border bg-card
        px-6 py-6
        transition-all duration-200
        hover:-translate-y-0.5
        hover:shadow-[0_12px_30px_rgba(37,50,64,.07)]
        ${vendor.featured ? "border-primary" : "border-border"}
      `}
    >
      <div className="flex items-start gap-5">
        {/* Vendor initials */}
        <div
          className={`
            grid size-[68px] shrink-0 place-items-center
            rounded-2xl
            text-lg font-extrabold text-white
            ${bgColor}
          `}
        >
          {initials}
        </div>

        {/* Vendor information */}
        <div className="min-w-0 flex-1">
          {/* Name + verified */}
          <div className="flex items-center gap-2">
            <h2 className="display text-[19px] font-bold tracking-tight text-foreground group-hover:text-primary transition">
              {storeName}
            </h2>

            <ShieldCheck
              size={17}
              strokeWidth={1.8}
              className="text-primary shrink-0"
            />
          </div>

          {/* City */}
          <div className="mt-1.5 flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">{city}</span>
          </div>

          {/* Description */}
          <p className="mt-4 text-[15px] leading-6 text-muted-foreground line-clamp-2">
            {description}
          </p>

          {/* Products count */}
          <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-primary">
            <span>{productCount} active products · order</span>
            <ArrowRight
              size={17}
              className="ml-1 transition-transform group-hover:translate-x-1"
            />
          </div>
        </div>
      </div>
    </Link>
  );
};

const VendorsPage = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVendors = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get(`${API_BASE_URL}/vendors`);
        if (response.data && response.data.success) {
          setVendors(response.data.vendors || []);
        } else if (Array.isArray(response.data)) {
          setVendors(response.data);
        } else {
          setVendors(response.data.vendors || response.data.data || []);
        }
      } catch (err) {
        console.error("Error fetching vendors:", err);
        setError("Failed to load stores. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-16 pt-10 lg:pt-16">
        {/* Page heading */}
        <div className="mb-10">
          <p className="mono text-[10px] font-bold uppercase tracking-[0.25em] text-primary">
            Stores worth knowing
          </p>

          <h1 className="display mt-3 text-4xl font-extrabold tracking-tight text-foreground sm:text-[46px]">
            The independent edit.
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Discover verified independent sellers committed to quality and
            transparency.
          </p>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
            <Loader2 size={32} className="animate-spin text-primary" />
            <p className="text-sm">Loading vendor stores...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-red-500">
            <AlertCircle size={32} />
            <p className="text-sm font-semibold">{error}</p>
          </div>
        ) : vendors.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center text-muted-foreground">
            No independent stores available at the moment.
          </div>
        ) : (
          /* Vendor grid */
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {vendors.map((vendor) => (
              <VendorCard key={vendor._id || vendor.id} vendor={vendor} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default VendorsPage;
