import BestsellerSection from "../Components/BestsellerSection";
import CategorySection from "../Components/Category";
import DownloadAppSection from "../Components/DownloadAppSection";


export default function Home() {
  return (
   <>
    <div className="container mt-10">
          <img src="/assets/banner.png" className="w-full"/>
    </div>
    <CategorySection />
    <BestsellerSection />
    <DownloadAppSection />
   </>
  );
}
