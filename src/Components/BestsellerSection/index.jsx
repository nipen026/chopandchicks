"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation,Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import ProductCard from "../ProductCard";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function BestsellerSection({ title, desc }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from("product").select("*");
      if (!error) setProducts(data);
    };
    fetchProducts();
  }, []);

  return (
    <div className="container bg-[#F5F7FA] py-8">
      <h2 className="text-2xl text-black font-medium">
        {title || "Bestsellers"}
      </h2>
      <p className="text-gray-500 text-sm mt-1">
        {desc || "Most popular products near you!"}
      </p>

      {/* Custom Arrows (Desktop only) */}
      <div className="relative mt-4">
        <Swiper
          modules={[Navigation, Autoplay]}
          navigation={{
            nextEl: ".swiper-next",
            prevEl: ".swiper-prev",
          }}
          spaceBetween={16}
          slidesPerView={5}
          autoplay={{
            delay: 3000,              // 3 seconds
            disableOnInteraction: false, // keep autoplay after swipe
            pauseOnMouseEnter: true,  // pause on hover (desktop)
          }}
          loop={products.length > 5} // prevent autoplay bug if few items
          breakpoints={{
            1280: { slidesPerView: 5 },
            1024: { slidesPerView: 4 },
            768: { slidesPerView: 3 },
            640: { slidesPerView: 2 },
            0: { slidesPerView: 1.2 },
          }}
        >
          {products.map((item, index) => (
            <SwiperSlide key={index}>
              <ProductCard item={item} />
            </SwiperSlide>
          ))}
        </Swiper>

      </div>
    </div>
  );
}
