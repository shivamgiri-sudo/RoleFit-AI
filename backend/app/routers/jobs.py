from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from ..database import get_session
from ..models import Organization, Branch, JobRequisition, RoleTraitBlueprint, AssessmentQuestion
from ..schemas import CreateRoleRequest
from ..ai_engine import choose_trait_template, build_questions

router = APIRouter(prefix="/jobs", tags=["jobs"])


@router.post("")
def create_job(payload: CreateRoleRequest, session: Session = Depends(get_session)):
    org = session.exec(select(Organization).where(Organization.name == payload.organization_name)).first()
    if not org:
        org = Organization(name=payload.organization_name)
        session.add(org)
        session.commit()
        session.refresh(org)

    branch = session.exec(
        select(Branch).where(Branch.organization_id == org.id, Branch.name == payload.branch_name)
    ).first()
    if not branch:
        branch = Branch(organization_id=org.id, name=payload.branch_name, city=payload.branch_city)
        session.add(branch)
        session.commit()
        session.refresh(branch)

    job = JobRequisition(
        organization_id=org.id,
        branch_id=branch.id,
        title=payload.title,
        department=payload.department,
        level=payload.level,
        education_required=payload.education_required,
        experience_min_years=payload.experience_min_years,
        mandatory_skills=payload.mandatory_skills,
        preferred_skills=payload.preferred_skills,
        role_expectations=payload.role_expectations,
        compensation_min=payload.compensation_min,
        compensation_max=payload.compensation_max,
    )
    session.add(job)
    session.commit()
    session.refresh(job)

    traits = choose_trait_template(job.title)
    for item in traits:
        session.add(RoleTraitBlueprint(
            job_id=job.id,
            trait=str(item["trait"]),
            weight=float(item["weight"]),
            evidence_required=str(item["evidence"]),
        ))

    for question in build_questions(job, traits):
        session.add(AssessmentQuestion(job_id=job.id, **question))

    session.commit()
    return {"job": job, "trait_blueprint": traits, "message": "Job, trait blueprint, and assessment generated."}


@router.get("")
def list_jobs(session: Session = Depends(get_session)):
    return session.exec(select(JobRequisition).order_by(JobRequisition.created_at.desc())).all()


@router.get("/{job_id}")
def get_job(job_id: int, session: Session = Depends(get_session)):
    job = session.get(JobRequisition, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job


@router.get("/{job_id}/blueprint")
def get_blueprint(job_id: int, session: Session = Depends(get_session)):
    return session.exec(select(RoleTraitBlueprint).where(RoleTraitBlueprint.job_id == job_id)).all()


@router.get("/{job_id}/assessment")
def get_assessment(job_id: int, session: Session = Depends(get_session)):
    return session.exec(select(AssessmentQuestion).where(AssessmentQuestion.job_id == job_id)).all()
