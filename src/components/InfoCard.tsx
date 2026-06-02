import type { CardItem } from "../data/site";

export default function InfoCard({ title, description }: CardItem) {
  return (
    <article className="group rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#006A67]/30 hover:shadow-lg hover:shadow-slate-200/70">
      <div className="mb-5 h-1.5 w-12 rounded-full bg-[linear-gradient(135deg,#0015A5_0%,#006A67_100%)]"></div>
      <h3 className="text-lg font-bold text-slate-950">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
    </article>
  );
}
