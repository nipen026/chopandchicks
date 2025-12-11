"use client";
import Image from "next/image";

export default function DownloadAppSection() {
  return (
    <section className="container bg-[#F5F7FA] py-16">
      <div className=" mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-2 items-center gap-12">

        {/* Left Side Content */}
        <div>
          <h2 className="text-4xl md:text-5xl font-medium text-gray-900 mb-6">
            Download the App
          </h2>

          <p className="text-gray-600 leading-relaxed mb-8 max-w-md">
            Lorem ipsum dolor sit amet consectetur. Imperdiet elementum mattis tristique 
            velit enim parturient. Morbi leo mi at amet tempus. Leo ante lorem cursus 
            tristique. Nulla urna faucibus mauris tristique elementum mauris platea.
          </p>

          {/* Store Buttons */}
          <div className="flex items-center gap-4">
            <button>
              <Image 
                src="/assets/app_banner.png" 
                alt="App Store" 
                width={170} 
                height={50} 
              />
            </button>

            <button>
              <Image 
                src="/assets/play_banner.png" 
                alt="Google Play" 
                width={180} 
                height={50}
              />
            </button>
          </div>
        </div>

        {/* Right Side Mobile Screens */}
        <div className="flex justify-center md:justify-end items-end relative gap-4">
          {/* Back Left Image */}
         

          {/* Main Center Image */}
          <Image
            src="/assets/footer_banner.png"
            alt="App Screen"
            width={500}
            height={200}
            className="rounded-xl w-fit   fit-cover  z-10"
          />

       
        </div>
      </div>
    </section>
  );
}
