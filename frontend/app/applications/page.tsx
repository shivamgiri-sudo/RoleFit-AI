import { AppShell, StatusPill } from '../../components/AppShell';

const stages = [
  ['New', '214', 'Candidate submitted form'],
  ['Eligibility', '176', 'Rules and duplicate check'],
  ['Assessment', '132', 'Skill + trait questionnaire'],
  ['Interview Studio', '84', 'Transcript/evidence review'],
  ['Approval Gate', '37', 'Authorized final action'],
];

export default function ApplicationsPage() {
  return (
    <AppShell title="Application Pipeline" subtitle="Track every candidate from apply to assessment, voice review, approval, talent pool, or onboarding trigger.">
      <section className="grid gap-4 md:grid-cols-5">
        {stages.map(([stage, count, hint]) => (
          <div key={stage} className="rounded-3xl border border-white/10 bg-slate-950/50 p-5">
            <p className="text-sm text-slate-400">{stage}</p>
            <p className="mt-2 text-4xl font-black text-white">{count}</p>
            <p className="mt-2 text-xs leading-5 text-slate-500">{hint}</p>
          </div>
        ))}
      </section>
      <section className="mt-6 glass-panel rounded-[2rem] p-6">
        <h2 className="text-xl font-bold">Live Application Queue</h2>
        <div className="mt-5 grid gap-3">
          {['Amit Sharma · Operations Manager · Strong Fit', 'Priya Nair · Quality Manager · Interview Review', 'Rahul Verma · Sales TL · Talent Pool Suggestion'].map((row, index) => (
            <div key={row} className="flex flex-col justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 md:flex-row md:items-center">
              <p className="font-semibold">{row}</p>
              <StatusPill tone={index === 0 ? 'emerald' : index === 1 ? 'cyan' : 'violet'}>{index === 0 ? 'Approval Ready' : index === 1 ? 'Voice Pending' : 'Future Fit'}</StatusPill>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
