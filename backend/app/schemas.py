from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field


class CreateRoleRequest(BaseModel):
    organization_name: str = "Demo Company"
    branch_name: str = "Head Office"
    branch_city: Optional[str] = None
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


class CandidateApplyRequest(BaseModel):
    full_name: str
    email: EmailStr
    phone: str
    location: Optional[str] = None
    education: Optional[str] = None
    years_experience: float = 0
    current_role: Optional[str] = None
    source: str = "Direct"


class AssessmentAnswerIn(BaseModel):
    question_id: int
    answer_text: str = Field(min_length=10)


class SubmitAssessmentRequest(BaseModel):
    answers: List[AssessmentAnswerIn]


class HumanDecisionRequest(BaseModel):
    decision: str = Field(pattern="^(APPROVED|REJECTED|ON_HOLD|TALENT_POOL)$")
    decided_by: str
    rationale: str
