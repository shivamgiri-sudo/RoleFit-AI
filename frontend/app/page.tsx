import Link from 'next/link';

const intelligenceCards = [
  ['Trait Graph', 'Role-specific behavior signals mapped to success evidence, not generic personality labels.'],
  ['Voice Interview', 'A guided AI interviewer captures transcript evidence and flags areas for review.'],
  ['Fit Score', 'Eligibility, skill, trait, and role-alignment signals become one explainable score.'],
  ['Approval Gate', 'AI recommends next action; final employment decisions stay auditable and human-approved.'],
];

const pipeline = ['Role Intake', 'Trait Blueprint', 'AI Assessment', 'Voice Interview', 'Fit Report', 'Approval Gate'];

export default function Home() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-8 md:px-10">
      <nav className="mb-8 flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="voice-orb h-10 w-10 rounded-2xl" />
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-200">RoleFit AI</p>
            <p className="text-xs text-slate-400">Autonomous hiring workflow + trait intelligence</p>
          </div>
        </div>
        <div className="hidden gap-2 text-sm text-slate-300 md:flex">
          <Link href="/jobs" className="rounded-full px-4 py-2 hover:bg-white/10">Jobs</Link>
          <Link href="/voice-interview" className="rounded-full px-4 py-2 hover:bg-white/10">Voice Interview</Link>
          <a href="http://localhost:8000/docs" className="rounded-full px-4 py-2 hover:bg-white/10">API</a>
        </div>
      </nav>

      <section className="grid gap-6 lg:grid-cols-[1.12fr_0.88fr]">
        <div className="glass-panel glow-card rounded-[2rem] p-8 md:p-12">
          <div className="mb-6 inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100">
            AI Hiring Cockpit · Skill + Trait + Voice Evidence
          </div>
          <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-tight md:text-7xl">
            Hire for the role. Not just the resume.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            A modern SaaS hiring engine that builds role blueprints, assesses role-critical traits, runs voice interviews, scores evidence, and gives hiring teams a clear approval-ready decision cockpit.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/jobs" className="rounded-2xl bg-cyan-300 px-6 py-3 font-bold text-slate-950 shadow-lg shadow-cyan-950/30">Launch Hiring Cockpit</Link>
            <Link href="/voice-interview" className="rounded-2xl border border-white/15 bg-white/10 px-6 py-3 font-bold text-white hover:bg-white/15">Try AI Voice Interview</Link>
          </div>
        </div>

        <div className="glass-panel rounded-[2rem] p-6">
          <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-5">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Live Fit Signal</p>
                <h2 className="text-2xl font-bold">Operations Manager</h2>
              </div>
              <div className="rounded-full bg-emerald-400/10 px-3 py-1 text-sm font-semibold text-emerald-200">Review Ready</div>
            </div>
            <div className="space-y-4">
              {[
                ['Trait Fit', 88],
                ['Role Alignment', 91],
                ['Voice Evidence', 84],
                ['Execution Discipline', 79],
              ].map(([label, value]) => (
                <div key={label as string}>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-slate-300">{label}</span>
                    <span className="font-bold text-cyan-200">{value}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10">
                    <div className="h-2 rounded-full bg-gradient-to-r from-cyan-300 to-violet-400" style={{ width: `${value}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-300">
              AI found strong ownership, client maturity, and recovery planning. Validate people leadership depth before final approval.
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-4">
        {intelligenceCards.map(([title, body]) => (
          <div key={title} className="glass-panel rounded-3xl p-5">
            <h3 className="text-lg font-bold">{title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-400">{body}</p>
          </div>
        ))}
      </section>

      <section className="mt-6 glass-panel rounded-[2rem] p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold">Autonomous Workflow Map</h2>
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-300">No admin chaos · Fully tracked</span>
        </div>
        <div className="grid gap-3 md:grid-cols-6">
          {pipeline.map((step, index) => (
            <div key={step} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-xs font-bold text-cyan-200">0{index + 1}</p>
              <p className="mt-3 text-sm font-semibold">{step}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
