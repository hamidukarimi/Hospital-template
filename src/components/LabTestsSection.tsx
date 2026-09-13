import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  FlaskConical,
  ScanLine,
  Microscope,
  Activity,
  Stethoscope,
  Dna,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface LabTest {
  title: string;
  description: string;
  price: string;
  discount: string;
  icon: React.ElementType;
  iconBackground: string;
}

const labTests: LabTest[] = [
  {
    title: "MRI & CT Scan",
    description: "We do all kind of MRI & CT Scan for the patient",
    price: "$99.00",
    discount: "40% OFF",
    icon: ScanLine,
    iconBackground: "linear-gradient(135deg, #6424d8 0%, #3d52ed 100%)",
  },
  {
    title: "X-Rays",
    description: "We offer precise and fast X-Ray scans for the patient.",
    price: "$20.00",
    discount: "20% OFF",
    icon: Activity,
    iconBackground: "linear-gradient(135deg, #00b8e6 0%, #1974dd 100%)",
  },
  {
    title: "Blood Test",
    description: "Accurate blood testing performed by experienced specialists.",
    price: "$35.00",
    discount: "25% OFF",
    icon: FlaskConical,
    iconBackground: "linear-gradient(135deg, #7d35e8 0%, #4d6af0 100%)",
  },
  {
    title: "DNA Testing",
    description: "Advanced genetic testing with reliable laboratory results.",
    price: "$75.00",
    discount: "15% OFF",
    icon: Dna,
    iconBackground: "linear-gradient(135deg, #13b8c8 0%, #3977e8 100%)",
  },
  {
    title: "Health Screening",
    description: "Complete health screening packages for your peace of mind.",
    price: "$60.00",
    discount: "30% OFF",
    icon: Stethoscope,
    iconBackground: "linear-gradient(135deg, #7032d7 0%, #496ee9 100%)",
  },
  {
    title: "Microscopy",
    description: "Detailed laboratory microscopy for accurate diagnosis.",
    price: "$45.00",
    discount: "20% OFF",
    icon: Microscope,
    iconBackground: "linear-gradient(135deg, #00aeca 0%, #2878dc 100%)",
  },
];

const LabTestsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  /*
   * Two cards are visible on desktop.
   * Therefore the maximum starting position is:
   * total cards - visible cards
   */
  const visibleCards = 2;
  const maxIndex = Math.max(0, labTests.length - visibleCards);

  const nextSlide = () => {
    setCurrentIndex((current) => (current >= maxIndex ? 0 : current + 1));
  };

  const previousSlide = () => {
    setCurrentIndex((current) => (current <= 0 ? maxIndex : current - 1));
  };

  const progress = maxIndex === 0 ? 100 : (currentIndex / maxIndex) * 100;

  return (
    <section className="relative overflow-hidden bg-[#edf6fb] px-5 py-16 sm:px-8 lg:px-6 lg:py-20">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.05fr_1fr]">
          {/* ================================================== */}
          {/* LEFT SIDE */}
          {/* ================================================== */}

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.65 }}
            className="relative min-h-[520px] overflow-hidden rounded-[18px] bg-[#12374d]"
          >
            {/* Main image */}

            <img
              src="./lab-sec-bg.png"
              alt="Laboratory"
              className="absolute inset-0 h-full w-full object-cover"
            />

            {/* Dark/blue bottom gradient */}

            <div className="absolute inset-x-0 bottom-0 h-[48%] bg-gradient-to-t from-[#0c4260]/90 via-[#14506c]/50 to-transparent" />

            {/* Precision proficiency card */}

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: 0.2,
              }}
              className="absolute bottom-7 left-0 flex w-[calc(100%-10px)] max-w-[505px] items-center gap-4 rounded-r-full border border-white/60 bg-white/75 px-6 py-4 backdrop-blur-md"
            >
              {/* Award icon */}

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full">
                <div className="relative">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#18b8c8] to-[#2480d5]" />

                  <div className="absolute -bottom-2 left-1/2 h-5 w-5 -translate-x-1/2">
                    <span className="absolute left-0 h-4 w-1 rotate-[25deg] bg-[#159eb8]" />
                    <span className="absolute right-0 h-4 w-1 -rotate-[25deg] bg-[#159eb8]" />
                  </div>
                </div>
              </div>

              <div className="min-w-0">
                <h3 className="text-[14px] font-bold uppercase tracking-[-0.2px] text-[#071535]">
                  Precision Proficiency Award
                </h3>

                <p className="mt-1 max-w-[360px] text-[11px] leading-[1.45] text-[#26394a]">
                  Awarded to our Lab Test Center for consistently achieving
                  unparalleled precision in test results.
                </p>
              </div>

              {/* Circle */}

              <div className="ml-auto hidden h-10 w-10 shrink-0 rounded-full border border-white/70 bg-[#9bcaf4] sm:block" />
            </motion.div>
          </motion.div>

          {/* ================================================== */}
          {/* RIGHT SIDE */}
          {/* ================================================== */}

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.65 }}
            className="relative overflow-hidden rounded-[18px] border border-white/80 bg-[#e7f3fa] px-6 py-8 shadow-[0_10px_40px_rgba(100,150,180,0.08)] sm:px-10 lg:px-12"
          >
            {/* Subtle grid decoration */}

            <div className="pointer-events-none absolute right-0 top-0 h-[220px] w-[280px] opacity-30">
              <div
                className="h-full w-full"
                style={{
                  backgroundImage:
                    "linear-gradient(#9ec0d4 1px, transparent 1px), linear-gradient(90deg, #9ec0d4 1px, transparent 1px)",
                  backgroundSize: "25px 25px",
                  maskImage:
                    "linear-gradient(to bottom left, black, transparent)",
                }}
              />
            </div>

            {/* Decorative dots */}

            <div className="pointer-events-none absolute bottom-0 left-0 h-[170px] w-[170px] opacity-25">
              <div
                className="h-full w-full"
                style={{
                  backgroundImage:
                    "radial-gradient(#719bb4 1px, transparent 1px)",
                  backgroundSize: "10px 10px",
                }}
              />
            </div>

            <div className="relative z-10">
              {/* Badge */}

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{
                  opacity: 1,
                  scale: 1,
                }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="inline-flex rounded-full bg-gradient-to-r from-[#0878ef] to-[#154de1] px-4 py-2 shadow-[0_6px_18px_rgba(30,100,230,0.35)]"
              >
                <span className="text-[12px] font-bold tracking-wide text-white">
                  LAB TEST
                </span>
              </motion.div>

              {/* Heading */}

              <h2 className="mt-5 max-w-[600px] text-[36px] font-normal leading-[1.1] tracking-[-1.2px] text-[#071535] sm:text-[42px]">
                We Have Lab Test Facilities
                <br />
                <span className="font-bold">Book Yours Today</span>
              </h2>

              {/* Underline */}

              <div className="relative mt-2 h-[6px] w-[255px]">
                <svg
                  viewBox="0 0 255 8"
                  className="absolute inset-0 h-full w-full"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M2 5 C70 1, 170 7, 252 3"
                    fill="none"
                    stroke="#3159c5"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              {/* ================================================== */}
              {/* CAROUSEL */}
              {/* ================================================== */}

              <div className="mt-9 overflow-hidden">
                <motion.div
                  className="flex gap-5"
                  animate={{
                    x: `-${currentIndex * (50 + 2.2)}%`,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 30,
                  }}
                >
                  {labTests.map((test, index) => {
                    const Icon = test.icon;

                    return (
                      <div
                        key={test.title}
                        className="w-full shrink-0 sm:w-[calc(50%-10px)]"
                      >
                        <motion.div
                          whileHover={{
                            y: -5,
                          }}
                          className="relative flex min-h-[280px] flex-col rounded-[17px] border border-white/90 bg-white/45 p-4 shadow-[0_12px_30px_rgba(70,130,170,0.15)] backdrop-blur-sm"
                        >
                          {/* Discount */}

                          <div className="absolute right-3 top-3 rounded-full bg-gradient-to-r from-[#155ee8] to-[#147de2] px-4 py-0.5 shadow-[0_5px_15px_rgba(30,100,220,0.22)]">
                            <span className="text-[13px] font-bold text-white">
                              {test.discount}
                            </span>
                          </div>

                          {/* Icon */}

                          <div
                            className="flex h-[48px] w-[48px] items-center justify-center rounded-[12px] shadow-[0_8px_18px_rgba(55,70,180,0.25)]"
                            style={{
                              background: test.iconBackground,
                            }}
                          >
                            <Icon
                              size={29}
                              strokeWidth={1.7}
                              className="text-white"
                            />
                          </div>

                          {/* Title */}

                          <h3 className="mt-4 text-[21px] font-bold tracking-[-0.5px] text-[#071535]">
                            {test.title}
                          </h3>

                          {/* Description */}

                          <p className="mt-2 max-w-[240px] text-[13px] leading-5 text-[#172332]">
                            {test.description}
                          </p>

                          {/* Price */}

                          <p className=" pt-6 text-[13px] font-bold uppercase text-[#071535]">
                            Starting From{" "}
                            <span className="text-[15px]">{test.price}</span>
                          </p>

                          {/* Button */}

                          <motion.button
                            type="button"
                            whileHover={{
                              scale: 1.02,
                            }}
                            whileTap={{
                              scale: 0.98,
                            }}
                            className="cursor-pointer mt-5 flex h-[37px] w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#a84bdf] via-[#7454e8] to-[#2775df] text-[14px] font-semibold text-white shadow-[0_8px_18px_rgba(100,75,220,0.28)] transition-all duration-200 hover:shadow-[0_10px_24px_rgba(100,75,220,0.4)]"
                          >
                            <span>Schedule A Test</span>

                            <ArrowRight size={17} strokeWidth={2} />
                          </motion.button>
                        </motion.div>
                      </div>
                    );
                  })}
                </motion.div>
              </div>

              {/* ================================================== */}
              {/* PROGRESS + NAVIGATION */}
              {/* ================================================== */}

              <div className="mt-9 flex items-center gap-4">
                {/* Progress bar */}

                <div className="relative h-[4px] flex-1 overflow-visible rounded-full bg-[#9bb5c6]">
                  <motion.div
                    className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-[#4355d8] to-[#6e7bea]"
                    animate={{
                      width: `${Math.max(8, progress)}%`,
                    }}
                    transition={{
                      duration: 0.35,
                    }}
                  />

                  {/* Progress circle */}

                  <motion.div
                    className="absolute top-1/2 h-[15px] w-[15px] -translate-y-1/2 rounded-full border-2 border-white bg-white shadow-[0_2px_8px_rgba(50,90,180,0.3)]"
                    animate={{
                      left: `${Math.min(98, Math.max(2, progress))}%`,
                    }}
                    transition={{
                      duration: 0.35,
                    }}
                  />
                </div>

                {/* Arrows */}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={previousSlide}
                    aria-label="Previous lab test"
                    className="flex h-9 w-9 items-center justify-center rounded-[9px] border border-[#b6c8d5] bg-white/70 text-[#071535] shadow-[0_3px_8px_rgba(50,80,100,0.08)] transition-all duration-200 hover:bg-white hover:text-[#4260d7]"
                  >
                    <ArrowLeft size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={nextSlide}
                    aria-label="Next lab test"
                    className="flex h-9 w-9 items-center justify-center rounded-[9px] border border-[#b6c8d5] bg-white/70 text-[#071535] shadow-[0_3px_8px_rgba(50,80,100,0.08)] transition-all duration-200 hover:bg-white hover:text-[#4260d7]"
                  >
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LabTestsSection;
