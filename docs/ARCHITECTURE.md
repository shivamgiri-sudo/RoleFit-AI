# RoleFit AI Architecture

## Product goal

RoleFit AI is an AI-assisted hiring SaaS platform focused on role-specific trait intelligence. It automates hiring workflow tasks and generates evidence-based recommendations, while final employment decisions remain under authorized human approval.

## Core modules

1. Tenant and branch data model
2. Role requirement builder
3. Trait blueprint engine
4. Assessment generator
5. Candidate application flow
6. Candidate scoring engine
7. Role Fit Score engine
8. Approval and audit log
9. Talent pool
10. Recruitment analytics

## Backend flow

```text
Role Created
  -> Trait Blueprint Generated
  -> Assessment Questions Generated
  -> Candidate Applies
  -> Eligibility Score Calculated
  -> Candidate Submits Assessment
  -> Trait and Role Alignment Answers Evaluated
  -> Role Fit Score Calculated
  -> Recommendation Generated
  -> Human Approval Gate
  -> Decision Log / Talent Pool / Next Stage
```

## Data isolation

Every job and candidate belongs to an organization. Branch-level filtering is supported through `branch_id`. Production implementation should enforce this through authentication claims, scoped queries, and database indexes.

## AI layer

The MVP uses a deterministic mock evaluator in `backend/app/ai_engine.py`. This keeps the project runnable without paid AI credentials. The evaluator is intentionally structured like a real AI service response: score, evidence, risk flags, confidence, model version, and prompt version.

Production replacement should use:

- Structured JSON output
- Prompt versioning
- Model version storage
- Evaluation logs
- Bias and protected-attribute guardrails
- Confidence thresholds
- Human review for low confidence

## Compliance posture

The product must not score protected attributes such as age, gender, caste, religion, disability, marital status, pregnancy, appearance, accent, or unrelated personal background. AI recommendations should remain explainable and auditable.
