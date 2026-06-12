import Link from 'next/link';

const cards = [
  ['Trait Intelligence', 'Role-specific workplace trait blueprints with evidence-based scoring.'],
  ['Assessment Flow', 'Scenario questions, role alignment, skill fit, and structured candidate responses.'],
  ['Approval Guardrail', 'AI recommendations are routed to authorized human approval with audit logs.'],
  ['Talent Pool', 'Moderate-fit candidates are preserved for future opportunities.'],
];

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl p-8">
      <section className="rounded-3xl bg-slate-950 p-10 text-white shadow-xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">RoleFit AI</p>
        <h1 className="max-w-3xl text-4xl font-bold leading-tight md:text-6xl">AI-assisted hiring with role-specific trait intelligence.</h1>
        <p className="mt-5 max-w-3xl text-lg text-slate-300">Create roles, generate trait blueprints, assess candidates through scenarios, calculate role-fit scores, and route final decisions through an auditable approval gate.</p>
        <div className="mt-8 flex gap-3">
          <Link href="/jobs" className="rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950">Open MVP Demo</Link>
          <a href="http://localhost:8000/docs" className="rounded-xl border border-white/20 px-5 py-3 font-semibold text-white">API Docs</a>
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-4">
        {cards.map(([title, body]) => (
          <div key={title} className="rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="font-bold">{title}</h2>
            <p className="mt-2 text-sm text-slate-600">{body}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
