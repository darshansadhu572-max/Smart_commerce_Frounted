import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, ShieldCheck, CheckCircle2, Eye, EyeOff, LockKeyhole, } from "lucide-react";

const VendorForgotPassword = () => {
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const handleEmailSubmit = (e) => {
        e.preventDefault();

        setError("");
        setMessage("");

        if (!email.trim()) {
            setError("Please enter your registered vendor email.");
            return;
        }

        setMessage("Verification code sent to your email.");
        setStep(2);
    };

    const handleOtpSubmit = (e) => {
        e.preventDefault();

        setError("");
        setMessage("");

        if (otp.length !== 6) {
            setError("Please enter the 6-digit verification code.");
            return;
        }

        setStep(3);
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();

        setError("");
        setMessage("");

        if (newPassword.length < 8) {
            setError("Password must contain at least 8 characters.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        console.log("Forgot Password")

        console.log(
            "\nEmail: " + email,
            "\nOPT: " + otp,
            "\nNew Password: " + newPassword,
            "\nConfirm Password: " + confirmPassword
        )

        setStep(4);
    };

    return (
        <div className="min-h-screen bg-background text-foreground">

            {/* Top Brand Bar */}
            <div className="border-b border-border bg-[#f0eadf] px-4 py-3">
                <div className="mx-auto flex max-w-7xl items-center justify-between">

                    <Link
                        to="/"
                        className="flex items-center gap-2"
                    >
                        <span className="grid size-9 place-items-center rounded-xl bg-primary text-sm font-black text-primary-foreground">
                            SC
                        </span>

                        <span className="display text-lg font-extrabold tracking-tight">
                            Smart<span className="text-primary">Commerce</span>
                        </span>
                    </Link>

                    <span className="hidden text-xs font-semibold text-muted-foreground sm:block">
                        Vendor workspace
                    </span>

                </div>
            </div>

            {/* Main */}
            <main className="grid min-h-[calc(100vh-61px)] lg:grid-cols-2">

                {/* Left Information Section */}
                <section className="relative hidden overflow-hidden bg-[#203b42] px-10 py-16 text-white lg:flex lg:items-center">

                    <div className="absolute -right-24 -top-24 size-72 rounded-full bg-teal-500/10 blur-3xl" />

                    <div className="absolute -bottom-24 -left-24 size-72 rounded-full bg-amber-400/10 blur-3xl" />

                    <div className="relative mx-auto max-w-lg">

                        <p className="mono text-[10px] uppercase tracking-[0.25em] text-white/45">
                            Vendor account
                        </p>

                        <h1 className="display mt-5 text-5xl font-extrabold leading-tight">
                            Get back to
                            <span className="block text-[#d8a44c]">
                                your store.
                            </span>
                        </h1>

                        <p className="mt-6 max-w-md text-base leading-7 text-white/65">
                            Securely recover access to your SmartCommerce
                            vendor account and continue managing your store,
                            products and orders.
                        </p>

                        <div className="mt-10 space-y-4">

                            <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                                <div className="grid size-11 place-items-center rounded-xl bg-white/10">
                                    <ShieldCheck size={20} />
                                </div>

                                <div>
                                    <p className="text-sm font-bold">
                                        Secure recovery
                                    </p>
                                    <p className="mt-1 text-xs text-white/50">
                                        Your account information stays protected.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                                <div className="grid size-11 place-items-center rounded-xl bg-white/10">
                                    <LockKeyhole size={20} />
                                </div>

                                <div>
                                    <p className="text-sm font-bold">
                                        Reset your password
                                    </p>
                                    <p className="mt-1 text-xs text-white/50">
                                        Create a new password and continue selling.
                                    </p>
                                </div>
                            </div>

                        </div>

                    </div>
                </section>

                {/* Right Form Section */}
                <section className="flex items-center justify-center px-5 py-10 sm:px-8">

                    <div className="w-full max-w-md">

                        {/* Back */}
                        <Link
                            to="/vendor/login"
                            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary"
                        >
                            <ArrowLeft size={16} />
                            Back to vendor login
                        </Link>

                        {/* Step 1 */}
                        {step === 1 && (
                            <>

                                <div className="grid size-12 place-items-center rounded-2xl bg-secondary text-primary">
                                    <Mail size={22} />
                                </div>

                                <p className="mono mt-6 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                                    Step 01 · Account verification
                                </p>

                                <h2 className="display mt-3 text-3xl font-extrabold tracking-tight">
                                    Forgot your password?
                                </h2>

                                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                                    Enter the email address associated with
                                    your vendor account. We'll send you a
                                    verification code.
                                </p>

                                {error && (
                                    <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                                        {error}
                                    </div>
                                )}

                                <form
                                    onSubmit={handleEmailSubmit}
                                    className="mt-7 space-y-5"
                                >

                                    <div>
                                        <label className="text-sm font-bold">
                                            Vendor email
                                        </label>

                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="vendor@example.com"
                                            className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full rounded-xl bg-primary px-4 py-3.5 text-sm font-bold text-primary-foreground transition hover:opacity-90"
                                    >
                                        Send verification code
                                    </button>

                                </form>

                                <p className="mt-7 text-center text-sm text-muted-foreground">
                                    Remember your password?{" "}
                                    <Link
                                        to="/vendor/login"
                                        className="font-bold text-primary hover:underline"
                                    >
                                        Sign in
                                    </Link>
                                </p>

                            </>
                        )}

                        {/* Step 2 */}
                        {step === 2 && (
                            <>

                                <div className="grid size-12 place-items-center rounded-2xl bg-secondary text-primary">
                                    <ShieldCheck size={22} />
                                </div>

                                <p className="mono mt-6 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                                    Step 02 · Verification
                                </p>

                                <h2 className="display mt-3 text-3xl font-extrabold tracking-tight">
                                    Verify your email
                                </h2>

                                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                                    We sent a 6-digit verification code to{" "}
                                    <strong className="text-foreground">
                                        {email}
                                    </strong>
                                    .
                                </p>

                                {message && (
                                    <div className="mt-5 rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-medium text-teal-700">
                                        {message}
                                    </div>
                                )}

                                {error && (
                                    <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                                        {error}
                                    </div>
                                )}

                                <form
                                    onSubmit={handleOtpSubmit}
                                    className="mt-7 space-y-5"
                                >

                                    <div>
                                        <label className="text-sm font-bold">
                                            Verification code
                                        </label>

                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={6}
                                            value={otp}
                                            onChange={(e) =>
                                                setOtp(
                                                    e.target.value.replace(/\D/g, "")
                                                )
                                            }
                                            placeholder="000000"
                                            className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-4 text-center text-xl font-bold tracking-[0.5em] outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full rounded-xl bg-primary px-4 py-3.5 text-sm font-bold text-primary-foreground transition hover:opacity-90"
                                    >
                                        Verify code
                                    </button>

                                </form>

                                <div className="mt-6 flex items-center justify-between text-sm">

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setStep(1);
                                            setMessage("");
                                            setError("");
                                        }}
                                        className="font-semibold text-muted-foreground hover:text-primary"
                                    >
                                        Change email
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setMessage("A new verification code has been sent.");
                                        }}
                                        className="font-bold text-primary hover:underline"
                                    >
                                        Resend code
                                    </button>

                                </div>

                            </>
                        )}

                        {/* Step 3 */}
                        {step === 3 && (
                            <>

                                <div className="grid size-12 place-items-center rounded-2xl bg-secondary text-primary">
                                    <LockKeyhole size={22} />
                                </div>

                                <p className="mono mt-6 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                                    Step 03 · New password
                                </p>

                                <h2 className="display mt-3 text-3xl font-extrabold tracking-tight">
                                    Set a new password
                                </h2>

                                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                                    Choose a strong password for your vendor
                                    account.
                                </p>

                                {error && (
                                    <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                                        {error}
                                    </div>
                                )}

                                <form
                                    onSubmit={handlePasswordSubmit}
                                    className="mt-7 space-y-5"
                                >

                                    <div>
                                        <label className="text-sm font-bold">
                                            New password
                                        </label>

                                        <div className="relative mt-2">

                                            <input
                                                type={showPassword ? "text" : "password"}
                                                value={newPassword}
                                                onChange={(e) =>
                                                    setNewPassword(e.target.value)
                                                }
                                                placeholder="At least 8 characters"
                                                className="w-full rounded-xl border border-border bg-background px-4 py-3 pr-12 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                                            />

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowPassword(!showPassword)
                                                }
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                                            >
                                                {showPassword ? (
                                                    <EyeOff size={18} />
                                                ) : (
                                                    <Eye size={18} />
                                                )}
                                            </button>

                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm font-bold">
                                            Confirm password
                                        </label>

                                        <div className="relative mt-2">

                                            <input
                                                type={
                                                    showConfirmPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                value={confirmPassword}
                                                onChange={(e) =>
                                                    setConfirmPassword(e.target.value)
                                                }
                                                placeholder="Repeat your password"
                                                className="w-full rounded-xl border border-border bg-background px-4 py-3 pr-12 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                                            />

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowConfirmPassword(
                                                        !showConfirmPassword
                                                    )
                                                }
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                                            >
                                                {showConfirmPassword ? (
                                                    <EyeOff size={18} />
                                                ) : (
                                                    <Eye size={18} />
                                                )}
                                            </button>

                                        </div>
                                    </div>

                                    <div className="rounded-xl bg-muted p-4 text-xs leading-5 text-muted-foreground">
                                        Password should contain at least 8
                                        characters. For better security, use a
                                        combination of letters, numbers and
                                        special characters.
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full rounded-xl bg-primary px-4 py-3.5 text-sm font-bold text-primary-foreground transition hover:opacity-90"
                                    >
                                        Reset password
                                    </button>

                                </form>

                            </>
                        )}

                        {/* Step 4 */}
                        {step === 4 && (
                            <div className="text-center">

                                <div className="mx-auto grid size-16 place-items-center rounded-full bg-teal-100 text-teal-700">
                                    <CheckCircle2 size={30} />
                                </div>

                                <p className="mono mt-7 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                                    Password updated
                                </p>

                                <h2 className="display mt-3 text-3xl font-extrabold tracking-tight">
                                    You're all set.
                                </h2>

                                <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
                                    Your vendor account password has been
                                    successfully updated. You can now sign in
                                    with your new password.
                                </p>

                                <button
                                    type="button"
                                    onClick={() => navigate("/vendor/login")}
                                    className="mt-8 w-full rounded-xl bg-primary px-4 py-3.5 text-sm font-bold text-primary-foreground transition hover:opacity-90"
                                >
                                    Continue to vendor login
                                </button>

                            </div>
                        )}

                    </div>

                </section>

            </main>
        </div>
    );
};

export default VendorForgotPassword;