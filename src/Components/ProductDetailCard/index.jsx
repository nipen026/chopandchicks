"use client";

import Image from "next/image";
import { FiBox } from "react-icons/fi";
import { PiKnifeBold } from "react-icons/pi";
import { LuUsers } from "react-icons/lu";
import { BsBookmark, BsArrowRepeat } from "react-icons/bs";

export default function ProductDetailCard() {
  return (
    <div className="max-w-6xl mx-auto bg-[#F4F8FB] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-10 shadow-sm">

      {/* Left - Image */}
      <div className="md:w-1/2 w-full">
        <Image
          src="/chicken.jpg"     // replace with real image
          width={500}
          height={500}
          draggable={false}
          alt="product"
          className="rounded-xl w-full h-[340px] object-cover shadow-md"
        />
      </div>

      {/* Right - Content */}
      <div className="flex flex-col justify-between md:w-1/2 w-full">

        {/* Title + Icons */}
        <div className="flex justify-between items-start">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 leading-snug">
            Chicken Breast - Boneless
          </h2>

          <div className="flex items-center space-x-4 text-xl">
            <BsBookmark className="cursor-pointer text-gray-500 hover:text-red-600" />
            <BsArrowRepeat className="cursor-pointer text-gray-500 hover:text-red-600" />
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-3 mt-4">
          <span className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg text-sm font-medium border text-gray-700">
            <FiBox /> 500 g
          </span>

          <span className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg text-sm font-medium border text-gray-700">
            <PiKnifeBold /> 4-8 Pieces
          </span>

          <span className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg text-sm font-medium border text-gray-700">
            <LuUsers /> Serves 2
          </span>
        </div>

        {/* Description */}
        <div className="mt-6 space-y-3 text-gray-700 text-sm leading-6">
          <p className="flex items-center gap-2">
            <span className="text-xl">🟢</span> Freshly cut and packed today
          </p>
          <p>
            Et quidem faciunt, ut summum bonum sit extremum et rationibus
            conquisitis de voluptate. Sed ut summum bonum sit id.
          </p>
        </div>

        {/* Price + Button */}
        <div className="mt-6 flex items-center justify-between">
          <div>
            <p className="text-red-600 font-bold text-2xl">₹220.00</p>
            <p className="text-gray-500 text-sm line-through">₹240.00</p>
            <p className="text-gray-500 text-xs">(incl. of all taxes)</p>
          </div>

          <button className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-2.5 rounded-full flex items-center gap-2 ease-linear">
            Add <span className="text-xl font-bold">+</span>
          </button>
        </div>
      </div>
    </div>
  );
}
