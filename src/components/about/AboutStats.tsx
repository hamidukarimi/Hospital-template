import { motion } from "framer-motion";
import {
  Calendar,
  HeartHandshake,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { About, AboutStatItem } from "../../types/api";

interface AboutStatsProps {
  about?: About | null;
}

const iconMap: Record<string, LucideIcon> = {
  Calendar,
  Users,
  HeartHandshake,
};

const defaultStats: AboutStatItem[] = [
  {
    icon: "Calendar",
    value: "25+",
    title: "Years Experience",
    description: "A legacy of trust, care and innovation",
  },
  {
    icon: "Users",
    value: "150+",
    title: "Specialists",
    description: "World-class doctors across multiple fields",
  },
  {
    icon: "HeartHandshake",
    value: "50k+",
    title: "Patients Treated",
    description: "Real people. Real stories. Healthier tomorrows.",
  },
];

export default function AboutStats({ about }: AboutStatsProps) {
  const stats =
    Array.isArray(about?.stats) && about.stats.length > 0
      ? about.stats
      : defaultStats;
  const eyebrow = about?.statsEyebrow || "OUR IMPACT";
  const title =
    about?.statsTitle || "Trusted by Thousands, Driven by Excellence";
  const description =
    about?.statsDescription ||
    "For over two decades, we've been committed to providing high-quality healthcare and making a difference in people's lives.";

  return (
    <section id="impact" className="py-12 bg-slate-50/50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-900 p-8 sm:p-12 shadow-2xl text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 h-64 w-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid gap-10 lg:grid-cols-12 items-center">
            <div className="lg:col-span-4 space-y-3">
              <p className="text-xs font-bold text-teal-400 uppercase tracking-widest">
                {eyebrow}
              </p>
              <h2 className="text-3xl font-extrabold text-white leading-tight">
                {title}
              </h2>
              <p className="text-sm text-slate-400">{description}</p>
            </div>

            <div className="lg:col-span-8 grid gap-8 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-800">
              {stats.map((stat, idx) => {
                const Icon = iconMap[stat.icon || ""] || Users;
                return (
                  <motion.div
                    key={`${stat.title}-${idx}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="pt-6 sm:pt-0 sm:pl-8 first:pl-0 space-y-2"
                  >
                    <div className="rounded-xl bg-slate-800/80 p-2.5 w-fit text-teal-400 border border-slate-700/50">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="text-3xl font-black text-white">
                      {stat.value}
                    </div>
                    <div className="text-sm font-semibold text-slate-200">
                      {stat.title}
                    </div>
                    <p className="text-xs text-slate-400">{stat.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
