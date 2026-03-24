import math
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models import Campaign, Application, User
from app.schemas import (
    CampaignCreate, CampaignUpdate, CampaignOut, CampaignStatusUpdate,
    ApplicationCreate, ApplicationOut, ApplicationVerdictUpdate,
)
from app.auth import get_current_user, require_admin

router = APIRouter(prefix="/api/campaigns", tags=["Campaigns"])


def _campaign_to_out(c: Campaign, db: Session) -> dict:
    data = {col.name: getattr(c, col.name) for col in Campaign.__table__.columns}
    data["applicant_count"] = db.query(func.count(Application.id)).filter(Application.campaign_id == c.id).scalar() or 0
    return data


@router.get("")
def list_campaigns(
    status: str = None,
    category: str = None,
    area: str = None,
    platform: str = None,
    country: str = None,
    keyword: str = None,
    page: int = Query(1, ge=1),
    per_page: int = Query(9, ge=1, le=50),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    q = db.query(Campaign)
    if status:
        q = q.filter(Campaign.status == status)
    if category:
        q = q.filter(Campaign.category == category)
    if area:
        q = q.filter(Campaign.area == area)
    if platform:
        q = q.filter(Campaign.platform == platform)
    if country:
        q = q.filter(Campaign.country == country)
    if keyword:
        q = q.filter(Campaign.title.ilike(f"%{keyword}%"))

    total = q.count()
    campaigns = q.order_by(Campaign.created_at.desc()).offset((page - 1) * per_page).limit(per_page).all()

    return {
        "items": [_campaign_to_out(c, db) for c in campaigns],
        "total": total,
        "page": page,
        "per_page": per_page,
        "total_pages": math.ceil(total / per_page) if total > 0 else 0,
    }


@router.get("/{campaign_id}", response_model=CampaignOut)
def get_campaign(campaign_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    c = db.query(Campaign).filter(Campaign.id == campaign_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="案件が見つかりません")
    return _campaign_to_out(c, db)


@router.post("", response_model=CampaignOut, status_code=201)
def create_campaign(data: CampaignCreate, db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    c = Campaign(**data.model_dump(), created_by=admin.id)
    db.add(c)
    db.commit()
    db.refresh(c)
    return _campaign_to_out(c, db)


@router.put("/{campaign_id}", response_model=CampaignOut)
def update_campaign(campaign_id: int, data: CampaignUpdate, db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    c = db.query(Campaign).filter(Campaign.id == campaign_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="案件が見つかりません")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(c, key, value)
    db.commit()
    db.refresh(c)
    return _campaign_to_out(c, db)


@router.patch("/{campaign_id}/status", response_model=CampaignOut)
def update_campaign_status(campaign_id: int, data: CampaignStatusUpdate, db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    c = db.query(Campaign).filter(Campaign.id == campaign_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="案件が見つかりません")
    if data.status not in ("募集中", "進行中", "完了"):
        raise HTTPException(status_code=400, detail="無効なステータスです")
    c.status = data.status
    db.commit()
    db.refresh(c)
    return _campaign_to_out(c, db)


@router.delete("/{campaign_id}", status_code=204)
def delete_campaign(campaign_id: int, db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    c = db.query(Campaign).filter(Campaign.id == campaign_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="案件が見つかりません")
    db.delete(c)
    db.commit()


# ──── Applications ────

@router.get("/{campaign_id}/applications")
def list_applications(campaign_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    apps = db.query(Application).filter(Application.campaign_id == campaign_id).order_by(Application.applied_at).all()
    result = []
    for a in apps:
        inf = db.query(User).filter(User.id == a.influencer_id).first()
        item = {col.name: getattr(a, col.name) for col in Application.__table__.columns}
        if inf:
            item["influencer"] = {
                "id": inf.id, "email": inf.email, "name": inf.name,
                "photo_url": inf.photo_url, "created_at": inf.created_at,
                "profile": None, "rating_avg": None, "campaign_count": 0,
            }
            if inf.influencer_profile:
                item["influencer"]["profile"] = {
                    col.name: getattr(inf.influencer_profile, col.name)
                    for col in inf.influencer_profile.__class__.__table__.columns
                }
        result.append(item)
    return result


@router.post("/{campaign_id}/applications", status_code=201)
def apply_to_campaign(campaign_id: int, data: ApplicationCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "influencer":
        raise HTTPException(status_code=403, detail="インフルエンサーのみ応募できます")
    campaign = db.query(Campaign).filter(Campaign.id == campaign_id).first()
    if not campaign:
        raise HTTPException(status_code=404, detail="案件が見つかりません")
    if campaign.status != "募集中":
        raise HTTPException(status_code=400, detail="この案件は応募を受け付けていません")
    existing = db.query(Application).filter(
        Application.campaign_id == campaign_id, Application.influencer_id == current_user.id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="既に応募済みです")

    app = Application(campaign_id=campaign_id, influencer_id=current_user.id, comment=data.comment)
    db.add(app)
    db.commit()
    db.refresh(app)
    return {col.name: getattr(app, col.name) for col in Application.__table__.columns}


@router.patch("/{campaign_id}/applications/{app_id}")
def update_application_verdict(campaign_id: int, app_id: int, data: ApplicationVerdictUpdate, db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    app = db.query(Application).filter(Application.id == app_id, Application.campaign_id == campaign_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="応募が見つかりません")
    if data.verdict not in ("pending", "pass", "fail"):
        raise HTTPException(status_code=400, detail="無効な判定です")
    app.verdict = data.verdict
    db.commit()
    db.refresh(app)
    return {col.name: getattr(app, col.name) for col in Application.__table__.columns}
