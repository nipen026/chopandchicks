"use client";
import Slider from "react-slick";
import ProductCard from "../ProductCard";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useState,useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";

// const products = [
//     { name: "Chicken Curry Cut – Small Pieces", img: "/assets/product_card.png", weight: "500 g", pieces: 10, serves: 2, price: 220 },
//     { name: "Chicken Curry Cut – Small Pieces", img: "/assets/product_card.png", weight: "500 g", pieces: 6, serves: 2, price: 252 },
//     { name: "Chicken Curry Cut – Small Pieces", img: "/assets/product_card.png", weight: "500 g", pieces: 8, serves: 3, price: 272 },
//     { name: "Chicken Curry Cut – Small Pieces", img: "/assets/product_card.png", weight: "250 g", pieces: 15, serves: 2, price: 174 },
//     { name: "Chicken Curry Cut – Small Pieces", img: "/assets/product_card.png", weight: "500 g", pieces: 14, serves: 3, price: 308 },
//     { name: "Chicken Curry Cut – Small Pieces", img: "/assets/product_card.png", weight: "500 g", pieces: 14, serves: 3, price: 308 },
//     { name: "Chicken Curry Cut – Small Pieces", img: "/assets/product_card.png", weight: "500 g", pieces: 14, serves: 3, price: 308 },
//     { name: "Chicken Curry Cut – Small Pieces", img: "/assets/product_card.png", weight: "500 g", pieces: 14, serves: 3, price: 308 },
// ];

/* ---------- ARROWS WITH RESPONSIVE POSITIONS ---------- */
const NextArrow = ({ onClick }) => (
    <button
        onClick={onClick}
        className="
           absolute -bottom-16  transform -translate-y-1/2 bg-[#D7D7D7] text-[#545454]
            hover:text-dark
            px-3 py-2 rounded-e-full z-10

            md:right-20
            lg:right-[45rem]
            2xl:right-[45rem]
            hidden 2xl:flex
        "
    >
        <FaArrowRight />
    </button>
);

const PrevArrow = ({ onClick }) => (
    <button
        onClick={onClick}
        className="
            absolute -bottom-16 transform -translate-y-1/2
            bg-[#D7D7D7] text-[#545454] hover:text-dark
            px-3 py-2 rounded-s-full z-10

            md:left-20
            lg:left-40
            xl:left-[44rem]
            hidden 2xl:flex
        "
    >
        <FaArrowLeft />
    </button>
);

export default function BestsellerSection({ title, desc }) {

    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            let { data, error } = await supabase
                .from("product")
                .select("*");

            if (error) {
                console.log("Supabase Error:", error);
            } else {
                setProducts(data);
            }
        };

        fetchProducts();
    }, []);
    const settings = {
        infinite: false,
        slidesToShow: 5,
        slidesToScroll: 1,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        dots: false,

        responsive: [
            { breakpoint: 1536, settings: { slidesToShow: 5 } }, // 2xl
            { breakpoint: 1280, settings: { slidesToShow: 4 } }, // xl
            { breakpoint: 1024, settings: { slidesToShow: 4 } }, // lg
            { breakpoint: 768, settings: { slidesToShow: 3 } },  // md
            { breakpoint: 640, settings: { slidesToShow: 1 } },  // sm
        ],
    };

    return (
        <div className="container  bg-[#F5F7FA] py-8 ">
            <h2 className="text-2xl text-black font-semibold">
                {title || "Bestsellers"}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
                {desc || "Most popular products near you!"}
            </p>

            <div className="">
                <Slider {...settings} className="!gap-20">
                    {products.map((item, index) => (
                        <div key={index} className="px-2">
                            <ProductCard item={item} />
                        </div>
                    ))}
                </Slider>
            </div>
        </div>
    );
}
