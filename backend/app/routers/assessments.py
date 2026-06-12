from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from ..database import get_session
from ..models import Application, AssessmentQuestion, CandidateAnswer, DecisionLog, TalentPoolRecord
from ..schemas import SubmitAssessmentRequest, HumanDecisionRequest
from ..ai_engine import evaluate_answer, score_to_percent, final_role_fit_score, recommendation_from_score

router = APIRouter(prefix="/assessments", tags=["assessments"])


@router.post("/{application_id}/submit")
def submit_assessment(application_id: int, payload: SubmitAssessmentRequest, session: Session = Depends(get_session)):
    application = session.get(Application, application_id)
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    trait_scores = []
    alignment_scores = []
    answer_results = []

    for incoming in payload.answers:
        question = session.get(AssessmentQuestion, incoming.question_id)
        if not question or question.job_id != application.job_id:
            raise HTTPException(status_code=400, detail=f"Invalid question_id {incoming.question_id}")

        result = evaluate_answer(question, incoming.answer_text)
        answer = CandidateAnswer(
            application_id=application.id,
            question_id=question.id,
            answer_text=incoming.answer_text,
            score=result.score,
            evidence=" | ".join(result.evidence),
            risk_flags=" | ".join(result.risk_flags),
            confidence=result.confidence,
        )
        session.add(answer)
        answer_results.append({"question_id": question.id, "trait": question.trait, "score": result.score, "evidence": result.evidence, "risk_flags": result.risk_flags})

        if question.question_type == "ROLE_ALIGNMENT":
            alignment_scores.append(result.score)
        else:
            trait_scores.append(result.score)

    trait_percent = score_to_percent(sum(trait_scores) / len(trait_scores)) if trait_scores else 0
    alignment_percent = score_to_percent(sum(alignment_scores) / len(alignment_scores)) if alignment_scores else 0
    skill_percent = round((trait_percent * 0.35) + (application.eligibility_score * 0.65), 2)
    final_score = final_role_fit_score(application.eligibility_score, skill_percent, trait_percent, alignment_percent)
    recommendation = recommendation_from_score(final_score)

    application.trait_score = trait_percent
    application.role_alignment_score = alignment_percent
    application.skill_score = skill_percent
    application.role_fit_score = final_score
    application.ai_recommendation = recommendation
    application.status = "AI_EVALUATED_PENDING_HUMAN_APPROVAL" if "REQUIRES_HUMAN_APPROVAL" in recommendation else recommendation
    application.approval_status = "PENDING_HUMAN_REVIEW"

    if recommendation == "TALENT_POOL_RECOMMENDED":
        session.add(TalentPoolRecord(
            organization_id=1,
            candidate_id=application.candidate_id,
            suggested_roles="Related future role",
            tags="conditional-fit, future-opportunity",
            notes="AI recommended talent pool based on moderate role-fit score.",
        ))

    session.add(application)
    session.commit()
    session.refresh(application)
    return {"application": application, "answer_results": answer_results}


@router.post("/{application_id}/decision")
def human_decision(application_id: int, payload: HumanDecisionRequest, session: Session = Depends(get_session)):
    application = session.get(Application, application_id)
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    application.approval_status = payload.decision
    application.status = f"HUMAN_{payload.decision}"
    session.add(DecisionLog(
        application_id=application.id,
        decision=payload.decision,
        decided_by=payload.decided_by,
        rationale=payload.rationale,
    ))
    session.add(application)
    session.commit()
    session.refresh(application)
    return {"application": application, "message": "Decision recorded with audit trail."}


@router.get("/{application_id}/answers")
def answers(application_id: int, session: Session = Depends(get_session)):
    return session.exec(select(CandidateAnswer).where(CandidateAnswer.application_id == application_id)).all()
