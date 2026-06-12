from sqlmodel import Session, select
from .models import TraitMaster


DEFAULT_TRAITS = {
    "Ownership": "Takes end-to-end responsibility for outcomes and closure.",
    "Accountability": "Accepts results without blame and creates corrective action.",
    "Integrity": "Follows process, truthfully reports data, and avoids manipulation.",
    "Execution Discipline": "Maintains review rhythm, follow-up, documentation, and closure hygiene.",
    "Problem Solving": "Uses data, root-cause analysis, and practical action planning.",
    "People Leadership": "Coaches, motivates, and improves team performance fairly.",
    "Client Centricity": "Understands client impact and communicates recovery plans clearly.",
    "Adaptability": "Handles change, ambiguity, and volume pressure calmly.",
    "Role Alignment": "Understands the position and connects personal contribution to role outcomes.",
}


def seed_traits(session: Session) -> None:
    for name, definition in DEFAULT_TRAITS.items():
        existing = session.exec(select(TraitMaster).where(TraitMaster.name == name)).first()
        if not existing:
            session.add(TraitMaster(name=name, definition=definition))
    session.commit()
