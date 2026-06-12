import { AppShell, StatusPill } from '../../components/AppShell';

const candidates = [
  ['Amit Sharma', 'Operations Manager', '86%', 'Strong Fit', 'Noida', 'emerald'],
  ['Priya Nair', 'Quality Manager', '79%', 'Review Ready', 'Bengaluru', 'cyan'],
  ['Rahul Verma', 'Sales TL', '66%', 'Talent Pool', 'Delhi NCR', 'violet'],
  ['Sara Khan', 'Recruiter', '58%', 'Manual Review', 'Mumbai', 'amber'],
];

export default function CandidatesPage() {
  return (
    <AppShell title="Candidate Intelligence" subtitle="Search, compare, and review candidates by skills, traits, role alignment, transcript evidence, and approval status.">
      <section className="glass-panel rounded-[2rem] p-6">
        <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <div>
            <h2 className="text-xl font-bold">Candidate Directory</h2>
            <p className="mt-1 text-sm text-slate-400">Every profile is searchable by role-fit signal and evidence.</p>
          </div>
          <button className="rounded-2xl bg-cyan-300 px-5 py-3 font-bold text-slate-950">Import Candidates</button>
        </div>
        <div className="overflow-hidden rounded-3xl border border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/[0.06] text-slate-300">
              <tr>
                <th className="p-4">Candidate</th>
                <th className="p-4">Best Role</th>
                <th className="p-4">Fit Score</th>
                <th className="p-4">Status</th>
                <th className="p-4">Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {candidates.map(([name, role, score, status, location, tone]) => (
                <tr key={name} className="bg-slate-950/30">
                  <td className="p-4 font-bold">{name}</td>
                  <td className="p-4 text-slate-300">{role}</td>
                  <td className="p-4 text-cyan-200 font-bold">{score}</td>
                  <td className="p-4"><StatusPill tone={tone as any}>{status}</StatusPill></td>
                  <td className="p-4 text-slate-400">{location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AppShell>
  );
}
