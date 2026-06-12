# RoleFit AI

RoleFit AI is a multi-tenant SaaS MVP for AI-assisted hiring operations with role-specific trait intelligence, structured assessments, role-fit scoring, talent pool management, and recruitment analytics.

> Important: this MVP is designed as a decision-support platform. AI can automate workflow tasks and produce evidence-based recommendations, but final hire/reject decisions require authorized human approval with audit trails.

## What this MVP includes

- Multi-tenant organization and branch-aware data model
- Role requirement creation
- AI-style role trait blueprint generation
- Job Definition Engine foundation
- Assessment question generation
- Candidate application flow
- Resume/profile-lite structured capture
- Trait assessment submission
- Evidence-based trait scoring
- Role alignment scoring
- Role Fit Score calculation
- Human approval gate
- Talent pool recommendation
- Hiring analytics dashboard
- Compliance guardrails and audit logs

## Tech stack

### Backend
- FastAPI
- SQLModel / SQLAlchemy
- SQLite by default, PostgreSQL-ready
- Modular routers

### Frontend
- Next.js App Router
- TypeScript
- Tailwind CSS

## Quick start

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\\Scripts\\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Open: http://localhost:8000/docs

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open: http://localhost:3000

## Demo flow

1. Create an Operations Manager role.
2. The backend generates a trait blueprint and assessment questions.
3. Candidate applies.
4. Candidate submits scenario-based answers.
5. AI-style evaluator generates evidence, risk flags, trait score, role alignment score, and role-fit score.
6. Candidate moves to pending human approval, talent pool recommendation, or not recommended status.
7. Hiring dashboard updates automatically.

## Safety and compliance guardrails

The platform avoids protected-attribute scoring and does not make final employment decisions automatically. It stores evidence, confidence, risk flags, model/prompt version placeholders, and decision logs for auditability.

## Repository structure

```text
backend/      FastAPI backend
frontend/     Next.js frontend
docs/         product and architecture docs
```
