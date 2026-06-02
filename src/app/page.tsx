import CtaBand from "../components/CtaBand";
import InfoCard from "../components/InfoCard";
import Section from "../components/Section";
import {
  activities,
  bridgeCards,
  currentFocus,
  ecosystemRoles,
  modelSteps,
  whyYYZU,
} from "../data/site";

export default function Home() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,rgba(0,21,165,0.9)_0%,rgba(0,106,103,0.78)_48%,rgba(15,23,42,0.96)_100%)]"></div>
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.11)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.11)_1px,transparent_1px)] bg-[size:42px_42px] opacity-20"></div>
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <div className="mb-8 flex size-18 items-center justify-center rounded-lg bg-white shadow-2xl shadow-slate-950/25 ring-1 ring-white/30">
                <img
                  src="/yyz-project-logo_ft.svg"
                  alt="Logo YYZU"
                  width="52"
                  height="52"
                  decoding="async"
                />
              </div>
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-teal-100">
                Collaborative Technology Ecosystem & Talent Bridge
              </p>
              <h1 className="mt-5 text-4xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
                YYZU
              </h1>
              <p className="mt-6 max-w-3xl text-xl font-semibold leading-8 text-white sm:text-2xl sm:leading-10">
                Jembatan antara kampus, talenta teknologi, komunitas, mentor, dan
                industri untuk belajar, membangun, dan tumbuh melalui pengalaman
                nyata.
              </p>
              <p className="mt-5 max-w-3xl text-base leading-8 text-slate-200 sm:text-lg">
                YYZU membantu mahasiswa dan individu di bidang teknologi berkembang
                lebih terarah melalui collaborative learning, workflow simulation,
                mentoring, teamwork, dan real project development berbasis tim.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a
                  href="/join/"
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-bold text-[#0015A5] shadow-lg shadow-slate-950/20 transition hover:bg-slate-100"
                >
                  Join & Grow Together
                </a>
                <a
                  href="/about/"
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/30 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  Pahami Ekosistem
                </a>
              </div>
            </div>

            <div className="rounded-lg border border-white/12 bg-white/[0.06] p-6 shadow-2xl shadow-slate-950/20 backdrop-blur">
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-teal-100">
                Growth Model
              </p>
              <h2 className="mt-4 text-2xl font-bold tracking-tight text-white">
                Learn, build, collaborate, grow.
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                Model pertumbuhan YYZU membantu member bergerak dari fundamental
                dan tools menuju pengalaman project, teamwork, communication,
                ownership, dan kesiapan industri yang lebih matang.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-4 lg:grid-cols-1 xl:grid-cols-4 xl:gap-2 2xl:gap-3">
                {modelSteps.map((step, index) => (
                  <div
                    key={step}
                    className="min-w-0 rounded-lg border border-white/12 bg-slate-950/30 px-4 py-3 xl:px-2.5 xl:py-2.5 2xl:px-4 2xl:py-3"
                  >
                    <span className="text-xs font-bold text-teal-100">
                      0{index + 1}
                    </span>
                    <p className="mt-1 whitespace-nowrap text-sm font-bold leading-5 text-white xl:text-xs 2xl:text-sm">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <Section
            eyebrow="Positioning"
            title="YYZU adalah collaborative technology ecosystem dan talent bridge."
            description="YYZU bukan sekadar komunitas belajar, bukan sekadar tempat project, dan bukan sekadar talent pool. YYZU adalah environment untuk membantu talenta teknologi berkembang dari learning menuju collaboration, real project experience, dan industry readiness."
          />
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {currentFocus.map((item) => (
              <article
                key={item.title}
                className="rounded-lg border border-slate-200 bg-slate-50 p-5"
              >
                <h3 className="font-bold text-slate-950">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f7f9fb] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <Section
            eyebrow="Why YYZU Exists"
            title="Ada gap antara belajar teknologi dan siap bekerja dalam real project."
            description="Banyak talenta sudah belajar tools dan konsep, tetapi belum terbiasa dengan teamwork, communication, ownership, review, dokumentasi, prioritas, dan proses delivery. Di gap itulah YYZU dibangun sebagai jembatan pertumbuhan."
            align="center"
          />
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {whyYYZU.map((item) => (
              <InfoCard key={item.title} {...item} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <Section
            eyebrow="Bridge Model"
            title="Dari learning menuju collaboration, real project experience, dan industry readiness."
            description="YYZU menempatkan dirinya sebagai jembatan praktis, bukan shortcut. Growth dibangun lewat collaborative learning, project-based growth, workflow industri, mentoring, dan proses review yang dilatih bersama."
            align="center"
            tone="dark"
          />
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {bridgeCards.map((item) => (
              <article
                key={item.title}
                className="rounded-lg border border-white/12 bg-white/[0.06] p-7"
              >
                <h3 className="text-xl font-bold text-white">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-300">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <Section
              eyebrow="Activities Preview"
              title="Belajar lewat study group, mentoring, workshop, review, dan collaborative project."
              description="Aktivitas YYZU dirancang untuk membentuk technical skill, problem solving, teamwork, communication, ownership, serta pengalaman kerja kolaboratif yang bisa diulang dan ditingkatkan."
            />
            <div className="grid gap-4 sm:grid-cols-2">
              {activities.slice(0, 4).map((activity) => (
                <article
                  key={activity.title}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-5"
                >
                  <h3 className="font-bold text-slate-950">{activity.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {activity.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
          <div className="mt-8">
            <a
              href="/activities/"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-slate-300 px-6 py-3 text-sm font-bold text-slate-800 transition hover:border-[#0015A5] hover:text-[#0015A5]"
            >
              Lihat Aktivitas
            </a>
          </div>
        </div>
      </section>

      <section className="bg-[#f7f9fb] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <Section
            eyebrow="Ecosystem"
            title="Ekosistem untuk member, kampus, komunitas, mentor, partner, dan industri."
            description="YYZU menghubungkan orang dan institusi yang ingin memperkuat pengembangan talenta teknologi melalui collaborative learning, real project, mentoring, workflow simulation, dan kontribusi konsisten."
            align="center"
          />
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {ecosystemRoles.map((role) => (
              <InfoCard key={role.title} {...role} />
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Grow through collaboration, real project, dan workflow industri."
        description="Join YYZU untuk berkembang lewat learning, build, teamwork, mentoring, project-based growth, dan kontribusi yang bisa dipertanggungjawabkan."
        primaryLabel="Join YYZU"
        primaryHref="/join/"
        secondaryLabel="Pelajari Culture"
        secondaryHref="/culture/"
      />
    </>
  );
}
