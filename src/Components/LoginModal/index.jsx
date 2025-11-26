"use client";
import { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";    // for google icon
import { FaWhatsapp } from "react-icons/fa"; // for whatsapp icon
import Image from "next/image";

export default function LoginModal({ open, onClose,setIsSignUp , setIsForgot}) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (open) setTimeout(() => setShow(true), 10);
        else setShow(false);
    }, [open]);

    return (
        <>
            {open && (
                <div
                    className={`fixed inset-0 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm z-50
          transition-opacity duration-300 ${show ? "opacity-100" : "opacity-0"}`}
                >
                    {/* Login Card */}
                    <div
                        className={`bg-white w-full max-w-md p-8 rounded-2xl shadow-lg border
            shadow-[0_0_40px_5px_rgba(255,0,0,0.18)] relative transform
            transition-all duration-300 ease-out
            ${show ? "scale-100 translate-y-0 opacity-100" : "scale-75 translate-y-5 opacity-0"}`}
                    >
                        {/* Close Btn */}
                        <button
                            onClick={onClose}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
                        >
                            ✕
                        </button>

                        {/* Heading */}
                        <h2 className="text-center text-3xl font-semibold text-gray-800">Login</h2>
                        <p className="text-center text-gray-500 text-sm mb-6">
                            Login to continue to our website
                        </p>

                        {/* Email */}
                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-800 mb-1">Email</label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full border border-gray-300 rounded-lg px-4 py-3
                focus:border-red-500 outline-none transition"
                            />
                        </div>

                        {/* Password */}
                        <div className="mb-5">
                            <label className="block text-sm font-semibold text-gray-800 mb-1">Password</label>
                            <input
                                type="password"
                                placeholder="Enter password"
                                className="w-full border border-gray-300 rounded-lg px-4 py-3
                focus:border-red-500 outline-none transition"
                            />
                        </div>
                        <div className="text-right text-sm text-secondary font-medium mb-4 cursor-pointer" onClick={()=>{onClose();setIsForgot(true)}}>
                            <p className="" >Forgot Password?</p>
                        </div>
                        {/* Login Button */}
                        <div className="flex justify-center">
                            <button className="w-[264px]   bg-red-600 hover:bg-red-700 text-white font-semibold
            py-3 rounded-full transition mb-4">
                                Login
                            </button>
                        </div>
                        {/* Divider */}

                        <div className="text-center mb-3">
                            <p>Don’t have an account? <span className="text-secondary cursor-pointer" onClick={()=>{setIsSignUp(true);onClose()}}>Sign up</span></p>
                        </div>
                        {/* Google login */}
                        <div className="flex items-center justify-center gap-6">
                            <button className=" rounded-full transition">
                               <Image src="/assets/call.png" width={40} height={22} alt="call"/>
                            </button>
                            <button className=" rounded-full hover:bg-gray-100 transition ">
                                <FcGoogle size={40} />
                            </button>

                            {/* WhatsApp Login */}

                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
