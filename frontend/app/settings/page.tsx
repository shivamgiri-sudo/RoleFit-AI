import { AppShell, StatusPill } from '../../components/AppShell';

const settings = [
  ['Tenant Access', 'JWT, session timeout, branch access, role visibility'],
  ['AI Providers', 'OpenAI model, Deepgram model, retry policy, timeout'],
  ['Candidate Notice', 'Recording notice, AI usage notice, data retention'],
  ['Communication', 'Email templates, SMS provider, reminders'],
  ['Audit Trail', 'Decision logs, score logs, reviewer actions, exports'],
];

export default function SettingsPage() {
  return (
    <AppShell title="Settings" subtitle="Control tenant access, provider configuration, candidate notices, communication, and audit policies.">
      <section className="grid gap-4 md:grid-cols-2">
        {settings.map(([title, body]) => (
          <div key={title} className="glass-panel rounded-3xl p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-bold">{title}</h2>
              <StatusPill tone="violet">Config</StatusPill>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-400">{body}</p>
          </div>
        ))}
      </section>
    </AppShell>
  );
}
