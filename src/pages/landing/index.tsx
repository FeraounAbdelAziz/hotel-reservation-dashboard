import { HeroSection } from "./components/HeroSection";
import { FeaturesSection } from "./components/FeaturesSection";
import { RoomsSection } from "./components/RoomsSection";
import { BookingSection } from "./components/BookingSection";
import { ContactSection } from "./components/ContactSection";
import { Footer } from "./components/Footer";

export const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <RoomsSection />
      <BookingSection />
      <ContactSection />
      <Footer />
    </div>
  );
}; 