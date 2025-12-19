import Image from "next/image";
import { useRouter } from "next/navigation";
export default function ProductCard({ item, page }) {
  const router = useRouter();

  const handleClick = () => {
    // Implement navigation to product details page
    router.push(`/productDetails/${item.id}`);
  }
  return (
    <div className={`${page == 'category' ?
      "  min-w-full productBoxShadow  max-w-full h-full   border-[1px] border-[#848181] bg-white rounded-[29px] cursor-pointer  p-3 hover:shadow-lg transition-all duration-300" :
      "lg:min-w-[200px]  min-w-full productBoxShadow space-y-2  lg:max-w-[250px] max-w-full h-[320px]  border-[1px] border-[#848181] bg-white rounded-[29px] cursor-pointer  p-[9px] hover:shadow-lg transition-all duration-300"}`}>
      <div className="w-full h-[190px] rounded-[20px] overflow-hidden" onClick={() => handleClick()}>
        <Image
          src={item.image.thumbnail_url}
          alt={item.name}
          draggable={false}
          width={190}
          height={190}
          className="object-cover w-full h-full"
        />
      </div>

      <p className="font-semibold text-[#494949] text-[16px] leading-tight" onClick={() => handleClick()}>
        {item.name}
      </p>

      <p className="text-xs text-[#656567]" onClick={() => handleClick()}>
        <span className="font-medium">{item.weight_in_kg} Kg</span> | {item.quantity} Pieces | Serves {item.servings}
      </p>

      <div className="flex items-center justify-between " onClick={() => handleClick()}>
        <div className="flex items-center gap-3">
          <p className="font-semibold text-xl text-gray-800">₹{item.original_price}</p>
          <del className="font-medium text-sm text-gray-300">₹{item.sale_price}</del>
        </div>
        <button className="bg-secondary w-16 text-white text-xs px-2 py-1.5 rounded-full hover:bg-red-600 transition">
          Add +
        </button>
      </div>
    </div>
  );
}
