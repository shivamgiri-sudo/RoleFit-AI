import Link from 'next/link';

export default function LoginPage() {
  return (
    <main className="mx-auto grid min-h-screen max-w-7xl gap-6 px-6 py-8 md:grid-cols-[1fr_0.9fr] md:px-10">
      <section className="glass-panel flex flex-col justify-between rounded-[2rem] p-8 md:p-12">
        <div>
          <div className="voice-orb mb-8 h-14 w-14 rounded-3xl" />
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-200">RoleFit AI</p>
          <h1 className="mt-4 text-5xl font-black leading-tight md:text-7xl">Welcome back to your hiring OS.</h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">Monitor roles, candidates, AI interview evidence, approvals, talent pools, and recruitment intelligence from one secure workspace.</p>
        </div>
        <div className="mt-10 grid gap-3 md:grid-cols-3">
          {['Tenant Safe', 'Approval Gated', 'Voice Ready'].map((item) => <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm font-bold">{item}</div>)}
        </div>
      </section>
      <section className="glass-panel flex items-center rounded-[2rem] p-8">
        <div className="w-full">
          <h2 className="text-3xl font-black">Sign in</h2>
          <p className="mt-2 text-slate-400">Demo UI only. Backend auth/JWT is next production step.</p>
          <div className="mt-6 space-y-4">
            <input className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-4 outline-none" placeholder="Work email" />
            <input className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-4 outline-none" placeholder="Password" type="password" />
            <Link href="/dashboard" className="block rounded-2xl bg-cyan-300 px-5 py-4 text-center font-black text-slate-950">Enter Dashboard</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
