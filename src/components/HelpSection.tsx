import {
  ArrowRight,
  Building2,
  CalendarDays,
  ClipboardList,
  Heart,
  MessageCircleHeart,
  MapPin,
  Stethoscope,
} from "lucide-react";
import { motion } from "framer-motion";

interface HelpCard {
  title: string;
  description: string;
  buttonText: string;
  icon: React.ReactNode;
  background: string;
  border: string;
  shadow: string;
  buttonHover: string;
}

const helpCards: HelpCard[] = [
  {
    title: "Visitor Information",
    description:
      "Plan your visit, find visiting hours, parking details, and hospital guidelines.",
    buttonText: "Learn More",
    icon: <ClipboardList size={82} strokeWidth={1.5} />,
    background: "bg-[#dceeff]",
    border: "border-[#a9d6f7]",
    shadow: "shadow-[0_18px_25px_rgba(75,163,221,0.28)]",
    buttonHover: "hover:bg-[#edf7ff]",
  },
  {
    title: "Find a Doctor",
    description:
      "Search our network of experienced specialists and book an appointment online.",
    buttonText: "Search Now",
    icon: <Stethoscope size={82} strokeWidth={1.5} />,
    background: "bg-[#dff8ee]",
    border: "border-[#8dd9bb]",
    shadow: "shadow-[0_18px_25px_rgba(76,194,151,0.28)]",
    buttonHover: "hover:bg-[#effcf7]",
  },
  {
    title: "Our Locations",
    description:
      "Find medical centers, clinics, and urgent care facilities nearest to you.",
    buttonText: "Learn More",
    icon: <Building2 size={78} strokeWidth={1.5} />,
    background: "bg-[#eee7fb]",
    border: "border-[#b798df]",
    shadow: "shadow-[0_18px_25px_rgba(142,91,194,0.3)]",
    buttonHover: "hover:bg-[#f8f5ff]",
  },
  {
    title: "Connect With Us",
    description:
      "Get in touch with our support team, ask questions, or provide feedback.",
    buttonText: "Learn More",
    icon: <MessageCircleHeart size={82} strokeWidth={1.5} />,
    background: "bg-[#ffebe4]",
    border: "border-[#e4a18e]",
    shadow: "shadow-[0_18px_25px_rgba(224,119,94,0.3)]",
    buttonHover: "hover:bg-[#fff5f1]",
  },
];

const HelpSection = () => {
  return (
    <section className="relative overflow-hidden bg-[#f8f6ef] px-4 py-12 sm:px-6 sm:py-16 lg:px-10">
      {/* Decorative background elements */}
      <div className="pointer-events-none absolute -left-16 top-20 opacity-[0.08]">
        <Heart
          size={180}
          strokeWidth={1.5}
          className="text-[#8d7d70]"
        />
      </div>

      <div className="pointer-events-none absolute -right-16 top-8 opacity-[0.08]">
        <Building2
          size={190}
          strokeWidth={1.5}
          className="text-[#8d7d70]"
        />
      </div>

      <div className="pointer-events-none absolute bottom-[-40px] left-[5%] opacity-[0.07]">
        <MapPin
          size={180}
          strokeWidth={1.5}
          className="text-[#8d7d70]"
        />
      </div>

      {/* Main container */}
      <div className="relative mx-auto max-w-[1260px] rounded-[48px] border border-white/90 bg-white/75 px-5 py-12 shadow-[0_18px_45px_rgba(50,45,40,0.10)] backdrop-blur-sm sm:px-8 sm:py-14 lg:px-14 lg:py-16">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center text-[36px] font-bold leading-tight tracking-[-1.2px] text-[#071535] sm:text-[42px] lg:text-[48px]"
        >
          How can we help you today?
        </motion.h2>

        {/* Cards */}
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {helpCards.map((card, index) => (
            <motion.article
              key={card.title}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.55,
                delay: index * 0.08,
              }}
              whileHover={{ y: -6 }}
              className={`relative flex min-h-[420px] flex-col overflow-hidden rounded-[30px] border-2 ${card.border} ${card.background} ${card.shadow}`}
            >
              {/* Icon area */}
              <div className="flex h-[130px]  items-center justify-center pt-4">
                <motion.div
                  whileHover={{ scale: 1.06 }}
                  transition={{ duration: 0.2 }}
                  className="text-[#102042] "
                >
                  {card.icon}
                </motion.div>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col px-6 pb-5 text-center ">
                <h3 className="text-[25px] font-bold leading-tight tracking-[-0.5px] text-[#071535]">
                  {card.title}
                </h3>

                <p className="mt-3 text-[16px] leading-6 text-[#111827]">
                  {card.description}
                </p>

                {/* Button */}
                <div className="mt-auto pt-5 ">
                  <a
                    href="#"
                    className={`group flex h-[52px]  w-full items-center justify-center gap-2 rounded-full border-2 ${card.border} bg-white/55 text-[16px] font-medium text-[#071535] transition-all duration-200 ${card.buttonHover}`}
                  >
                    <span>{card.buttonText}</span>

                    <ArrowRight
                      size={20}
                      strokeWidth={1.8}
                      className="transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </a>
                </div>
              </div>

              {/* Bottom colored edge */}
              <div
                className={`absolute bottom-0 left-0 h-[9px] w-full ${card.border.replace(
                  "border-",
                  "bg-",
                )}`}
              />
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HelpSection;