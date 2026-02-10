"use client";

import { useEffect, useState } from "react";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

import { IoArrowBack, IoLocationSharp } from "react-icons/io5";
import { FiMessageSquare } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import { CiLocationOn } from "react-icons/ci";
import CancelOrderUI from "../../Components/CancelOrderUI";
import toast from "react-hot-toast";

export default function OrderDetails() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');
    const router = useRouter();
    const [order, setOrder] = useState(null);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [userData, setUserData] = useState();
    const [address, setAddress] = useState();
    const [isCancelDisabled, setIsCancelDisabled] = useState(false);

    const pathname = usePathname();
    const STATUS_STEP_MAP = {
        pending: 0,        // Order in progress
        assigned: 1,       // Order Assigned
        on_the_way: 2,     // Order on the Way
        delivered: 3,      // Order Delivered
    };
    const steps = [
        "Order Pending",
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
            if (orderId) {
                const { data, error } = await supabase
                   .from("vendor_order")
                    .select("*")
                    .eq("id", orderId).limit(1)
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
                const createdTime = new Date(data.created_at).getTime();
                const currentTime = Date.now();
                const diffInSeconds = (currentTime - createdTime) / 1000;

                if (diffInSeconds > 180 || data.order_status !== "pending") {
                    setIsCancelDisabled(true);
                }

                setLoading(false);
            } else {
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
                const createdTime = new Date(data.created_at).getTime();
                const currentTime = Date.now();
                const diffInSeconds = (currentTime - createdTime) / 1000;

                if (diffInSeconds > 180 || data.order_status !== "pending") {
                    setIsCancelDisabled(true);
                }

                setLoading(false);
            }

        };

        fetchOrder();
    }, []);
    const handleCancelOrder = async () => {
        try {
            setIsCancelDisabled(true);

            const { data, error } = await supabase.rpc("cancel_order_user", {
                p_order_id: order.id,
                p_total_chicken_weight: order.total_chicken_weight ?? 0,
                p_total_mutton_weight: order.total_mutton_weight ?? 0,
            });

            if (error) {
                console.error("Cancel failed:", error);
                toast.error("Unable to cancel order");
                setIsCancelDisabled(false);
                return;
            }

            // ✅ Update UI instantly
            setOrder(prev => ({
                ...prev,
                order_status: "cancelled",
            }));

            setActiveStep(0);
            setIsModalOpen(false);

            toast.success("Order cancelled successfully");

        } catch (err) {
            console.error(err);
            setIsCancelDisabled(false);
        }
    };

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
        return <div className="h-[47vh] flex items-center justify-center"><p className="text-center py-20">Loading order...</p></div>;
    }

    if (!order) {
        return <div className="h-[47vh] flex items-center justify-center"><p className="text-center py-20">Order not found</p></div>;
    }
    const handleNavigateToChat = () => {
        router.push(`/userProfile?orderId=${order.id}`);
    };
    return (
        <div className="min-h-screen max-w-4xl mx-auto  bg-[#F6F7FB] flex justify-center py-10 px-4">
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

                    <button className="flex items-center gap-2 hover:bg-red-50 transition border px-4 py-2 rounded-full text-red-600 border-red-500" onClick={() => handleNavigateToChat()}>
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
                                    <div>
                                        <svg width="23" height="22" viewBox="0 0 23 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M9.11286 0.601444L17.4098 4.47974C17.738 4.63317 17.8793 5.02263 17.7252 5.34962C17.5712 5.67661 17.1802 5.81732 16.852 5.66386L8.57821 1.7964C8.17179 1.60643 7.90165 1.48068 7.6859 1.40003C7.47761 1.32217 7.37114 1.30684 7.29711 1.30808C7.09618 1.31146 6.90113 1.37598 6.73806 1.49297C6.67801 1.5361 6.60187 1.61179 6.48166 1.79832C6.35719 1.99147 6.21618 2.25317 6.00453 2.64755L4.54718 5.363C4.37621 5.68153 3.97843 5.80172 3.65866 5.63141C3.33889 5.4611 3.21824 5.06483 3.38921 4.74632L4.85859 2.00841C5.05501 1.64241 5.22047 1.33409 5.37668 1.09171C5.54034 0.837691 5.7219 0.610112 5.97056 0.431665C6.351 0.158668 6.80621 0.00811476 7.27501 0.00025118C7.58145 -0.00488801 7.86358 0.0693518 8.14727 0.175417C8.418 0.276622 8.73572 0.425132 9.11286 0.601444Z" fill="#646A78" />
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M4.76616 4.40063H16.6843C17.3501 4.40063 17.8895 4.40063 18.3269 4.43624C18.7781 4.47295 19.1781 4.55079 19.5494 4.73923C20.1362 5.03706 20.6133 5.51231 20.9123 6.09685C21.1015 6.46671 21.1796 6.86522 21.2165 7.31462C21.2522 7.7503 21.2522 8.28769 21.2522 8.95083V10.0175C21.2522 10.3787 20.9583 10.6715 20.5957 10.6715C20.2331 10.6715 19.9391 10.3787 19.9391 10.0175V8.97869C19.9391 8.28113 19.9386 7.7973 19.9078 7.42115C19.8775 7.05261 19.8215 6.84543 19.7423 6.69067C19.5692 6.35226 19.293 6.07713 18.9533 5.90468C18.798 5.82583 18.59 5.77001 18.22 5.73989C17.8424 5.70918 17.3567 5.70865 16.6564 5.70865H4.79404C4.09377 5.70865 3.60807 5.70918 3.23046 5.73989C2.8605 5.77001 2.65252 5.82583 2.49715 5.90468C2.15743 6.07713 1.88123 6.35226 1.70812 6.69067C1.62896 6.84543 1.57293 7.05261 1.54269 7.42115C1.51186 7.7973 1.51133 8.28113 1.51133 8.97869V15.1951C1.51133 15.5563 1.21738 15.8491 0.854785 15.8491C0.492187 15.8491 0.198242 15.5563 0.198242 15.1951V8.95089C0.198242 8.28772 0.198242 7.75033 0.233983 7.31462C0.270843 6.86522 0.348975 6.46671 0.538153 6.09685C0.837132 5.51231 1.31423 5.03706 1.90103 4.73923C2.27233 4.55079 2.67238 4.47295 3.12352 4.43624C3.56092 4.40063 4.10039 4.40063 4.76616 4.40063ZM20.5957 14.8926C20.9583 14.8926 21.2522 15.1854 21.2522 15.5466V16.7604C21.2522 17.4236 21.2522 17.9609 21.2165 18.3966C21.1796 18.846 21.1015 19.2445 20.9123 19.6144C20.6133 20.1989 20.1362 20.6742 19.5494 20.972C19.1781 21.1605 18.7781 21.2383 18.3269 21.275C17.8896 21.3106 17.3501 21.3106 16.6844 21.3106H9.32107C8.95847 21.3106 8.66452 21.0178 8.66452 20.6566C8.66452 20.2954 8.95847 20.0026 9.32107 20.0026H16.6564C17.3567 20.0026 17.8424 20.0021 18.22 19.9714C18.59 19.9412 18.798 19.8854 18.9533 19.8066C19.293 19.6342 19.5692 19.359 19.7423 19.0206C19.8215 18.8658 19.8775 18.6586 19.9078 18.2901C19.9386 17.914 19.9391 17.4301 19.9391 16.7326V15.5466C19.9391 15.1854 20.2331 14.8926 20.5957 14.8926Z" fill="#646A78" />
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M21.5206 10.64C21.492 10.6394 21.4539 10.6393 21.3888 10.6393H16.2249C15.2219 10.6393 14.4088 11.4493 14.4088 12.4485C14.4088 13.4476 15.2219 14.2575 16.2249 14.2575H21.3888C21.4539 14.2575 21.492 14.2575 21.5206 14.2569M21.5206 10.64C21.5357 10.6404 21.5432 10.6408 21.5458 10.641L21.5206 10.64ZM21.5458 10.641C21.6181 10.6512 21.675 10.7079 21.6852 10.7799C21.6854 10.7824 21.6859 10.7899 21.6862 10.805C21.6868 10.8335 21.6869 10.8714 21.6869 10.9362V13.9607C21.6869 14.0255 21.6868 14.0635 21.6862 14.0919M21.415 9.33132C21.5117 9.3312 21.6157 9.33111 21.7115 9.3434C22.3777 9.42887 22.902 9.95125 22.9879 10.6148C23.0002 10.7103 23.0001 10.8138 23 10.9102V10.9362V13.9607V13.9867C23.0001 14.0831 23.0002 14.1866 22.9879 14.2821C22.902 14.9456 22.3777 15.468 21.7115 15.5535C21.6157 15.5658 21.5117 15.5657 21.415 15.5656C21.4062 15.5656 21.3975 15.5656 21.3888 15.5656H16.2249C14.4967 15.5656 13.0957 14.17 13.0957 12.4485C13.0957 10.7269 14.4967 9.33132 16.2249 9.33132H21.3888H21.415ZM21.6852 14.117C21.675 14.1891 21.6181 14.2458 21.5458 14.2559L21.6852 14.117Z" fill="#646A78" />
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M2.66113 8.32466C2.66113 7.96346 2.95508 7.67065 3.31768 7.67065H8.24176C8.60436 7.67065 8.89831 7.96346 8.89831 8.32466C8.89831 8.68586 8.60436 8.97867 8.24176 8.97867H3.31768C2.95508 8.97867 2.66113 8.68586 2.66113 8.32466Z" fill="#646A78" />
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M7.60755 15.9406C7.86395 16.196 7.86395 16.6101 7.60755 16.8655L3.626 20.8317C3.1802 21.2758 2.4574 21.2758 2.0116 20.8317C2.01148 20.8316 2.01173 20.8318 2.0116 20.8317L0.192301 19.0194C-0.0641003 18.764 -0.0641003 18.3499 0.192301 18.0945C0.448702 17.8391 0.864384 17.8391 1.12078 18.0945L2.81881 19.786L6.67907 15.9406C6.93547 15.6852 7.35118 15.6852 7.60755 15.9406Z" fill="#646A78" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-[#47474A]">Payment Method</p>
                                        <p className="text-[#47474A]">Paid via : {order.paid_via == 'razorpay' ? 'Razorpay' : 'Cash on Delivery'}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <div className="flex">
                                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M23.3337 11.6666C23.3337 19.2499 14.0003 25.6666 14.0003 25.6666C14.0003 25.6666 4.66699 19.2499 4.66699 11.6666C4.66699 9.19123 5.65032 6.81726 7.40066 5.06692C9.151 3.31658 11.525 2.33325 14.0003 2.33325C16.4757 2.33325 18.8496 3.31658 20.6 5.06692C22.3503 6.81726 23.3337 9.19123 23.3337 11.6666Z" stroke="#646A78" stroke-width="2" />
                                            <path d="M17.5 11.6665C17.5 12.5948 17.1313 13.485 16.4749 14.1414C15.8185 14.7978 14.9283 15.1665 14 15.1665C13.0717 15.1665 12.1815 14.7978 11.5251 14.1414C10.8687 13.485 10.5 12.5948 10.5 11.6665C10.5 10.7382 10.8687 9.84801 11.5251 9.19163C12.1815 8.53525 13.0717 8.1665 14 8.1665C14.9283 8.1665 15.8185 8.53525 16.4749 9.19163C17.1313 9.84801 17.5 10.7382 17.5 11.6665Z" stroke="#646A78" stroke-width="2" />
                                        </svg>

                                    </div>
                                    <div>
                                        <div>
                                            <p className="font-semibold text-[#47474A]">Delivery Address</p>
                                            <div className=" items-center gap-2">
                                                <p>{address?.flat_house_building},{address?.address_line},{address?.landmark},</p>
                                                <p>{address?.city},{address?.state},{address?.country},</p>
                                                <p>{address?.postal_code}</p>
                                            </div>
                                        </div>

                                    </div>
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
                    <button disabled={order.status == 'completed'} className={`px-6 py-3 rounded-lg text-white btn-gradient
                        ${order.status == 'completed' ? "opacity-50 cursor-not-allowed" : ""}`}>
                        Track Order
                    </button>
                    <button
                        disabled={order.status !== 'completed'}
                        className={`px-6 py-3 rounded-lg text-white btn-gradient
                        ${order.status !== 'completed' ? "opacity-50 cursor-not-allowed" : ""}`}>
                        Download Invoice
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        disabled={isCancelDisabled}
                        className={`px-6 py-3 rounded-lg text-white btn-gradient
                        ${isCancelDisabled ? "opacity-50 cursor-not-allowed" : ""}`}>
                        Cancel Order
                    </button>

                </div>
                {/* {isCancelDisabled && (
                    <p className="text-sm text-red-500 mt-4 text-center">
                        Order can only be cancelled within 3 minutes
                    </p>
                )} */}
                <CancelOrderUI onConfirm={handleCancelOrder} open={isModalOpen} onClose={() => setIsModalOpen(false)} />
            </div>
        </div>
    );
}
