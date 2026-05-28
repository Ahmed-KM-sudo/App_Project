import sys
sys.path.append('.')
from sqlalchemy import text
from app.models.database import engine

with engine.connect() as conn:
    conn.execute(text("ALTER TYPE documenttype RENAME VALUE 'fee_receipt' TO 'FEE_RECEIPT';"))
    conn.commit()
    print("Done")
