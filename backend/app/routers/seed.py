from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.database import get_db
from app.models import User, Campaign, InfluencerProfile
from passlib.context import CryptContext
from datetime import date, timedelta
import random

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

router = APIRouter(prefix="/api/seed", tags=["Seed"])

@router.post("/")
def seed_database(db: Session = Depends(get_db)):
    # Create an admin user if it doesn't exist
    admin_user = db.query(User).filter(User.email == "levgo_sns@cnctor.jp").first()
    if not admin_user:
        admin_user = User(
            email="levgo_sns@cnctor.jp",
            password_hash=pwd_context.hash("D2&oE#bV9n"),
            role="admin",
            name="管理者"
        )
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)
    
    # Create influencers
    influencers_data = [
        {"email": "influencer1@example.com", "name": "山田 花子", "handle": "@hanako_yama", "platform": "Instagram", "followers": 150000, "genres": ["美容", "コスメ"]},
        {"email": "influencer2@example.com", "name": "鈴木 健太", "handle": "@kenta_travel", "platform": "TikTok", "followers": 320000, "genres": ["旅行", "グルメ"]},
        {"email": "influencer3@example.com", "name": "佐藤 みのり", "handle": "@minori_life", "platform": "YouTube", "followers": 85000, "genres": ["ライフスタイル"]},
        {"email": "influencer4@example.com", "name": "中村 咲", "handle": "@saki_fashion", "platform": "Instagram", "followers": 120000, "genres": ["ファッション"]},
        {"email": "influencer5@example.com", "name": "田中 太郎", "handle": "@taro_tech", "platform": "YouTube", "followers": 450000, "genres": ["ガジェット"]},
    ]

    influencer_objects = []
    for data in influencers_data:
        inf = db.query(User).filter(User.email == data["email"]).first()
        if not inf:
            inf = User(
                email=data["email"],
                password_hash=pwd_context.hash("password123"),
                role="influencer",
                name=data["name"]
            )
            db.add(inf)
            db.commit()
            db.refresh(inf)
            
            # Create profile
            profile = InfluencerProfile(
                user_id=inf.id,
                handle=data["handle"],
                platform=data["platform"],
                followers=data["followers"],
                genres=data["genres"],
                engagement_rate=random.uniform(2.0, 8.5),
                status="空き有り"
            )
            db.add(profile)
            db.commit()
        influencer_objects.append(inf)

    # Create campaigns
    campaigns_data = [
        {"title": "夏季コスメ PR キャンペーン", "client_name": "BeautyBrand Co.", "status": "進行中", "category": "美容", "platform": "Instagram", "budget": 150000},
        {"title": "新作スキンケア体験レビュー", "client_name": "Natural Cosmetics", "status": "募集中", "category": "美容", "platform": "Instagram", "budget": 80000},
        {"title": "高級ホテル宿泊体験PR", "client_name": "Hotel Grand", "status": "完了", "category": "旅行", "platform": "YouTube", "budget": 300000},
        {"title": "オーガニック食品 ブログ記事", "client_name": "GreenEats Japan", "status": "進行中", "category": "食品", "platform": "TikTok", "budget": 95000},
        {"title": "旅行アプリ TikTok PR", "client_name": "TravelMate", "status": "募集中", "category": "旅行", "platform": "TikTok", "budget": 200000},
        {"title": "フィットネスウェア新作PR", "client_name": "FitLife", "status": "完了", "category": "ファッション", "platform": "Instagram", "budget": 120000},
        {"title": "スマートウォッチ着用レビュー", "client_name": "TechWear", "status": "進行中", "category": "ガジェット", "platform": "YouTube", "budget": 180000},
    ]

    today = date.today()
    for i, data in enumerate(campaigns_data):
        camp = db.query(Campaign).filter(Campaign.title == data["title"]).first()
        if not camp:
            camp = Campaign(
                created_by=admin_user.id,
                title=data["title"],
                client_name=data["client_name"],
                status=data["status"],
                category=data["category"],
                platform=data["platform"],
                reward_style="paid",
                min_budget=int(data["budget"] * 0.8),
                max_budget=data["budget"],
                start_date=today + timedelta(days=random.randint(5, 10)),
                end_date=today + timedelta(days=random.randint(20, 30)),
            )
            db.add(camp)
    
    db.commit()

    return {"message": "Success! Dummy data seeded successfully."}

@router.post("/reset")
def reset_database(db: Session = Depends(get_db)):
    """
    管理者以外の全ユーザー（インフルエンサー）、案件、応募、チャット情報を削除してリセットする。
    """
    try:
        # 依存関係の深いものから削除
        db.execute(text("DELETE FROM messages"))
        db.execute(text("DELETE FROM conversation_participants"))
        db.execute(text("DELETE FROM conversations"))
        db.execute(text("DELETE FROM applications"))
        db.execute(text("DELETE FROM campaign_media"))
        db.execute(text("DELETE FROM campaigns"))
        db.execute(text("DELETE FROM influencer_profiles"))
        db.execute(text("DELETE FROM notifications"))
        db.execute(text("DELETE FROM influencer_ratings"))
        
        # 管理者(role='admin')以外のユーザーを削除
        db.execute(text("DELETE FROM users WHERE role != 'admin'"))
        
        db.commit()
        return {"status": "success", "message": "All test data (campaigns, influencers, matches) has been reset."}
    except Exception as e:
        db.rollback()
        return {"status": "error", "message": str(e)}
