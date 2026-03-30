import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()

db_url = os.getenv("STAGING_DATABASE_URL")
if not db_url:
    print("STAGING_DATABASE_URL is not set.")
    exit(1)

engine = create_engine(db_url)
try:
    with engine.connect() as conn:
        res = conn.execute(text("SELECT role, COUNT(*) FROM users GROUP BY role"))
        print("User counts by role:")
        for row in res:
            print(f"- {row[0]}: {row[1]}")
        
        res = conn.execute(text("SELECT COUNT(*) FROM campaigns"))
        print(f"Total campaigns: {res.scalar()}")
except Exception as e:
    print(f"Error: {e}")
