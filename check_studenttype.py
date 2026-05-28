import sys
sys.path.append('.')
from sqlalchemy import text
from app.models.database import engine

with engine.connect() as conn:
    print('studenttype:', conn.execute(text("SELECT enumlabel FROM pg_enum JOIN pg_type ON pg_enum.enumtypid = pg_type.oid WHERE pg_type.typname = 'studenttype'")).fetchall())
