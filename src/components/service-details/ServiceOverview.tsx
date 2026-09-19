import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { Service } from "../../types/api";
import { getImageUrl } from "../../lib/api";

export default function ServiceOverview({ service }: { service: Service }) {
  const metrics = service.metrics ?? [];
  const primary = metrics.slice(0, 2);
  const additional = metrics[2];

  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-12">
          <p className="text-sm font-semibold text-slate-600">
            {service.category || service.title}
          </p>
          <h2 className="mt-2 max-w-2xl text-3xl font-bold leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
            {service.overviewTitle || service.title}
          </h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          {service.image ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="overflow-hidden rounded-3xl"
            >
              <img
                src={getImageUrl(service.image)}
                alt={service.title}
                className="h-full min-h-[400px] w-full object-cover"
              />
            </motion.div>
          ) : null}

          <div className="flex flex-col gap-5">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {service.overviewTitle || service.title}
                </h3>
                <p className="mt-3 max-w-md text-sm leading-6 text-slate-600">
                  {service.overviewDescription || service.description}
                </p>
                {service.ctaText && service.ctaUrl ? (
                  <a
                    href={service.ctaUrl}
                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#147BD5] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-100"
                  >
                    {service.ctaText}
                    <ArrowRight size={16} />
                  </a>
                ) : null}
              </div>

              <div className="rounded-3xl bg-gradient-to-br from-blue-50 to-blue-100 p-6 shadow-sm">
                {primary.map((metric) => (
                  <div key={metric.id} className="mb-5 last:mb-0">
                    <div className="text-3xl font-bold text-[#147BD5]">
                      <CountUp value={metric.value} />
                      {metric.suffix}
                    </div>
                    <p className="mt-1 text-sm font-medium text-slate-700">
                      {metric.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-[1fr_0.8fr]">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {service.description}
                </h3>
                <p className="mt-3 max-w-md text-sm leading-6 text-slate-600">
                  {service.overviewDescription || service.description}
                </p>
                {service.ctaText && service.ctaUrl ? (
                  <a
                    href={service.ctaUrl}
                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#147BD5] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-100"
                  >
                    {service.ctaText}
                    <ArrowRight size={16} />
                  </a>
                ) : null}
              </div>

              {additional ? (
                <div className="rounded-3xl bg-gradient-to-br from-blue-50 to-blue-100 p-6 shadow-sm">
                  <div className="text-3xl font-bold text-[#147BD5]">
                    <CountUp value={additional.value} />
                    {additional.suffix}
                  </div>
                  <p className="mt-1 text-sm font-medium text-slate-700">
                    {additional.label}
                  </p>
                  {service.ctaText && service.ctaUrl ? (
                    <a
                      href={service.ctaUrl}
                      className="mt-6 block w-full rounded-full bg-[#147BD5] px-4 py-2.5 text-center text-sm font-semibold text-white"
                    >
                      {service.ctaText}
                    </a>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CountUp({ value }: { value: number }) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {value}
    </motion.span>
  );
}
