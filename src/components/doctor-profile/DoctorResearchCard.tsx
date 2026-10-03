import type {
  Doctor,
  DoctorNamedItem,
  DoctorPublicationItem,
  DoctorTeachingItem,
} from "../../types/api";

interface DoctorResearchCardProps {
  doctor: Doctor;
}

export default function DoctorResearchCard({ doctor }: DoctorResearchCardProps) {
  const researchInterests: DoctorNamedItem[] = Array.isArray(
    doctor.researchInterests,
  )
    ? doctor.researchInterests
    : [];
  const publications: DoctorPublicationItem[] = Array.isArray(
    doctor.publications,
  )
    ? doctor.publications
    : [];
  const teachingExperience: DoctorTeachingItem[] = Array.isArray(
    doctor.teachingExperience,
  )
    ? doctor.teachingExperience
    : [];

  if (
    researchInterests.length === 0 &&
    publications.length === 0 &&
    teachingExperience.length === 0
  ) {
    return null;
  }

  return (
    <section className="rounded-2xl bg-white p-6 shadow-[0_12px_35px_rgba(0,0,0,0.08)]">
      <p className="text-sm font-medium text-gray-500">Research</p>
      <h2 className="mt-1 text-2xl font-semibold text-gray-900">
        Research and academic work
      </h2>

      {researchInterests.length > 0 ? (
        <div className="mt-5">
          <h3 className="text-base font-semibold text-gray-900">
            Research interests
          </h3>
          <ul className="mt-3 space-y-3">
            {researchInterests.map((item) => (
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
      ) : null}

      {publications.length > 0 ? (
        <div className="mt-6">
          <h3 className="text-base font-semibold text-gray-900">Publications</h3>
          <ul className="mt-3 space-y-3">
            {publications.map((item) => (
              <li key={`${item.title}-${item.year ?? ""}`} className="text-sm">
                {item.url ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-sky-700 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
                  >
                    {item.title}
                  </a>
                ) : (
                  <span className="font-medium text-gray-800">{item.title}</span>
                )}
                {item.venue || item.year ? (
                  <p className="mt-1 text-gray-600">
                    {[item.venue, item.year].filter(Boolean).join(" · ")}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {teachingExperience.length > 0 ? (
        <div className="mt-6">
          <h3 className="text-base font-semibold text-gray-900">
            Teaching experience
          </h3>
          <ul className="mt-3 space-y-2">
            {teachingExperience.map((item) => (
              <li key={`${item.title}-${item.year ?? ""}`} className="text-sm">
                <span className="font-medium text-gray-800">{item.title}</span>
                {item.institution || item.year ? (
                  <span className="text-gray-600">
                    {" "}
                    — {[item.institution, item.year].filter(Boolean).join(", ")}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
