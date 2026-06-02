export interface PageHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  note?: string;
  tone?: "light" | "dark";
}

export default function PageHero({
  eyebrow,
  title,
  description,
  note,
  tone = "light",
}: PageHeroProps) {
  const isDark = tone === "dark";

  return (
    <section
      className={`relative isolate overflow-hidden ${
        isDark ? "bg-slate-950 text-white" : "bg-white text-slate-950"
      }`}
    >
      <div
        className={`absolute inset-0 -z-10 bg-[linear-gradient(rgba(15,23,42,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.08)_1px,transparent_1px)] bg-[size:44px_44px] ${
          isDark ? "opacity-20" : "opacity-35"
        }`}
      ></div>
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="max-w-4xl">
          <p
            className={`text-sm font-bold uppercase tracking-[0.22em] ${
              isDark ? "text-teal-200" : "text-[#006A67]"
            }`}
          >
            {eyebrow}
          </p>
          <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p
            className={`mt-6 max-w-3xl text-base leading-8 sm:text-lg ${
              isDark ? "text-slate-300" : "text-slate-600"
            }`}
          >
            {description}
          </p>
          {note && (
            <p
              className={`mt-6 inline-flex rounded-lg border px-4 py-3 text-sm font-semibold leading-6 ${
                isDark
                  ? "border-white/12 bg-white/[0.06] text-slate-200"
                  : "border-slate-200 bg-slate-50 text-slate-700"
              }`}
            >
              {note}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
