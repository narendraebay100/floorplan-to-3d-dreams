import { HeroSection } from "@/components/HeroSection";
import { FileUploadSection } from "@/components/FileUploadSection";
import { Viewer3D } from "@/components/Viewer3D";
import { Footer } from "@/components/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FileUploadSection />
      <Viewer3D />
      <Footer />
    </div>
  );
};

export default Index;