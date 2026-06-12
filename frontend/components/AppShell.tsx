import Link from 'next/link';

const navItems = [
  ['Dashboard', '/dashboard'],
  ['Jobs', '/jobs'],
  ['Candidates', '/candidates'],
  ['Applications', '/applications'],
  ['Assessment', '/assessment'],
  ['Interview Studio', '/voice-interview'],
  ['Approvals', '/approvals'],
  ['Talent Pool', '/talent-pool'],
  ['Analytics', '/analytics'],
  ['Settings', '/settings'],
];

export function AppShell({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle?: string }) {
  return (
    <main className="mx-auto flex min-h-screen max-w-7xl gap-6 px-6 py-8 md:px-10">
      <aside className="hidden w-72 shrink-0 lg:block">
        <div className="glass-panel sticky top-8 rounded-[2rem] p-5">
          <Link href="/" className="mb-8 flex items-center gap-3">
            <div className="voice-orb h-11 w-11 rounded-2xl" />
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-200">RoleFit</p>
              <p className="text-xs text-slate-400">AI Hiring OS</p>
            </div>
          </Link>
          <nav className="space-y-2">
            {navItems.map(([label, href]) => (
              <Link key={href} href={href} className="block rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-slate-300 transition hover:border-cyan-300/30 hover:bg-cyan-300/10 hover:text-cyan-100">
                {label}
              </Link>
            ))}
          </nav>
          <div className="mt-8 rounded-3xl border border-emerald-300/20 bg-emerald-300/10 p-4 text-sm text-emerald-50">
            <p className="font-bold">Approval Safe</p>
            <p className="mt-2 text-xs leading-5 text-emerald-100/80">AI recommends. Authorized users approve final employment actions.</p>
          </div>
        </div>
      </aside>
      <section className="min-w-0 flex-1">
        <header className="mb-6 rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-200">RoleFit AI</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-white md:text-5xl">{title}</h1>
          {subtitle && <p className="mt-3 max-w-3xl text-slate-400">{subtitle}</p>}
        </header>
        {children}
      </section>
    </main>
  );
}

export function MetricCard({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-950/50 p-5 shadow-2xl shadow-black/20">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 text-4xl font-black text-white">{value}</p>
      <p className="mt-2 text-xs leading-5 text-slate-500">{hint}</p>
    </div>
  );
}

export function StatusPill({ children, tone = 'cyan' }: { children: React.ReactNode; tone?: 'cyan' | 'emerald' | 'violet' | 'amber' | 'rose' }) {
  const classes = {
    cyan: 'border-cyan-300/20 bg-cyan-300/10 text-cyan-100',
    emerald: 'border-emerald-300/20 bg-emerald-300/10 text-emerald-100',
    violet: 'border-violet-300/20 bg-violet-300/10 text-violet-100',
    amber: 'border-amber-300/20 bg-amber-300/10 text-amber-100',
    rose: 'border-rose-300/20 bg-rose-300/10 text-rose-100',
  }[tone];
  return <span className={`rounded-full border px-3 py-1 text-xs font-bold ${classes}`}>{children}</span>;
}
