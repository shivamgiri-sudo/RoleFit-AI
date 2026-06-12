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
from ..services.interview_ai_service import InterviewAIProviderError, evaluate_interview_with_openai
from ..services.provider_config import get_provider_config

router = APIRouter(prefix="/voice-interviews", tags=["voice-interviews"])


class CreateVoiceInterviewRequest(BaseModel):
    application_id: int
    consent_captured: bool = True


class SubmitVoiceInterviewRequest(BaseModel):
    transcript: str = Field(min_length=40)
    answer_chunks: Optional[List[str]] = None


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
async def submit_voice_interview(session_id: int, payload: SubmitVoiceInterviewRequest, session: Session = Depends(get_session)):
    voice_session = session.get(VoiceInterviewSession, session_id)
    if not voice_session:
        raise HTTPException(status_code=404, detail="Voice interview session not found")

    application = session.get(Application, voice_session.application_id)
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    job = session.get(JobRequisition, application.job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    traits = session.exec(select(RoleTraitBlueprint).where(RoleTraitBlueprint.job_id == job.id)).all()
    trait_blueprint = [
        {"trait": trait.trait, "weight": trait.weight, "evidence_required": trait.evidence_required}
        for trait in traits
    ]

    config = get_provider_config()
    if config.ai_provider != "openai":
        raise HTTPException(status_code=400, detail="Only OpenAI interview evaluation is implemented in this build. Set AI_PROVIDER=openai.")

    try:
        result = await evaluate_interview_with_openai(
            transcript=payload.transcript,
            job_title=job.title,
            role_expectations=job.role_expectations,
            trait_blueprint=trait_blueprint,
            api_key=config.openai_api_key,
            model=config.ai_model,
        )
    except InterviewAIProviderError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc

    voice_session.status = "COMPLETED_PENDING_REVIEW"
    voice_session.transcript = payload.transcript
    voice_session.content_score = result.content_score
    voice_session.trait_signal_score = result.trait_signal_score
    voice_session.role_alignment_score = result.role_alignment_score
    voice_session.evidence_summary = result.evidence_summary
    voice_session.risk_flags = result.risk_flags
    voice_session.recommendation = result.recommendation
    voice_session.model_version = result.model
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
