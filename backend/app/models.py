from sqlalchemy import (
    Column, Integer, String, Text, Boolean, Date, DateTime, DECIMAL, ARRAY,
    ForeignKey, UniqueConstraint, CheckConstraint, Index, func
)
from sqlalchemy.orm import relationship
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False)
    name = Column(String(100), nullable=False)
    photo_url = Column(Text)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    __table_args__ = (
        CheckConstraint("role IN ('admin', 'influencer')", name="ck_users_role"),
        Index("idx_users_role", "role"),
    )

    influencer_profile = relationship("InfluencerProfile", back_populates="user", uselist=False)
    notifications = relationship("Notification", back_populates="user")
    conversation_participations = relationship("ConversationParticipant", back_populates="user")


class InfluencerProfile(Base):
    __tablename__ = "influencer_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    handle = Column(String(100))
    platform = Column(String(20))
    followers = Column(Integer, default=0)
    engagement_rate = Column(DECIMAL(4, 1))
    bio = Column(Text)
    genres = Column(ARRAY(Text))
    price_range = Column(String(50))
    status = Column(String(20), default="空き有り")
    admin_memo = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    __table_args__ = (
        Index("idx_inf_profiles_platform", "platform"),
        Index("idx_inf_profiles_status", "status"),
    )

    user = relationship("User", back_populates="influencer_profile")


class Campaign(Base):
    __tablename__ = "campaigns"

    id = Column(Integer, primary_key=True, index=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    status = Column(String(20), default="募集中")
    category = Column(String(50))
    area = Column(String(50))
    country = Column(String(50))
    platform = Column(String(20))
    reward_style = Column(String(10))
    min_budget = Column(Integer, default=0)
    max_budget = Column(Integer, default=0)
    publish_start = Column(Date)
    publish_end = Column(Date)
    start_date = Column(Date)
    end_date = Column(Date)
    headcount = Column(String(20))
    max_slots = Column(Integer)  # 採用定員数（整数）：定員到達で進行中に自動遷移
    min_followers = Column(String(30))
    required_skills = Column(ARRAY(Text))
    required_languages = Column(ARRAY(Text))
    video_url = Column(Text)
    image_gradient = Column(String(100))
    client_name = Column(String(255))
    client_address = Column(String(255))
    client_website = Column(String(255))
    client_business_description = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    __table_args__ = (
        CheckConstraint("status IN ('募集中', '進行中', '完了')", name="ck_campaigns_status"),
        CheckConstraint("reward_style IN ('gifting', 'paid')", name="ck_campaigns_reward"),
        Index("idx_campaigns_status", "status"),
        Index("idx_campaigns_category", "category"),
        Index("idx_campaigns_platform", "platform"),
        Index("idx_campaigns_created_at", "created_at"),
    )

    creator = relationship("User")
    media = relationship("CampaignMedia", back_populates="campaign", cascade="all, delete-orphan")
    applications = relationship("Application", back_populates="campaign", cascade="all, delete-orphan")


class CampaignMedia(Base):
    __tablename__ = "campaign_media"

    id = Column(Integer, primary_key=True, index=True)
    campaign_id = Column(Integer, ForeignKey("campaigns.id", ondelete="CASCADE"), nullable=False)
    file_url = Column(Text, nullable=False)
    file_name = Column(String(255))
    file_type = Column(String(50))
    file_size = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        Index("idx_campaign_media_campaign", "campaign_id"),
    )

    campaign = relationship("Campaign", back_populates="media")


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    campaign_id = Column(Integer, ForeignKey("campaigns.id", ondelete="CASCADE"), nullable=False)
    influencer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    comment = Column(Text)
    verdict = Column(String(10), default="pending")
    applied_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    __table_args__ = (
        UniqueConstraint("campaign_id", "influencer_id", name="uq_application_campaign_influencer"),
        CheckConstraint("verdict IN ('pending', 'pass', 'fail')", name="ck_applications_verdict"),
        Index("idx_applications_campaign", "campaign_id"),
        Index("idx_applications_influencer", "influencer_id"),
        Index("idx_applications_verdict", "verdict"),
    )

    campaign = relationship("Campaign", back_populates="applications")
    influencer = relationship("User")


class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(Integer, primary_key=True, index=True)
    campaign_id = Column(Integer, ForeignKey("campaigns.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    campaign = relationship("Campaign")
    participants = relationship("ConversationParticipant", back_populates="conversation", cascade="all, delete-orphan")
    messages = relationship("Message", back_populates="conversation", cascade="all, delete-orphan")


class ConversationParticipant(Base):
    __tablename__ = "conversation_participants"

    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(Integer, ForeignKey("conversations.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    unread_count = Column(Integer, default=0)

    __table_args__ = (
        UniqueConstraint("conversation_id", "user_id", name="uq_conv_participant"),
        Index("idx_conv_part_user", "user_id"),
    )

    conversation = relationship("Conversation", back_populates="participants")
    user = relationship("User", back_populates="conversation_participations")


class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(Integer, ForeignKey("conversations.id", ondelete="CASCADE"), nullable=False)
    sender_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    text = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        Index("idx_messages_conversation", "conversation_id", "created_at"),
    )

    conversation = relationship("Conversation", back_populates="messages")
    sender = relationship("User")


class Announcement(Base):
    __tablename__ = "announcements"

    id = Column(Integer, primary_key=True, index=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False)
    body = Column(Text, nullable=False)
    category = Column(String(20), default="お知らせ")
    target = Column(String(20), default="all")
    publish_at = Column(DateTime(timezone=True))
    expire_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    __table_args__ = (
        Index("idx_announcements_created", "created_at"),
    )

    creator = relationship("User")


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(Text, nullable=False)
    body = Column(Text)
    type = Column(String(30))
    reference_id = Column(Integer)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        Index("idx_notifications_user", "user_id", "is_read", "created_at"),
    )

    user = relationship("User", back_populates="notifications")


class InfluencerRating(Base):
    __tablename__ = "influencer_ratings"

    id = Column(Integer, primary_key=True, index=True)
    influencer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    rated_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    rating = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    __table_args__ = (
        UniqueConstraint("influencer_id", "rated_by", name="uq_rating_influencer_rater"),
        CheckConstraint("rating BETWEEN 1 AND 5", name="ck_ratings_range"),
        Index("idx_ratings_influencer", "influencer_id"),
    )

    influencer = relationship("User", foreign_keys=[influencer_id])
    rater = relationship("User", foreign_keys=[rated_by])
