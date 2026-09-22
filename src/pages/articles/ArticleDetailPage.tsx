import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Newspaper,
  UserRound,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import {
  getArticleBySlug,
  getFooter,
  getImageUrl,
  getNavbar,
  getSiteSettings,
} from "../../lib/api";
import type {
  Article,
  FooterSettings,
  NavbarColumn,
  SiteSettings,
} from "../../types/api";

const formatDate = (value?: string | Date | null) => {
  if (!value) return "Recently";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

const contentParagraphs = (content: string) => {
  const trimmed = content.trim();
  if (!trimmed) return [];

  const byBreak = trimmed.split(/\n+/).map((part) => part.trim()).filter(Boolean);
  if (byBreak.length > 1) return byBreak;

  return trimmed
    .split(/(?<=[.!?])\s+(?=[A-Z])/)
    .map((part) => part.trim())
    .filter(Boolean);
};

function CountUp({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / 700, 1);
      setDisplay(Math.round(value * progress));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return <>{display}</>;
}

export default function ArticleDetailPage() {
  const { articleSlug } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [footer, setFooter] = useState<FooterSettings | null>(null);
  const [navbarColumns, setNavbarColumns] = useState<NavbarColumn[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!articleSlug) return;

    let active = true;
    setLoading(true);
    setError(false);

    Promise.all([
      getArticleBySlug(articleSlug),
      getSiteSettings(),
      getFooter(),
      getNavbar(),
    ])
      .then(([articleData, settingsData, footerData, navbarData]) => {
        if (!active) return;
        setArticle(articleData);
        setSiteSettings(settingsData);
        setFooter(footerData);
        setNavbarColumns(navbarData ?? []);
        setError(!articleData);
      })
      .catch(() => {
        if (!active) return;
        setArticle(null);
        setError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [articleSlug]);

  const paragraphs = article ? contentParagraphs(article.content) : [];
  const readMinutes = article?.readTime ?? 5;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50">
      <Navbar
        siteSettings={siteSettings}
        columns={navbarColumns}
        isLoading={loading}
      />
      <main>
        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl" />
          <div className="pointer-events-none absolute -right-20 top-40 h-80 w-80 rounded-full bg-cyan-200/35 blur-3xl" />
          <div className="pointer-events-none absolute bottom-10 left-1/3 h-56 w-56 rounded-full bg-teal-100/50 blur-3xl" />

          <div className="relative mx-auto max-w-4xl px-5 py-12 mt-10 sm:px-8 lg:px-10 lg:py-16">
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45 }}
            >
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm font-medium text-[#185b9c] transition-colors hover:text-[#0f4a82]"
              >
                <ArrowLeft size={16} strokeWidth={2} />
                Back to articles
              </Link>
            </motion.div>

            {loading ? <ArticleDetailSkeleton /> : null}

            {!loading && error ? (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 rounded-2xl bg-white p-10 text-center shadow-[0_12px_35px_rgba(0,0,0,0.08)]"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sky-50 text-[#185b9c]">
                  <Newspaper size={26} strokeWidth={1.7} />
                </div>
                <h2 className="mt-4 text-2xl font-semibold text-gray-900">
                  Article not found
                </h2>
                <p className="mt-3 text-sm text-gray-600">
                  The requested article is unavailable or no longer published.
                </p>
                <Link
                  to="/"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#10a6ee] to-[#1676dd] px-5 py-2.5 text-sm font-medium text-white shadow-[0_8px_20px_rgba(20,120,220,0.28)]"
                >
                  Return home
                </Link>
              </motion.div>
            ) : null}

            {!loading && article ? (
              <article className="mt-8">
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55 }}
                  className="overflow-hidden rounded-[24px] bg-white shadow-[0_18px_45px_rgba(45,70,100,0.12)]"
                >
                  <div className="relative h-[240px] overflow-hidden sm:h-[320px] lg:h-[380px]">
                    <div className="absolute inset-0 bg-gradient-to-br from-sky-400 via-cyan-500 to-teal-500" />
                    {article.image ? (
                      <img
                        src={getImageUrl(article.image)}
                        alt={article.title}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    ) : null}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#071535]/75 via-[#071535]/25 to-transparent" />
                    <div className="absolute bottom-5 left-5 right-5 sm:bottom-7 sm:left-7 sm:right-7">
                      <span className="inline-flex rounded-full bg-white/90 px-4 py-1.5 text-[12px] font-semibold tracking-wide text-[#185b9c] shadow-sm backdrop-blur-sm">
                        {article.category || "Health"}
                      </span>
                    </div>
                  </div>

                  <div className="px-6 py-8 sm:px-9 sm:py-10 lg:px-11">
                    <motion.h1
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      className="text-[28px] font-bold leading-[1.2] tracking-[-0.8px] text-[#071535] sm:text-[36px] lg:text-[40px]"
                    >
                      {article.title}
                    </motion.h1>

                    <motion.p
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.18 }}
                      className="mt-4 max-w-2xl text-[15px] leading-relaxed text-[#4e5c6d] sm:text-[16px]"
                    >
                      {article.excerpt}
                    </motion.p>

                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.26 }}
                      className="mt-7 flex flex-wrap items-center gap-3 border-y border-slate-100 py-5"
                    >
                      <div className="flex items-center gap-2.5 rounded-full bg-gradient-to-r from-sky-50 to-cyan-50 px-3.5 py-2 shadow-[0_4px_12px_rgba(45,70,100,0.06)]">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#10a6ee] to-[#1676dd] text-white shadow-sm">
                          <UserRound size={15} strokeWidth={2} />
                        </span>
                        <div>
                          <p className="text-[10px] font-medium uppercase tracking-wider text-[#7a8a9c]">
                            Author
                          </p>
                          <p className="text-[13px] font-semibold text-[#071535]">
                            {article.author}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 rounded-full bg-slate-50 px-3.5 py-2 text-[13px] text-[#4e5c6d]">
                        <CalendarDays size={15} strokeWidth={1.8} className="text-[#185b9c]" />
                        <span>{formatDate(article.publishedAt)}</span>
                      </div>

                      <div className="flex items-center gap-2 rounded-full bg-slate-50 px-3.5 py-2 text-[13px] text-[#4e5c6d]">
                        <Clock3 size={15} strokeWidth={1.8} className="text-[#185b9c]" />
                        <span>
                          <CountUp value={readMinutes} /> min read
                        </span>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.55, delay: 0.34 }}
                      className="prose-article mt-8 space-y-5"
                    >
                      {paragraphs.map((paragraph, index) => (
                        <p
                          key={index}
                          className="text-[15.5px] leading-[1.85] text-[#2a3545] sm:text-[16.5px]"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </motion.div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.45 }}
                  className="mt-8 overflow-hidden rounded-2xl border border-white/80 bg-gradient-to-r from-[#fffdf8] via-[#f4f7fc] to-[#eaf5ff] p-6 shadow-[0_10px_28px_rgba(50,80,110,0.12)] sm:p-8"
                >
                  <p className="text-[13px] font-medium uppercase tracking-[0.7px] text-[#237bb8]">
                    Stay informed
                  </p>
                  <h2 className="mt-2 text-[22px] font-semibold tracking-tight text-[#071535] sm:text-[24px]">
                    Explore more health insights
                  </h2>
                  <p className="mt-2 max-w-xl text-sm text-[#4e5c6d]">
                    Browse additional articles from our doctors and care team on
                    the homepage.
                  </p>
                  <Link
                    to="/"
                    className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#10a6ee] to-[#1676dd] px-5 py-2.5 text-sm font-medium text-white shadow-[0_8px_20px_rgba(20,120,220,0.28)] transition-transform hover:scale-[1.02]"
                  >
                    View all articles
                    <ArrowLeft size={15} className="rotate-180" />
                  </Link>
                </motion.div>
              </article>
            ) : null}
          </div>
        </div>
      </main>
      <Footer footer={footer} siteSettings={siteSettings} isLoading={loading} />
    </div>
  );
}

