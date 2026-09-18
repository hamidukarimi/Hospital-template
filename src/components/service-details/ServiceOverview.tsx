import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const overviewStats = [
  {
    value: 75,
    suffix: "+",
    label: "Departments",
  },
  {
    value: 2000,
    suffix: "+",
    label: "Surgeries Annually",
  },
];

const technologyStats = {
  value: 1000,
  suffix: "+",
  label: "Patients Served",
};

function CountUp({ value }: { value: number }) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {value}
    </motion.span>
  );
}

export default function ServiceOverview() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-12">
          <p className="text-sm font-semibold text-slate-600">
            About Our Services
          </p>

          <h2 className="mt-2 max-w-2xl text-3xl font-bold leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Compassionate Care,
            <br />
            <span className="text-[#147BD5]">Advanced Technology</span>
          </h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          {/* Main image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="overflow-hidden rounded-3xl"
          >
            <img
              src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=85"
              alt="Hospital patient care"
              className="h-full min-h-[400px] w-full object-cover"
            />
          </motion.div>

          {/* Right content */}
          <div className="flex flex-col gap-5">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Our Patient-First Approach
                </h3>

                <p className="mt-3 max-w-md text-sm leading-6 text-slate-600">
                  We provide compassionate, personalized care designed around
                  every patient's individual needs and recovery journey.
                </p>

                <button className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#147BD5] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-100 transition hover:bg-[#106dbd]">
                  Learn More
                  <ArrowRight size={16} />
                </button>
              </div>

              <div className="rounded-3xl bg-gradient-to-br from-blue-50 to-blue-100 p-6 shadow-sm">
                {overviewStats.map((stat) => (
                  <div key={stat.label} className="mb-5 last:mb-0">
                    <div className="text-3xl font-bold text-[#147BD5]">
                      <CountUp value={stat.value} />
                      {stat.suffix}
                    </div>
                    <p className="mt-1 text-sm font-medium text-slate-700">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-[1fr_0.8fr]">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Innovating with Technology for Health
                </h3>

                <p className="mt-3 max-w-md text-sm leading-6 text-slate-600">
                  Modern medical technology helps our specialists deliver
                  accurate diagnosis, advanced treatment, and better outcomes.
                </p>

                <button className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#147BD5] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-100 transition hover:bg-[#106dbd]">
                  Learn More
                  <ArrowRight size={16} />
                </button>
              </div>

              <div className="rounded-3xl bg-gradient-to-br from-blue-50 to-blue-100 p-6 shadow-sm">
                <div className="text-3xl font-bold text-[#147BD5]">
                  <CountUp value={technologyStats.value} />
                  {technologyStats.suffix}
                </div>

                <p className="mt-1 text-sm font-medium text-slate-700">
                  {technologyStats.label}
                </p>

                <button className="mt-6 w-full rounded-full bg-[#147BD5] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#106dbd]">
                  Request Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}