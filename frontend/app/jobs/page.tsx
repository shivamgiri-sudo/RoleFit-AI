"use client";

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
    setMessage('Creating Operations Manager role...');
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
    setMessage('Demo role created with trait blueprint and assessment questions.');
    await load();
  }

  useEffect(() => { load(); }, []);

  return (
    <main className="mx-auto max-w-6xl p-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold">RoleFit AI MVP Demo</h1>
          <p className="mt-2 text-slate-600">Create a role and inspect the generated hiring intelligence flow from the API.</p>
        </div>
        <button onClick={createDemoRole} className="rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white">Create Operations Manager Demo Role</button>
      </div>

      {message && <p className="mt-4 rounded-xl bg-cyan-50 p-4 text-sm text-cyan-900">{message}</p>}

      {dashboard && (
        <section className="mt-6 grid gap-4 md:grid-cols-5">
          {[
            ['Active Jobs', dashboard.active_jobs],
            ['Candidates', dashboard.candidates],
            ['Applications', dashboard.applications],
            ['Talent Pool', dashboard.talent_pool],
            ['Avg Role Fit', dashboard.average_role_fit_score],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">{label}</p>
              <p className="mt-2 text-3xl font-bold">{value}</p>
            </div>
          ))}
        </section>
      )}

      <section className="mt-8 rounded-2xl border bg-white shadow-sm">
        <div className="border-b p-5">
          <h2 className="font-bold">Jobs</h2>
        </div>
        <div className="divide-y">
          {jobs.length === 0 ? <p className="p-5 text-slate-500">No jobs yet. Create the demo role.</p> : jobs.map((job) => (
            <div key={job.id} className="flex items-center justify-between p-5">
              <div>
                <h3 className="font-semibold">{job.title}</h3>
                <p className="text-sm text-slate-500">{job.department} · Min Exp {job.experience_min_years} yrs · {job.status}</p>
              </div>
              <div className="flex gap-2 text-sm">
                <a className="rounded-lg border px-3 py-2" href={`http://localhost:8000/jobs/${job.id}/blueprint`} target="_blank">Blueprint</a>
                <a className="rounded-lg border px-3 py-2" href={`http://localhost:8000/jobs/${job.id}/assessment`} target="_blank">Assessment</a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
