import {
  Activity,
  Brain,
  Heart,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";
import type { Doctor, DoctorSpecialtyItem } from "../../types/api";

interface DoctorExpertiseCardProps {
  doctor: Doctor;
}

const iconMap: Record<string, LucideIcon> = {
  Heart,
  Activity,
  Stethoscope,
  Brain,
};

const defaultClassName = "bg-sky-50 text-sky-700 border-sky-200";

export default function DoctorExpertiseCard({
  doctor,
}: DoctorExpertiseCardProps) {
  const specialties: DoctorSpecialtyItem[] = Array.isArray(doctor.specialties)
    ? doctor.specialties
    : [];

  if (specialties.length === 0) return null;

  return (
    <section className="rounded-2xl bg-white p-6 shadow-[0_12px_35px_rgba(0,0,0,0.08)]">
      <p className="text-sm font-medium text-gray-500">
        Expertise
      </p>

      <h2 className="mt-1 text-2xl font-semibold text-gray-900">
        Specialties & Clinical Focus
      </h2>

      <div className="mt-5 flex flex-wrap gap-2">
        {specialties.map((specialty) => {
          const Icon =
            (specialty.icon && iconMap[specialty.icon]) || Stethoscope;

          return (
            <span
              key={specialty.label}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium ${specialty.className || defaultClassName}`}
            >
              <Icon size={13} />
              {specialty.label}
            </span>
          );
        })}
      </div>
    </section>
  );
}
