"use client";

import { IoArrowBack } from "react-icons/io5";
import { FiMessageSquare } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";
import CancelOrderUI from "../../Components/CancelOrderUI";
import { useState } from "react";

export default function OrderDetails() {
    const [isModalOpen,setIsModalOpen] = useState(false)
    const steps = [
        "Order in progress",
        "Order Assigned",
        "Order on the Way",
        "Order Delivered",
    ];

    const activeStep = 1; // 0,1,2,3 → change dynamically
    return (
        <div className="min-h-screen container bg-[#F6F7FB] flex justify-center py-10 px-4">
            <div className="w-full  bg-white shadow-xl rounded-3xl p-8">

                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3">
                        <button className="border border-[#000000] p-2 rounded-full">
                            <IoArrowBack className="text-xl" />
                        </button>
                        <h1 className="text-2xl font-semibold">Order Details</h1>
                    </div>

                    <button className="flex items-center gap-2 border px-4 py-2 rounded-full text-red-600 border-[#E72343] hover:bg-red-50 transition">
                        <FiMessageSquare className="text-lg" />
                        Chat with us
                    </button>
                </div>

                {/* Order Status */}
                <div className="text-center mb-10 space-y-4">
                    <h2 className="text-xl font-medium">Thank You</h2>
                    <p className="text-gray-600 mt-1">Your Order status is as follows</p>
                    <p className="font-medium mt-1">
                        Order ID: <span className="text-black font-light">#10102416</span>
                    </p>
                </div>

                {/* Status Timeline */}
                <div className="relative px-8 mb-10">
                    {/* Main Line */}
                    <div className="absolute top-3 left-0 w-full h-[3px] bg-gray-300">
                        {/* Progress Line */}
                        <div
                            className="h-full bg-green-500 transition-all duration-300"
                            style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
                        ></div>
                    </div>

                    {/* Steps */}
                    <div className="flex justify-between relative z-10">
                        {steps.map((step, i) => {
                            const isActive = i <= activeStep;

                            return (
                                <div key={i} className="flex flex-col items-center text-center w-24">
                                    {/* Circle */}
                                    <div
                                        className={`w-7 h-7 rounded-full border-2 flex items-center justify-center
                                            ${isActive ? "border-green-500 bg-green-500" : "border-gray-400 bg-white"}
                                        `}
                                    >
                                        {isActive && (
                                            <div className="w-2 h-2 bg-white rounded-full"></div>
                                        )}
                                    </div>

                                    {/* Label */}
                                    <p
                                        className={`text-xs mt-2 ${isActive ? "text-black font-semibold" : "text-gray-400"
                                            }`}
                                    >
                                        {step}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>


                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* LEFT CARD */}
                    <div className="space-y-4">

                        <div className="bg-white border rounded-xl p-5 shadow-sm space-y-3">
                            <div className="flex justify-between text-sm">
                                <p className="font-semibold">Order ID:</p>
                                <p className="text-gray-600">#CC3112980213</p>
                            </div>

                            <div className="flex justify-between items-center text-sm">
                                <p className="font-semibold">Order Status:</p>
                                <span className="bg-white border border-[#26953E] text-green-700 px-10 py-2 rounded-lg text-xs font-medium">
                                    Completed
                                </span>
                            </div>

                            <div className="flex justify-between text-sm">
                                <p className="font-semibold">No. of Items:</p>
                                <p className="text-gray-600">2 Items</p>
                            </div>
                        </div>

                        {/* Customer Details */}
                        <div className="bg-white border rounded-xl p-5 shadow-sm space-y-4">
                            <div className="flex items-center gap-3">
                                <FaUserCircle className="text-4xl text-gray-400" />
                                <div>
                                    <p className="font-semibold">John Walker</p>
                                    <p className="text-gray-500 text-sm">9988771100</p>
                                </div>
                            </div>

                            <div className="border-t pt-3 space-y-3 text-sm">
                                <p className="font-semibold">Payment Method</p>
                                <p className="text-gray-600">Paid via: Cash</p>

                                <p className="font-semibold">Payment Date</p>
                                <p className="text-gray-600">October 29, 2025 at 9:27</p>

                                <p className="font-semibold">Delivery Address</p>
                                <div className="flex gap-2 text-gray-600">
                                    <IoLocationSharp className="text-lg text-red-500 flex-shrink-0" />
                                    <p>
                                        No.25, Paper Street, Chennai – 600 028
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE – Bill Summary */}
                    <div className="bg-white border rounded-xl p-5 shadow-sm">
                        <h3 className="font-semibold flex items-center gap-2 mb-3">
                            <span className="text-xl">🧾</span> Bill Summary
                        </h3>

                        {/* Product List */}
                        <div className="space-y-3">

                            {[1, 2].map((item, i) => (
                                <div
                                    key={i}
                                    className="border rounded-lg p-3 flex gap-3 items-start bg-gray-50"
                                >
                                    <img
                                        src="https://i.ibb.co/QNDdLDR/pngegg-1.png"
                                        alt="item"
                                        draggable={false}
                                        className="w-20 h-20 rounded-lg object-cover"
                                    />

                                    <div className="flex-1 text-sm">
                                        <p className="font-semibold text-gray-900">
                                            Chicken Curry – Medium Piece
                                        </p>
                                        <p className="text-gray-500 text-xs">500 g | Halal | Serves 2</p>

                                        <p className="mt-1 font-semibold">₹220.00
                                            <span className="text-gray-400 line-through text-xs ml-1">
                                                ₹250.00
                                            </span>
                                        </p>
                                        <p className="text-xs text-gray-600">Quantity 1</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Bill Summary Totals */}
                        <div className="border-t mt-4 pt-4 text-sm space-y-2">
                            <div className="flex justify-between">
                                <p>Item Total</p>
                                <p className="font-medium">₹180.00</p>
                            </div>

                            <div className="flex justify-between">
                                <p>Delivery Charge</p>
                                <p className="font-medium">₹24.00</p>
                            </div>

                            <div className="flex justify-between font-semibold text-lg mt-3">
                                <p>Grand Total</p>
                                <p>₹220.00</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-center gap-4 mt-10">
                    <button disabled className="px-6 py-3 btn-gradient text-white rounded-lg border border-gray-400 hover:bg-gray-100">
                        Track Order
                    </button>
                    <button className="px-6 py-3 rounded-lg btn-gradient text-white hover:bg-red-700">
                        Download Invoice
                    </button>
                    <button onClick={()=>setIsModalOpen(true)} className="px-6 py-3 btn-gradient text-white rounded-lg border border-gray-400 hover:bg-gray-100">
                        Cancel Order
                    </button>
                </div>
                <CancelOrderUI open={isModalOpen} onClose={()=>setIsModalOpen(false)}/>
            </div>
        </div>
    );
}
