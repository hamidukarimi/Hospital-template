import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import HelpSection from "./components/HelpSection";
import AboutSection from "./components/AboutSection";
import ServicesSection from "./components/ServicesSection";
import TestimonialsSection from "./components/TestimonialsSection";
import WhyChooseSection from "./components/WhyChooseSection";
import LabTestsSection from "./components/LabTestsSection";
import DoctorsSection from "./components/DoctorsSection";
import ArticlesSection from "./components/ArticlesSection";
import Footer from "./components/Footer";

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
      <ArticlesSection />
      <Footer />
    </>
  );
}

export default App;