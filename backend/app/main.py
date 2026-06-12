import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session
from .database import create_db_and_tables, engine
from .seed import seed_traits
from .routers import jobs, candidates, assessments, dashboard, voice_interviews

app = FastAPI(
    title="RoleFit AI API",
    description="AI-assisted hiring operations MVP with trait intelligence, voice interview transcript evaluation, and human approval guardrails.",
    version="0.2.0",
)

origins = [origin.strip() for origin in os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    create_db_and_tables()
    with Session(engine) as session:
        seed_traits(session)


@app.get("/health")
def health():
    return {"status": "ok", "service": "RoleFit AI API", "version": "0.2.0"}


app.include_router(jobs.router)
app.include_router(candidates.router)
app.include_router(assessments.router)
app.include_router(voice_interviews.router)
app.include_router(dashboard.router)
