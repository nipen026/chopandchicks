"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { FaChevronLeft } from "react-icons/fa6";
import { HiMinus, HiPlus } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function CartSidebar({ open, onClose }) {
    const [openDropdown, setOpenDropdown] = useState(true);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true); // ⬅ NEW
    const router = useRouter();
    // Fetch Cart   
    useEffect(() => {
  if (open) {
    // lock background scroll
    document.body.style.overflow = "hidden";
  } else {
    // restore scroll
    document.body.style.overflow = "";
  }

  // cleanup on unmount
  return () => {
    document.body.style.overflow = "";
  };
}, [open]);
    useEffect(() => {
        const fetchCart = async () => {
            setLoading(true);

            const { data: authData } = await supabase.auth.getUser();
            const user = authData?.user;

            if (!user) {
                setLoading(false);
                return;
            }

            const { data, error } = await supabase.rpc("get_user_cart");

            if (error) {
                console.log("Cart error:", error);
                setLoading(false);
                return;
            }

            if (!data?.data) {
                setLoading(false);
                return;
            }

            const cart = data.data;

            if (!cart?.products?.length) {
                setItems([]);
                setLoading(false);
                return;
            }

            const mappedItems = cart.products.map((product, index) => ({
                id: product.id,
                title: product.name,
                qty: cart.quantities[index] || 1,
                price: product.sale_price,
                image: product.image?.image_url,
            }));

            setItems(mappedItems);
            setLoading(false);
        };

        fetchCart();
    }, [open]);
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
        await supabase.rpc("upsert_user_cart", {
            p_address_id: null,
            p_delete_product_id: null,
            p_product_id: productId,
            p_quantity: quantity
        });
    };

    const removeItem = async (id) => {
        setItems(prev => prev.filter(item => item.id !== id));
        await supabase.rpc("upsert_user_cart", {
            p_address_id: null,
            p_delete_product_id: id,
            p_product_id: null,
            p_quantity: null
        });
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
                <div className="fixed inset-0 bg-black/60 z-[998]" onClick={onClose}></div>
            )}

            <div className={`fixed z-[999] right-0 top-0 w-full sm:w-[550px] h-full bg-white rounded-l-2xl 
            shadow-xl transform transition-transform duration-300 
            ${open ? "translate-x-0" : "translate-x-full"}`}>

                {/* Header */}
                <div className="bg-[#FFBABC] h-16 flex items-center px-5 rounded-t-2xl">
                    <FaChevronLeft size={26} className="w-[50px] cursor-pointer" onClick={onClose} />
                    <h2 className="w-full text-lg text-center font-bold text-[#494949]">Order Summary</h2>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col items-center justify-center h-[60%] animate-fadeIn">
                        <div className="loader border-4 border-gray-300 border-t-red-500 rounded-full w-12 h-12 animate-spin"></div>
                        <p className="text-gray-600 mt-3">Loading your cart...</p>
                    </div>
                )}

                {/* Empty Cart */}
                {!loading && items.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-[60%] animate-fadeIn">
                        <Image
                            src="/assets/empty-cart.png"
                            width={170}
                            height={170}
                            draggable={false}
                            alt="Empty Cart"
                        />
                        <p className="text-gray-700 mt-3 font-medium">Your cart is empty</p>
                    </div>
                )}

                {/* Items */}
                {!loading && items.length > 0 && (
                    <div className="p-4 space-y-4 overflow-y-auto h-[62%] animate-fadeIn">
                        {items.map(item => (
                            <div key={item.id} className="flex items-start gap-3 bg-white shadow-md p-3 rounded-xl border relative">

                                <IoClose
                                    size={20}
                                    className="absolute right-3 top-3 cursor-pointer"
                                    onClick={() => removeItem(item.id)}
                                />

                                <Image
                                    src={item.image}
                                    width={100}
                                    height={100}
                                        draggable={false}
                                    alt="product"
                                    className="rounded-md object-cover"
                                />

                                <div className="flex mt-3 justify-between w-full items-end ">
                                    <div className="flex-1 text-gray-700">
                                        <h3 className="font-medium">{item.title}</h3>
                                        <p className="font-medium text-primary mt-1">₹{item.price}</p>
                                    </div>

                                    {/* Qty Counter */}
                                    <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-full">
                                        <button onClick={() => decreaseQty(item.id)}
                                            className="bg-red-500 text-white p-1 rounded-full"><HiMinus /></button>
                                        <span className="px-2 font-semibold">{item.qty}</span>
                                        <button onClick={() => increaseQty(item.id)}
                                            className="bg-red-500 text-white p-1 rounded-full"><HiPlus /></button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="flex justify-center mt-4">
                            <button className="w-[50%] bg-[#FEE2E2] text-primary font-medium py-2 rounded-lg">
                                Add More Items
                            </button>
                        </div>
                    </div>
                )}

                {/* Summary + Checkout only when items exist */}
                {!loading && items.length > 0 && (
                    <>
                        <div className="px-5 py-3 border-t text-[#494949]">

                            <div className="flex justify-between items-center text-lg font-semibold cursor-pointer"
                                onClick={() => setOpenDropdown(!openDropdown)}>
                                <span>Grand Total</span>
                                <div className="flex items-center gap-2 font-bold text-xl">
                                    <span>₹{grandTotal}.00</span>
                                    {openDropdown ? <IoIosArrowUp size={20} /> : <IoIosArrowDown size={20} />}
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

                        <div className="flex mx-3">
                            <div className="w-full text-center shadow-lg py-3 font-semibold bg-white border">
                                Total : ₹{grandTotal}.00
                            </div>
                            <button onClick={()=>router.push("/address")} className="w-full btn-gradient text-white py-3 font-semibold">
                                Proceed to Checkout
                            </button>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
