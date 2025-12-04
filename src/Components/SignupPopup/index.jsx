"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

// React Icons
import { FiMail, FiPhone, FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";

export default function SignupPopup({ open, onClose, setIsOtp, setPhoneNumber }) {
  const [showPopup, setShowPopup] = useState(false);

  // Tabs
  const [activeTab, setActiveTab] = useState("email");

  // Email fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Phone fields
  const [phone, setPhone] = useState("");

  // UI State
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // Popup animation
  useEffect(() => {
    if (open) setTimeout(() => setShowPopup(true), 20);
    else setShowPopup(false);
  }, [open]);

  // ------------------------
  // VALIDATIONS
  // ------------------------
  const validateEmailForm = () => {
    const errs = {};

    if (!email.trim()) errs.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = "Invalid email";

    if (!password) errs.password = "Password is required";
    if (password.length < 6) errs.password = "Password must be 6+ chars";

    if (!confirmPassword) errs.confirmPassword = "Confirm password";
    if (password !== confirmPassword) errs.confirmPassword = "Passwords do not match";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validatePhoneForm = () => {
    const errs = {};
    if (!phone) errs.phone = "Phone number required";
    else if (!/^[6-9]\d{9}$/.test(phone)) errs.phone = "Invalid phone number";
    if (!password) errs.password = "Password is required";
    if (password.length < 6) errs.password = "Password must be 6+ chars";

    if (!confirmPassword) errs.confirmPassword = "Confirm password";
    if (password !== confirmPassword) errs.confirmPassword = "Passwords do not match";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ------------------------
  // EMAIL SIGNUP
  // ------------------------
  const handleEmailSignup = async () => {
    if (!validateEmailForm()) return;

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    setLoading(false);

    if (error) return setErrors({ api: error.message });

    onClose();
  };

  // ------------------------
  // PHONE SIGNUP
  // ------------------------
  const handleSendOtp = async () => {
    if (!validatePhoneForm()) return;

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      phone: `+91${phone}`,
      password
    });
    setPhoneNumber(phone)
    setLoading(false);

    if (error) return setErrors({ api: error.message });

    setIsOtp(true);
    onClose();
  };
  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });

    if (error) {
      setErrMsg("Google login failed. Try again.");
    }
  };
  return (
    <>
      {open && (
        <div
          className={`fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300 ${showPopup ? "opacity-100" : "opacity-0"
            }`}
        >
          <div className={`bg-white w-full max-w-md mx-4 p-8 rounded-3xl shadow-lg transition-all duration-300 transform ${showPopup ? "scale-100" : "scale-90"}`}>
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-xl">
              ✕
            </button>

            {/* Logo */}
            <div className="flex justify-center mb-4">
              <img
                src="/assets/footer_logo.png"
                alt="logo"
                className="w-28 h-28 object-cover"
              />
            </div>

            {/* Tabs */}
            <div className="grid grid-cols-2 mb-6 gap-10 pb-2">
              <button
                onClick={() => setActiveTab("email")}
                className={`justify-center flex items-center gap-2 pb-2 ${activeTab === "email"
                  ? "text-red-600 border-b-2 border-red-600"
                  : "text-gray-500"
                  }`}
              >
                <FiMail size={18} /> Email
              </button>

              <button
                onClick={() => setActiveTab("phone")}
                className={`flex items-center justify-center gap-2 pb-2 ${activeTab === "phone"
                  ? "text-red-600 border-b-2 border-red-600"
                  : "text-gray-500"
                  }`}
              >
                <FiPhone size={18} /> Phone
              </button>
            </div>

            {errors.api && (
              <p className="text-red-500 text-sm mb-3">{errors.api}</p>
            )}

            {/* ---------------------- EMAIL FORM ------------------------ */}
            {activeTab === "email" && (
              <>
                <div className="mb-4">
                  <label className="font-semibold text-black text-sm">Email *</label>
                  <input
                    type="email"
                    className="w-full mt-1 px-4 py-3 border text-black focus:border-red-500 outline-none transition rounded-xl "
                    placeholder="Enter Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div className="mb-4 relative">
                  <label className="font-semibold text-black text-sm">Password *</label>
                  <input
                    type={showPass ? "text" : "password"}
                    className="w-full mt-1 px-4 py-3 border text-black focus:border-red-500 outline-none transition rounded-xl"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span
                    className="absolute right-4 top-10 cursor-pointer text-gray-500"
                    onClick={() => setShowPass(!showPass)}
                  >
                    {showPass ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </span>
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>

                <div className="mb-6 relative">
                  <label className="font-semibold text-black text-sm">
                    Confirm Password *
                  </label>
                  <input
                    type={showConfirmPass ? "text" : "password"}
                    className="w-full mt-1 px-4 py-3 border text-black focus:border-red-500 outline-none transition rounded-xl"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <span
                    className="absolute right-4 top-10 cursor-pointer text-gray-500"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                  >
                    {showConfirmPass ? (
                      <FiEyeOff size={20} />
                    ) : (
                      <FiEye size={20} />
                    )}
                  </span>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                <button
                  className="w-full btn-gradient text-white font-semibold py-3 rounded-full text-lg"
                  disabled={loading}
                  onClick={handleEmailSignup}
                >
                  {loading ? "Creating..." : "Sign Up"}
                </button>

                <div className="flex justify-center mt-4">
                  <button onClick={() => loginWithGoogle()} className="border px-5 py-2 rounded-lg hover:bg-gray-100 transition ">
                    <FcGoogle size={40} />
                  </button>
                </div>
                <div className="text-center mt-5">
                  <p className="text-center">By registering , you agree to your </p>
                  <p><a href="/" className="text-primary underline">Terms of services</a> and <a href="/" className="text-primary underline">Privacy Policy</a> </p>
                </div>
              </>
            )}

            {/* ---------------------- PHONE FORM ------------------------ */}
            {activeTab === "phone" && (
              <>
                <div className="mb-4">
                  <label className="font-semibold text-sm">Mobile No *</label>
                  <input
                    type="text"
                    className="w-full mt-1 px-4 py-3 focus:border-red-500 outline-none border rounded-xl"
                    placeholder="Enter phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>
                <div className="mb-4 relative">
                  <label className="font-semibold text-sm">Password *</label>
                  <input
                    type={showPass ? "text" : "password"}
                    className="w-full mt-1 px-4 py-3 border focus:border-red-500 outline-none transition rounded-xl"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span
                    className="absolute right-4 top-[2.7rem] cursor-pointer text-gray-500"
                    onClick={() => setShowPass(!showPass)}
                  >
                    {showPass ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </span>
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>

                <div className="mb-6 relative">
                  <label className="font-semibold text-sm">
                    Confirm Password *
                  </label>
                  <input
                    type={showConfirmPass ? "text" : "password"}
                    className="w-full mt-1 px-4 py-3 border  focus:border-red-500 outline-none transition rounded-xl"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <span
                    className="absolute right-4 top-[2.7rem] cursor-pointer text-gray-500"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                  >
                    {showConfirmPass ? (
                      <FiEyeOff size={20} />
                    ) : (
                      <FiEye size={20} />
                    )}
                  </span>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
                <button
                  className="w-full btn-gradient hover:bg-red-700 text-white font-semibold py-3 rounded-full text-lg"
                  disabled={loading}
                  onClick={handleSendOtp}
                >
                  {loading ? "Sending OTP..." : "Send OTP"}
                </button>

                <div className="flex justify-center mt-4">
                  <button onClick={() => loginWithGoogle()} className="border px-5 py-2 rounded-lg hover:bg-gray-100 transition ">
                    <FcGoogle size={40} />
                  </button>
                </div>
                <div className="text-center mt-5">
                  <p className="text-center">By registering , you agree to your </p>
                  <p><a href="/" className="text-primary underline">Terms of services</a> and <a href="/" className="text-primary underline">Privacy Policy</a> </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
