"use client";

import { useEffect, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

import { IoArrowBack, IoLocationSharp } from "react-icons/io5";
import { FiMessageSquare } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";

import CancelOrderUI from "../../Components/CancelOrderUI";

export default function OrderDetails() {
    const { id: orderId } = useParams();
    const router = useRouter();
    const [order, setOrder] = useState(null);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const pathname = usePathname();
    const steps = [
        "Order in progress",
        "Order Assigned",
        "Order on the Way",
        "Order Delivered",
    ];
    useEffect(() => {
        const checkAuth = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) {
                router.push(`/?login=true`);
            }
        };

        checkAuth();
    }, [router, pathname]);



    /* ================= FETCH ORDER ================= */
    useEffect(() => {
        // if (!orderId) return;

        const fetchOrder = async () => {
            setLoading(true);

            const { data: orderData, error } = await supabase
                .from("orders")
                .select("*")
                .eq("id", orderId)
                .single();

            if (error) {
                console.error(error);
                setLoading(false);
                return;
            }

            const { data: itemData } = await supabase
                .from("order_items")
                .select("*")
                .eq("order_id", orderId);

            setOrder(orderData);
            setItems(itemData || []);
            setLoading(false);
        };

        fetchOrder();
    }, [orderId]);

    if (loading) {
        return <p className="text-center py-20">Loading order...</p>;
    }

    if (!order) {
        return <p className="text-center py-20">Order not found</p>;
    }

    return (
        <div className="min-h-screen bg-[#F6F7FB] flex justify-center py-10 px-4">
            <div className="w-full max-w-7xl bg-white shadow-xl rounded-3xl p-8">

                {/* HEADER */}
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => router.back()}
                            className="border p-2 rounded-full"
                        >
                            <IoArrowBack className="text-xl" />
                        </button>
                        <h1 className="text-2xl font-semibold">Order Details</h1>
                    </div>

                    <button className="flex items-center gap-2 border px-4 py-2 rounded-full text-red-600 border-red-500">
                        <FiMessageSquare />
                        Chat with us
                    </button>
                </div>

                {/* STATUS HEADER */}
                <div className="text-center mb-10">
                    <h2 className="text-xl font-medium">Thank You</h2>
                    <p className="text-gray-600 mt-1">Your order status is as follows</p>
                    <p className="font-medium mt-1">
                        Order ID:
                        <span className="font-light"> #{order.order_number}</span>
                    </p>
                </div>
                {/* TIMELINE */}
                <div className="relative px-8 mb-10">
                    <div className="absolute top-3 left-0 w-full h-[3px] bg-gray-300">
                        <div
                            className="h-full bg-green-500"
                            style={{
                                width: `${(activeStep / (steps.length - 1)) * 100}%`,
                            }}
                        />
                    </div>

                    <div className="flex justify-between relative z-10">
                        {steps.map((step, i) => {
                            const isActive = i <= activeStep;
                            return (
                                <div key={i} className="flex flex-col items-center w-24">
                                    <div
                                        className={`w-7 h-7 rounded-full border-2 flex items-center justify-center
                      ${isActive ? "bg-green-500 border-green-500" : "border-gray-400 bg-white"}
                    `}
                                    >
                                        {isActive && <div className="w-2 h-2 bg-white rounded-full" />}
                                    </div>
                                    <p className={`text-xs mt-2 ${isActive ? "font-semibold" : "text-gray-400"}`}>
                                        {step}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* MAIN GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* LEFT */}
                    <div className="space-y-4">
                        <div className="border rounded-xl p-5">
                            <p className="flex justify-between text-sm">
                                <span className="font-semibold">Order Status</span>
                                <span className="text-green-600 capitalize">{order.status}</span>
                            </p>
                            <p className="flex justify-between text-sm mt-2">
                                <span className="font-semibold">Items</span>
                                <span>{items.length}</span>
                            </p>
                        </div>

                        <div className="border rounded-xl p-5">
                            <div className="flex gap-3 items-center">
                                <FaUserCircle className="text-4xl text-gray-400" />
                                <div>
                                    <p className="font-semibold">{order.user_name}</p>
                                    <p className="text-sm text-gray-500">{order.phone}</p>
                                </div>
                            </div>

                            <div className="border-t mt-4 pt-4 text-sm space-y-2">
                                <p className="font-semibold">Payment</p>
                                <p className="text-gray-600">{order.payment_method}</p>

                                <p className="font-semibold">Delivery Address</p>
                                <div className="flex gap-2">
                                    <IoLocationSharp className="text-red-500" />
                                    <p>{order.delivery_address}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="border rounded-xl p-5">
                        <h3 className="font-semibold mb-3">🧾 Bill Summary</h3>

                        <div className="space-y-3">
                            {items.map((item) => (
                                <div key={item.id} className="border rounded-lg p-3 flex gap-3 bg-gray-50">
                                    <img src={item.image} className="w-20 h-20 rounded object-cover" />
                                    <div className="text-sm">
                                        <p className="font-semibold">{item.product_name}</p>
                                        <p className="text-xs text-gray-500">{item.weight}</p>
                                        <p className="font-semibold">
                                            ₹{item.price}
                                            <span className="line-through text-xs text-gray-400 ml-2">
                                                ₹{item.original_price}
                                            </span>
                                        </p>
                                        <p className="text-xs">Qty {item.quantity}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t mt-4 pt-4 space-y-2 text-sm">
                            <div className="flex justify-between">
                                <p>Item Total</p>
                                <p>₹{order.total_amount - order.delivery_charge}</p>
                            </div>
                            <div className="flex justify-between">
                                <p>Delivery</p>
                                <p>₹{order.delivery_charge}</p>
                            </div>
                            <div className="flex justify-between font-semibold text-lg">
                                <p>Total</p>
                                <p>₹{order.total_amount}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FOOTER */}
                <div className="flex justify-center gap-4 mt-10">
                    <button disabled className="btn-gradient px-6 py-3 rounded-lg text-white">
                        Track Order
                    </button>
                    <button className="btn-gradient px-6 py-3 rounded-lg text-white">
                        Download Invoice
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="btn-gradient px-6 py-3 rounded-lg text-white"
                    >
                        Cancel Order
                    </button>
                </div>

                <CancelOrderUI open={isModalOpen} onClose={() => setIsModalOpen(false)} />
            </div>
        </div>
    );
}
