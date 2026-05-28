import os
import sys

# Ensure the project root is in the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import text
from app.models.database import SessionLocal, engine, Base
from app.models.models import Room

def setup():
    # 1. Create new tables (like 'rooms')
    Base.metadata.create_all(bind=engine)
    print("Tables ensured.")

    db = SessionLocal()
    try:
        # 2. Add room_id to applications if it doesn't exist
        db.execute(text("ALTER TABLE applications ADD COLUMN IF NOT EXISTS room_id INTEGER REFERENCES rooms(id) ON DELETE SET NULL;"))
        db.commit()
        print("Column room_id ensured on applications table.")

        # 3. Seed some dummy rooms if none exist
        if db.query(Room).count() == 0:
            print("Seeding rooms...")
            rooms = [
                Room(room_number="A-101", capacity=4, gender_type="Male"),
                Room(room_number="A-102", capacity=4, gender_type="Male"),
                Room(room_number="A-103", capacity=2, gender_type="Male"),
                Room(room_number="B-201", capacity=4, gender_type="Female"),
                Room(room_number="B-202", capacity=4, gender_type="Female"),
                Room(room_number="B-203", capacity=2, gender_type="Female"),
            ]
            db.add_all(rooms)
            db.commit()
            print("Rooms seeded successfully.")
        else:
            print("Rooms already exist, skipping seed.")
            
    except Exception as e:
        print(f"Error during setup: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    setup()
