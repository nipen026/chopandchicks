"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation"; // <-- correct
import BestsellerSection from "../../../Components/BestsellerSection";
import CartSidebar from "../../../Components/CartSidebar";
import DownloadAppSection from "../../../Components/DownloadAppSection";
import ProductDetailInfo from "../../../Components/ProductDetailInfo";
import { supabase } from "../../../lib/supabaseClient";

export default function ProductDetails() {
    const [openCart, setOpenCart] = useState(true);
    const {id} = useParams();
    const [product, setProduct] = useState(null);
    
    useEffect(() => {
        if (!id) return;

        const fetchProduct = async () => {
            const { data, error } = await supabase
                .from("product")
                .select("*")
                .eq("id", id)
                .single();
            console.log(data,"data");
            
            if (error) console.log(error);
            else setProduct(data);
        };

        fetchProduct();
    }, [id]);

    return (
        <>
            <ProductDetailInfo setOpenCart={setOpenCart} product={product} />
            <BestsellerSection title="You may also like" desc="Most popular products near you!" />
            <DownloadAppSection />
            <CartSidebar open={openCart} onClose={() => setOpenCart(false)} />
        </>
    );
}
