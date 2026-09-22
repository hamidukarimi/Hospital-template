import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { getImageUrl } from "../lib/api";
import {
  isInternalPath,
  mixWithWhite,
  normalizeHex,
  rgba,
} from "../lib/color";
import type { WhyChooseUsItem } from "../types/api";

interface WhyChooseSectionProps {
  items?: WhyChooseUsItem[];
  isLoading?: boolean;
}

const INITIAL_VISIBLE = 6;

const WhyChooseSection = ({
  items = [],
  isLoading = false,
}: WhyChooseSectionProps) => {
  const [expanded, setExpanded] = useState(false);
  const cards = items.length > 0 ? items : [];
  const visibleCards =
    expanded || cards.length <= INITIAL_VISIBLE
      ? cards
      : cards.slice(0, INITIAL_VISIBLE);
  const canToggle = cards.length > INITIAL_VISIBLE;

  if (isLoading) {
    return (
      <section className="relative overflow-hidden bg-[#f3f8fc] px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
        <div className="relative z-10 mx-auto max-w-[1050px]">
          <div className="mx-auto h-16 w-64 animate-pulse rounded bg-slate-200" />

          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-[340px] animate-pulse rounded-[18px] bg-slate-200"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden bg-[#f3f8fc] px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
      <div className="pointer-events-none absolute -left-[65px] -top-[65px] h-[180px] w-[180px] rounded-full border-[25px] border-[#dcecf8]" />

      <div className="pointer-events-none absolute -left-[25px] -top-[25px] h-[100px] w-[100px] rounded-full bg-white/80" />

      <div className="pointer-events-none absolute left-[13%] top-[190px] h-[125px] w-[120px] rounded-[35px] bg-[#cde4fa]" />

      <div className="pointer-events-none absolute bottom-[30px] left-[13%] h-[100px] w-[120px] rounded-[35px] bg-[#d9ebf9]" />

      <div className="pointer-events-none absolute right-[12%] top-[195px] h-[125px] w-[120px] rounded-[35px] bg-[#c8f1f1]" />

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

      <div className="relative z-10 mx-auto max-w-[1050px]">
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

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          {cards.length === 0 ? (
            <div className="col-span-full rounded-[18px] border border-dashed border-slate-300 bg-white/70 p-8 text-center text-slate-500">
              Why choose us information is currently unavailable.
            </div>
          ) : (
            visibleCards.map((reason, index) => {
              const base = normalizeHex(reason.color, "#64c2d5");
              const border = mixWithWhite(base, 0.35);
              const shadow = `0 18px 28px ${rgba(base, 0.22)}`;
              const imageBadge = mixWithWhite(base, 0.15);
              const imageSrc = getImageUrl(reason.image);
              const linkUrl = reason.linkUrl || "#";

              return (
                <motion.article
                  key={reason.id}
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.55,
                    delay: index * 0.1,
                  }}
                  whileHover={{ y: -5 }}
                  className="relative min-h-[340px] rounded-[18px] border-2 bg-white p-5"
                  style={{ borderColor: border, boxShadow: shadow }}
                >
                  <div className="relative h-[76px] w-[76px] overflow-hidden">
                    <div
                      className="absolute inset-0 flex items-center justify-center overflow-hidden"
                      style={{
                        backgroundColor: imageBadge,
                        clipPath:
                          "polygon(50% 0%, 62% 14%, 77% 8%, 82% 25%, 98% 31%, 88% 46%, 100% 60%, 84% 69%, 87% 87%, 68% 84%, 58% 100%, 45% 87%, 29% 96%, 25% 77%, 7% 75%, 14% 57%, 0% 44%, 16% 32%, 11% 14%, 31% 18%)",
                      }}
                    >
                      {imageSrc ? (
                        <img
                          src={imageSrc}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-[11px] font-semibold text-white">
                          Image
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="mt-5 max-w-[310px] text-[22px] font-bold leading-[1.25] tracking-[-0.5px] text-[#071535]">
                    {reason.title}
                  </h3>

                  <p className="mt-4 text-[14px] leading-6 text-[#26313e]">
                    {reason.description}
                  </p>

                  {isInternalPath(linkUrl) ? (
                    <Link
                      to={linkUrl}
                      className="group mt-5 inline-flex items-center gap-2 text-[14px] font-medium text-[#243a50]"
                    >
                      <span>{reason.linkText || "Learn More"}</span>
                      <ArrowRight
                        size={16}
                        strokeWidth={1.8}
                        className="transition-transform duration-200 group-hover:translate-x-1"
                      />
                    </Link>
                  ) : (
                    <a
                      href={linkUrl}
                      className="group mt-5 inline-flex items-center gap-2 text-[14px] font-medium text-[#243a50]"
                    >
                      <span>{reason.linkText || "Learn More"}</span>
                      <ArrowRight
                        size={16}
                        strokeWidth={1.8}
                        className="transition-transform duration-200 group-hover:translate-x-1"
                      />
                    </a>
                  )}
                </motion.article>
              );
            })
          )}
        </div>

        {canToggle && (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => setExpanded((current) => !current)}
              className="inline-flex items-center gap-2 rounded-full border border-[#b7c9d8] bg-white px-6 py-2.5 text-[13px] font-medium text-[#071535] transition-colors hover:border-[#315e9d] hover:text-[#315e9d]"
            >
              {expanded ? "See less" : "See more"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default WhyChooseSection;
