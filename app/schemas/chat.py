from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ChatMessageSchema(BaseModel):
    id: int
    application_id: int
    sender_id: int
    message: str
    created_at: datetime

    class Config:
        from_attributes = True

class ChatMessageCreate(BaseModel):
    application_id: int
    message: str
