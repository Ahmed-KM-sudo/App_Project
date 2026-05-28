from sqlalchemy.orm import Session
from ..models.models import AuditLog

def record_audit_log(db: Session, user_id: int, action: str, module: str, description: str = None, ip_address: str = None):
    log = AuditLog(
        user_id=user_id,
        action=action,
        module=module,
        description=description,
        ip_address=ip_address
    )
    db.add(log)
    db.commit()
