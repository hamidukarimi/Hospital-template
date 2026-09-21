import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { getImageUrl } from "../../lib/api";
import type { About } from "../../types/api";

interface AboutHeroProps {
  about?: About | null;
}

export default function AboutHero({ about }: AboutHeroProps) {
  const badge = about?.heroBadge || "Pioneering Modern Healthcare";
  const title = about?.heroTitle || "Combining Advanced Technology with";
  const highlight =
    about?.heroTitleHighlight || "Compassionate Human Care";
  const subtitle =
    about?.heroSubtitle ||
    "At AuraTech Healthcare, we believe the future of medicine lies in the perfect balance between cutting-edge technology and the human touch. We're here to provide world-class healthcare with empathy, dignity, and innovation.";
  const buttonText = about?.heroButtonText || "Our Story";
  const imageSrc =
    getImageUrl(about?.heroImage) ||
    "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1000";
  const imageCaption =
    about?.heroImageCaption || "Better Health, Brighter Futures";

  return (
    <section className="relative overflow-hidden bg-slate-900 py-16 lg:py-24 text-white">
      <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
      <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-teal-500/15 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-teal-300 border border-teal-500/20 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{badge}</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-[42px] text-white leading-[1.15]">
              {title}{" "}
              <span className="bg-gradient-to-r from-teal-300 to-blue-400 bg-clip-text text-transparent">
                {highlight}
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              {subtitle}
            </p>

            <div className="pt-2">
              <a
                href="#mission"
                className="inline-flex items-center gap-2.5 rounded-full bg-teal-500 px-6 py-3.5 text-sm font-semibold text-slate-950 transition-all hover:bg-teal-400 hover:shadow-lg hover:shadow-teal-500/25 active:scale-95"
              >
                <span>{buttonText}</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 relative flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-lg lg:max-w-none overflow-hidden rounded-3xl border border-slate-700/50 shadow-2xl shadow-blue-950/50 group h-[420px] sm:h-[480px] lg:h-[520px]">
              <img
                src={imageSrc}
                alt={imageCaption}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-white">
                <span className="text-sm sm:text-base font-semibold tracking-wide">
                  {imageCaption}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