function ArticleDetailSkeleton() {
  return (
    <div className="mt-8 animate-pulse overflow-hidden rounded-[24px] bg-white shadow-[0_18px_45px_rgba(45,70,100,0.12)]">
      <div className="h-[240px] bg-gradient-to-br from-sky-200 via-cyan-200 to-teal-200 sm:h-[320px] lg:h-[380px]" />
      <div className="space-y-5 px-6 py-8 sm:px-9 sm:py-10 lg:px-11">
        <div className="h-4 w-24 rounded-full bg-slate-100" />
        <div className="h-10 w-4/5 rounded bg-slate-200" />
        <div className="h-10 w-3/5 rounded bg-slate-200" />
        <div className="space-y-2 pt-1">
          <div className="h-3.5 w-full rounded bg-slate-100" />
          <div className="h-3.5 w-5/6 rounded bg-slate-100" />
        </div>
        <div className="flex flex-wrap gap-3 border-y border-slate-100 py-5">
          <div className="h-12 w-36 rounded-full bg-slate-100" />
          <div className="h-12 w-32 rounded-full bg-slate-100" />
          <div className="h-12 w-28 rounded-full bg-slate-100" />
        </div>
        <div className="space-y-3 pt-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className={`h-3.5 rounded bg-slate-100 ${index % 3 === 2 ? "w-4/5" : "w-full"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
