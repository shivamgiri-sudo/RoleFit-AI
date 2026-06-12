"use client";

import Link from 'next/link';

export default function VoiceInterviewPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-8 md:px-10">
      <div className="mb-8 flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-3">
          <div className="voice-orb h-10 w-10 rounded-2xl" />
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-200">RoleFit AI</p>
            <p className="text-xs text-slate-400">Interview Studio</p>
          </div>
        </Link>
        <Link href="/jobs" className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white">Hiring Cockpit</Link>
      </div>

      <section className="glass-panel rounded-[2rem] p-8 md:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-200">AI Voice Interview Concept</p>
        <h1 className="mt-4 max-w-4xl text-5xl font-black leading-tight md:text-7xl">Premium interview experience, built around evidence.</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
          This screen is the product shell for the voice interview journey. The backend API is ready for session creation and transcript review. The production UI should plug in an approved speech-to-text provider, capture consent, show questions, collect transcript, and send the transcript to the review API.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            ['1', 'Consent-first start', 'Explain recording, usage, retention, and review process before the interview starts.'],
            ['2', 'AI asks role questions', 'Questions come from the role trait blueprint and are read aloud by the interface.'],
            ['3', 'Transcript review', 'The backend reviews transcript content for role evidence and sends it to the approval workflow.'],
          ].map(([num, title, body]) => (
            <div key={num} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <p className="text-sm font-bold text-cyan-200">0{num}</p>
              <h2 className="mt-3 text-xl font-bold">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-400">{body}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 rounded-3xl border border-violet-300/20 bg-violet-300/10 p-6 text-sm leading-7 text-violet-50">
          Guardrail: the product must not judge face, accent, emotion, age, gender, caste, religion, disability, or unrelated personal background. Final action remains approval-gated.
        </div>
      </section>
    </main>
  );
}
