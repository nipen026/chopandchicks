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
    const [activeStep, setActiveStep] = useState(0);
    const [userData, setUserData] = useState();
    const [address, setAddress] = useState();
    const pathname = usePathname();
    const STATUS_STEP_MAP = {
        pending: 0,        // Order in progress
        assigned: 1,       // Order Assigned
        on_the_way: 2,     // Order on the Way
        delivered: 3,      // Order Delivered
    };
    const steps = [
        "Order in progress",
        "Order Assigned",
        "Order on the Way",
        "Order Delivered"
    ]
    useEffect(() => {
        const checkAuth = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) {
                router.push(`/?login=true`);
            } else {
                setUserData(user);
            }
        };

        checkAuth();
    }, [router, pathname]);

    console.log(userData, "userData");


    /* ================= FETCH ORDER ================= */
    useEffect(() => {
        const fetchOrder = async () => {
            setLoading(true);

            const { data, error } = await supabase
                .from("vendor_order")
                .select("*")
                .order("created_at", { ascending: false }) // latest first
                .limit(1)
                .single(); // 👈 convert array → object

            if (error) {
                console.error(error);
                setLoading(false);
                return;
            }

            setOrder(data);
            userAddress(data.address)
            setActiveStep(STATUS_STEP_MAP[data.order_status] ?? 0);

            setItems(
                data.products.map((product, index) => ({
                    ...product,
                    quantity: data.product_quantities?.[index] || 1,
                }))
            );

            setLoading(false);
        };

        fetchOrder();
    }, []);

    const userAddress = async (addressId) => {
        const { data, error } = await supabase
            .from("user_address")
            .select("*")
            .eq("id", addressId).single();
        if (data) {
            setAddress(data);
        }
        if (error) {
            console.error("Error fetching address:", error);
            return;
        }

    }

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
                    {/* <p className="font-medium mt-1">
                        Order ID:
                        <span className="font-light"> #{order.order_number}</span>
                    </p> */}
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
                                <span className="text-green-600 capitalize">{order.order_status}</span>
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
                                    <p className="font-semibold">{userData?.user_metadata.full_name}</p>
                                    <p className="text-sm text-gray-500">{userData?.user_metadata?.phone}</p>
                                </div>
                            </div>

                            <div className="border-t mt-4 pt-4 text-sm space-y-2">
                                <div className="flex gap-2 items-center">
                                    <p className="font-semibold">Payment : </p>
                                    <p className="text-gray-600">{order.paid_via == 'razorpay' ? 'Razorpay' : 'Cash on Delivery'}</p>
                                </div>

                                <p className="font-semibold">Delivery Address</p>
                                <div className="flex items-center gap-2">
                                    <IoLocationSharp className="text-red-500" />
                                    <p>{address?.flat_house_building},</p>
                                    <p>{address?.address_line},</p>
                                    <p>{address?.landmark},</p>
                                    <p>{address?.city},</p>
                                    <p>{address?.state},</p>
                                    <p>{address?.country},</p>
                                    <p>{address?.postal_code}</p>
                                </div>
                                <button
                                    className={`flex items-center gap-2 px-4 py-2 btn-gradient text-white rounded-full border `}>
                                    {address?.address_type?.toUpperCase()}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="border rounded-xl p-5">
                        <h3 className="font-semibold mb-3">🧾 Bill Summary</h3>

                        <div className="space-y-3">
                            {items.map((item) => (
                                <div key={item.id} className="border rounded-lg p-3 flex gap-3 bg-gray-50">
                                    <img
                                        src={item.image?.image_url}
                                        className="w-20 h-20 rounded object-cover"
                                    />
                                    <div className="text-sm">
                                        <p className="font-semibold">{item.name}</p>
                                        <p className="text-xs text-gray-500">{item.weight}</p>
                                        <p className="font-semibold">₹{item.sale_price}</p>
                                        <p className="text-xs">Qty {item.quantity}</p>
                                    </div>
                                </div>
                            ))}

                        </div>

                        <div className="border-t mt-4 pt-4 space-y-2 text-sm">
                            <div className="flex justify-between">
                                <p>Item Total</p>
                                <p>₹{order.item_total}</p>
                            </div>

                            <div className="flex justify-between">
                                <p>Delivery</p>
                                <p>₹{order.delivery_fee}</p>
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
