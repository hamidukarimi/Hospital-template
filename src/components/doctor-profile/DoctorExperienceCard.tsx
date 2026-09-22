import {
  Award,
  BookOpen,
  FlaskConical,
  type LucideIcon,
} from "lucide-react";
import type {
  Doctor,
  DoctorAchievementItem,
  DoctorEducationItem,
} from "../../types/api";

interface DoctorExperienceCardProps {
  doctor: Doctor;
}

const iconMap: Record<string, LucideIcon> = {
  Award,
  BookOpen,
  FlaskConical,
};

export default function DoctorExperienceCard({
  doctor,
}: DoctorExperienceCardProps) {
  const education: DoctorEducationItem[] = Array.isArray(doctor.education)
    ? doctor.education
    : [];
  const achievements: DoctorAchievementItem[] = Array.isArray(
    doctor.achievements,
  )
    ? doctor.achievements
    : [];

  if (education.length === 0 && achievements.length === 0) return null;

  return (
    <section className="rounded-2xl bg-white p-6 shadow-[0_12px_35px_rgba(0,0,0,0.08)]">
      <p className="text-sm font-medium text-gray-500">
        Experience
      </p>

      <h2 className="mt-1 text-2xl font-semibold text-gray-900">
        Education, Training & Certifications
      </h2>

      {/* Timeline */}
      {education.length > 0 ? (
        <div className="mt-6">
          {education.map((item, index) => (
            <div
              key={`${item.year}-${item.title}-${index}`}
              className="grid grid-cols-[52px_20px_1fr] gap-2"
            >
              {/* Year */}
              <span className="pt-0.5 text-sm text-gray-500">
                {item.year}
              </span>

              {/* Timeline */}
              <div className="relative flex justify-center">
                {index !== education.length - 1 && (
                  <span className="absolute top-3 h-full w-px bg-gray-200" />
                )}

                <span className="relative z-10 mt-1 h-3 w-3 rounded-full bg-sky-500 ring-4 ring-sky-50" />
              </div>

              {/* Content */}
              <div className="pb-5 text-sm">
                <span className="font-semibold text-gray-900">
                  {item.title}:
                </span>{" "}
                <span className="text-gray-600">
                  {item.institution}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {/* Achievements */}
      {achievements.length > 0 ? (
        <div className={`${education.length > 0 ? "mt-2" : "mt-6"} flex flex-wrap gap-2`}>
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
      ) : null}
    </section>
  );
}
