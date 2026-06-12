import { AppShell, MetricCard, StatusPill } from '../../components/AppShell';

const insights = [
  ['Source Quality', 'Referral candidates show 18% higher trait fit than portal candidates.'],
  ['Drop-off Risk', 'Voice interview completion drops after 7 PM slots.'],
  ['Trait Pattern', 'Low execution discipline is the top rejection driver for Ops roles.'],
  ['Hiring Speed', 'Approval delay adds 1.8 days to average turnaround time.'],
];

export default function AnalyticsPage() {
  return (
    <AppShell title="Recruitment Intelligence" subtitle="Turn every hiring interaction into measurable learning: source quality, trait gaps, funnel leakage, approval delay, and role difficulty.">
      <section className="grid gap-4 md:grid-cols-4">
        <MetricCard label="TAT" value="4.2d" hint="Average role-to-approval cycle" />
        <MetricCard label="Source ROI" value="72%" hint="Best performing channel quality" />
        <MetricCard label="Trait Gap" value="31%" hint="Execution discipline gap in Ops roles" />
        <MetricCard label="Join Prediction" value="83%" hint="Model confidence after approval" />
      </section>
      <section className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="glass-panel rounded-[2rem] p-6">
          <h2 className="text-xl font-bold">Insight Feed</h2>
          <div className="mt-5 space-y-3">
            {insights.map(([title, body]) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p className="font-bold text-cyan-100">{title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">{body}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-panel rounded-[2rem] p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Trait vs Outcome</h2>
            <StatusPill tone="emerald">Learning</StatusPill>
          </div>
          <div className="mt-5 space-y-4">
            {[
              ['Ownership', 88],
              ['Integrity', 82],
              ['People Leadership', 71],
              ['Execution Discipline', 64],
            ].map(([label, value]) => (
              <div key={label as string}>
                <div className="mb-2 flex justify-between text-sm"><span>{label}</span><span className="text-cyan-200 font-bold">{value}%</span></div>
                <div className="h-3 rounded-full bg-white/10"><div className="h-3 rounded-full bg-gradient-to-r from-cyan-300 to-violet-400" style={{ width: `${value}%` }} /></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
