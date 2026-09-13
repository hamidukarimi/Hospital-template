import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import HelpSection from "./components/HelpSection";
import AboutSection from "./components/AboutSection";
import ServicesSection from "./components/ServicesSection";
import TestimonialsSection from "./components/TestimonialsSection";
import WhyChooseSection from "./components/WhyChooseSection";
import LabTestsSection from "./components/LabTestsSection";
import DoctorsSection from "./components/DoctorsSection";

function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <HelpSection />
      <AboutSection />
      <ServicesSection />
      <TestimonialsSection />
      <WhyChooseSection />
      <LabTestsSection />
      <DoctorsSection />
    </>
  );
}

export default App;