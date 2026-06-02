export interface SectionProps {
  eyebrow: string;
  title: string;
  description: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
}

export default function Section({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "light",
}: SectionProps) {
  const isDark = tone === "dark";

  return (
    <div className={`mx-auto max-w-3xl ${align === "center" ? "text-center" : "lg:mx-0"}`}>
      <p
        className={`text-sm font-bold uppercase tracking-[0.22em] ${
          isDark ? "text-teal-200" : "text-[#006A67]"
        }`}
      >
        {eyebrow}
      </p>
      <h2
        className={`mt-4 text-3xl font-bold tracking-tight sm:text-4xl ${
          isDark ? "text-white" : "text-slate-950"
        }`}
      >
        {title}
      </h2>
      <p
        className={`mt-5 text-base leading-8 sm:text-lg ${
          isDark ? "text-slate-300" : "text-slate-600"
        }`}
      >
        {description}
      </p>
    </div>
  );
}
