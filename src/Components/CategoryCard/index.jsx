"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CategoryCard({ product }) {
    const router = useRouter();
    const handleClick = () => {
        // Implement navigation to product details page
        router.push(`/productDetails/${product.id}`);
    }
    return (
        <div className=" w-full h-full bg-white rounded-3xl shadow-[0_4px_25px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden p-4 cursor-pointer">

            {/* IMAGE */}
            <div className="w-full h-56 rounded-t-2xl overflow-hidden" onClick={() => handleClick()}>
                <Image
                    src={product.image.thumbnail_url}
                    alt={product.name}
                    width={400}
                    height={300}
                    draggable={false}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* TEXT SECTION */}
            <div className="">
                <div className="mt-4">
                    {/* Title */}
                    <p className="font-semibold text-[#494949] mt-3 line-clamp-1 truncate leading-tight" onClick={() => handleClick()}>
                        {product.name}
                    </p>

                    {/* Weight + Pieces */}
                    <p className="text-xs text-[#656567] mt-1" onClick={() => handleClick()}>
                        <span className="font-medium">{product.weight_in_kg} Kg</span> | {product.quantity} Pieces | Serves {product.servings}
                    </p>

                    {/* Price Section */}
                    <div className="w-full flex items-center justify-between " onClick={() => handleClick()}>
                        <div className="flex items-center gap-3">
                            <p className="font-semibold text-xl text-gray-800">₹{product.original_price}</p>
                            <del className="font-medium text-sm text-gray-300">₹{product.sale_price}</del>
                        </div>
                        <button className="bg-secondary text-white text-xs px-2 py-1.5 rounded-full hover:bg-red-600 transition">
                            Add +
                        </button>
                    </div>

                </div>

                {/* ADD BUTTON */}

            </div>
        </div>
    );
}
