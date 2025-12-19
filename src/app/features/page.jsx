export default function Features() {
  const items = [
    {
      title: "Fresh, Never Frozen Meats",
      desc: "Enjoy freshly cut meats sourced directly from trusted local vendors—never frozen, always fresh—to ensure the highest quality and taste.",
      img: "/assets/ab-1.png",
    },
    {
      title: "Local Vendors in Your Radius",
      desc: "We connect you only with vendors near your location, reducing delivery times and keeping products fresh.",
      img: "/assets/ab-2.png",
    },
    {
      title: "Browse & Discover with Ease",
      desc: "Explore a variety of local vendors in one place with clear listings, photos, and descriptions so you can find exactly what you need.",
      img: "/assets/ab-3.png",
    },
    {
      title: "Search & Filter Vendors",
      desc: "Easily sort by category, location, or meat type to match your preferences and budget.",
      img: "/assets/ab-1.png",
    },
    {
      title: "Affordable Prices",
      desc: "Get premium quality meats from local suppliers without breaking the bank—freshness and value go hand in hand.",
      img: "/assets/ab-1.png",
    },
    {
      title: "Mobile-Friendly Access",
      desc: "Enjoy a seamless shopping and browsing experience anytime, anywhere—phone, tablet, or desktop.",
      img: "/assets/ab-1.png",
    },
  ];

  return (
    <div className="w-full py-16">
      <div className="container mx-auto px-4 space-y-24">

        {items.map((item, i) => (
          <div
            key={i}
            className={`grid md:grid-cols-2 items-center ${
              i % 2 !== 0 ? "md:flex-row-reverse" : ""
            }`}
          >
            {/* IMAGE */}
            <div
              className={`rounded-xl z-10 overflow-hidden shadow-md transition-all duration-500 hover:scale-[1.03] ${
                i % 2 !== 0 ? "order-2 md:order-1" : ""
              }`}
              style={{ height: "280px" }} // **increase height**
            >
              <img
                src={item.img}
                draggable={false}
                className="w-full h-full object-cover"
              />
            </div>

            {/* TEXT BOX BACKGROUND PNG */}
            <div
              className="relative p-10 rounded-xl flex items-start"
              style={{
                backgroundImage: "url('/assets/bg-react.png')",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",

                // bigger background height
                height: "260px",

                // Flip background by position, NOT transform
                backgroundPosition: i % 2 === 0 ? "left center" : "right center",
              }}
            >
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-700 leading-relaxed">{item.desc}</p>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
