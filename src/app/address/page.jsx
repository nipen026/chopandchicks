"use client"

import PaymentMethod from "../../Components/PaymentMethod";
import React, { useState } from "react";
import { MdHome, MdWork, MdLocationOn } from "react-icons/md";
import { supabase } from "../../lib/supabaseClient";

export default function Address() {
    const [addresses, setAddresses] = useState([
        {
            id: 1,
            name: "Will Smith",
            phone: "+8801235333344",
            email: "customer@example.com",
            city: "Dhaka",
            state: "Dhaka",
            country: "Bangladesh",
            address: "House:3, Road:1, Block: c, Mirpur 2",
            zip: "1216",
        },
    ]);

    const [showModal, setShowModal] = useState(false);
    const [currentAddress, setCurrentAddress] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [method, setMethod] = useState('shipping')
    const maxAddresses = 5;

    const openAddNew = () => {
        if (addresses.length >= maxAddresses) return;
        setCurrentAddress({ id: Date.now(), name: "", phone: "", email: "", city: "", state: "", country: "", address: "", zip: "" });
        setIsEditMode(false);
        setShowModal(true);
    };

    const openEdit = (addr) => {
        setCurrentAddress({ ...addr });
        setIsEditMode(true);
        setShowModal(true);
    };


    const handleSave = async () => {
        try {
            const { user } = await supabase.auth.getUser()
            let payload = {
                full_name: 'NK',
                contact_number: currentAddress.phone,
                address_line: currentAddress.address,
                flat_house_building: currentAddress.flat,
                landmark: currentAddress.landmark,
                city: currentAddress.city,
                state: currentAddress.state,
                country: currentAddress.country,
                postal_code: currentAddress.zip,
                latitude: currentAddress.lat ?? null,
                longitude: currentAddress.lng ?? null,
                address_type: currentAddress.type ?? "home",
            };

            // const { data, error } = await supabase.rpc(
            //   "upsert_user_address",
            //   payload
            // );   
            const { data, error } = await supabase.from('user_address').upsert(payload)
            if (error) {
                console.error(error);
                return alert("Error saving address");
            }

            // Add/Update local UI list
            if (isEditMode) {
                setAddresses((prev) =>
                    prev.map((a) => (a.id === currentAddress.id ? currentAddress : a))
                );
            } else {
                setAddresses((prev) => [...prev, currentAddress]);
            }

            setShowModal(false);
        } catch (err) {
            console.error(err);
        }
    };


    return (
        <div className="min-h-screen pt-8">
            <div className="container flex justify-center">
                {method == 'shipping' ?
                    <div className="w-full bg-white shadow-lg rounded-2xl p-8">
                        <h2 className="text-2xl font-semibold mb-6">SAVED ADDRESS</h2>

                        {/* Address List */}
                        <div className="space-y-6">
                            {addresses.map((addr) => (
                                <div key={addr.id} className="border rounded-xl p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <p className="text-sm font-medium text-black">Shipping Address</p>

                                        <div className="flex items-center gap-3 text-red-500 text-sm font-medium">
                                            <button onClick={() => openEdit(addr)}>Edit</button>
                                            {addresses.length < maxAddresses && (
                                                <button onClick={openAddNew}>Add New</button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="border rounded-lg p-4 bg-gray-50 text-sm leading-6">
                                        <p>{addr.name}</p>
                                        <p>{addr.phone}</p>
                                        <p>{addr.email}</p>
                                        <p>{addr.city},</p>
                                        <p>{addr.state},</p>
                                        <p>{addr.country},</p>
                                        <p>{addr.address}</p>
                                        <p>{addr.zip}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Save Checkbox */}
                        <div className="flex items-center gap-3 mt-6">
                            <input type="checkbox" defaultChecked className="w-4 h-4 accent-red" />
                            <p className="text-gray-700 text-sm">Save this information for faster check-out next time</p>
                        </div>

                        <div className="flex items-center gap-4 mt-6">
                            <button className="w-full py-3 border rounded-lg text-gray-700 font-medium hover:bg-gray-100">CANCEL</button>
                            <button className="w-full py-3 rounded-lg btn-gradient text-white font-semibold" onClick={() => setMethod
                                ('payment')
                            }>SHIP TO THIS ADDRESS</button>
                        </div>
                    </div> : <PaymentMethod />}

                {/* Steps */}
                <div className="ml-12 hidden md:flex flex-col items-start ">
                    <div className="flex items-center gap-3">
                        <div className="bg-[#E5E5E5] p-1 rounded-full"><div className={`w-4 h-4 rounded-full ${method == 'shipping' ? 'btn-gradient' : 'bg-[#A6A6A6]'} `}></div></div>
                        <span className="text-sm font-medium text-gray-800">Choose Address</span>
                    </div>
                    <div className="w-0.5 mx-3 h-64 bg-gray-300"></div>
                    <div className="flex items-center gap-3 ">
                        <div className="bg-[#E5E5E5] p-1 rounded-full"><div className={`w-4 h-4 rounded-full ${method == 'payment' ? 'btn-gradient' : 'bg-[#A6A6A6]'}`}></div></div>
                        <span className="text-sm font-medium text-black">Payment Method</span>
                    </div>
                </div>
            </div>

            {/* POPUP MODAL */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
                    <div className="bg-white w-full max-w-4xl rounded-2xl p-6 relative flex gap-6 animate-[zoomIn_0.25s_ease]">

                        <style>{`
                                    @keyframes zoomIn {
                                        0% { transform: scale(0.8); opacity: 0; }
                                        100% { transform: scale(1); opacity: 1; }
                                    }
                        `}</style>

                        <button
                            className="absolute top-4 right-4 text-xl"
                            onClick={() => setShowModal(false)}
                        >
                            ✕
                        </button>

                        {/* MAP */}
                        <div className="w-1/2 h-[420px] bg-gray-200 rounded-lg flex items-center justify-center text-gray-600 text-lg">
                            Map Here
                        </div>

                        {/* FORM */}
                        <div className="w-1/2 space-y-4">

                            <h2 className="text-xl font-semibold">
                                {isEditMode ? "Edit Address" : "Add New Address"}
                            </h2>

                            {/* Area */}
                            <input
                                type="text"
                                placeholder="Search for Area / Locality"
                                className="border bg-[#F2F2F2] focus:border-red-500 outline-none text-black p-2 rounded w-full"
                                value={currentAddress.area}
                                onChange={(e) =>
                                    setCurrentAddress({ ...currentAddress, area: e.target.value })
                                }
                            />

                            {/* Flat */}
                            <input
                                type="text"
                                placeholder="Flat No / Building Name / Street Name"
                                className="border bg-[#F2F2F2] focus:border-red-500 outline-none text-black p-2 rounded w-full"
                                value={currentAddress.flat}
                                onChange={(e) =>
                                    setCurrentAddress({ ...currentAddress, flat: e.target.value })
                                }
                            />

                            {/* Landmark */}
                            <input
                                type="text"
                                placeholder="Landmark"
                                className="border bg-[#F2F2F2] focus:border-red-500 outline-none text-black p-2 rounded w-full"
                                value={currentAddress.landmark}
                                onChange={(e) =>
                                    setCurrentAddress({ ...currentAddress, landmark: e.target.value })
                                }
                            />

                            {/* City */}
                            <input
                                type="text"
                                placeholder="City"
                                className="border bg-[#F2F2F2] focus:border-red-500 outline-none text-black p-2 rounded w-full"
                                value={currentAddress.city}
                                onChange={(e) =>
                                    setCurrentAddress({ ...currentAddress, city: e.target.value })
                                }
                            />

                            {/* Phone */}
                            <input
                                type="text"
                                placeholder="Phone Number"
                                className="border bg-[#F2F2F2] focus:border-red-500 outline-none text-black p-2 rounded w-full"
                                value={currentAddress.phone}
                                onChange={(e) =>
                                    setCurrentAddress({ ...currentAddress, phone: e.target.value })
                                }
                            />

                            {/* HOME / WORK / OTHER */}
                            <div className="flex gap-3 mt-3">
                                {[
                                    { label: "home", icon: <MdHome /> },
                                    { label: "work", icon: <MdWork /> },
                                    { label: "other", icon: <MdLocationOn /> },
                                ].map((opt) => (
                                    <button
                                        key={opt.label}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-full border ${currentAddress.type === opt.label
                                            ? "btn-gradient text-white"
                                            : "text-gray-600"
                                            }`}
                                        onClick={() =>
                                            setCurrentAddress({ ...currentAddress, type: opt.label })
                                        }
                                    >
                                        {opt.icon} {opt.label.toUpperCase()}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={handleSave}
                                className="w-full py-3 rounded-full btn-gradient text-white font-semibold mt-3"
                            >
                                Save & Proceed
                            </button>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
