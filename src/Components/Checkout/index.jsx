"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { FiTrash2 } from "react-icons/fi";
import { IoIosArrowDown } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { HiMinus, HiPlus } from "react-icons/hi";
import Image from "next/image";
import toast from "react-hot-toast";

export default function Checkout() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [addressId, setAddressId] = useState(null);
    // Delivery
    const [scheduleType, setScheduleType] = useState("instant"); // instant | schedule
    const [hour, setHour] = useState("10");
    const [minute, setMinute] = useState("00");
    const [ampm, setAmPm] = useState("AM");

    // Payment
    const [paymentMethod, setPaymentMethod] = useState("netbanking");
    useEffect(() => {
        if (typeof window !== "undefined") {
            const id = localStorage.getItem("selected_address_id");
            setAddressId(id);
        }
    }, []);


    /* ---------------- CART ---------------- */
    useEffect(() => {
        const loadCart = async () => {
            const { data } = await supabase.rpc("get_user_cart");
            if (!data?.data?.products) return;

            setItems(
                data.data.products.map((p, i) => ({
                    id: p.id,
                    title: p.name,
                    qty: data.data.quantities[i],
                    price: p.sale_price,
                    image: p.image?.image_url,
                }))
            );
        };
        loadCart();
    }, []);

    const buildInsertOrderPayload = async ({
        paidVia,
        paymentId = null,
        paymentData = null,
    }) => {
        const { data: { user } } = await supabase.auth.getUser();

        return {
            p_user_id: user.id,
            p_address: addressId,
            p_products_uuid: items.map(i => i.id),
            p_product_quantities: items.map(i => i.qty),
            p_item_total: subtotal,
            p_tax_amount: tax,
            p_delivery_fee: 0,
            p_packaging_fee: 0,
            p_total_amount: total,
            p_paid_via: paidVia,          // "cod" | "razorpay"
            p_payment_id: paymentId,
            p_payment_data: paymentData,
            p_schedule_time:
                scheduleType === "schedule"
                    ? `${hour}:${minute} ${ampm}`
                    : null,
            p_nearby_vendors: null,
        };
    };
    const placeCODOrder = async () => {
        setLoading(true);

        const payload = await buildInsertOrderPayload({
            paidVia: "cod",
        });

        const { data, error } = await supabase.rpc("insert_order", payload);

        setLoading(false);

        if (error) {
            console.error("COD order failed:", error);
            toast.error("Failed to place order");
            return;
        }

        // ✅ CLEAR CART AFTER SUCCESS
        await clearUserCart();

        toast.success("Order placed successfully (Cash on Delivery)");
    };



    /* ---------------- RAZORPAY ---------------- */
    const loadRazorpay = () =>
        new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });

    const payWithRazorpay = async () => {
        setLoading(true);

        const loaded = await loadRazorpay();
        if (!loaded) {
            toast.error("Razorpay SDK failed to load");
            setLoading(false);
            return;
        }

        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: Math.round(total * 100),
            currency: "INR",
            name: "Chop & Chicks",

            handler: async (response) => {
                const payload = await buildInsertOrderPayload({
                    paidVia: "razorpay",
                    paymentId: response.razorpay_payment_id,
                    paymentData: response,
                });

                const { error } = await supabase.rpc("insert_order", payload);

                if (error) {
                    console.error("Order save failed:", error);
                    toast.error("Payment done, but order not saved");
                    return;
                }
                await clearUserCart();
                toast.success("Payment successful & order placed 🎉");
            },
        };

        new window.Razorpay(options).open();
        setLoading(false);
    };


    /* ---------------- COD ---------------- */

    const clearUserCart = async () => {
        const { error } = await supabase.rpc("clear_user_cart");

        if (error) {
            console.error("Failed to clear cart:", error);
            return false;
        }

        // Clear UI cart immediately
        setItems([]);
        return true;
    };


    /* ---------------- SUBMIT ---------------- */
    const placeOrder = () => {
        if (paymentMethod === "cod") placeCODOrder();
        else payWithRazorpay();
    };

    useEffect(() => {
        const fetchCart = async () => {
            setLoading(true);

            const { data: authData } = await supabase.auth.getUser();
            const user = authData?.user;

            if (!user) return setLoading(false);

            const { data, error } = await supabase.rpc("get_user_cart");

            if (error) {
                console.log("Cart error:", error);
                return setLoading(false);
            }

            if (!data?.data) return setLoading(false);

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
    }, []);
    const increaseQty = async (id) => {
        setItems(prev =>
            prev.map(item =>
                item.id === id ? { ...item, qty: item.qty + 1 } : item
            )
        );
        const item = items.find(i => i.id === id);
        await updateCartQty(id, item.qty + 1);
    };
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
    const subtotal = items.reduce((sum, item) => sum + item.qty * item.price, 0);
    const tax = subtotal * 0.05;
    const total = subtotal + tax;

    return (
        <>
            {items.length == 0 ?
                <div className="flex flex-col justify-center items-center justify-center h-[calc(100vh-200px)] animate-fadeIn">
                    <Image
                        src="/assets/empty-cart.png"
                        width={300}
                        height={300}
                        draggable={false}
                        alt="Empty Cart"
                    />
                    <p className="text-[#82131B] text-2xl text-center mt-3 font-medium">Start Filling Your Cart with <br /> Premium Fresh Meat.</p>
                </div> :
                <div className="w-full mx-auto max-w-6xl px-4 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                        {/* ---------------------- LEFT SIDE (Cart + Delivery + Payment) ---------------------- */}
                        <div className="lg:col-span-2 space-y-10">

                            {/* -------------- CART ITEMS -------------- */}
                            <div className="bg-white rounded-xl p-5 shadow-sm space-y-4">
                                {items.map(item => (
                                    <div key={item.id} className="flex items-start gap-3 bg-white shadow-md p-3 rounded-xl border relative">

                                        <IoClose
                                            size={20}
                                            className="absolute right-3 top-3 cursor-pointer"
                                            onClick={() => removeItem(item.id)}
                                        />

                                        <img
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


                            </div>

                            <div className="flex justify-center mt-4">
                                <button className="w-full bg-[#FEE2E2] text-primary font-medium py-2 rounded-lg">
                                    Add More Items
                                </button>
                            </div>

                            {/* -------------- DELIVERY TIME -------------- */}
                            <div className="bg-white p-6 shadow-sm rounded-xl">
                                <h2 className="font-semibold mb-4">Delivery Time</h2>

                                {/* Instant */}
                                <label className="flex items-center gap-3 mb-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        className="accent-red-600"
                                        checked={scheduleType === "instant"}
                                        onChange={() => setScheduleType("instant")}
                                    />
                                    <span>Delivery in 90 minutes</span>
                                </label>

                                {/* Schedule */}
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        className="accent-red-600"
                                        checked={scheduleType === "schedule"}
                                        onChange={() => setScheduleType("schedule")}
                                    />
                                    <span>Schedule Delivery</span>
                                </label>

                                {scheduleType === "schedule" && (
                                    <div className="flex items-center gap-3 mt-3">

                                        <select
                                            className="border rounded-lg p-2"
                                            value={hour}
                                            onChange={(e) => setHour(e.target.value)}
                                        >
                                            {[...Array(12)].map((_, i) => (
                                                <option key={i}>{String(i + 1).padStart(2, "0")}</option>
                                            ))}
                                        </select>

                                        <span>:</span>

                                        <select
                                            className="border rounded-lg p-2"
                                            value={minute}
                                            onChange={(e) => setMinute(e.target.value)}
                                        >
                                            {["00", "15", "30", "45"].map((m) => (
                                                <option key={m}>{m}</option>
                                            ))}
                                        </select>

                                        <select
                                            className="border rounded-lg p-2"
                                            value={ampm}
                                            onChange={(e) => setAmPm(e.target.value)}
                                        >
                                            <option>AM</option>
                                            <option>PM</option>
                                        </select>
                                    </div>
                                )}
                            </div>

                            {/* -------------- PAYMENT METHOD -------------- */}
                            <div className="bg-white p-6 shadow-sm rounded-xl space-y-5">
                                <h2 className="font-semibold">Payment Method</h2>

                                <div className="space-y-3">
                                    {[
                                        "Net Banking",
                                        "Google Pay",
                                        "Visa",
                                        "MasterCard",
                                        "Apple Pay",
                                    ].map((method) => (
                                        <label
                                            key={method}
                                            className="flex items-center gap-3 cursor-pointer bg-[#fff5f5] p-3 rounded-lg"
                                        >
                                            <input
                                                type="radio"
                                                className="accent-red-600"
                                                checked={paymentMethod === method}
                                                onChange={() => setPaymentMethod(method)}
                                            />
                                            <span>{method}</span>
                                        </label>
                                    ))}
                                </div>

                                {/* Other Banks */}
                                <div>
                                    <p className="text-gray-700 font-medium mb-1">Other Banks</p>
                                    <select className="w-full border rounded-lg p-2 text-gray-600">
                                        <option>Select Bank</option>
                                        <option>HDFC</option>
                                        <option>SBI</option>
                                        <option>ICICI</option>
                                    </select>
                                </div>

                                <div className="space-y-3 pt-3">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input type="radio" name="cod" className="accent-red-600" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} /> Cash on delivery
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input type="radio" name="cod" className="accent-red-600" checked={paymentMethod === "upi"} onChange={() => setPaymentMethod("upi")} /> Pay using UPI
                                    </label>
                                </div>
                            </div>

                        </div>

                        {/* ---------------------- RIGHT SIDE (Order Summary) ---------------------- */}
                        <div className="space-y-6">
                            <div className="ml-12 hidden md:flex flex-col items-start ">
                                <div className="flex items-center gap-3">
                                    <div className="bg-[#E5E5E5] p-1 rounded-full"><div className={`w-4 h-4 rounded-full bg-[#A6A6A6]'} `}></div></div>
                                    <span className="text-sm font-medium text-gray-800">Choose Address</span>
                                </div>
                                <div className="w-0.5 mx-3 h-64 bg-gray-300"></div>
                                <div className="flex items-center gap-3 ">
                                    <div className="bg-[#E5E5E5] p-1 rounded-full"><div className={`w-4 h-4 rounded-full btn-gradient`}></div></div>
                                    <span className="text-sm font-medium text-black">Payment Method</span>
                                </div>
                            </div>
                            <div className="bg-[#FFF1F1] p-6 rounded-xl shadow-sm">
                                <h2 className="font-semibold mb-4">Order Summary</h2>

                                <div className="border-b border-black pb-3 space-y-5">
                                    <div className="flex justify-between border-b pb-2 border-black">
                                        <span>Subtotal:</span>
                                        <span>₹{subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between border-b pb-2 border-black">
                                        <span>Tax:</span>
                                        <span>5%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Shipping:</span>
                                        <span>Free</span>
                                    </div>
                                </div>

                                <div className="flex justify-between font-semibold text-lg pt-3">
                                    <span>Order Total</span>
                                    <span>₹{total.toFixed(2)}</span>
                                </div>
                            </div>

                            <p className="text-sm text-gray-500 flex items-center gap-4">
                                ⓘ  Cancellation must be made within 3 minutes of placing the order.
                            </p>

                            <button onClick={placeOrder} className="w-full py-3 text-white rounded-lg btn-gradient">
                                Place Order →
                            </button>
                        </div>

                    </div>
                </div>}
        </>
    );
}
