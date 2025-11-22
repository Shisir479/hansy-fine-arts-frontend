
import PortraitCarousel from "@/components/CustomPortrait/PortraitCarousel";
import banner from "../assets/gallery-banner.jpg";
import CustomPortraitAgreement from "@/components/CustomPortrait/CustomPortraitAgreement";
import ArtCommissionAgreement from "@/components/CustomPortrait/ArtCommissionAgreement";


const CustomPortrait = () => {
  return (
    <div>
      <div className="max-w-7xl mx-auto my-10 grid lg:grid-cols-2 grid-cols-1 gap-50">
        <PortraitCarousel />
        <div>
          <CustomPortraitAgreement></CustomPortraitAgreement>
          <ArtCommissionAgreement></ArtCommissionAgreement>
        </div>
      </div>
    </div>
  );
};

export default CustomPortrait;
