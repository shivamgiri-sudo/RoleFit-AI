import { AppShell, StatusPill } from '../../components/AppShell';

const pools = [
  ['Future Ops Leaders', '248 candidates', 'Ownership + execution discipline', 'emerald'],
  ['Sales Bench', '416 candidates', 'Resilience + persuasion signals', 'cyan'],
  ['Quality Analysts', '132 candidates', 'Integrity + detail orientation', 'violet'],
  ['Recruiter Pool', '89 candidates', 'Follow-up discipline + communication', 'amber'],
];

export default function TalentPoolPage() {
  return (
    <AppShell title="Talent Pool Intelligence" subtitle="Do not lose good candidates. Reuse previously assessed profiles by trait fit, role fit, location, experience, and availability.">
      <section className="grid gap-4 md:grid-cols-4">
        {pools.map(([name, count, signal, tone]) => (
          <div key={name} className="rounded-3xl border border-white/10 bg-slate-950/50 p-5">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-bold">{name}</h2>
              <StatusPill tone={tone as any}>{count}</StatusPill>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-400">{signal}</p>
          </div>
        ))}
      </section>
      <section className="mt-6 glass-panel rounded-[2rem] p-6">
        <h2 className="text-xl font-bold">AI Rediscovery Match</h2>
        <div className="mt-5 rounded-3xl border border-cyan-300/20 bg-cyan-300/10 p-5 text-cyan-50">
          New role: Operations Manager · System found 34 existing candidates with 75%+ fit and previous interview evidence.
        </div>
      </section>
    </AppShell>
  );
}
