import Image from "next/image";
import { useRouter } from "next/navigation";

const categories = [
  { name: "Mutton", img: "/assets/cat-1.png" },
  { name: "Chicken", img: "/assets/cat-2.png" },
  { name: "Mutton", img: "/assets/cat-1.png" },
  { name: "Chicken", img: "/assets/cat-2.png" },
  { name: "Mutton", img: "/assets/cat-1.png" },
  { name: "Chicken", img: "/assets/cat-2.png" },
];

export default function CategorySection() {
  const router = useRouter()
  return (
    <div className="container bg-[#F5F7FA] py-12 ">
      {/* Heading */}
      <h2 className="text-2xl text-black font-medium">Shop by Category</h2>
      <p className="text-gray-500 text-sm mt-1 mb-8">
        Most popular products near you!
      </p>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
        {categories.map((item, i) => (
          <div key={i} className="group cursor-pointer" onClick={()=>{router.push(`/Category/${item.name}`)}}>
            <div className="w-36 h-36 mx-auto rounded-full overflow-hidden shadow-md border border-gray-200 transition-transform duration-300 group-hover:scale-105">
              <Image
                src={item.img}
                alt={item.name}
                width={200}
                height={200}
                className="object-cover w-full h-full"
              />
            </div>
            <p className="mt-3 font-medium text-gray-700">{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
