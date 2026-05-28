import sys
sys.path.append('.')
from sqlalchemy import text
from app.models.database import engine

with engine.connect() as conn:
    try:
        conn.execute(text("ALTER TYPE applicationstatus RENAME VALUE 'incomplete' TO 'INCOMPLETE';"))
    except Exception as e:
        print(e)
    
    try:
        conn.execute(text("ALTER TYPE applicationstatus RENAME VALUE 'waitlisted' TO 'WAITLISTED';"))
    except Exception as e:
        print(e)

    conn.commit()
    print("Done renaming applicationstatus values")
