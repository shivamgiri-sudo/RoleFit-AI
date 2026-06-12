from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlmodel import Session, select

from ..database import get_session
from ..models import (
    Application,
    Candidate,
    JobRequisition,
    RoleTraitBlueprint,
    VoiceInterviewSession,
    VoiceInterviewTurn,
)

router = APIRouter(prefix="/voice-interviews", tags=["voice-interviews"])


class CreateVoiceInterviewRequest(BaseModel):
    application_id: int
    consent_captured: bool = True


class SubmitVoiceInterviewRequest(BaseModel):
    transcript: str = Field(min_length=40)
    answer_chunks: Optional[List[str]] = None


CONTENT_SIGNALS = {
    "ownership": ["own", "responsibility", "accountable", "closure", "follow up", "follow-up"],
    "execution": ["plan", "tracker", "review", "priority", "timeline", "daily", "rhythm"],
    "problem_solving": ["root cause", "data", "analysis", "why", "pattern", "prevent"],
    "client_maturity": ["client", "transparent", "communicate", "escalation", "commitment"],
    "people_leadership": ["coach", "team", "leader", "agent", "feedback", "performance"],
    "integrity": ["honest", "correct", "accurate", "compliance", "policy", "truth"],
}

RISK_SIGNALS = ["hide", "fake", "manipulate", "adjust data", "blame", "ignore", "not my responsibility"]

PROTECTED_ATTRIBUTE_TERMS = [
    "age",
    "gender",
    "religion",
    "caste",
    "race",
    "disability",
    "marital",
    "pregnancy",
    "appearance",
    "accent",
]


def build_voice_questions(job: JobRequisition, traits: List[RoleTraitBlueprint]) -> List[str]:
    ranked = sorted(traits, key=lambda item: item.weight, reverse=True)[:5]
    questions = [
        f"Welcome to your RoleFit AI voice interview for {job.title}. Please answer with real examples and specific actions.",
        f"How do you see yourself contributing in this {job.title} role during the first 90 days?",
    ]
    for trait in ranked:
        questions.append(
            f"Tell me about a realistic situation where {trait.trait} was tested. What happened, what did you personally do, and what was the measurable result?"
        )
    questions.append("Share one work situation where you failed or missed an outcome. What did you learn and what control did you create after that?")
    return questions


def evaluate_voice_transcript(transcript: str) -> dict:
    text = transcript.lower()
    matched = {}
    for category, signals in CONTENT_SIGNALS.items():
        matched[category] = [signal for signal in signals if signal in text]

    total_signal_count = sum(len(set(values)) for values in matched.values())
    risk_hits = [signal for signal in RISK_SIGNALS if signal in text]
    protected_hits = [term for term in PROTECTED_ATTRIBUTE_TERMS if term in text]

    word_count = len(transcript.split())
    base_score = 45
    signal_score = min(total_signal_count * 4, 38)
    depth_bonus = 10 if word_count >= 180 else 5 if word_count >= 90 else 0
    risk_penalty = min(len(risk_hits) * 8, 24)

    final_score = max(0, min(round(base_score + signal_score + depth_bonus - risk_penalty, 2), 100))
    trait_signal_score = max(0, min(round(35 + signal_score - risk_penalty, 2), 100))
    role_alignment_score = max(0, min(round(40 + (10 if "first 90" in text or "90 days" in text else 0) + depth_bonus + min(total_signal_count * 2, 28), 2), 100))

    evidence = []
    for category, signals in matched.items():
        if signals:
            evidence.append(f"{category.replace('_', ' ').title()}: " + ", ".join(sorted(set(signals))))
    if not evidence:
        evidence.append("Limited job-relevant evidence found in transcript content.")

    risks = [f"Potential risk signal: {risk}" for risk in risk_hits]
    if protected_hits:
        risks.append("Protected-attribute terms were mentioned and intentionally ignored for scoring.")
    if word_count < 80:
        risks.append("Transcript is short; confidence is reduced due to limited evidence depth.")

    if final_score >= 82:
        recommendation = "STRONG_VOICE_SIGNAL_REVIEW_RECOMMENDED"
    elif final_score >= 68:
        recommendation = "GOOD_VOICE_SIGNAL_REVIEW_RECOMMENDED"
    elif final_score >= 52:
        recommendation = "MIXED_SIGNAL_MANUAL_REVIEW_REQUIRED"
    else:
        recommendation = "LOW_SIGNAL_MANUAL_REVIEW_REQUIRED"

    return {
        "content_score": final_score,
        "trait_signal_score": trait_signal_score,
        "role_alignment_score": role_alignment_score,
        "evidence_summary": " | ".join(evidence),
        "risk_flags": " | ".join(risks) if risks else "No major content risk flags found.",
        "recommendation": recommendation,
    }


@router.post("/sessions")
def create_session(payload: CreateVoiceInterviewRequest, session: Session = Depends(get_session)):
    application = session.get(Application, payload.application_id)
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    job = session.get(JobRequisition, application.job_id)
    candidate = session.get(Candidate, application.candidate_id)
    if not job or not candidate:
        raise HTTPException(status_code=404, detail="Linked job or candidate not found")

    traits = session.exec(select(RoleTraitBlueprint).where(RoleTraitBlueprint.job_id == job.id)).all()
    questions = build_voice_questions(job, traits)

    voice_session = VoiceInterviewSession(
        application_id=application.id,
        consent_captured=payload.consent_captured,
        conversation_plan=" || ".join(questions),
    )
    session.add(voice_session)
    session.commit()
    session.refresh(voice_session)

    for question in questions:
        session.add(VoiceInterviewTurn(session_id=voice_session.id, speaker="AI_INTERVIEWER", message=question))
    session.commit()

    return {
        "session": voice_session,
        "candidate": candidate,
        "job": job,
        "questions": questions,
        "guardrail": "Evaluation uses transcript content only. Do not score accent, tone, emotion, face, age, gender, caste, religion, disability, or unrelated personal background.",
    }


@router.post("/{session_id}/submit")
def submit_voice_interview(session_id: int, payload: SubmitVoiceInterviewRequest, session: Session = Depends(get_session)):
    voice_session = session.get(VoiceInterviewSession, session_id)
    if not voice_session:
        raise HTTPException(status_code=404, detail="Voice interview session not found")

    result = evaluate_voice_transcript(payload.transcript)
    voice_session.status = "COMPLETED_PENDING_REVIEW"
    voice_session.transcript = payload.transcript
    voice_session.content_score = result["content_score"]
    voice_session.trait_signal_score = result["trait_signal_score"]
    voice_session.role_alignment_score = result["role_alignment_score"]
    voice_session.evidence_summary = result["evidence_summary"]
    voice_session.risk_flags = result["risk_flags"]
    voice_session.recommendation = result["recommendation"]
    voice_session.completed_at = datetime.utcnow()

    session.add(VoiceInterviewTurn(session_id=voice_session.id, speaker="CANDIDATE", message=payload.transcript))
    session.add(voice_session)
    session.commit()
    session.refresh(voice_session)
    return {"session": voice_session, "evaluation": result}


@router.get("/{session_id}")
def get_voice_interview(session_id: int, session: Session = Depends(get_session)):
    voice_session = session.get(VoiceInterviewSession, session_id)
    if not voice_session:
        raise HTTPException(status_code=404, detail="Voice interview session not found")
    turns = session.exec(select(VoiceInterviewTurn).where(VoiceInterviewTurn.session_id == session_id)).all()
    return {"session": voice_session, "turns": turns}
