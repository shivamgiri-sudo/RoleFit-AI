import { AppShell, MetricCard, StatusPill } from '../../components/AppShell';

const funnel = [
  ['Applied', '1,284', '100%'],
  ['Eligible', '842', '65.5%'],
  ['Assessment Done', '619', '48.2%'],
  ['Voice Reviewed', '388', '30.2%'],
  ['Approval Ready', '126', '9.8%'],
];

const risks = [
  ['Low role alignment', '38 candidates', 'amber'],
  ['Weak ownership evidence', '21 candidates', 'rose'],
  ['Strong trait fit', '96 candidates', 'emerald'],
];

export default function DashboardPage() {
  return (
    <AppShell title="AI Hiring Command Center" subtitle="One cockpit to monitor roles, candidates, assessments, interviews, approvals, and talent-pool movement.">
      <section className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Active Roles" value="18" hint="Across 4 branches and 7 departments" />
        <MetricCard label="Applications" value="1,284" hint="MTD candidate applications" />
        <MetricCard label="Avg Fit Score" value="78%" hint="Eligibility + skill + trait + alignment" />
        <MetricCard label="Pending Approval" value="126" hint="AI-reviewed cases waiting for human action" />
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="glass-panel rounded-[2rem] p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold">Hiring Funnel</h2>
            <StatusPill tone="cyan">Live</StatusPill>
          </div>
          <div className="space-y-4">
            {funnel.map(([stage, count, pct]) => (
              <div key={stage}>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-slate-300">{stage}</span>
                  <span className="font-bold text-cyan-200">{count} · {pct}</span>
                </div>
                <div className="h-3 rounded-full bg-white/10">
                  <div className="h-3 rounded-full bg-gradient-to-r from-cyan-300 to-violet-400" style={{ width: pct }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel rounded-[2rem] p-6">
          <h2 className="text-xl font-bold">AI Signal Board</h2>
          <div className="mt-5 space-y-3">
            {risks.map(([title, count, tone]) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{title}</p>
                  <StatusPill tone={tone as any}>{count}</StatusPill>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-2xl border border-violet-300/20 bg-violet-300/10 p-4 text-sm leading-6 text-violet-50">
            System insight: Operations Manager pipeline has high experience fit, but people-leadership evidence needs deeper interview validation.
          </div>
        </div>
      </section>
    </AppShell>
  );
}
