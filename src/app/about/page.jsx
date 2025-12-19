export default function About() {
    return (
        <div className="w-full text-gray-800">

            {/* Top Section */}
            <section className="container mx-auto px-4 py-16 grid md:grid-cols-2 gap-10 items-center">

                {/* Left Text */}
                <div>
                    <h3 className="text-[42px] font-medium text-[#363636] mb-2">About Us</h3>

                    <h1 className="text-[46px] text-[#363636] font-light leading-[3rem] mb-3">
                        At Chop and Chicks,<br /> our mission is simple:
                    </h1>

                    <p className="text-[#363636] text-[20px] font-light max-w-lg">
                        to bring you the freshest cut meats from trusted local vendors—never frozen—delivered right to your doorstep at affordable rates. We believe fresh food tastes better, supports healthier lifestyles, and strengthens local communities.
                    </p>
                </div>

                {/* Right Image */}
                <div className="flex justify-center">
                    <img
                        src="/assets/about-banner-1.png"
                        draggable={false}
                        alt="Fresh Meat"
                        className="rounded-xl shadow-md w-full h-full max-w-md"
                    />
                </div>
            </section>

            {/* Gradient Section */}
            <section className="w-full bg-gradient-to-r from-red-600 to-red-400 text-white py-12">
                <div className="container mx-auto px-4">
                    <h3 className="text-xl font-light mb-4">That’s why we:</h3>

                    <ul className="list-disc font-light pl-6 space-y-2 text-lg">
                        <li>Partner only with reliable vendors within your delivery radius.</li>
                        <li>
                            Ensure all meats are freshly cut and handled with the highest standards—no frozen
                            stock, no compromises.
                        </li>
                        <li>
                            Focus on affordability so you can enjoy premium quality without overspending.
                        </li>
                    </ul>
                </div>
            </section>

            {/* Bottom Section */}
            <section className="container mx-auto px-4 py-16 grid md:grid-cols-2 gap-10 items-center">

                {/* Left Image */}
                <div className="flex justify-center">
                    <img
                        src="/assets/about-banner-2.png"
                        draggable={false}
                        alt="Vendor"
                        className="rounded-xl shadow-md w-full max-w-md"
                    />
                </div>

                {/* Right Text */}
                <div>
                    <p className="text-[#363636] text-[20px] font-medium leading-[46px] mb-4">
                        Our team is passionate about making fresh, local, and affordable meats accessible to everyone. With easy browsing, transparent vendor details, and safe transactions, Chop and Chicks is here to make your meat shopping simple, reliable, and delicious. Whether you’re planning a family meal or a weekend barbecue, we’ve got you covered—fresh from farm to your table, every time.
                    </p>
                </div>
            </section>

        </div>
    );
}
