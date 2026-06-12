import Link from 'next/link';

const questions = ['Education and experience', 'Role-specific skills', 'Trait scenarios', 'Role alignment', 'Consent and notices'];

export default function CareerPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-8 md:px-10">
      <section className="glass-panel rounded-[2rem] p-8 md:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-200">Careers</p>
        <h1 className="mt-4 max-w-4xl text-5xl font-black leading-tight md:text-7xl">Operations Manager</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">Apply through a structured experience that captures skills, experience, role understanding, and workplace trait evidence.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-5">
          {questions.map((item, index) => (
            <div key={item} className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
              <p className="text-sm font-bold text-cyan-200">0{index + 1}</p>
              <p className="mt-3 text-sm font-semibold text-slate-200">{item}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="mt-6 grid gap-6 md:grid-cols-[0.8fr_1.2fr]">
        <div className="glass-panel rounded-[2rem] p-6">
          <h2 className="text-xl font-bold">Role Highlights</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-300">
            <li>Own SLA, quality, productivity, and escalation recovery.</li>
            <li>Coach team leaders and improve daily execution rhythm.</li>
            <li>Build data-backed root cause and prevention controls.</li>
          </ul>
        </div>
        <div className="glass-panel rounded-[2rem] p-6">
          <h2 className="text-xl font-bold">Candidate Application</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {['Full name', 'Email', 'Phone', 'Location', 'Current role', 'Years of experience'].map((field) => (
              <input key={field} placeholder={field} className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 outline-none" />
            ))}
          </div>
          <textarea placeholder="How do you see yourself in this position?" className="mt-4 w-full rounded-2xl border border-white/10 bg-white/10 p-4 outline-none" rows={5} />
          <Link href="/assessment" className="mt-4 block rounded-2xl bg-cyan-300 px-5 py-3 text-center font-black text-slate-950">Start Assessment</Link>
        </div>
      </section>
    </main>
  );
}
