"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

// Icons
import { FiMail, FiPhone, FiEye, FiEyeOff, FiCheckCircle } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";

// Phone Input
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

// Toast
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function SignupPopup({ open, onClose, setIsOtp, setPhoneNumber, setIsLast }) {
  const [showPopup, setShowPopup] = useState(false);

  // Tabs
  const [activeTab, setActiveTab] = useState("email");

  // Fields
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI State
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [emailSent, setEmailSent] = useState(false); // NEW: Track email verification state
  const router = useRouter();

  // Popup animation
  useEffect(() => {
    if (open) {
      setTimeout(() => setShowPopup(true), 20);
    } else {
      setShowPopup(false);
      handleReset();
    }
  }, [open]);

  // Reset all fields
  const handleReset = () => {
    setEmail("");
    setPhone("");
    setPassword("");
    setConfirmPassword("");
    setErrors({});
    setEmailSent(false); // Reset email sent state
  };

  // --------------------------------
  // Email Validation
  // --------------------------------
  const validateEmailForm = () => {
    const errs = {};
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;

    if (!email.trim()) {
      errs.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      errs.email = "Invalid email address";
    }

    if (!password) {
      errs.password = "Password is required";
    } else if (password.length < 8) {
      errs.password = "Password must be at least 8 characters";
    } else if (!strongPasswordRegex.test(password)) {
      errs.password = "Use uppercase, lowercase, number & special character";
    }

    if (!confirmPassword) {
      errs.confirmPassword = "Confirm password is required";
    } else if (password !== confirmPassword) {
      errs.confirmPassword = "Passwords do not match";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const preventCopyPaste = (e) => {
    e.preventDefault();
    toast.error("Copy / Paste is not allowed for security reasons");
  };

  // --------------------------------
  // Phone Validation
  // --------------------------------
  const validatePhoneForm = () => {
    const errs = {};

    const clean = phone.replace(/\D/g, "");
    const last10 = clean.slice(-10);

    if (!phone) errs.phone = "Phone number required";
    else if (!/^[6-9]\d{9}$/.test(last10)) errs.phone = "Invalid phone number";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // --------------------------------
  // EMAIL SIGNUP - FIXED VERSION
  // --------------------------------
  const handleEmailSignup = async () => {
    if (!validateEmailForm()) return;

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`, // Important: Set redirect URL
      },
    });

    setLoading(false);

    if (error) {
      // Handle specific errors
      if (error.message.includes("already registered")) {
        toast.error("This email is already registered. Please login instead.");
      } else {
        toast.error(error.message);
      }
      return;
    }

    // Show verification screen instead of closing
    setEmailSent(true);
    toast.success("Verification email sent! Please check your inbox.");
  };

  // --------------------------------
  // PHONE OTP SIGNUP
  // --------------------------------
  const handleSendOtp = async () => {
    if (!validatePhoneForm()) return;

    setLoading(true);

    const { error } = await supabase.auth.signInWithOtp({
      phone: `+${phone}`,
    });

    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("OTP sent successfully!");

    setPhoneNumber(phone);
    setIsOtp(true);
    onClose();
    handleReset();
  };

  // Google Login
  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      toast.error(error.message);
    }
  };

  // NEW: Handle going back to login after email verification
  const handleBackToLogin = () => {
    setEmailSent(false);
    handleReset();
    onClose();
    // You might want to trigger opening the login popup here
    // setIsLast(false); // or whatever triggers the login popup
  };

  return (
    <>
      {open && (
        <div
          className={`fixed z-[999] inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300 
            ${showPopup ? "opacity-100" : "opacity-0"}`}
        >
          <div
            className={`bg-white w-full max-w-md mx-4 p-8 rounded-3xl shadow-lg transition-all duration-300 transform 
            ${showPopup ? "scale-100" : "scale-90"}`}
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-xl"
            >
              ✕
            </button>

            {/* EMAIL VERIFICATION SUCCESS SCREEN */}
            {emailSent ? (
              <div className="text-center py-8">
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                    <FiCheckCircle className="text-green-600 text-5xl" />
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-black mb-4">
                  Verify Your Email
                </h2>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-gray-700 mb-2">
                    We've sent a verification link to:
                  </p>
                  <p className="font-semibold text-black text-lg mb-3">{email}</p>
                  <p className="text-sm text-gray-600">
                    Please check your inbox and click the verification link to activate your account.
                  </p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-700">
                    <strong>Important:</strong> You cannot login until you verify your email.
                    The link expires in 24 hours.
                  </p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleBackToLogin}
                    className="w-full bg-primary text-white font-semibold py-3 rounded-full text-lg hover:bg-red-700 transition"
                  >
                    Back to Login
                  </button>

                  <button
                    onClick={handleReset}
                    className="w-full border-2 border-gray-300 text-gray-700 font-semibold py-3 rounded-full text-lg hover:bg-gray-50 transition"
                  >
                    Sign up with different email
                  </button>
                </div>

                <p className="text-xs text-gray-500 mt-4">
                  Didn't receive the email? Check your spam folder or contact support.
                </p>
              </div>
            ) : (
              <>
                {/* NORMAL SIGNUP FORM */}
                <h2 className="text-center text-3xl font-semibold text-black">Sign Up</h2>
                <p className="text-center text-gray-500 text-sm mb-6">
                  Sign up to continue to our website
                </p>

                {/* Tabs */}
                <div className="grid grid-cols-2 mb-6 gap-10 pb-2">
                  <button
                    onClick={() => setActiveTab("email")}
                    className={`justify-center flex items-center gap-2 pb-2 
                    ${activeTab === "email" ? "text-red-600 border-b-2 border-red-600" : "text-gray-500"}`}
                  >
                    <FiMail size={18} /> Email
                  </button>

                  <button
                    onClick={() => setActiveTab("phone")}
                    className={`flex items-center justify-center gap-2 pb-2 
                    ${activeTab === "phone" ? "text-red-600 border-b-2 border-red-600" : "text-gray-500"}`}
                  >
                    <FiPhone size={18} /> Phone
                  </button>
                </div>

                {/* Errors */}
                {errors.api && <p className="text-red-500 text-sm mb-3">{errors.api}</p>}

                {/* EMAIL FORM */}
                {activeTab === "email" && (
                  <>
                    {/* Email */}
                    <div className="mb-4">
                      <label className="font-semibold text-black text-sm">Email *</label>
                      <input
                        type="email"
                        className="w-full mt-1 text-black px-4 py-3 border focus:border-red-500 outline-none rounded-xl"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    {/* Password */}
                    <div className="mb-4 relative">
                      <label className="font-semibold text-black text-sm">Password *</label>
                      <input
                        type={showPass ? "text" : "password"}
                        className="w-full mt-1 px-4 py-3 border rounded-xl outline-none focus:border-red-500"
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
                      {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                    </div>

                    {/* Confirm Password */}
                    <div className="mb-6 relative">
                      <label className="font-semibold text-black text-sm">Confirm Password *</label>
                      <input
                        type={showConfirmPass ? "text" : "password"}
                        className="w-full mt-1 px-4 py-3 border rounded-xl outline-none focus:border-red-500"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onPaste={preventCopyPaste}
                        onCopy={preventCopyPaste}
                        onCut={preventCopyPaste}
                        autoComplete="new-password"
                      />
                      <span
                        className="absolute right-4 top-10 cursor-pointer text-gray-500"
                        onClick={() => setShowConfirmPass(!showConfirmPass)}
                      >
                        {showConfirmPass ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        Must include uppercase, lowercase, number & special character
                      </p>

                      {errors.confirmPassword && (
                        <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                      )}
                    </div>

                    {/* Submit */}
                    <button
                      className="w-full bg-primary text-white font-semibold py-3 rounded-full text-lg flex justify-center items-center gap-2"
                      disabled={loading}
                      onClick={handleEmailSignup}
                    >
                      {loading && <span className="loader"></span>}
                      {loading ? "Creating..." : "Sign Up"}
                    </button>

                    {/* Google */}
                    <div className="flex justify-center mt-4">
                      <button className="border px-5 py-2 rounded-lg hover:bg-gray-100 transition" onClick={loginWithGoogle}>
                        <FcGoogle size={40} />
                      </button>
                    </div>

                    {/* Terms */}
                    <div className="text-center text-black mt-5">
                      <p>By registering, you agree to our</p>
                      <p>
                        <a href="/terms-of-use" className="text-primary underline">Terms of service</a> and{" "}
                        <a href="/privacyPolicy" className="text-primary underline">Privacy Policy</a>
                      </p>
                    </div>
                  </>
                )}

                {/* PHONE FORM */}
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
                      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>

                    {/* Info message for phone signup */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                      <p className="text-xs text-gray-700">
                        You'll receive a one-time password (OTP) via SMS to verify your number.
                      </p>
                    </div>

                    {/* Send OTP */}
                    <button
                      className="w-full bg-primary text-white font-semibold py-3 rounded-full text-lg flex justify-center items-center gap-2"
                      disabled={loading}
                      onClick={handleSendOtp}
                    >
                      {loading && <span className="loader"></span>}
                      {loading ? "Sending OTP..." : "Send OTP"}
                    </button>

                    {/* Google Login */}
                    <div className="flex justify-center mt-4">
                      <button className="border px-5 py-2 rounded-lg hover:bg-gray-100 transition" onClick={loginWithGoogle}>
                        <FcGoogle size={40} />
                      </button>
                    </div>

                    {/* Terms */}
                    <div className="text-center text-black mt-5">
                      <p>By registering, you agree to our</p>
                      <p>
                        <a href="/terms-of-use" className="text-primary underline">Terms of service</a> and{" "}
                        <a href="/privacyPolicy" className="text-primary underline">Privacy Policy</a>
                      </p>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}