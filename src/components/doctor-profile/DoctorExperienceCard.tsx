import {
  Award,
  BookOpen,
  FlaskConical,
  type LucideIcon,
} from "lucide-react";
import type {
  Doctor,
  DoctorAchievementItem,
  DoctorCertificationItem,
  DoctorEducationItem,
  DoctorMembershipItem,
} from "../../types/api";

interface DoctorExperienceCardProps {
  doctor: Doctor;
}

const iconMap: Record<string, LucideIcon> = {
  Award,
  BookOpen,
  FlaskConical,
};

const MembershipList = ({
  title,
  items,
}: {
  title: string;
  items: DoctorMembershipItem[];
}) => {
  if (items.length === 0) return null;

  return (
    <div className="mt-6">
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={`${item.name}-${item.role ?? ""}`} className="text-sm">
            <span className="font-medium text-gray-800">{item.name}</span>
            {item.role ? (
              <span className="text-gray-600"> — {item.role}</span>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default function DoctorExperienceCard({
  doctor,
}: DoctorExperienceCardProps) {
  const education: DoctorEducationItem[] = Array.isArray(doctor.education)
    ? doctor.education
    : [];
  const certifications: DoctorCertificationItem[] = Array.isArray(
    doctor.certifications,
  )
    ? doctor.certifications
    : [];
  const achievements: DoctorAchievementItem[] = Array.isArray(
    doctor.achievements,
  )
    ? doctor.achievements
    : [];
  const memberships: DoctorMembershipItem[] = Array.isArray(doctor.memberships)
    ? doctor.memberships
    : [];
  const affiliations: DoctorMembershipItem[] = Array.isArray(doctor.affiliations)
    ? doctor.affiliations
    : [];

  if (
    education.length === 0 &&
    certifications.length === 0 &&
    achievements.length === 0 &&
    memberships.length === 0 &&
    affiliations.length === 0
  ) {
    return null;
  }

  return (
    <section className="rounded-2xl bg-white p-6 shadow-[0_12px_35px_rgba(0,0,0,0.08)]">
      <p className="text-sm font-medium text-gray-500">Experience</p>

      <h2 className="mt-1 text-2xl font-semibold text-gray-900">
        Education, credentials & recognition
      </h2>

      {education.length > 0 ? (
        <div className="mt-6">
          <h3 className="mb-4 text-base font-semibold text-gray-900">
            Education and training
          </h3>
          {education.map((item, index) => (
            <div
              key={`${item.year}-${item.title}-${index}`}
              className="grid grid-cols-[52px_20px_1fr] gap-2"
            >
              <span className="pt-0.5 text-sm text-gray-500">{item.year}</span>

              <div className="relative flex justify-center">
                {index !== education.length - 1 && (
                  <span className="absolute top-3 h-full w-px bg-gray-200" />
                )}
                <span className="relative z-10 mt-1 h-3 w-3 rounded-full bg-sky-500 ring-4 ring-sky-50" />
              </div>

              <div className="pb-5 text-sm">
                <span className="font-semibold text-gray-900">{item.title}:</span>{" "}
                <span className="text-gray-600">{item.institution}</span>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {certifications.length > 0 ? (
        <div className={`${education.length > 0 ? "mt-2" : "mt-6"}`}>
          <h3 className="text-base font-semibold text-gray-900">
            Certifications and licenses
          </h3>
          <ul className="mt-3 space-y-2">
            {certifications.map((item) => (
              <li key={`${item.name}-${item.year ?? ""}`} className="text-sm">
                <span className="font-medium text-gray-800">{item.name}</span>
                {item.issuer || item.year ? (
                  <span className="text-gray-600">
                    {" "}
                    — {[item.issuer, item.year].filter(Boolean).join(", ")}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {achievements.length > 0 ? (
        <div className="mt-6">
          <h3 className="text-base font-semibold text-gray-900">
            Awards and recognition
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {achievements.map((achievement) => {
              const Icon =
                (achievement.icon && iconMap[achievement.icon]) || Award;

              return (
                <span
                  key={achievement.label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-sky-100 bg-sky-50 px-3 py-1.5 text-xs font-medium text-gray-700"
                >
                  <Icon size={13} className="text-sky-500" />
                  {achievement.label}
                </span>
              );
            })}
          </div>
        </div>
      ) : null}

      <MembershipList title="Professional memberships" items={memberships} />
      <MembershipList
        title="Hospital and institutional affiliations"
        items={affiliations}
      />
    </section>
  );
}
