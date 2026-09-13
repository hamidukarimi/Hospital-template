import {
  ArrowRight,
  CheckCheck,
} from "lucide-react";
import { motion } from "framer-motion";

interface Service {
  title: string;
  description: string;
  image: string;
  features: string[];
}

const services: Service[] = [
  {
    title: "Neuro Therapy Unit",
    description:
      "Find the care your family needs, close to home, at one of our many locations. From Monroe Carell Jr.",
    image:
      "./example.jpg",
    features: [
      "Advanced Neurological Care",
      "Personalized Treatment",
    ],
  },
  {
    title: "Newborn Care Unit",
    description:
      "Find the care your family needs, close to home, at one of our many locations. From Monroe Carell Jr.",
    image:
      "./example-2.jpg",
    features: [
      "Specialized Newborn Care",
      "Advanced Infant Health Care",
    ],
  },
  {
    title: "Pediatric Physical Therapy",
    description:
      "Find the care your family needs, close to home, at one of our many locations. From Monroe Carell Jr.",
    image:
      "./example-3.jpg",
    features: [
      "Pediatric Rehabilitation",
      "Advanced Physical Therapy",
    ],
  },
  {
    title: "Inpatient Pediatric Care",
    description:
      "Find the care your family needs, close to home, at one of our many locations. From Monroe Carell Jr.",
    image:
      "./example-4.jpg",
    features: [
      "Comprehensive Pediatric Care",
      "Advanced Health Services",
    ],
  },
];

const ServicesSection = () => {
  return (
    <section className="relative overflow-hidden bg-[#f3f6fa] px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
      {/* Purple decorative glow */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-[260px] w-[260px] rounded-full bg-violet-300/50 blur-[80px]" />

      <div className="relative mx-auto max-w-[1450px]">
        {/* ================================================== */}
        {/* SECTION HEADING */}
        {/* ================================================== */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-[650px] text-center"
        >
          <p className="text-[9px] font-semibold uppercase tracking-[0.08em] text-blue-600">
            Our Services
          </p>

          <h2 className="mt-2 text-[31px] font-normal leading-[1.15] tracking-[-0.8px] text-[#071535] sm:text-[37px] lg:text-[42px]">
            We Serve In Different{" "}
            <span className="font-bold">
              Areas For
            </span>
            <br className="hidden sm:block" />
            <span className="font-bold">
              Our Patients
            </span>
          </h2>
        </motion.div>

        {/* ================================================== */}
        {/* SERVICE CARDS */}
        {/* ================================================== */}

        <div className="mt-9 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <motion.article
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                duration: 0.55,
                delay: index * 0.08,
              }}
              className="group"
            >
              {/* Image */}
              <div className="relative overflow-hidden rounded-[20px]">
                <img
                  src={service.image}
                  alt={service.title}
                  className="h-[255px] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />

                {/* Bottom-right cutout */}
                <div className="absolute bottom-0 right-0 flex h-[58px] w-[72px] items-end justify-end rounded-tl-[32px] bg-[#f3f6fa] pl-3 pt-3">
                  {/* White circular arrow */}
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex h-[43px] w-[43px] items-center justify-center rounded-full bg-white text-[#071535] shadow-[0_4px_15px_rgba(0,0,0,0.08)] transition-all duration-200 hover:bg-violet-500 hover:text-white"
                    aria-label={`View ${service.title}`}
                  >
                    <ArrowRight size={18} strokeWidth={1.8} />
                  </motion.button>
                </div>
              </div>

              {/* Content */}
              <div className="px-1 pt-4">
                <h3 className="text-[13px] font-bold leading-5 text-[#071535]">
                  {service.title}
                </h3>

                <p className="mt-2 text-[9px] leading-[1.65] text-slate-500">
                  {service.description}
                </p>

                {/* Features */}
                <div className="mt-3 space-y-2">
                  {service.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-2"
                    >
                      <CheckCheck
                        size={14}
                        strokeWidth={2.4}
                        className="shrink-0 text-[#18b77b]"
                      />

                      <span className="text-[9px] font-medium text-[#071535]">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* ================================================== */}
        {/* VIEW ALL SERVICES */}
        {/* ================================================== */}

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10 flex justify-center"
        >
          <motion.a
            href="#"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="group inline-flex items-center gap-2 rounded-full bg-[#55b997] px-7 py-2.5 text-[10px] font-medium text-white shadow-[0_6px_15px_rgba(85,185,151,0.2)] transition-colors duration-200 hover:bg-violet-500"
          >
            <span>View All Services</span>

            <ArrowRight
              size={13}
              strokeWidth={2}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;