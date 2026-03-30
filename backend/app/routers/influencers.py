import math
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models import User, InfluencerProfile, InfluencerRating, Application
from app.schemas import RatingUpdate, MemoUpdate, InfluencerProfileUpdate
from app.auth import get_current_user, require_admin

router = APIRouter(prefix="/api/influencers", tags=["Influencers"])


def _build_influencer_out(user: User, db: Session) -> dict:
    profile = user.influencer_profile
    rating_avg = db.query(func.avg(InfluencerRating.rating)).filter(
        InfluencerRating.influencer_id == user.id
    ).scalar()
    campaign_count = db.query(func.count(Application.id)).filter(
        Application.influencer_id == user.id,
        Application.verdict == "pass",
    ).scalar() or 0

    return {
        "id": user.id,
        "email": user.email,
        "name": user.name,
        "photo_url": user.photo_url,
        "created_at": user.created_at,
        "profile": {col.name: getattr(profile, col.name) for col in InfluencerProfile.__table__.columns} if profile else None,
        "rating_avg": float(rating_avg) if rating_avg else None,
        "campaign_count": campaign_count,
    }


@router.get("")
def list_influencers(
    category: str = None,
    platform: str = None,
    status: str = None,
    keyword: str = None,
    sort: str = "followers",
    page: int = Query(1, ge=1),
    per_page: int = Query(9, ge=1, le=50),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    q = db.query(User).filter(User.role == "influencer").join(InfluencerProfile, isouter=True)

    if category:
        q = q.filter(InfluencerProfile.genres.any(category))
    if platform:
        q = q.filter(InfluencerProfile.platform == platform.lower())
    if status:
        q = q.filter(InfluencerProfile.status == status)
    if keyword:
        q = q.filter((User.name.ilike(f"%{keyword}%")) | (InfluencerProfile.handle.ilike(f"%{keyword}%")))

    if sort == "followers":
        q = q.order_by(InfluencerProfile.followers.desc().nullslast())
    elif sort == "登録日":
        q = q.order_by(User.created_at.desc())
    else:
        q = q.order_by(User.created_at.desc())

    total = q.count()
    users = q.offset((page - 1) * per_page).limit(per_page).all()

    return {
        "items": [_build_influencer_out(u, db) for u in users],
        "total": total,
        "page": page,
        "per_page": per_page,
        "total_pages": math.ceil(total / per_page) if total > 0 else 0,
    }


@router.get("/{influencer_id}")
def get_influencer(influencer_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    user = db.query(User).filter(User.id == influencer_id, User.role == "influencer").first()
    if not user:
        raise HTTPException(status_code=404, detail="インフルエンサーが見つかりません")

    result = _build_influencer_out(user, db)

    # Add campaign history
    apps = db.query(Application).filter(Application.influencer_id == influencer_id).all()
    history = []
    for a in apps:
        campaign = a.campaign
        if campaign:
            history.append({
                "id": a.id,
                "campaign_id": campaign.id,
                "title": campaign.title,
                "client": campaign.client_name,
                "category": campaign.category,
                "platform": campaign.platform,
                "status": "完了" if campaign.status == "完了" else ("進行中" if a.verdict == "pass" else "応募中"),
                "period": f"{campaign.start_date}〜{campaign.end_date}" if campaign.start_date else None,
                "reward": f"¥{campaign.max_budget:,}" if campaign.max_budget else None,
            })
    result["campaign_history"] = history
    return result


@router.put("/{influencer_id}/rating")
def update_rating(influencer_id: int, data: RatingUpdate, db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    user = db.query(User).filter(User.id == influencer_id, User.role == "influencer").first()
    if not user:
        raise HTTPException(status_code=404, detail="インフルエンサーが見つかりません")
    if data.rating < 1 or data.rating > 5:
        raise HTTPException(status_code=400, detail="評価は1〜5の範囲で入力してください")

    rating = db.query(InfluencerRating).filter(
        InfluencerRating.influencer_id == influencer_id,
        InfluencerRating.rated_by == admin.id,
    ).first()

    if rating:
        rating.rating = data.rating
    else:
        rating = InfluencerRating(influencer_id=influencer_id, rated_by=admin.id, rating=data.rating)
        db.add(rating)

    db.commit()
    return {"message": "評価を更新しました", "rating": data.rating}


@router.put("/{influencer_id}/memo")
def update_memo(influencer_id: int, data: MemoUpdate, db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    profile = db.query(InfluencerProfile).filter(InfluencerProfile.user_id == influencer_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="インフルエンサーが見つかりません")
    profile.admin_memo = data.memo
    db.commit()
    return {"message": "メモを更新しました"}


@router.put("/{influencer_id}/profile")
def update_influencer_profile(
    influencer_id: int,
    data: InfluencerProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.id != influencer_id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="権限がありません")

    profile = db.query(InfluencerProfile).filter(InfluencerProfile.user_id == influencer_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="プロフィールが見つかりません")

    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(profile, key, value)

    db.commit()
    db.refresh(profile)
    return {col.name: getattr(profile, col.name) for col in InfluencerProfile.__table__.columns}

@router.post("/reset-all-danger-zone")
def reset_all_influencers(db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    """
    DANGER ZONE: Deletes all influencer-related data.
    This includes ratings, profiles, and the users themselves.
    """
    # 1. Delete ratings
    db.query(InfluencerRating).delete()
    
    # 2. Delete profiles
    db.query(InfluencerProfile).delete()
    
    # 3. Delete conversation participants for influencers
    # (Optional: can be more specific, but for reset let's clear them)
    from app.models import ConversationParticipant
    db.query(ConversationParticipant).filter(
        ConversationParticipant.user_id.in_(
            db.query(User.id).filter(User.role == "influencer")
        )
    ).delete(synchronize_session=False)

    # 4. Delete influencers from User table
    db.query(User).filter(User.role == "influencer").delete(synchronize_session=False)
    
    db.commit()
    return {"message": "All influencer data has been reset successfully."}
