"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api } from '../../lib/api';

type Job = { id: number; title: string; department: string; status: string; experience_min_years: number };
type Dashboard = { active_jobs: number; candidates: number; applications: number; talent_pool: number; average_role_fit_score: number; status_counts: Record<string, number> };

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [message, setMessage] = useState('');

  async function load() {
    setJobs(await api<Job[]>('/jobs'));
    setDashboard(await api<Dashboard>('/dashboard/summary'));
  }

  async function createDemoRole() {
    setMessage('Creating Operations Manager role, trait blueprint and assessment...');
    await api('/jobs', {
      method: 'POST',
      body: JSON.stringify({
        organization_name: 'Demo Company',
        branch_name: 'Noida Branch',
        branch_city: 'Noida',
        title: 'Operations Manager',
        department: 'Operations',
        level: 'Manager',
        education_required: 'Graduate',
        experience_min_years: 5,
        mandatory_skills: 'SLA management, team leadership, client handling, reporting, root cause analysis',
        preferred_skills: 'BPO operations, quality governance, workforce coordination',
        role_expectations: 'Own daily operations, SLA, quality, productivity, people performance, client escalations, and improvement plans.',
        compensation_min: 600000,
        compensation_max: 900000,
      }),
    });
    setMessage('Done. The AI hiring cockpit has a new Operations Manager role ready.');
    await load();
  }

  useEffect(() => { load(); }, []);

  return (
    <main className="mx-auto max-w-7xl px-6 py-8 md:px-10">
      <div className="mb-8 flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-3">
          <div className="voice-orb h-10 w-10 rounded-2xl" />
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-200">RoleFit AI</p>
            <p className="text-xs text-slate-400">Hiring Cockpit</p>
          </div>
        </Link>
        <Link href="/voice-interview" className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white">AI Voice Interview</Link>
      </div>

      <section className="glass-panel rounded-[2rem] p-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-200">Command Center</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">Recruitment Intelligence Dashboard</h1>
            <p className="mt-3 max-w-2xl text-slate-400">Create a role, generate the trait blueprint, open assessment APIs, and send qualified candidates to the AI voice interview flow.</p>
          </div>
          <button onClick={createDemoRole} className="rounded-2xl bg-cyan-300 px-6 py-3 font-bold text-slate-950 shadow-lg shadow-cyan-950/30">Create Operations Manager Role</button>
        </div>

        {message && <p className="mt-5 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4 text-sm text-cyan-100">{message}</p>}

        {dashboard && (
          <section className="mt-7 grid gap-4 md:grid-cols-5">
            {[
              ['Active Jobs', dashboard.active_jobs, 'Open hiring mandates'],
              ['Candidates', dashboard.candidates, 'Unique profiles'],
              ['Applications', dashboard.applications, 'Role-linked applications'],
              ['Talent Pool', dashboard.talent_pool, 'Future-fit candidates'],
              ['Avg Fit', dashboard.average_role_fit_score, 'Role Fit Score'],
            ].map(([label, value, hint]) => (
              <div key={label as string} className="rounded-3xl border border-white/10 bg-slate-950/50 p-5">
                <p className="text-sm text-slate-400">{label}</p>
                <p className="mt-2 text-4xl font-black text-white">{value}</p>
                <p className="mt-2 text-xs text-slate-500">{hint}</p>
              </div>
            ))}
          </section>
        )}
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.38fr]">
        <div className="glass-panel rounded-[2rem] p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold">Role Pipeline</h2>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-300">Blueprint · Assessment · Voice Ready</span>
          </div>
          <div className="space-y-3">
            {jobs.length === 0 ? <p className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-slate-400">No jobs yet. Create the demo role to start.</p> : jobs.map((job) => (
              <div key={job.id} className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                  <div>
                    <h3 className="text-lg font-bold">{job.title}</h3>
                    <p className="mt-1 text-sm text-slate-400">{job.department} · Min Exp {job.experience_min_years} yrs · {job.status}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 text-sm">
                    <a className="rounded-xl border border-white/10 bg-white/10 px-4 py-2" href={`http://localhost:8000/jobs/${job.id}/blueprint`} target="_blank">Trait Blueprint</a>
                    <a className="rounded-xl border border-white/10 bg-white/10 px-4 py-2" href={`http://localhost:8000/jobs/${job.id}/assessment`} target="_blank">Assessment</a>
                    <Link className="rounded-xl bg-violet-400 px-4 py-2 font-bold text-slate-950" href="/voice-interview">Voice Interview</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="glass-panel rounded-[2rem] p-6">
          <h2 className="text-xl font-bold">Next Build Ideas</h2>
          <div className="mt-5 space-y-3 text-sm text-slate-300">
            {['Avatar interviewer with brand voice', 'Candidate emotion-safe transcription', 'Live fraud and impersonation checks', 'Calendar auto-slotting', 'Client-facing hiring war room'].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">{item}</div>
            ))}
          </div>
        </aside>
      </section>
    </main>
  );
}
