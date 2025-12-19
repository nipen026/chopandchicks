"use client";

import { useEffect, useState } from "react";
import BestsellerSection from "../Components/BestsellerSection";
import CategorySection from "../Components/Category";
import DownloadAppSection from "../Components/DownloadAppSection";
import { supabase } from "../lib/supabaseClient";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Home() {
  const [banner, setBanner] = useState([]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const { data, error } = await supabase.rpc("get_active_banners");

        if (error) {
          console.error("Supabase RPC Error:", error);
          return;
        }

        setBanner(data.data || []);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchBanners();
  }, []);

  const settings = {
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: false,
    fade: true,
  };

  return (
    <>
      <div className="container mt-10">
        {/* <Slider {...settings}>
          {banner?.map((item, i) => (
            <img key={i} src={item?.thumbnail_url} className="w-full h-[300px] object-contain" alt="Banner" />
          ))}
        </Slider> */}
         <img src="/assets/banner.png" draggable={false} className="w-full"/>
      </div>

      <CategorySection />
      <BestsellerSection />
      <DownloadAppSection />
    </>
  );
}
