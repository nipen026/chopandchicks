"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";

import { FiSearch } from "react-icons/fi";
import { HiOutlineHome } from "react-icons/hi";
import { BsReceiptCutoff } from "react-icons/bs";
import { AiOutlineShopping } from "react-icons/ai";
import { FaArrowRight, FaLocationDot } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import { LuUserRound } from "react-icons/lu";
import { RxHamburgerMenu } from "react-icons/rx";

import SignupPopup from "../../Components/SignupPopup";
import OtpVerificationModal from "../../Components/OtpVerificationModal";
import LoginModal from "../../Components/LoginModal";
import ForgotPasswordModal from "../../Components/ForgotPasswordModal/ForgotPasswordModal";
import CongratulationModal from "../../Components/CongrarulationModal";
import CreateAccountModal from "../../Components/CreateAccountPopup";
import LoginQueryHandler from "../../Components/LoginQueryHandler";
import { supabase } from "../../lib/supabaseClient";

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();

    const [isSignUp, setIsSignUp] = useState(false);
    const [isOtp, setIsOtp] = useState(false);
    const [isLogin, setIsLogin] = useState(false);
    const [isForgot, setIsForgot] = useState(false);
    const [isLast, setIsLast] = useState(false);
    const [createAccountModal, setCreateAccountModal] = useState(false);
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState();
    const [openMenu, setOpenMenu] = useState(false);
    const [showMobileSearch, setShowMobileSearch] = useState(false);

    // ✅ SEARCH STATES
    const [searchQuery, setSearchQuery] = useState("");
    const [mobileSearchQuery, setMobileSearchQuery] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [showMobileDropdown, setShowMobileDropdown] = useState(false);
    const [filteredProducts, setFilteredProducts] = useState([]);

    const searchRef = useRef(null);
    const mobileSearchRef = useRef(null);

    const [location, setLocation] = useState({
        city: "Detecting...",
        address: "",
    });

    /* 🔐 Auth sync */
    useEffect(() => {
        const syncAuth = () => {
            setToken(localStorage.getItem("auth-token"));
        };

        syncAuth();
        window.addEventListener("auth-change", syncAuth);
        return () => window.removeEventListener("auth-change", syncAuth);
    }, []);

    /* 🔁 Redirect cart → login */
    useEffect(() => {
        if (!token && pathname === "/cart") {
            sessionStorage.setItem("redirectAfterLogin", "/cart");
            setIsLogin(true);
            router.replace("/", { scroll: false });
        }
    }, [pathname, token]);

    /* 📍 Location */
    useEffect(() => {
        if (!navigator.geolocation) return;

        navigator.geolocation.getCurrentPosition(
            async ({ coords }) => {
                try {
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}`
                    );
                    const data = await res.json();

                    setLocation({
                        city:
                            data.address.city ||
                            data.address.town ||
                            data.address.village ||
                            "Unknown",
                        address: data.display_name,
                    });
                } catch {
                    setLocation({ city: "Unavailable", address: "" });
                }
            },
            () => setLocation({ city: "Permission denied", address: "" })
        );
    }, []);

    // ✅ FETCH PRODUCTS
    useEffect(() => {
        const fetchProducts = async () => {
            const { data, error } = await supabase.from("product").select("*");
            if (!error) setProducts(data);
        };
        fetchProducts();
    }, []);

    // ✅ FILTER PRODUCTS BASED ON SEARCH (DESKTOP)
    useEffect(() => {
        if (searchQuery.trim() === "") {
            setFilteredProducts([]);
            setShowDropdown(false);
            return;
        }

        const filtered = products.filter((product) =>
            product.name?.toLowerCase().includes(searchQuery.toLowerCase())
        );

        setFilteredProducts(filtered);
        setShowDropdown(true);
    }, [searchQuery, products]);

    // ✅ FILTER PRODUCTS BASED ON SEARCH (MOBILE)
    useEffect(() => {
        if (mobileSearchQuery.trim() === "") {
            setFilteredProducts([]);
            setShowMobileDropdown(false);
            return;
        }

        const filtered = products.filter((product) =>
            product.name?.toLowerCase().includes(mobileSearchQuery.toLowerCase())
        );

        setFilteredProducts(filtered);
        setShowMobileDropdown(true);
    }, [mobileSearchQuery, products]);

    // ✅ CLOSE DROPDOWN WHEN CLICKING OUTSIDE
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
            if (mobileSearchRef.current && !mobileSearchRef.current.contains(event.target)) {
                setShowMobileDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // ✅ HANDLE PRODUCT SELECTION
    const handleProductClick = (productId) => {
        setShowDropdown(false);
        setShowMobileDropdown(false);
        setSearchQuery("");
        setMobileSearchQuery("");
        router.push(`/productDetails/${productId}`);
    };

    const sidebarClass = openMenu ? "translate-x-0" : "-translate-x-full";

    return (
        <div className="z-[100] sticky top-0 container mt-5">
            <Suspense fallback={null}>
                <LoginQueryHandler onLogin={setIsLogin} />
            </Suspense>

            <div className="w-full bg-white shadow-md py-3 px-4 md:px-6 md:rounded-full rounded-2xl">
                <div className="flex items-center justify-between gap-6">
                    {/* LEFT */}
                    <div className="flex items-center gap-4 flex-shrink-0">
                        <button className="md:hidden text-2xl" onClick={() => setOpenMenu(true)}>
                            <RxHamburgerMenu />
                        </button>

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

                    {/* ✅ SEARCH BAR DESKTOP WITH DROPDOWN */}
                    <div className="hidden md:flex relative w-full max-w-md" ref={searchRef}>
                        <div className="flex items-center bg-gray-100 rounded-lg border-2 px-4 py-2 w-full">
                            <input
                                type="text"
                                placeholder="Search for any delicious product"
                                className="flex-1 bg-transparent outline-none text-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => searchQuery && setShowDropdown(true)}
                            />
                            <FiSearch className="text-gray-600 text-lg" />
                        </div>

                        {/* ✅ DROPDOWN */}
                        {showDropdown && (
                            <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto z-50">
                                {filteredProducts.length > 0 ? (
                                    filteredProducts.map((product) => (
                                        <div
                                            key={product.id}
                                            className="px-4 py-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                                            onClick={() => handleProductClick(product.id)}
                                        >
                                            <div className="flex items-center gap-3">
                                                {product.image && (
                                                    <Image
                                                        src={product.image.image_url}
                                                        width={40}
                                                        height={40}
                                                        alt={product.name}
                                                        className="rounded object-cover"
                                                    />
                                                )}
                                                <div>
                                                    <p className="font-medium text-sm">{product.name}</p>
                                                    {product.sale_price && (
                                                        <p className="text-xs text-gray-500">₹{product.sale_price}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-4 py-3 text-center text-gray-500 text-sm">
                                        No products found
                                    </div>
                                )}
                            </div>
                        )}
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
                            className={`flex items-center gap-2 hover:text-primary ${
                                pathname === "/" ? "text-primary font-medium" : "text-black"
                            }`}
                        >
                            <HiOutlineHome className="text-xl" />
                            <span>Home</span>
                        </Link>

                        <Link
                            href="/OrderDetails"
                            className={`group flex items-center gap-2 transition-colors ${
                                pathname === "/OrderDetails"
                                    ? "text-primary font-medium"
                                    : "text-black hover:text-primary"
                            }`}
                        >
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M9.10009 12.9667H14.9M9.10009 9.10009H14.9M9.10009 16.8333H12.0001M2.3335 18.7666V5.23346M21.6666 18.7666V5.23346M18.7666 15.8667C18.7666 18.6004 18.7666 19.9682 17.917 20.8169C17.0682 21.6666 15.7004 21.6666 12.9667 21.6666H11.0334C8.2997 21.6666 6.93188 21.6666 6.08315 20.8169C5.23346 19.9682 5.23346 18.6004 5.23346 15.8667V12.0001M5.23346 8.13343C5.23346 5.39973 5.23346 4.03191 6.08315 3.18319C6.93188 2.3335 8.2997 2.3335 11.0334 2.3335H12.9667C15.7004 2.3335 17.0682 2.3335 17.917 3.18319C18.7666 4.03191 18.7666 5.39973 18.7666 8.13343V12.0001"
                                    stroke="currentColor"
                                    strokeWidth="1.45"
                                    strokeLinecap="round"
                                    className="transition-colors"
                                />
                            </svg>
                            <span>Orders</span>
                        </Link>

                        <div
                            className={`flex items-center hover:text-primary gap-2 cursor-pointer ${
                                pathname === "/cart" ? "text-primary font-medium" : "text-black"
                            }`}
                            onClick={() => router.push("/cart")}
                        >
                            <AiOutlineShopping className="text-xl" />
                            <span>Cart</span>
                        </div>

                        {token ? (
                            <div
                                className={`flex items-center gap-2 cursor-pointer ${
                                    pathname === "/userProfile" ? "text-primary font-medium" : "text-black"
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

                {/* ✅ MOBILE SEARCH BAR WITH DROPDOWN */}
                <div
                    className={`md:hidden bg-gray-100 max-w-[90%] mx-auto rounded-xl px-4 overflow-hidden transition-all duration-300 ${
                        showMobileSearch ? "max-h-96 py-3 mt-3" : "max-h-0 py-0 mt-0"
                    }`}
                    ref={mobileSearchRef}
                >
                    <div className="flex items-center gap-3">
                        <FiSearch className="text-gray-600 text-xl" />
                        <input
                            type="text"
                            placeholder="Search your favorite food..."
                            className="flex-1 bg-transparent outline-none text-sm"
                            value={mobileSearchQuery}
                            onChange={(e) => setMobileSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* ✅ MOBILE DROPDOWN */}
                    {showMobileDropdown && mobileSearchQuery && (
                        <div className="mt-3 bg-white rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map((product) => (
                                    <div
                                        key={product.id}
                                        className="px-3 py-2 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                                        onClick={() => {
                                            handleProductClick(product.id);
                                            setShowMobileSearch(false);
                                        }}
                                    >
                                        <div className="flex items-center gap-2">
                                            {product.image && (
                                                <Image
                                                    src={product.image}
                                                    width={30}
                                                    height={30}
                                                    alt={product.name}
                                                    className="rounded object-cover"
                                                />
                                            )}
                                            <div>
                                                <p className="font-medium text-xs">{product.name}</p>
                                                {product.sale_price && (
                                                    <p className="text-xs text-gray-500">₹{product.sale_price}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="px-3 py-2 text-center text-gray-500 text-xs">
                                    No products found
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* ================= MOBILE SIDEBAR ================= */}
            <div
                className={`fixed inset-0 bg-black/40 z-50 md:hidden transition-opacity ${
                    openMenu ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
                onClick={() => setOpenMenu(false)}
            ></div>

            <div
                className={`fixed left-0 top-0 h-full w-72 bg-white rounded-e-2xl shadow-xl p-5 z-[60] transition-transform duration-300 ${sidebarClass}`}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold">Menu</h2>
                    <button onClick={() => setOpenMenu(false)}>
                        <IoMdClose className="text-2xl" />
                    </button>
                </div>

                <div className="flex flex-col gap-6 text-black">
                    <Link
                        href="/"
                        className={`flex items-center gap-3 text-lg ${
                            pathname === "/" ? "text-primary font-medium" : "text-black"
                        }`}
                        onClick={() => setOpenMenu(false)}
                    >
                        <HiOutlineHome className="text-2xl" />
                        Home
                    </Link>

                    <div
                        className={`flex items-center gap-3 text-lg ${
                            pathname === "/OrderDetails" ? "text-primary font-medium" : "text-black"
                        }`}
                        onClick={() => router.push("/OrderDetails")}
                    >
                        <BsReceiptCutoff className="text-2xl" />
                        Orders
                    </div>

                    <div
                        className={`flex ${
                            pathname === "/cart" ? "text-primary font-medium" : "text-black"
                        } items-center gap-3 text-lg`}
                        onClick={() => {
                            setOpenMenu(false);
                            router.push("/cart");
                        }}
                    >
                        <AiOutlineShopping className="text-2xl" />
                        Cart
                    </div>

                    {token ? (
                        <div
                            className={`flex ${
                                pathname === "/userProfile" ? "text-primary font-medium" : "text-black"
                            } items-center gap-3 text-lg`}
                            onClick={() => {
                                setOpenMenu(false);
                                router.push("/userProfile");
                            }}
                        >
                            <LuUserRound className="text-xl" />
                            <span>Profile</span>
                        </div>
                    ) : (
                        <button
                            className="flex items-center justify-between gap-2 bg-red-600 text-white ps-4 pe-1 py-1 rounded-full font-medium"
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
                setIsLogin={setIsLogin}
                setIsSignUp={setIsSignUp}
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