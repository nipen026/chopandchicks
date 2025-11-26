"use client";

import Image from "next/image";
import { useState } from "react";
import { FaChevronLeft } from "react-icons/fa6";
import { HiMinus, HiPlus } from "react-icons/hi";
import { IoClose, } from "react-icons/io5";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
export default function CartSidebar({ open, onClose }) {
    const [openDropdown, setOpenDropdown] = useState(true);
    const [items, setItems] = useState([
        { id: 1, title: "Chicken Curry - Medium Piece", qty: 2, price: 220, image: "/assets/product_card.png" },
        { id: 2, title: "Chicken Curry - Medium Piece", qty: 2, price: 220, image: "/assets/product_card.png" },
    ]);

    const increaseQty = (id) => {
        setItems(prev => prev.map(item => item.id === id ? { ...item, qty: item.qty + 1 } : item));
    };

    const decreaseQty = (id) => {
        setItems(prev =>
            prev.map(item =>
                item.id === id && item.qty > 1 ? { ...item, qty: item.qty - 1 } : item
            )
        );
    };

    const removeItem = (id) => {
        setItems(prev => prev.filter(item => item.id !== id));
    };

    const itemTotal = items.reduce((sum, item) => sum + item.qty * item.price, 0);
    const taxes = 14;
    const delivery = 24;
    const packing = 14;
    const grandTotal = itemTotal + taxes + delivery + packing;

    return (
        <>
            {/* Overlay */}
            {open && (
                <div className="fixed inset-0 bg-black/60 z-40" onClick={onClose}></div>
            )}

            {/* Cart Drawer */}
            <div className={`fixed right-0 top-0 w-full sm:w-[550px] h-full bg-white rounded-l-2xl 
        shadow-xl z-50 transform transition-transform duration-300 
        ${open ? "translate-x-0" : "translate-x-full"}`}>

                {/* Header */}
                <div className="bg-[#FFBABC] h-16 flex items-center   px-5 rounded-t-2xl">
                    <FaChevronLeft size={26} className="w-[50px] cursor-pointer" onClick={onClose} />
                    <h2 className="w-full text-lg text-center font-bold text-[#494949]">Order Summary</h2>
                    {/* <IoClose size={26} className="cursor-pointer" onClick={onClose} /> */}
                </div>

                {/* Items List */}
                <div className="p-4 space-y-4 overflow-y-auto h-[62%]">
                    {items.map(item => (
                        <div key={item.id} className="flex items-start gap-3 bg-white shadow-md p-3 rounded-xl border relative">

                            {/* Remove item */}
                            <IoClose size={20} className="absolute right-3 top-3 cursor-pointer"
                                onClick={() => removeItem(item.id)} />

                            <Image src={item.image} width={80} height={80}
                                alt="product" className="rounded-md object-cover" />

                            <div className="flex items-end">
                                <div className="flex-1 text-gray-700 ">
                                    <h3 className="font-semibold">{item.title}</h3>
                                    <p className="text-sm">500g | 4-8 Pieces | Serves 2</p>
                                    <p className="font-bold text-red-600 mt-1">₹{item.price}.00</p>
                                </div>

                                {/* Quantity Counter */}
                                <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-full ">
                                    <button onClick={() => decreaseQty(item.id)}
                                        className="bg-red-500 text-white p-1 rounded-full"><HiMinus /></button>
                                    <span className="px-2 font-semibold">{item.qty}</span>
                                    <button onClick={() => increaseQty(item.id)}
                                        className="bg-red-500 text-white p-1 rounded-full"><HiPlus /></button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Add More */}
                    <div className="flex justify-center mt-4">
                        <button className="w-[50%]  bg-[#FEE2E2] text-primary font-medium py-2 rounded-lg">
                            Add More Items
                        </button>
                    </div>
                </div>

                {/* Summary */}
                <div className="px-5 py-3 border-t text-[#494949] select-none">

                    {/* Header Toggle */}
                    <div
                        className="flex justify-between items-center text-lg font-semibold cursor-pointer"
                        onClick={() => setOpenDropdown(!openDropdown)}
                    >
                        <span>Grand Total</span>
                        <div className="flex items-center gap-2 font-bold text-xl">
                            <span>₹{grandTotal}.00</span>
                            {openDropdown ? <IoIosArrowUp size={20} /> : <IoIosArrowDown size={20} />}
                        </div>
                    </div>

                    {/* Dropdown Items (Collapsed by default) */}
                    <div
                        className={`overflow-hidden transition-all text-[#494949] duration-300 
                ${openDropdown ? "max-h-40 mt-3" : "max-h-0"}`}
                    >

                        <div className="flex justify-between  py-1">
                            <span>Item Total</span>
                            <span>₹{itemTotal}.00</span>
                        </div>

                        <div className="flex justify-between  py-1">
                            <span>Taxes</span>
                            <span>₹{taxes}.00</span>
                        </div>

                        <div className="flex justify-between  py-1">
                            <span>Delivery Charge</span>
                            <span>₹{delivery}.00</span>
                        </div>

                        <div className="flex justify-between  py-1">
                            <span>Packing Charge</span>
                            <span>₹{packing}.00</span>
                        </div>

                    </div>
                </div>

                {/* Bottom Checkout Button */}
                <div className="flex mx-3" >
                    <div className="w-full text-center shadow-lg py-3 font-semibold bg-white border">
                        Total : ₹{grandTotal}.00
                    </div>
                    <button className="w-full bg-gradient-to-r from-red-900 to-red-600 hover:bg-red-700 text-white py-3 font-semibold">
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </>
    );
}
