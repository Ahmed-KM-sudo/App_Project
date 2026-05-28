import secrets
from datetime import timedelta, datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..models.database import get_db
from ..models.models import User, UserRole, PasswordResetToken, TwoFactorToken
from ..schemas.user import UserCreate, UserResponse, UserLogin, Token, ForgotPasswordRequest, ResetPasswordRequest, VerifyResetCodeRequest
from ..auth.security import get_password_hash, verify_password
from ..auth.jwt_handler import create_access_token
from ..services.email import send_password_reset

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(user_in: UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    db_user = db.query(User).filter(User.email == user_in.email).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    new_user = User(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        role=UserRole.STUDENT # Default role for registration
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login", response_model=Token)
def login(user_in: UserLogin, db: Session = Depends(get_db)):
    # Check user existence
    user = db.query(User).filter(User.email == user_in.email).first()
    if not user or not verify_password(user_in.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token directly (2FA removed per user request)
    access_token = create_access_token(data={"sub": user.email, "role": user.role})
    return {"access_token": access_token, "token_type": "bearer"}


import random

@router.post("/forgot-password", status_code=status.HTTP_200_OK)
def forgot_password(request: ForgotPasswordRequest, db: Session = Depends(get_db)):
    """
    Request a password-reset link.
    Always returns 200 to avoid email enumeration — the email is only sent
    if the account exists.
    """
    user = db.query(User).filter(User.email == request.email).first()
    if user:
        # Invalidate any existing unused tokens for this user
        db.query(PasswordResetToken).filter(
            PasswordResetToken.user_id == user.id,
            PasswordResetToken.used == False  # noqa: E712
        ).delete()
        db.commit()

        raw_token = f"{random.randint(100000, 999999)}"
        expires   = datetime.now(timezone.utc) + timedelta(minutes=15)
        reset_tok = PasswordResetToken(
            user_id    = user.id,
            token      = raw_token,
            expires_at = expires,
        )
        db.add(reset_tok)
        db.commit()

        send_password_reset(user.email, raw_token)

    return {"message": "If that email is registered, a reset code has been sent."}


@router.post("/verify-reset-code", status_code=status.HTTP_200_OK)
def verify_reset_code(request: VerifyResetCodeRequest, db: Session = Depends(get_db)):
    """Check if a reset token is valid before showing the password reset form."""
    token_record = db.query(PasswordResetToken).filter(
        PasswordResetToken.token == request.token
    ).first()

    if not token_record:
        raise HTTPException(status_code=400, detail="Code invalide. Veuillez vérifier le code et réessayer.")

    if token_record.used:
        raise HTTPException(status_code=400, detail="Ce code a déjà été utilisé. Veuillez en demander un nouveau.")

    now = datetime.now(timezone.utc).replace(tzinfo=None)
    expiry = token_record.expires_at
    if hasattr(expiry, 'tzinfo') and expiry.tzinfo is not None:
        expiry = expiry.replace(tzinfo=None)
    
    if now > expiry:
        raise HTTPException(status_code=400, detail="Ce code a expiré. Veuillez en demander un nouveau.")

    return {"message": "Code valide."}


@router.post("/reset-password", status_code=status.HTTP_200_OK)
def reset_password(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    """Consume a reset token and set a new password."""
    token_record = db.query(PasswordResetToken).filter(
        PasswordResetToken.token == request.token
    ).first()

    if not token_record:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token.")

    if token_record.used:
        raise HTTPException(status_code=400, detail="Reset token has already been used.")

    # SQLite stores datetimes without timezone (naive); compare accordingly
    now = datetime.now(timezone.utc).replace(tzinfo=None)
    expiry = token_record.expires_at
    if hasattr(expiry, 'tzinfo') and expiry.tzinfo is not None:
        expiry = expiry.replace(tzinfo=None)
    if now > expiry:
        raise HTTPException(status_code=400, detail="Reset token has expired.")


    # Update password
    user = token_record.user
    user.hashed_password = get_password_hash(request.new_password)

    # Mark token as used
    token_record.used = True
    db.commit()

    return {"message": "Password has been reset successfully."}
