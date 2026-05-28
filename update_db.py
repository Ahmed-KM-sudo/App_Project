import psycopg2

DATABASE_URL = 'postgresql://postgres:Kxsd2882@localhost:5432/internat_db'

conn = psycopg2.connect(DATABASE_URL)
conn.autocommit = True
cur = conn.cursor()

try:
    cur.execute("ALTER TYPE applicationstatus ADD VALUE 'incomplete';")
    print('Added incomplete')
except Exception as e:
    print('incomplete error:', e)

try:
    cur.execute("ALTER TYPE applicationstatus ADD VALUE 'waitlisted';")
    print('Added waitlisted')
except Exception as e:
    print('waitlisted error:', e)

try:
    cur.execute("ALTER TABLE applications ADD COLUMN admin_feedback TEXT;")
    print('Added admin_feedback')
except Exception as e:
    print('admin_feedback error:', e)

conn.close()
