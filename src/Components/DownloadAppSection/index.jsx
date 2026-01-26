"use client";
import Image from "next/image";
import { BsCheckCircleFill } from "react-icons/bs";

export default function DownloadAppSection() {
  return (
    <section className="container bg-[#F5F7FA] py-16">
      <div className="mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-2 items-center gap-12">

        {/* Left Side Content */}
        <div>
          <h2 className="text-4xl md:text-5xl font-medium text-gray-900 mb-6">
            Download Our App
          </h2>

          <p className="text-gray-600 leading-relaxed mb-6 max-w-md">
            Get fresh, hygienic chicken and mutton delivered straight to your
            doorstep with just a few taps.
          </p>

          {/* Features List */}
          <ul className="space-y-4 mb-8">
            <li className="flex items-start gap-3">
              <BsCheckCircleFill className="text-green-600 mt-1" />
              <span className="text-gray-700">
                Freshly slaughtered chicken & mutton
              </span>
            </li>

            <li className="flex items-start gap-3">
              <BsCheckCircleFill className="text-green-600 mt-1" />
              <span className="text-gray-700">
                Choose preferred cuts and delivery slots
              </span>
            </li>

            <li className="flex items-start gap-3">
              <BsCheckCircleFill className="text-green-600 mt-1" />
              <span className="text-gray-700">
                Live order tracking from processing to delivery
              </span>
            </li>

            <li className="flex items-start gap-3">
              <BsCheckCircleFill className="text-green-600 mt-1" />
              <span className="text-gray-700">
                Secure payments via UPI, cards & net banking
              </span>
            </li>

            <li className="flex items-start gap-3">
              <BsCheckCircleFill className="text-green-600 mt-1" />
              <span className="text-gray-700">
                Fast, reliable same-day delivery
              </span>
            </li>
          </ul>

          {/* Store Buttons */}
          <div className="flex items-center gap-4">
            <Image
              src="/assets/app_banner.png"
              alt="Download on App Store"
              width={170}
              height={50}
              draggable={false}
            />

            <Image
              src="/assets/play_banner.png"
              alt="Get it on Google Play"
              width={180}
              height={50}
              draggable={false}
            />
          </div>
        </div>

        {/* Right Side Image */}
        <div className="flex justify-center md:justify-end">
          <Image
            src="/assets/footer_banner.png"
            alt="App Preview"
            width={500}
            height={300}
            draggable={false}
            className="rounded-xl object-cover"
          />
        </div>

      </div>
    </section>
  );
}
