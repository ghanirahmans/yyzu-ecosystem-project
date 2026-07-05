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
      className={`relative isolate overflow-hidden border-b flex flex-col justify-center min-h-[calc(100vh-4rem)] ${
        isDark ? "bg-slate-950 text-white border-white/10" : "bg-[#f7f9fb] text-slate-950 border-slate-200"
      }`}
    >
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: isDark
            ? "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)"
            : "radial-gradient(circle, rgba(0,21,165,0.05) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      ></div>
      {/* Gradient orbs */}
      <div
        className="pointer-events-none absolute -top-24 -left-24 h-[350px] w-[350px] rounded-full blur-3xl -z-10"
        aria-hidden="true"
        style={{
          background: isDark
            ? "radial-gradient(circle, #0015A5, transparent 70%)"
            : "radial-gradient(circle, #0015A5, transparent 70%)",
          opacity: isDark ? 0.12 : 0.08,
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-24 -right-24 h-[300px] w-[300px] rounded-full blur-3xl -z-10"
        aria-hidden="true"
        style={{
          background: isDark
            ? "radial-gradient(circle, #006A67, transparent 70%)"
            : "radial-gradient(circle, #006A67, transparent 70%)",
          opacity: isDark ? 0.10 : 0.06,
        }}
      />
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
