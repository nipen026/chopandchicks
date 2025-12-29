"use client"

import PaymentMethod from "../../Components/PaymentMethod";
import React, { useEffect, useState } from "react";
import { MdHome, MdWork, MdLocationOn } from "react-icons/md";
import { supabase } from "../../lib/supabaseClient";

export default function Address() {
    const [addresses, setAddresses] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [currentAddress, setCurrentAddress] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [method, setMethod] = useState('shipping');
    const [selectedAddressId, setSelectedAddressId] = useState(null);

    const maxAddresses = 5;

    const openAddNew = () => {
        if (addresses.length >= maxAddresses) return;
        setCurrentAddress({ id: Date.now(), full_name: "", contact_number: "", email: "", city: "", state: "", country: "", address: "", postal_code: "" });
        setIsEditMode(false);
        setShowModal(true);
    };

    const openEdit = (addr) => {
        setCurrentAddress({ ...addr });
        setIsEditMode(true);
        setShowModal(true);
    };
    useEffect(() => {
        const savedId = localStorage.getItem("selected_address_id");
        if (savedId) {
            setSelectedAddressId(Number(savedId));
        }
    }, []);
    const handleSelectAddress = (id) => {
        setSelectedAddressId(id);
        localStorage.setItem("selected_address_id", id);
    };
    const handleSave = async () => {
        try {
            const { data: authData } = await supabase.auth.getUser();
            const user = authData?.user;

            if (!user) {
                alert("Login required");
                return;
            }

            // Build correct address_line field
            

            const payload = {
                p_id: isEditMode ? currentAddress.id : null,
                p_full_name: currentAddress.full_name || "User",
                p_contact_number: currentAddress.contact_number || "",
                p_address_line: currentAddress.address_line || "",
                p_flat_house_building: currentAddress.flat_house_building || "",
                p_landmark: currentAddress.landmark || "",
                p_city: currentAddress.city || "",
                p_state: currentAddress.state || "",
                p_country: currentAddress.country || "",
                p_postal_code: currentAddress.postal_code || "",
                p_latitude: currentAddress.lat ?? null,
                p_longitude: currentAddress.lng ?? null,
                p_address_type: currentAddress.address_type || "home",
            };

            console.log("FINAL PAYLOAD →", payload);

            const { data, error } = await supabase.rpc("upsert_user_address", payload);

            if (error) {
                console.error(error);
                return alert("Error saving address");
            }

            const savedId = data?.id ?? currentAddress.id;

            const newAddressObj = { ...currentAddress, id: savedId };

            if (isEditMode) {
                setAddresses(prev => prev.map(a =>
                    a.id === savedId ? newAddressObj : a
                ));
            } else {
                setAddresses(prev => [...prev, newAddressObj]);
            }

            setShowModal(false);

        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        const fetchAddresses = async () => {
            const { data, error } = await supabase
                .from("user_address")
                .select("*");

            if (!error) {
                setAddresses(data);
            }
            if (data.length === 0) {
                setShowModal(true);
                setIsEditMode(false)
            }
            if (data.length > 0 && !localStorage.getItem("selected_address_id")) {
                setSelectedAddressId(data[0].id);
                localStorage.setItem("selected_address_id", data[0].id);
            }
        };

        fetchAddresses();
    }, []);

    return (
        <div className="min-h-screen pt-8">
            <div className="container flex justify-center">
                {method == 'shipping' ?
                    <div className="w-full bg-white shadow-lg rounded-2xl p-8">
                        <h2 className="text-2xl font-semibold mb-6">SAVED ADDRESS</h2>

                        {/* Address List */}
                        <div className="space-y-6">
                            {addresses.map((addr) => {
                                console.log(addr);

                                return (
                                    <div
                                        key={addr.id}
                                        onClick={() => handleSelectAddress(addr.id)}
                                        className={`rounded-xl p-4 cursor-pointer transition-all border-2`}
                                    >

                                        <div className="flex items-center justify-between mb-3">
                                            <p className="text-sm font-medium text-black">Shipping Address</p>

                                            <div className="flex items-center gap-3 text-red-500 text-sm font-medium">
                                                <button onClick={() => openEdit(addr)}>Edit</button>
                                                {addresses.length < maxAddresses && (
                                                    <button onClick={openAddNew}>Add New</button>
                                                )}
                                            </div>
                                        </div>

                                        <div className={selectedAddressId === addr.id ? "border-2 border-primary border rounded-lg p-4 bg-gray-50 text-sm leading-6" : "border border-gray-300 rounded-lg p-4 bg-gray-50 text-sm leading-6"}>
                                            <p>{addr.full_name}</p>
                                            <p>{addr.contact_number}</p>
                                            <p>{addr.city},</p>
                                            <p>{addr.state},</p>
                                            <p>{addr.country},</p>
                                            <p>{addr.address_line}</p>
                                            <p>{addr.postal_code}</p>
                                            <p>{addr.address_type}</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Save Checkbox */}
                        <div className="flex items-center gap-3 mt-6">
                            <input type="checkbox" defaultChecked className="w-4 h-4 accent-red-600" />
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
                        {/* FORM */}
                        <div className="w-1/2 space-y-4">

                            <h2 className="text-xl font-semibold">
                                {isEditMode ? "Edit Address" : "Add New Address"}
                            </h2>

                            {/* Full Name */}
                            <input
                                type="text"
                                placeholder="Full Name"
                                className="border bg-[#F2F2F2] p-2 rounded w-full"
                                value={currentAddress?.full_name}
                                onChange={(e) =>
                                    setCurrentAddress({ ...currentAddress, full_name: e.target.value })
                                }
                            />

                            {/* Phone */}
                            <input
                                type="text"
                                placeholder="Phone Number"
                                className="border bg-[#F2F2F2] p-2 rounded w-full"
                                value={currentAddress?.contact_number}
                                onChange={(e) =>
                                    setCurrentAddress({ ...currentAddress, contact_number: e.target.value })
                                }
                            />

                            {/* Area */}
                            <input
                                type="text"
                                placeholder="Area / Locality"
                                className="border bg-[#F2F2F2] p-2 rounded w-full"
                                value={currentAddress?.address_line}
                                onChange={(e) =>
                                    setCurrentAddress({ ...currentAddress, address_line: e.target.value })
                                }
                            />

                            {/* Flat */}
                            <input
                                type="text"
                                placeholder="Flat / Building / Street"
                                className="border bg-[#F2F2F2] p-2 rounded w-full"
                                value={currentAddress?.flat_house_building}
                                onChange={(e) =>
                                    setCurrentAddress({ ...currentAddress, flat_house_building: e.target.value })
                                }
                            />

                            {/* Landmark */}
                            <input
                                type="text"
                                placeholder="Landmark"
                                className="border bg-[#F2F2F2] p-2 rounded w-full"
                                value={currentAddress?.landmark}
                                onChange={(e) =>
                                    setCurrentAddress({ ...currentAddress, landmark: e.target.value })
                                }
                            />

                            {/* City */}
                            <input
                                type="text"
                                placeholder="City"
                                className="border bg-[#F2F2F2] p-2 rounded w-full"
                                value={currentAddress?.city}
                                onChange={(e) =>
                                    setCurrentAddress({ ...currentAddress, city: e.target.value })
                                }
                            />

                            {/* State */}
                            <input
                                type="text"
                                placeholder="State"
                                className="border bg-[#F2F2F2] p-2 rounded w-full"
                                value={currentAddress?.state}
                                onChange={(e) =>
                                    setCurrentAddress({ ...currentAddress, state: e.target.value })
                                }
                            />
                            <input
                                type="text"
                                placeholder="Country"
                                className="border bg-[#F2F2F2] p-2 rounded w-full"
                                value={currentAddress?.country}
                                onChange={(e) =>
                                    setCurrentAddress({ ...currentAddress, country: e.target.value })
                                }
                            />

                            {/* postal_code */}
                            <input
                                type="text"
                                placeholder="Postal Code"
                                className="border bg-[#F2F2F2] p-2 rounded w-full"
                                value={currentAddress?.postal_code}
                                onChange={(e) =>
                                    setCurrentAddress({ ...currentAddress, postal_code: e.target.value })
                                }
                            />

                            {/* HOME / WORK / OTHER */}
                            <div className="flex gap-3 mt-3">
                                {[
                                    { label: "home", icon: <MdHome /> },
                                    { label: "work", icon: <MdWork /> },
                                    { label: "other", icon: <MdLocationOn /> },
                                ].map(opt => (
                                    <button
                                        key={opt.label}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-full border 
                                         ${currentAddress?.address_type === opt.label ? "btn-gradient text-white" : "text-gray-600"}`}
                                        onClick={() =>
                                            setCurrentAddress({ ...currentAddress, address_type: opt.label })
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
