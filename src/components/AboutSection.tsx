import { ArrowRight, Phone } from "lucide-react";
import { motion } from "framer-motion";

const AboutSection = () => {
  return (
    <section className="bg-white px-6 py-16 sm:px-10 lg:px-16 lg:py-20">
      <div className="mx-auto grid max-w-[1100px] items-center gap-10 lg:grid-cols-[42%_58%] lg:gap-12">
        {/* ================================================== */}
        {/* LEFT IMAGE */}
        {/* ================================================== */}

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex justify-center lg:justify-start"
        >
          <img
            src="./About.png"
            alt="Our healthcare team"
            className="h-auto w-full max-w-[360px] object-contain"
          />
        </motion.div>

        {/* ================================================== */}
        {/* RIGHT CONTENT */}
        {/* ================================================== */}

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
        >
          {/* Small title */}
          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-violet-600">
            ABOUT HOSPA
          </p>

          {/* Main title */}
          <h2 className="mt-2 max-w-[520px] text-[31px] font-normal leading-[1.15] tracking-[-0.8px] text-[#071535] sm:text-[35px]">
            Your trusted partner in{" "}
            <span className="font-bold">Dental Wellness</span>
          </h2>

          {/* Description */}
          <div className="mt-4 max-w-[540px] space-y-1.5 text-[9px] leading-[1.6] text-slate-500 sm:text-[10px]">
            <p>
              We are committed to transforming oral health and creating
              beautiful, confident smiles. Located in the heart of Los Angeles,
              our clinic has been a trusted provider of high-quality dental care
              for over 20 years.
            </p>

            <p>
              We are committed to transforming oral health and creating
              beautiful, confident smiles. Located in the heart of Los Angeles,
              our clinic has been a trusted provider of high-quality dental care
              for over 20 years.
            </p>
          </div>

          {/* ================================================== */}
          {/* ACTION / DOCTOR CARD */}
          {/* ================================================== */}

          <div className="mt-5 flex flex-wrap items-center gap-3">
            {/* About button */}
            <motion.a
              href="#"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 rounded-full bg-violet-500 px-6 py-2.5 text-[9px] font-medium text-white transition-colors hover:bg-violet-600"
            >
              More About Us
              <ArrowRight size={12} strokeWidth={2} />
            </motion.a>

            {/* Doctor mini profile */}
            <div className="flex items-center gap-2">
              <img
                src="./About.png"
                alt="Willie Fuentes"
                className="h-8 w-8 rounded-full object-cover"
              />

              <div>
                <p className="text-[9px] font-semibold leading-tight text-[#071535]">
                  Willie Fuentes
                </p>

                <p className="mt-0.5 text-[7px] text-slate-400">Co Founder</p>
              </div>
            </div>

            {/* Small logo placeholder */}
            <div className="ml-1 hidden h-6 w-16 items-center justify-center text-[6px] font-medium text-slate-400 sm:flex">
              HOSPA LOGO
            </div>
          </div>

          {/* ================================================== */}
          {/* TRUSTPILOT + EMERGENCY */}
          {/* ================================================== */}

          <div className="mt-5 flex flex-wrap items-center gap-5">
            {/* Trustpilot */}
            <div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-semibold text-[#00b67a]">
                  ★
                </span>

                <span className="text-[9px] font-semibold text-[#071535]">
                  Trustpilot
                </span>
              </div>

              <div className="mt-1 flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className="flex h-[15px] w-[15px] items-center justify-center bg-[#00b67a] text-[9px] text-white"
                  >
                    ★
                  </span>
                ))}
              </div>

              <p className="mt-1 text-[6px] text-slate-400">
                TrustScore 4.9 | 29 Reviews
              </p>
            </div>

            {/* Emergency card */}
            <div className="flex min-h-[52px] min-w-[160px] items-center justify-center rounded-full bg-[#eeedff] px-5 py-2.5">
              <div className="text-center">
                <p className="text-[7px] text-[#071535]">
                  Need an Emergency Help? Call Us!
                </p>

                <a
                  href="tel:+01132534567"
                  className="mt-1 flex items-center justify-center gap-1 text-[9px] font-semibold text-violet-600"
                >
                  <Phone size={9} />
                  +011 3253 4567
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
