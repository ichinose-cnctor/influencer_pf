import math
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models import User, Campaign, Application, InfluencerProfile, InfluencerRating
from app.auth import require_influencer

router = APIRouter(prefix="/api/portal", tags=["Portal"])


@router.get("/stats")
def get_portal_stats(db: Session = Depends(get_db), user: User = Depends(require_influencer)):
    applying = db.query(func.count(Application.id)).filter(
        Application.influencer_id == user.id, Application.verdict == "pending"
    ).scalar() or 0

    active = db.query(func.count(Application.id)).filter(
        Application.influencer_id == user.id, Application.verdict == "pass"
    ).join(Campaign).filter(Campaign.status == "進行中").scalar() or 0

    completed = db.query(func.count(Application.id)).filter(
        Application.influencer_id == user.id, Application.verdict == "pass"
    ).join(Campaign).filter(Campaign.status == "完了").scalar() or 0

    # Total earned (sum of max_budget for completed campaigns)
    total_earned = db.query(func.sum(Campaign.max_budget)).join(Application).filter(
        Application.influencer_id == user.id,
        Application.verdict == "pass",
        Campaign.status == "完了",
    ).scalar() or 0

    rating_avg = db.query(func.avg(InfluencerRating.rating)).filter(
        InfluencerRating.influencer_id == user.id
    ).scalar()

    return {
        "applying": applying,
        "active": active,
        "completed": completed,
        "total_earned": total_earned,
        "rating_avg": float(rating_avg) if rating_avg else None,
    }


@router.get("/campaigns")
def list_public_campaigns(
    category: str = None,
    platform: str = None,
    keyword: str = None,
    page: int = Query(1, ge=1),
    per_page: int = Query(9, ge=1, le=50),
    db: Session = Depends(get_db),
    user: User = Depends(require_influencer),
):
    q = db.query(Campaign).filter(Campaign.status == "募集中")
    if category:
        q = q.filter(Campaign.category == category)
    if platform:
        q = q.filter(Campaign.platform == platform)
    if keyword:
        q = q.filter(Campaign.title.ilike(f"%{keyword}%"))

    total = q.count()
    campaigns = q.order_by(Campaign.created_at.desc()).offset((page - 1) * per_page).limit(per_page).all()

    return {
        "items": [{
            "id": c.id,
            "title": c.title,
            "client_name": c.client_name,
            "category": c.category,
            "platform": c.platform,
            "max_budget": c.max_budget,
            "end_date": c.end_date,
            "image_gradient": c.image_gradient,
            "status": c.status,
        } for c in campaigns],
        "total": total,
        "page": page,
        "per_page": per_page,
        "total_pages": math.ceil(total / per_page) if total > 0 else 0,
    }


@router.get("/my-campaigns")
def list_my_campaigns(db: Session = Depends(get_db), user: User = Depends(require_influencer)):
    apps = db.query(Application).filter(Application.influencer_id == user.id).all()
    result = []
    for a in apps:
        c = a.campaign
        if c:
            result.append({
                "application_id": a.id,
                "campaign_id": c.id,
                "title": c.title,
                "client_name": c.client_name,
                "category": c.category,
                "platform": c.platform,
                "max_budget": c.max_budget,
                "verdict": a.verdict,
                "campaign_status": c.status,
                "applied_at": a.applied_at,
            })
    return result
