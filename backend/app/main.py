import time
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.config import get_settings
from app.database import engine, Base
from app import database, models
from app.routers import auth, campaigns, influencers, messages, announcements, dashboard, notifications, portal, master, seed

logger = logging.getLogger(__name__)
settings = get_settings()


def init_db(retries: int = 5, delay: int = 3):
    """Create tables with retry logic for Cloud SQL proxy startup delay."""
    for attempt in range(retries):
        try:
            Base.metadata.create_all(bind=engine)
            logger.info("Database tables initialized successfully.")
            return
        except Exception as e:
            if attempt < retries - 1:
                logger.warning(f"DB connection attempt {attempt + 1}/{retries} failed: {e}. Retrying in {delay}s...")
                time.sleep(delay)
            else:
                logger.warning(f"Could not initialize DB after {retries} attempts: {e}. App will start without auto-migration.")


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(
    title="インフルエンサープラットフォーム API",
    description="ホテル向けインフルエンサーマッチングプラットフォームのバックエンドAPI",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# CORS
origins = [settings.FRONTEND_URL, "http://localhost:3000"]
if settings.FRONTEND_URL == "*":
    origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router)
app.include_router(seed.router)
app.include_router(dashboard.router)
app.include_router(campaigns.router)
app.include_router(influencers.router)
app.include_router(messages.router)
app.include_router(announcements.router)
app.include_router(notifications.router)
app.include_router(portal.router)
app.include_router(master.router)


@app.get("/")
def root():
    return {"message": "インフルエンサープラットフォーム API", "docs": "/docs"}


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.get("/api/debug/user")
def debug_user(db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.email == "levgo_sns@cnctor.jp").first()
    if not user:
        return {"error": "not found"}
    key = settings.SECRET_KEY
    return {
        "id": user.id,
        "email": user.email,
        "is_active": user.is_active,
        "role": user.role,
        "secret_key_len": len(key),
        "secret_key_repr": repr(key[:6]) + "..." + repr(key[-6:]),
        "secret_key_hex_end": key[-4:].encode().hex(),
    }

