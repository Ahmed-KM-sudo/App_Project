import sys
sys.path.append('.')
from sqlalchemy import text
from app.models.database import engine

with engine.connect() as conn:
    print('applicationstatus:', conn.execute(text("SELECT enumlabel FROM pg_enum JOIN pg_type ON pg_enum.enumtypid = pg_type.oid WHERE pg_type.typname = 'applicationstatus'")).fetchall())
    print('userrole:', conn.execute(text("SELECT enumlabel FROM pg_enum JOIN pg_type ON pg_enum.enumtypid = pg_type.oid WHERE pg_type.typname = 'userrole'")).fetchall())
