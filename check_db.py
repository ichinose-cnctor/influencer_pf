import os
from sqlalchemy import create_engine, inspect
from dotenv import load_dotenv

load_dotenv()

db_url = os.getenv("STAGING_DATABASE_URL")
if not db_url:
    print("STAGING_DATABASE_URL is not set.")
    exit(1)

engine = create_engine(db_url)
try:
    inspector = inspect(engine)
    columns = inspector.get_columns("campaigns")
    print("Columns in 'campaigns' table:")
    for col in columns:
        print(f"- {col['name']}")
except Exception as e:
    print(f"Error: {e}")
