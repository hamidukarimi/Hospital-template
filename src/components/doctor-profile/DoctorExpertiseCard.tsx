import {
  Activity,
  Brain,
  Heart,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";
import type {
  Doctor,
  DoctorNamedItem,
  DoctorSpecialtyItem,
} from "../../types/api";

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

const NamedList = ({
  title,
  items,
}: {
  title: string;
  items: DoctorNamedItem[];
}) => {
  if (items.length === 0) return null;

  return (
    <div className="mt-6">
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      <ul className="mt-3 space-y-3">
        {items.map((item) => (
          <li key={item.name}>
            <p className="text-sm font-medium text-gray-800">{item.name}</p>
            {item.description ? (
              <p className="mt-1 text-sm leading-6 text-gray-600">
                {item.description}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default function DoctorExpertiseCard({
  doctor,
}: DoctorExpertiseCardProps) {
  const specialties: DoctorSpecialtyItem[] = Array.isArray(doctor.specialties)
    ? doctor.specialties
    : [];
  const clinicalInterests: DoctorNamedItem[] = Array.isArray(
    doctor.clinicalInterests,
  )
    ? doctor.clinicalInterests
    : [];
  const conditionsTreated: DoctorNamedItem[] = Array.isArray(
    doctor.conditionsTreated,
  )
    ? doctor.conditionsTreated
    : [];
  const procedures: DoctorNamedItem[] = Array.isArray(doctor.procedures)
    ? doctor.procedures
    : [];

  if (
    specialties.length === 0 &&
    clinicalInterests.length === 0 &&
    conditionsTreated.length === 0 &&
    procedures.length === 0
  ) {
    return null;
  }

  return (
    <section className="rounded-2xl bg-white p-6 shadow-[0_12px_35px_rgba(0,0,0,0.08)]">
      <p className="text-sm font-medium text-gray-500">Expertise</p>

      <h2 className="mt-1 text-2xl font-semibold text-gray-900">
        Clinical expertise
      </h2>

      {specialties.length > 0 ? (
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
      ) : null}

      <NamedList title="Clinical interests" items={clinicalInterests} />
      <NamedList title="Conditions treated" items={conditionsTreated} />
      <NamedList title="Procedures and treatments" items={procedures} />
    </section>
  );
}
