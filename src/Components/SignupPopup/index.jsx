"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

// React Icons
import { FiMail, FiPhone, FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

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
    if (password !== confirmPassword)
      errs.confirmPassword = "Passwords do not match";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validatePhoneForm = () => {
    const errs = {};

    // react-phone-input-2 returns full international number => extract last 10 digits
    const cleanedPhone = phone.replace(/\D/g, "");
    const last10 = cleanedPhone.slice(-10);

    if (!phone) errs.phone = "Phone number required";
    else if (!/^[6-9]\d{9}$/.test(last10)) errs.phone = "Invalid phone number";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ------------------------
  // EMAIL SIGNUP
  // ------------------------
  const handleEmailSignup = async () => {
    if (!validateEmailForm()) return;

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setLoading(false);
      return setErrors({ api: error.message });
    }

    const user = data?.user;
    if (!user) {
      setLoading(false);
      return setErrors({ api: "Signup failed. Try again." });
    }

    // Check if user_account exists
    const { data: user_account } = await supabase
      .from("user_account")
      .select("*")
      .eq("id", user.id)
      .single();

    // Create user_account if missing
    if (!user_account) {
      await supabase.from("user_account").insert({
        id: user.id,
        email: user.email,
      });
    }

    // Save local
    localStorage.setItem("user_account_id", user.id);

    setLoading(false);
    onClose();
  };

  // ------------------------
  // PHONE SIGNUP
  // ------------------------
  const handleSendOtp = async () => {
    if (!validatePhoneForm()) return;

    setLoading(true);

    let { error } = await supabase.auth.signInWithOtp({
      phone: `+${phone}`,
    });

    setPhoneNumber(phone);
    setLoading(false);

    if (error) return setErrors({ api: error.message });

    setIsOtp(true);
    onClose();
  };

  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  };

  return (
    <>
      {open && (
        <div
          className={`fixed z-[999] inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300 ${
            showPopup ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className={`bg-white w-full z-[999] max-w-md mx-4 p-8 rounded-3xl shadow-lg transition-all duration-300 transform ${
              showPopup ? "scale-100" : "scale-90"
            }`}
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-xl"
            >
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
                className={`justify-center flex items-center gap-2 pb-2 ${
                  activeTab === "email"
                    ? "text-red-600 border-b-2 border-red-600"
                    : "text-gray-500"
                }`}
              >
                <FiMail size={18} /> Email
              </button>

              <button
                onClick={() => setActiveTab("phone")}
                className={`flex items-center justify-center gap-2 pb-2 ${
                  activeTab === "phone"
                    ? "text-red-600 border-b-2 border-red-600"
                    : "text-gray-500"
                }`}
              >
                <FiPhone size={18} /> Phone
              </button>
            </div>

            {errors.api && <p className="text-red-500 text-sm mb-3">{errors.api}</p>}

            {/* ---------------------- EMAIL FORM ------------------------ */}
            {activeTab === "email" && (
              <>
                <div className="mb-4">
                  <label className="font-semibold text-black text-sm">Email *</label>
                  <input
                    type="email"
                    className="w-full mt-1 text-black px-4 py-3 border focus:border-red-500 outline-none transition rounded-xl"
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
                    className="w-full mt-1 px-4 py-3 border focus:border-red-500 outline-none transition rounded-xl"
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
                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                  )}
                </div>

                <div className="mb-6 relative">
                  <label className="font-semibold text-black text-sm">
                    Confirm Password *
                  </label>
                  <input
                    type={showConfirmPass ? "text" : "password"}
                    className="w-full mt-1 px-4 py-3 border focus:border-red-500 outline-none transition rounded-xl"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <span
                    className="absolute right-4 top-10 cursor-pointer text-gray-500"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                  >
                    {showConfirmPass ? <FiEyeOff size={20} /> : <FiEye size={20} />}
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
                  <button className="border px-5 py-2 rounded-lg hover:bg-gray-100 transition">
                    <FcGoogle size={40} />
                  </button>
                </div>

                <div className="text-center text-black mt-5">
                  <p>By registering, you agree to our</p>
                  <p>
                    <a href="/" className="text-primary underline">Terms of services</a> and{" "}
                    <a href="/" className="text-primary underline">Privacy Policy</a>
                  </p>
                </div>
              </>
            )}

            {/* ---------------------- PHONE FORM ------------------------ */}
            {activeTab === "phone" && (
              <>
                <div className="mb-4">
                  <label className="font-semibold text-black text-sm">Mobile No *</label>
                  <PhoneInput
                    country={"in"}
                    value={phone}
                    onChange={setPhone}
                    inputClass="!w-full !h-[48px] !rounded-lg"
                    containerClass="!w-full"
                    buttonClass="!bg-white !rounded-s-lg"
                    dropdownClass="text-black"
                    placeholder="Enter Mobile Number"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>

                <button
                  className="w-full btn-gradient text-white font-semibold py-3 rounded-full text-lg"
                  disabled={loading}
                  onClick={handleSendOtp}
                >
                  {loading ? "Sending OTP..." : "Send OTP"}
                </button>

                <div className="flex justify-center mt-4">
                  <button className="border px-5 py-2 rounded-lg hover:bg-gray-100 transition">
                    <FcGoogle size={40} />
                  </button>
                </div>

                <div className="text-center text-black mt-5">
                  <p>By registering, you agree to our</p>
                  <p>
                    <a href="/" className="text-primary underline">Terms of services</a> and{" "}
                    <a href="/" className="text-primary underline">Privacy Policy</a>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
