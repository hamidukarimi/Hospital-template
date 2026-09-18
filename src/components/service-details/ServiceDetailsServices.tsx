import { useState } from "react";
import { ArrowRight } from "lucide-react";

const services = [
  {
    id: 1,
    title: "Comprehensive Cardiology",
    description:
      "Advanced heart care, including diagnosis and interventional procedures.",
    image:
      "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    title: "Neurology Services",
    description:
      "Expert diagnosis and treatment for neurological conditions.",
    image:
      "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    title: "Maternity & Pediatrics",
    description:
      "Full-service prenatal care, safe labor, and child health.",
    image:
      "https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    title: "Orthopedics & Sports Medicine",
    description:
      "Bone, joint, and muscle treatments with a focus on recovery.",
    image:
      "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 5,
    title: "Emergency Medicine",
    description:
      "Immediate medical attention with experienced emergency specialists.",
    image:
      "https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 6,
    title: "General Surgery",
    description:
      "Advanced surgical care supported by modern facilities.",
    image:
      "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 7,
    title: "Dermatology",
    description:
      "Comprehensive diagnosis and treatment for skin conditions.",
    image:
      "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 8,
    title: "Ophthalmology",
    description:
      "Specialized eye care and advanced vision treatments.",
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
  },
];

export default function ServiceDetailsServices() {
  const [showAll, setShowAll] = useState(false);

  const visibleServices = showAll ? services : services.slice(0, 4);

  return (
    <section className="bg-slate-50 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-12">
          <p className="text-sm font-semibold text-slate-600">RE-DESIGNED</p>

          <h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl">
            Our Services
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {visibleServices.map((service) => (
            <div
              key={service.id}
              className="group overflow-hidden rounded-[2rem] border border-white bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="h-52 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>

              <div className="p-6">
                <h3 className="text-lg font-bold leading-tight text-slate-900">
                  {service.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {service.description}
                </p>

                <button className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#147BD5]">
                  Learn More
                  <ArrowRight
                    size={16}
                    className="transition group-hover:translate-x-1"
                  />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-6 sm:flex-row">
          <p className="max-w-2xl text-sm leading-6 text-slate-600">
            Quality care and advanced medical services designed around the
            needs of every patient and family.
          </p>

          <button
            onClick={() => setShowAll((current) => !current)}
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition hover:border-[#147BD5] hover:text-[#147BD5]"
          >
            {showAll ? "Show Less" : "View All Services"}
            <ArrowRight
              size={16}
              className={showAll ? "rotate-180" : ""}
            />
          </button>
        </div>
      </div>
    </section>
  );
}