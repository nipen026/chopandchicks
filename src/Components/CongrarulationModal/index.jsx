"use client";
import { useEffect, useState } from "react";

export default function CongratulationModal({ open, onClose,setIsLogin }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (open) setTimeout(() => setShow(true), 20);
    else setShow(false);
  }, [open]);

  return (
    <>
      {open && (
        <div
          className={`fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4
          transition-opacity duration-300 ${show ? "opacity-100" : "opacity-0"}`}
        >
          <div
            className={`bg-white px-8 py-9 rounded-2xl shadow-xl text-center w-full max-w-sm transform
            transition-all duration-300 shadow-[0_0_40px_4px_rgba(255,0,0,0.18)]
            ${show ? "scale-100 opacity-100" : "scale-75 opacity-0"}`}
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Congrats! You have created your account.
            </h2>

            <button
              onClick={()=>{onClose(); setIsLogin(true);}}
              className="mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-full btn-gradient"
            >
              Back to Login
            </button>
          </div>
        </div>
      )}
    </>
  );
}
