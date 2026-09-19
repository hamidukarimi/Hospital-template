import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ServiceDetailsHero from "../components/service-details/ServiceDetailsHero";
import ServicePartners from "../components/service-details/ServicePartners";
import ServiceOverview from "../components/service-details/ServiceOverview";
import ServiceDetailsServices from "../components/service-details/ServiceDetailsServices";
import {
  getFooter,
  getServiceBySlug,
  getServices,
  getSiteSettings,
  getTestimonials,
} from "../lib/api";
import type {
  FooterSettings,
  Service,
  SiteSettings,
  Testimonial,
} from "../types/api";

export default function ServiceDetailsPage() {
  const { slug } = useParams();
  const [service, setService] = useState<Service | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [footer, setFooter] = useState<FooterSettings | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!slug) return;
    let active = true;
    setLoading(true);
    Promise.all([
      slug === "details" ? Promise.resolve(null) : getServiceBySlug(slug),
      getServices(),
      getSiteSettings(),
      getFooter(),
      getTestimonials(),
    ])
      .then(
        ([details, allServices, settings, footerData, testimonialsData]) => {
          if (!active) return;
          setService(
            details ?? (slug === "details" ? (allServices?.[0] ?? null) : null),
          );
          setServices(allServices ?? []);
          setSiteSettings(settings);
          setFooter(footerData);
          setTestimonials(testimonialsData ?? []);
          setError(!details && (slug !== "details" || !allServices?.length));
        },
      )
      .catch(() => active && setError(true))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [slug]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar siteSettings={siteSettings} isLoading={loading} />
      <main>
        {loading ? (
          <div className="mx-auto max-w-7xl px-6 py-32 text-center text-slate-600">
            Loading service details...
          </div>
        ) : null}
        {!loading && error ? (
          <div className="mx-auto max-w-7xl px-6 py-32 text-center">
            <h1 className="text-3xl font-bold text-slate-900">
              Service not found
            </h1>
            <p className="mt-3 text-slate-600">
              The requested service is unavailable.
            </p>
          </div>
        ) : null}
        {!loading && service ? (
          <>
            <ServiceDetailsHero
              service={service}
              siteSettings={siteSettings}
              testimonials={testimonials}
            />
            <ServicePartners services={services} />
            <ServiceOverview service={service} />
            <ServiceDetailsServices
              services={services}
              currentSlug={service.slug}
            />
          </>
        ) : null}
      </main>
      <Footer footer={footer} siteSettings={siteSettings} isLoading={loading} />
    </div>
  );
}
