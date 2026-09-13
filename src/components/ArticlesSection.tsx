import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
} from "lucide-react";

interface Article {
  id: number;
  category: string;
  image: string;
  date: string;
  readTime: string;
  title: string;
}

const articles: Article[] = [
  {
    id: 1,
    category: "Maternity",
    image:
      "./arti-img-1.png",
    date: "January 29, 2025",
    readTime: "4 MINS READ",
    title:
      "How to prepare for your baby’s arrival: a checklist for expectant parents",
  },
  {
    id: 2,
    category: "Maternity",
    image:
      "./arti-img-2.png",
    date: "January 29, 2025",
    readTime: "4 MINS READ",
    title:
      "Caring for yourself postpartum: what every new mom should know",
  },
  {
    id: 3,
    category: "Psychiatric",
    image:
      "./arti-img-3.png",
    date: "January 28, 2025",
    readTime: "4 MINS READ",
    title:
      "The importance of self-care in managing stress",
  },
];

const ArticlesSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#edf5ff] via-[#f4f6fc] to-[#e9f9fc] px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
      {/* =====================================================
          DECORATIVE BACKGROUND
      ====================================================== */}

      {/* Top-left soft wave */}

      <div className="pointer-events-none absolute -left-28 -top-20 h-64 w-[430px] rotate-[-10deg] rounded-[50%] border-[28px] border-white/50 blur-[1px]" />

      <div className="pointer-events-none absolute -left-36 top-14 h-48 w-[390px] rotate-[8deg] rounded-[50%] border-[18px] border-[#dceaf7]/70" />

      {/* Top-right dots */}

      <div className="pointer-events-none absolute right-12 top-12 hidden h-28 w-36 opacity-45 sm:block">
        <div className="grid grid-cols-7 gap-3">
          {Array.from({ length: 49 }).map((_, index) => (
            <span
              key={index}
              className="h-1 w-1 rounded-full bg-[#8baec8]"
            />
          ))}
        </div>
      </div>

      {/* Bottom-left dots */}

      <div className="pointer-events-none absolute bottom-24 left-12 hidden h-24 w-28 opacity-35 sm:block">
        <div className="grid grid-cols-6 gap-3">
          {Array.from({ length: 36 }).map((_, index) => (
            <span
              key={index}
              className="h-1 w-1 rounded-full bg-[#8baec8]"
            />
          ))}
        </div>
      </div>

      {/* Bottom-right decorative curves */}

      <div className="pointer-events-none absolute -bottom-32 -right-24 h-72 w-96 rotate-[-15deg] rounded-[50%] border-[22px] border-white/50" />

      <div className="pointer-events-none absolute -bottom-20 -right-16 h-52 w-80 rotate-[-15deg] rounded-[50%] border-[14px] border-[#d8e7f5]/70" />

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div className="relative z-10 mx-auto max-w-[1080px]">
        {/* =====================================================
            HEADER
        ====================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 25,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.25,
          }}
          transition={{
            duration: 0.65,
          }}
          className="text-center"
        >
          {/* Small title */}

          <p className="text-[12px] font-bold uppercase tracking-[0.8px] text-[#237bb8]">
            Blog & Articles
          </p>

          {/* Main title */}

          <h2 className="relative mx-auto mt-3 max-w-[650px] text-[35px] font-normal leading-[1.1] tracking-[-1.4px] text-[#071535] sm:text-[42px] lg:text-[44px]">
            Read Top Articles From
            <br />

            <span className="relative inline-block font-bold text-[#185b9c]">
              Expert Doctors
              
              {/* Decorative underline */}

              <svg
                viewBox="0 0 180 25"
                className="absolute -bottom-5 left-1/2 h-[25px] w-[180px] -translate-x-1/2"
                fill="none"
              >
                <path
                  d="M5 18C43 10 91 15 174 4"
                  stroke="#7d9bc2"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                <path
                  d="M143 6C154 4 165 5 174 4"
                  stroke="#7d9bc2"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h2>
        </motion.div>

        {/* =====================================================
            ARTICLES
        ====================================================== */}

        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, index) => (
            <motion.article
              key={article.id}
              initial={{
                opacity: 0,
                y: 35,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.15,
              }}
              transition={{
                duration: 0.55,
                delay: index * 0.1,
              }}
              whileHover={{
                y: -6,
              }}
              className="group"
            >
              {/* Image */}

              <div className="relative overflow-hidden rounded-[17px] shadow-[0_12px_25px_rgba(45,70,100,0.14)]">
                <img
                  src={article.image}
                  alt={article.title}
                  className="h-[225px] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />

                {/* Bottom-left category */}

                <div className="absolute bottom-3 left-3 rounded-full bg-[#e5effb] px-4 py-2 text-[12px] font-medium text-[#172b48] shadow-sm">
                  {article.category}
                </div>
              </div>

              {/* Meta information */}

              <div className="mt-4 flex items-center gap-4 text-[11px] text-[#4e5c6d]">
                <div className="flex items-center gap-1.5">
                  <CalendarDays
                    size={14}
                    strokeWidth={1.7}
                  />

                  <span>{article.date}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Clock3
                    size={14}
                    strokeWidth={1.7}
                  />

                  <span>{article.readTime}</span>
                </div>
              </div>

              {/* Title */}

              <h3 className="mt-3 min-h-[58px] text-[19px] font-bold leading-[1.3] tracking-[-0.45px] text-[#071535]">
                {article.title}
              </h3>

              {/* Read more */}

              <motion.a
                href="#"
                whileHover={{
                  x: 4,
                }}
                className="mt-4 inline-flex items-center gap-2 text-[14px] font-medium text-[#17619f]"
              >
                Read More

                <ArrowRight
                  size={17}
                  strokeWidth={1.8}
                />
              </motion.a>
            </motion.article>
          ))}
        </div>

        {/* =====================================================
            BOTTOM CTA
        ====================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 25,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.25,
          }}
          transition={{
            duration: 0.6,
            delay: 0.15,
          }}
          className="relative mt-10 overflow-hidden rounded-full border border-white/80 bg-gradient-to-r from-[#fffdf8] via-[#f4f7fc] to-[#eaf5ff] px-6 py-4 shadow-[0_10px_25px_rgba(50,80,110,0.14)] sm:px-8"
        >
          {/* Left glow */}

          <div className="pointer-events-none absolute -left-8 top-1/2 h-24 w-24 -translate-y-1/2 rounded-full bg-[#f8dfca]/70 blur-2xl" />

          {/* Content */}

          <div className="relative flex flex-col items-center justify-center gap-2 text-center sm:flex-row">
            <p className="text-[13px] text-[#263447] sm:text-[14px]">
              We have 21 more Articles.
            </p>

            <motion.a
              href="#"
              whileHover={{
                x: 3,
              }}
              className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#185b9c] underline decoration-[#185b9c]/50 underline-offset-4 sm:text-[14px]"
            >
              View All

              <ArrowRight
                size={16}
                strokeWidth={1.8}
              />
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ArticlesSection;