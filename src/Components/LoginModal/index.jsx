"use client";
import { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import Image from "next/image";
import { supabase } from "../../lib/supabaseClient";
import { FiEye, FiEyeOff, FiMail, FiPhone } from "react-icons/fi";
import toast from "react-hot-toast";


export default function LoginModal({ open, onClose, setIsSignUp, setIsForgot }) {
    const [show, setShow] = useState(false);
    const [activeTab, setActiveTab] = useState("email");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState()
    const [loading, setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    const [errors, setErrors] = useState('');
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    const [phonePassword, setPhonepassword] = useState(false);

    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden"; // lock scroll
        } else {
            document.body.style.overflow = ""; // unlock scroll
        }

        return () => {
            document.body.style.overflow = ""; // cleanup
        };
    }, [open]);

    useEffect(() => {
        if (open) setTimeout(() => setShow(true), 10);
        else setShow(false);
    }, [open]);

    // ---------------------------
    // Login Handler
    // ---------------------------
    const handleLogin = async () => {
        setErrMsg("");

        if (!email.trim()) return setErrMsg("Email is required.");
        if (!/^\S+@\S+\.\S+$/.test(email)) return setErrMsg("Invalid email.");
        if (!password) return setErrMsg("Password is required.");

        setLoading(true);
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        setLoading(false);

        if (error) {
            toast.error(error.message);
            return setErrors(error.message);
        }

        toast.success("Login successful 🎉");
        localStorage.setItem("auth-token", data.session.access_token);
        localStorage.setItem("userId", data.user.id);

        onClose();
    };

    const handlePhoneLogin = async () => {
        setErrMsg("");

        if (!phone.trim()) return setErrMsg("Phone Number is required.");
        if (!password) return setErrMsg("Password is required.");

        setLoading(true);
        const { data, error } = await supabase.auth.signInWithPassword({
            phone: `+91${phone}`,
            password,
        });
        setLoading(false);

        if (error) {
            toast.error(error.message);
            return setErrors(error.message);
        }

        toast.success("Login successful 🎉");
        localStorage.setItem("auth-token", data.session.access_token);
        localStorage.setItem("userId", data.user.id);

        onClose();
    };

    // ---------------------------
    // Google Login Handler
    // ---------------------------
    const loginWithGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: window.location.origin, // ✅ important
            },
        });

        if (error) {
            setErrMsg("Google login failed. Try again.");
        }
    };

    return (
        <>
            {open && (
                <div
                    className={`fixed inset-0 z-50 flex items-center justify-center p-4 
                    bg-black/40 backdrop-blur-sm transition-opacity duration-300 
                    ${show ? "opacity-100" : "opacity-0"}`}>
                    <div
                        className={`bg-white z-60 w-full max-w-md p-8 rounded-2xl shadow-lg border
                        transition-all duration-300
                        ${show ? "scale-100 translate-y-0 opacity-100" : "scale-75 translate-y-5 opacity-0"}`}>

                        {/* Close Btn */}
                        <button
                            onClick={onClose}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl">
                            ✕
                        </button>

                        {/* Heading */}
                        <h2 className="text-center text-3xl font-semibold text-black">Login</h2>
                        <p className="text-center text-gray-500 text-sm mb-6">
                            Login to continue to our website
                        </p>
                        <div className="grid grid-cols-2 mb-6 gap-10 pb-2">
                            <button
                                onClick={() => setActiveTab("email")}
                                className={`justify-center flex items-center gap-2 pb-2 ${activeTab === "email"
                                    ? "text-red-600 border-b-2 border-red-600"
                                    : "text-gray-500"
                                    }`}
                            >
                                <FiMail size={18} /> Email
                            </button>

                            <button
                                onClick={() => setActiveTab("phone")}
                                className={`flex items-center justify-center gap-2 pb-2 ${activeTab === "phone"
                                    ? "text-red-600 border-b-2 border-red-600"
                                    : "text-gray-500"}`}>
                                <FiPhone size={18} /> Phone
                            </button>
                        </div>
                        {/* Email */}
                        {activeTab == 'email' &&
                            <div>
                                {errors && (
                                    <p className="text-red-600 text-sm mb-3 text-center">{errors}</p>
                                )}
                                <div className="mb-4">
                                    <label className="block text-sm font-semibold text-black mb-1">Email *</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        className="w-full text-black  border border-gray-300 rounded-lg px-4 py-3
                                        focus:border-red-500 outline-none transition"
                                    />
                                </div>

                                {/* Password */}
                                <div className="mb-5 relative">
                                    <label className="block text-sm font-semibold text-black mb-1">Password *</label>
                                    <input
                                        type={showConfirmPass ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter password"
                                        className="relative w-full text-black border border-gray-300 rounded-lg px-4 py-3
                                        focus:border-red-500 outline-none transition"
                                    />
                                    <span
                                        className="absolute right-4 top-10 cursor-pointer text-gray-500"
                                        onClick={() => setShowConfirmPass(!showConfirmPass)}>
                                        {showConfirmPass ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                                    </span>
                                </div>

                                {/* Error Message */}
                                {errMsg && (
                                    <p className="text-red-600 text-sm mb-3 text-center">{errMsg}</p>
                                )}

                                <div
                                    className="text-right text-sm text-secondary font-medium mb-4 cursor-pointer"
                                    onClick={() => {
                                        onClose();
                                        setIsForgot(true);
                                    }}
                                >
                                    <p>Forgot Password?</p>
                                </div>

                                {/* Login Button */}
                                <div className="flex justify-center">
                                    <button
                                        disabled={loading}
                                        onClick={handleLogin}
                                        className={`w-[264px] btn-gradient hover:bg-red-700 text-white font-semibold
                                        py-3 rounded-full transition mb-4 flex items-center justify-center gap-2
                                        ${loading ? "opacity-60 cursor-not-allowed" : ""}`}>
                                        {loading && (
                                            <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                        )}
                                        {loading ? "Logging in..." : "Login"}
                                    </button>

                                </div>

                                {/* Sign Up Switch */}
                                <div className="text-center text-black mb-3">
                                    <p>
                                        Don’t have an account?{" "}
                                        <span
                                            className="text-secondary cursor-pointer"
                                            onClick={() => {
                                                setIsSignUp(true);
                                                onClose();
                                            }}
                                        >
                                            Sign up
                                        </span>
                                    </p>
                                </div>

                                {/* Social Login */}
                                <div className="flex items-center justify-center gap-6">
                                    <button className="rounded-full">
                                        <Image
                                            src="/assets/call.png"
                                            width={40}
                                            height={22}
                                            alt="call"
                                        />
                                    </button>

                                    {/* Google OAuth */}
                                    <button
                                        onClick={loginWithGoogle}
                                        className="rounded-full hover:bg-gray-100 p-1 transition"
                                    >
                                        <FcGoogle size={40} />
                                    </button>
                                </div>
                            </div>}
                        {activeTab == 'phone' &&

                            <div>
                                {errors && (
                                    <p className="text-red-600 text-sm mb-3 text-center">{errors}</p>
                                )}
                                <div className="mb-4">
                                    <label className="font-semibold text-black text-sm">Mobile No *</label>
                                    <input
                                        type="text"
                                        className="w-full text-black mt-1 px-4 py-3 focus:border-red-500 outline-none border rounded-xl"
                                        placeholder="Enter phone number"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />

                                </div>

                                {/* Password */}
                                <div className="mb-5 relative">
                                    <label className="block text-sm font-semibold text-black mb-1">Password *</label>
                                    <input
                                        type={phonePassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter password"
                                        className="w-full text-black border border-gray-300 rounded-lg px-4 py-3
                                        focus:border-red-500 outline-none transition"
                                    />
                                    <span
                                        className="absolute right-4 top-10 cursor-pointer text-gray-500"
                                        onClick={() => setPhonepassword(!phonePassword)}>
                                        {phonePassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                                    </span>
                                </div>

                                {/* Error Message */}
                                {errMsg && (
                                    <p className="text-red-600 text-sm mb-3 text-center">{errMsg}</p>
                                )}

                                <div
                                    className="text-right text-sm text-secondary font-medium mb-4 cursor-pointer"
                                    onClick={() => {
                                        onClose();
                                        setIsForgot(true);
                                    }}
                                >
                                    <p>Forgot Password?</p>
                                </div>

                                {/* Login Button */}
                                <div className="flex justify-center">
                                    <button
                                        disabled={loading}
                                        onClick={handlePhoneLogin}
                                        className={`w-[264px] btn-gradient hover:bg-red-700 text-white font-semibold
                                        py-3 rounded-full transition mb-4 flex items-center justify-center gap-2
                                        ${loading ? "opacity-60 cursor-not-allowed" : ""}`}>
                                        {loading && (
                                            <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                        )}
                                        {loading ? "Logging in..." : "Login"}
                                    </button>

                                </div>

                                {/* Sign Up Switch */}
                                <div className="text-center text-black mb-3">
                                    <p>
                                        Don’t have an account?{" "}
                                        <span
                                            className="text-secondary cursor-pointer"
                                            onClick={() => {
                                                setIsSignUp(true);
                                                onClose();
                                            }}
                                        >
                                            Sign up
                                        </span>
                                    </p>
                                </div>

                                {/* Social Login */}
                                <div className="flex items-center justify-center gap-6">
                                    <button className="rounded-full">
                                        <Image
                                            src="/assets/call.png"
                                            width={40}
                                            height={22}
                                            alt="call"
                                        />
                                    </button>

                                    {/* Google OAuth */}
                                    <button
                                        onClick={loginWithGoogle}
                                        className="rounded-full hover:bg-gray-100 p-1 transition"
                                    >
                                        <FcGoogle size={40} />
                                    </button>
                                </div>
                            </div>}
                    </div>
                </div>
            )}
        </>
    );
}
