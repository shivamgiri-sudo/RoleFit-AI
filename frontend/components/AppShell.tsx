import Link from 'next/link';

const navItems = [
  ['Dashboard', '/dashboard'],
  ['Jobs', '/jobs'],
  ['Career', '/career'],
  ['Candidates', '/candidates'],
  ['Pipeline', '/applications'],
  ['Assessment', '/assessment'],
  ['Interview', '/voice-interview'],
  ['Fit Report', '/fit-report'],
  ['Approvals', '/approvals'],
  ['Talent Pool', '/talent-pool'],
  ['Analytics', '/analytics'],
  ['Settings', '/settings'],
];

export function AppShell({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle?: string }) {
  return (
    <main className="relative mx-auto min-h-screen max-w-7xl px-4 py-5 md:px-7 md:py-7">
      <div className="pointer-events-none absolute left-8 top-24 h-44 w-44 rounded-full bg-cyan-300/20 blur-3xl" />
      <div className="pointer-events-none absolute right-10 top-8 h-56 w-56 rounded-full bg-fuchsia-400/20 blur-3xl" />

      <nav className="glass-panel sticky top-4 z-40 mb-6 flex items-center gap-3 rounded-[1.6rem] px-4 py-3">
        <Link href="/" className="flex shrink-0 items-center gap-3 pr-2">
          <div className="voice-orb floaty h-10 w-10 rounded-2xl" />
          <div className="hidden sm:block">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-white">RoleFit</p>
            <p className="-mt-0.5 text-[11px] font-semibold text-cyan-100/70">AI Hiring OS</p>
          </div>
        </Link>
        <div className="soft-divider hidden h-8 w-px md:block" />
        <div className="flex flex-1 gap-2 overflow-x-auto px-1 py-1">
          {navItems.map(([label, href]) => (
            <Link key={href} href={href} className="whitespace-nowrap rounded-full px-3 py-2 text-xs font-bold text-slate-200/80 transition hover:bg-white/10 hover:text-white md:px-4">
              {label}
            </Link>
          ))}
        </div>
        <Link href="/login" className="hidden rounded-full bg-white px-4 py-2 text-xs font-black text-slate-950 shadow-2xl shadow-cyan-950/30 md:block">Login</Link>
      </nav>

      <header className="mb-6 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
        <div className="neo-surface rounded-[2rem] px-6 py-7 md:px-8 md:py-8">
          <div className="mb-3 inline-flex rounded-full bg-white/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.24em] text-cyan-100">RoleFit AI</div>
          <h1 className="max-w-4xl text-4xl font-black leading-[0.94] tracking-tight md:text-6xl">
            <span className="gradient-text">{title}</span>
          </h1>
          {subtitle && <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-200/75 md:text-base">{subtitle}</p>}
        </div>
        <div className="mini-card rounded-[1.7rem] p-5 md:w-64">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-200">Approval Safe</p>
          <p className="mt-2 text-sm leading-6 text-slate-100/80">AI recommends. Authorized users approve final employment actions.</p>
        </div>
      </header>

      <section className="relative z-10">{children}</section>
    </main>
  );
}

export function MetricCard({ label, value, hint, tone = 'cyan' }: { label: string; value: string; hint: string; tone?: 'cyan' | 'violet' | 'rose' | 'lime' }) {
  const toneClass = {
    cyan: 'color-card-cyan',
    violet: 'color-card-violet',
    rose: 'color-card-rose',
    lime: 'color-card-lime',
  }[tone];

  return (
    <div className={`neo-surface ${toneClass} rounded-[1.7rem] p-5`}>
      <p className="text-xs font-black uppercase tracking-[0.18em] text-white/70">{label}</p>
      <p className="mt-3 text-4xl font-black text-white">{value}</p>
      <p className="mt-2 text-xs leading-5 text-white/65">{hint}</p>
    </div>
  );
}

export function StatusPill({ children, tone = 'cyan' }: { children: React.ReactNode; tone?: 'cyan' | 'emerald' | 'violet' | 'amber' | 'rose' }) {
  const classes = {
    cyan: 'bg-cyan-300/15 text-cyan-50 ring-cyan-200/20',
    emerald: 'bg-emerald-300/15 text-emerald-50 ring-emerald-200/20',
    violet: 'bg-violet-300/15 text-violet-50 ring-violet-200/20',
    amber: 'bg-amber-300/15 text-amber-50 ring-amber-200/20',
    rose: 'bg-rose-300/15 text-rose-50 ring-rose-200/20',
  }[tone];
  return <span className={`rounded-full px-3 py-1 text-xs font-black ring-1 ${classes}`}>{children}</span>;
}
