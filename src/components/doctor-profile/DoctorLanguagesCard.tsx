import { Languages } from "lucide-react";
import type { Doctor, DoctorLanguageItem } from "../../types/api";

interface DoctorLanguagesCardProps {
  doctor: Doctor;
}

export default function DoctorLanguagesCard({
  doctor,
}: DoctorLanguagesCardProps) {
  const languages: DoctorLanguageItem[] = Array.isArray(doctor.languages)
    ? doctor.languages
    : [];

  if (languages.length === 0) return null;

  return (
    <section className="rounded-2xl bg-white p-6 shadow-[0_12px_35px_rgba(0,0,0,0.08)]">
      <p className="text-sm font-medium text-gray-500">Languages</p>
      <h2 className="mt-1 text-2xl font-semibold text-gray-900">
        Languages spoken
      </h2>
      <div className="mt-5 flex flex-wrap gap-2">
        {languages.map((language) => (
          <span
            key={language.name}
            className="inline-flex items-center gap-1.5 rounded-full border border-sky-100 bg-sky-50 px-3 py-1.5 text-xs font-medium text-gray-700"
          >
            <Languages size={13} className="text-sky-500" />
            {language.name}
          </span>
        ))}
      </div>
    </section>
  );
}
