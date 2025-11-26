"use client";
import Image from "next/image";
import { FiSearch } from "react-icons/fi";
import { HiOutlineHome } from "react-icons/hi";
import { BsReceiptCutoff } from "react-icons/bs";
import { AiOutlineShopping } from "react-icons/ai";
import { FaArrowRight, FaLocationDot } from "react-icons/fa6";
import SignupPopup from "@/Components/SignupPopup";
import { useState } from "react";
import OtpVerificationModal from "@/Components/OtpVerificationModal";
import LoginModal from "@/Components/LoginModal";
import ForgotPasswordModal from "@/Components/ForgotPasswordModal/ForgotPasswordModal";
import CongratulationModal from "@/Components/CongrarulationModal";
import Link from "next/link";

export default function Navbar() {
    const [isSignUp,setIsSignUp] = useState(false);
    const [isOtp,setIsOtp] = useState(false);
    const [isLogin,setIsLogin] = useState(false);
    const [isForgot,setIsForgot] = useState(false);
    const [isLast,setIsLast] = useState(false);
    return (
        <div className="container mt-5">
            <div className="w-full bg-white shadow-md py-3 px-6 rounded-full">
                <div className=" flex items-center justify-between gap-6">

                    {/* LEFT - Logo + Location */}
                    <div className="flex items-center gap-4 flex-shrink-0">
                        <Link href="/">
                        <Image
                            src="/assets/header_logo.png"
                            width={60}
                            height={60}
                            alt="Chop & Chicks"
                            className="rounded-full"
                        />
                        </Link>
                        <div>
                            <div className="flex items-center gap-1 text-gray-700 font-medium">
                                <FaLocationDot className="text-red-600" />
                                <span>Chennai</span>
                                <span className="text-sm">▼</span>
                            </div>
                            <p className="text-xs text-gray-500">
                                N35, Varalaxmi Mansion, Jeevan Bima Nagar Main Rd, LIC Colony
                            </p>
                        </div>
                    </div>

                    {/* SEARCH BAR */}
                    <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 w-full max-w-md">
                        <input
                            type="text"
                            placeholder="Search for any delicious product"
                            className="flex-1 bg-transparent outline-none text-sm"
                        />
                        <FiSearch className="text-gray-600 text-lg" />
                    </div>

                    {/* RIGHT SECTION */}
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2 text-red-600">
                            <HiOutlineHome className="text-xl" />
                            <span className="font-medium">Home</span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-700">
                            <BsReceiptCutoff className="text-xl" />
                            <span>Orders</span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-700">
                            <AiOutlineShopping className="text-xl" />
                            <span>Cart</span>
                        </div>

                        {/* LOGIN BUTTON */}
                        <button className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full font-medium" onClick={()=>setIsLogin(true)}>
                            Login
                            <span className="bg-white text-red-600 rounded-full p-1 px-2 text-sm"><FaArrowRight /></span>
                        </button>
                    </div>

                </div>
            </div>
            <SignupPopup open={isSignUp} onClose={()=>{setIsSignUp(false)}} setIsOtp={setIsOtp}/>
            <OtpVerificationModal open={isOtp} onClose={()=>{setIsOtp(false);}} setIsLast={setIsLast}/>
            <LoginModal open={isLogin} onClose={()=>{setIsLogin(false);}} setIsSignUp={setIsSignUp} setIsForgot={setIsForgot}/>
            <ForgotPasswordModal open={isForgot} onClose={()=>{setIsForgot(false);}} setIsSignUp={setIsSignUp} setIsLogin={setIsLogin} setIsLast={setIsLast}/>
            <CongratulationModal open={isLast} onClose={()=>{setIsLast(false)}} setIsLogin={setIsLogin}/>
        </div>
    );
}
