import { AnimatePresence, motion } from "framer-motion";
import {
  Ambulance,
  ArrowRight,
  CalendarCheck,
  ChevronDown,
  CircleHelp,
  MessageCircleQuestion,
  Phone,
  Stethoscope,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { getFaqs, getFooter, getSiteSettings } from "../lib/api";
import type { Faq, FooterSettings, SiteSettings } from "../types/api";

export default function FaqPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [footer, setFooter] = useState<FooterSettings | null>(null);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  useEffect(() => {
    let active = true;
    setLoading(true);

    Promise.all([getSiteSettings(), getFooter(), getFaqs()])
      .then(([settingsData, footerData, faqsData]) => {
        if (!active) return;
        setSettings(settingsData);
        setFooter(footerData);
        setFaqs(faqsData ?? []);
      })
      .catch((err) => {
        console.error("Failed to load FAQ page:", err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const categories = useMemo(() => {
    const values = Array.from(
      new Set(
        faqs
          .map((faq) => faq.category?.trim())
          .filter((value): value is string => Boolean(value)),
      ),
    );
    return ["All", ...values];
  }, [faqs]);

  const filteredFaqs = useMemo(() => {
    if (activeCategory === "All") return faqs;
    return faqs.filter((faq) => faq.category === activeCategory);
  }, [activeCategory, faqs]);

  const hospitalName = settings?.hospitalName || "Aura Hospital";
  const phone = settings?.phone || "+1 (800) 123-4567";
  const emergencyPhone = settings?.emergencyPhone || phone;

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Navbar siteSettings={settings} isLoading={loading} />
      <main>
        {loading ? (
          <FaqPageSkeleton />
        ) : (
          <>
            <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-[#0b3d6e] to-[#0a7c74] text-white">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.22),transparent_42%),radial-gradient(circle_at_80%_10%,rgba(45,212,191,0.18),transparent_36%),radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.16),transparent_40%)]" />
              <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-sky-400/20 blur-3xl" />
              <div className="absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-teal-300/20 blur-3xl" />

              <div className="relative mx-auto max-w-5xl px-6 py-20 text-center lg:px-8 lg:py-28">
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55 }}
                  className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 shadow-lg shadow-sky-950/30 ring-1 ring-white/20 backdrop-blur"
                >
                  <CircleHelp className="h-7 w-7 text-sky-200" />
                </motion.div>

                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.05 }}
                  className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-sky-200/90"
                >
                  {hospitalName}
                </motion.p>

                <motion.h1
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
                >
                  Frequently Asked Questions
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.18 }}
                  className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-200/90 sm:text-lg"
                >
                  Clear answers about visits, appointments, emergency care, and
                  how we support your health every day.
                </motion.p>
              </div>
            </section>

            <section className="relative -mt-8 pb-8">
              <div className="mx-auto max-w-4xl px-6 lg:px-8">
                {categories.length > 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.15 }}
                    className="mb-6 flex flex-wrap justify-center gap-2"
                  >
                    {categories.map((category) => {
                      const isActive = category === activeCategory;
                      return (
                        <button
                          key={category}
                          type="button"
                          onClick={() => {
                            setActiveCategory(category);
                            setOpenId(null);
                          }}
                          className={[
                            "rounded-xl px-4 py-2 text-sm font-semibold transition shadow-sm",
                            isActive
                              ? "bg-[#147BD5] text-white shadow-sky-500/25"
                              : "border border-slate-200 bg-white text-slate-600 hover:border-sky-200 hover:text-sky-700",
                          ].join(" ")}
                        >
                          {category}
                        </button>
                      );
                    })}
                  </motion.div>
                )}

                {filteredFaqs.length === 0 ? (
                  <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-xl shadow-slate-200/60">
                    <MessageCircleQuestion className="mx-auto mb-4 h-10 w-10 text-sky-500" />
                    <h2 className="text-xl font-semibold text-slate-900">
                      No questions yet
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">
                      FAQs will appear here once they are published.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredFaqs.map((faq, index) => {
                      const isOpen = openId === faq.id;
                      return (
                        <motion.div
                          key={faq.id}
                          initial={{ opacity: 0, y: 18 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.05 }}
                          className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-lg shadow-slate-200/50"
                        >
                          <button
                            type="button"
                            onClick={() =>
                              setOpenId(isOpen ? null : faq.id)
                            }
                            className="flex w-full items-start justify-between gap-4 px-5 py-5 text-left transition hover:bg-slate-50/80 sm:px-6"
                            aria-expanded={isOpen}
                          >
                            <div className="min-w-0">
                              {faq.category && (
                                <span className="mb-2 inline-block rounded-md bg-sky-50 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-sky-700">
                                  {faq.category}
                                </span>
                              )}
                              <p className="text-base font-semibold text-slate-900 sm:text-lg">
                                {faq.question}
                              </p>
                            </div>
                            <span
                              className={[
                                "mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition",
                                isOpen
                                  ? "bg-[#147BD5] text-white"
                                  : "bg-slate-100 text-slate-500",
                              ].join(" ")}
                            >
                              <ChevronDown
                                className={[
                                  "h-4 w-4 transition-transform duration-300",
                                  isOpen ? "rotate-180" : "",
                                ].join(" ")}
                              />
                            </span>
                          </button>

                          <AnimatePresence initial={false}>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.28 }}
                                className="overflow-hidden"
                              >
                                <div className="border-t border-slate-100 px-5 pb-5 pt-4 text-sm leading-relaxed text-slate-600 sm:px-6 sm:text-base">
                                  {faq.answer}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>

            <section className="bg-gradient-to-b from-transparent via-sky-50/40 to-teal-50/30 py-16">
              <div className="mx-auto max-w-6xl px-6 lg:px-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5 }}
                  className="mb-10 text-center"
                >
                  <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                    Need more help?
                  </h2>
                  <p className="mx-auto mt-3 max-w-2xl text-slate-600">
                    Reach our care team, schedule a visit, or get emergency
                    guidance — we are here when you need us.
                  </p>
                </motion.div>

                <div className="grid gap-5 md:grid-cols-3">
                  {[
                    {
                      icon: MessageCircleQuestion,
                      title: "Talk to our team",
                      description:
                        "Have a specific question? Send us a message and we will get back to you quickly.",
                      action: "Contact us",
                      to: "/contact",
                      accent: "from-sky-500 to-blue-600",
                    },
                    {
                      icon: Stethoscope,
                      title: "Find a specialist",
                      description:
                        "Browse our doctors and choose the right clinician for your care needs.",
                      action: "View doctors",
                      to: "/",
                      accent: "from-teal-500 to-emerald-600",
                    },
                    {
                      icon: CalendarCheck,
                      title: "Plan your visit",
                      description:
                        "Learn about our services and prepare for a smooth, confident hospital visit.",
                      action: "Explore services",
                      to: "/",
                      accent: "from-indigo-500 to-sky-600",
                    },
                  ].map((item, index) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.25 }}
                      transition={{ duration: 0.45, delay: index * 0.08 }}
                      className="group relative overflow-hidden rounded-3xl border border-white/70 bg-white/90 p-6 shadow-xl shadow-slate-200/70 backdrop-blur"
                    >
                      <div
                        className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${item.accent} text-white shadow-lg`}
                      >
                        <item.icon className="h-5 w-5" />
                      </div>
                      <h3 className="text-xl font-semibold text-slate-900">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">
                        {item.description}
                      </p>
                      <Link
                        to={item.to}
                        className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#147BD5] transition group-hover:gap-3"
                      >
                        {item.action}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            <section className="pb-20">
              <div className="mx-auto max-w-6xl px-6 lg:px-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5 }}
                  className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-slate-900 via-[#0d4a7a] to-[#0f766e] p-8 text-white shadow-2xl shadow-slate-400/30 sm:p-10"
                >
                  <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-sky-400/20 blur-3xl" />
                  <div className="absolute -bottom-16 left-10 h-52 w-52 rounded-full bg-teal-300/20 blur-3xl" />

                  <div className="relative grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
                    <div>
                      <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-sky-100 ring-1 ring-white/15">
                        <Ambulance className="h-3.5 w-3.5" />
                        Emergency support
                      </div>
                      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Urgent care, ready when every minute matters
                      </h2>
                      <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-200 sm:text-base">
                        If you are experiencing a medical emergency, call our
                        emergency line immediately or visit the nearest
                        emergency department.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <a
                        href={`tel:${emergencyPhone.replace(/[^\d+]/g, "")}`}
                        className="flex items-center justify-between rounded-2xl bg-white px-5 py-4 text-slate-900 shadow-lg transition hover:bg-sky-50"
                      >
                        <span className="flex items-center gap-3">
                          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500 text-white">
                            <Phone className="h-4 w-4" />
                          </span>
                          <span>
                            <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Emergency
                            </span>
                            <span className="font-semibold">{emergencyPhone}</span>
                          </span>
                        </span>
                        <ArrowRight className="h-4 w-4 text-slate-400" />
                      </a>

                      <a
                        href={`tel:${phone.replace(/[^\d+]/g, "")}`}
                        className="flex items-center justify-between rounded-2xl bg-white/10 px-5 py-4 ring-1 ring-white/15 transition hover:bg-white/15"
                      >
                        <span className="flex items-center gap-3">
                          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/90 text-white">
                            <Phone className="h-4 w-4" />
                          </span>
                          <span>
                            <span className="block text-xs font-semibold uppercase tracking-wide text-sky-100/80">
                              Main desk
                            </span>
                            <span className="font-semibold">{phone}</span>
                          </span>
                        </span>
                        <ArrowRight className="h-4 w-4 text-sky-100/70" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              </div>
            </section>
          </>
        )}
      </main>
      <Footer footer={footer} siteSettings={settings} isLoading={loading} />
    </div>
  );
}

function FaqPageSkeleton() {
  return (
    <div className="animate-pulse">
      <section className="bg-slate-900 py-20 lg:py-28">
        <div className="mx-auto max-w-5xl px-6 text-center lg:px-8">
          <div className="mx-auto mb-6 h-14 w-14 rounded-2xl bg-slate-800" />
          <div className="mx-auto mb-3 h-4 w-40 rounded bg-slate-800" />
          <div className="mx-auto mb-4 h-12 w-full max-w-xl rounded-lg bg-slate-800" />
          <div className="mx-auto h-4 w-full max-w-lg rounded bg-slate-800" />
          <div className="mx-auto mt-2 h-4 w-4/5 max-w-md rounded bg-slate-800" />
        </div>
      </section>

      <section className="relative -mt-8 pb-8">
        <div className="mx-auto max-w-4xl space-y-3 px-6 lg:px-8">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-20 rounded-2xl border border-slate-200 bg-white shadow-sm"
            />
          ))}
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="mx-auto mb-10 h-8 w-56 rounded bg-slate-200" />
          <div className="grid gap-5 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-48 rounded-3xl border border-slate-200 bg-white"
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
