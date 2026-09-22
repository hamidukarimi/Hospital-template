import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import DoctorExpertiseCard from "../../components/doctor-profile/DoctorExpertiseCard";
import DoctorExperienceCard from "../../components/doctor-profile/DoctorExperienceCard";
import DoctorOverviewCard from "../../components/doctor-profile/DoctorOverviewCard";
import DoctorProfileCard from "../../components/doctor-profile/DoctorProfileCard";
import {
  getDoctorBySlug,
  getFooter,
  getNavbar,
  getSiteSettings,
} from "../../lib/api";
import type {
  Doctor,
  FooterSettings,
  NavbarColumn,
  SiteSettings,
} from "../../types/api";

export default function DoctorProfilePage() {
  const { doctorSlug } = useParams();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [footer, setFooter] = useState<FooterSettings | null>(null);
  const [navbarColumns, setNavbarColumns] = useState<NavbarColumn[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!doctorSlug) return;

    let active = true;
    setLoading(true);
    setError(false);

    Promise.all([
      getDoctorBySlug(doctorSlug),
      getSiteSettings(),
      getFooter(),
      getNavbar(),
    ])
      .then(([doctorData, settingsData, footerData, navbarData]) => {
        if (!active) return;
        setDoctor(doctorData);
        setSiteSettings(settingsData);
        setFooter(footerData);
        setNavbarColumns(navbarData ?? []);
        setError(!doctorData);
      })
      .catch(() => {
        if (!active) return;
        setDoctor(null);
        setError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [doctorSlug]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50">
      <Navbar
        siteSettings={siteSettings}
        columns={navbarColumns}
        isLoading={loading}
      />
      <main>
        <div className="mx-auto max-w-7xl px-5 py-12 mt-10 sm:px-8 lg:px-10 lg:py-16">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
              Meet Your Doctor
            </h1>
          </div>

          {loading ? <DoctorProfileSkeleton /> : null}

          {!loading && error ? (
            <div className="rounded-2xl bg-white p-10 text-center shadow-[0_12px_35px_rgba(0,0,0,0.08)]">
              <h2 className="text-2xl font-semibold text-gray-900">
                Doctor not found
              </h2>
              <p className="mt-3 text-sm text-gray-600">
                The requested doctor profile is unavailable.
              </p>
            </div>
          ) : null}

          {!loading && doctor ? (
            <div className="grid gap-7 lg:grid-cols-[300px_minmax(0,1fr)] lg:items-start">
              <DoctorProfileCard doctor={doctor} />

              <div className="space-y-7">
                <DoctorOverviewCard doctor={doctor} />
                <DoctorExpertiseCard doctor={doctor} />
                <DoctorExperienceCard doctor={doctor} />
              </div>
            </div>
          ) : null}
        </div>
      </main>
      <Footer footer={footer} siteSettings={siteSettings} isLoading={loading} />
    </div>
  );
}

function DoctorProfileSkeleton() {
  return (
    <div className="grid gap-7 lg:grid-cols-[300px_minmax(0,1fr)] lg:items-start">
      {/* Profile card */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-[0_12px_35px_rgba(0,0,0,0.10)] animate-pulse">
        <div className="relative h-36 bg-gradient-to-r from-sky-200 via-cyan-200 to-teal-200">
          <div className="absolute -bottom-14 left-1/2 h-32 w-[120%] -translate-x-1/2 rounded-[50%] bg-white" />
        </div>
        <div className="relative -mt-24 flex justify-center">
          <div className="h-32 w-32 rounded-full border-4 border-white bg-slate-200 shadow-lg" />
        </div>
        <div className="space-y-3 px-6 pb-7 pt-3 text-center">
          <div className="mx-auto h-7 w-40 rounded bg-slate-200" />
          <div className="mx-auto h-4 w-24 rounded bg-slate-100" />
          <div className="mt-5 h-11 w-full rounded-full bg-sky-100" />
          <div className="mt-7 grid grid-cols-3 gap-2 divide-x divide-gray-100">
            <div className="space-y-2 px-2">
              <div className="mx-auto h-7 w-10 rounded bg-slate-200" />
              <div className="mx-auto h-3 w-12 rounded bg-slate-100" />
            </div>
            <div className="space-y-2 px-2">
              <div className="mx-auto h-7 w-10 rounded bg-slate-200" />
              <div className="mx-auto h-3 w-12 rounded bg-slate-100" />
            </div>
            <div className="space-y-2 px-2">
              <div className="mx-auto h-7 w-10 rounded bg-slate-200" />
              <div className="mx-auto h-3 w-12 rounded bg-slate-100" />
            </div>
          </div>
        </div>
      </div>

      {/* Right column cards */}
      <div className="space-y-7">
        <div className="animate-pulse rounded-2xl bg-white p-6 shadow-[0_12px_35px_rgba(0,0,0,0.08)]">
          <div className="h-4 w-20 rounded bg-slate-100" />
          <div className="mt-2 h-7 w-56 rounded bg-slate-200" />
          <div className="mt-4 space-y-2">
            <div className="h-3.5 w-full rounded bg-slate-100" />
            <div className="h-3.5 w-full rounded bg-slate-100" />
            <div className="h-3.5 w-4/5 rounded bg-slate-100" />
          </div>
        </div>

        <div className="animate-pulse rounded-2xl bg-white p-6 shadow-[0_12px_35px_rgba(0,0,0,0.08)]">
          <div className="h-4 w-20 rounded bg-slate-100" />
          <div className="mt-2 h-7 w-64 rounded bg-slate-200" />
          <div className="mt-5 flex flex-wrap gap-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="h-8 w-28 rounded-full bg-slate-100"
              />
            ))}
          </div>
        </div>

        <div className="animate-pulse rounded-2xl bg-white p-6 shadow-[0_12px_35px_rgba(0,0,0,0.08)]">
          <div className="h-4 w-24 rounded bg-slate-100" />
          <div className="mt-2 h-7 w-72 rounded bg-slate-200" />
          <div className="mt-6 space-y-5">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="grid grid-cols-[52px_20px_1fr] gap-2"
              >
                <div className="h-4 w-10 rounded bg-slate-100" />
                <div className="flex justify-center pt-1">
                  <div className="h-3 w-3 rounded-full bg-sky-200" />
                </div>
                <div className="h-4 w-3/4 rounded bg-slate-100" />
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-8 w-36 rounded-full bg-sky-50"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
