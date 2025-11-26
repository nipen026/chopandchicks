"use client";

import { useState } from "react";

import BestsellerSection from "@/Components/BestsellerSection";
import CartSidebar from "@/Components/CartSidebar";
import DownloadAppSection from "@/Components/DownloadAppSection";
import ProductDetailInfo from "@/Components/ProductDetailInfo";

export default function ProductDetails() {
    const [openCart, setOpenCart] = useState(false);
    return (
        <>
            <ProductDetailInfo setOpenCart={setOpenCart} />
            <BestsellerSection title={'You may also like'} desc={'Most popular products near you!'} />
            <DownloadAppSection />
            <CartSidebar open={openCart} onClose={() => setOpenCart(false)} />
        </>
    )
}