import { motion } from "framer-motion";
import { ArrowRight, Headphones, Star } from "lucide-react";

const stats = [
  { value: 150, suffix: "+", label: "Top Doctors" },
  { value: 50, suffix: "+", label: "Specialized Clinics" },
];

const patients = [
  { emoji: "👩🏻", name: "Patient" },
  { emoji: "👨🏻", name: "Patient" },
  { emoji: "👩🏽", name: "Patient" },
  { emoji: "👨🏽", name: "Patient" },
];

export default function ServiceDetailsHero() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative min-h-[650px] bg-slate-100">
        {/* Background image placeholder */}
        <img
          src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=2000&q=85"
          alt="Medical care"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Light overlay */}
        <div className="absolute inset-0 bg-white/75" />

        <div className="relative mx-auto flex min-h-[650px] max-w-7xl items-center px-6 py-20 lg:px-8">
          <div className="grid w-full items-center gap-10 lg:grid-cols-[1fr_0.75fr]">
            {/* Left */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="max-w-2xl"
            >
              <h1 className="text-4xl font-bold leading-[1.08] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Expert Medical Care
                <br />
                For Your Family.
              </h1>

              <p className="mt-6 max-w-xl text-base leading-7 text-slate-700 sm:text-lg">
                Compassionate, comprehensive hospital services you can trust.
                Over 550+ patients recovered.
              </p>

              <button className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#147BD5] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-[#106dbd]">
                Schedule a Visit
                <ArrowRight size={17} />
              </button>

              {/* Trusted patients */}
              <div className="mt-9 flex items-center gap-3">
                <div className="flex -space-x-2">
                  {patients.map((patient, index) => (
                    <div
                      key={index}
                      className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-xl shadow-sm"
                    >
                      {patient.emoji}
                    </div>
                  ))}
                </div>

                <div>
                  <div className="flex items-center gap-1 text-sm font-semibold text-slate-900">
                    <Star
                      size={15}
                      fill="#F7C12B"
                      className="text-[#F7C12B]"
                    />
                    4.9 Rating
                  </div>
                  <p className="text-sm text-slate-600">
                    Trusted by 1.5k patients
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Right stats */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="flex justify-center lg:justify-end"
            >
              <div className="flex flex-col gap-4">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-white/80 bg-white/85 px-7 py-4 text-center shadow-lg backdrop-blur-sm"
                  >
                    <div className="text-3xl font-bold text-[#147BD5]">
                      <CountUp value={stat.value} />
                      {stat.suffix}
                    </div>

                    <p className="mt-1 text-xs font-medium text-slate-700">
                      {stat.label}
                    </p>
                  </div>
                ))}

                {/* Replaces Virtual Tour */}
                <div className="rounded-2xl border border-white/80 bg-white/90 p-4 shadow-lg backdrop-blur-sm">
                  <div className="flex h-24 w-36 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-slate-200">
                    <Headphones className="text-[#147BD5]" size={34} />
                  </div>

                  <div className="mt-3 text-center">
                    <p className="font-semibold text-slate-900">
                      24/7 Patient Support
                    </p>
                    <p className="mt-1 text-xs text-slate-600">
                      We're here whenever you need us.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CountUp({ value }: { value: number }) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <AnimatedNumber value={value} />
    </motion.span>
  );
}

function AnimatedNumber({ value }: { value: number }) {
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