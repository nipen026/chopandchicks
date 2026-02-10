"use client";
import { supabase } from "../../lib/supabaseClient";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function ForgotPasswordModal({ open, onClose, setIsSignUp, setIsLogin }) {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  useEffect(() => {
    if (open) setTimeout(() => setShow(true), 20);
    else setShow(false);
  }, [open]);
  const handleSubmit = async () => {

    let { data, error } = await supabase.auth.resetPasswordForEmail(email);
    console.log(data, error);
    setIsLogin(true);
    onClose();
    toast.success("Password reset email sent successfully!");
    if (error) {
      toast.error("Failed to send reset email. Please check the email address and try again.");
      console.error("Error resetting password:", error)
      return
    }






  }
  return (
    <>
      {open && (
        <div
          className={`fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50
          transition-opacity duration-300 ${show ? "opacity-100" : "opacity-0"}`}
        >
          <div
            className={`bg-white w-full max-w-md p-8 rounded-2xl shadow-lg border
            shadow-[0_0_40px_4px_rgba(255,0,0,0.18)] relative transform transition-all duration-300
            ${show ? "scale-100 translate-y-0 opacity-100" : "scale-75 translate-y-5 opacity-0"}`}
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl"
            >
              ✕
            </button>

            {/* Heading */}
            <h2 className="text-xl font-semibold text-gray-800 text-center">Forgot password?</h2>

            <label className="block text-sm text-black font-medium mt-6 mb-1">Email</label>
            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@gmail.com"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-red-500 outline-none"
            />

            {/* Continue Button */}
            <button
              onClick={handleSubmit}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 mt-5 rounded-full"
            >
              Continue
            </button>

            {/* Back link */}
            <button
              onClick={() => { onClose(); setIsLogin(true); }}
              className="w-full text-red-600 font-medium text-sm mt-3 hover:underline"
            >
              Back
            </button>
          </div>
        </div>
      )}
    </>
  );
}
