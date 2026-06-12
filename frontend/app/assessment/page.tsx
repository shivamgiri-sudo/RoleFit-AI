import { AppShell, StatusPill } from '../../components/AppShell';

const traits = [
  ['Ownership', '15%', 'SLA miss recovery scenario'],
  ['Execution Discipline', '15%', 'Daily review rhythm simulation'],
  ['Problem Solving', '15%', 'Root cause case study'],
  ['People Leadership', '12%', 'Underperformance coaching case'],
  ['Integrity', '10%', 'Data manipulation red-flag case'],
];

export default function AssessmentPage() {
  return (
    <AppShell title="Assessment Builder" subtitle="Create role-specific assessments using skill tests, scenario questions, trait rubrics, and interview validation prompts.">
      <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="glass-panel rounded-[2rem] p-6">
          <h2 className="text-xl font-bold">Role Blueprint</h2>
          <div className="mt-5 rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-sm text-slate-400">Selected Role</p>
            <h3 className="mt-2 text-2xl font-black">Operations Manager</h3>
            <p className="mt-3 text-sm leading-6 text-slate-400">Focus: SLA ownership, team leadership, reporting accuracy, client escalation, recovery planning.</p>
          </div>
          <button className="mt-5 w-full rounded-2xl bg-cyan-300 px-5 py-3 font-bold text-slate-950">Generate Assessment</button>
        </div>
        <div className="glass-panel rounded-[2rem] p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold">Trait Question Plan</h2>
            <StatusPill tone="emerald">Evidence Based</StatusPill>
          </div>
          <div className="space-y-3">
            {traits.map(([trait, weight, caseName]) => (
              <div key={trait} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <div className="flex justify-between gap-3">
                  <p className="font-bold">{trait}</p>
                  <span className="text-sm font-bold text-cyan-200">{weight}</span>
                </div>
                <p className="mt-2 text-sm text-slate-400">{caseName}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
