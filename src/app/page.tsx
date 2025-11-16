import BannerSlider from "@/components/home/BannerSlider";
import FileImageFormFineWork from "@/components/features/FileImageFormFineWork";
// import MasonaryGrid from "@/components/gallery/DomeGallery";
import AboutUs from "@/components/home/AboutUs";
import PricingTestimonials from "@/components/features/PricingTestimonials";
import NewsSection from "@/components/home/NewsSection";
import DomeGallery from "@/components/gallery/DomeGallery";

export default function HomePage() {
  return (
    <div>
      <BannerSlider />
      <FileImageFormFineWork />
      <DomeGallery />
      <AboutUs />
      <PricingTestimonials />
      <NewsSection />
    </div>
  );
}
