import Link from "next/link";

export interface CtaBandProps {
  eyebrow?: string;
  title: string;
  description: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

const isInternal = (href: string) => href.startsWith("/") && !href.startsWith("//");

export default function CtaBand({
  eyebrow = "Build With YYZU",
  title,
  description,
  primaryLabel = "Join YYZU",
  primaryHref = "/join/",
  secondaryLabel,
  secondaryHref,
}: CtaBandProps) {
  const renderLink = (href: string, label: string, className: string) => {
    if (isInternal(href)) {
      return (
        <Link href={href} prefetch={false} className={className}>
          {label}
        </Link>
      );
    }
    return (
      <a href={href} className={className}>
        {label}
      </a>
    );
  };

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="relative isolate overflow-hidden rounded-lg bg-slate-950 px-6 py-12 text-white sm:px-10">
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,rgba(0,21,165,0.78)_0%,rgba(0,106,103,0.64)_48%,rgba(15,23,42,0.96)_100%)]"></div>
          <div className="absolute inset-0 -z-10" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)", backgroundSize: "24px 24px" }}></div>
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-teal-200">
              {eyebrow}
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              {title}
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-300 sm:text-lg">
              {description}
            </p>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {renderLink(
              primaryHref,
              primaryLabel,
              "inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-bold text-[#0015A5] transition hover:bg-slate-100"
            )}
            {secondaryLabel &&
              secondaryHref &&
              renderLink(
                secondaryHref,
                secondaryLabel,
                "inline-flex min-h-12 items-center justify-center rounded-full border border-white/24 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
              )}
          </div>
        </div>
      </div>
    </section>
  );
}
