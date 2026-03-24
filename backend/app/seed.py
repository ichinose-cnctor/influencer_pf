"""Seed script to populate the database with initial mock data."""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from datetime import date, datetime, timezone
from app.database import SessionLocal, engine, Base
from app.models import (
    User, InfluencerProfile, Campaign, Application,
    Conversation, ConversationParticipant, Message, Announcement
)
from app.auth import get_password_hash


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Check if already seeded
    if db.query(User).first():
        print("Database already has data. Skipping seed.")
        db.close()
        return

    print("Seeding database...")

    # ── Admin user ──
    admin = User(
        email="admin@example.com",
        password_hash=get_password_hash("admin123"),
        role="admin",
        name="管理者",
    )
    db.add(admin)
    db.flush()

    # ── Influencers ──
    influencers_data = [
        {"email": "hanako@example.com", "name": "山田 花子", "handle": "@hanako_lifestyle",
         "platform": "instagram", "followers": 45200, "engagement_rate": 4.2,
         "genres": ["ホテル＆宿泊", "飲食店"], "status": "案件中", "price_range": "¥50,000〜"},
        {"email": "kenta@example.com", "name": "鈴木 健太", "handle": "@kenta_fitness",
         "platform": "youtube", "followers": 128000, "engagement_rate": 3.8,
         "genres": ["体験＆ツアー"], "status": "空き有り", "price_range": "¥80,000〜"},
        {"email": "minori@example.com", "name": "佐藤 みのり", "handle": "@minori_foodie",
         "platform": "instagram", "followers": 32500, "engagement_rate": 5.1,
         "genres": ["飲食店"], "status": "空き有り", "price_range": "¥30,000〜"},
        {"email": "saki@example.com", "name": "中村 咲", "handle": "@saki_travel",
         "platform": "tiktok", "followers": 87600, "engagement_rate": 6.3,
         "genres": ["ホテル＆宿泊", "体験＆ツアー"], "status": "空き有り", "price_range": "¥60,000〜"},
        {"email": "yui@example.com", "name": "田中 ゆい", "handle": "@yui_beauty",
         "platform": "instagram", "followers": 56300, "engagement_rate": 4.7,
         "genres": ["ホテル＆宿泊"], "status": "案件中", "price_range": "¥45,000〜"},
    ]

    inf_users = []
    for data in influencers_data:
        user = User(
            email=data["email"],
            password_hash=get_password_hash("password123"),
            role="influencer",
            name=data["name"],
        )
        db.add(user)
        db.flush()

        profile = InfluencerProfile(
            user_id=user.id,
            handle=data["handle"],
            platform=data["platform"],
            followers=data["followers"],
            engagement_rate=data["engagement_rate"],
            genres=data["genres"],
            status=data["status"],
            price_range=data["price_range"],
        )
        db.add(profile)
        inf_users.append(user)

    db.flush()

    # ── Campaigns ──
    campaigns_data = [
        {"title": "夏季コスメ PR キャンペーン", "status": "進行中", "category": "ホテル＆宿泊",
         "area": "関東", "country": "日本", "platform": "Instagram", "reward_style": "paid",
         "max_budget": 80000, "client_name": "BeautyBrand Co.", "client_logo": "B",
         "client_logo_color": "from-pink-400 to-rose-400",
         "image_gradient": "from-pink-300 to-rose-400",
         "start_date": date(2025, 7, 1), "end_date": date(2025, 8, 31)},
        {"title": "フィットネスアプリ 動画レビュー", "status": "進行中", "category": "体験＆ツアー",
         "area": "全国", "country": "日本", "platform": "YouTube", "reward_style": "paid",
         "max_budget": 50000, "client_name": "FitLife App", "client_logo": "F",
         "client_logo_color": "from-emerald-400 to-teal-500",
         "image_gradient": "from-emerald-300 to-teal-400",
         "start_date": date(2025, 7, 15), "end_date": date(2025, 9, 15)},
        {"title": "オーガニック食品 ブログ記事", "status": "募集中", "category": "飲食店",
         "area": "関西", "country": "日本", "platform": "Instagram", "reward_style": "gifting",
         "max_budget": 0, "client_name": "OrganicFood Inc.", "client_logo": "O",
         "client_logo_color": "from-amber-400 to-orange-400",
         "image_gradient": "from-amber-300 to-orange-400",
         "start_date": date(2025, 8, 1), "end_date": date(2025, 10, 31)},
        {"title": "旅行アプリ TikTok PR", "status": "募集中", "category": "体験＆ツアー",
         "area": "全国", "country": "日本", "platform": "TikTok", "reward_style": "paid",
         "max_budget": 60000, "client_name": "TravelMate", "client_logo": "T",
         "client_logo_color": "from-violet-400 to-purple-500",
         "image_gradient": "from-violet-300 to-purple-400",
         "start_date": date(2025, 9, 1), "end_date": date(2025, 10, 1)},
        {"title": "ラグジュアリーホテル 宿泊レビュー", "status": "完了", "category": "ホテル＆宿泊",
         "area": "関東", "country": "日本", "platform": "Instagram", "reward_style": "gifting",
         "max_budget": 120000, "client_name": "Grand Hotel Tokyo", "client_logo": "G",
         "client_logo_color": "from-sky-400 to-blue-500",
         "image_gradient": "from-sky-300 to-blue-400",
         "start_date": date(2025, 4, 1), "end_date": date(2025, 6, 30)},
    ]

    camp_objs = []
    for data in campaigns_data:
        c = Campaign(**data, created_by=admin.id)
        db.add(c)
        camp_objs.append(c)

    db.flush()

    # ── Applications ──
    applications = [
        (camp_objs[0].id, inf_users[0].id, "pass"),
        (camp_objs[0].id, inf_users[4].id, "pass"),
        (camp_objs[1].id, inf_users[1].id, "pass"),
        (camp_objs[2].id, inf_users[2].id, "pending"),
        (camp_objs[3].id, inf_users[3].id, "pending"),
        (camp_objs[4].id, inf_users[0].id, "pass"),
        (camp_objs[4].id, inf_users[3].id, "pass"),
    ]
    for cid, iid, verdict in applications:
        db.add(Application(campaign_id=cid, influencer_id=iid, verdict=verdict))

    # ── Conversations & Messages ──
    conv1 = Conversation(campaign_id=camp_objs[0].id)
    db.add(conv1)
    db.flush()
    db.add(ConversationParticipant(conversation_id=conv1.id, user_id=admin.id, unread_count=1))
    db.add(ConversationParticipant(conversation_id=conv1.id, user_id=inf_users[0].id, unread_count=0))
    msgs = [
        (inf_users[0].id, "こんにちは！今回のキャンペーンをお受けします。商品はいつ頃届きますか？"),
        (admin.id, "ご参加ありがとうございます！7/8〜10の間に発送予定です。"),
        (inf_users[0].id, "承知しました！撮影を始めます。ハッシュタグはどれを入れれば良いでしょうか？"),
        (admin.id, "#BeautyBrand #夏コスメ2025 の2つは必須でお願いします。"),
        (inf_users[0].id, "修正しました！ご確認よろしくお願いします。"),
    ]
    for sender_id, text in msgs:
        db.add(Message(conversation_id=conv1.id, sender_id=sender_id, text=text))

    # ── Announcements ──
    db.add(Announcement(
        created_by=admin.id,
        title="プラットフォームリニューアルのお知らせ",
        body="2025年8月よりプラットフォームのUIが新しくなります。",
        category="お知らせ",
    ))
    db.add(Announcement(
        created_by=admin.id,
        title="メンテナンスのお知らせ",
        body="8/15 02:00〜06:00 の間、メンテナンスを実施いたします。",
        category="重要",
    ))

    db.commit()
    db.close()
    print("Seed completed!")


if __name__ == "__main__":
    seed()
