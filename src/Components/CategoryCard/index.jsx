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
        <div className="w-full bg-white rounded-3xl shadow-[0_4px_25px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden p-4">

            {/* IMAGE */}
            <div className="w-full h-56 rounded-t-2xl overflow-hidden" onClick={() => handleClick()}>
                <Image
                    src={product.image.thumbnail_url}
                    alt={product.name}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* TEXT SECTION */}
           <div className="flex justify-between items-end">
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
                <div className="flex items-center gap-3 mt-2" onClick={() => handleClick()}>
                    <span className="text-[22px] font-semibold text-gray-900">
                        ₹{product.sale_price}
                    </span>
                    <span className="text-gray-400 line-through text-[16px]">
                        ₹{product.original_price}
                    </span>
                </div>
            </div>

            {/* ADD BUTTON */}
            <div className="flex justify-end mt-4">
                <button className="px-5 py-2 text-white rounded-2xl font-medium text-[15px] btn-gradient flex items-center gap-1 shadow-md hover:brightness-110 transition">
                    Add <span className="text-[18px] font-bold">+</span>
                </button>
            </div>
           </div>
        </div>
    );
}
