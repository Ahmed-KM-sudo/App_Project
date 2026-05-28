from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import datetime
from typing import Optional
from ..models.models import UserRole

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserLogin(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    role: UserRole
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

class VerifyResetCodeRequest(BaseModel):
    token: str
