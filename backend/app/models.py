from datetime import datetime
from typing import Optional
from sqlmodel import Field, SQLModel


class Organization(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    domain: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Branch(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    organization_id: int = Field(foreign_key="organization.id", index=True)
    name: str
    city: Optional[str] = None


class JobRequisition(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    organization_id: int = Field(foreign_key="organization.id", index=True)
    branch_id: Optional[int] = Field(default=None, foreign_key="branch.id", index=True)
    title: str
    department: str
    level: str = "Mid"
    education_required: str
    experience_min_years: float = 0
    mandatory_skills: str
    preferred_skills: Optional[str] = None
    role_expectations: str
    compensation_min: Optional[float] = None
    compensation_max: Optional[float] = None
    status: str = "ACTIVE"
    created_at: datetime = Field(default_factory=datetime.utcnow)


class TraitMaster(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True, unique=True)
    definition: str


class RoleTraitBlueprint(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    job_id: int = Field(foreign_key="jobrequisition.id", index=True)
    trait: str
    weight: float
    evidence_required: str


class AssessmentQuestion(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    job_id: int = Field(foreign_key="jobrequisition.id", index=True)
    question_type: str
    trait: Optional[str] = None
    question: str
    expected_signals: str


class Candidate(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    organization_id: int = Field(foreign_key="organization.id", index=True)
    full_name: str
    email: str = Field(index=True)
    phone: str = Field(index=True)
    location: Optional[str] = None
    education: Optional[str] = None
    years_experience: float = 0
    current_role: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Application(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    job_id: int = Field(foreign_key="jobrequisition.id", index=True)
    candidate_id: int = Field(foreign_key="candidate.id", index=True)
    source: str = "Direct"
    status: str = "ASSESSMENT_PENDING"
    eligibility_score: float = 0
    skill_score: float = 0
    trait_score: float = 0
    role_alignment_score: float = 0
    role_fit_score: float = 0
    ai_recommendation: Optional[str] = None
    approval_status: str = "PENDING_HUMAN_REVIEW"
    created_at: datetime = Field(default_factory=datetime.utcnow)


class CandidateAnswer(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    application_id: int = Field(foreign_key="application.id", index=True)
    question_id: int = Field(foreign_key="assessmentquestion.id", index=True)
    answer_text: str
    score: float
    evidence: str
    risk_flags: str
    confidence: float = 0.75
    model_version: str = "mock-rolefit-v1"
    prompt_version: str = "trait-eval-v1"
    evaluated_at: datetime = Field(default_factory=datetime.utcnow)


class DecisionLog(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    application_id: int = Field(foreign_key="application.id", index=True)
    decision: str
    decided_by: str
    rationale: str
    created_at: datetime = Field(default_factory=datetime.utcnow)


class TalentPoolRecord(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    organization_id: int = Field(foreign_key="organization.id", index=True)
    candidate_id: int = Field(foreign_key="candidate.id", index=True)
    suggested_roles: str
    tags: str
    notes: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
