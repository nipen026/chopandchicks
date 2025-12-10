"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { FaChevronLeft } from "react-icons/fa6";
import { HiMinus, HiPlus } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { supabase } from "../../lib/supabaseClient";

export default function CartSidebar({ open, onClose }) {
    const [openDropdown, setOpenDropdown] = useState(true);
    const [items, setItems] = useState([]);
    console.log(items, "items");

    // Fetch Cart
    useEffect(() => {
        const fetchCart = async () => {
            const { data: authData } = await supabase.auth.getUser();
            const user = authData?.user;

            if (!user) {
                console.log("No user logged in");
                return;
            }

            const { data, error } = await supabase.rpc("get_user_cart");

            if (error) {
                console.log("Cart error:", error);
                return;
            }

            if (!data?.data) {
                console.log("Invalid cart response", data);
                return;
            }

            const cart = data.data;

            // Correct mapping
            const mappedItems = cart.products.map((product, index) => ({
                id: product.id,
                title: product.name,
                qty: cart.quantities[index] || 1,
                price: product.sale_price,
                image: product.image?.image_url,
            }));

            setItems(mappedItems);
        };

        fetchCart();
    }, []);

    // Increase Quantity
    const increaseQty = async (id) => {
        setItems(prev =>
            prev.map(item =>
                item.id === id ? { ...item, qty: item.qty + 1 } : item
            )
        );

        const item = items.find(i => i.id === id);
        await updateCartQty(id, item.qty + 1);
    };

    // Decrease Quantity
    const decreaseQty = async (id) => {
        const item = items.find(i => i.id === id);

        if (item.qty === 1) return;

        setItems(prev =>
            prev.map(item =>
                item.id === id ? { ...item, qty: item.qty - 1 } : item
            )
        );

        await updateCartQty(id, item.qty - 1);
    };

    const updateCartQty = async (productId, quantity) => {
        let { data, error } = await supabase.rpc("upsert_user_cart", {
            p_address_id: null,
            p_delete_product_id: null,
            p_product_id: productId,
            p_quantity: quantity
        });

        if (error) console.error("Update cart error:", error);
        else console.log("Updated:", data);
    };
    const removeItem = async (id) => {
        setItems(prev => prev.filter(item => item.id !== id));
        await deleteCartItem(id);
    };
    const deleteCartItem = async (productId) => {
        let { data, error } = await supabase.rpc("upsert_user_cart", {
            p_address_id: null,
            p_delete_product_id: productId,
            p_product_id: null,
            p_quantity: null
        });

        if (error) console.error("Delete cart error:", error);
        else console.log("Deleted:", data);
    };



    // Totals
    const itemTotal = items.reduce((sum, item) => sum + item.qty * item.price, 0);
    const taxes = 14;
    const delivery = 24;
    const packing = 14;
    const grandTotal = itemTotal + taxes + delivery + packing;

    return (
        <>
            {open && (
                <div className="fixed inset-0 bg-black/60 z-40" onClick={onClose}></div>
            )}

            <div className={`fixed right-0 top-0 w-full sm:w-[550px] h-full bg-white rounded-l-2xl 
            shadow-xl z-50 transform transition-transform duration-300 
            ${open ? "translate-x-0" : "translate-x-full"}`}>

                {/* Header */}
                <div className="bg-[#FFBABC] h-16 flex items-center px-5 rounded-t-2xl">
                    <FaChevronLeft size={26} className="w-[50px] cursor-pointer" onClick={onClose} />
                    <h2 className="w-full text-lg text-center font-bold text-[#494949]">Order Summary</h2>
                </div>

                {/* Items */}
                <div className="p-4 space-y-4 overflow-y-auto h-[62%]">
                    {items.map(item => (
                        <div key={item.id} className="flex items-start gap-3 bg-white shadow-md p-3 rounded-xl border relative">

                            <IoClose size={20} className="absolute right-3 top-3 cursor-pointer"
                                onClick={() => removeItem(item.id)} />
                            <Image
                                src={item.image}
                                width={100}
                                height={100}
                                alt="product"
                                className="rounded-md object-cover"
                            />

                            <div className="flex mt-3 justify-between w-full items-end ">
                                <div className="flex-1 text-gray-700">
                                    <h3 className="font-medium">{item.title}</h3>
                                    <p className="font-medium text-primary mt-1">₹{item.price}</p>
                                </div>

                                {/* Qty Counter */}
                                <div className="flex items-center gap-2 bg-gray-100 p-1  rounded-full">
                                    <button onClick={() => decreaseQty(item.id)}
                                        className="bg-red-500 text-white p-1 rounded-full"><HiMinus /></button>
                                    <span className="px-2 font-semibold">{item.qty}</span>
                                    <button onClick={() => increaseQty(item.id)}
                                        className="bg-red-500 text-white p-1 rounded-full"><HiPlus /></button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Add more */}
                    <div className="flex justify-center mt-4">
                        <button className="w-[50%] bg-[#FEE2E2] text-primary font-medium py-2 rounded-lg">
                            Add More Items
                        </button>
                    </div>
                </div>

                {/* Summary */}
                <div className="px-5 py-3 border-t text-[#494949] select-none">

                    <div className="flex justify-between items-center text-lg font-semibold cursor-pointer"
                        onClick={() => setOpenDropdown(!openDropdown)}>
                        <span>Grand Total</span>
                        <div className="flex items-center gap-2 font-bold text-xl">
                            <span>₹{grandTotal}.00</span>
                            {openDropdown
                                ? <IoIosArrowUp size={20} />
                                : <IoIosArrowDown size={20} />}
                        </div>
                    </div>

                    <div className={`overflow-hidden transition-all duration-300 
                    ${openDropdown ? "max-h-40 mt-3" : "max-h-0"}`}>
                        <div className="flex justify-between py-1">
                            <span>Item Total</span>
                            <span>₹{itemTotal}.00</span>
                        </div>

                        <div className="flex justify-between py-1">
                            <span>Taxes</span>
                            <span>₹{taxes}.00</span>
                        </div>

                        <div className="flex justify-between py-1">
                            <span>Delivery Charge</span>
                            <span>₹{delivery}.00</span>
                        </div>

                        <div className="flex justify-between py-1">
                            <span>Packing Charge</span>
                            <span>₹{packing}.00</span>
                        </div>
                    </div>
                </div>

                {/* Checkout */}
                <div className="flex mx-3">
                    <div className="w-full text-center shadow-lg py-3 font-semibold bg-white border">
                        Total : ₹{grandTotal}.00
                    </div>
                    <button className="w-full btn-gradient text-white py-3 font-semibold">
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </>
    );
}
