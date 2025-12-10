import React, { useState } from 'react';
import Image from 'next/image';
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { FiMail, FiPhone, FiEye, FiEyeOff } from "react-icons/fi";

export default function CreateAccountModal({ open, onClose }) {
    const [isOpen, setIsOpen] = useState(true);
    const [countryCode, setCountryCode] = useState('+91');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [data, setData] = useState()
    return (
        <>
            {open &&
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl p-10">
                        <h2 className="text-3xl font-semibold text-center mb-8">Create Account</h2>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-700 mb-1">First Name</label>
                                <input type="text" placeholder="Enter First Name" className="w-full border focus:border-red-500 outline-none rounded-xl p-3" />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-1">Last Name</label>
                                <input type="text" placeholder="Enter Last Name" className="w-full border focus:border-red-500 outline-none rounded-xl p-3" />
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-1">Email</label>
                                <input type="email" placeholder="Enter Email ID" className="w-full border focus:border-red-500 outline-none rounded-xl p-3" />
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-1">Phone number</label>
                                {/* <div className="flex items-center border rounded-xl p-3 gap-2 bg-white"> */}
                                <PhoneInput
                                    country={"in"}
                                    value={data}
                                    onChange={setData}
                                    inputClass="!w-full !h-[48px] !rounded-lg"
                                    containerClass="!w-full"
                                    buttonClass="!bg-white !rounded-s-lg"
                                    dropdownClass="text-black "
                                    placeholder="Enter Mobile Number"
                                />
                                {/* </div> */}
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-1">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Enter password"
                                        className="w-full border focus:border-red-500 outline-none rounded-xl p-3 pr-10"
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-4 text-gray-500"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <FiEyeOff /> : <FiEye />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-1">Confirm password</label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        placeholder="Confirm password"
                                        className="w-full border focus:border-red-500 outline-none rounded-xl p-3 pr-10"
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-4 text-gray-500"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button className="w-full mt-8 bg-red-600 text-white rounded-full py-3 text-lg" onClick={()=>{onclose(); setIsLast(true)}}>Create account</button>
                    </div>
                </div>}
        </>
    );
}
