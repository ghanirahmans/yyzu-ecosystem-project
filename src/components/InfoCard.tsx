import type { CardItem } from "../data/site";

export default function InfoCard({ title, description }: CardItem) {
  return (
    <article className="group h-full rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#006A67]/25 hover:shadow-lg hover:shadow-slate-200/80">
      <div className="mb-5 flex items-center gap-2.5">
        <div className="h-1 w-8 rounded-full bg-[linear-gradient(135deg,#0015A5_0%,#006A67_100%)]" />
      </div>
      <h3 className="text-[17px] font-bold text-slate-950 leading-snug">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
    </article>
  );
}
