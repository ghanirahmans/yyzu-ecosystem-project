import type { CardItem } from "../data/site";

export default function RoleCard({ title, description }: CardItem) {
  const initials = title
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("");

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-7 shadow-sm">
      <div className="mb-6 flex size-12 items-center justify-center rounded-lg bg-slate-950 text-sm font-bold text-white">
        {initials}
      </div>
      <h3 className="text-xl font-bold text-slate-950">{title}</h3>
      <p className="mt-4 text-sm leading-7 text-slate-600">{description}</p>
    </article>
  );
}
