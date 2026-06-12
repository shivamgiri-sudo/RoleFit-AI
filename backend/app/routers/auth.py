from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel, EmailStr, Field
from sqlmodel import Session, select

from ..database import get_session
from ..models import Branch, Organization, UserAccount
from ..services.auth_service import AuthError, create_access_token, decode_access_token, hash_password, verify_password

router = APIRouter(prefix="/auth", tags=["auth"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


class RegisterCompanyRequest(BaseModel):
    organization_name: str
    domain: str | None = None
    branch_name: str = "Head Office"
    branch_city: str | None = None
    admin_name: str
    admin_email: EmailStr
    admin_password: str = Field(min_length=8)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


def _user_claims(user: UserAccount) -> dict:
    return {
        "user_id": user.id,
        "organization_id": user.organization_id,
        "branch_id": user.branch_id,
        "role": user.role,
        "email": user.email,
    }


@router.post("/register-company", response_model=AuthResponse)
def register_company(payload: RegisterCompanyRequest, session: Session = Depends(get_session)):
    existing = session.exec(select(UserAccount).where(UserAccount.email == str(payload.admin_email))).first()
    if existing:
        raise HTTPException(status_code=409, detail="A user with this email already exists")

    org = Organization(name=payload.organization_name, domain=payload.domain, billing_model="PER_USER")
    session.add(org)
    session.commit()
    session.refresh(org)

    branch = Branch(organization_id=org.id, name=payload.branch_name, city=payload.branch_city)
    session.add(branch)
    session.commit()
    session.refresh(branch)

    user = UserAccount(
        organization_id=org.id,
        branch_id=branch.id,
        full_name=payload.admin_name,
        email=str(payload.admin_email),
        password_hash=hash_password(payload.admin_password),
        role="COMPANY_ADMIN",
    )
    session.add(user)
    session.commit()
    session.refresh(user)

    token = create_access_token(subject=str(user.id), claims=_user_claims(user))
    return AuthResponse(access_token=token, user=_user_claims(user))


@router.post("/login", response_model=AuthResponse)
def login(payload: LoginRequest, session: Session = Depends(get_session)):
    user = session.exec(select(UserAccount).where(UserAccount.email == str(payload.email))).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="User is inactive")
    token = create_access_token(subject=str(user.id), claims=_user_claims(user))
    return AuthResponse(access_token=token, user=_user_claims(user))


def get_current_user(token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)) -> UserAccount:
    try:
        payload = decode_access_token(token)
    except AuthError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(exc)) from exc
    user_id = payload.get("user_id")
    user = session.get(UserAccount, user_id)
    if not user or not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found or inactive")
    return user


@router.get("/me")
def me(current_user: UserAccount = Depends(get_current_user)):
    return _user_claims(current_user)
