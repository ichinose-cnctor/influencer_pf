from datetime import datetime, date
from typing import Optional
from pydantic import BaseModel, EmailStr


# ──── Auth ────
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    name: str
    role: str = "influencer"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UserOut(BaseModel):
    id: int
    email: str
    name: str
    role: str
    photo_url: Optional[str] = None
    created_at: datetime
    model_config = {"from_attributes": True}

class UserUpdate(BaseModel):
    name: Optional[str] = None
    photo_url: Optional[str] = None


# ──── InfluencerProfile ────
class InfluencerProfileOut(BaseModel):
    id: int
    user_id: int
    handle: Optional[str] = None
    platform: Optional[str] = None
    followers: int = 0
    engagement_rate: Optional[float] = None
    bio: Optional[str] = None
    genres: Optional[list[str]] = None
    price_range: Optional[str] = None
    status: str = "空き有り"
    admin_memo: Optional[str] = None
    model_config = {"from_attributes": True}

class InfluencerOut(BaseModel):
    id: int
    email: str
    name: str
    photo_url: Optional[str] = None
    created_at: datetime
    profile: Optional[InfluencerProfileOut] = None
    rating_avg: Optional[float] = None
    campaign_count: int = 0
    model_config = {"from_attributes": True}

class InfluencerProfileUpdate(BaseModel):
    handle: Optional[str] = None
    platform: Optional[str] = None
    followers: Optional[int] = None
    engagement_rate: Optional[float] = None
    bio: Optional[str] = None
    genres: Optional[list[str]] = None
    price_range: Optional[str] = None
    status: Optional[str] = None

class RatingUpdate(BaseModel):
    rating: int

class MemoUpdate(BaseModel):
    memo: str


# ──── Campaign ────
class CampaignCreate(BaseModel):
    title: str
    description: Optional[str] = None
    category: Optional[str] = None
    area: Optional[str] = None
    country: Optional[str] = None
    platform: Optional[str] = None
    reward_style: Optional[str] = None
    min_budget: int = 0
    max_budget: int = 0
    publish_start: Optional[date] = None
    publish_end: Optional[date] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    headcount: Optional[str] = None
    max_slots: Optional[int] = None
    min_followers: Optional[str] = None
    required_skills: Optional[list[str]] = None
    required_languages: Optional[list[str]] = None
    video_url: Optional[str] = None
    image_gradient: Optional[str] = None
    client_name: Optional[str] = None
    client_address: Optional[str] = None
    client_website: Optional[str] = None
    client_business_description: Optional[str] = None

class CampaignUpdate(CampaignCreate):
    pass

class CampaignStatusUpdate(BaseModel):
    status: str

class CampaignOut(BaseModel):
    id: int
    created_by: int
    title: str
    description: Optional[str] = None
    status: str
    category: Optional[str] = None
    area: Optional[str] = None
    country: Optional[str] = None
    platform: Optional[str] = None
    reward_style: Optional[str] = None
    min_budget: int = 0
    max_budget: int = 0
    publish_start: Optional[date] = None
    publish_end: Optional[date] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    headcount: Optional[str] = None
    max_slots: Optional[int] = None
    min_followers: Optional[str] = None
    required_skills: Optional[list[str]] = None
    required_languages: Optional[list[str]] = None
    video_url: Optional[str] = None
    image_gradient: Optional[str] = None
    client_name: Optional[str] = None
    client_address: Optional[str] = None
    client_website: Optional[str] = None
    client_business_description: Optional[str] = None
    applicant_count: int = 0
    created_at: datetime
    updated_at: datetime
    model_config = {"from_attributes": True}


# ──── Application ────
class ApplicationCreate(BaseModel):
    comment: Optional[str] = None

class ApplicationVerdictUpdate(BaseModel):
    verdict: str  # pass / fail / pending

class ApplicationOut(BaseModel):
    id: int
    campaign_id: int
    influencer_id: int
    comment: Optional[str] = None
    verdict: str
    applied_at: datetime
    influencer: Optional[InfluencerOut] = None
    model_config = {"from_attributes": True}


# ──── Message ────
class MessageCreate(BaseModel):
    text: str

class MessageOut(BaseModel):
    id: int
    conversation_id: int
    sender_id: int
    text: str
    is_read: bool
    created_at: datetime
    model_config = {"from_attributes": True}

class ConversationCreate(BaseModel):
    participant_id: int
    campaign_id: Optional[int] = None
    initial_message: Optional[str] = None

class ConversationOut(BaseModel):
    id: int
    campaign_id: Optional[int] = None
    created_at: datetime
    updated_at: datetime
    other_user: Optional[UserOut] = None
    last_message: Optional[str] = None
    last_time: Optional[datetime] = None
    unread_count: int = 0
    model_config = {"from_attributes": True}


# ──── Announcement ────
class AnnouncementCreate(BaseModel):
    title: str
    body: str
    category: str = "お知らせ"
    target: str = "all"
    publish_at: Optional[datetime] = None
    expire_at: Optional[datetime] = None

class AnnouncementUpdate(AnnouncementCreate):
    pass

class AnnouncementOut(BaseModel):
    id: int
    created_by: int
    title: str
    body: str
    category: str
    target: str
    publish_at: Optional[datetime] = None
    expire_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    model_config = {"from_attributes": True}


# ──── Notification ────
class NotificationOut(BaseModel):
    id: int
    title: str
    body: Optional[str] = None
    type: Optional[str] = None
    reference_id: Optional[int] = None
    is_read: bool
    created_at: datetime
    model_config = {"from_attributes": True}


# ──── Dashboard ────
class DashboardStats(BaseModel):
    total_influencers: int
    recruiting_campaigns: int
    active_campaigns: int
    completed_campaigns: int
    new_influencers_this_month: int = 0


# ──── Pagination ────
class PaginatedResponse(BaseModel):
    items: list
    total: int
    page: int
    per_page: int
    total_pages: int
