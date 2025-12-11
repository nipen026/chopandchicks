"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import toast from "react-hot-toast";
export default function OtpVerificationModal({ open, onClose, setIsLast,number,setCreateAccountModal }) {
    const [show, setShow] = useState(false);
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);

    // Animation control
    useEffect(() => {
        if (open) setTimeout(() => setShow(true), 10);
        else setShow(false);
    }, [open]);

    // Auto move to next input
    const handleChange = (value, index) => {
        if (value.length > 1) return;
        const updated = [...otp];
        updated[index] = value;
        setOtp(updated);

        const next = document.getElementById(`otp-${index + 1}`);
        if (value && next) next.focus();
    };
const handleVerifyOtp = async () => {
    const otpCode = otp.join(""); // join 6 digits into one string
    const phoneNumber = number; // replace with actual number

    try {
        const { data, error } = await supabase.auth.verifyOtp({
            phone: phoneNumber,
            token: otpCode,
            type: "sms"
        });

        if (error) {
            toast.error(`OTP Verification Failed: ${error.message}`);
            return;
        }

        console.log("OTP Verified:", data);
        // ✅ success: close modal & mark last step
        onClose();
        setCreateAccountModal(true);
    } catch (err) {
        console.error(err);
        alert("Something went wrong while verifying OTP");
    }
};
    return (
        <>
            {open && (
                <div
                    className={`fixed inset-0 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm
                        z-50 transition-opacity duration-300 ${show ? "opacity-100" : "opacity-0"
                        }`}
                >
                    {/* OTP Box */}
                    <div
                        className={`bg-white w-full max-w-md p-8 rounded-2xl shadow-lg border
                                shadow-[0_0_40px_5px_rgba(255,0,0,0.18)] relative transform
                                transition-all duration-300 ease-out
                                ${show ? "scale-100 translate-y-0 opacity-100" : "scale-75 translate-y-5 opacity-0"}`}
                    >
                        {/* Close */}
                        <button
                            onClick={onClose}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
                        >
                            ✕
                        </button>

                        {/* Title */}
                        <h2 className="text-center text-3xl font-semibold text-black">Verify OTP</h2>
                        <p className="text-center text-gray-500 text-sm mb-6">
                            Enter the 6-digit code sent to your number
                        </p>

                        {/* OTP Inputs */}
                        <div className="flex justify-center gap-3 mb-6">
                            {otp.map((digit, i) => (
                                <input
                                    key={i}
                                    id={`otp-${i}`}
                                    type="text"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(e.target.value, i)}
                                    className="w-12 h-12 text-xl text-black text-center border border-gray-300 rounded-lg
                                    focus:border-red-500 outline-none transition"
                                />
                            ))}
                        </div>

                        {/* Verify Button */}
                        <button className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-full font-semibold" onClick={() => { handleVerifyOtp() }}>
                            Verify OTP
                        </button>

                        {/* Resend */}
                        <p className="text-sm text-gray-600 text-center mt-4">
                            Didn't receive the code?{" "}
                            <button className="text-red-600 font-semibold hover:underline">
                                Resend OTP
                            </button>
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}
