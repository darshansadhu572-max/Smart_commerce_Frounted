import React, { useState } from "react";
import { Settings, Store, ShoppingBag, CreditCard, Save, } from "lucide-react";

const AdminSettings = () => {

    const [settings, setSettings] = useState({
        /* GENERAL */
        storeName: "SmartCommerce",
        storeEmail: "support@smartcommerce.com",
        storePhone: "+91 98765 43210",
        currency: "INR",
        timezone: "Asia/Kolkata",

        /* MARKETPLACE */
        vendorRegistration: true,
        vendorApproval: "Manual",
        productApproval: "Manual",
        commission: 10,
        minimumPayout: 1000,
        payoutCycle: "Monthly",

        /* ORDERS */
        autoConfirmOrders: false,
        allowCancellation: true,
        returnPeriod: 7,

        /* PAYMENTS */
        codEnabled: true,
        upiEnabled: true,
        cardEnabled: true,
        netBankingEnabled: true,

        /* NOTIFICATIONS */
        newOrderNotification: true,
        newVendorNotification: true,
        newProductNotification: true,
        paymentNotification: true,
        refundNotification: true,
        payoutNotification: true,
        lowStockNotification: true,

        /* SECURITY */
        twoFactor: false,
        loginAlerts: true,
        sessionTimeout: 30,

        /* MAINTENANCE */
        maintenanceMode: false,
    });

    const [errors, setErrors] = useState({});

    const [successMessage, setSuccessMessage] = useState("");

    /* HANDLE CHANGE */

    const handleChange = (e) => {

        const { name, value, type, checked } = e.target;

        setSettings((current) => ({
            ...current,
            [name]: type === "checkbox" ? checked : value,
        }));

        // Remove error when user starts correcting the field
        setErrors((current) => ({
            ...current,
            [name]: "",
        }));

        setSuccessMessage("");
    };


    /* VALIDATE FORM */

    const validateForm = () => {

        const newErrors = {};

        /* GENERAL SETTINGS */

        if (!String(settings.storeName ?? "").trim()) {
            newErrors.storeName = "Store name is required.";
        }

        const email = String(settings.storeEmail ?? "").trim();

        if (!email) {
            newErrors.storeEmail = "Store email is required.";
        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ) {
            newErrors.storeEmail = "Please enter a valid email address.";
        }

        const phone = String(settings.storePhone ?? "").trim();

        if (!phone) {
            newErrors.storePhone = "Store phone number is required.";
        } else if (
            !/^[+]?[0-9\s-]{10,15}$/.test(phone)
        ) {
            newErrors.storePhone = "Please enter a valid phone number.";
        }


        /* MARKETPLACE */

        const commission = Number(settings.commission);

        if (
            settings.commission === "" ||
            Number.isNaN(commission)
        ) {
            newErrors.commission = "Commission is required.";
        } else if (commission < 0 || commission > 100) {
            newErrors.commission =
                "Commission must be between 0 and 100%.";
        }


        const minimumPayout = Number(settings.minimumPayout);

        if (
            settings.minimumPayout === "" ||
            Number.isNaN(minimumPayout)
        ) {
            newErrors.minimumPayout =
                "Minimum payout is required.";
        } else if (minimumPayout < 0) {
            newErrors.minimumPayout =
                "Minimum payout cannot be negative.";
        }


        /* ORDER SETTINGS */

        const returnPeriod = Number(settings.returnPeriod);

        if (
            settings.returnPeriod === "" ||
            Number.isNaN(returnPeriod)
        ) {
            newErrors.returnPeriod =
                "Return period is required.";
        } else if (returnPeriod < 0) {
            newErrors.returnPeriod =
                "Return period cannot be negative.";
        }


        /* SECURITY */

        const sessionTimeout = Number(settings.sessionTimeout);

        if (
            settings.sessionTimeout === "" ||
            Number.isNaN(sessionTimeout)
        ) {
            newErrors.sessionTimeout =
                "Session timeout is required.";
        } else if (sessionTimeout <= 0) {
            newErrors.sessionTimeout =
                "Session timeout must be greater than 0.";
        }


        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };


    /* HANDLE SUBMIT */

    const handleSubmit = (e) => {

        e.preventDefault();

        setSuccessMessage("");

        const isValid = validateForm();

        if (!isValid) {

            console.log("ADMIN SETTINGS VALIDATION FAILED:", errors);

            return;
        }


        /* Convert numeric fields to numbers */

        const updatedSettings = {
            ...settings,

            commission: Number(settings.commission),

            minimumPayout: Number(settings.minimumPayout),

            returnPeriod: Number(settings.returnPeriod),

            sessionTimeout: Number(settings.sessionTimeout),
        };


        /* SUCCESS LOG */

        console.log("ADMIN SETTINGS UPDATED");

        console.log("General Settings:", {
            storeName: updatedSettings.storeName,
            storeEmail: updatedSettings.storeEmail,
            storePhone: updatedSettings.storePhone,
            currency: updatedSettings.currency,
            timezone: updatedSettings.timezone,
        });

        console.log("Marketplace Settings:", {
            vendorRegistration: updatedSettings.vendorRegistration,
            vendorApproval: updatedSettings.vendorApproval,
            productApproval: updatedSettings.productApproval,
            commission: updatedSettings.commission,
            minimumPayout: updatedSettings.minimumPayout,
            payoutCycle: updatedSettings.payoutCycle,
        });

        console.log("Order Settings:", {
            autoConfirmOrders: updatedSettings.autoConfirmOrders,
            allowCancellation: updatedSettings.allowCancellation,
            returnPeriod: updatedSettings.returnPeriod,
        });

        console.log("Payment Settings:", {
            upiEnabled: updatedSettings.upiEnabled,
            cardEnabled: updatedSettings.cardEnabled,
            netBankingEnabled: updatedSettings.netBankingEnabled,
            codEnabled: updatedSettings.codEnabled,
        });

        console.log("Notification Settings:", {
            newOrderNotification:
                updatedSettings.newOrderNotification,

            newVendorNotification:
                updatedSettings.newVendorNotification,

            newProductNotification:
                updatedSettings.newProductNotification,

            paymentNotification:
                updatedSettings.paymentNotification,

            refundNotification:
                updatedSettings.refundNotification,

            payoutNotification:
                updatedSettings.payoutNotification,

            lowStockNotification:
                updatedSettings.lowStockNotification,
        });

        console.log("Security Settings:", {
            twoFactor: updatedSettings.twoFactor,
            loginAlerts: updatedSettings.loginAlerts,
            sessionTimeout: updatedSettings.sessionTimeout,
        });

        console.log("Maintenance:", {
            maintenanceMode:
                updatedSettings.maintenanceMode,
        });

        console.log("COMPLETE SETTINGS OBJECT:", updatedSettings);


        setSettings(updatedSettings);

        setSuccessMessage(
            "Settings saved successfully!"
        );
    };


    /* ERROR CLASS */

    const inputClass = (fieldName) => {

        return `
            w-full px-4 py-3 border rounded-xl outline-none
            ${errors[fieldName]
                ? "border-red-400 focus:ring-2 focus:ring-red-100"
                : "border-slate-200 focus:ring-2 focus:ring-slate-200"
            }
        `;
    };


    return (
        <div className="space-y-6">

            {/* HEADER */}

            <div>

                <div className="flex items-center gap-3">

                    <div className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center">

                        <Settings size={21} />

                    </div>

                    <div>

                        <h1 className="text-2xl font-bold text-slate-900">
                            Settings
                        </h1>

                        <p className="text-sm text-slate-500 mt-1">
                            Manage your SmartCommerce marketplace configuration.
                        </p>

                    </div>

                </div>

            </div>


            {/* SUCCESS MESSAGE */}

            {successMessage && (

                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm font-medium">
                    {successMessage}
                </div>

            )}


            <form
                onSubmit={handleSubmit}
                className="space-y-6"
            >

                {/* GENERAL SETTINGS */}

                <div className="bg-white border border-slate-200 rounded-2xl p-6">

                    <div className="flex items-center gap-3 mb-6">

                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">

                            <Store size={19} />

                        </div>

                        <div>

                            <h2 className="font-semibold text-slate-900">
                                General Settings
                            </h2>

                            <p className="text-xs text-slate-500">
                                Basic marketplace information.
                            </p>

                        </div>

                    </div>


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        {/* STORE NAME */}

                        <div>

                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Store Name
                            </label>

                            <input
                                type="text"
                                name="storeName"
                                value={settings.storeName ?? ""}
                                onChange={handleChange}
                                className={inputClass("storeName")}
                            />

                            {errors.storeName && (
                                <p className="text-sm text-red-600 mt-1">
                                    {errors.storeName}
                                </p>
                            )}

                        </div>


                        {/* STORE EMAIL */}

                        <div>

                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Store Email
                            </label>

                            <input
                                type="email"
                                name="storeEmail"
                                value={settings.storeEmail ?? ""}
                                onChange={handleChange}
                                className={inputClass("storeEmail")}
                            />

                            {errors.storeEmail && (
                                <p className="text-sm text-red-600 mt-1">
                                    {errors.storeEmail}
                                </p>
                            )}

                        </div>


                        {/* STORE PHONE */}

                        <div>

                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Store Phone
                            </label>

                            <input
                                type="text"
                                name="storePhone"
                                value={settings.storePhone ?? ""}
                                onChange={handleChange}
                                className={inputClass("storePhone")}
                            />

                            {errors.storePhone && (
                                <p className="text-sm text-red-600 mt-1">
                                    {errors.storePhone}
                                </p>
                            )}

                        </div>


                        {/* CURRENCY */}

                        <div>

                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Currency
                            </label>

                            <select
                                name="currency"
                                value={settings.currency ?? ""}
                                onChange={handleChange}
                                className={inputClass("currency")}
                            >

                                <option value="INR">
                                    INR (₹)
                                </option>

                                <option value="USD">
                                    USD ($)
                                </option>

                                <option value="EUR">
                                    EUR (€)
                                </option>

                            </select>

                        </div>


                        {/* TIMEZONE */}

                        <div className="md:col-span-2">

                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Timezone
                            </label>

                            <select
                                name="timezone"
                                value={settings.timezone ?? ""}
                                onChange={handleChange}
                                className={inputClass("timezone")}
                            >

                                <option value="Asia/Kolkata">
                                    Asia/Kolkata (IST)
                                </option>

                                <option value="Asia/Dubai">
                                    Asia/Dubai
                                </option>

                                <option value="UTC">
                                    UTC
                                </option>

                            </select>

                        </div>

                    </div>

                </div>


                {/* MARKETPLACE SETTINGS */}

                <div className="bg-white border border-slate-200 rounded-2xl p-6">

                    <div className="flex items-center gap-3 mb-6">

                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">

                            <ShoppingBag size={19} />

                        </div>

                        <div>

                            <h2 className="font-semibold text-slate-900">
                                Marketplace Settings
                            </h2>

                            <p className="text-xs text-slate-500">
                                Control vendors, products and marketplace commissions.
                            </p>

                        </div>

                    </div>


                    <div className="space-y-5">

                        {/* VENDOR REGISTRATION */}

                        <div className="flex items-center justify-between gap-4 p-4 border border-slate-200 rounded-xl">

                            <div>

                                <p className="text-sm font-medium text-slate-900">
                                    Vendor Registration
                                </p>

                                <p className="text-xs text-slate-500 mt-1">
                                    Allow new vendors to register.
                                </p>

                            </div>

                            <input
                                type="checkbox"
                                name="vendorRegistration"
                                checked={settings.vendorRegistration}
                                onChange={handleChange}
                                className="w-5 h-5"
                            />

                        </div>


                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                            {/* VENDOR APPROVAL */}

                            <div>

                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Vendor Approval
                                </label>

                                <select
                                    name="vendorApproval"
                                    value={settings.vendorApproval ?? ""}
                                    onChange={handleChange}
                                    className={inputClass("vendorApproval")}
                                >

                                    <option value="Manual">
                                        Manual
                                    </option>

                                    <option value="Automatic">
                                        Automatic
                                    </option>

                                </select>

                            </div>


                            {/* PRODUCT APPROVAL */}

                            <div>

                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Product Approval
                                </label>

                                <select
                                    name="productApproval"
                                    value={settings.productApproval ?? ""}
                                    onChange={handleChange}
                                    className={inputClass("productApproval")}
                                >

                                    <option value="Manual">
                                        Manual
                                    </option>

                                    <option value="Automatic">
                                        Automatic
                                    </option>

                                </select>

                            </div>


                            {/* COMMISSION */}

                            <div>

                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Vendor Commission (%)
                                </label>

                                <input
                                    type="number"
                                    name="commission"
                                    min="0"
                                    max="100"
                                    value={settings.commission ?? ""}
                                    onChange={handleChange}
                                    className={inputClass("commission")}
                                />

                                {errors.commission && (
                                    <p className="text-sm text-red-600 mt-1">
                                        {errors.commission}
                                    </p>
                                )}

                            </div>


                            {/* MINIMUM PAYOUT */}

                            <div>

                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Minimum Payout (₹)
                                </label>

                                <input
                                    type="number"
                                    name="minimumPayout"
                                    min="0"
                                    value={settings.minimumPayout ?? ""}
                                    onChange={handleChange}
                                    className={inputClass("minimumPayout")}
                                />

                                {errors.minimumPayout && (
                                    <p className="text-sm text-red-600 mt-1">
                                        {errors.minimumPayout}
                                    </p>
                                )}

                            </div>


                            {/* PAYOUT CYCLE */}

                            <div className="md:col-span-2">

                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Payout Cycle
                                </label>

                                <select
                                    name="payoutCycle"
                                    value={settings.payoutCycle ?? ""}
                                    onChange={handleChange}
                                    className={inputClass("payoutCycle")}
                                >

                                    <option value="Daily">
                                        Daily
                                    </option>

                                    <option value="Weekly">
                                        Weekly
                                    </option>

                                    <option value="Monthly">
                                        Monthly
                                    </option>

                                </select>

                            </div>

                        </div>

                    </div>

                </div>


                {/* ORDER SETTINGS */}

                <div className="bg-white border border-slate-200 rounded-2xl p-6">

                    <div className="flex items-center gap-3 mb-6">

                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">

                            <ShoppingBag size={19} />

                        </div>

                        <div>

                            <h2 className="font-semibold text-slate-900">
                                Order Settings
                            </h2>

                            <p className="text-xs text-slate-500">
                                Configure order and return behavior.
                            </p>

                        </div>

                    </div>


                    <div className="space-y-4">

                        {/* AUTO CONFIRM */}

                        <label className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">

                            <span>

                                <span className="block text-sm font-medium text-slate-900">
                                    Auto Confirm Orders
                                </span>

                                <span className="block text-xs text-slate-500 mt-1">
                                    Automatically confirm new customer orders.
                                </span>

                            </span>

                            <input
                                type="checkbox"
                                name="autoConfirmOrders"
                                checked={settings.autoConfirmOrders}
                                onChange={handleChange}
                                className="w-5 h-5"
                            />

                        </label>


                        {/* CANCELLATION */}

                        <label className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">

                            <span>

                                <span className="block text-sm font-medium text-slate-900">
                                    Allow Order Cancellation
                                </span>

                                <span className="block text-xs text-slate-500 mt-1">
                                    Customers can request cancellation.
                                </span>

                            </span>

                            <input
                                type="checkbox"
                                name="allowCancellation"
                                checked={settings.allowCancellation}
                                onChange={handleChange}
                                className="w-5 h-5"
                            />

                        </label>


                        {/* RETURN PERIOD */}

                        <div>

                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Return Period (Days)
                            </label>

                            <input
                                type="number"
                                name="returnPeriod"
                                min="0"
                                value={settings.returnPeriod ?? ""}
                                onChange={handleChange}
                                className={`w-full md:w-1/2 ${inputClass(
                                    "returnPeriod"
                                )}`}
                            />

                            {errors.returnPeriod && (
                                <p className="text-sm text-red-600 mt-1">
                                    {errors.returnPeriod}
                                </p>
                            )}

                        </div>

                    </div>

                </div>


                {/* PAYMENT SETTINGS */}

                <div className="bg-white border border-slate-200 rounded-2xl p-6">

                    <div className="flex items-center gap-3 mb-6">

                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">

                            <CreditCard size={19} />

                        </div>

                        <div>

                            <h2 className="font-semibold text-slate-900">
                                Payment Methods
                            </h2>

                            <p className="text-xs text-slate-500">
                                Enable or disable customer payment methods.
                            </p>

                        </div>

                    </div>


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {[
                            ["upiEnabled", "UPI"],
                            ["cardEnabled", "Credit / Debit Card"],
                            ["netBankingEnabled", "Net Banking"],
                            ["codEnabled", "Cash on Delivery"],
                        ].map(([name, label]) => (

                            <label
                                key={name}
                                className="flex items-center justify-between p-4 border border-slate-200 rounded-xl"
                            >

                                <span className="text-sm font-medium text-slate-900">
                                    {label}
                                </span>

                                <input
                                    type="checkbox"
                                    name={name}
                                    checked={settings[name]}
                                    onChange={handleChange}
                                    className="w-5 h-5"
                                />

                            </label>

                        ))}

                    </div>

                </div>


                {/* SAVE */}

                <div className="flex justify-end">

                    <button
                        type="submit"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition"
                    >

                        <Save size={17} />

                        Save Settings

                    </button>

                </div>

            </form>

        </div>
    );
};

export default AdminSettings;