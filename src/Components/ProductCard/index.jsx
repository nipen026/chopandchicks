import Image from "next/image";
import { useRouter } from "next/navigation";
export default function ProductCard({ item }) {
  const router = useRouter();

  const handleClick = () => {
    // Implement navigation to product details page
    router.push(`/productDetails/${item.id}`);
  }
  return (
    <div className="min-w-full productBoxShadow  max-w-full h-full border border-[#848181] bg-white rounded-2xl cursor-pointer  border border-gray-100 p-3 hover:shadow-lg transition-all duration-300">
      <div className="w-full h-36 rounded-xl overflow-hidden" onClick={() => handleClick()}>
        <Image
          src={item.image.thumbnail_url}
          alt={item.name}
          width={300}
          height={200}
          className="object-cover w-full h-full"
        />
      </div>

      <p className="font-semibold text-gray-800 mt-3 line-clamp-1 truncate leading-tight">
        {item.name}
      </p>

      <p className="text-xs text-gray-500 mt-1">
        {item.weight_in_kg} Kg | {item.quantity} Pieces | Serves {item.servings}
      </p>

      <div className="flex items-center justify-between mt-3">
        <p className="font-semibold text-gray-800">₹{item.sale_price}</p>

        <button className="btn-gradient text-white text-xs px-4 py-1.5 rounded-full hover:bg-red-600 transition">
          Add +
        </button>
      </div>
    </div>
  );
}
