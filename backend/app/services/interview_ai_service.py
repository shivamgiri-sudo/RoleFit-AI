import json
from dataclasses import dataclass
from typing import Any

import httpx


class InterviewAIProviderError(RuntimeError):
    pass


@dataclass
class InterviewEvaluation:
    content_score: float
    trait_signal_score: float
    role_alignment_score: float
    evidence_summary: str
    risk_flags: str
    recommendation: str
    confidence: float
    provider: str
    model: str


INTERVIEW_EVALUATION_SCHEMA: dict[str, Any] = {
    "name": "rolefit_interview_evaluation",
    "schema": {
        "type": "object",
        "properties": {
            "content_score": {"type": "number", "minimum": 0, "maximum": 100},
            "trait_signal_score": {"type": "number", "minimum": 0, "maximum": 100},
            "role_alignment_score": {"type": "number", "minimum": 0, "maximum": 100},
            "evidence_summary": {"type": "string"},
            "risk_flags": {"type": "string"},
            "recommendation": {
                "type": "string",
                "enum": [
                    "STRONG_SIGNAL_REVIEW_RECOMMENDED",
                    "GOOD_SIGNAL_REVIEW_RECOMMENDED",
                    "MIXED_SIGNAL_MANUAL_REVIEW_REQUIRED",
                    "LOW_SIGNAL_MANUAL_REVIEW_REQUIRED",
                ],
            },
            "confidence": {"type": "number", "minimum": 0, "maximum": 1},
        },
        "required": [
            "content_score",
            "trait_signal_score",
            "role_alignment_score",
            "evidence_summary",
            "risk_flags",
            "recommendation",
            "confidence",
        ],
        "additionalProperties": False,
    },
    "strict": True,
}


SYSTEM_PROMPT = """You are RoleFit AI's structured hiring interview evaluator.
Evaluate only job-relevant transcript content. Do not infer or score protected attributes such as age, gender, caste, religion, disability, marital status, pregnancy, race, appearance, accent, voice tone, emotion, or native language unless explicitly job-required and configured.
Return evidence-based hiring review signals only. Never make a final hire/reject decision. Recommendations must route to human review.
"""


def _extract_chat_content(payload: dict[str, Any]) -> str:
    try:
        return payload["choices"][0]["message"]["content"]
    except (KeyError, IndexError, TypeError) as exc:
        raise InterviewAIProviderError("OpenAI response did not include a valid message content.") from exc


async def evaluate_interview_with_openai(
    *,
    transcript: str,
    job_title: str,
    role_expectations: str,
    trait_blueprint: list[dict[str, Any]],
    api_key: str | None,
    model: str = "gpt-4o-mini",
) -> InterviewEvaluation:
    if not api_key:
        raise InterviewAIProviderError("OPENAI_API_KEY is missing. Add it to the backend environment variables.")
    if not transcript.strip():
        raise InterviewAIProviderError("Transcript cannot be empty.")

    user_content = {
        "job_title": job_title,
        "role_expectations": role_expectations,
        "trait_blueprint": trait_blueprint,
        "transcript": transcript,
        "evaluation_rules": [
            "Score only job-relevant answer content.",
            "Use evidence from the transcript.",
            "Flag weak, missing, inconsistent, or risky work-related signals.",
            "Do not use protected attributes or biometric/voice characteristics.",
            "Do not make a final employment decision.",
        ],
    }

    request_body = {
        "model": model,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": json.dumps(user_content)},
        ],
        "response_format": {
            "type": "json_schema",
            "json_schema": INTERVIEW_EVALUATION_SCHEMA,
        },
        "temperature": 0.2,
    }

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }

    async with httpx.AsyncClient(timeout=120) as client:
        response = await client.post("https://api.openai.com/v1/chat/completions", headers=headers, json=request_body)

    if response.status_code >= 400:
        raise InterviewAIProviderError(f"OpenAI evaluation failed: {response.status_code} {response.text[:500]}")

    content = _extract_chat_content(response.json())
    try:
        parsed = json.loads(content)
    except json.JSONDecodeError as exc:
        raise InterviewAIProviderError("OpenAI response was not valid JSON despite structured output request.") from exc

    return InterviewEvaluation(
        content_score=float(parsed["content_score"]),
        trait_signal_score=float(parsed["trait_signal_score"]),
        role_alignment_score=float(parsed["role_alignment_score"]),
        evidence_summary=str(parsed["evidence_summary"]),
        risk_flags=str(parsed["risk_flags"]),
        recommendation=str(parsed["recommendation"]),
        confidence=float(parsed["confidence"]),
        provider="openai",
        model=model,
    )
