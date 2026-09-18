const partners = [
  "Joint Commission International",
  "American Hospital Association",
  "American Medical Association",
  "JHC",
  "American Hospital Association",
];

export default function ServicePartners() {
  return (
    <section className="border-b border-slate-100 bg-white py-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <p className="text-center text-sm font-semibold text-slate-800">
          Partners
        </p>

        <div className="mt-7 grid grid-cols-2 items-center gap-8 opacity-55 sm:grid-cols-3 lg:grid-cols-5">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="flex items-center justify-center text-center"
            >
              <div className="text-sm font-semibold leading-tight text-slate-500">
                {partner}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}