import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AboutHero from "../components/about/AboutHero";
import AboutMissionVision from "../components/about/AboutMissionVision";
import AboutStats from "../components/about/AboutStats";
import AboutMilestones from "../components/about/AboutMilestones";
import AboutCtaBanner from "../components/about/AboutCtaBanner";
import { getAbout, getFooter, getSiteSettings } from "../lib/api";
import type { About, FooterSettings, SiteSettings } from "../types/api";

export default function AboutPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [footer, setFooter] = useState<FooterSettings | null>(null);
  const [about, setAbout] = useState<About | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);

    Promise.all([getSiteSettings(), getFooter(), getAbout()])
      .then(([settingsData, footerData, aboutData]) => {
        if (!active) return;
        setSettings(settingsData);
        setFooter(footerData);
        setAbout(aboutData);
      })
      .catch((err) => {
        console.error("Failed to load about page:", err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Navbar siteSettings={settings} isLoading={loading} />
      <main>
        <AboutHero about={about} isLoading={loading} />
        <AboutMissionVision about={about} />
        <AboutStats about={about} />
        <AboutMilestones about={about} />
        <AboutCtaBanner about={about} />
      </main>
      <Footer footer={footer} siteSettings={settings} isLoading={loading} />
    </div>
  );
}
