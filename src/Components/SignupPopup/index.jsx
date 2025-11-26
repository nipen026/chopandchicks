"use client";
import { useEffect, useState } from "react";

export default function SignupPopup({ open, onClose,setIsOtp }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (open) {
      setTimeout(() => setShow(true), 10); // delay for animation start
    } else {
      setShow(false);
    }
  }, [open]);

  return (
    <>
      {open && (
        <div
          className={`fixed inset-0 flex items-center justify-center p-4 z-50
          bg-black/40 backdrop-blur-sm transition-opacity duration-300
          ${show ? "opacity-100" : "opacity-0"}`}
        >
          {/* POPUP CARD */}
          <div
            className={`bg-white w-full max-w-md p-8 rounded-2xl shadow-lg border
            shadow-[0_0_40px_5px_rgba(255,0,0,0.18)] relative transform
            transition-all duration-300 ease-out
            ${show ? "scale-100 translate-y-0 opacity-100" : "scale-75 translate-y-5 opacity-0"}`}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
            >
              ✕
            </button>

            {/* Headings */}
            <h2 className="text-center text-3xl font-semibold text-gray-800">Sign Up</h2>
            <p className="text-center text-gray-500 text-sm mb-6">
              Enter the Phone Number
            </p>

            {/* Input */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Mobile No
              </label>
              <input
                type="text"
                placeholder="Mobile Number"
                className="w-full border border-gray-300 rounded-lg px-4 py-3
                focus:border-red-500 outline-none transition"
              />
            </div>

            {/* Button */}
            <button
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold
              py-3 rounded-full mt-4 transition"
              onClick={()=>{setIsOtp(true);onClose()}}
            >
              Send OTP
            </button>
          </div>
        </div>
      )}
    </>
  );
}
