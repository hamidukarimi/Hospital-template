import {
  Activity,
  Ambulance,
  ArrowRight,
  Building2,
  CalendarCheck,
  ClipboardList,
  Clock,
  Heart,
  HeartPulse,
  MapPin,
  MessageCircleHeart,
  Phone,
  ShieldCheck,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { isInternalPath, mixWithWhite, normalizeHex, rgba } from "../lib/color";
import type { HelpSection as HelpSectionData } from "../types/api";

interface HelpSectionProps {
  helpSection?: HelpSectionData | null;
  isLoading?: boolean;
}

const iconMap: Record<string, LucideIcon> = {
  CalendarCheck,
  ClipboardList,
  Stethoscope,
  Phone,
  Building2,
  MessageCircleHeart,
  Activity,
  Clock,
  Ambulance,
  HeartPulse,
  ShieldCheck,
  Heart,
  // Admin kebab-case keys
  stethoscope: Stethoscope,
  "shield-check": ShieldCheck,
  "heart-pulse": HeartPulse,
  activity: Activity,
  clock: Clock,
  ambulance: Ambulance,
  phone: Phone,
  calendarcheck: CalendarCheck,
  clipboardlist: ClipboardList,
  building2: Building2,
  messagecircleheart: MessageCircleHeart,
};

const resolveIcon = (iconName?: string | null): LucideIcon => {
  if (!iconName) return ClipboardList;
  return (
    iconMap[iconName] ||
    iconMap[iconName.toLowerCase()] ||
    iconMap[iconName.replace(/[-_\s]/g, "").toLowerCase()] ||
    ClipboardList
  );
};

const getCardStyle = (color?: string | null) => {
  const base = normalizeHex(color, "#4ba3dd");
  return {
    background: mixWithWhite(base, 0.82),
    border: mixWithWhite(base, 0.42),
    shadow: `0 18px 25px ${rgba(base, 0.28)}`,
    edge: mixWithWhite(base, 0.42),
    buttonHover: mixWithWhite(base, 0.92),
  };
};

const HelpSection = ({ helpSection, isLoading = false }: HelpSectionProps) => {
  const cards = helpSection?.cards ?? [];

  if (isLoading) {
    return (
      <section className="relative overflow-hidden bg-[#f8f6ef] px-4 py-12 sm:px-6 sm:py-16 lg:px-10">
        <div className="relative mx-auto max-w-[1260px] rounded-[48px] border border-white/90 bg-white/75 px-5 py-12 sm:px-8 sm:py-14 lg:px-14 lg:py-16">
          <div className="mx-auto h-12 w-2/5 animate-pulse rounded bg-slate-200" />
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-[420px] animate-pulse rounded-[30px] bg-slate-200"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden bg-[#f8f6ef] px-4 py-12 sm:px-6 sm:py-16 lg:px-10">
      <div className="pointer-events-none absolute -left-16 top-20 opacity-[0.08]">
        <Heart size={180} strokeWidth={1.5} className="text-[#8d7d70]" />
      </div>

      <div className="pointer-events-none absolute -right-16 top-8 opacity-[0.08]">
        <Building2 size={190} strokeWidth={1.5} className="text-[#8d7d70]" />
      </div>

      <div className="pointer-events-none absolute bottom-[-40px] left-[5%] opacity-[0.07]">
        <MapPin size={180} strokeWidth={1.5} className="text-[#8d7d70]" />
      </div>

      <div className="relative mx-auto max-w-[1260px] rounded-[48px] border border-white/90 bg-white/75 px-5 py-12 shadow-[0_18px_45px_rgba(50,45,40,0.10)] backdrop-blur-sm sm:px-8 sm:py-14 lg:px-14 lg:py-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center text-[36px] font-bold leading-tight tracking-[-1.2px] text-[#071535] sm:text-[42px] lg:text-[48px]"
        >
          {helpSection?.title || "How can we help you today?"}
        </motion.h2>

        <div className="mt-10 flex gap-5 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden overflow-y-hidden">
          {cards.length === 0 ? (
            <div className="w-full rounded-[30px] border border-dashed border-slate-300 bg-white/60 p-10 text-center text-slate-500">
              Help information is currently unavailable.
            </div>
          ) : (
            cards.map((card, index) => {
              const Icon = resolveIcon(card.icon);
              const styles = getCardStyle(card.color);
              const buttonUrl = card.buttonUrl || "#";
              const buttonClassName = `group flex h-[52px] w-full items-center justify-center gap-2 rounded-full border-2 bg-white/55 text-[16px] font-medium text-[#071535] transition-all duration-200`;

              return (
                <motion.article
                  key={card.id}
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.55, delay: index * 0.08 }}
                  whileHover={{ y: -6 }}
                  className="relative flex min-h-[420px] w-[min(100%,280px)] shrink-0 flex-col overflow-hidden rounded-[30px] border-2 sm:w-[calc(50%-10px)] lg:w-[calc(25%-15px)]"
                  style={{
                    backgroundColor: styles.background,
                    borderColor: styles.border,
                    boxShadow: styles.shadow,
                  }}
                >
                  <div className="flex h-[130px] items-center justify-center pt-4">
                    <motion.div
                      whileHover={{ scale: 1.06 }}
                      transition={{ duration: 0.2 }}
                      className="text-[#102042]"
                    >
                      <Icon size={82} strokeWidth={1.5} />
                    </motion.div>
                  </div>

                  <div className="flex flex-1 flex-col px-6 pb-5 text-center">
                    <h3 className="text-[25px] font-bold leading-tight tracking-[-0.5px] text-[#071535]">
                      {card.title}
                    </h3>

                    <p className="mt-3 text-[16px] leading-6 text-[#111827]">
                      {card.description}
                    </p>

                    <div className="mt-auto pt-5">
                      {isInternalPath(buttonUrl) ? (
                        <Link
                          to={buttonUrl}
                          className={buttonClassName}
                          style={{ borderColor: styles.border }}
                          onMouseEnter={(event) => {
                            event.currentTarget.style.backgroundColor =
                              styles.buttonHover;
                          }}
                          onMouseLeave={(event) => {
                            event.currentTarget.style.backgroundColor = "";
                          }}
                        >
                          <span>{card.buttonText}</span>
                          <ArrowRight
                            size={20}
                            strokeWidth={1.8}
                            className="transition-transform duration-200 group-hover:translate-x-1"
                          />
                        </Link>
                      ) : (
                        <a
                          href={buttonUrl}
                          className={buttonClassName}
                          style={{ borderColor: styles.border }}
                          onMouseEnter={(event) => {
                            event.currentTarget.style.backgroundColor =
                              styles.buttonHover;
                          }}
                          onMouseLeave={(event) => {
                            event.currentTarget.style.backgroundColor = "";
                          }}
                        >
                          <span>{card.buttonText}</span>
                          <ArrowRight
                            size={20}
                            strokeWidth={1.8}
                            className="transition-transform duration-200 group-hover:translate-x-1"
                          />
                        </a>
                      )}
                    </div>
                  </div>

                  <div
                    className="absolute bottom-0 left-0 h-[9px] w-full"
                    style={{ backgroundColor: styles.edge }}
                  />
                </motion.article>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

export default HelpSection;
