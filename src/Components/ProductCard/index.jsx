import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ProductCard({ item, page }) {
  const router = useRouter();
  const [imageError, setImageError] = useState(false);

  const handleClick = () => {
    // Implement navigation to product details page
    router.push(`/productDetails/${item.id}`);
  };

  // Safely get image URL with fallback
  const getImageUrl = () => {
    // Check if item and item.image exist
    // if (!item || !item.image) {
    //   return "/assets/placeholder-product.png"; // Add your placeholder image path
    // }

    // Check if thumbnail_url exists and is a valid string
    // if (item.image.thumbnail_url && typeof item.image.thumbnail_url === "string") {
    //   return item.image.thumbnail_url;
    // }

    // Fallback to other possible image properties
    if (item.image.image_url && typeof item.image.image_url === "string") {
      return item.image.image_url;
    }

    // if (item.image.src && typeof item.image.src === "string") {
    //   return item.image.src;
    // }

    // Final fallback
    // return "/assets/placeholder-product.png";
  };

  const imageUrl = getImageUrl();

  return (
    <div
      className={`${
        page == "category"
          ? "min-w-full productBoxShadow max-w-full h-full border-[1px] border-[#848181] bg-white rounded-[29px] cursor-pointer p-3 hover:shadow-lg transition-all duration-300"
          : "lg:min-w-[200px] min-w-full productBoxShadow space-y-2 lg:max-w-[250px] max-w-full h-[320px] border-[1px] border-[#848181] bg-white rounded-[29px] cursor-pointer p-[9px] hover:shadow-lg transition-all duration-300"
      }`}
    >
      <div
        className="w-full h-[190px] rounded-[20px] overflow-hidden bg-gray-100 flex items-center justify-center"
        onClick={() => handleClick()}
      >
        {!imageError && imageUrl ? (
          <Image
            src={imageUrl}
            alt={item?.name || "Product image"}
            draggable={false}
            width={190}
            height={190}
            className="object-cover w-full h-full"
            onError={() => setImageError(true)}
            // Use unoptimized if you're having issues with external images
            unoptimized={imageUrl.startsWith("http")}
          />
        ) : (
          // Fallback UI when image fails to load
          <div className="flex flex-col items-center justify-center text-gray-400">
            <svg
              className="w-16 h-16 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-xs">No Image</p>
          </div>
        )}
      </div>

      <p
        className="font-semibold text-[#494949] text-[16px] leading-tight"
        onClick={() => handleClick()}
      >
        {item?.name || "Product Name"}
      </p>

      <p className="text-xs text-[#656567]" onClick={() => handleClick()}>
        <span className="font-medium">{item?.weight_in_kg || "0"} Kg</span> |{" "}
        {item?.quantity || "0"} Pieces | Serves {item?.servings || "0"}
      </p>

      <div
        className="flex items-center justify-between"
        onClick={() => handleClick()}
      >
        <div className="flex items-center gap-3">
          <p className="font-semibold text-xl text-gray-800">
            ₹{item?.original_price || "0"}
          </p>
          <del className="font-medium text-sm text-gray-300">
            ₹{item?.sale_price || "0"}
          </del>
        </div>
        <button className="bg-secondary w-16 text-white text-xs px-2 py-1.5 rounded-full hover:bg-red-600 transition">
          Add +
        </button>
      </div>
    </div>
  );
}