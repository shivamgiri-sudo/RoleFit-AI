import Link from 'next/link';

const intelligenceCards = [
  ['Trait Graph', 'Role-specific behavior signals mapped to success evidence.'],
  ['Voice AI', 'Audio to transcript to structured interview evidence.'],
  ['Fit Score', 'Eligibility, skill, trait, alignment and approval readiness.'],
  ['Brand Portal', 'Company-wise logo, career page and candidate experience.'],
];

const pipeline = ['Role Intake', 'Trait Blueprint', 'Assessments', 'Voice AI', 'Fit Report', 'Approval'];

export default function Home() {
  return (
    <main className="relative mx-auto max-w-7xl px-4 py-5 md:px-7 md:py-7">
      <nav className="glass-panel sticky top-4 z-40 mb-8 flex items-center justify-between rounded-[1.6rem] px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <div className="voice-orb floaty h-10 w-10 rounded-2xl" />
          <div>
            <p className="text-sm font-black uppercase tracking-[0.24em] text-white">RoleFit AI</p>
            <p className="text-xs text-cyan-100/70">Colorful hiring intelligence OS</p>
          </div>
        </Link>
        <div className="hidden gap-2 text-xs font-bold text-slate-200/80 md:flex">
          <Link href="/dashboard" className="rounded-full px-4 py-2 hover:bg-white/10">Dashboard</Link>
          <Link href="/jobs" className="rounded-full px-4 py-2 hover:bg-white/10">Jobs</Link>
          <Link href="/voice-interview" className="rounded-full px-4 py-2 hover:bg-white/10">Voice AI</Link>
          <Link href="/login" className="rounded-full bg-white px-4 py-2 font-black text-slate-950">Login</Link>
        </div>
      </nav>

      <section className="grid gap-5 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="neo-surface rounded-[2.4rem] px-6 py-8 md:px-10 md:py-12">
          <div className="mb-5 inline-flex rounded-full bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-cyan-100">
            AI Hiring · Voice Evidence · Company Branding
          </div>
          <h1 className="max-w-5xl text-5xl font-black leading-[0.9] tracking-tight md:text-8xl">
            <span className="gradient-text">Hire sharper.</span><br />Move faster.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-100/75 md:text-lg">
            A colorful modern SaaS hiring platform for all companies: role blueprints, all assessment types, AI voice interviews, fit reports, human approval and branded candidate portals.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/dashboard" className="rounded-full bg-white px-6 py-3 text-sm font-black text-slate-950 shadow-2xl shadow-cyan-950/30">Open Dashboard</Link>
            <Link href="/voice-interview" className="rounded-full bg-gradient-to-r from-cyan-300 via-violet-300 to-rose-300 px-6 py-3 text-sm font-black text-slate-950">Try Voice AI</Link>
            <Link href="/career" className="rounded-full bg-white/10 px-6 py-3 text-sm font-bold text-white ring-1 ring-white/10">Career Page</Link>
          </div>
        </div>

        <div className="grid gap-5">
          <div className="neo-surface color-card-violet rounded-[2.2rem] p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-white/65">Live Candidate Signal</p>
                <h2 className="mt-2 text-3xl font-black">Operations Manager</h2>
              </div>
              <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-black text-white">86% Fit</span>
            </div>
            <div className="space-y-4">
              {[
                ['Trait Fit', 88, 'from-cyan-300 to-blue-400'],
                ['Role Alignment', 91, 'from-violet-300 to-fuchsia-400'],
                ['Voice Evidence', 84, 'from-rose-300 to-orange-300'],
                ['Execution', 79, 'from-lime-300 to-emerald-400'],
              ].map(([label, value, gradient]) => (
                <div key={label as string}>
                  <div className="mb-2 flex justify-between text-xs font-bold text-white/75">
                    <span>{label}</span><span>{value}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/12">
                    <div className={`h-2 rounded-full bg-gradient-to-r ${gradient}`} style={{ width: `${value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {intelligenceCards.map(([title, body], index) => (
              <div key={title} className={`mini-card rounded-[1.7rem] p-5 ${index === 0 ? 'color-card-cyan' : index === 1 ? 'color-card-rose' : index === 2 ? 'color-card-lime' : 'color-card-violet'}`}>
                <h3 className="text-lg font-black">{title}</h3>
                <p className="mt-2 text-xs leading-5 text-white/70">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-5 neo-surface rounded-[2rem] p-5">
        <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <h2 className="text-2xl font-black">Workflow Map</h2>
          <span className="rounded-full bg-white/10 px-4 py-2 text-xs font-black text-white/70">All assessment types · All communications · MySQL ready scope</span>
        </div>
        <div className="grid gap-3 md:grid-cols-6">
          {pipeline.map((step, index) => (
            <div key={step} className="mini-card rounded-[1.5rem] p-4">
              <p className="text-xs font-black text-cyan-100/75">0{index + 1}</p>
              <p className="mt-3 text-sm font-black">{step}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
