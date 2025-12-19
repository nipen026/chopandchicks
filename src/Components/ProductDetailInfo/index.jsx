"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FiBox } from "react-icons/fi";
import { PiKnifeBold } from "react-icons/pi";
import { LuUsers } from "react-icons/lu";
import { BsBookmark, BsArrowRepeat } from "react-icons/bs";
import { GiHamburgerMenu } from "react-icons/gi";
import { supabase } from "../../lib/supabaseClient";
import { usePathname, useRouter } from "next/navigation";

export default function ProductDetailInfo({ setOpenCart, product }) {
    const [userId, setUserId] = useState("");
    const router = useRouter();
    const pathname = usePathname()
    // ✔ FIX: load userId safely on client
    useEffect(() => {
        const id = localStorage.getItem("user_account_id");
        if (id) setUserId(id);
    }, []);

    const addToCart = async () => {
        if (!product?.id) return;
        
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            router.push(`${pathname}?login=true`);
        }

        // Check user_account record
        // const { data: user_account, error: uaError } = await supabase
        //     .from("user_account")
        //     .select("*")
        //     .eq("id", userId)      // or eq("auth_id", user.id)
        //     .single();

        // if (!user_account) {
        //     console.log("User not found in user_account table");
        //     return;
        // }

        const { data, error } = await supabase.rpc("upsert_user_cart", {
            p_product_id: product.id,
            p_quantity: 1,
            p_address_id: null,
            p_delete_product_id: null,
        });
        if (data.status == 'success') {
            setOpenCart(true)
        }
        console.log(data, error);
    };


    return (
        <div className="container rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-10 shadow-sm">

            {/* Left - Image */}
            <div className="md:w-1/2 w-full">
                <Image
                    src={product?.image?.image_url}
                    width={500}
                    height={500}
                    alt="product"
                    className="rounded-xl w-full h-[340px] object-cover shadow-md"
                />
            </div>

            {/* Right */}
            <div className="flex flex-col md:w-1/2 w-full">

                {/* Title */}
                <div className="flex justify-between items-start">
                    <h2 className="text-2xl md:text-3xl font-medium text-gray-800">
                        {product?.name}
                    </h2>

                    <div className="flex items-center space-x-4 text-xl">
                        <div className="bg-[#EDEDED] p-2 rounded-full">
                            <BsBookmark className="cursor-pointer text-gray-500 hover:text-red-600" />
                        </div>
                        <div className="bg-[#EDEDED] p-2 rounded-full">
                            <BsArrowRepeat className="cursor-pointer text-gray-500 hover:text-red-600" />
                        </div>
                    </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap items-center gap-3 mt-4">
                    <span className="flex items-center gap-2 bg-[#EDEDED] px-3 py-1.5 rounded-lg text-sm border text-gray-700">
                        <FiBox /> {product?.weight_in_kg} Kg
                    </span>

                    <span className="flex items-center gap-2 bg-[#EDEDED] px-3 py-1.5 rounded-lg text-sm border text-gray-700">
                        <PiKnifeBold /> {product?.quantity} Pieces
                    </span>

                    <span className="flex items-center gap-2 bg-[#EDEDED] px-3 py-1.5 rounded-lg text-sm border text-gray-700">
                        <LuUsers /> Serves {product?.servings}
                    </span>
                </div>

                {/* Description */}
                <div className="mt-6 text-gray-700 text-sm leading-6">
                    <p className="flex items-center gap-2">
                        <span className="text-xl"><GiHamburgerMenu /></span>
                        {product?.description}
                    </p>
                </div>

                {/* Price + Button */}
                <div className="mt-6 flex items-center justify-between">
                    <div>
                        <p className="text-red-600 font-medium text-2xl">₹{product?.sale_price}</p>

                        <div className="flex items-center gap-2">
                            {product?.original_price && (
                                <p className="text-gray-500 text-sm line-through">
                                    ₹{product?.original_price}
                                </p>
                            )}
                            <p className="text-gray-500 text-xs">(incl. of all taxes)</p>
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            addToCart();
                        }}
                        className="btn-gradient text-white font-medium px-6 py-2.5 rounded-lg flex items-center gap-2 hover:bg-red-700"
                    >
                        Add <span className="text-xl font-bold">+</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
