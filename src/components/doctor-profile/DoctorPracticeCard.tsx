import { Building2, ClipboardList, UserPlus } from "lucide-react";
import type { Doctor } from "../../types/api";

interface DoctorPracticeCardProps {
  doctor: Doctor;
}

export default function DoctorPracticeCard({ doctor }: DoctorPracticeCardProps) {
  const hasConsultationType = Boolean(doctor.consultationType);
  const hasConsultationLocation = Boolean(doctor.consultationLocation);
  const notAccepting = doctor.acceptingNewPatients === false;
  const showAcceptingStatus =
    notAccepting ||
    ((hasConsultationType || hasConsultationLocation) &&
      doctor.acceptingNewPatients !== null &&
      doctor.acceptingNewPatients !== undefined);

  if (!hasConsultationType && !hasConsultationLocation && !notAccepting) {
    return null;
  }

  return (
    <section className="rounded-2xl bg-white p-6 shadow-[0_12px_35px_rgba(0,0,0,0.08)]">
      <p className="text-sm font-medium text-gray-500">Practice</p>
      <h2 className="mt-1 text-2xl font-semibold text-gray-900">
        Practice information
      </h2>

      <dl className="mt-5 space-y-4">
        {hasConsultationType ? (
          <div className="flex gap-3">
            <ClipboardList className="mt-0.5 h-4 w-4 shrink-0 text-sky-500" />
            <div>
              <dt className="text-sm font-medium text-gray-800">
                Consultation type
              </dt>
              <dd className="mt-1 text-sm text-gray-600">
                {doctor.consultationType}
              </dd>
            </div>
          </div>
        ) : null}

        {hasConsultationLocation ? (
          <div className="flex gap-3">
            <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-sky-500" />
            <div>
              <dt className="text-sm font-medium text-gray-800">
                Location / department
              </dt>
              <dd className="mt-1 text-sm text-gray-600">
                {doctor.consultationLocation}
              </dd>
            </div>
          </div>
        ) : null}

        {showAcceptingStatus ? (
          <div className="flex gap-3">
            <UserPlus className="mt-0.5 h-4 w-4 shrink-0 text-sky-500" />
            <div>
              <dt className="text-sm font-medium text-gray-800">New patients</dt>
              <dd className="mt-1 text-sm text-gray-600">
                {doctor.acceptingNewPatients
                  ? "Currently accepting new patients"
                  : "Not currently accepting new patients"}
              </dd>
            </div>
          </div>
        ) : null}
      </dl>
    </section>
  );
}
