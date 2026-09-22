import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DoctorExpertiseCard from "../../components/doctor-profile/DoctorExpertiseCard";
import DoctorExperienceCard from "../../components/doctor-profile/DoctorExperienceCard";
import DoctorOverviewCard from "../../components/doctor-profile/DoctorOverviewCard";
import DoctorProfileCard from "../../components/doctor-profile/DoctorProfileCard";
import { getDoctorBySlug } from "../../lib/api";
import type { Doctor } from "../../types/api";

export default function DoctorProfilePage() {
  const { doctorSlug } = useParams();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!doctorSlug) return;

    let active = true;
    setLoading(true);
    setError(false);

    getDoctorBySlug(doctorSlug)
      .then((data) => {
        if (!active) return;
        setDoctor(data);
        setError(!data);
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
    <main className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
        {/* Page Heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
            Meet Your Doctor
          </h1>
        </div>

        {loading ? (
          <div className="grid gap-7 lg:grid-cols-[300px_minmax(0,1fr)] lg:items-start">
            <div className="h-[420px] animate-pulse rounded-2xl bg-white/80" />
            <div className="space-y-7">
              <div className="h-40 animate-pulse rounded-2xl bg-white/80" />
              <div className="h-40 animate-pulse rounded-2xl bg-white/80" />
              <div className="h-56 animate-pulse rounded-2xl bg-white/80" />
            </div>
          </div>
        ) : null}

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
  );
}
