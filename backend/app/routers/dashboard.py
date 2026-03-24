from datetime import datetime, timezone
from dateutil.relativedelta import relativedelta
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models import User, Campaign, InfluencerProfile
from app.schemas import DashboardStats
from app.auth import require_admin

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])


@router.get("/stats", response_model=DashboardStats)
def get_dashboard_stats(db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    total_influencers = db.query(func.count(User.id)).filter(User.role == "influencer").scalar() or 0
    recruiting = db.query(func.count(Campaign.id)).filter(Campaign.status == "募集中").scalar() or 0
    active = db.query(func.count(Campaign.id)).filter(Campaign.status == "進行中").scalar() or 0
    completed = db.query(func.count(Campaign.id)).filter(Campaign.status == "完了").scalar() or 0

    now = datetime.now(timezone.utc)
    month_ago = now - relativedelta(months=1)
    new_this_month = db.query(func.count(User.id)).filter(
        User.role == "influencer", User.created_at >= month_ago
    ).scalar() or 0

    return DashboardStats(
        total_influencers=total_influencers,
        recruiting_campaigns=recruiting,
        active_campaigns=active,
        completed_campaigns=completed,
        new_influencers_this_month=new_this_month,
    )


@router.get("/recent-campaigns")
def get_recent_campaigns(db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    campaigns = db.query(Campaign).order_by(Campaign.created_at.desc()).limit(5).all()
    return [{
        "id": c.id,
        "title": c.title,
        "status": c.status,
        "category": c.category,
        "platform": c.platform,
        "client_name": c.client_name,
        "created_at": c.created_at,
    } for c in campaigns]
