from __future__ import annotations
from dataclasses import dataclass
from typing import Dict, List
from .models import JobRequisition, Candidate, AssessmentQuestion


PROTECTED_ATTRIBUTE_TERMS = {
    "age", "gender", "religion", "caste", "race", "disability", "marital",
    "pregnancy", "political", "appearance", "accent", "native language"
}


TRAIT_LIBRARY: Dict[str, List[Dict[str, object]]] = {
    "operations manager": [
        {"trait": "Ownership", "weight": 15, "evidence": "Owns SLA, quality, productivity, staffing, and recovery plans."},
        {"trait": "Execution Discipline", "weight": 15, "evidence": "Runs daily review rhythm, trackers, escalations, and closure governance."},
        {"trait": "Problem Solving", "weight": 15, "evidence": "Uses data, root cause analysis, and prevention controls."},
        {"trait": "People Leadership", "weight": 12, "evidence": "Coaches TLs/agents, handles conflict, attrition, and performance improvement."},
        {"trait": "Accountability", "weight": 12, "evidence": "Accepts responsibility without blame and creates corrective action."},
        {"trait": "Client Centricity", "weight": 10, "evidence": "Handles client escalations transparently with recovery commitments."},
        {"trait": "Integrity", "weight": 10, "evidence": "Refuses data manipulation and protects compliance."},
        {"trait": "Adaptability", "weight": 6, "evidence": "Handles volume spikes, process change, and ambiguity."},
        {"trait": "Role Alignment", "weight": 5, "evidence": "Understands the actual responsibility of the operations manager role."},
    ],
    "sales": [
        {"trait": "Resilience", "weight": 18, "evidence": "Handles rejection and keeps structured follow-up."},
        {"trait": "Ownership", "weight": 16, "evidence": "Takes responsibility for conversion and pipeline hygiene."},
        {"trait": "Discipline", "weight": 14, "evidence": "Maintains calling, CRM, and follow-up consistency."},
        {"trait": "Customer Centricity", "weight": 12, "evidence": "Understands customer needs before pitching."},
        {"trait": "Persuasion", "weight": 12, "evidence": "Influences ethically with facts and benefits."},
    ],
    "default": [
        {"trait": "Ownership", "weight": 15, "evidence": "Takes responsibility for assigned outcomes."},
        {"trait": "Accountability", "weight": 15, "evidence": "Accepts results and closes corrective actions."},
        {"trait": "Integrity", "weight": 15, "evidence": "Follows process and avoids false claims."},
        {"trait": "Learning Agility", "weight": 12, "evidence": "Learns quickly from feedback and change."},
        {"trait": "Role Alignment", "weight": 10, "evidence": "Understands how they will contribute in the role."},
    ],
}


@dataclass
class EvaluationResult:
    score: float
    evidence: List[str]
    risk_flags: List[str]
    confidence: float


def choose_trait_template(title: str) -> List[Dict[str, object]]:
    lowered = title.lower()
    if "operation" in lowered or "ops" in lowered:
        return TRAIT_LIBRARY["operations manager"]
    if "sales" in lowered:
        return TRAIT_LIBRARY["sales"]
    return TRAIT_LIBRARY["default"]


def build_questions(job: JobRequisition, traits: List[Dict[str, object]]) -> List[Dict[str, str]]:
    questions: List[Dict[str, str]] = []
    for item in traits:
        trait = str(item["trait"])
        if trait == "Role Alignment":
            continue
        questions.append({
            "question_type": "TRAIT_SCENARIO",
            "trait": trait,
            "question": f"You are working as {job.title}. A serious work challenge occurs related to {trait.lower()}. What exactly will you do, how will you communicate, and how will you prevent repeat failure?",
            "expected_signals": str(item["evidence"]),
        })
    questions.append({
        "question_type": "ROLE_ALIGNMENT",
        "trait": "Role Alignment",
        "question": f"How do you see yourself in this {job.title} position, and what specific contribution will you make in the first 90 days?",
        "expected_signals": "Role awareness, motivation, maturity, practical contribution, and realistic understanding.",
    })
    return questions


def eligibility_score(job: JobRequisition, candidate: Candidate) -> float:
    exp_score = min(candidate.years_experience / max(job.experience_min_years, 1), 1.0) * 70
    education_bonus = 20 if candidate.education and job.education_required.lower().split()[0] in candidate.education.lower() else 10
    location_bonus = 10 if candidate.location else 5
    return round(min(exp_score + education_bonus + location_bonus, 100), 2)


def evaluate_answer(question: AssessmentQuestion, answer: str) -> EvaluationResult:
    text = answer.lower()
    blocked_terms = [term for term in PROTECTED_ATTRIBUTE_TERMS if term in text]

    positive_signals = [
        "own", "responsib", "root cause", "data", "plan", "follow", "prevent",
        "client", "communicat", "escalat", "coach", "review", "tracker",
        "transparent", "correct", "priority", "quality", "sla", "team"
    ]
    weak_signals = ["blame", "ignore", "hide", "adjust data", "fake", "only warning", "not my"]

    positives = [signal for signal in positive_signals if signal in text]
    weaknesses = [signal for signal in weak_signals if signal in text]

    raw = 2.0 + min(len(set(positives)) * 0.35, 2.5) - min(len(set(weaknesses)) * 0.5, 1.5)
    if question.question_type == "ROLE_ALIGNMENT" and len(answer.split()) > 35:
        raw += 0.4
    if blocked_terms:
        raw -= 0.5

    score = round(max(1.0, min(raw, 5.0)), 2)
    evidence = [f"Found job-relevant signal: {signal}" for signal in sorted(set(positives))[:5]] or ["Answer contains limited job-relevant evidence."]
    risks = [f"Potential weak signal: {signal}" for signal in sorted(set(weaknesses))]
    if blocked_terms:
        risks.append("Answer mentioned protected-attribute terms; evaluator ignored them for scoring.")
    if len(answer.split()) < 30:
        risks.append("Answer is short; confidence reduced due to limited evidence.")

    confidence = 0.82 if len(answer.split()) >= 30 else 0.62
    return EvaluationResult(score=score, evidence=evidence, risk_flags=risks, confidence=confidence)


def score_to_percent(score_1_to_5: float) -> float:
    return round((score_1_to_5 / 5) * 100, 2)


def final_role_fit_score(eligibility: float, skill: float, trait: float, alignment: float) -> float:
    return round((eligibility * 0.15) + (skill * 0.20) + (trait * 0.45) + (alignment * 0.20), 2)


def recommendation_from_score(score: float) -> str:
    if score >= 82:
        return "STRONG_FIT_REQUIRES_HUMAN_APPROVAL"
    if score >= 68:
        return "FIT_REQUIRES_HUMAN_APPROVAL"
    if score >= 55:
        return "TALENT_POOL_RECOMMENDED"
    return "NOT_RECOMMENDED_FOR_THIS_ROLE"
