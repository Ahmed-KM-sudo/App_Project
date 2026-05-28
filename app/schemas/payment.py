from pydantic import BaseModel

class PaymentLinkResponse(BaseModel):
    checkout_url: str

class PaymentStatusResponse(BaseModel):
    status: str
    amount: float
    currency: str
