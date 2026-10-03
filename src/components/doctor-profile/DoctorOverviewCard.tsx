import type { Doctor } from "../../types/api";

interface DoctorOverviewCardProps {
  doctor: Doctor;
}

export default function DoctorOverviewCard({ doctor }: DoctorOverviewCardProps) {
  if (!doctor.description && !doctor.carePhilosophy && !doctor.overviewTitle) {
    return null;
  }

  return (
    <section className="rounded-2xl bg-white p-6 shadow-[0_12px_35px_rgba(0,0,0,0.08)]">
      <p className="text-sm font-medium text-gray-500">Overview</p>

      <h2 className="mt-1 text-2xl font-semibold text-gray-900">
        {doctor.overviewTitle || `About ${doctor.name}`}
      </h2>

      {doctor.description ? (
        <p className="mt-4 whitespace-pre-line text-sm leading-6 text-gray-600">
          {doctor.description}
        </p>
      ) : null}

      {doctor.carePhilosophy ? (
        <div className="mt-5 rounded-xl bg-sky-50/80 px-4 py-3">
          <h3 className="text-sm font-semibold text-gray-900">
            Care philosophy
          </h3>
          <p className="mt-2 whitespace-pre-line text-sm leading-6 text-gray-600">
            {doctor.carePhilosophy}
          </p>
        </div>
      ) : null}
    </section>
  );
}
