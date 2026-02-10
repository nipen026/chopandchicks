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
        <div className="flex flex-col items-center">
          <Image src="/assets/footer_logo.png" width={80} height={80} alt="logo" className="rounded-full" draggable={false} />

          <div className="flex gap-2 items-center mt-4">
            <p className=" text-lg">Download the app</p>
            <div className="flex gap-3">
              <Image src="/assets/playstore.png" width={30} height={30} alt="playstore" draggable={false} />
              <Image src="/assets/appstore.png" width={30} height={30} alt="appstore" draggable={false} />
            </div>
          </div>
        </div>

        {/* Company */}
        <div>
          <h3 className="font-medium mb-3">Company</h3>
          <ul className="space-y-2 text-sm">
            <li className="cursor-pointer hover:underline" onClick={() => router.push('/about')}>About Us</li>
            <li className="cursor-pointer hover:underline" onClick={() => router.push('/features')}>Features</li>
            <li className="cursor-pointer hover:underline" onClick={() => router.push('/refer-and-earn')}>Refer & Earn</li>
            <li className="cursor-pointer hover:underline" onClick={() => router.push('/support')}>Support</li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="font-medium mb-3">Legal</h3>
          <ul className="space-y-2 text-sm">
            <li className="cursor-pointer hover:underline" onClick={() => router.push('/terms-of-use')}>Terms of Use</li>
            <li className="cursor-pointer hover:underline" onClick={() => router.push('/privacyPolicy')}>Privacy Policy</li>
            <li className="cursor-pointer hover:underline" onClick={() => router.push('/faq')}>FAQ</li>
            <li className="cursor-pointer hover:underline" onClick={() => router.push('/community-rules')}>Community Rules</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-medium mb-3">Contact</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2"><FaPhoneAlt /> +91 123456789</li>
            <li className="flex items-center gap-2"><MdEmail /> loremipsum</li>
            <li className="flex items-center gap-2"><FaLocationDot /> Bangalore, India</li>
          </ul>
        </div>
      </div>

      <div className="text-center text-md mt-5 pt-5 border-[#CD8412] border-t opacity-80">
        &copy; Copyright {new Date().getFullYear()} Chop and Chicks | All Rights Reserved
      </div>
    </footer>
  );
}