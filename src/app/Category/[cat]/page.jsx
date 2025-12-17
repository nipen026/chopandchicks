'use client'

import { useEffect, useState } from "react";
import CategorySection from "../../../Components/Category";
import { supabase } from "../../../lib/supabaseClient";
import ProductCard from "../../../Components/ProductCard";
import CategoryCard from "../../../Components/CategoryCard";
import { useParams } from "next/navigation";
import Loader from "../../../Components/Loader";

export default function Category() {
    const [products, setProducts] = useState([]);
    const { cat } = useParams();
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            let { data, error } = await supabase
                .from("product")
                .select("*");

            if (error) {
                console.log("Supabase Error:", error);
            } else {
                setLoading(false);
                setProducts(data);
            }
        };

        fetchProducts();
    }, []);
    return (
        <>
            {loading ? <Loader /> :
                <main>
                    <CategorySection />
                    <div className="container">
                        <h2 className="text-2xl text-black font-semibold">{cat}</h2>
                        <p className="text-gray-500 text-sm mt-1 mb-8">
                            Most popular products near you!
                        </p>
                        <div className="grid grid-cols-4 space-y-3">
                            {products.map((item, index) => (
                                <div key={index} className="px-2">
                                    <CategoryCard product={item} />
                                </div>
                            ))}
                        </div>
                    </div>
                </main>}
        </>

    );
}