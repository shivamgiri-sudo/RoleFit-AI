import { AppShell, StatusPill } from '../../components/AppShell';

const steps = [
  ['Company Profile', 'Company name, domain, timezone, branding'],
  ['Branches', 'Locations, departments, reporting hierarchy'],
  ['Roles & Permissions', 'Admin, HR, hiring manager, reviewer, candidate'],
  ['Provider Keys', 'Deepgram, OpenAI, email, storage, calendar'],
  ['Compliance', 'Consent text, retention, approval workflow'],
];

export default function SetupPage() {
  return (
    <AppShell title="Company Setup" subtitle="Configure a new SaaS tenant with branches, access rules, API providers, consent controls, and compliance defaults.">
      <section className="glass-panel rounded-[2rem] p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold">Onboarding Checklist</h2>
          <StatusPill tone="cyan">Tenant Setup</StatusPill>
        </div>
        <div className="grid gap-4 md:grid-cols-5">
          {steps.map(([title, body], index) => (
            <div key={title} className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
              <p className="text-sm font-bold text-cyan-200">0{index + 1}</p>
              <h3 className="mt-3 font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{body}</p>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
