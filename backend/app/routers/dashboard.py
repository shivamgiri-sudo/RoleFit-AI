from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from ..database import get_session
from ..models import Application, JobRequisition, Candidate, TalentPoolRecord

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/summary")
def summary(session: Session = Depends(get_session)):
    jobs = session.exec(select(JobRequisition)).all()
    candidates = session.exec(select(Candidate)).all()
    applications = session.exec(select(Application)).all()
    talent_pool = session.exec(select(TalentPoolRecord)).all()

    status_counts = {}
    for app in applications:
        status_counts[app.status] = status_counts.get(app.status, 0) + 1

    avg_role_fit = round(sum(app.role_fit_score for app in applications) / len(applications), 2) if applications else 0

    return {
        "active_jobs": len([job for job in jobs if job.status == "ACTIVE"]),
        "candidates": len(candidates),
        "applications": len(applications),
        "talent_pool": len(talent_pool),
        "average_role_fit_score": avg_role_fit,
        "status_counts": status_counts,
    }
