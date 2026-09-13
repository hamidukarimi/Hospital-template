import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface ReasonCard {
  title: string;
  description: string;
  image: string;
  borderColor: string;
  shadowColor: string;
}

const reasons: ReasonCard[] = [
  {
    title: "Not Just Better Care, But A Better Experience",
    description:
      "At our medical center, we believe in providing not just better care but a better experience overall. We understand that your journey to health.",
    image: "./example.jpg",
    borderColor: "border-[#9bcce8]",
    shadowColor: "shadow-[0_18px_28px_rgba(92,157,197,0.22)]",
  },
  {
    title: "Serving All People Through Exemplary Care",
    description:
      "At our medical center, we believe in providing not just better care but a better experience overall. We understand that your journey to health.",
    image: "./example-2.jpg",
    borderColor: "border-[#d1aa96]",
    shadowColor: "shadow-[0_18px_28px_rgba(171,119,92,0.20)]",
  },
  {
    title: "Specialty Medicine with Compassion and Care",
    description:
      "At our medical center, we believe in providing not just better care but a better experience overall. We understand that your journey to health.",
    image: "./example-3.jpg",
    borderColor: "border-[#83d4df]",
    shadowColor: "shadow-[0_18px_28px_rgba(73,181,195,0.22)]",
  },
];

const WhyChooseSection = () => {
  return (
    <section className="relative overflow-hidden bg-[#f3f8fc] px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
      {/* ================================================== */}
      {/* BACKGROUND DECORATIONS */}
      {/* ================================================== */}

      {/* Large circle - top left */}
      <div className="pointer-events-none absolute -left-[65px] -top-[65px] h-[180px] w-[180px] rounded-full border-[25px] border-[#dcecf8]" />

      <div className="pointer-events-none absolute -left-[25px] -top-[25px] h-[100px] w-[100px] rounded-full bg-white/80" />

      {/* Blue rounded shape - left */}
      <div className="pointer-events-none absolute left-[13%] top-[190px] h-[125px] w-[120px] rounded-[35px] bg-[#cde4fa]" />

      <div className="pointer-events-none absolute bottom-[30px] left-[13%] h-[100px] w-[120px] rounded-[35px] bg-[#d9ebf9]" />

      {/* Cyan rounded shape - right */}
      <div className="pointer-events-none absolute right-[12%] top-[195px] h-[125px] w-[120px] rounded-[35px] bg-[#c8f1f1]" />

      {/* Dotted pattern */}
      <div className="pointer-events-none absolute right-[4%] top-[55px] hidden opacity-50 lg:block">
        <div className="grid grid-cols-7 gap-[13px]">
          {Array.from({ length: 42 }).map((_, index) => (
            <span
              key={index}
              className="h-[4px] w-[4px] rounded-full bg-[#a9c5d5]"
            />
          ))}
        </div>
      </div>

      {/* ================================================== */}
      {/* CONTENT */}
      {/* ================================================== */}

      <div className="relative z-10 mx-auto max-w-[1050px]">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-[650px] text-center"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#315e9d]">
            Why Choose Hospa
          </p>

          <h2 className="mt-3 text-[34px] font-normal leading-[1.12] tracking-[-1.2px] text-[#071535] sm:text-[42px] lg:text-[45px]">
            We Are Different To <span className="font-bold">Protect</span>
            <br />
            <span className="font-bold">Your Health</span>
          </h2>
        </motion.div>

        {/* ================================================== */}
        {/* CARDS */}
        {/* ================================================== */}

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          {reasons.map((reason, index) => (
            <motion.article
              key={reason.title}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.55,
                delay: index * 0.1,
              }}
              whileHover={{ y: -5 }}
              className={`relative min-h-[340px] rounded-[18px] border-2 bg-white p-5 ${reason.borderColor} ${reason.shadowColor}`}
            >
              {/* Image / logo shape */}
              <div className="relative h-[76px] w-[76px] ">
                {/* Starburst background */}
                <div
                  className={`absolute inset-0 flex items-center justify-center ${
                    index === 0
                      ? "bg-[#82acd8]"
                      : index === 1
                        ? "bg-[#b99582]"
                        : "bg-[#64c2d5]"
                  }`}
                  style={{
                    clipPath:
                      "polygon(50% 0%, 62% 14%, 77% 8%, 82% 25%, 98% 31%, 88% 46%, 100% 60%, 84% 69%, 87% 87%, 68% 84%, 58% 100%, 45% 87%, 29% 96%, 25% 77%, 7% 75%, 14% 57%, 0% 44%, 16% 32%, 11% 14%, 31% 18%)",
                  }}
                >
                  <img
                    src={reason.image}
                    alt=""
                    className=" inset-[14px] h-full w-full object-cover"
                  />
                </div>
              </div>

              {/* Card title */}
              <h3 className="mt-5 max-w-[310px] text-[22px] font-bold leading-[1.25] tracking-[-0.5px] text-[#071535]">
                {reason.title}
              </h3>

              {/* Card description */}
              <p className="mt-4 text-[14px] leading-6 text-[#26313e]">
                {reason.description}
              </p>

              {/* Learn more */}
              <a
                href="#"
                className="group mt-5 inline-flex items-center gap-2 text-[14px] font-medium text-[#243a50]"
              >
                <span>Learn More</span>

                <ArrowRight
                  size={16}
                  strokeWidth={1.8}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </a>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;
