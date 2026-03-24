from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.database import engine, Base
from app.routers import auth, campaigns, influencers, messages, announcements, dashboard, notifications, portal, master

settings = get_settings()

app = FastAPI(
    title="インフルエンサープラットフォーム API",
    description="ホテル向けインフルエンサーマッチングプラットフォームのバックエンドAPI",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables
Base.metadata.create_all(bind=engine)

# Register routers
app.include_router(auth.router)
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
