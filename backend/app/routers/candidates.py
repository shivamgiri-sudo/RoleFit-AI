from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from ..database import get_session
from ..models import Application, AssessmentQuestion, Candidate, JobRequisition, TalentPoolRecord
from ..schemas import CandidateApplyRequest
from ..ai_engine import eligibility_score

router = APIRouter(prefix="/candidates", tags=["candidates"])


@router.post("/apply/{job_id}")
def apply(job_id: int, payload: CandidateApplyRequest, session: Session = Depends(get_session)):
    job = session.get(JobRequisition, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    candidate = session.exec(
        select(Candidate).where(Candidate.organization_id == job.organization_id, Candidate.email == payload.email)
    ).first()
    if not candidate:
        candidate = Candidate(
            organization_id=job.organization_id,
            full_name=payload.full_name,
            email=str(payload.email),
            phone=payload.phone,
            location=payload.location,
            education=payload.education,
            years_experience=payload.years_experience,
            current_role=payload.current_role,
        )
        session.add(candidate)
        session.commit()
        session.refresh(candidate)

    duplicate_application = session.exec(
        select(Application).where(Application.job_id == job.id, Application.candidate_id == candidate.id)
    ).first()
    if duplicate_application:
        return {"application": duplicate_application, "duplicate": True, "message": "Candidate already applied for this role."}

    score = eligibility_score(job, candidate)
    application = Application(
        job_id=job.id,
        candidate_id=candidate.id,
        source=payload.source,
        eligibility_score=score,
        status="ASSESSMENT_PENDING" if score >= 45 else "LOW_ELIGIBILITY_PENDING_REVIEW",
    )
    session.add(application)
    session.commit()
    session.refresh(application)

    questions = session.exec(select(AssessmentQuestion).where(AssessmentQuestion.job_id == job.id)).all()
    return {"application": application, "candidate": candidate, "questions": questions}


@router.get("/application/{application_id}")
def get_application(application_id: int, session: Session = Depends(get_session)):
    app = session.get(Application, application_id)
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    candidate = session.get(Candidate, app.candidate_id)
    job = session.get(JobRequisition, app.job_id)
    return {"application": app, "candidate": candidate, "job": job}


@router.get("/talent-pool")
def talent_pool(session: Session = Depends(get_session)):
    return session.exec(select(TalentPoolRecord).order_by(TalentPoolRecord.created_at.desc())).all()
