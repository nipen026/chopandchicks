"use client";

import React, { useState } from "react";
import { FaGooglePay, FaApplePay } from "react-icons/fa";
import { SiVisa, SiMastercard } from "react-icons/si";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

export default function PaymentMethod() {
    const [selectedMethod, setSelectedMethod] = useState("");
    const [openNetBanking, setOpenNetBanking] = useState(true);
    const [openCard, setOpenCard] = useState(false);

    const banks = ["HDFC Bank", "ICICI Bank", "SBI Bank", "Axis Bank", "Kotak Bank"];
    const cards = ["Visa", "MasterCard", "Rupay"];

    return (
        <div className="w-full bg-white shadow-lg rounded-2xl p-8">
            <h2 className="text-xl font-semibold mb-4">Payment Method</h2>

            {/* ------------ NET BANKING --------------- */}
            <div className="border rounded-lg overflow-hidden">
                <button
                    onClick={() => setOpenNetBanking(!openNetBanking)}
                    className="flex justify-between items-center w-full px-4 py-3 bg-[#FFF6F6] text-black font-medium"
                >
                    <div className="flex items-center gap-3">
                        <input
                            type="radio"
                            checked={selectedMethod === "netbanking"}
                            onChange={() => setSelectedMethod("netbanking")}
                        />
                        Net Banking
                    </div>

                    {openNetBanking ? (
                        <IoIosArrowUp className="text-xl" />
                    ) : (
                        <IoIosArrowDown className="text-xl" />
                    )}
                </button>

                {openNetBanking && (
                    <div className="p-4 border-t space-y-3 text-sm text-gray-700">
                        {banks.map((bank, i) => (
                            <label key={i} className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="radio"
                                    name="bank"
                                    onChange={() => setSelectedMethod(bank)}
                                    checked={selectedMethod === bank}
                                />
                                {bank}
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {/* ------------- UPI OPTIONS ---------------- */}
            <div className="mt-4 space-y-4 text-sm">
                <label className="flex items-center gap-3 cursor-pointer">
                    <input
                        type="radio"
                        checked={selectedMethod === "gpay"}
                        onChange={() => setSelectedMethod("gpay")}
                    />
                    <FaGooglePay className="text-3xl" />
                    Google Pay
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                    <input
                        type="radio"
                        checked={selectedMethod === "visa"}
                        onChange={() => setSelectedMethod("visa")}
                    />
                    <SiVisa className="text-3xl text-blue-500" />
                    Visa
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                    <input
                        type="radio"
                        checked={selectedMethod === "mastercard"}
                        onChange={() => setSelectedMethod("mastercard")}
                    />
                    <SiMastercard className="text-3xl text-red-600" />
                    MasterCard
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                    <input
                        type="radio"
                        checked={selectedMethod === "applepay"}
                        onChange={() => setSelectedMethod("applepay")}
                    />
                    <FaApplePay className="text-3xl" />
                    Apple Pay
                </label>
            </div>

            {/* ---------- OTHER BANKS DROPDOWN ---------- */}
            <div className="mt-6 border-t pt-4">
                <p className="text-gray-800 text-sm font-medium">Other Banks</p>

                <select
                    className="w-full border rounded-lg p-3 mt-2 bg-gray-50"
                    onChange={(e) => setSelectedMethod(e.target.value)}
                >
                    <option>Select Bank</option>
                    {banks.map((bank, i) => (
                        <option key={i} value={bank}>{bank}</option>
                    ))}
                </select>
            </div>

            {/* ------------- CREDIT / DEBIT CARDS -------------- */}
            <div className="mt-6 border rounded-lg overflow-hidden">
                <button
                    onClick={() => setOpenCard(!openCard)}
                    className="flex justify-between w-full px-4 py-3 bg-[#FFF6F6] font-medium text-black"
                >
                    <div className="flex items-center gap-3">
                        <input
                            type="radio"
                            checked={selectedMethod === "card"}
                            onChange={() => setSelectedMethod("card")}
                        />
                        Credit / Debit Card
                    </div>

                    {openCard ? <IoIosArrowUp /> : <IoIosArrowDown />}
                </button>

                {openCard && (
                    <div className="p-4 border-t space-y-3">
                        <input
                            type="text"
                            placeholder="Card Number"
                            className="w-full p-2 border rounded-lg"
                        />
                        <div className="flex gap-4">
                            <input
                                type="text"
                                placeholder="MM/YY"
                                className="w-1/2 p-2 border rounded-lg"
                            />
                            <input
                                type="text"
                                placeholder="CVV"
                                className="w-1/2 p-2 border rounded-lg"
                            />
                        </div>

                        <input
                            type="text"
                            placeholder="Name on Card"
                            className="w-full p-2 border rounded-lg"
                        />
                    </div>
                )}
            </div>

            {/* ----------- COD / UPI ------------ */}
            <div className="space-y-4 mt-6">
                <label className="flex items-center gap-3 cursor-pointer">
                    <input
                        type="radio"
                        checked={selectedMethod === "cod"}
                        onChange={() => setSelectedMethod("cod")}
                    />
                    Cash on Delivery
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                    <input
                        type="radio"
                        checked={selectedMethod === "upi"}
                        onChange={() => setSelectedMethod("upi")}
                    />
                    Pay Using UPI
                </label>
            </div>
        </div>
    );
}
