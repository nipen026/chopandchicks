
"use client";
import Image from "next/image";
import { FiSearch } from "react-icons/fi";
import { HiOutlineHome } from "react-icons/hi";
import { BsReceiptCutoff } from "react-icons/bs";
import { AiOutlineShopping } from "react-icons/ai";
import { FaArrowRight, FaLocationDot } from "react-icons/fa6";
import { CiUser } from "react-icons/ci";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoMdClose } from "react-icons/io";
import SignupPopup from "../../Components/SignupPopup";
import { useState } from "react";
import OtpVerificationModal from "../../Components/OtpVerificationModal";
import LoginModal from "../../Components/LoginModal";
import ForgotPasswordModal from "../../Components/ForgotPasswordModal/ForgotPasswordModal";
import CongratulationModal from "../../Components/CongrarulationModal";
import Link from "next/link";
import { LuUserRound } from "react-icons/lu";

export default function Navbar() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [isOtp, setIsOtp] = useState(false);
    const [isLogin, setIsLogin] = useState(false);
    const [isForgot, setIsForgot] = useState(false);
    const [isLast, setIsLast] = useState(false);
    const [showMobileSearch, setShowMobileSearch] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState()
    const [openMenu, setOpenMenu] = useState(false);
    let authToken = ''
    if (typeof window !== "undefined") {
        authToken = localStorage.getItem('auth-token')
    }

    return (
        <div className="container mt-5 px-3 md:px-0">

            {/* NAVBAR */}
            <div className="w-full bg-white shadow-md py-3 px-4 md:px-6 md:rounded-full rounded-2xl ">
                <div className="flex items-center justify-between gap-6">

                    {/* LEFT */}
                    <div className="flex items-center gap-4 flex-shrink-0">
                        <button
                            className="md:hidden text-2xl"
                            onClick={() => setOpenMenu(true)}
                        >
                            <RxHamburgerMenu />
                        </button>

                        <Link href="/">
                            <Image
                                src="/assets/header_logo.png"
                                width={60}
                                height={60}
                                alt="Chop & Chicks"
                                className="rounded-full"
                            />
                        </Link>

                        <div className="block md:hidden">
                            <div className="flex items-center gap-1 text-gray-700 font-medium text-sm mt-2">
                                <FaLocationDot className="text-red-600" />
                                <span>Chennai</span>
                                <span className="text-xs">▼</span>
                            </div>
                        </div>

                        <div className="hidden md:block">
                            <div className="flex items-center gap-1 text-gray-700 font-medium">
                                <FaLocationDot className="text-red-600" />
                                <span>Chennai</span>
                                <span className="text-sm">▼</span>
                            </div>
                            <p className="text-xs text-gray-500 w-[200px]">
                                N35, Varalaxmi Mansion, Jeevan Bima Nagar Main Rd, LIC Colony
                            </p>
                        </div>
                    </div>

                    {/* SEARCH BAR */}
                    <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 w-full max-w-md">
                        <input
                            type="text"
                            placeholder="Search for any delicious product"
                            className="flex-1 bg-transparent outline-none text-sm"
                        />
                        <FiSearch className="text-gray-600 text-lg" />
                    </div>
                    <button
                        className="md:hidden text-2xl text-gray-700"
                        onClick={() => setShowMobileSearch(!showMobileSearch)}
                    >
                        <FiSearch />
                    </button>


                    {/* RIGHT SECTION - Desktop Only */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-2 text-red-600">
                            <HiOutlineHome className="text-xl" />
                            <span className="font-medium">Home</span>
                        </Link>

                        <div className="flex items-center gap-2 text-gray-700 cursor-pointer">
                            <BsReceiptCutoff className="text-xl" />
                            <span>Orders</span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-700 cursor-pointer">
                            <AiOutlineShopping className="text-xl" />
                            <span>Cart</span>
                        </div>
                        {authToken ?
                            <div className="flex items-center gap-2 text-gray-700 cursor-pointer" onClick={() => { window.location.href = '/userProfile' }}>
                                <LuUserRound className="text-xl font-bold" />
                                <span>Profile</span>
                            </div>
                            :
                            <button
                                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full font-medium"
                                onClick={() => setIsLogin(true)}
                            >
                                Login
                                <span className="bg-white text-red-600 rounded-full p-1 px-2 text-sm">
                                    <FaArrowRight />
                                </span>
                            </button>
                        }
                    </div>
                </div>
                <div
                    className={`
        md:hidden bg-gray-100 max-w-[90%] mx-auto rounded-xl px-4 overflow-hidden transition-all duration-300
        ${showMobileSearch ? "max-h-20 py-3 mt-3" : "max-h-0 py-0 mt-0"}
    `}
                >
                    <div className="flex items-center gap-3">
                        <FiSearch className="text-gray-600 text-xl" />
                        <input
                            type="text"
                            placeholder="Search your favorite food..."
                            className="flex-1 bg-transparent outline-none text-sm"
                        />
                    </div>
                </div>
            </div>

            {/* ================= MOBILE SIDEBAR ================= */}
            {openMenu && (
                <div
                    className="fixed inset-0 bg-black/40 z-50 md:hidden"
                    onClick={() => setOpenMenu(false)}
                >
                    <div
                        className="
                            absolute left-0 top-0 h-full w-72 bg-white shadow-xl p-5
                            transform transition-all duration-300
                            translate-x-0
                        "
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-semibold">Menu</h2>
                            <button onClick={() => setOpenMenu(false)}>
                                <IoMdClose className="text-2xl" />
                            </button>
                        </div>

                        {/* MENU ITEMS */}
                        <div className="flex flex-col gap-6 text-gray-700">

                            <Link
                                href="/"
                                className="flex items-center gap-3 text-red-600 text-lg"
                                onClick={() => setOpenMenu(false)}
                            >
                                <HiOutlineHome className="text-2xl" />
                                Home
                            </Link>

                            <div className="flex items-center gap-3 text-lg">
                                <BsReceiptCutoff className="text-2xl" />
                                Orders
                            </div>

                            <div className="flex items-center gap-3 text-lg">
                                <AiOutlineShopping className="text-2xl" />
                                Cart
                            </div>
                            {authToken ?
                                <div className="flex items-center gap-2 text-gray-700 cursor-pointer" onClick={() => { window.location.href = '/userProfile' }}>
                                    <LuUserRound className="text-xl font-bold" />
                                    <span>Profile</span>
                                </div>
                                :
                                <button
                                    onClick={() => {
                                        setOpenMenu(false);
                                        setIsLogin(true);
                                    }}
                                    className="flex items-center cursor-pointer bg-red-600 text-white px-4 py-2 rounded-full gap-2"
                                >
                                    Login
                                    <span className="bg-white text-red-600 rounded-full p-1 px-2 text-sm">
                                        <FaArrowRight />
                                    </span>
                                </button>}
                        </div>
                    </div>
                </div>
            )}

            {/* MODALS */}
            <SignupPopup open={isSignUp} onClose={() => setIsSignUp(false)} setIsOtp={setIsOtp} setPhoneNumber={setPhoneNumber} />
            <OtpVerificationModal open={isOtp} onClose={() => setIsOtp(false)} setIsLast={setIsLast} number={phoneNumber} />
            <LoginModal open={isLogin} onClose={() => setIsLogin(false)} setIsSignUp={setIsSignUp} setIsForgot={setIsForgot} />
            <ForgotPasswordModal open={isForgot} onClose={() => setIsForgot(false)} setIsSignUp={setIsSignUp} setIsLogin={setIsLogin} setIsLast={setIsLast} />
            <CongratulationModal open={isLast} onClose={() => setIsLast(false)} setIsLogin={setIsLogin} />
        </div>
    );
}
