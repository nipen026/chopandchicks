"use client"
import Image from "next/image";
import { FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import { useRouter } from "next/navigation";

export default function Footer() {
  const router = useRouter()
  return (
    <footer className="bg-gradient-to-r from-red-900 to-red-600 text-white py-10 mt-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 px-6">

        {/* Logo + App buttons */}
        <div>
          <Image src="/assets/footer_logo.png" width={80} height={80} alt="logo" className="rounded-full" />

          <p className="mt-4 text-sm">Download the app</p>
          <div className="flex gap-3 mt-3">
            <Image src="/assets/playstore.png" width={50} height={30} alt="playstore" />
            <Image src="/assets/appstore.png" width={50} height={30} alt="appstore" />
          </div>
        </div>

        {/* Company */}
        <div>
          <h3 className="font-semibold mb-3">Company</h3>
          <ul className="space-y-2 text-sm">
            <li className="cursor-pointer" onClick={()=>router.push('/about')}>About Us</li>
            <li className="cursor-pointer" onClick={()=>router.push('/features')}>Features</li>
            <li>Refer & Earn</li>
            <li>Support</li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="font-semibold mb-3">Legal</h3>
          <ul className="space-y-2 text-sm">
            <li className="cursor-pointer" onClick={()=>router.push('/terms-of-use')}>Terms of Use</li>
            <li className="cursor-pointer" onClick={()=>router.push('/privacyPolicy')}>Privacy Policy</li>
            <li>FAQ</li>
            <li>Community Rules</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold mb-3">Contact</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2"><FaPhoneAlt /> +91 123456789</li>
            <li className="flex items-center gap-2"><MdEmail /> loremipsum</li>
            <li className="flex items-center gap-2"><FaLocationDot /> Bangalore, India</li>
          </ul>
        </div>
      </div>

      <div className="text-center text-xs mt-10 opacity-80">
        © Copyright 2025 Chop and Chicks | All Rights Reserved
      </div>
    </footer>
  );
}
