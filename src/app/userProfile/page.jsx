"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { FaUpload, FaUser } from "react-icons/fa";
import { IoBagCheck } from "react-icons/io5";
import { MdOutlineLogout } from "react-icons/md";
import { supabase } from "../../lib/supabaseClient";
import toast from "react-hot-toast";
import OrderDetails from "../OrderDetails/page";
import OrderTable from "../../Components/OrderTable";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import ChatScreen from "../../Components/ChatScreen";


export default function ProfilePage() {
  const [active, setActive] = useState("profile");
  const [user, setUser] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  // Form states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [emailLocked, setEmailLocked] = useState(false);
  const [phoneLocked, setPhoneLocked] = useState(false);
  const nameRegex = /^[A-Za-z\s]*$/;
  const phoneRegex = /^[0-9]*$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const router = useRouter();
  console.log(orderId, 'orderId');
  useEffect(() => {
    if (orderId) {
      // Fetch order details using orderId
      setActive("orders");
    }
  }, [orderId])

  // ---------------- Fetch Logged-in User ----------------
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (!error && data?.user) {
        const u = data.user;
        setUser(u);

        const fullName = u.user_metadata?.full_name || "";
        const [f, l] = fullName.split(" ");

        setFirstName(f || "");
        setLastName(l || "");
        setEmail(u.email || u.new_email);
        setPhone(u.user_metadata?.phone || "");
        setAvatarUrl(u.user_metadata?.avatar_url || null);
        setEmailLocked(!!u.email || !!u.new_email);
        setPhoneLocked(!!u.user_metadata?.phone);

      }
    };

    fetchUser();
  }, []);

  // ---------------- Update Profile API ----------------
  const handleUpdate = async () => {
    setMsg("");

    if (!firstName.trim()) {
      setMsg("First name is required");
      return;
    }

    if (!lastName.trim()) {
      setMsg("Last name is required");
      return;
    }

    if (!emailRegex.test(email)) {
      setMsg("Please enter a valid email address");
      return;
    }

    if (phone && phone.length !== 10) {
      setMsg("Phone number must be 10 digits");
      return;
    }

    setLoading(true);

    const full_name = `${firstName} ${lastName}`;

    const { data, error } = await supabase.auth.updateUser({
      email,
      data: {
        full_name,
        phone,
      },
    });

    setLoading(false);

    if (error) {
      setMsg(error.message);
      return;
    }

    setMsg("Profile updated successfully!");
    setUser(data.user);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !user) return;

    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    setLoading(true);

    const { error: uploadError } = await supabase.storage
      .from("user_images")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      toast.error(uploadError.message);
      setLoading(false);
      return;
    }

    const { data } = supabase.storage
      .from("user_images")
      .getPublicUrl(filePath);

    const publicUrl = data.publicUrl;

    // Save image URL in user metadata
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        avatar_url: publicUrl,
      },
    });

    if (updateError) {
      toast.error(updateError.message);
    } else {
      setAvatarUrl(publicUrl);
      toast.success("Profile image updated");
    }

    setLoading(false);
  };

  // ---------------- Logout ----------------
  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("auth-token");
    localStorage.removeItem("userId");
    window.dispatchEvent(new Event("auth-change"));
    router.push("/");
  };

  return (
    <div className="min-h-screen py-10">
      <h1 className="text-center text-3xl font-semibold text-gray-800 mb-10">
        {active === "profile" ? "My Profile" : "My Orders"}
      </h1>

      <div className="container mx-auto flex flex-col md:flex-row gap-10 px-4">
        {/* ---------------- Sidebar ---------------- */}
        <div className="w-full md:w-1/4">
          <div className="bg-white shadow-md rounded-2xl py-6 px-4">
            <div className="flex flex-col items-center">
              <Image
                src={avatarUrl || "/assets/footer_logo.png"}
                width={90}
                height={90}
                draggable={false}
                alt="User"
                className="rounded-full w-[90px] h-[90px] object-cover"
              />
              <p className="mt-3 font-medium text-gray-700 text-lg">
                {firstName + " " + lastName}
              </p>
            </div>

            <div className="mt-8 space-y-3">
              <button
                onClick={() => setActive("profile")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition font-medium ${active === "profile"
                  ? "bg-red-500 text-white"
                  : "text-gray-700 hover:bg-gray-100"
                  }`}
              >
                <FaUser /> My Profile
              </button>

              <button
                onClick={() => setActive("orders")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition font-medium ${active === "orders"
                  ? "bg-red-500 text-white"
                  : "text-gray-700 hover:bg-gray-100"
                  }`}
              >
                <IoBagCheck /> My Orders
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition"
              >
                <MdOutlineLogout /> Logout
              </button>
            </div>
          </div>
        </div>

        {/* ---------------- Profile Form ---------------- */}
        {active === "profile" && (
          <div className="w-full md:w-3/4">
            <div className="bg-white rounded-2xl shadow-md p-8">
              <h2 className="text-xl font-semibold text-red-600 mb-6">
                Profile Settings
              </h2>

              <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
                {/* Profile Picture */}
                <div className="relative">
                  <Image
                    src={avatarUrl || "/assets/footer_logo.png"}
                    width={90}
                    height={90}
                    alt="User"
                    draggable={false}
                    className="rounded-full w-[90px] h-[90px] object-cover"
                  />

                  <label
                    htmlFor="upload"
                    className="absolute bottom-0 right-0 bg-red-500 text-white p-2 rounded-full cursor-pointer hover:bg-red-600"
                  >
                    <FaUpload />
                  </label>
                  <input
                    type="file"
                    id="upload"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>

                <p className="font-medium text-lg text-gray-700">
                  {firstName + " " + lastName}
                </p>
              </div>

              {/* ---------------- Form Fields ---------------- */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    First Name*
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    maxLength={10}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (nameRegex.test(value)) {
                        setFirstName(value);
                      }
                    }}
                    className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-3"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    Last Name*
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    maxLength={10}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (nameRegex.test(value)) {
                        setLastName(value);
                      }
                    }}
                    className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-3"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    Email*
                  </label>
                  <input
                    type="email"
                    disabled={emailLocked}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-3"
                  />

                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    Phone*
                  </label>
                  <input
                    disabled={phoneLocked}
                    type="text"
                    value={phone}
                    maxLength={10}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (phoneRegex.test(value)) {
                        setPhone(value);
                      }
                    }}
                    className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-3"
                  />

                </div>
              </div>

              {/* ---------------- Success / Error Message ---------------- */}
              {msg && (
                <p className="text-center mt-5 text-red-600 font-medium">
                  {msg}
                </p>
              )}
              <div className="flex justify-center mt-10">
                <button
                  onClick={handleUpdate}
                  disabled={loading}
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white px-10 py-3 rounded-full text-lg font-semibold hover:opacity-90 transition"
                >
                  {loading ? "Updating..." : "Update"}
                </button>
              </div>
            </div>
          </div>)}

        {/* ---------------- Orders Section ---------------- */}
        {active === "orders" && !orderId && (
          <OrderTable />
        )}
        {
          active === "orders" && orderId && <ChatScreen orderId={orderId} />
        }

      </div>
    </div>
  );
}
