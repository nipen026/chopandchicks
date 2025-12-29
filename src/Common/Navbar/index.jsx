"use client";

import Image from "next/image";
import { FiSearch } from "react-icons/fi";
import { HiOutlineHome } from "react-icons/hi";
import { BsReceiptCutoff } from "react-icons/bs";
import { AiOutlineShopping } from "react-icons/ai";
import { FaArrowRight, FaLocationDot } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import { LuUserRound } from "react-icons/lu";
import { RxHamburgerMenu } from "react-icons/rx";

import Link from "next/link";
import { use, useEffect, useState } from "react";

import SignupPopup from "../../Components/SignupPopup";
import OtpVerificationModal from "../../Components/OtpVerificationModal";
import LoginModal from "../../Components/LoginModal";
import ForgotPasswordModal from "../../Components/ForgotPasswordModal/ForgotPasswordModal";
import CongratulationModal from "../../Components/CongrarulationModal";
import CreateAccountModal from "../../Components/CreateAccountPopup";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function Navbar() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [isOtp, setIsOtp] = useState(false);
    const [isLogin, setIsLogin] = useState(false);
    const [isForgot, setIsForgot] = useState(false);
    const [isLast, setIsLast] = useState(false);
    const [token, setToken] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState();
    const [createAccountModal, setCreateAccountModal] = useState(false);
    const [location, setLocation] = useState({
        city: "Detecting...",
        address: "",
    });

    const [openMenu, setOpenMenu] = useState(false);
    const [showMobileSearch, setShowMobileSearch] = useState(false);

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    useEffect(() => {
        const loginParam = searchParams.get("login");
        if (loginParam === "true") {
            setIsLogin(true);

            // Remove the query param without refreshing
            const newParams = new URLSearchParams(searchParams.toString());
            newParams.delete("login");

            router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
        }
    }, [searchParams]);
    // 🟢 Auto-refresh token after login
    useEffect(() => {
        const handleStorageChange = () => {
            setToken(localStorage.getItem("auth-token"));
        };

        window.addEventListener("storage", handleStorageChange);

        // First load
        handleStorageChange();

        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);
    useEffect(() => {
        if (!navigator.geolocation) {
            setLocation({
                city: "Location not supported",
                address: "",
            });
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                try {
                    // Reverse geocoding using OpenStreetMap
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                    );

                    const data = await res.json();

                    const city =
                        data.address.city ||
                        data.address.town ||
                        data.address.village ||
                        data.address.state ||
                        "Unknown location";

                    const address = data.display_name;

                    setLocation({
                        city,
                        address,
                    });
                } catch (error) {
                    console.error("Location fetch failed", error);
                    setLocation({
                        city: "Unable to fetch",
                        address: "",
                    });
                }
            },
            (error) => {
                console.error("Geolocation error", error);
                setLocation({
                    city: "Permission denied",
                    address: "",
                });
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
            }
        );
    }, []);
    useEffect(() => {
        if (!token && pathname === "/cart") {
            // optional: remember where user wanted to go
            sessionStorage.setItem("redirectAfterLogin", "/cart");

            // open login modal
            setIsLogin(true);

            // redirect user to home page
            router.replace("/", { scroll: false });
        }
    }, [pathname, token, router]);

    // 🟢 Sidebar animation
    const sidebarClass = openMenu
        ? "translate-x-0"
        : "-translate-x-full";
    console.log(token, "token");

    return (
        <div className="z-[100] sticky container mt-5 top-0">
            {/* MAIN NAVBAR */}
            <div className="w-full bg-white shadow-md py-3 px-4 md:px-6 md:rounded-full rounded-2xl">
                <div className="flex items-center justify-between gap-6">
                    {/* LEFT */}
                    <div className="flex items-center gap-4 flex-shrink-0">
                        {/* Hamburger */}
                        <button
                            className="md:hidden text-2xl"
                            onClick={() => setOpenMenu(true)}
                        >
                            <RxHamburgerMenu />
                        </button>

                        {/* Logo */}
                        <Link href="/">
                            <Image
                                src="/assets/header_logo.png"
                                width={60}
                                height={60}
                                alt="Chop & Chicks"
                                draggable={false}
                                className="rounded-full"
                            />
                        </Link>

                        {/* Mobile location */}
                        <div className="block lg:hidden">
                            <div className="flex items-center gap-1 text-black font-medium text-sm mt-2">
                                <FaLocationDot className="text-red-600" />
                                <span>{location.city}</span>
                                <span className="text-xs">▼</span>
                            </div>
                        </div>


                        {/* Desktop location */}
                        <div className="hidden lg:block">
                            <div className="flex items-center gap-1 text-black font-medium">
                                <FaLocationDot className="text-red-600" />
                                <span>{location.city}</span>
                                <span className="text-sm">▼</span>
                            </div>
                            <p className="text-xs text-gray-500 w-[220px] line-clamp-2">
                                {location.address || "Fetching your address..."}
                            </p>
                        </div>

                    </div>

                    {/* SEARCH BAR DESKTOP */}
                    <div className="hidden md:flex items-center bg-gray-100 rounded-lg border-2 px-4 py-2 w-full max-w-md">
                        <input
                            type="text"
                            placeholder="Search for any delicious product"
                            className="flex-1 bg-transparent outline-none text-sm"
                        />
                        <FiSearch className="text-gray-600 text-lg" />
                    </div>

                    {/* Mobile search icon */}
                    <button
                        className="md:hidden text-2xl text-black"
                        onClick={() => setShowMobileSearch(!showMobileSearch)}
                    >
                        <FiSearch />
                    </button>

                    {/* RIGHT SECTION – Desktop */}
                    <div className="hidden lg:flex items-center gap-8">
                        <Link
                            href="/"
                            className={`flex items-center gap-2 hover:text-primary ${pathname === "/" ? "text-primary font-medium" : "text-black"}`}>
                            <HiOutlineHome className="text-xl" />
                            <span>Home</span>
                        </Link>

                        <div className={`flex items-center hover:text-primary cursor-pointer gap-2 ${pathname === "/OrderDetails" ? "text-primary font-medium" : "text-black"
                            }`} onClick={() => router.push("/OrderDetails")}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.10009 12.9667H14.9M9.10009 9.10009H14.9M9.10009 16.8333H12.0001M2.3335 18.7666V5.23346M21.6666 18.7666V5.23346M18.7666 15.8667C18.7666 18.6004 18.7666 19.9682 17.917 20.8169C17.0682 21.6666 15.7004 21.6666 12.9667 21.6666H11.0334C8.2997 21.6666 6.93188 21.6666 6.08315 20.8169C5.23346 19.9682 5.23346 18.6004 5.23346 15.8667V12.0001M5.23346 8.13343C5.23346 5.39973 5.23346 4.03191 6.08315 3.18319C6.93188 2.3335 8.2997 2.3335 11.0334 2.3335H12.9667C15.7004 2.3335 17.0682 2.3335 17.917 3.18319C18.7666 4.03191 18.7666 5.39973 18.7666 8.13343V12.0001" stroke={pathname === "/OrderDetails" ? "#ED0213" : "#000"} stroke-width="1.44998" stroke-linecap="round" />
                            </svg>

                            <span>Orders</span>
                        </div>

                        <div className={`flex items-center hover:text-primary gap-2 cursor-pointer ${pathname === "/cart" ? "text-primary font-medium" : "text-black"}`} onClick={() => router.push("/cart")}>
                            <AiOutlineShopping className="text-xl" />
                            <span>Cart</span>
                        </div>

                        {token ? (
                            <div
                                className={`flex items-center gap-2 cursor-pointer ${pathname === "/userProfile" ? "text-primary font-medium" : "text-black"
                                    }`}
                                onClick={() => router.push("/userProfile")}
                            >
                                <LuUserRound className="text-xl" />
                                <span>Profile</span>
                            </div>
                        ) : (
                            <button
                                className="flex items-center gap-2 bg-red-600 text-white ps-4 pe-1 py-1 rounded-full font-medium"
                                onClick={() => setIsLogin(true)}
                            >
                                Login
                                <span className="bg-white text-red-600 rounded-full p-2 text-sm">
                                    <FaArrowRight />
                                </span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Mobile Search Bar Expand */}
                <div
                    className={`md:hidden bg-gray-100 max-w-[90%] mx-auto rounded-xl px-4 overflow-hidden transition-all duration-300 ${showMobileSearch ? "max-h-20 py-3 mt-3" : "max-h-0 py-0 mt-0"
                        }`}
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
            <div
                className={`fixed inset-0 bg-black/40 z-50 md:hidden transition-opacity ${openMenu ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                onClick={() => setOpenMenu(false)}
            ></div>

            <div
                className={`fixed left-0 top-0 h-full w-72 bg-white rounded-e-2xl shadow-xl p-5 z-[60] transition-transform duration-300 ${sidebarClass}`}
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold">Menu</h2>
                    <button onClick={() => setOpenMenu(false)}>
                        <IoMdClose className="text-2xl" />
                    </button>
                </div>

                {/* MENU ITEMS */}
                <div className="flex flex-col gap-6 text-black">
                    <Link
                        href="/"
                        className={`flex items-center gap-3 text-lg ${pathname === "/" ? "text-primary font-medium" : "text-black"
                            }`}
                        onClick={() => setOpenMenu(false)}
                    >
                        <HiOutlineHome className="text-2xl" />
                        Home
                    </Link>

                    <div className={`flex items-center gap-3 text-lg ${pathname === "/OrderDetails" ? "text-primary font-medium" : "text-black"
                        }`} onClick={() => router.push("/OrderDetails")}>
                        <BsReceiptCutoff className="text-2xl" />
                        Orders
                    </div>

                    <div className={`flex  ${pathname === "/cart" ? "text-primary font-medium" : "text-black"} items-center gap-3 text-lg`} onClick={() => {
                        setOpenMenu(false);
                        router.push("/cart");
                    }}>
                        <AiOutlineShopping className="text-2xl" />
                        Cart
                    </div>

                    {token ? (
                        <div
                            className={`flex  ${pathname === "/userProfile" ? "text-primary font-medium" : "text-black"} items-center gap-3 text-lg`}
                            onClick={() => {
                                setOpenMenu(false);
                                router.push("/userProfile");
                            }}
                        >
                            <LuUserRound className="text-xl" />
                            <span>Profile</span>
                        </div>
                    ) : (
                        // <button
                        //     onClick={() => {
                        //         setOpenMenu(false);
                        //         setIsLogin(true);
                        //     }}
                        //     className="flex items-center cursor-pointer bg-red-600 text-white px-4 py-2 rounded-full gap-2"
                        // >
                        //     Login
                        //     <span className="bg-white text-red-600 rounded-full p-1 px-2 text-sm">
                        //         <FaArrowRight />
                        //     </span>
                        // </button>
                        <button
                            className="flex  items-center justify-between gap-2 bg-red-600 text-white ps-4 pe-1 py-1 rounded-full font-medium"
                            onClick={() => {
                                setOpenMenu(false);
                                setIsLogin(true);
                            }}
                        >
                            Login
                            <span className="bg-white text-red-600 rounded-full p-2 text-sm">
                                <FaArrowRight />
                            </span>
                        </button>
                    )}
                </div>
            </div>

            {/* MODALS */}
            <SignupPopup
                open={isSignUp}
                onClose={() => setIsSignUp(false)}
                setIsOtp={setIsOtp}
                setPhoneNumber={setPhoneNumber}
                setIsLast={setIsLast}
            />
            <OtpVerificationModal
                open={isOtp}
                onClose={() => setIsOtp(false)}
                setIsLast={setIsLast}
                number={phoneNumber}
                setCreateAccountModal={setCreateAccountModal}
            />
            <LoginModal
                open={isLogin}
                onClose={() => setIsLogin(false)}
                setIsSignUp={setIsSignUp}
                setIsForgot={setIsForgot}
            />
            <ForgotPasswordModal
                open={isForgot}
                onClose={() => setIsForgot(false)}
                setIsSignUp={setIsSignUp}
                setIsLogin={setIsLogin}
                setIsLast={setIsLast}
            />
            <CongratulationModal
                open={isLast}
                onClose={() => setIsLast(false)}
                setIsLogin={setIsLogin}
            />
            <CreateAccountModal
                open={createAccountModal}
                onClose={() => setCreateAccountModal(false)}
                setIsLast={setIsLast}
            />
        </div>
    );
}
