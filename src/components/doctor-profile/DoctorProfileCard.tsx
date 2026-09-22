import { CalendarDays } from "lucide-react";
import { getImageUrl } from "../../lib/api";
import type { Doctor } from "../../types/api";

interface DoctorProfileCardProps {
  doctor: Doctor;
}

export default function DoctorProfileCard({ doctor }: DoctorProfileCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-[0_12px_35px_rgba(0,0,0,0.10)]">
      {/* Gradient Header */}
      <div className="relative h-36 overflow-hidden bg-gradient-to-r from-sky-500 via-cyan-500 to-teal-400">
        <div className="absolute -bottom-14 left-1/2 h-32 w-[120%] -translate-x-1/2 rounded-[50%] bg-white" />
      </div>

      {/* Doctor Image */}
      <div className="relative -mt-24 flex justify-center">
        <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-white shadow-lg">
          <img
            src={getImageUrl(doctor.image) || "/images/doctors/ahmad-kha.jpg"}
            alt={doctor.name}
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {/* Doctor Information */}
      <div className="px-6 pb-7 pt-3 text-center">
        <h2 className="text-2xl font-semibold text-gray-900">
          {doctor.name}
        </h2>

        {doctor.credentials ? (
          <p className="mt-1 text-sm text-gray-500">
            {doctor.credentials}
          </p>
        ) : null}

        <button
          type="button"
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-sky-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-sky-600"
        >
          <CalendarDays size={17} />
          Schedule Appointment
        </button>

        {/* Statistics */}
        <div className="mt-7 grid grid-cols-3 divide-x divide-gray-200">
          <div className="px-2">
            <p className="text-2xl font-semibold text-gray-900">
              {doctor.yearsExperience || "—"}
            </p>
            <p className="mt-1 text-xs leading-tight text-gray-500">
              Years
              <br />
              Experience
            </p>
          </div>

          <div className="px-2">
            <p className="text-2xl font-semibold text-gray-900">
              {doctor.patientsTreated || "—"}
            </p>
            <p className="mt-1 text-xs leading-tight text-gray-500">
              Patients
              <br />
              Treated
            </p>
          </div>

          <div className="px-2">
            <p className="text-2xl font-semibold text-gray-900">
              {doctor.rating || "—"}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Rating
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
