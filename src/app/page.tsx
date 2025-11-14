import BannerSlider from '@/components/home/BannerSlider';
import TabCategories from '@/components/home/TabCategories';
import MasonaryGrid from '@/components/gallery/MasonaryGrid';
import AboutUs from '@/components/home/AboutUs';
import PricingTestimonials from '@/components/features/PricingTestimonials';
import NewsSection from '@/components/home/NewsSection';

export default function HomePage() {
  return (
    <div>
      <BannerSlider />
      <TabCategories />
      <MasonaryGrid />
      <AboutUs />
      <PricingTestimonials />
      <NewsSection />
    </div>
  );
}
