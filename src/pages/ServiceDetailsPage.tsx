import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import ServiceDetailsHero from "../components/service-details/ServiceDetailsHero";
import ServicePartners from "../components/service-details/ServicePartners";
import ServiceOverview from "../components/service-details/ServiceOverview";
import ServiceDetailsServices from "../components/service-details/ServiceDetailsServices";

export default function ServiceDetailsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main>
        <ServiceDetailsHero />
        <ServicePartners />
        <ServiceOverview />
        <ServiceDetailsServices />
      </main>

      <Footer />
    </div>
  );
}