from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Announcement, User
from app.schemas import AnnouncementCreate, AnnouncementUpdate, AnnouncementOut
from app.auth import get_current_user, require_admin

router = APIRouter(prefix="/api/announcements", tags=["Announcements"])


@router.get("", response_model=list[AnnouncementOut])
def list_announcements(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Announcement).order_by(Announcement.created_at.desc()).all()


@router.get("/{announcement_id}", response_model=AnnouncementOut)
def get_announcement(announcement_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    a = db.query(Announcement).filter(Announcement.id == announcement_id).first()
    if not a:
        raise HTTPException(status_code=404, detail="お知らせが見つかりません")
    return a


@router.post("", response_model=AnnouncementOut, status_code=201)
def create_announcement(data: AnnouncementCreate, db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    a = Announcement(**data.model_dump(), created_by=admin.id)
    db.add(a)
    db.commit()
    db.refresh(a)
    return a


@router.put("/{announcement_id}", response_model=AnnouncementOut)
def update_announcement(announcement_id: int, data: AnnouncementUpdate, db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    a = db.query(Announcement).filter(Announcement.id == announcement_id).first()
    if not a:
        raise HTTPException(status_code=404, detail="お知らせが見つかりません")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(a, key, value)
    db.commit()
    db.refresh(a)
    return a


@router.delete("/{announcement_id}", status_code=204)
def delete_announcement(announcement_id: int, db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    a = db.query(Announcement).filter(Announcement.id == announcement_id).first()
    if not a:
        raise HTTPException(status_code=404, detail="お知らせが見つかりません")
    db.delete(a)
    db.commit()
