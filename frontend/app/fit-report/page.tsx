import { AppShell, StatusPill } from '../../components/AppShell';

const scoreRows = [
  ['Eligibility Fit', '84%', 'Graduate, relevant experience, location fit'],
  ['Skill Fit', '79%', 'SLA, reporting, client handling, RCA'],
  ['Trait Fit', '88%', 'Ownership, discipline, problem solving'],
  ['Role Alignment', '91%', 'Strong first 90-day clarity'],
  ['Interview Evidence', '83%', 'Transcript shows recovery planning and client maturity'],
];

export default function FitReportPage() {
  return (
    <AppShell title="Candidate Fit Report" subtitle="Evidence-backed scorecard for review, approval, hold, or talent-pool movement.">
      <section className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
        <div className="glass-panel rounded-[2rem] p-6">
          <p className="text-sm text-slate-400">Candidate</p>
          <h2 className="mt-2 text-3xl font-black">Amit Sharma</h2>
          <p className="mt-2 text-slate-400">Operations Manager · Noida · 6 years experience</p>
          <div className="mt-6 rounded-full border border-cyan-300/20 bg-cyan-300/10 p-6 text-center">
            <p className="text-sm text-cyan-100">Overall Role Fit</p>
            <p className="mt-2 text-6xl font-black text-white">86%</p>
          </div>
          <div className="mt-5 flex justify-center"><StatusPill tone="emerald">Review Recommended</StatusPill></div>
        </div>
        <div className="glass-panel rounded-[2rem] p-6">
          <h2 className="text-xl font-bold">Evidence Breakdown</h2>
          <div className="mt-5 space-y-4">
            {scoreRows.map(([label, score, evidence]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <div className="mb-2 flex justify-between text-sm"><span className="font-bold">{label}</span><span className="text-cyan-200 font-bold">{score}</span></div>
                <div className="h-2 rounded-full bg-white/10"><div className="h-2 rounded-full bg-gradient-to-r from-cyan-300 to-violet-400" style={{ width: score }} /></div>
                <p className="mt-3 text-sm text-slate-400">{evidence}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
