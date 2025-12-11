import Image from "next/image";
import { useRouter } from "next/navigation";
export default function ProductCard({ item }) {
  const router = useRouter();

  const handleClick = () => {
    // Implement navigation to product details page
    router.push(`/productDetails/${item.id}`);
  }
  return (
    <div className="lg:min-w-[200px]  min-w-full productBoxShadow  lg:max-w-[230px] max-w-full h-full   border-[1px] border-[#848181] bg-white rounded-[28px] cursor-pointer  p-3 hover:shadow-lg transition-all duration-300">
      <div className="w-full h-36 rounded-[28px] overflow-hidden" onClick={() => handleClick()}>
        <Image
          src={item.image.thumbnail_url}
          alt={item.name}
          width={300}
          height={300}
          className="object-cover w-full h-full"
        />
      </div>

      <p className="font-semibold text-[#494949] mt-3 line-clamp-1 truncate leading-tight" onClick={() => handleClick()}>
        {item.name}
      </p>

      <p className="text-xs text-[#656567] mt-1" onClick={() => handleClick()}>
        <span className="font-medium">{item.weight_in_kg} Kg</span> | {item.quantity} Pieces | Serves {item.servings}
      </p>

      <div className="flex items-center justify-between mt-3" onClick={() => handleClick()}>
        <div className="flex items-center gap-3">
          <p className="font-semibold text-xl text-gray-800">₹{item.original_price}</p>
          <del className="font-medium text-md text-gray-300">₹{item.sale_price}</del>
        </div>
        <button className="btn-gradient text-white text-xs px-4 py-1.5 rounded-full hover:bg-red-600 transition">
          Add +
        </button>
      </div>
    </div>
  );
}
