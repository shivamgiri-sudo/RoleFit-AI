import { AppShell, StatusPill } from '../../components/AppShell';

const approvals = [
  ['Amit Sharma', 'Operations Manager', '88%', 'Strong evidence: ownership + client maturity', 'emerald'],
  ['Priya Nair', 'Quality Manager', '81%', 'Validate integrity scenario details', 'cyan'],
  ['Sara Khan', 'Recruiter', '61%', 'Low follow-up discipline evidence', 'amber'],
];

export default function ApprovalsPage() {
  return (
    <AppShell title="Approval Gate" subtitle="AI can recommend, but authorized users approve final actions with rationale and audit trail.">
      <section className="glass-panel rounded-[2rem] p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold">Pending Human Review</h2>
          <StatusPill tone="amber">126 Pending</StatusPill>
        </div>
        <div className="space-y-4">
          {approvals.map(([name, role, score, evidence, tone]) => (
            <div key={name} className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <h3 className="text-lg font-bold">{name}</h3>
                  <p className="mt-1 text-sm text-slate-400">{role} · Role Fit {score}</p>
                  <p className="mt-3 text-sm text-slate-300">{evidence}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <StatusPill tone={tone as any}>AI Review Ready</StatusPill>
                  <button className="rounded-xl bg-emerald-300 px-4 py-2 text-sm font-bold text-slate-950">Approve</button>
                  <button className="rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm font-bold text-white">Hold</button>
                  <button className="rounded-xl border border-rose-300/20 bg-rose-300/10 px-4 py-2 text-sm font-bold text-rose-100">Not Proceed</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
