import Image from "next/image";

export default function ProductCard({ item }) {
    const handleClick = () => {
        // Implement navigation to product details page
        window.location.href = '/productDetails'; // Simple navigation
    }
  return (
    <div className="min-w-full max-w-full h-full bg-white rounded-2xl cursor-pointer  border border-gray-100 p-3 hover:shadow-lg transition-all duration-300">
      <div className="w-full h-36 rounded-xl overflow-hidden" onClick={()=>handleClick()}>
        <Image
          src={item.img}
          alt={item.name}
          width={300}
          height={200}
          className="object-cover w-full h-full"
        />
      </div>

      <p className="font-semibold text-gray-800 mt-3 leading-tight">
        {item.name}
      </p>

      <p className="text-xs text-gray-500 mt-1">
        {item.weight} | {item.pieces} Pieces | Serves {item.serves}
      </p>

      <div className="flex items-center justify-between mt-3">
        <p className="font-semibold text-gray-800">₹{item.price}</p>

        <button className="bg-secondary text-white text-xs px-4 py-1.5 rounded-full hover:bg-red-600 transition">
          Add +
        </button>
      </div>
    </div>
  );
}
